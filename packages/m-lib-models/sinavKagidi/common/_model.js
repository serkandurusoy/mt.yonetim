import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _ } from 'meteor/underscore';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { M } from 'meteor/m:lib-core';

M.C.SinavKagitlari = new Mongo.Collection('sinavkagitlari');

M.C.SinavKagitlari.Schema = new SimpleSchema({
  kurum: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    index: 1,
    denyUpdate: true,
    autoValue() {
      const ogrenci = this.field('ogrenci');
      if (this.isInsert && ogrenci.isSet) {
        return M.C.Users.findOne({_id: ogrenci.value}).kurum;
      }
    }
  },
  ogrenci: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    index: 1,
    denyUpdate: true
  },
  sinif: {
    type: String,
    index: 1,
    denyUpdate: true,
    autoValue() {
      const ogrenci = this.field('ogrenci');
      if (this.isInsert && ogrenci.isSet) {
        return M.C.Users.findOne({_id: ogrenci.value}).sinif;
      }
    }
  },
  sube: {
    type: String,
    denyUpdate: true,
    autoValue() {
      const ogrenci = this.field('ogrenci');
      if (this.isInsert && ogrenci.isSet) {
        return M.C.Users.findOne({_id: ogrenci.value}).sube;
      }
    }
  },
  egitimYili: {
    type: String,
    allowedValues: M.E.EgitimYili,
    index: 1,
    denyUpdate: true,
    autoValue() {
      if (this.isInsert) {
        return M.C.AktifEgitimYili.findOne().egitimYili;
      }
    }
  },
  sinav: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    index: 1,
    denyUpdate: true,
    custom() {
      if (this.isSet) {
        const hit = M.C.Sinavlar.findOne({_id: this.value});
        return hit ? true : 'notAllowed';
      }
    }
  },
  tip: {
    type: String,
    allowedValues: M.E.SinavTipi,
    denyUpdate: true,
    autoValue() {
      const sinav = this.field('sinav');
      if (this.isInsert && sinav.isSet) {
        return M.C.Sinavlar.findOne({_id: sinav.value}).tip;
      }
    }
  },
  iptal: {
    type: Boolean,
    defaultValue: false
  },
  ogrenciSinavaGirdi: {
    type: Boolean,
    index: -1,
    denyUpdate: true
  },
  baslamaZamani: {
    type: Date,
    index: -1,
    denyUpdate: true,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
    }
  },
  maxBitirmeZamani: {
    type: Date,
    denyUpdate: true,
    autoValue() {
      const sinavId = this.field('sinav');
      if (this.isInsert && sinavId.isSet) {
        const sinav = M.C.Sinavlar.findOne({_id: sinavId.value});
        if (sinav.tip === 'canli') {
          return sinav.kapanisZamani;
        } else {
          const now = new Date();
          const olasiBitirme = new Date( now.getTime() + parseInt(sinav.sure) * 60 * 1000 );
          return olasiBitirme.getTime() < sinav.kapanisZamani.getTime() ? olasiBitirme : sinav.kapanisZamani;
        }
      }
    }
  },
  yanitlarAcilmaZamani: {
    type: Date,
    denyUpdate: true,
    autoValue() {
      const sinavId = this.field('sinav');
      if (this.isInsert && sinavId.isSet) {
        const sinav = M.C.Sinavlar.findOne({_id: sinavId.value});
        return sinav.yanitlarAcilmaZamani ? sinav.yanitlarAcilmaZamani : sinav.kapanisZamani;
      }
    }
  },
  bitirmeZamani: {
    type: Date,
    index: -1,
    optional: true,
    denyInsert: true
  },
  puan: {
    type: Number,
    index: -1,
    optional: true,
    denyInsert: true
  },
  dogumTarihi: {
    type: Date,
    denyUpdate: true,
    index: 1,
    autoValue() {
      const ogrenci = this.field('ogrenci');
      if (this.isInsert && ogrenci.isSet) {
        return M.C.Users.findOne({_id: ogrenci.value}).dogumTarihi;
      }
    }
  },
  nameCollate: {
    type: String,
    denyUpdate: true,
    index: 1,
    autoValue() {
      const ogrenci = this.field('ogrenci');
      if (this.isInsert && ogrenci.isSet) {
        return M.C.Users.findOne({_id: ogrenci.value}).nameCollate;
      }
    }
  },
  lastNameCollate: {
    type: String,
    denyUpdate: true,
    index: 1,
    autoValue() {
      const ogrenci = this.field('ogrenci');
      if (this.isInsert && ogrenci.isSet) {
        return M.C.Users.findOne({_id: ogrenci.value}).lastNameCollate;
      }
    }
  },
  cinsiyet: {
    type: String,
    denyUpdate: true,
    index: -1,
    autoValue() {
      const ogrenci = this.field('ogrenci');
      if (this.isInsert && ogrenci.isSet) {
        return M.C.Users.findOne({_id: ogrenci.value}).cinsiyet;
      }
    }
  },
  puanOrtalamayaGirdi: {
    type: Boolean,
    index: -1,
    optional: true,
    denyInsert: true
  },
  yanitlar: {
    type: [Object],
    minCount: 1
  },
  'yanitlar.$.soruId': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
    custom() {
      const sinav = this.field('sinav');
      const soruId = this;
      if (this.isInsert && soruId.isSet && sinav.isSet) {
        const hit = M.C.Sinavlar.findOne({_id: sinav.value, 'sorular.soruId': soruId.value});
        return hit ? true : 'notAllowed';
      }
    }
  },
  'yanitlar.$.tip': {
    type: String,
    denyUpdate: true,
    autoValue() {
      const soruId = this.siblingField('soruId');
      if (this.isInsert && soruId.isSet) {
        return M.C.Sorular.findOne({_id: soruId.value}).tip;
      }
    }
  },
  'yanitlar.$.kod': {
    type: String,
    denyUpdate: true,
    autoValue() {
      const soruId = this.siblingField('soruId');
      if (this.isInsert && soruId.isSet) {
        return M.C.Sorular.findOne({_id: soruId.value}).kod;
      }
    }
  },
  'yanitlar.$.zorlukDerecesi': {
    type: Number,
    denyUpdate: true,
    autoValue() {
      const sinav = this.field('sinav');
      const soruId = this.siblingField('soruId');
      if (this.isInsert && soruId.isSet && sinav.isSet) {
        return _.findWhere(M.C.Sinavlar.findOne({_id: sinav.value}).sorular, {soruId: soruId.value}).zorlukDerecesi;
      }
    }
  },
  'yanitlar.$.puan': {
    type: Number,
    denyUpdate: true,
    autoValue() {
      const sinav = this.field('sinav');
      const soruId = this.siblingField('soruId');
      if (this.isInsert && soruId.isSet && sinav.isSet) {
        return _.findWhere(M.C.Sinavlar.findOne({_id: sinav.value}).sorular, {soruId: soruId.value}).puan;
      }
    }
  },
  'yanitlar.$.yonerge': {
    type: String,
    denyUpdate: true,
    autoValue() {
      const soruId = this.siblingField('soruId');
      if (this.isInsert && soruId.isSet) {
        return M.C.Sorular.findOne({_id: soruId.value}).soru.yonerge;
      }
    }
  },
  'yanitlar.$.metin': {
    type: String,
    denyUpdate: true,
    optional: true,
    autoValue() {
      const soruId = this.siblingField('soruId');
      if (this.isInsert && soruId.isSet) {
        const metin = M.C.Sorular.findOne({_id: soruId.value}).soru.metin;
        if (metin) {
          return metin;
        }
      }
    }
  },
  'yanitlar.$.gorsel': {
    type: String,
    denyUpdate: true,
    optional: true,
    autoValue() {
      const soruId = this.siblingField('soruId');
      if (this.isInsert && soruId.isSet) {
        const gorsel = M.C.Sorular.findOne({_id: soruId.value}).soru.gorsel;
        if (gorsel) {
          return gorsel;
        }
      }
    }
  },
  'yanitlar.$.yanit': {
    type: Object,
    blackbox: true
  },
  'yanitlar.$.yanitlandi': {
    type: Number,
    defaultValue: 0
  },
  'yanitlar.$.dogru': {
    type: Boolean,
    defaultValue: false
  }
});

M.C.SinavKagitlari.attachSchema(M.C.SinavKagitlari.Schema);

if (Meteor.isServer) {
  M.C.SinavKagitlari._ensureIndex({ogrenci: 1, sinav: 1}, { unique: true });
}
