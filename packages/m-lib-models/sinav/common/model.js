M.C.setUpCollection({
  object: 'Sinavlar',
  collection: 'sinavlar',
  schema: {
    kurum: {
      label: 'Kurum',
      type: String,
      index: 1,
      custom: function() {
        var kurum = this;
        var userRole = M.C.Users.findOne({_id: this.userId}).role;
        var userKurum = M.C.Users.findOne({_id: this.userId}).kurum;
        var kurumlar = M.C.Kurumlar.find().map(function(kurum) {return kurum._id;});
        if (kurum.isSet && !_.contains(kurumlar,kurum.value)) {
          return 'notAllowed';
        }
        if (kurum.isSet && userRole !== 'mitolojix' && kurum.value !== userKurum) {
          return 'yetkiYok';
        }
        return true;
      },
      autoValue: function() {
        var kurum = this;
        var user = M.C.Users.findOne({_id: this.userId});
        if (user && user.role !== 'mitolojix') {
          if (kurum.isInsert) {
            return user.kurum;
          }
          if (kurum.isUpdate && kurum.isSet) {
            return user.kurum;
          }
          if (kurum.isUpdate && !kurum.isSet) {
            return kurum.unset();
          }
        }
      },
      autoform: {
        type: function() {
          if (Meteor.user() && Meteor.user().role !== 'mitolojix') {
            return 'hidden';
          } else {
            var formId = AutoForm.getFormId();
            var sorular = AutoForm.getFieldValue('sorular', formId);
            return (sorular && sorular.length > 0) ? 'selectDisabled' : 'select';
          }
        },
        class: 'browser-default',
        firstOption: 'Kurum seçin',
        options: function() {
          var kurumlar = [];
          if (Meteor.user().role === 'mitolojix') {
            kurumlar = M.C.Kurumlar.find({}, {sort: {isimCollate: 1}}).map(function(kurum) {return {label: kurum.isim, value: kurum._id};});
          } else {
            var userKurum = M.C.Kurumlar.findOne({_id: Meteor.user().kurum});
            kurumlar.push({label: userKurum.isim, value: userKurum._id});
          }
          return kurumlar;
        }
      }
    },
    kod: {
      label: 'Kod',
      type: String,
      index: 1,
      autoValue: function() {
        if (this.isInsert) {
          if (Meteor.isServer) {
            var kurum = this.field('kurum');
            var isim = kurum && M.C.Kurumlar.findOne({_id: kurum.value}).isim;
            var words = isim && _.first(s.words(isim),2);
            var initials = 'MT';

            if (words && words.length === 1) {
              initials = words[0].substring(0,2).toLocaleUpperCase()
            }

            if (words && words.length === 2) {
              initials = words[0].substring(0,1) + words[1].substring(0,1) + 'S'
            }

            var count = M.C.Sinavlar.find().count() + 1;
            count = s.pad(count,5,'0');

            var kod = initials + count;

            return kod;

          } else {
            return new Date().getTime().toString();
          }
        } else {
          this.unset();
        }
      },
      autoform: {
        type: 'hidden'
      }
    },
    iptal: {
      type: Boolean,
      autoValue: function() {
        if (this.isInsert) {
          return false;
        } else if (this.isUpdate && this.isSet) {
          return true;
        } else if (this.isUpdate && !this.isSet) {
          this.unset();
        }
      },
      autoform: {
        omit: true
      }
    },
    egitimYili: {
      label: 'Eğitim Yılı',
      type: String,
      index: 1,
      autoValue: function() {
        if (this.isInsert) {
          var aktifEgitimYili = M.C.AktifEgitimYili.findOne();
          return aktifEgitimYili && aktifEgitimYili.egitimYili;
        }
      },
      denyUpdate: true,
      autoform: {
        omit: true
      }
    },
    ders: {
      label: 'Ders',
      type: String,
      index: 1,
      custom: function() {
        var ders = this;
        var kurum = this.field('kurum');
        var egitimYili = this.field('egitimYili');
        var sinif = this.field('sinif');
        var tumu = M.C.Dersler.find().map(function(ders) {return ders._id;});
        if (ders.isSet && !_.contains(tumu,ders.value)) {
          return 'notAllowed';
        }
        if (ders.isInsert && ders.isSet && kurum.isSet && egitimYili.isSet && sinif.isSet) {
          var kullanilanMuhurAdedi = M.C.Sinavlar.find({
            $or: [
              {
                $and:[
                  {kurum: kurum.value},
                  {egitimYili: egitimYili.value},
                  {ders: ders.value},
                  {sinif: sinif.value},
                  {muhur: {$exists: true}}
                ]
              },
              {
                $and:[
                  {kurum: kurum.value},
                  {egitimYili: egitimYili.value},
                  {ders: ders.value},
                  {sinif: sinif.value},
                  {muhur: {$exists: false}},
                  {iptal: false}
                ]
              }
            ]
          }).count();
          var mevcutMuhurAdedi = M.C.Muhurler.find({
            aktif: true,
            ders: ders.value
          }).count();
          if (kullanilanMuhurAdedi >= mevcutMuhurAdedi) {
            return 'muhurTukendi';
          }
        }
        return true;
      },
      autoform: {
        class: 'browser-default',
        firstOption: 'Ders seçin',
        type: function() {
          var formId = AutoForm.getFormId();
          var sorular = AutoForm.getFieldValue('sorular', formId);
          return (sorular && sorular.length > 0) ? 'selectDisabled' : 'select';
        },
        options: function() {
          var user = M.C.Users.findOne({_id: Meteor.userId()});
          var olasiDersler = [];
          if (user.role === 'ogretmen') {
            olasiDersler = user.dersleri;
          } else {
            olasiDersler = M.C.Dersler.find().map(function(ders) {return ders._id;});
          }
          var options = [];
          if (olasiDersler.length > 0) {
            options = M.C.Dersler.find({_id: {$in: olasiDersler}}).map(function(ders) {
              return {
                value: ders._id,
                label: ders.isim
              };
            });
          }
          return options;
        }
      }
    },
    aciklama: {
      label: 'Açıklama',
      type: String,
      max: 256,
      optional: true,
      autoValue: function() {
        if (this.isSet) {
          return M.L.Trim(this.value);
        } else {
          this.unset();
        }
      }
    },
    muhur: {
      type: String,
      optional: true,
      denyInsert: true,
      index: 1,
      sparse: true,
      custom: function() {
        if (this.isSet) {
          var muhur = M.C.Muhurler.findOne({_id: this.value});
          if (!muhur) {
            return 'notAllowed';
          }
        }
      },
      autoform: {
        omit: true
      }
    },
    sinif: {
      label: 'Sınıf',
      type: String,
      index: 1,
      custom: function() {
        var sinif = this;
        if (sinif.isSet && !_.contains(M.E.Sinif, sinif.value)) {
          return 'notAllowed';
        }
        return true;
      },
      autoform: {
        class: 'browser-default',
        firstOption: 'Sınıf seçin',
        type: function() {
          var formId = AutoForm.getFormId();
          var sorular = AutoForm.getFieldValue('sorular', formId);
          return (sorular && sorular.length > 0) ? 'selectDisabled' : 'select';
        },
        options: function(){
          return _.map(M.E.Sinif, function(sinif) {return {label: M.L.enumLabel(sinif), value: sinif};});
        }
      }
    },
    subeler: {
      label: 'Şubeler',
      type: [String],
      index: 1,
      minCount: 1,
      custom: function() {
        var subeler = this.value;
        if (_.uniq(subeler).length !== subeler.length) {
          return 'notUnique';
        }
        return true;
      },
      autoform: {
        type: 'select-checkbox-inline',
        options: function() {
          return _.map(M.E.Sube, function(sube) {return {label: sube, value: sube}; })
        }
      }
    },
    'subeler.$': {
      label: 'Şube',
      type: String
    },
    acilisTarihi: {
      label: 'Test Açılış Tarihi',
      type: Date,
      index: -1,
      autoform: {
        type: 'pickadate',
        pickadateOptions: function() {
          return _.extend(
            M.E.PickadateOptions,
            {min: moment.tz(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()),'Europe/Istanbul').toDate()},
            {max: moment.tz(new Date(new Date().getFullYear() + 1,new Date().getMonth(),new Date().getDate()),'Europe/Istanbul').toDate()}
          );
        }
      }
    },
    acilisSaati: {
      label: 'T. A. Saati',
      type: String,
      min: 5,
      max: 5,
      index: 1,
      custom: function() {
        var saat = this;
        var tarih = this.field('acilisTarihi');
        if (saat.isSet) {
          if (!M.L.TestSaat(saat.value)) {
            return 'notAllowed';
          } else if ( tarih.isSet ) {
            return moment(tarih.value).hour(saat.value.split(':')[0]).minute(saat.value.split(':')[1]).isAfter(moment()) ? true : 'acilisSonraOlmali';
          } else {
            return true;
          }
        }
      },
      autoform: {
        class: 'saat',
        type: function() {
          $('.saat').clockpicker(M.E.ClockPickerOptions);
          return 'text';
        }
      }
    },
    acilisZamani: {
      type: Date,
      index: -1,
      autoValue: function() {
        var tarih = this.field('acilisTarihi');
        var saat = this.field('acilisSaati');
        if (tarih.isSet && saat.isSet) {
          return moment(tarih.value).hour(saat.value.split(':')[0]).minute(saat.value.split(':')[1]).toDate();
        }
      },
      autoform: {
        omit: true
      }
    },
    kapanisTarihi: {
      label: 'Test Kapanış Tarihi',
      type: Date,
      index: -1,
      custom: function() {
        var acilis = this.field('acilisTarihi');
        var kapanis = this;
        if (acilis.isSet && kapanis.isSet) {
          return moment(kapanis.value).isBefore(moment(acilis.value)) ? 'kapanisSonraOlmali' : true;
        }
      },
      autoform: {
        type: 'pickadate',
        pickadateOptions: function() {
          return _.extend(
            M.E.PickadateOptions,
            {min: moment.tz(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()),'Europe/Istanbul').toDate()},
            {max: moment.tz(new Date(new Date().getFullYear() + 1,new Date().getMonth(),new Date().getDate()),'Europe/Istanbul').toDate()}
          );
        }
      }
    },
    kapanisSaati: {
      label: 'T. K. Saati',
      type: String,
      min: 5,
      max: 5,
      index: 1,
      custom: function() {
        var saat = this;
        var acilisSaat = this.field('acilisSaati');
        var acilis = this.field('acilisTarihi');
        var kapanis = this.field('kapanisTarihi');
        if (saat.isSet) {
          if (!M.L.TestSaat(saat.value)) {
            return 'notAllowed';
          } else if ( acilisSaat.isSet && acilis.isSet && kapanis.isSet && acilis.value.getTime() === kapanis.value.getTime() ) {
            return moment(acilisSaat.value,'HH:mm').isBefore(moment(saat.value,'HH:mm')) ? true : 'kapanisSonraOlmali';
          } else {
            return true;
          }
        }
      },
      autoform: {
        class: 'saat',
        type: function() {
          $('.saat').clockpicker(M.E.ClockPickerOptions);
          return 'text';
        }
      }
    },
    kapanisZamani: {
      type: Date,
      index: -1,
      autoValue: function() {
        var tarih = this.field('kapanisTarihi');
        var saat = this.field('kapanisSaati');
        if (tarih.isSet && saat.isSet) {
          return moment(tarih.value).hour(saat.value.split(':')[0]).minute(saat.value.split(':')[1]).toDate();
        }
      },
      autoform: {
        omit: true
      }
    },
    tip: {
      label: 'Sınav Tipi',
      type: String,
      allowedValues: M.E.SinavTipi,
      index: 1,
      autoform: {
        class: 'browser-default',
        firstOption: 'Test tipi seçin',
        options: function() {
          var options = _.map(M.E.SinavTipiObjects, function(t) {
            return {
              label: t.label, value: t.name
            };
          });
          return options;
        }
      }
    },
    sure: {
      label: 'T. Süresi (dk)',
      type: Number,
      min: 5,
      max: 180,
      custom: function() {
        var sure = this;
        if (sure.isSet) {

          var acilisTarihi = this.field('acilisTarihi');
          var acilisSaati = this.field('acilisSaati');

          var kapanisTarihi = this.field('kapanisTarihi');
          var kapanisSaati = this.field('kapanisSaati');

          if (acilisTarihi.isSet && acilisSaati.isSet && kapanisTarihi.isSet && kapanisSaati.isSet) {
            var acilisZamani = moment(acilisTarihi.value).hour(acilisSaati.value.split(':')[0]).minute(acilisSaati.value.split(':')[1]);
            var kapanisZamani = moment(kapanisTarihi.value).hour(kapanisSaati.value.split(':')[0]).minute(kapanisSaati.value.split(':')[1]);
            if (kapanisZamani.isBefore(acilisZamani.add(parseInt(sure.value), 'minutes'))) {
              return 'sureIcinZamanYok';
            }
          }
        }
      }
    },
    canliStatus: {
      type: String,
      optional: true,
      index: 1,
      custom: function() {
        var tip = this.field('tip');
        var canliStatus = this;
        var sinavId = this.docId;
        if (tip.value === 'canli' && !canliStatus.isInsert) {
          var eskiStatus = M.C.Sinavlar.findOne({_id: sinavId}).canliStatus;
          if (!_.contains(['running','paused','completed'], canliStatus.value) || eskiStatus === 'completed') {
            return 'notAllowed';
          }
        }
      },
      autoValue: function() {
        var tip = this.field('tip');
        var canliStatus = this;
        if (tip.isSet && tip.value === 'canli') {
          if (canliStatus.isInsert) {
            return 'pending';
          } else {
            return canliStatus.value;
          }
        }
        if (tip.isSet && tip.value !== 'canli') {
          canliStatus.unset()
        }
      },
      autoform: {
        omit: true
      }
    },
    yanitlarAcilmaTarihi: {
      label: 'Yanıt Anahtarı Açılma Tarihi',
      type: Date,
      index: -1,
      optional: true,
      custom: function() {
        var tip = this.field('tip');
        var self = this;
        if (tip.isSet && _.contains(['deneme','canli'], tip.value)) {
          if (!self.isSet) {
            return 'required';
          } else {
            var kapanis = this.field('kapanisTarihi');
            var yanitlar = this;
            if (kapanis.isSet && yanitlar.isSet) {
              return moment(yanitlar.value).isBefore(moment(kapanis.value)) ? 'yanitlarSonraOlmali' : true;
            }
            return true;
          }
        } else {
          return true;
        }
      },
      autoValue: function() {
        var tip = this.field('tip');
        var self = this;
        if (tip.isSet && _.contains(['deneme','canli'], tip.value) && self.isSet) {
          return moment.tz(new Date(self.value.getFullYear(),self.value.getMonth(),self.value.getDate()),'Europe/Istanbul').toDate();
        } else {
          return self.unset();
        }
      },
      autoform: {
        class: 'optionalDatePicker',
        type: function() {
          var formId = AutoForm.getFormId();
          var tip = AutoForm.getFieldValue('tip', formId);
          if (_.contains(['deneme','canli'], tip)) {
            $('.optionalDatePicker').parent().parent().show();
          } else {
            $('.optionalDatePicker').parent().parent().hide();
          }
          return 'pickadate';
        },
        pickadateOptions: function() {
          return _.extend(
            M.E.PickadateOptions,
            {min: moment.tz(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()),'Europe/Istanbul').toDate()},
            {max: moment.tz(new Date(new Date().getFullYear() + 1,new Date().getMonth(),new Date().getDate()),'Europe/Istanbul').toDate()}
          );
        }
      }
    },
    yanitlarAcilmaSaati: {
      label: 'Y. A. Saati',
      type: String,
      min: 5,
      max: 5,
      index: 1,
      optional: true,
      custom: function() {
        var saat = this;
        var kapanisSaat = this.field('kapanisSaati');
        var kapanisTarihi = this.field('kapanisTarihi');
        var yanitlarAcilmaTarihi = this.field('yanitlarAcilmaTarihi');
        if (saat.isSet) {
          if (!M.L.TestSaat(saat.value)) {
            return 'notAllowed';
          } else if ( kapanisSaat.isSet && kapanisTarihi.isSet && yanitlarAcilmaTarihi.isSet && kapanisTarihi.value.getTime() === yanitlarAcilmaTarihi.value.getTime() ) {
            return moment(kapanisSaat.value,'HH:mm').isBefore(moment(saat.value,'HH:mm')) ? true : 'yanitlarSonraOlmali';
          } else {
            return true;
          }
        }
      },
      autoValue: function() {
        var tip = this.field('tip');
        var self = this;
        if (tip.isSet && _.contains(['deneme','canli'], tip.value) && self.isSet) {
          return self.value;
        } else {
          return self.unset();
        }
      },
      autoform: {
        class: 'optionalSaat',
        type: function() {
          var formId = AutoForm.getFormId();
          var tip = AutoForm.getFieldValue('tip', formId);
          if (_.contains(['deneme','canli'], tip)) {
            $('.optionalSaat').parent().parent().show();
          } else {
            $('.optionalSaat').parent().parent().hide();
          }
          $('.optionalSaat').clockpicker(M.E.ClockPickerOptions);
          return 'text';
        }
      }
    },
    yanitlarAcilmaZamani: {
      type: Date,
      index: -1,
      optional: true,
      autoValue: function() {
        var tarih = this.field('yanitlarAcilmaTarihi');
        var saat = this.field('yanitlarAcilmaSaati');
        if (tarih.isSet && saat.isSet) {
          return moment(tarih.value).hour(saat.value.split(':')[0]).minute(saat.value.split(':')[1]).toDate();
        } else if (this.isSet) {
          this.unset();
        }
      },
      autoform: {
        omit: true
      }
    },
    soruZDGuncellemesiYapilmaZamani: {
      type: Date,
      index: -1,
      optional: true,
      denyInsert: true,
      autoform: {
        omit: true
      }
    },
    sinavKagitlariKapanmaZamani: {
      type: Date,
      index: -1,
      optional: true,
      denyInsert: true,
      autoform: {
        omit: true
      }
    },
    sorularKarissin: {
      label: 'Soru Sırası Karışsın',
      type: Boolean,
      defaultValue: true
    },
    sorular: {
      type: [Object],
      optional: true,
      autoValue: function() {
        var cloned = this.field('_clonedFrom').isSet;
        if (this.isInsert && !cloned) {
          return [];
        }
      },
      custom: function() {
        var soru = this;
        var kurum = this.field('kurum');
        var egitimYili = this.field('egitimYili');
        var sinif = this.field('sinif');
        var cloned = this.field('_clonedFrom').isSet;
        var ders = this.field('ders');
        // TODO: soru validasyonunu kontrol et!
        if (soru.isInsert && soru.isSet && soru.value.length > 0) {
          if (cloned) {
            return true;
          }
          return 'notAllowed';
        }
        if (!kurum.isSet || !ders.isSet || !sinif.isSet) {
          return 'notAllowed';
        } else {
          if (soru.isUpdate && soru.isSet ) {
            if (soru.value.length === 0) {
              return true;
            } else {
              if (Meteor.isServer) {
                var uygunluk = Meteor.call('sorularSinavaUygunMu', _.pluck(soru.value, 'soruId'),kurum.value, M.C.Sinavlar.findOne({_id:soru.docId}).egitimYili,ders.value,sinif.value);
                return uygunluk === 'uygun' ? true : 'notAllowed';
              } else {
                return true;
              }
            }
          } else {
            return true;
          }
        }
      },
      autoform: {
        type: 'hidden'
      }
    },
    'sorular.$.soruId': {
      type: String,
      autoform: {
        type: 'hidden'
      }
    },
    'sorular.$.zorlukDerecesi': {
      type: Number,
      autoform: {
        type: 'hidden'
      }
    },
    'sorular.$.puan': {
      type: Number,
      autoform: {
        type: 'hidden'
      }
    },
    taslak: {
      label: 'Taslak',
      type: Boolean,
      index: 1,
      defaultValue: true,
      custom: function() {
        if (this.isUpdate && this.isSet && this.value === false) {
          var sorular = this.field('sorular');
          if (sorular.value && sorular.value.length < 1) {
            return 'sorusuzSinavTaslakKalmali';
          }
        }
      },
      autoform: {
        omit: true
      }
    },
    kilitli: {
      label: 'Kilitli',
      type: Boolean,
      index: 1,
      defaultValue: false,
      custom: function() {
        var taslak = this.field('taslak');
        var sinavId = this.docId;
        var kilitli = this;
        if (taslak.isSet && taslak.value === true && kilitli.isSet && kilitli.value === true) {
          return 'taslakSinavKilitlenemez';
        }
        if (this.isSet && this.value === true) {
          var sorular = M.C.Sinavlar.findOne({_id: sinavId}).sorular;
          if (!sorular || (sorular.length < 1)) {
            return 'sorusuzSinavKilitsizKalmali';
          }
        }
      },
      autoform: {
        omit: true
      }
    }
  },
  permissions: {
    insert: 'mitolojix',
    update: 'mitolojix'
  },
  //TODO: this should be a PARTIAL index, not sparse, but partial is supported on Mongodb3.2 which is not supported by Meteor yet!
  /*indexes: [
    {ix: {kurum: 1, egitimYili: 1, sinif:1, muhur: 1}, opt: { unique: true, sparse: true }}
  ],*/
  cloneable: true
});

