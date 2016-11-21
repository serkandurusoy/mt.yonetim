import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { AutoForm } from 'meteor/aldeed:autoform';

import { M } from 'meteor/m:lib-core';

import './liste.html';

Template.soruSepeti.onCreated(function() {
  this.subscribe('mufredatlar');
  this.searchResults = new ReactiveVar({_id: {$in: [""]}});
  this.autorun(() => {
    const keywords = Session.get('keywords');
    const filters = Session.get('filters');

    let selector = {};

    const sepettekiSoruIdleri = _.pluck(M.C.SoruSepetleri.find({createdBy: Meteor.userId()}).fetch(),'soru');
    selector._id = {$in: sepettekiSoruIdleri};

    if (_.isString(keywords) || _.isObject(filters)) {
      Meteor.call('search.soruSepeti',keywords, filters, (err,res) => {
        if (err) {
          toastr.error(M.E.BilinmeyenHataMessage);
          this.searchResults.set(selector);
        }
        if (res) {
          if (res==='all') {
            this.searchResults.set(selector);
          } else {
            selector._id = {$in: res};
            this.searchResults.set(selector);
          }
        }
      })
    }
    this.searchResults.set(selector);
  });
});

Template.soruSepeti.helpers({
  sorular(){
    const selector = Template.instance().searchResults.get();
   //TODO: sort and group by relevant fields
    const sorularCursor = M.C.Sorular.find(selector);
    return sorularCursor.count() && {cursor: sorularCursor, count: sorularCursor.count()};
  }
});

Template.soruSepeti.events({
  'click [data-trigger="bosalt"]'(e,t) {
    e.preventDefault();
    Meteor.call('soruSepetiBosalt', (err,res) => {
      if (err) {
        toastr.error(M.E.BilinmeyenHataMessage)
      }
      if (res) {
        toastr.success('Sepetinizdeki tüm sorular boşaltıldı.')
      }
    });
  }
});

Template.filterSoruSepeti.helpers({
  filterSoruSepetiForm() {
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
                  value: konu.konu,
                }
              });
          }
        }
      }
    });
  }
});

AutoForm.hooks({
  filterSoruSepetiForm: {
    onSubmit() {
      return false;
    }
  }
});

Template.filterSoruSepeti.onRendered(function(){
  this.autorun(() => {
    let filters = {};
    const kurum = AutoForm.getFieldValue('kurum', 'filterSoruSepetiForm'),
      egitimYili  = AutoForm.getFieldValue('egitimYili', 'filterSoruSepetiForm'),
      ders  = AutoForm.getFieldValue('ders', 'filterSoruSepetiForm'),
      sinif = AutoForm.getFieldValue('sinif', 'filterSoruSepetiForm'),
      tip = AutoForm.getFieldValue('tip', 'filterSoruSepetiForm'),
      soruSahibi = AutoForm.getFieldValue('soruSahibi', 'filterSoruSepetiForm'),
      konu = AutoForm.getFieldValue('konu','filterSoruSepetiForm');

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
