import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { AutoForm } from 'meteor/aldeed:autoform';

import { M } from 'meteor/m:lib-core';

import './liste.html';
import './detay.html';

Template.soruListe.onCreated(function() {
  this.subscribe('sorular');
  this.subscribe('mufredatlar');
  this.subscribe('fssorugorsel');
  this.searchResults = new ReactiveVar({});
  this.autorun(() => {
    const keywords = Session.get('keywords');
    const filters = Session.get('filters');
    if (_.isString(keywords) || _.isObject(filters)) {
      Meteor.call('search.soru',keywords, filters, (err,res) => {
        if (err) {
          toastr.error(M.E.BilinmeyenHataMessage);
          this.searchResults.set({});
        }
        if (res) {
          if (res==='all') {
            this.searchResults.set({});
          } else {
            this.searchResults.set({_id: {$in: res}});
          }
        }
      })
    } else {
      this.searchResults.set({});
    }
  });
});

Template.soruListe.helpers({
  sorular(){
    const selector = Template.instance().searchResults.get();
    const sorularCursor = M.C.Sorular.find(selector,{sort:{kurum: 1, 'alan.ders': 1, 'alan.sinif': 1, 'alan.konu': 1, kod: 1}}); //TODO: sort by dersCollate
    return sorularCursor.count() && {cursor: sorularCursor, count: sorularCursor.count()};
  }
});

Template.soruKart.helpers({
  inCart() {
    return M.C.SoruSepetleri.findOne({createdBy: Meteor.userId(), soru: this._id});
  },
  inFavori() {
    return M.C.SoruFavorileri.findOne({createdBy: Meteor.userId(), soru: this._id});
  }
});

Template.soruKart.events({
  'click [data-trigger="cart"]'(e,t) {
    const soru = t.data._id;
    const sepet = M.C.SoruSepetleri.findOne({createdBy: Meteor.userId(), soru});
    if (sepet) {
      M.C.SoruSepetleri.remove({_id: sepet._id});
    } else {
      M.C.SoruSepetleri.insert({soru});
    }
  },
  'click [data-trigger="favorite"]'(e,t) {
    const soru = t.data._id;
    const favori = M.C.SoruFavorileri.findOne({createdBy: Meteor.userId(), soru});
    if (favori) {
      M.C.SoruFavorileri.remove({_id: favori._id});
    } else {
      M.C.SoruFavorileri.insert({soru});
    }
  },
  'click [data-trigger="onizleme"]'(e,t) {
    soruOnizlemeView = Blaze.renderWithData(Template.soruOnizlemeModal, {_id: t.data._id}, document.getElementsByTagName('main')[0]);
  }
});

