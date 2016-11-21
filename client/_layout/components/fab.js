import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';

import { FlowRouter } from 'meteor/kadira:flow-router';

import { M } from 'meteor/m:lib-core';

import './fab.html';

Template.fab.helpers({
  canViewFab() {
    const route = FlowRouter.getRouteName();
    const _id = FlowRouter.getParam('_id');

    const fabRules = [
      {
        route: 'kullaniciListe',
        allowed: ['mitolojix','teknik'],
        collection: 'Users'
      },
      {
        route: 'kullaniciDetay',
        allowed: ['mitolojix','teknik'],
        collection: 'Users'
      },
      {
        route: 'karakterListe',
        allowed: ['mitolojix'],
        collection: 'Karakterler'
      },
      {
        route: 'karakterDetay',
        allowed: ['mitolojix'],
        collection: 'Karakterler'
      },
      {
        route: 'kurumListe',
        allowed: ['mitolojix'],
        collection: 'Kurumlar'
      },
      {
        route: 'kurumDetay',
        allowed: ['mitolojix'],
        collection: 'Kurumlar'
      },
      {
        route: 'muhurListe',
        allowed: ['mitolojix'],
        collection: 'Muhurler'
      },
      {
        route: 'muhurDetay',
        allowed: ['mitolojix'],
        collection: 'Muhurler'
      },
      {
        route: 'dersListe',
        allowed: ['mitolojix'],
        collection: 'Dersler'
      },
      {
        route: 'dersDetay',
        allowed: ['mitolojix'],
        collection: 'Dersler'
      },
      {
        route: 'mufredatListe',
        allowed: ['mitolojix','teknik'],
        collection: 'Mufredat'
      },
      {
        route: 'mufredatDetay',
        allowed: ['mitolojix','teknik'],
        collection: 'Mufredat'
      },
      {
        route: 'sinavListe',
        allowed: ['mitolojix','teknik','ogretmen'],
        collection: 'Sinavlar'
      },
      {
        route: 'sinavDetay',
        allowed: ['mitolojix','teknik','ogretmen'],
        collection: 'Sinavlar'
      },
      {
        route: 'soruListe',
        allowed: ['mitolojix','teknik','ogretmen'],
        collection: 'Sorular'
      },
      {
        route: 'soruDetay',
        allowed: ['mitolojix','teknik','ogretmen'],
        collection: 'Sorular'
      },
      {
        route: 'yardimDokumaniListe',
        allowed: ['mitolojix'],
        collection: 'YardimDokumanlari'
      },
      {
        route: 'yardimDokumaniDetay',
        allowed: ['mitolojix'],
        collection: 'YardimDokumanlari'
      }
    ];

    if (!Meteor.userId()) {
      return false;
    }

    if (route === 'kullaniciDetay' && _id) {
      if (!M.L.userHasRole(Meteor.userId(), 'mitolojix')) {
        if (Meteor.user().kurum !== M.C.Users.findOne({_id}).kurum) {
          return false;
        }
      }
    }

    if (route === 'mufredatDetay' && _id) {
      if (M.L.userHasRole(Meteor.userId(), 'teknik')) {
        const mufredat = M.C.Mufredat.findOne({_id, kurum: Meteor.user().kurum});
        if (!mufredat) {
          return false;
        }
      }
    }

    if (route === 'sinavDetay' && _id) {
      const sinav = M.C.Sinavlar.findOne({_id});
      if (!sinav) {
        return false;
      }
      if (sinav.iptal) {
        return false;
      }
      if (sinav.kilitli) {
        return false;
      }
      if (sinav.muhur) {
        return false;
      }
      if (M.L.userHasRole(Meteor.userId(), 'ogretmen')) {
        if (!Meteor.user().dersleri.includes(sinav.ders)) {
          return false;
        }
      }
    }

    if (route === 'soruDetay' && _id) {
      const soru = M.C.Sorular.findOne({_id});
      if (!soru) {
        return false;
      }
      if (soru.kilitli) {
        return false;
      }
      if (M.L.userHasRole(Meteor.userId(), 'ogretmen')) {
        const ogretmenSoru = M.C.Sorular.findOne({_id, kurum: Meteor.user().kurum, 'alan.ders': {$in: Meteor.user().dersleri}});
        if (!ogretmenSoru) {
          return false;
        }
      }
    }

    const docNotExists = fabRules.some(rule => {
      if (rule.route === route) {
        if (rule.route.indexOf('Detay') > -1) {
          const doc = M.C[rule.collection].findOne({_id});
          return !doc;
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
    if (docNotExists) {
      return false;
    }

    const docNotAktif = fabRules.some(rule => {
      if (rule.route === route) {
        if (rule.route.indexOf('Detay') > -1) {
          const doc = M.C[rule.collection].findOne({_id});
          if (!doc) {
            return false;
          } else {
            if (_.has(doc, 'aktif')) {
              return !doc.aktif;
            } else {
              return false;
            }
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
    if (docNotAktif) {
      return false;
    }

    const ruleAllowed = fabRules.some(rule => {
      if (rule.route === route) {
        return rule.allowed.some(allowed => {
          return M.L.userHasRole(Meteor.userId(), allowed);
        })
      } else {
        return false;
      }
    });
    if (ruleAllowed) {
      return true;
    }

    return false;
  }
});