M.C.Sinavlar.before.update(function (userId, doc, fields, modifier, options) {
  var tip = modifier.$set && modifier.$set.tip;

  if (tip && !_.contains(['deneme','canli'], tip)) {
    delete modifier.$set.yanitlarAcilmaTarihi;
    delete modifier.$set.yanitlarAcilmaSaati;
    delete modifier.$set.yanitlarAcilmaZamani;
    modifier.$unset = modifier.$unset || {};
    modifier.$unset = _.extend(modifier.$unset, {yanitlarAcilmaTarihi: ''});
    modifier.$unset = _.extend(modifier.$unset, {yanitlarAcilmaSaati: ''});
    modifier.$unset = _.extend(modifier.$unset, {yanitlarAcilmaZamani: ''});
  }

  if (tip && tip !== 'canli') {
    delete modifier.$set.canliStatus;
    modifier.$unset = modifier.$unset || {};
    modifier.$unset = _.extend(modifier.$unset, {canliStatus: ''});
  }

});

if (Meteor.isServer) {
  M.C.Sinavlar.permit('insert').ifLoggedIn().userHasRole('teknik').userInDocKurum().allowInClientCode();
  M.C.Sinavlar.permit('insert').ifLoggedIn().userHasRole('ogretmen').userInDocKurum().allowInClientCode(); // TODO: Must have access to sinav

  M.C.Sinavlar.permit('update').ifLoggedIn().userHasRole('teknik').userInDocKurum().allowInClientCode();
  M.C.Sinavlar.permit('update').ifLoggedIn().userHasRole('ogretmen').userInDocKurum().allowInClientCode(); // TODO: Must have access to sinav
}

