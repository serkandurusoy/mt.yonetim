import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { AutoForm } from 'meteor/aldeed:autoform';

import { M } from 'm:lib-core';

import './liste.html';

Template.sinavListe.onCreated(function() {
  this.subscribe('sinavlar');
  this.subscribe('mufredatlar');
  this.searchResults = new ReactiveVar({});
  this.autorun(() => {
    const keywords = Session.get('keywords');
    const filters = Session.get('filters');
    if (_.isString(keywords) || _.isObject(filters)) {
      Meteor.call('search.sinav',keywords, filters, (err,res) => {
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

Template.sinavListe.helpers({
  sinavlar(){
    const selector = Template.instance().searchResults.get();
    const sinavlarCursor = M.C.Sinavlar.find(selector,{sort:{kurum: 1, egitimYili: -1, ders: 1, sinif: 1, acilisZamani: -1}}); //TODO: sort by dersCollate
    return sinavlarCursor.count() && {cursor: sinavlarCursor, count: sinavlarCursor.count()};
  }
});

Template.filterSinav.helpers({
  filterSinavForm() {
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
                              _id : value,
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
        label: 'Test Tipi',
        type: String,
        optional: true,
        autoform: {
          class: 'browser-default',
          firstOption: 'Tümü',
          options() {
            const options = M.E.SinavTipiObjects.map(t => {
              const {
                label,
                name: value,
              } = t;
              return {
                label,
                value,
              };
            });
            return options;
          }
        }
      },
      sinavSahibi: {
        label: 'Test Sahibi',
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
              label: 'Kendi Testlerim', value: Meteor.userId()
            }];
          }
        }
      },
      sinavDurumu: {
        label: 'Test Durumu',
        type: String,
        optional: true,
        autoform: {
          class: 'browser-default',
          firstOption: 'Tümü',
          options() {
            return [
              {label: 'Taslak', value: 'taslak'},
              {label: 'Kilitli', value: 'kilitli'},
              {label: 'Bekliyor', value: 'bekliyor'},
              {label: 'Yayında', value: 'yayinda'},
              {label: 'Tamamlandı', value: 'tamamlandi'},
              {label: 'İptal', value: 'iptal'}
            ];
          }
        }
      },
      konu: {
        label: 'Konu',
        type: String,
        optional: true,
        autoform:{
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
          options(){
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
  filterSinavForm: {
    onSubmit() {
      return false;
    }
  }
});

Template.filterSinav.onRendered(function(){
  this.autorun(() => {
    let filters = {};
    const kurum = AutoForm.getFieldValue('kurum', 'filterSinavForm'),
      egitimYili  = AutoForm.getFieldValue('egitimYili', 'filterSinavForm'),
      ders  = AutoForm.getFieldValue('ders', 'filterSinavForm'),
      sinif = AutoForm.getFieldValue('sinif', 'filterSinavForm'),
      tip = AutoForm.getFieldValue('tip', 'filterSinavForm'),
      sinavDurumu = AutoForm.getFieldValue('sinavDurumu', 'filterSinavForm'),
      sinavSahibi = AutoForm.getFieldValue('sinavSahibi', 'filterSinavForm'),
      konu = AutoForm.getFieldValue('konu','filterSinavForm');

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

    if (sinavDurumu) {
      filters.sinavDurumu = sinavDurumu;
    }

    if (sinavSahibi) {
      filters.sinavSahibi = sinavSahibi;
    }

    if(konu) {
      filters.konu = konu;
    }

    Session.set('filters', filters);

  })
});
