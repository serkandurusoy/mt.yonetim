M.C.Muhurler.attachSchema(new SimpleSchema({
  'searchSource.language': {
    type: String,
    autoValue: function() {
      if (this.isInsert) {
        return "turkish";
      }
    }
  },
  'searchSource.isim': {
    type: String,
    optional: true,
    autoValue: function() {
      var src = this.field('isim');
      return src.isSet ? M.L.LatinizeLower(src.value) : this.unset();
    }
  },
  'searchSource.ders': {
    type: String,
    optional: true,
    autoValue: function() {
      var src = this.field('ders');
      return src.isSet ? M.L.LatinizeLower(M.C.Dersler.findOne({_id: src.value}).isim) : this.unset();
    }
  }
}));

if (Meteor.isServer) {
  M.C.Muhurler._ensureIndex({
    'searchSource.isim': 'text',
    'searchSource.ders': 'text'
  }, {
    name: 'muhurSearch',
    default_language: 'turkish',
    weights: {
      'searchSource.isim': 2
    }
  });
}

Meteor.startup(function() {
  M.C.Dersler.after.update(function(userId, doc, fieldNames, modifier, options) {
    var _id = this._id ? this._id : doc._id;
    if (this.previous.isim !== doc.isim) {
      M.C.Muhurler.find({ders: _id}).forEach(function(muhur) {
        M.C.Muhurler.update(
          {_id: muhur._id},
          {$set: {'searchSource.ders': M.L.LatinizeLower(doc.isim)}},
          {bypassCollection2: true}
        )
      });
    }
  });
});

Meteor.methods({
  'search.muhur': function(keywords, filters) {
    check(keywords, Match.OneOf(undefined, null, String));
    check(filters, {
      ders: Match.Optional(String)
    });
    var userId = this.userId;
    if (userId) {
      var selector = {};
      if (!!keywords) {
        selector.$text = {$search: M.L.LatinizeLower(keywords)}
      }

      if (filters.ders) {
        selector.ders = filters.ders;
      }

      if (_.isEqual(selector, {})) {
        return 'all';
      } else {
        return M.C.Muhurler.find(
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
