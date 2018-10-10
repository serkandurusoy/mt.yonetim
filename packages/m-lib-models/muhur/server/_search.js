import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { M } from 'meteor/m:lib-core';

M.C.Muhurler.attachSchema(new SimpleSchema({
  'searchSource.language': {
    type: String,
    autoValue() {
      if (this.isInsert) {
        return "turkish";
      }
    }
  },
  'searchSource.isim': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('isim');
      return src.isSet ? M.L.LatinizeLower(src.value) : this.unset();
    }
  },
  'searchSource.ders': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('ders');
      return src.isSet ? M.L.LatinizeLower(M.C.Dersler.findOne({_id: src.value}).isim) : this.unset();
    }
  }
}));

if (Meteor.isServer) {
  M.C.Muhurler.rawCollection().createIndex({
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

    const {
      _id = doc._id,
    } = this;

    if (this.previous.isim !== doc.isim) {
      M.C.Muhurler.find({ders: _id}).forEach(muhur => {
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
  'search.muhur'(keywords, filters) {
    check(keywords, Match.OneOf(undefined, null, String));
    check(filters, {
      ders: Match.Optional(String)
    });
    if (this.userId) {
      let selector = {};
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
        ).map(doc => doc._id );
      }

    } else {
      return [];
    }
  }
});