// TODO: bu gibi isClient ve daha ziyade isServer bloklarini temizle ve ait olduklari yerlere al
if (Meteor.isServer) {
  Meteor.methods({
    'soruSiraDegistir': function(sinavId,soruId,yon) {
      check(sinavId, String);
      check(soruId, String);
      check(yon, String);

      var sinav = M.C.Sinavlar.findOne({_id: sinavId});
      if (!sinav) {
        M.L.ThrowError({error:'404',reason:'Sınav bulunamadı',details:'Sınav bulunamadı'});
      }

      var from = _.indexOf(_.pluck(sinav.sorular, 'soruId'), soruId);
      if (from < 0) {
        M.L.ThrowError({error:'404',reason:'Soru sınavda bulunamadı',details:'Soru sınavda bulunamadı'});
      }

      if (!_.contains(['asagi','yukari'], yon)) {
        M.L.ThrowError({error:'403',reason:'Geçersiz yön',details:'Geçersiz yön'});
      }

      var to = yon === 'asagi' ? from+1 : from-1;

      var sorular = sinav.sorular;

      var temp = sorular[to];
      sorular[to] = sorular[from];
      sorular[from] = temp;

      var sonuc = M.C.Sinavlar.update({_id: sinav._id}, {$set: {
        kurum: sinav.kurum,
        ders: sinav.ders,
        sinif: sinav.sinif,
        sorular: sorular
      }});

      return sonuc;

    },
    'sepetiSinavaEkle': function(sinavId) {
      check(sinavId, String);
      var sinav = M.C.Sinavlar.findOne({_id: sinavId});
      var uygunSorular = Meteor.call('sinavaUygunSorular',sinav.kurum,sinav.egitimYili,sinav.ders,sinav.sinif);
      var sepetSoruIdArray = uygunSorular && M.C.SoruSepetleri.find({createdBy: this.userId, soru: {$in: _.difference(uygunSorular, _.pluck(sinav.sorular, 'soruId'))}}, {sort: {createdAt: 1}}).map(function(sepet) {return sepet.soru;});
      if (!sepetSoruIdArray || sepetSoruIdArray.length === 0) {
        M.L.ThrowError({error:'404',reason:'Soru bulunamadı',details:'Sepette sınava uygun soru bulunamadı'});
      }
      var soruIdleri = M.C.Sorular.find({_id: {$in: sepetSoruIdArray}}).map(function(soru) {
        return soru._id;
      });
      Meteor.call('sinavaSoruEkleCikar',sinavId,soruIdleri,'ekle');
      return 'ok';
    },
    'sinavdakiSorulariBosalt': function(sinavId) {
      check(sinavId, String);
      var sinav = M.C.Sinavlar.findOne({_id: sinavId});
      var soruIdleri = M.C.Sorular.find({_id: {$in: _.pluck(sinav.sorular, 'soruId')}}).map(function(soru) {
        return soru._id;
      });
      Meteor.call('sinavaSoruEkleCikar',sinavId,soruIdleri,'cikar');
      return 'ok';
    },
    'sorularSinavaUygunMu': function(soru,kurum,egitimYili,ders,sinif) {
      check(soru,[String]);
      check(kurum,String);
      check(egitimYili,String);
      check(ders,String);
      check(sinif,String);
      if (soru.length < 1) {
        return 'degil';
      }
      var sorular = Meteor.call('sinavaUygunSorular',kurum,egitimYili,ders,sinif);
      return sorular.length > 0 && _.intersection(sorular,soru).length === soru.length ? 'uygun' : 'degil';
    },
    'sinavaUygunSorular': function(kurum,egitimYili,ders,sinif) {
      check(kurum,String);
      check(egitimYili,String);
      check(ders,String);
      check(sinif,String);
      var mufredatDers = M.C.Mufredat.find({
        kurum: kurum,
        egitimYili: egitimYili,
        ders: ders,
        sinif: sinif
      }).map(function(mufredat) {return mufredat.ders});
      var sorular = M.C.Sorular.find({
        aktif: true,
        taslak: false,
        kurum: kurum,
        'alan.sinif': sinif,
        'alan.ders': {$in: mufredatDers}
      }).map(function(soru) { return soru._id;});
      return sorular;
    },
    'sinavaSoruEkleCikar': function(sinavId,soruId,islem) {
      check(sinavId, String);
      check(soruId, Match.OneOf(String,[String]));
      check(islem, String);
      var soruIdleri;
      var currentUser = this.userId;

      if (_.isString(soruId)) {
        soruIdleri = [soruId]
      }

      if (_.isArray(soruId)) {
        soruIdleri = soruId;
        if (soruIdleri.length < 1) {
          M.L.ThrowError({error:'404',reason:'Soru bulunamadı',details:'Soru bulunamadı'});
        }
      }

      if (M.L.userHasRole(currentUser, 'mudur')) {
        M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
      }

      if (M.L.userHasRole(currentUser, 'ogrenci')) {
        M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
      }

      if (!_.contains(['ekle','cikar'],islem)) {
        M.L.ThrowError({error:'403',reason:'Hatalı işlem',details:'Hatalı işlem'});
      }

      var sinav = M.C.Sinavlar.findOne({_id: sinavId});
      if (!sinav) {
        M.L.ThrowError({error:'404',reason:'Sınav bulunamadı',details:'Sınav bulunamadı'});
      }

      if (M.L.userHasRole(currentUser, 'ogretmen')) {
        if (!_.contains(M.C.Users.findOne({_id: currentUser}).dersleri, sinav.ders)) {
          M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
        }
      }

      M.C.Sorular.find({_id: {$in: soruIdleri}}).forEach(function(soru) {
        if (!soru) {
          M.L.ThrowError({error:'404',reason:'Soru bulunamadı',details:'Soru bulunamadı'});
        }

        if (M.L.userHasRole(currentUser, 'ogretmen')) {
          if (!_.contains(M.C.Users.findOne({_id: currentUser}).dersleri, soru.alan.ders)) {
            M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
          }
        }

        if(islem === 'ekle' && _.contains(_.pluck(sinav.sorular, 'soruId'), soru._id)) {
          M.L.ThrowError({error:'403',reason:'Soru sınavda zaten var',details:'Soru sınavda zaten var'});
        }

        if(islem === 'cikar' && !_.contains(_.pluck(sinav.sorular, 'soruId'), soru._id)) {
          M.L.ThrowError({error:'403',reason:'Soru sınavda zaten yok',details:'Soru sınavda zaten yok'});
        }

        if (islem === 'ekle') {
          var uygunluk = Meteor.call('sorularSinavaUygunMu',[soru._id],sinav.kurum,sinav.egitimYili,sinav.ders,sinav.sinif);
          if (uygunluk !== 'uygun') {
            M.L.ThrowError({error:'403',reason:'Bu soru bu sınava eklenemez',details:'Bu soru bu sınava eklenemez'});
          }
        }
      });

      var yeniSoruIdleri = _.pluck(sinav.sorular, 'soruId') || [];

      if (islem === 'ekle') {
        yeniSoruIdleri = _.union(yeniSoruIdleri, soruIdleri);
      }

      if (islem === 'cikar') {
        yeniSoruIdleri = _.difference(yeniSoruIdleri, soruIdleri);
      }

      var sorular = _.map(yeniSoruIdleri, function(soruId) {
        return {
          soruId: soruId,
          zorlukDerecesi: M.C.Sorular.findOne({_id: soruId}).zorlukDerecesi,
          puan: 0
        }
      });

      if (sorular.length > 0) {

        var initialToplamZD = _.reduce(sorular, function(memo, soru) {
          return memo + soru.zorlukDerecesi
        }, 0);

        sorular = _.map(sorular, function(soru) {
          return {
            soruId: soru.soruId,
            zorlukDerecesi: soru.zorlukDerecesi,
            puan: math.chain(soru.zorlukDerecesi).divide(initialToplamZD).multiply(100).round().done()
          }
        });

        var initialToplamPuan = _.reduce(sorular, function(memo, soru) {
          return memo + soru.puan
        }, 0);

        var sortedSorular = _.sortBy(sorular, 'puan');
        var soruCount = sorular.length;
        var puanFarki = initialToplamPuan - 100;

        if (!!puanFarki) {
          for (var ix=0; ix < Math.abs(puanFarki); ix++) {
            var soruIndex = soruCount-ix-1;
            sorular = _.map(sorular, function(soru) {
              if (soru.soruId === sortedSorular[soruIndex].soruId) {
                soru.puan = soru.puan - ( puanFarki / Math.abs(puanFarki) );
              }
              return soru;
            })
          }
        }

      }

      var updateDoc = {
        kurum: sinav.kurum,
        ders: sinav.ders,
        sinif: sinav.sinif,
        sorular: sorular
      };

      var sonuc = M.C.Sinavlar.update({_id: sinav._id}, {$set: updateDoc});

      return sonuc;

    },
    'setSinavCanliStatus': function(sinavId, newStatus) {
      check(sinavId, String);
      check(newStatus, String);

      if (M.L.userHasRole(this.userId, 'mudur')) {
        M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
      }

      var sinav = M.C.Sinavlar.findOne({_id: sinavId, tip: 'canli'});
      if (!sinav) {
        M.L.ThrowError({error:'404',reason:'Sınav bulunamadı',details:'Sınav bulunamadı'});
      }

      var user = M.C.Users.findOne({_id: this.userId});
      if (M.L.userHasRole(this.userId, 'ogretmen')) {
        if (!(_.contains(user.dersleri, sinav.ders) && user.kurum === sinav.kurum)) {
          M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
        }
      }

      if (M.L.userHasRole(this.userId, 'teknik')) {
        if (user.kurum !== sinav.kurum) {
          M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
        }
      }

      if (!_.contains(['running','paused','completed'], newStatus) || sinav.canliStatus === 'completed') {
        M.L.ThrowError({error:'400',reason:'Status hatalı',details:'Status hatalı'});
      }

      var updateDoc = {
        canliStatus: newStatus
      };

      var sonuc = M.C.Sinavlar.update({_id: sinav._id}, {$set: updateDoc});

      return sonuc;

    },
    'sinavIptal': function(sinavId) {
      check(sinavId, String);

      if (M.L.userHasRole(this.userId, 'mudur')) {
        M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
      }

      var sinav = M.C.Sinavlar.findOne({_id: sinavId});
      if (!sinav) {
        M.L.ThrowError({error:'404',reason:'Sınav bulunamadı',details:'Sınav bulunamadı'});
      }

      var user = M.C.Users.findOne({_id: this.userId});
      if (M.L.userHasRole(this.userId, 'ogretmen')) {
        if (!(_.contains(user.dersleri, sinav.ders) && user.kurum === sinav.kurum)) {
          M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
        }
      }

      if (M.L.userHasRole(this.userId, 'teknik')) {
        if (user.kurum !== sinav.kurum) {
          M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
        }
      }

      var updateDoc = {
        iptal: true
      };

      var sonuc = M.C.Sinavlar.update({_id: sinav._id}, {$set: updateDoc});

      return sonuc;

    },
    'sinavTaslakDegistir': function(sinavId) {
      check(sinavId, String);

      if (M.L.userHasRole(this.userId, 'mudur')) {
        M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
      }

      var sinav = M.C.Sinavlar.findOne({_id: sinavId});
      if (!sinav) {
        M.L.ThrowError({error:'404',reason:'Sınav bulunamadı',details:'Sınav bulunamadı'});
      }

      var user = M.C.Users.findOne({_id: this.userId});
      if (M.L.userHasRole(this.userId, 'ogretmen')) {
        if (!(_.contains(user.dersleri, sinav.ders) && user.kurum === sinav.kurum)) {
          M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
        }
      }

      if (M.L.userHasRole(this.userId, 'teknik')) {
        if (user.kurum !== sinav.kurum) {
          M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
        }
      }

      if (sinav.kilitli === true) {
        M.L.ThrowError({error:'sinavKilitli',reason:'Sınav kilitli',details:'Sınav kilitli'});
      }

      if (sinav.taslak === true && ( !sinav.sorular || (sinav.sorular.length < 1) )) {
        M.L.ThrowError({error:'sorusuzSinavTaslakKalmali',reason:'Sorusuz sınav taslak kalmalı',details:'Sorusuz sınav taslak kalmalı'});
      }

      if ( moment(sinav.acilisZamani).isBefore(moment()) ) {
        M.L.ThrowError({error:'acilisSonraOlmali',reason:'Açılış zamanı şu andan sonra olmalı',details:'Açılış zamanı şu andan sonra olmalı'});
      }

      var updateDoc = {
        taslak: !sinav.taslak
      };

      var sonuc = M.C.Sinavlar.update({_id: sinav._id}, {$set: updateDoc});

      return sonuc;

    },
    'sinavKilitle': function(sinavId) {
      check(sinavId, String);

      if (M.L.userHasRole(this.userId, 'mudur')) {
        M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
      }

      var sinav = M.C.Sinavlar.findOne({_id: sinavId});
      if (!sinav) {
        M.L.ThrowError({error:'404',reason:'Sınav bulunamadı',details:'Sınav bulunamadı'});
      }

      var user = M.C.Users.findOne({_id: this.userId});
      if (M.L.userHasRole(this.userId, 'ogretmen')) {
        if (!(_.contains(user.dersleri, sinav.ders) && user.kurum === sinav.kurum)) {
          M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
        }
      }

      if (M.L.userHasRole(this.userId, 'teknik')) {
        if (user.kurum !== sinav.kurum) {
          M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
        }
      }

      if (sinav.kilitli === true) {
        M.L.ThrowError({error:'zatenKilitli',reason:'Sınav zaten kilitli',details:'Sınav zaten kilitli'});
      }

      if (sinav.taslak === true) {
        M.L.ThrowError({error:'taslakSinavKilitlenemez',reason:'Taslak sınav kilitlenemez',details:'Taslak sınav kilitlenemez'});
      }

      if (!sinav.sorular || (sinav.sorular.length < 1)) {
        M.L.ThrowError({error:'sorusuzSinavKilitsizKalmali',reason:'Sorusuz sınav kilitlenemez',details:'Sorusuz sınav kilitlenemez'});
      }

      var updateDoc = {
        kilitli: true
      };

      var sonuc = M.C.Sinavlar.update({_id: sinav._id}, {$set: updateDoc});

      return sonuc;

    }
  });
}
