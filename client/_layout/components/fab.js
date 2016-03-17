Template.fab.helpers({
  canViewFab: function() {
    var route = FlowRouter.getRouteName();
    var _id = FlowRouter.getParam('_id');

    var fabRules = [
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
      }
    ];

    if (!Meteor.userId()) {
      return false;
    }

    if (route === 'kullaniciDetay' && _id) {
      if (!M.L.userHasRole(Meteor.userId(), 'mitolojix')) {
        if (Meteor.user().kurum !== M.C.Users.findOne({_id: _id}).kurum) {
          return false;
        }
      }
    }

    if (route === 'mufredatDetay' && _id) {
      if (M.L.userHasRole(Meteor.userId(), 'teknik')) {
        var mufredat = M.C.Mufredat.findOne({_id: _id, kurum: Meteor.user().kurum});
        if (!mufredat) {
          return false;
        }
      }
    }

    if (route === 'sinavDetay' && _id) {
      var sinav = M.C.Sinavlar.findOne({_id: _id});
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
        if (!_.contains(Meteor.user().dersleri, sinav.ders)) {
          return false;
        }
      }
    }

    if (route === 'soruDetay' && _id) {
      var soru = M.C.Sorular.findOne({_id: _id});
      if (!soru) {
        return false;
      }
      if (soru.kilitli) {
        return false;
      }
      if (M.L.userHasRole(Meteor.userId(), 'ogretmen')) {
        var ogretmenSoru = M.C.Sorular.findOne({_id: _id, kurum: Meteor.user().kurum, 'alan.ders': {$in: Meteor.user().dersleri}});
        if (!ogretmenSoru) {
          return false;
        }
      }
    }

    var docNotExists = _.some(fabRules, function(rule) {
      if (rule.route === route) {
        if (rule.route.indexOf('Detay') > -1) {
          var doc = M.C[rule.collection].findOne({_id: _id});
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

    var docNotAktif = _.some(fabRules, function(rule) {
      if (rule.route === route) {
        if (rule.route.indexOf('Detay') > -1) {
          var doc = M.C[rule.collection].findOne({_id: _id});
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

    var ruleAllowed = _.some(fabRules, function(rule) {
      if (rule.route === route) {
        return _.some(rule.allowed, function(allowed) {
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
