import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';

import { AutoForm } from 'meteor/aldeed:autoform';
import { moment } from 'meteor/momentjs:moment';

import { M } from 'meteor/m:lib-core';

M.C.setUpCollection({
  object: 'Sinavlar',
  collection: 'sinavlar',
  schema: {
    kurum: {
      label: 'Kurum',
      type: String,
      index: 1,
      custom() {
        const kurum = this;
        const userRole = M.C.Users.findOne({_id: this.userId}).role;
        const userKurum = M.C.Users.findOne({_id: this.userId}).kurum;
        const kurumlar = M.C.Kurumlar.find().map(kurum => kurum._id);
        if (kurum.isSet && !_.contains(kurumlar,kurum.value)) {
          return 'notAllowed';
        }
        if (kurum.isSet && userRole !== 'mitolojix' && kurum.value !== userKurum) {
          return 'yetkiYok';
        }
        return true;
      },
      autoValue() {
        const kurum = this;
        const user = M.C.Users.findOne({_id: this.userId});
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
        // TODO: selectDisabled yaptigimiz durumlarda custom icinde de handle edelim ki disaridan editleme de olmasin
        type() {
          if (Meteor.user() && Meteor.user().role !== 'mitolojix') {
            return 'hidden';
          } else {
            const formId = AutoForm.getFormId();
            const sorular = AutoForm.getFieldValue('sorular', formId);
            return (sorular && sorular.length > 0) ? 'selectDisabled' : 'select';
          }
        },
        class: 'browser-default',
        firstOption: 'Kurum seçin',
        options() {
          let kurumlar = [];
          if (Meteor.user().role === 'mitolojix') {
            kurumlar = M.C.Kurumlar.find({}, {sort: {isimCollate: 1}})
                                    .map(kurum => {
                                      const {
                                        isim: label,
                                        _id: value,
                                      } = kurum;
                                      return {
                                        label,
                                        value,
                                      };
                                    });
          } else {
            const userKurum = M.C.Kurumlar.findOne({_id: Meteor.user().kurum});
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
      autoValue() {
        if (this.isInsert) {
          if (Meteor.isServer) {
            const kurum = this.field('kurum');
            const isim = kurum && M.C.Kurumlar.findOne({_id: kurum.value}).isim;
            const words = isim && _.first(s.words(isim),2);
            let initials = 'MT';

            if (words && words.length === 1) {
              initials = words[0].substring(0,2).toLocaleUpperCase() + 'T'
            }

            if (words && words.length === 2) {
              initials = words[0].substring(0,1) + words[1].substring(0,1) + 'T'
            }

            let count = M.C.Sinavlar.find().count() + 1;
            count = s.pad(count,5,'0');

            const kod = initials + count;

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
      autoValue() {
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
      autoValue() {
        if (this.isInsert) {
          const aktifEgitimYili = M.C.AktifEgitimYili.findOne();
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
      custom() {
        const ders = this;
        const kurum = this.field('kurum');
        const egitimYili = this.field('egitimYili');
        const sinif = this.field('sinif');
        const tumu = M.C.Dersler.find().map(ders => ders._id);
        if (ders.isSet && !_.contains(tumu,ders.value)) {
          return 'notAllowed';
        }
        if (ders.isInsert && ders.isSet && kurum.isSet && egitimYili.isSet && sinif.isSet) {
          const kullanilanMuhurAdedi = M.C.Sinavlar.find({
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
          const mevcutMuhurAdedi = M.C.Muhurler.find({
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
        // TODO: selectDisabled yaptigimiz durumlarda custom icinde de handle edelim ki disaridan editleme de olmasin
        type() {
          const formId = AutoForm.getFormId();
          const sorular = AutoForm.getFieldValue('sorular', formId);
          return (sorular && sorular.length > 0) ? 'selectDisabled' : 'select';
        },
        class: 'browser-default',
        firstOption: 'Ders seçin',
        options() {
          const user = M.C.Users.findOne({_id: Meteor.userId()});
          let olasiDersler = [];
          if (user.role === 'ogretmen') {
            olasiDersler = user.dersleri;
          } else {
            olasiDersler = M.C.Dersler.find().map(ders => ders._id);
          }
          let options = [];
          if (olasiDersler.length > 0) {
            options = M.C.Dersler.find({_id: {$in: olasiDersler}}).map(ders => {
              const {
                _id: value,
                isim: label,
              } = ders;
              return {
                value,
                label,
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
      autoValue() {
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
      custom() {
        if (this.isSet) {
          const muhur = M.C.Muhurler.findOne({_id: this.value});
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
      custom() {
        const sinif = this;
        if (sinif.isSet && !_.contains(M.E.Sinif, sinif.value)) {
          return 'notAllowed';
        }
        return true;
      },
      autoform: {
        // TODO: selectDisabled yaptigimiz durumlarda custom icinde de handle edelim ki disaridan editleme de olmasin
        type() {
          const formId = AutoForm.getFormId();
          const sorular = AutoForm.getFieldValue('sorular', formId);
          return (sorular && sorular.length > 0) ? 'selectDisabled' : 'select';
        },
        class: 'browser-default',
        firstOption: 'Sınıf seçin',
        options(){
          return M.E.Sinif.map(sinif => {
            return {
              label: M.L.enumLabel(sinif),
              value: sinif,
            };
          });
        }
      }
    },
    subeler: {
      label: 'Şubeler',
      type: [String],
      index: 1,
      minCount: 1,
      custom() {
        const subeler = this.value;
        if (_.uniq(subeler).length !== subeler.length) {
          return 'notUnique';
        }
        return true;
      },
      autoform: {
        type: 'select-checkbox-inline',
        options() {
          return M.E.Sube.map(sube => {
            return {
              label: sube,
              value: sube,
            };
          });
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
        pickadateOptions() {
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
      custom() {
        const saat = this;
        const tarih = this.field('acilisTarihi');
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
        type() {
          $('.saat').clockpicker(M.E.ClockPickerOptions);
          return 'text';
        }
      }
    },
    acilisZamani: {
      type: Date,
      index: -1,
      autoValue() {
        const tarih = this.field('acilisTarihi');
        const saat = this.field('acilisSaati');
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
      custom() {
        const acilis = this.field('acilisTarihi');
        const kapanis = this;
        if (acilis.isSet && kapanis.isSet) {
          return moment(kapanis.value).isBefore(moment(acilis.value)) ? 'kapanisSonraOlmali' : true;
        }
      },
      autoform: {
        type: 'pickadate',
        pickadateOptions() {
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
      custom() {
        const saat = this;
        const acilisSaat = this.field('acilisSaati');
        const acilis = this.field('acilisTarihi');
        const kapanis = this.field('kapanisTarihi');
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
        type() {
          $('.saat').clockpicker(M.E.ClockPickerOptions);
          return 'text';
        }
      }
    },
    kapanisZamani: {
      type: Date,
      index: -1,
      autoValue() {
        const tarih = this.field('kapanisTarihi');
        const saat = this.field('kapanisSaati');
        if (tarih.isSet && saat.isSet) {
          return moment(tarih.value).hour(saat.value.split(':')[0]).minute(saat.value.split(':')[1]).toDate();
        }
      },
      autoform: {
        omit: true
      }
    },
    acilisKapanisArasindakiSureSaat: {
      type: Number,
      index: 1,
      autoValue() {
        const acilisZamani = this.field('acilisZamani');
        const kapanisZamani = this.field('kapanisZamani');
        if (acilisZamani.isSet && kapanisZamani.isSet) {
          return Math.ceil(parseFloat(moment(kapanisZamani.value).diff(moment(acilisZamani.value), 'hours', true)));
        }
      },
      autoform: {
        omit: true
      }
    },
    tip: {
      label: 'Test Tipi',
      type: String,
      allowedValues: M.E.SinavTipi,
      index: 1,
      autoform: {
        class: 'browser-default',
        firstOption: 'Test tipi seçin',
        options() {
          return M.E.SinavTipiObjects.map(t => {
            const {
              label,
              name: value,
            } = t;
            return {
              label,
              value,
            };
          });
        }
      }
    },
    sure: {
      label: 'T. Süresi (dk)',
      type: Number,
      min: 5,
      max: 180,
      custom() {
        const sure = this;
        if (sure.isSet) {

          const acilisTarihi = this.field('acilisTarihi');
          const acilisSaati = this.field('acilisSaati');

          const kapanisTarihi = this.field('kapanisTarihi');
          const kapanisSaati = this.field('kapanisSaati');

          if (acilisTarihi.isSet && acilisSaati.isSet && kapanisTarihi.isSet && kapanisSaati.isSet) {
            const acilisZamani = moment(acilisTarihi.value).hour(acilisSaati.value.split(':')[0]).minute(acilisSaati.value.split(':')[1]);
            const kapanisZamani = moment(kapanisTarihi.value).hour(kapanisSaati.value.split(':')[0]).minute(kapanisSaati.value.split(':')[1]);
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
      custom() {
        const tip = this.field('tip');
        const canliStatus = this;
        const sinavId = this.docId;
        if (tip.value === 'canli' && !canliStatus.isInsert) {
          const eskiStatus = M.C.Sinavlar.findOne({_id: sinavId}).canliStatus;
          if (!_.contains(['running','paused','completed'],canliStatus.value) || eskiStatus === 'completed') {
            return 'notAllowed';
          }
        }
      },
      autoValue() {
        const tip = this.field('tip');
        const canliStatus = this;
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
      custom() {
        const tip = this.field('tip');
        const self = this;
        if (tip.isSet && _.contains(['deneme','canli'],tip.value)) {
          if (!self.isSet) {
            return 'required';
          } else {
            const kapanis = this.field('kapanisTarihi');
            const yanitlar = this;
            if (kapanis.isSet && yanitlar.isSet) {
              return moment(yanitlar.value).isBefore(moment(kapanis.value)) ? 'yanitlarSonraOlmali' : true;
            }
            return true;
          }
        } else {
          return true;
        }
      },
      autoValue() {
        const tip = this.field('tip');
        const self = this;
        if (tip.isSet && _.contains(['deneme','canli'],tip.value) && self.isSet) {
          return moment.tz(new Date(self.value.getFullYear(),self.value.getMonth(),self.value.getDate()),'Europe/Istanbul').toDate();
        } else {
          return self.unset();
        }
      },
      autoform: {
        class: 'optionalDatePicker',
        type() {
          const formId = AutoForm.getFormId();
          const tip = AutoForm.getFieldValue('tip', formId);
          if (_.contains(['deneme','canli'],tip)) {
            $('.optionalDatePicker').parent().parent().show();
          } else {
            $('.optionalDatePicker').parent().parent().hide();
          }
          return 'pickadate';
        },
        pickadateOptions() {
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
      custom() {
        const saat = this;
        const kapanisSaat = this.field('kapanisSaati');
        const kapanisTarihi = this.field('kapanisTarihi');
        const yanitlarAcilmaTarihi = this.field('yanitlarAcilmaTarihi');
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
      autoValue() {
        const tip = this.field('tip');
        const self = this;
        if (tip.isSet && _.contains(['deneme','canli'],tip.value) && self.isSet) {
          return self.value;
        } else {
          return self.unset();
        }
      },
      autoform: {
        class: 'optionalSaat',
        type() {
          const formId = AutoForm.getFormId();
          const tip = AutoForm.getFieldValue('tip', formId);
          if (_.contains(['deneme','canli'],tip)) {
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
      autoValue() {
        const tarih = this.field('yanitlarAcilmaTarihi');
        const saat = this.field('yanitlarAcilmaSaati');
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
    sinavKapanisiHatirlatmaZamani: {
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
      autoValue() {
        const cloned = this.field('_clonedFrom').isSet;
        if (this.isInsert && !cloned) {
          return [];
        }
      },
      custom() {
        const soru = this;
        const kurum = this.field('kurum');
        const egitimYili = this.field('egitimYili');
        const sinif = this.field('sinif');
        const cloned = this.field('_clonedFrom').isSet;
        const ders = this.field('ders');
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
                const uygunluk = Meteor.call('sorularSinavaUygunMu', _.pluck(soru.value, 'soruId'),kurum.value, M.C.Sinavlar.findOne({_id:soru.docId}).egitimYili,ders.value,sinif.value);
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
      custom() {
        if (this.isUpdate && this.isSet && this.value === false) {
          const sorular = this.field('sorular');
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
      custom() {
        const taslak = this.field('taslak');
        const sinavId = this.docId;
        const kilitli = this;
        if (taslak.isSet && taslak.value === true && kilitli.isSet && kilitli.value === true) {
          return 'taslakSinavKilitlenemez';
        }
        if (this.isSet && this.value === true) {
          const sorular = M.C.Sinavlar.findOne({_id: sinavId}).sorular;
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

M.C.Sinavlar.before.update((userId, doc, fields, modifier, options) => {
  const tip = modifier.$set && modifier.$set.tip;

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
    'soruSiraDegistir'(sinavId,soruId,yon) {
      check(sinavId, String);
      check(soruId, String);
      check(yon, String);

      const sinav = M.C.Sinavlar.findOne({_id: sinavId});
      if (!sinav) {
        M.L.ThrowError({error:'404',reason:'Sınav bulunamadı',details:'Sınav bulunamadı'});
      }

      const from = _.pluck(sinav.sorular, 'soruId').indexOf(soruId);
      if (from < 0) {
        M.L.ThrowError({error:'404',reason:'Soru sınavda bulunamadı',details:'Soru sınavda bulunamadı'});
      }

      if (!_.contains(['asagi','yukari'],yon)) {
        M.L.ThrowError({error:'403',reason:'Geçersiz yön',details:'Geçersiz yön'});
      }

      const to = yon === 'asagi' ? from+1 : from-1;

      const sorular = sinav.sorular;

      const temp = sorular[to];
      sorular[to] = sorular[from];
      sorular[from] = temp;

      const sonuc = M.C.Sinavlar.update({_id: sinav._id}, {$set: {
        kurum: sinav.kurum,
        ders: sinav.ders,
        sinif: sinav.sinif,
        sorular: sorular
      }});

      return sonuc;

    },
    'sepetiSinavaEkle'(sinavId) {
      check(sinavId, String);
      const sinav = M.C.Sinavlar.findOne({_id: sinavId});
      const uygunSorular = Meteor.call('sinavaUygunSorular',sinav.kurum,sinav.egitimYili,sinav.ders,sinav.sinif);
      const sepetSoruIdArray = uygunSorular && M.C.SoruSepetleri.find({createdBy: this.userId, soru: {$in: _.difference(uygunSorular, _.pluck(sinav.sorular, 'soruId'))}}, {sort: {createdAt: 1}}).map(sepet => sepet.soru);
      if (!sepetSoruIdArray || sepetSoruIdArray.length === 0) {
        M.L.ThrowError({error:'404',reason:'Soru bulunamadı',details:'Sepette sınava uygun soru bulunamadı'});
      }
      const soruIdleri = M.C.Sorular.find({_id: {$in: sepetSoruIdArray}}).map(soru => soru._id);
      Meteor.call('sinavaSoruEkleCikar',sinavId,soruIdleri,'ekle');
      return 'ok';
    },
    'sinavdakiSorulariBosalt'(sinavId) {
      check(sinavId, String);
      const sinav = M.C.Sinavlar.findOne({_id: sinavId});
      const soruIdleri = M.C.Sorular.find({_id: {$in: _.pluck(sinav.sorular, 'soruId')}}).map(soru => soru._id);
      Meteor.call('sinavaSoruEkleCikar',sinavId,soruIdleri,'cikar');
      return 'ok';
    },
    'sorularSinavaUygunMu'(soru,kurum,egitimYili,ders,sinif) {
      check(soru,[String]);
      check(kurum,String);
      check(egitimYili,String);
      check(ders,String);
      check(sinif,String);
      if (soru.length < 1) {
        return 'degil';
      }
      const sorular = Meteor.call('sinavaUygunSorular',kurum,egitimYili,ders,sinif);
      return sorular.length > 0 && _.intersection(sorular,soru).length === soru.length ? 'uygun' : 'degil';
    },
    'sinavaUygunSorular'(kurum,egitimYili,ders,sinif) {
      check(kurum,String);
      check(egitimYili,String);
      check(ders,String);
      check(sinif,String);
      const mufredatDers = M.C.Mufredat.find({
        kurum: kurum,
        egitimYili: egitimYili,
        ders: ders,
        sinif: sinif
      }).map(mufredat => mufredat.ders);
      const sorular = M.C.Sorular.find({
        aktif: true,
        taslak: false,
        kurum: kurum,
        'alan.sinif': sinif,
        'alan.ders': {$in: mufredatDers}
      }).map(soru => soru._id);
      return sorular;
    },
    'sinavaSoruEkleCikar'(sinavId,soruId,islem) {
      check(sinavId, String);
      check(soruId, Match.OneOf(String,[String]));
      check(islem, String);
      let soruIdleri;
      const currentUser = this.userId;

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

      const sinav = M.C.Sinavlar.findOne({_id: sinavId});
      if (!sinav) {
        M.L.ThrowError({error:'404',reason:'Sınav bulunamadı',details:'Sınav bulunamadı'});
      }

      if (M.L.userHasRole(currentUser, 'ogretmen')) {
        if (!_.contains(M.C.Users.findOne({_id: currentUser}).dersleri,sinav.ders)) {
          M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
        }
      }

      M.C.Sorular.find({_id: {$in: soruIdleri}}).forEach(soru => {
        if (!soru) {
          M.L.ThrowError({error:'404',reason:'Soru bulunamadı',details:'Soru bulunamadı'});
        }

        if (M.L.userHasRole(currentUser, 'ogretmen')) {
          if (!_.contains(M.C.Users.findOne({_id: currentUser}).dersleri,soru.alan.ders)) {
            M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
          }
        }

        if(islem === 'ekle' && _.contains(_.pluck(sinav.sorular, 'soruId'),soru._id)) {
          M.L.ThrowError({error:'403',reason:'Soru sınavda zaten var',details:'Soru sınavda zaten var'});
        }

        if(islem === 'cikar' && !_.contains(_.pluck(sinav.sorular, 'soruId'),soru._id)) {
          M.L.ThrowError({error:'403',reason:'Soru sınavda zaten yok',details:'Soru sınavda zaten yok'});
        }

        if (islem === 'ekle') {
          const uygunluk = Meteor.call('sorularSinavaUygunMu',[soru._id],sinav.kurum,sinav.egitimYili,sinav.ders,sinav.sinif);
          if (uygunluk !== 'uygun') {
            M.L.ThrowError({error:'403',reason:'Bu soru bu sınava eklenemez',details:'Bu soru bu sınava eklenemez'});
          }
        }
      });

      let yeniSoruIdleri = _.pluck(sinav.sorular, 'soruId') || [];

      if (islem === 'ekle') {
        yeniSoruIdleri = _.union(yeniSoruIdleri, soruIdleri);
      }

      if (islem === 'cikar') {
        yeniSoruIdleri = _.difference(yeniSoruIdleri, soruIdleri);
      }

      let sorular = yeniSoruIdleri.map(soruId => {
        return {
          soruId: soruId,
          zorlukDerecesi: M.C.Sorular.findOne({_id: soruId}).zorlukDerecesi,
          puan: 0
        }
      });

      if (sorular.length > 0) {

        const initialToplamZD = sorular.reduce((memo, soru) => {
          return memo + soru.zorlukDerecesi
        }, 0);

        sorular = sorular.map(soru => {
          return {
            soruId: soru.soruId,
            zorlukDerecesi: soru.zorlukDerecesi,
            puan: math.chain(soru.zorlukDerecesi).divide(initialToplamZD).multiply(100).round().done()
          }
        });

        const initialToplamPuan = sorular.reduce((memo, soru) => {
          return memo + soru.puan
        }, 0);

        const sortedSorular = _.sortBy(sorular, 'puan');
        const soruCount = sorular.length;
        const puanFarki = initialToplamPuan - 100;

        if (!!puanFarki) {
          for (let ix=0; ix < Math.abs(puanFarki); ix++) {
            let soruIndex = soruCount-ix-1;
            sorular = sorular.map(soru => {
              if (soru.soruId === sortedSorular[soruIndex].soruId) {
                soru.puan = soru.puan - ( puanFarki / Math.abs(puanFarki) );
              }
              return soru;
            })
          }
        }

      }

      const updateDoc = {
        kurum: sinav.kurum,
        ders: sinav.ders,
        sinif: sinav.sinif,
        sorular: sorular
      };

      const sonuc = M.C.Sinavlar.update({_id: sinav._id}, {$set: updateDoc});

      return sonuc;

    },
    'setSinavCanliStatus'(sinavId, newStatus) {
      check(sinavId, String);
      check(newStatus, String);

      if (M.L.userHasRole(this.userId, 'mudur')) {
        M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
      }

      const sinav = M.C.Sinavlar.findOne({_id: sinavId, tip: 'canli'});
      if (!sinav) {
        M.L.ThrowError({error:'404',reason:'Sınav bulunamadı',details:'Sınav bulunamadı'});
      }

      const user = M.C.Users.findOne({_id: this.userId});
      if (M.L.userHasRole(this.userId, 'ogretmen')) {
        if (!(_.contains(user.dersleri,sinav.ders) && user.kurum === sinav.kurum)) {
          M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
        }
      }

      if (M.L.userHasRole(this.userId, 'teknik')) {
        if (user.kurum !== sinav.kurum) {
          M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
        }
      }

      if (!_.contains(['running','paused','completed'],newStatus) || sinav.canliStatus === 'completed') {
        M.L.ThrowError({error:'400',reason:'Status hatalı',details:'Status hatalı'});
      }

      const updateDoc = {
        canliStatus: newStatus
      };

      const sonuc = M.C.Sinavlar.update({_id: sinav._id}, {$set: updateDoc});

      return sonuc;

    },
    'sinavIptal'(sinavId) {
      check(sinavId, String);

      if (M.L.userHasRole(this.userId, 'mudur')) {
        M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
      }

      const sinav = M.C.Sinavlar.findOne({_id: sinavId});
      if (!sinav) {
        M.L.ThrowError({error:'404',reason:'Sınav bulunamadı',details:'Sınav bulunamadı'});
      }

      const user = M.C.Users.findOne({_id: this.userId});
      if (M.L.userHasRole(this.userId, 'ogretmen')) {
        if (!(_.contains(user.dersleri,sinav.ders) && user.kurum === sinav.kurum)) {
          M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
        }
      }

      if (M.L.userHasRole(this.userId, 'teknik')) {
        if (user.kurum !== sinav.kurum) {
          M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
        }
      }

      const updateDoc = {
        iptal: true
      };

      const sonuc = M.C.Sinavlar.update({_id: sinav._id}, {$set: updateDoc});

      return sonuc;

    },
    'sinavTaslakDegistir'(sinavId) {
      check(sinavId, String);

      if (M.L.userHasRole(this.userId, 'mudur')) {
        M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
      }

      const sinav = M.C.Sinavlar.findOne({_id: sinavId});
      if (!sinav) {
        M.L.ThrowError({error:'404',reason:'Sınav bulunamadı',details:'Sınav bulunamadı'});
      }

      const user = M.C.Users.findOne({_id: this.userId});
      if (M.L.userHasRole(this.userId, 'ogretmen')) {
        if (!(_.contains(user.dersleri,sinav.ders) && user.kurum === sinav.kurum)) {
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

      const updateDoc = {
        taslak: !sinav.taslak
      };

      const sonuc = M.C.Sinavlar.update({_id: sinav._id}, {$set: updateDoc});

      return sonuc;

    },
    'sinavKilitle'(sinavId) {
      check(sinavId, String);

      if (M.L.userHasRole(this.userId, 'mudur')) {
        M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
      }

      const sinav = M.C.Sinavlar.findOne({_id: sinavId});
      if (!sinav) {
        M.L.ThrowError({error:'404',reason:'Sınav bulunamadı',details:'Sınav bulunamadı'});
      }

      const user = M.C.Users.findOne({_id: this.userId});
      if (M.L.userHasRole(this.userId, 'ogretmen')) {
        if (!(_.contains(user.dersleri,sinav.ders) && user.kurum === sinav.kurum)) {
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

      const updateDoc = {
        kilitli: true
      };

      const sonuc = M.C.Sinavlar.update({_id: sinav._id}, {$set: updateDoc});

      return sonuc;

    }
  });
}
