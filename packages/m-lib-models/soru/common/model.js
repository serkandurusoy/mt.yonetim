M.C.setUpCollection({
  object: 'Sorular',
  collection: 'sorular',
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
              initials = words[0].substring(0,1) + words[1].substring(0,1)
            }

            var count = M.C.Sorular.find().count() + 1;
            count = s.pad(count,6,'0');

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
    alan: {
      label: 'Alan',
      type: Object
    },
    'alan.ders': {
      label: 'Ders',
      type: String,
      index: 1,
      custom: function() {
        var ders = this;
        if (ders.isSet && !_.contains(M.C.Dersler.find({},{fields: {_id: 1}}).map(function(ders) {return ders._id;}), ders.value)) {
          return 'notAllowed';
        }
        return true;
      },
      autoform: {
        class: 'browser-default',
        firstOption: 'Ders seçin',
        options: function() {
          var user = M.C.Users.findOne({_id: Meteor.userId()});
          var options = [];
          if (user.role === 'ogretmen') {
            options = M.C.Dersler.find({_id: {$in: user.dersleri}}).map(function(ders) {
              return {value: ders._id, label: ders.isim};
            });
          } else {
            options = M.C.Dersler.find().map(function(ders) {
              return {value: ders._id, label: ders.isim};
            });
          }
          return options;
        }
      }
    },
    'alan.sinif': {
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
        options: function(){
          return _.map(M.E.Sinif, function(sinif) {return {label: M.L.enumLabel(sinif), value: sinif};});
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
    'alan.mufredat': {
      type: String,
      autoValue: function() {
        if (Meteor.isServer) {
          var kurum = this.field('kurum');
          var ders = this.field('alan.ders');
          var sinif = this.field('alan.sinif');
          if (kurum.isSet && ders.isSet && sinif.isSet) {
            var mufredat = M.C.Mufredat.findOne({kurum: kurum.value, egitimYili: M.C.AktifEgitimYili.findOne().egitimYili, ders: ders.value, sinif: sinif.value});
            return mufredat && mufredat._id;
          }
        } else {
          return 'mufredat';
        }
      },
      autoform: {
        type: 'hidden'
      }
    },
    'alan.mufredatVersion': {
      type: Number,
      autoValue: function() {
        if (Meteor.isServer) {
          var kurum = this.field('kurum');
          var ders = this.field('alan.ders');
          var sinif = this.field('alan.sinif');
          if (kurum.isSet && ders.isSet && sinif.isSet) {
            var mufredat = M.C.Mufredat.findOne({kurum: kurum.value, egitimYili: M.C.AktifEgitimYili.findOne().egitimYili, ders: ders.value, sinif: sinif.value});
            return mufredat && mufredat._version;
          }
        } else {
          return 0;
        }
      },
      autoform: {
        type: 'hidden'
      }
    },
    'alan.egitimYili': {
      type: String,
      autoValue: function() {
        if (Meteor.isServer) {
          return M.C.AktifEgitimYili.findOne().egitimYili;
        } else {
          return 'egitimYili'
        }
      },
      autoform: {
        type: 'hidden'
      }
    },
    'alan.konu': {
      label: 'Konu',
      type: String,
      index: 1,
      custom: function() {
        var konu = this;
        var kurum = this.field('kurum');
        var ders = this.field('alan.ders');
        var sinif = this.field('alan.sinif');
        var kurumDersKonulari = kurum.isSet && ders.isSet && sinif.isSet && _.pluck(_.flatten(M.C.Mufredat.find({kurum: kurum.value, egitimYili: M.C.AktifEgitimYili.findOne().egitimYili, ders: ders.value, sinif: sinif.value}).map(function(mufredat) {return mufredat.konular;})), 'konu');
        if (konu.isSet && !_.contains(kurumDersKonulari, konu.value)) {
          return 'dersKonusuHatali';
        }
        return true;
      },
      autoform: {
        class: 'browser-default',
        firstOption: 'Konu seçin',
        options: function(){
          var formId = AutoForm.getFormId();
          var kurum = Meteor.user().role !== 'mitolojix' ? Meteor.user().kurum : AutoForm.getFieldValue('kurum', formId);
          var ders = AutoForm.getFieldValue('alan.ders', formId);
          var sinif = AutoForm.getFieldValue('alan.sinif', formId);
          var options = [];

          if (kurum && ders && sinif) {
            var kurumTumDersKonulari = _.pluck(_.flatten(M.C.Mufredat.find({kurum: kurum, egitimYili: M.C.AktifEgitimYili.findOne().egitimYili, ders: ders, sinif: sinif}).map(function(mufredat) {return mufredat.konular;})), 'konu');
            var kurumDersKonulari = _.uniq(kurumTumDersKonulari).sort(function(a, b) {
              return a.localeCompare(b);
            });
            options = _.map(kurumDersKonulari, function(konu) {return {label: konu, value: konu}; });
          }
          return options;
        }
      }
    },
    'alan.kazanimlar': {
      label: 'Kazanımlar',
      type: [String],
      minCount: 1,
      custom: function() {
        var kazanimlar = this.value;
        return _.uniq(kazanimlar).length === kazanimlar.length ? true : 'notUnique'
      },
      autoform: {
        type: 'select-checkbox',
        options: function(){
          var formId = AutoForm.getFormId();
          var kurum = Meteor.user().role !== 'mitolojix' ? Meteor.user().kurum : AutoForm.getFieldValue('kurum', formId);
          var ders = AutoForm.getFieldValue('alan.ders', formId);
          var sinif = AutoForm.getFieldValue('alan.sinif', formId);
          var konu = AutoForm.getFieldValue('alan.konu', formId);
          var options = [];

          if (kurum && ders && sinif && konu) {
            var kurumDersKonuSu = _.findWhere(_.flatten(M.C.Mufredat.find({kurum: kurum, egitimYili: M.C.AktifEgitimYili.findOne().egitimYili, ders: ders, sinif: sinif}).map(function(mufredat) {return mufredat.konular;})), {konu: konu});
            var kurumDersKonuKazanimlari = kurumDersKonuSu && kurumDersKonuSu.kazanimlar;
            kurumDersKonuKazanimlari = _.uniq(kurumDersKonuKazanimlari).sort(function(a, b) {
              return a.localeCompare(b);
            });
            options = _.map(kurumDersKonuKazanimlari, function(kazanim) {return {label: kazanim, value: kazanim}; });
          }
          return options;
        }
      }
    },
    'alan.kazanimlar.$': {
      label: 'Kazanım',
      type: String,
      custom: function() {
        var kazanim = this;
        var kurum = this.field('kurum');
        var ders = this.field('alan.ders');
        var sinif = this.field('alan.sinif');
        var konu = this.field('alan.konu');
        var kurumDersKonuSu = kurum.isSet && ders.isSet && sinif.isSet && _.findWhere(_.flatten(M.C.Mufredat.find({kurum: kurum.value, egitimYili: M.C.AktifEgitimYili.findOne().egitimYili, ders: ders.value, sinif: sinif.value}).map(function(mufredat) {return mufredat.konular;})), {konu: konu.value});
        var kurumDersKonuKazanimlari = kurumDersKonuSu && kurumDersKonuSu.kazanimlar;
        if (kazanim.isSet && !_.contains(kurumDersKonuKazanimlari, kazanim.value)) {
          return 'dersKazanimiHatali';
        }
        return true;
      }
    },
    tip: {
      label: 'Soru Tipi',
      type: String,
      allowedValues: M.E.SoruTipi,
      index: 1,
      autoform: {
        class: 'browser-default',
        firstOption: 'Soru tipi seçin',
        options: function() {
          var options = _.map(M.E.SoruTipiObjects, function(t) {
            return {
              label: t.label, value: t.name
            };
          });
          return options;
        }
      }
    },
    zorlukDerecesi: {
      label: 'Zorluk Derecesi',
      type: Number,
      allowedValues: M.E.ZorlukDereceleri,
      autoform: {
        class: 'browser-default',
        firstOption: 'Zorluk derecesi seçin',
        options: function() {
          var options = _.map(M.E.ZorlukDereceleri, function(zd) {return {label: zd.toString(), value: zd};});
          return options;
        }
      }
    },
    soru: {
      label: 'Soru',
      type: Object
    },
    'soru.yonerge': {
      label: 'Yönerge',
      type: String,
      min: 4,
      max: 128,
      autoValue: function() {
        if (this.isSet) {
          return M.L.Trim(this.value);
        } else {
          this.unset();
        }
      }
    },
    'soru.metin': {
      label: 'Soru Metni',
      type: String,
      min: 4,
      max: 512,
      optional: true,
      autoValue: function() {
        if (this.isSet) {
          return M.L.TrimButKeepParagraphs(this.value);
        } else {
          this.unset();
        }
      },
      autoform: {
        type: 'textarea',
        length: 512
      }
    },
    'soru.gorsel': {
      label: 'Soru Görseli',
      type: String,
      optional: true,
      autoform: {
        afFieldInput: {
          type: 'fileUpload',
          collection: M.FS.SoruGorsel,
          accept: 'image/*',
          dropEnabled: false,
          label: 'Görsel seçin',
          buttonlabel: '<i class="material-icons">attach_file</i>',
          dropLabel: 'Veya sürükleyip buraya bırakın',
          //removeLabel: 'Sil',
          'remove-label': 'Sil',
          dropClasses: 'card-panel grey lighten-4 grey-text'
        }
      }
    },
    yanit: {
      label: 'Yanıt',
      type: Object,
      autoform: {
        type: function() {
          var formId = AutoForm.getFormId();
          var tip = AutoForm.getFieldValue('tip', formId);
          return !tip && 'hidden';
        }
      }
    },
    'yanit.dogruYanlis': {
      label: 'Doğru Yanlış',
      optional: true,
      type: Object,
      autoValue: function() {
        var tip = this.field('tip');
        var self = this;
        if (tip.isSet && tip.value === 'dogruYanlis' && self.isSet) {
          return self.value;
        } else {
          return self.unset();
        }
      },
      autoform: {
        type: function() {
          var formId = AutoForm.getFormId();
          var tip = AutoForm.getFieldValue('tip', formId);
          return tip !== 'dogruYanlis' && 'hidden';
        }
      }
    },
    'yanit.dogruYanlis.cevap': {
      label: 'Cevap',
      type: Boolean,
      autoform: {
        type: 'switch',
        trueLabel: '<span style="font-size: 200%; position: relative; top: 0.25em">&#x2713;</span>',
        falseLabel: '<span style="font-size: 200%; position: relative; top: 0.25em">&#x2717;</span>'
      }
    },
    'yanit.coktanTekSecmeli': {
      label: 'Çoktan Tek Seçmeli',
      optional: true,
      type: [Object],
      autoValue: function() {
        var tip = this.field('tip');
        var self = this;
        if (tip.isSet && tip.value === 'coktanTekSecmeli' && self.isSet) {
          return _.compact(self.value);
        } else {
          return self.unset();
        }
      },
      minCount: 4,
      maxCount: 4,
      custom: function() {
        var tip = this.field('tip');
        tip = tip && tip.value;
        if (tip === 'coktanTekSecmeli') {
          var secenekObjects = _.compact(this.value);
          if (secenekObjects.length > 1) {
            var dogruAdet = _.where(secenekObjects, {dogru: true}).length;
            if ( dogruAdet < 1 ) {return 'enAzBirDogruOlmali';}
            if ( dogruAdet > 1 ) {return 'sadeceBirDogruOlmali';}
            var metinler = M.L.RejectUndefinedFromArray(_.pluck(secenekObjects, 'secenekMetin'));
            var gorseller = M.L.RejectUndefinedFromArray(_.pluck(secenekObjects, 'secenekGorsel'));
            if (_.uniq(metinler).length !== metinler.length || _.uniq(gorseller).length !== gorseller.length) {
              return 'notUniqueYanitlar';
            }
          }
        }
        return true;
      },
      autoform: {
        type: function() {
          var formId = AutoForm.getFormId();
          var tip = AutoForm.getFieldValue('tip', formId);
          return tip !== 'coktanTekSecmeli' && 'hidden';
        }
      }
    },
    'yanit.coktanTekSecmeli.$.secenekMetin': {
      label: 'Seçenek Metni',
      type: String,
      min: 1,
      max: 256,
      optional: true,
      autoValue: function() {
        if (this.isSet) {
          return M.L.Trim(this.value);
        } else {
          this.unset();
        }
      },
      custom:  function() {
        var metin = this;
        var gorsel = this.siblingField('secenekGorsel');
        if (!metin.isSet && !gorsel.isSet) {
          return 'metinGorselBiriniGir';
        }
        return true;
      }
    },
    'yanit.coktanTekSecmeli.$.secenekGorsel': {
      label: 'Seçenek Görseli',
      type: String,
      optional: true,
      autoValue: function() {
        if (this.isSet) {
          return this.value;
        } else {
          this.unset();
        }
      },
      custom:  function() {
        var metin = this.siblingField('secenekMetin');
        var gorsel = this;
        if (!metin.isSet && !gorsel.isSet) {
          return 'metinGorselBiriniGir';
        }
        return true;
      },
      autoform: {
        afFieldInput: {
          type: 'fileUpload',
          collection: M.FS.SoruGorsel,
          accept: 'image/*',
          dropEnabled: false,
          label: 'Görsel seçin',
          buttonlabel: '<i class="material-icons">attach_file</i>',
          dropLabel: 'Veya sürükleyip buraya bırakın',
          //removeLabel: 'Sil',
          'remove-label': 'Sil',
          dropClasses: 'card-panel grey lighten-4 grey-text'
        }
      }
    },
    'yanit.coktanTekSecmeli.$.dogru': {
      label: 'Doğru',
      type: Boolean,
      autoform: {
        type: 'switch',
        trueLabel: '<span style="font-size: 200%; position: relative; top: 0.25em">&#x2713;</span>',
        falseLabel: '<span style="font-size: 200%; position: relative; top: 0.25em">&#x2717;</span>'
      }
    },
    'yanit.coktanCokSecmeli': {
      label: 'Çoktan Çok Seçmeli',
      optional: true,
      type: [Object],
      autoValue: function() {
        var tip = this.field('tip');
        var self = this;
        if (tip.isSet && tip.value === 'coktanCokSecmeli' && self.isSet) {
          return _.compact(self.value);
        } else {
          return self.unset();
        }
      },
      minCount: 4,
      maxCount: 4,
      custom: function() {
        var tip = this.field('tip');
        tip = tip && tip.value;
        if (tip === 'coktanCokSecmeli') {
          var secenekObjects = _.compact(this.value);
          if (secenekObjects.length > 1) {
            var dogruAdet = _.where(secenekObjects, {dogru: true}).length;
            if ( dogruAdet < 1 ) {return 'enAzBirDogruOlmali';}
            var metinler = M.L.RejectUndefinedFromArray(_.pluck(secenekObjects, 'secenekMetin'));
            var gorseller = M.L.RejectUndefinedFromArray(_.pluck(secenekObjects, 'secenekGorsel'));
            if (_.uniq(metinler).length !== metinler.length || _.uniq(gorseller).length !== gorseller.length) {
              return 'notUniqueYanitlar';
            }
          }
        }
        return true;
      },
      autoform: {
        type: function() {
          var formId = AutoForm.getFormId();
          var tip = AutoForm.getFieldValue('tip', formId);
          return tip !== 'coktanCokSecmeli' && 'hidden';
        }
      }
    },
    'yanit.coktanCokSecmeli.$.secenekMetin': {
      label: 'Seçenek Metni',
      type: String,
      min: 1,
      max: 256,
      optional: true,
      autoValue: function() {
        if (this.isSet) {
          return M.L.Trim(this.value);
        } else {
          this.unset();
        }
      },
      custom:  function() {
        var metin = this;
        var gorsel = this.siblingField('secenekGorsel');
        if (!metin.isSet && !gorsel.isSet) {
          return 'metinGorselBiriniGir';
        }
        return true;
      }
    },
    'yanit.coktanCokSecmeli.$.secenekGorsel': {
      label: 'Seçenek Görseli',
      type: String,
      optional: true,
      autoValue: function() {
        if (this.isSet) {
          return this.value;
        } else {
          this.unset();
        }
      },
      custom:  function() {
        var metin = this.siblingField('secenekMetin');
        var gorsel = this;
        if (!metin.isSet && !gorsel.isSet) {
          return 'metinGorselBiriniGir';
        }
        return true;
      },
      autoform: {
        afFieldInput: {
          type: 'fileUpload',
          collection: M.FS.SoruGorsel,
          accept: 'image/*',
          dropEnabled: false,
          label: 'Görsel seçin',
          buttonlabel: '<i class="material-icons">attach_file</i>',
          dropLabel: 'Veya sürükleyip buraya bırakın',
          //removeLabel: 'Sil',
          'remove-label': 'Sil',
          dropClasses: 'card-panel grey lighten-4 grey-text'
        }
      }
    },
    'yanit.coktanCokSecmeli.$.dogru': {
      label: 'Doğru',
      type: Boolean,
      autoform: {
        type: 'switch',
        trueLabel: '<span style="font-size: 200%; position: relative; top: 0.25em">&#x2713;</span>',
        falseLabel: '<span style="font-size: 200%; position: relative; top: 0.25em">&#x2717;</span>'
      }
    },
    'yanit.siralama': {
      label: 'Sıralama',
      optional: true,
      type: [Object],
      minCount: 4,
      maxCount: 4,
      autoValue: function() {
        var tip = this.field('tip');
        var self = this;
        if (tip.isSet && tip.value === 'siralama' && self.isSet) {
          return _.compact(self.value);
        } else {
          return self.unset();
        }
      },
      custom: function() {
        var tip = this.field('tip');
        tip = tip && tip.value;
        if (tip === 'siralama') {
          var secenekObjects = _.compact(this.value);
          if (secenekObjects.length > 1) {
            var metinler = M.L.RejectUndefinedFromArray(_.pluck(secenekObjects, 'metin'));
            var gorseller = M.L.RejectUndefinedFromArray(_.pluck(secenekObjects, 'gorsel'));
            if (_.uniq(metinler).length !== metinler.length || _.uniq(gorseller).length !== gorseller.length) {
              return 'notUniqueYanitlar';
            }
          }
        }
        return true;
      },
      autoform: {
        type: function() {
          var formId = AutoForm.getFormId();
          var tip = AutoForm.getFieldValue('tip', formId);
          return tip !== 'siralama' && 'hidden';
        }
      }
    },
    'yanit.siralama.$.metin': {
      label: 'Metin',
      type: String,
      optional: true,
      min: 1,
      max: 256,
      custom: function() {
        var metin = this;
        var gorsel = this.siblingField('gorsel');
        if (!metin.isSet && !gorsel.isSet) {
          return 'metinGorselBiriniGir';
        }
        return true;
      },
      autoValue: function() {
        if (this.isSet) {
          return M.L.Trim(this.value);
        } else {
          this.unset();
        }
      }
    },
    'yanit.siralama.$.gorsel': {
      label: 'Görsel',
      type: String,
      optional: true,
      custom: function() {
        var metin = this.siblingField('metin');
        var gorsel = this;
        if (!metin.isSet && !gorsel.isSet) {
          return 'metinGorselBiriniGir';
        }
        return true;
      },
      autoValue: function() {
        if (this.isSet) {
          return this.value;
        } else {
          this.unset();
        }
      },
      autoform: {
        afFieldInput: {
          type: 'fileUpload',
          collection: M.FS.SoruGorsel,
          accept: 'image/*',
          dropEnabled: false,
          label: 'Görsel seçin',
          buttonlabel: '<i class="material-icons">attach_file</i>',
          dropLabel: 'Veya sürükleyip buraya bırakın',
          //removeLabel: 'Sil',
          'remove-label': 'Sil',
          dropClasses: 'card-panel grey lighten-4 grey-text'
        }
      }
    },
    'yanit.eslestirme': {
      label: 'Eşleştirme',
      optional: true,
      type: [Object],
      autoValue: function() {
        var tip = this.field('tip');
        var self = this;
        if (tip.isSet && tip.value === 'eslestirme' && self.isSet) {
          return _.compact(self.value);
        } else {
          return self.unset();
        }
      },
      minCount: 5,
      maxCount: 5,
      custom: function() {
        var tip = this.field('tip');
        tip = tip && tip.value;
        if (tip === 'eslestirme') {
          var secenekObjects = _.compact(this.value);
          if (secenekObjects.length > 1) {
            var solMetinler = M.L.RejectUndefinedFromArray(_.pluck(secenekObjects, 'solMetin'));
            var solGorseller = M.L.RejectUndefinedFromArray(_.pluck(secenekObjects, 'solGorsel'));
            var sagMetinler = M.L.RejectUndefinedFromArray(_.pluck(secenekObjects, 'sagMetin'));
            var sagGorseller = M.L.RejectUndefinedFromArray(_.pluck(secenekObjects, 'sagGorsel'));
            if (_.uniq(solMetinler).length !== solMetinler.length || _.uniq(solGorseller).length !== solGorseller.length || _.uniq(sagMetinler).length !== sagMetinler.length || _.uniq(sagGorseller).length !== sagGorseller.length) {
              return 'notUniqueYanitlar';
            }
          }
        }
        return true;
      },
      autoform: {
        type: function() {
          var formId = AutoForm.getFormId();
          var tip = AutoForm.getFieldValue('tip', formId);
          return tip !== 'eslestirme' && 'hidden';
        }
      }
    },
    'yanit.eslestirme.$.solMetin': {
      label: 'Sol Metin',
      type: String,
      optional: true,
      min: 1,
      max: 256,
      custom: function() {
        var metin = this;
        var gorsel = this.siblingField('solGorsel');
        if (!metin.isSet && !gorsel.isSet) {
          return 'metinGorselBiriniGir';
        }
        return true;
      },
      autoValue: function() {
        if (this.isSet) {
          return M.L.Trim(this.value);
        } else {
          this.unset();
        }
      }
    },
    'yanit.eslestirme.$.solGorsel': {
      label: 'Sol Görsel',
      type: String,
      optional: true,
      custom: function() {
        var metin = this.siblingField('solMetin');
        var gorsel = this;
        if (!metin.isSet && !gorsel.isSet) {
          return 'metinGorselBiriniGir';
        }
        return true;
      },
      autoValue: function() {
        if (this.isSet) {
          return this.value;
        } else {
          this.unset();
        }
      },
      autoform: {
        afFieldInput: {
          type: 'fileUpload',
          collection: M.FS.SoruGorsel,
          accept: 'image/*',
          dropEnabled: false,
          label: 'Görsel seçin',
          buttonlabel: '<i class="material-icons">attach_file</i>',
          dropLabel: 'Veya sürükleyip buraya bırakın',
          //removeLabel: 'Sil',
          'remove-label': 'Sil',
          dropClasses: 'card-panel grey lighten-4 grey-text'
        }
      }
    },
    'yanit.eslestirme.$.sagMetin': {
      label: 'Sağ Metin',
      type: String,
      optional: true,
      min: 1,
      max: 256,
      custom: function() {
        var metin = this;
        var gorsel = this.siblingField('sagGorsel');
        if (!metin.isSet && !gorsel.isSet) {
          return 'metinGorselBiriniGir';
        }
        return true;
      },
      autoValue: function() {
        if (this.isSet) {
          return M.L.Trim(this.value);
        } else {
          this.unset();
        }
      }
    },
    'yanit.eslestirme.$.sagGorsel': {
      label: 'Sağ Görsel',
      type: String,
      optional: true,
      custom: function() {
        var metin = this.siblingField('sagMetin');
        var gorsel = this;
        if (!metin.isSet && !gorsel.isSet) {
          return 'metinGorselBiriniGir';
        }
        return true;
      },
      autoValue: function() {
        if (this.isSet) {
          return this.value;
        } else {
          this.unset();
        }
      },
      autoform: {
        afFieldInput: {
          type: 'fileUpload',
          collection: M.FS.SoruGorsel,
          accept: 'image/*',
          dropEnabled: false,
          label: 'Görsel seçin',
          buttonlabel: '<i class="material-icons">attach_file</i>',
          dropLabel: 'Veya sürükleyip buraya bırakın',
          //removeLabel: 'Sil',
          'remove-label': 'Sil',
          dropClasses: 'card-panel grey lighten-4 grey-text'
        }
      }
    },
    'yanit.boslukDoldurma': {
      label: '[Boşluk] Doldurma',
      optional: true,
      type: Object,
      autoValue: function() {
        var tip = this.field('tip');
        var self = this;
        if (tip.isSet && tip.value === 'boslukDoldurma' && self.isSet) {
          return self.value;
        } else {
          return self.unset();
        }
      },
      autoform: {
        type: function() {
          var formId = AutoForm.getFormId();
          var tip = AutoForm.getFieldValue('tip', formId);
          return tip !== 'boslukDoldurma' && 'hidden';
        }
      }
    },
    'yanit.boslukDoldurma.cevap': {
      label: '[Boşluk] Doldurma',
      type: String,
      min: 3,
      max: 512,
      autoValue: function() {
        if (this.isSet) {
          return M.L.TrimButKeepParagraphs(this.value);
        } else {
          this.unset();
        }
      },
      custom: function() {
        var tip = this.field('tip');
        tip = tip && tip.value;
        if (tip === 'boslukDoldurma') {
          var cevap = this;
          if (cevap.isSet) {
            cevap = cevap.value;
            return /\[(.+?)\]/g.test(cevap) ? true : 'boslukFormatiHatali'
          }
        }
        return true;
      },
      autoform: {
        type: 'textarea',
        length: 512
      }
    },
    'yanit.boslukDoldurma.toleransKarakter': {
      label: 'Karakter Sayı Toleransı',
      type: Number,
      allowedValues: M.E.Levenshtein,
      autoform: {
        class: 'browser-default',
        firstOption: 'Karakter sayı toleransı seçin',
        options: function() {
          var options = _.map(M.E.Levenshtein, function(l) {return {label: l.toString(), value: l};});
          return options;
        }
      }
    },
    'yanit.boslukDoldurma.toleransBuyukKucukHarf': {
      label: 'Büyük Küçük Harf Toleransı',
      type: Boolean
    },
    'yanit.boslukDoldurma.toleransTurkce': {
      label: 'Türkçe Karakter Toleransı',
      type: Boolean
    },
    taslak: {
      label: 'Taslak',
      type: Boolean,
      index: 1,
      defaultValue: true,
      custom: function() {
        var taslak = this;
        var soruId = this.docId;
        if (taslak.isUpdate && taslak.isSet && taslak.value === true) {
          var sinav = M.C.Sinavlar.findOne({'sorular.soruId': soruId});
          if (sinav) {
            return 'sinavdakiSoruTaslakYapilamaz';
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
        var soruId = this.docId;
        var taslak = this.field('taslak');
        var kilitli = this;
        if (taslak.isSet && taslak.value === true && kilitli.isSet && kilitli.value === true) {
          return 'taslakSoruKilitlenemez';
        } else if (!taslak.isSet && kilitli.isSet && kilitli.value === true) {
          var taslak = M.C.Sorular.findOne({_id: soruId}).taslak === true;
          if (taslak) {
            return 'taslakSoruKilitlenemez';
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
  cloneable: true
});

M.C.Sorular.before.update(function (userId, doc, fields, modifier, options) {
  var tip = modifier.$set && modifier.$set.tip;
  var tumTip = [
    'dogruYanlis',
    'coktanTekSecmeli',
    'coktanCokSecmeli',
    'siralama',
    'eslestirme',
    'boslukDoldurma'
  ];

  if (tip) {
    modifier.$unset = modifier.$unset || {};
    var unset = _.keys(modifier.$unset);
    unset.push(tip);

    var digerTip = _.difference(tumTip, unset);

    _.each(digerTip, function(t) {
      var path = 'yanit.' + t;
      var obj = {};
      obj[path]= '';
      modifier.$unset = _.extend(modifier.$unset, obj);
    });

    modifier.$set = modifier.$set || {};
    modifier.$set = _.omit(modifier.$set, _.keys(modifier.$unset));

    if (modifier.$set.yanit) {
      modifier.$set['yanit.'+modifier.$set.tip] = modifier.$set.yanit[modifier.$set.tip];
      delete modifier.$set.yanit;
    }

  }

});

if (Meteor.isServer) {
  M.C.Sorular.permit('insert').ifLoggedIn().userHasRole('teknik').userInDocKurum().allowInClientCode();
  M.C.Sorular.permit('insert').ifLoggedIn().userHasRole('ogretmen').userInDocKurum().allowInClientCode(); // TODO: Must have access to soru

  M.C.Sorular.permit('update').ifLoggedIn().userHasRole('teknik').userInDocKurum().allowInClientCode();
  M.C.Sorular.permit('update').ifLoggedIn().userHasRole('ogretmen').userInDocKurum().allowInClientCode(); // TODO: Must have access to soru
}

if (Meteor.isServer) {
  Meteor.methods({
    'soruTaslakDegistir': function(soruId) {
      check(soruId, String);

      if (M.L.userHasRole(this.userId, 'mudur')) {
        M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
      }

      var soru = M.C.Sorular.findOne({_id: soruId});
      if (!soru) {
        M.L.ThrowError({error:'404',reason:'Soru bulunamadı',details:'Soru bulunamadı'});
      }

      var user = M.C.Users.findOne({_id: this.userId});
      if (M.L.userHasRole(this.userId, 'ogretmen')) {
        if (!(_.contains(user.dersleri, soru.alan.ders) && user.kurum === soru.kurum)) {
          M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
        }
      }

      if (M.L.userHasRole(this.userId, 'teknik')) {
        if (user.kurum !== soru.kurum) {
          M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
        }
      }

      if (soru.kilitli === true) {
        M.L.ThrowError({error:'soruKilitli',reason:'Soru kilitli',details:'Soru kilitli'});
      }

      var sinav = M.C.Sinavlar.findOne({'sorular.soruId': soruId});
      if (sinav && soru.taslak === false) {
        M.L.ThrowError({error:'sinavdakiSoruTaslakYapilamaz',reason:'Sınavdaki soru taslak yapılamaz',details:'Sınavdaki soru taslak yapılamaz'});
      }

      var updateDoc = {
        taslak: !soru.taslak
      };

      var sonuc = M.C.Sorular.update({_id: soru._id}, {$set: updateDoc});

      return sonuc;

    },
    'soruKilitle': function(soruId) {
      check(soruId, String);

      if (M.L.userHasRole(this.userId, 'mudur')) {
        M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
      }

      var soru = M.C.Sorular.findOne({_id: soruId});
      if (!soru) {
        M.L.ThrowError({error:'404',reason:'Soru bulunamadı',details:'Soru bulunamadı'});
      }

      var user = M.C.Users.findOne({_id: this.userId});
      if (M.L.userHasRole(this.userId, 'ogretmen')) {
        if (!(_.contains(user.dersleri, soru.alan.ders) && user.kurum === soru.kurum)) {
          M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
        }
      }

      if (M.L.userHasRole(this.userId, 'teknik')) {
        if (user.kurum !== soru.kurum) {
          M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
        }
      }

      if (soru.kilitli === true) {
        M.L.ThrowError({error:'zatenKilitli',reason:'Soru zaten kilitli',details:'Soru zaten kilitli'});
      }

      if (soru.taslak === true) {
        M.L.ThrowError({error:'taslakSoruKilitlenemez',reason:'Taslak soru kilitlenemez',details:'Taslak soru kilitlenemez'});
      }

      var updateDoc = {
        kilitli: true
      };

      var sonuc = M.C.Sorular.update({_id: soru._id}, {$set: updateDoc});

      return sonuc;

    }
  })
}