Template.filterSoru.helpers({
  filterSoruForm() {
    return new SimpleSchema({
      kurum: {
        label: 'Kurum',
        type: String,
        optional: true,
        autoform: {
          type() {
            if (Meteor.user() && Meteor.user().role !== 'mitolojix') {
              return 'hidden';
            }
          },
          value() {
            if (Meteor.user() && Meteor.user().role !== 'mitolojix') {
              return Meteor.user().kurum;
            }
          },
          class: 'browser-default',
          firstOption: 'Tümü',
          options() {
            let kurumlar = [];
            if (Meteor.user().role === 'mitolojix') {
              kurumlar = _.union(M.C.Kurumlar.find({}, {sort: {isimCollate: 1}})
                          .map(kurum => {
                            const {
                              isim: label,
                              _id: value,
                            } = kurum;
                            return {
                              label,
                              value,
                            };
                          })
              );
            } else {
              const userKurum = M.C.Kurumlar.findOne({_id: Meteor.user().kurum});
              kurumlar.push({label: userKurum.isim, value: userKurum._id});
            }
            return kurumlar;
          }
        }
      },
      egitimYili: {
        label: 'Eğitim Yılı',
        type: String,
        optional: true,
        autoform: {
          class: 'browser-default',
          firstOption: 'Tümü',
          options(){
            return M.E.EgitimYiliObjects.map(s => {
              const {
                label,
                name: value,
              } = s;
              return {
                label,
                value,
              };
            });
          }
        }
      },
      ders: {
        label: 'Ders',
        type: String,
        optional: true,
        autoform: {
          class: 'browser-default',
          firstOption: 'Tümü',
          options() {
            if (M.L.userHasRole(Meteor.userId(), 'ogretmen')) {
              return M.C.Dersler.find({_id: {$in: Meteor.user().dersleri}})
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
                                    label,
                                    value,
                                  };
                                });
            }
          }
        }
      },
      sinif: {
        label: 'Sınıf',
        type: String,
        optional: true,
        autoform: {
          class: 'browser-default',
          firstOption: 'Tümü',
          options() {
            return M.E.Sinif.map(sinif => {
              return {
                label: M.L.enumLabel(sinif),
                value: sinif,
              };
            });
          }
        }
      },
      tip: {
        label: 'Soru Tipi',
        type: String,
        optional: true,
        autoform: {
          class: 'browser-default',
          firstOption: 'Tümü',
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
      soruSahibi: {
        label: 'Soru Sahibi',
        type: String,
        optional: true,
        autoform: {
          type() {
            if (Meteor.user() && Meteor.user().role === 'mudur') {
              return 'hidden';
            }
          },
          class: 'browser-default',
          firstOption: 'Herkes',
          options() {
            return [{
              label: 'Kendi Sorularım', value: Meteor.userId()
            }];
          }
        }
      },
      konu: {
        label: 'Konu',
        type: String,
        optional: true,
        autoform: {
          type() {
            const formId = AutoForm.getFormId();
            const kurum = AutoForm.getFieldValue('kurum', formId);
            const egitimYili = AutoForm.getFieldValue('egitimYili', formId);
            const ders = AutoForm.getFieldValue('ders', formId);
            const sinif = AutoForm.getFieldValue('sinif', formId);
            if (!kurum || !egitimYili || !ders || !sinif) {
              return 'hidden';
            }
          },
          class: 'browser-default',
          firstOption: 'Tümü',
          options() {
            const formId = AutoForm.getFormId();
            const kurum = AutoForm.getFieldValue('kurum', formId);
            const egitimYili = AutoForm.getFieldValue('egitimYili', formId);
            const ders = AutoForm.getFieldValue('ders', formId);
            const sinif = AutoForm.getFieldValue('sinif', formId);
            const konular = M.C.Mufredat.findOne({
              $and: [
                {kurum: kurum},
                {egitimYili: egitimYili},
                {ders: ders},
                {sinif: sinif}
              ]
            });
            const uniqueSortedKonuListesi = konular && konular.konular && _.sortBy(_.uniq(konular.konular));
            return  uniqueSortedKonuListesi && uniqueSortedKonuListesi.map(konu => {
              return {
                label: konu.konu,
                value: konu.konu
              }
            });
          }
        }
      }
    });
  }
});

AutoForm.hooks({
  filterSoruForm: {
    onSubmit() {
      return false;
    }
  }
});

Template.filterSoru.onRendered(function(){
  this.autorun(() => {
    let filters = {};
    const kurum = AutoForm.getFieldValue('kurum', 'filterSoruForm'),
      egitimYili  = AutoForm.getFieldValue('egitimYili', 'filterSoruForm'),
      ders  = AutoForm.getFieldValue('ders', 'filterSoruForm'),
      sinif = AutoForm.getFieldValue('sinif', 'filterSoruForm'),
      tip = AutoForm.getFieldValue('tip', 'filterSoruForm'),
      soruSahibi = AutoForm.getFieldValue('soruSahibi', 'filterSoruForm'),
      konu = AutoForm.getFieldValue('konu','filterSoruForm');

    if (kurum) {
      filters.kurum = kurum;
    }

    if (egitimYili) {
      filters.egitimYili = egitimYili;
    }

    if (ders) {
      filters.ders = ders;
    }

    if (sinif) {
      filters.sinif = sinif;
    }

    if (tip) {
      filters.tip = tip;
    }

    if (soruSahibi) {
      filters.soruSahibi = soruSahibi;
    }

    if(konu) {
      filters.konu = konu;
    }

    Session.set('filters', filters);

  })
});
