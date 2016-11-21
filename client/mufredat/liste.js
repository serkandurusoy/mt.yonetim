import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { AutoForm } from 'meteor/aldeed:autoform';

import { M } from 'meteor/m:lib-core';

import './liste.html';

Template.mufredatListe.onCreated(function() {
  this.subscribe('mufredatlar');
  this.subscribe('fsdersicerik');
  this.searchResults = new ReactiveVar({});
  this.autorun(() => {
    const keywords = Session.get('keywords');
    const filters = Session.get('filters');
    if (_.isString(keywords) || _.isObject(filters)) {
      Meteor.call('search.mufredat',keywords, filters, (err,res) => {
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

Template.mufredatListe.helpers({
  mufredat(){
    const selector = Template.instance().searchResults.get();
    const mufredatCursor = M.C.Mufredat.find(selector, {sort: {kurum: 1, egitimYili: 1, ders: 1, sinif: 1}});
    return mufredatCursor.count() && {cursor: mufredatCursor, count: mufredatCursor.count()};
  }
});

Template.filterMufredat.helpers({
  filterMufredatForm() {
    return new SimpleSchema({
      kurum: {
        label: 'Kurum',
        type: String,
        optional: true,
        autoform: {
          type() {
            if (Meteor.user() && !['mitolojix','teknik'].includes(Meteor.user().role)) {
              return 'hidden';
            }
          },
          value() {
            if (Meteor.user() && !['mitolojix','teknik'].includes(Meteor.user().role)) {
              return Meteor.user().kurum;
            }
          },
          class: 'browser-default',
          firstOption: 'Tümü',
          options() {
            let kurumlar = [];
            const userKurum = M.C.Kurumlar.findOne({_id: Meteor.user().kurum});
            if (Meteor.user().role === 'mitolojix') {
              kurumlar = _.union({label: 'Mitolojix', value: 'mitolojix'}, M.C.Kurumlar.find({}, {sort: {isimCollate: 1}})
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
              kurumlar = _.union({label: 'Mitolojix', value: 'mitolojix'}, {label: userKurum.isim, value: userKurum._id});
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
              return M.C.Dersler.find().map(ders => {
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
      }
    });
  }
});

AutoForm.hooks({
  filterMufredatForm: {
    onSubmit() {
      return false;
    }
  }
});

Template.filterMufredat.onRendered(function(){
  this.autorun(() => {
    let filters = {};
    const kurum = AutoForm.getFieldValue('kurum', 'filterMufredatForm'),
      egitimYili  = AutoForm.getFieldValue('egitimYili', 'filterMufredatForm'),
      ders  = AutoForm.getFieldValue('ders', 'filterMufredatForm'),
      sinif = AutoForm.getFieldValue('sinif', 'filterMufredatForm');

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

    Session.set('filters', filters);

  })
});
