import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';

import { AutoForm } from 'meteor/aldeed:autoform';

import { M } from 'meteor/m:lib-core';

M.C.setUpCollection({
  object: 'Sorular',
  collection: 'sorular',
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
        type() {
          if (Meteor.user() && Meteor.user().role !== 'mitolojix') {
            return 'hidden';
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
              initials = words[0].substring(0,2).toLocaleUpperCase()
            }

            if (words && words.length === 2) {
              initials = words[0].substring(0,1) + words[1].substring(0,1)
            }

            let count = M.C.Sorular.find().count() + 1;
            count = s.pad(count,6,'0');

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
    alan: {
      label: 'Alan',
      type: Object
    },
    'alan.ders': {
      label: 'Ders',
      type: String,
      index: 1,
      custom() {
        const ders = this;
        if (ders.isSet && !_.contains(M.C.Dersler.find({},{fields: {_id: 1}}).map(ders => ders._id), ders.value)) {
          return 'notAllowed';
        }
        return true;
      },
      autoform: {
        class: 'browser-default',
        firstOption: 'Ders seçin',
        options() {
          const user = M.C.Users.findOne({_id: Meteor.userId()});
          if (user.role === 'ogretmen') {
            return M.C.Dersler.find({_id: {$in: user.dersleri}})
                                 .map(ders => {
                                   const {
                                     isim: label,
                                     _id: value,
                                   } = ders;
                                   return {
                                     label,
                                     value,
                                   };
                                 });
          } else {
            return M.C.Dersler.find()
                                 .map(ders => {
                                   const {
                                     isim: label,
                                     _id: value,
                                   } = ders;
                                   return {
                                     value,
                                     label,
                                   };
                                 });
          }
        }
      }
    },
    'alan.sinif': {
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
    'alan.mufredat': {
      type: String,
      autoValue() {
        if (Meteor.isServer) {
          const kurum = this.field('kurum');
          const ders = this.field('alan.ders');
          const sinif = this.field('alan.sinif');
          if (kurum.isSet && ders.isSet && sinif.isSet) {
            const mufredat = M.C.Mufredat.findOne({kurum: kurum.value, egitimYili: M.C.AktifEgitimYili.findOne().egitimYili, ders: ders.value, sinif: sinif.value});
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
      autoValue() {
        if (Meteor.isServer) {
          const kurum = this.field('kurum');
          const ders = this.field('alan.ders');
          const sinif = this.field('alan.sinif');
          if (kurum.isSet && ders.isSet && sinif.isSet) {
            const mufredat = M.C.Mufredat.findOne({kurum: kurum.value, egitimYili: M.C.AktifEgitimYili.findOne().egitimYili, ders: ders.value, sinif: sinif.value});
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
      autoValue() {
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
      custom() {
        const konu = this;
        const kurum = this.field('kurum');
        const ders = this.field('alan.ders');
        const sinif = this.field('alan.sinif');
        const kurumDersKonulari = kurum.isSet && ders.isSet && sinif.isSet && _.pluck(_.flatten(M.C.Mufredat.find({kurum: kurum.value, egitimYili: M.C.AktifEgitimYili.findOne().egitimYili, ders: ders.value, sinif: sinif.value}).map(mufredat => mufredat.konular)), 'konu');
        if (konu.isSet && !_.contains(kurumDersKonulari, konu.value)) {
          return 'dersKonusuHatali';
        }
        return true;
      },
      autoform: {
        class: 'browser-default',
        firstOption: 'Konu seçin',
        options(){
          const formId = AutoForm.getFormId();
          const kurum = Meteor.user().role !== 'mitolojix' ? Meteor.user().kurum : AutoForm.getFieldValue('kurum', formId);
          const ders = AutoForm.getFieldValue('alan.ders', formId);
          const sinif = AutoForm.getFieldValue('alan.sinif', formId);

          if (kurum && ders && sinif) {
            const kurumTumDersKonulari = _.pluck(_.flatten(M.C.Mufredat.find({kurum, egitimYili: M.C.AktifEgitimYili.findOne().egitimYili, ders, sinif}).map(mufredat => mufredat.konular)), 'konu');
            const kurumDersKonulari = _.uniq(kurumTumDersKonulari).sort((a, b) => {
              return a.localeCompare(b);
            });
            return kurumDersKonulari.map(konu => {
              return {
                label: konu,
                value: konu,
              };
            });
          }
          return [];
        }
      }
    },
    'alan.kazanimlar': {
      label: 'Kazanımlar',
      type: [String],
      minCount: 1,
      custom() {
        const kazanimlar = this.value;
        return _.uniq(kazanimlar).length === kazanimlar.length ? true : 'notUnique'
      },
      autoform: {
        type: 'select-checkbox',
        options(){
          const formId = AutoForm.getFormId();
          const kurum = Meteor.user().role !== 'mitolojix' ? Meteor.user().kurum : AutoForm.getFieldValue('kurum', formId);
          const ders = AutoForm.getFieldValue('alan.ders', formId);
          const sinif = AutoForm.getFieldValue('alan.sinif', formId);
          const konu = AutoForm.getFieldValue('alan.konu', formId);

          if (kurum && ders && sinif && konu) {
            const kurumDersKonuSu = _.findWhere(_.flatten(M.C.Mufredat.find({kurum, egitimYili: M.C.AktifEgitimYili.findOne().egitimYili, ders, sinif}).map(mufredat => mufredat.konular)), {konu});
            let kurumDersKonuKazanimlari = kurumDersKonuSu && kurumDersKonuSu.kazanimlar;
            kurumDersKonuKazanimlari = _.uniq(kurumDersKonuKazanimlari).sort((a, b) => {
              return a.localeCompare(b);
            });
            return kurumDersKonuKazanimlari.map(kazanim => {
              return {
                label: kazanim,
                value: kazanim,
              };
            });
          }
          return [];
        }
      }
    },
    'alan.kazanimlar.$': {
      label: 'Kazanım',
      type: String,
      custom() {
        const kazanim = this;
        const kurum = this.field('kurum');
        const ders = this.field('alan.ders');
        const sinif = this.field('alan.sinif');
        const konu = this.field('alan.konu');
        const kurumDersKonuSu = kurum.isSet && ders.isSet && sinif.isSet && _.findWhere(_.flatten(M.C.Mufredat.find({kurum: kurum.value, egitimYili: M.C.AktifEgitimYili.findOne().egitimYili, ders: ders.value, sinif: sinif.value}).map(mufredat => mufredat.konular)), {konu: konu.value});
        const kurumDersKonuKazanimlari = kurumDersKonuSu && kurumDersKonuSu.kazanimlar;
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
        options() {
          return M.E.SoruTipiObjects.map(t => {
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
    zorlukDerecesi: {
      label: 'Zorluk Derecesi',
      type: Number,
      allowedValues: M.E.ZorlukDereceleri,
      autoform: {
        class: 'browser-default',
        firstOption: 'Zorluk derecesi seçin',
        options() {
          return M.E.ZorlukDereceleri.map(zd => {
            return {
              label: zd.toString(),
              value: zd,
            };
          });
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
      autoValue() {
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
      autoValue() {
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
        type() {
          const formId = AutoForm.getFormId();
          const tip = AutoForm.getFieldValue('tip', formId);
          return !tip && 'hidden';
        }
      }
    },
    'yanit.dogruYanlis': {
      label: 'Doğru Yanlış',
      optional: true,
      type: Object,
      autoValue() {
        const tip = this.field('tip');
        const self = this;
        if (tip.isSet && tip.value === 'dogruYanlis' && self.isSet) {
          return self.value;
        } else {
          return self.unset();
        }
      },
      autoform: {
        type() {
          const formId = AutoForm.getFormId();
          const tip = AutoForm.getFieldValue('tip', formId);
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
      autoValue() {
        const tip = this.field('tip');
        const self = this;
        if (tip.isSet && tip.value === 'coktanTekSecmeli' && self.isSet) {
          return _.compact(self.value);
        } else {
          return self.unset();
        }
      },
      minCount: 4,
      maxCount: 4,
      custom() {
        let tip = this.field('tip');
        tip = tip && tip.value;
        if (tip === 'coktanTekSecmeli') {
          const secenekObjects = _.compact(this.value);
          if (secenekObjects.length > 1) {
            const dogruAdet = _.where(secenekObjects, {dogru: true}).length;
            if ( dogruAdet < 1 ) {return 'enAzBirDogruOlmali';}
            if ( dogruAdet > 1 ) {return 'sadeceBirDogruOlmali';}
            const metinler = M.L.RejectUndefinedFromArray(_.pluck(secenekObjects, 'secenekMetin'));
            const gorseller = M.L.RejectUndefinedFromArray(_.pluck(secenekObjects, 'secenekGorsel'));
            if (_.uniq(metinler).length !== metinler.length || _.uniq(gorseller).length !== gorseller.length) {
              return 'notUniqueYanitlar';
            }
          }
        }
        return true;
      },
      autoform: {
        type() {
          const formId = AutoForm.getFormId();
          const tip = AutoForm.getFieldValue('tip', formId);
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
      autoValue() {
        if (this.isSet) {
          return M.L.Trim(this.value);
        } else {
          this.unset();
        }
      },
      custom() {
        const metin = this;
        const gorsel = this.siblingField('secenekGorsel');
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
      autoValue() {
        if (this.isSet) {
          return this.value;
        } else {
          this.unset();
        }
      },
      custom() {
        const metin = this.siblingField('secenekMetin');
        const gorsel = this;
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
      autoValue() {
        const tip = this.field('tip');
        const self = this;
        if (tip.isSet && tip.value === 'coktanCokSecmeli' && self.isSet) {
          return _.compact(self.value);
        } else {
          return self.unset();
        }
      },
      minCount: 4,
      maxCount: 4,
      custom() {
        let tip = this.field('tip');
        tip = tip && tip.value;
        if (tip === 'coktanCokSecmeli') {
          const secenekObjects = _.compact(this.value);
          if (secenekObjects.length > 1) {
            const dogruAdet = _.where(secenekObjects, {dogru: true}).length;
            if ( dogruAdet < 1 ) {return 'enAzBirDogruOlmali';}
            const metinler = M.L.RejectUndefinedFromArray(_.pluck(secenekObjects, 'secenekMetin'));
            const gorseller = M.L.RejectUndefinedFromArray(_.pluck(secenekObjects, 'secenekGorsel'));
            if (_.uniq(metinler).length !== metinler.length || _.uniq(gorseller).length !== gorseller.length) {
              return 'notUniqueYanitlar';
            }
          }
        }
        return true;
      },
      autoform: {
        type() {
          const formId = AutoForm.getFormId();
          const tip = AutoForm.getFieldValue('tip', formId);
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
      autoValue() {
        if (this.isSet) {
          return M.L.Trim(this.value);
        } else {
          this.unset();
        }
      },
      custom() {
        const metin = this;
        const gorsel = this.siblingField('secenekGorsel');
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
      autoValue() {
        if (this.isSet) {
          return this.value;
        } else {
          this.unset();
        }
      },
      custom() {
        const metin = this.siblingField('secenekMetin');
        const gorsel = this;
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
      autoValue() {
        const tip = this.field('tip');
        const self = this;
        if (tip.isSet && tip.value === 'siralama' && self.isSet) {
          return _.compact(self.value);
        } else {
          return self.unset();
        }
      },
      custom() {
        let tip = this.field('tip');
        tip = tip && tip.value;
        if (tip === 'siralama') {
          const secenekObjects = _.compact(this.value);
          if (secenekObjects.length > 1) {
            const metinler = M.L.RejectUndefinedFromArray(_.pluck(secenekObjects, 'metin'));
            const gorseller = M.L.RejectUndefinedFromArray(_.pluck(secenekObjects, 'gorsel'));
            if (_.uniq(metinler).length !== metinler.length || _.uniq(gorseller).length !== gorseller.length) {
              return 'notUniqueYanitlar';
            }
          }
        }
        return true;
      },
      autoform: {
        type() {
          const formId = AutoForm.getFormId();
          const tip = AutoForm.getFieldValue('tip', formId);
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
      custom() {
        const metin = this;
        const gorsel = this.siblingField('gorsel');
        if (!metin.isSet && !gorsel.isSet) {
          return 'metinGorselBiriniGir';
        }
        return true;
      },
      autoValue() {
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
      custom() {
        const metin = this.siblingField('metin');
        const gorsel = this;
        if (!metin.isSet && !gorsel.isSet) {
          return 'metinGorselBiriniGir';
        }
        return true;
      },
      autoValue() {
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
      autoValue() {
        const tip = this.field('tip');
        const self = this;
        if (tip.isSet && tip.value === 'eslestirme' && self.isSet) {
          return _.compact(self.value);
        } else {
          return self.unset();
        }
      },
      minCount: 5,
      maxCount: 5,
      custom() {
        let tip = this.field('tip');
        tip = tip && tip.value;
        if (tip === 'eslestirme') {
          const secenekObjects = _.compact(this.value);
          if (secenekObjects.length > 1) {
            const solMetinler = M.L.RejectUndefinedFromArray(_.pluck(secenekObjects, 'solMetin'));
            const solGorseller = M.L.RejectUndefinedFromArray(_.pluck(secenekObjects, 'solGorsel'));
            const sagMetinler = M.L.RejectUndefinedFromArray(_.pluck(secenekObjects, 'sagMetin'));
            const sagGorseller = M.L.RejectUndefinedFromArray(_.pluck(secenekObjects, 'sagGorsel'));
            if (_.uniq(solMetinler).length !== solMetinler.length || _.uniq(solGorseller).length !== solGorseller.length || _.uniq(sagMetinler).length !== sagMetinler.length || _.uniq(sagGorseller).length !== sagGorseller.length) {
              return 'notUniqueYanitlar';
            }
          }
        }
        return true;
      },
      autoform: {
        type() {
          const formId = AutoForm.getFormId();
          const tip = AutoForm.getFieldValue('tip', formId);
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
      custom() {
        const metin = this;
        const gorsel = this.siblingField('solGorsel');
        if (!metin.isSet && !gorsel.isSet) {
          return 'metinGorselBiriniGir';
        }
        return true;
      },
      autoValue() {
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
      custom() {
        const metin = this.siblingField('solMetin');
        const gorsel = this;
        if (!metin.isSet && !gorsel.isSet) {
          return 'metinGorselBiriniGir';
        }
        return true;
      },
      autoValue() {
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
      custom() {
        const metin = this;
        const gorsel = this.siblingField('sagGorsel');
        if (!metin.isSet && !gorsel.isSet) {
          return 'metinGorselBiriniGir';
        }
        return true;
      },
      autoValue() {
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
      custom() {
        const metin = this.siblingField('sagMetin');
        const gorsel = this;
        if (!metin.isSet && !gorsel.isSet) {
          return 'metinGorselBiriniGir';
        }
        return true;
      },
      autoValue() {
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
      autoValue() {
        const tip = this.field('tip');
        const self = this;
        if (tip.isSet && tip.value === 'boslukDoldurma' && self.isSet) {
          return self.value;
        } else {
          return self.unset();
        }
      },
      autoform: {
        type() {
          const formId = AutoForm.getFormId();
          const tip = AutoForm.getFieldValue('tip', formId);
          return tip !== 'boslukDoldurma' && 'hidden';
        }
      }
    },
    'yanit.boslukDoldurma.cevap': {
      label: '[Boşluk] Doldurma',
      type: String,
      min: 3,
      max: 512,
      autoValue() {
        if (this.isSet) {
          return M.L.TrimButKeepParagraphs(this.value);
        } else {
          this.unset();
        }
      },
      custom() {
        let tip = this.field('tip');
        tip = tip && tip.value;
        if (tip === 'boslukDoldurma') {
          let cevap = this;
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
        options() {
          return M.E.Levenshtein.map(l => {
            return {
              label: l.toString(),
              value: l,
            };
          });
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
      custom() {
        const taslak = this;
        const soruId = this.docId;
        if (taslak.isUpdate && taslak.isSet && taslak.value === true) {
          const sinav = M.C.Sinavlar.findOne({'sorular.soruId': soruId});
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
      custom() {
        const soruId = this.docId;
        const taslak = this.field('taslak');
        const kilitli = this;
        if (taslak.isSet && taslak.value === true && kilitli.isSet && kilitli.value === true) {
          return 'taslakSoruKilitlenemez';
        } else if (!taslak.isSet && kilitli.isSet && kilitli.value === true) {
          const taslak = M.C.Sorular.findOne({_id: soruId}).taslak === true;
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

M.C.Sorular.before.update((userId, doc, fields, modifier, options) => {
  const tip = modifier.$set && modifier.$set.tip;
  const tumTip = [
    'dogruYanlis',
    'coktanTekSecmeli',
    'coktanCokSecmeli',
    'siralama',
    'eslestirme',
    'boslukDoldurma'
  ];

  if (tip) {
    modifier.$unset = modifier.$unset || {};
    const unset = _.keys(modifier.$unset);
    unset.push(tip);

    const digerTip = _.difference(tumTip, unset);

    digerTip.forEach(t => {
      const path = 'yanit.' + t;
      let obj = {};
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
    'soruTaslakDegistir'(soruId) {
      check(soruId, String);

      if (M.L.userHasRole(this.userId, 'mudur')) {
        M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
      }

      const soru = M.C.Sorular.findOne({_id: soruId});
      if (!soru) {
        M.L.ThrowError({error:'404',reason:'Soru bulunamadı',details:'Soru bulunamadı'});
      }

      const user = M.C.Users.findOne({_id: this.userId});
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

      const sinav = M.C.Sinavlar.findOne({'sorular.soruId': soruId});
      if (sinav && soru.taslak === false) {
        M.L.ThrowError({error:'sinavdakiSoruTaslakYapilamaz',reason:'Sınavdaki soru taslak yapılamaz',details:'Sınavdaki soru taslak yapılamaz'});
      }

      const updateDoc = {
        taslak: !soru.taslak
      };

      const sonuc = M.C.Sorular.update({_id: soru._id}, {$set: updateDoc});

      return sonuc;

    },
    'soruKilitle'(soruId) {
      check(soruId, String);

      if (M.L.userHasRole(this.userId, 'mudur')) {
        M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
      }

      const soru = M.C.Sorular.findOne({_id: soruId});
      if (!soru) {
        M.L.ThrowError({error:'404',reason:'Soru bulunamadı',details:'Soru bulunamadı'});
      }

      const user = M.C.Users.findOne({_id: this.userId});
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

      const updateDoc = {
        kilitli: true
      };

      return M.C.Sorular.update({_id: soru._id}, {$set: updateDoc});
    }
  })
}
