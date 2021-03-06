// TODO: Schema attachment had to be done over at the model file for some god knows why reason!

if (Meteor.isServer) {
  M.C.Users._ensureIndex({
    'searchSource.name': 'text',
    'searchSource.lastName': 'text',
    'searchSource.kurum': 'text',
    'searchSource.role': 'text',
    'searchSource.dersleri': 'text',
    'searchSource.sinif': 'text',
    'searchSource.sube': 'text'
  }, {
    name: 'kullaniciSearch',
    default_language: 'turkish',
    weights: {
      'searchSource.kurum': 3,
      'searchSource.lastName': 2
    }
  });
}

Meteor.startup(function() {
  M.C.Kurumlar.after.update(function(userId, doc, fieldNames, modifier, options) {
    var _id = this._id ? this._id : doc._id;
    if (this.previous.isim !== doc.isim) {
      M.C.Users.find({kurum: _id}).forEach(function(user) {
        M.C.Users.update(
          {_id: user._id},
          {$set: {'searchSource.kurum': M.L.LatinizeLower(doc.isim)}},
          {bypassCollection2: true}
        )
      });
    }
  });

  M.C.Dersler.after.update(function(userId, doc, fieldNames, modifier, options) {
    var _id = this._id ? this._id : doc._id;
    if (this.previous.isim !== doc.isim) {
      M.C.Users.find({dersleri: _id}).forEach(function(user) {
        M.C.Users.update(
          {_id: user._id},
          {$set: {'searchSource.dersleri': _.map(user.dersleri, function(ders) {
            return M.L.LatinizeLower(M.C.Dersler.findOne({_id: ders}).isim);
          }).join(' ')}},
          {bypassCollection2: true}
        )
      });
    }
  });
});

Meteor.methods({
  'search.kullanici': function(keywords, filters) {
    check(keywords, Match.OneOf(undefined, null, String));
    check(filters, {
      kurum: Match.Optional(String),
      role: Match.Optional(String),
      sinif: Match.Optional(String),
      sube: Match.Optional(String)
    });
    var userId = this.userId;
    if (userId) {
      var selector = {};
      if (!!keywords) {
        selector.$text = {$search: M.L.LatinizeLower(keywords)}
      }
      if (filters.kurum) {
        selector.kurum = filters.kurum;
      }
      if (!M.L.userHasRole(userId, 'mitolojix')) {
        selector.kurum = M.C.Users.findOne({_id: userId}).kurum
      }
      if (filters.role) {
        selector.role = filters.role;
      }
      if (filters.sinif) {
        selector.sinif = filters.sinif;
      }
      if (filters.sube) {
        selector.sube = filters.sube;
      }
      if (_.isEqual(selector, {})) {
        return 'all';
      } else {
        return M.C.Users.find(
          selector,
          {
            fields: {
              score: {$meta: 'textScore'}
            },
            sort: {
              score: {$meta: 'textScore'}
            },
            limit: 100
          }
        ).map(function(doc) {
          return doc._id;
        });
      }
    } else {
      return [];
    }
  }
});

