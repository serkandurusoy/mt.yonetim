import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';

import { AutoForm } from 'meteor/aldeed:autoform';

import { M } from 'meteor/m:lib-core';

import './liste.html';

Template.kullaniciListe.onCreated(function() {
  const template = this;
  template.subscribe('kullanicilar');
  template.searchResults = new ReactiveVar({});
  template.autorun(() => {
    const keywords = Session.get('keywords');
    const filters = Session.get('filters');
    if (_.isString(keywords) || _.isObject(filters)) {
      Meteor.call('search.kullanici',keywords, filters, (err,res) => {
        if (err) {
          toastr.error(M.E.BilinmeyenHataMessage);
          template.searchResults.set({});
        }
        if (res) {
          if (res==='all') {
            template.searchResults.set({});
          } else {
            template.searchResults.set({_id: {$in: res}});
          }
        }
      })
    } else {
      template.searchResults.set({});
    }
  });
});

Template.kullaniciListe.helpers({
  kullanicilar(){
    let selector = Template.instance().searchResults.get();
    if (Meteor.user().kurum !== 'mitolojix') {
      selector.kurum = Meteor.user().kurum;
    }
    const kullanicilarCursor = M.C.Users.find(selector,{sort:{kurum: 1, nameCollate: 1, lastNameCollate: 1}});
    return kullanicilarCursor.count() && {cursor: kullanicilarCursor, count: kullanicilarCursor.count()};
  }
});

Template.kullaniciKart.helpers({
  initialsOptions() {
    const {
      name,
      lastName,
    } = this;
    return {
      name:`${name} ${lastName}`,
      height: 250,
      width: 250,
      textColor: '#ffffff',
      fontSize: 80,
      fontWeight: 400,
      radius: 0
    };
  },
  accountActivated() {
    return !!M.C.UserConnectionLog.findOne({userId: this._id});
  }
});

Template.filterKullanici.helpers({
  filterKullaniciForm() {
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
              kurumlar = _.union({label: 'Mitolojix', value: 'mitolojix'},
                M.C.Kurumlar.find({}, {sort: {isimCollate: 1}})
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
      role: {
        label: 'Rol',
        type: String,
        optional: true,
        autoform: {
          type() {
            const formId = AutoForm.getFormId();
            const kurum = AutoForm.getFieldValue('kurum', formId);

            if (!kurum) {
              return 'hidden';
            } else if (kurum === 'mitolojix') {
              return 'hidden';
            } else {
              return 'select';
            }

          },
          class: 'browser-default',
          firstOption: 'Tümü',
          options() {
            const formId = AutoForm.getFormId();
            const kurum = AutoForm.getFieldValue('kurum', formId);
            let options = M.E.RoleObjects.map(r => {
              const {
                label,
                name: value,
              } = r;
              return {
                label,
                value,
              };
            });
            if (kurum) {
              if (kurum === 'mitolojix') {
                options = [_.findWhere(options, {value : 'mitolojix'})];
              } else {
                options = _.reject(options, o => o.value === 'mitolojix');
              }
            }
            return options;
          }
        }
      },
      sinif: {
        label: 'Sınıf',
        type: String,
        optional: true,
        autoform: {
          type() {
            const formId = AutoForm.getFormId();
            const role = AutoForm.getFieldValue('role', formId);
            return role === 'ogrenci' ? 'select' : 'hidden';
          },
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
      sube: {
        label: 'Şube',
        type: String,
        optional: true,
        autoform: {
          type() {
            const formId = AutoForm.getFormId();
            const sinif = AutoForm.getFieldValue('sinif', formId);
            return !!sinif ? 'select' : 'hidden';
          },
          class: 'browser-default',
          firstOption: 'Tümü',
          options() {
            return M.E.Sube.map(sube => {
              return {
                label: sube,
                value: sube
              };
            });
          }
        }
      }
    });
  }
});

AutoForm.hooks({
  filterKullaniciForm: {
    onSubmit() {
      return false;
    }
  }
});

Template.filterKullanici.onRendered(function(){
  this.autorun(() => {
    let filters = {};
    const kurum = AutoForm.getFieldValue('kurum', 'filterKullaniciForm'),
        role  = AutoForm.getFieldValue('role', 'filterKullaniciForm'),
        sinif = AutoForm.getFieldValue('sinif', 'filterKullaniciForm'),
        sube = AutoForm.getFieldValue('sube', 'filterKullaniciForm');

    if (kurum) {
      filters.kurum = kurum;
    }

    if (role) {
      filters.role = role;
    }

    if (sinif) {
      filters.sinif = sinif;
    }

    if (sube) {
      filters.sube = sube;
    }

    Session.set('filters', filters);

  })
});
