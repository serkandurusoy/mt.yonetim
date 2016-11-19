import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';

import { SimpleSchema } from 'meteor/simple-schema';

import { M } from 'meteor/m:lib-core';

M.C.Sorular.attachSchema(new SimpleSchema({
  'searchSource.language': {
    type: String,
    autoValue() {
      if (this.isInsert) {
        return "turkish";
      }
    }
  },
  'searchSource.kurum': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('kurum');
      return this.isSet ? this.value : src.isSet ? M.L.LatinizeLower(src.value === 'mitolojix' ? 'mitolojix' : M.C.Kurumlar.findOne({_id: src.value}).isim) : this.unset();
    }
  },
  'searchSource.kod': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('kod');
      return src.isSet ? M.L.LatinizeLower(src.value) : this.unset();
    }
  },
  'searchSource.aciklama': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('aciklama');
      return src.isSet ? M.L.LatinizeLower(src.value) : this.unset();
    }
  },
  'searchSource.alan.ders': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('alan.ders');
      return src.isSet ? M.L.LatinizeLower(M.C.Dersler.findOne({_id: src.value}).isim) : this.unset();
    }
  },
  'searchSource.alan.sinif': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('alan.sinif');
      return src.isSet ? M.L.LatinizeLower(M.L.enumLabel(src.value)) : this.unset();
    }
  },
  'searchSource.alan.konu': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('alan.konu');
      return src.isSet ? M.L.LatinizeLower(src.value) : this.unset();
    }
  },
  'searchSource.zorlukDerecesi': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('zorlukDerecesi');
      return src.isSet ? M.L.LatinizeLower(src.value.toString()) : this.unset();
    }
  },
  'searchSource.tip': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('tip');
      return src.isSet ? M.L.LatinizeLower(M.L.enumLabel(src.value)) : this.unset();
    }
  }
}));

if (Meteor.isServer) {
  M.C.Sorular._ensureIndex({
    'searchSource.kurum': 'text',
    'searchSource.kod': 'text',
    'searchSource.aciklama': 'text',
    'searchSource.alan.ders': 'text',
    'searchSource.alan.konu': 'text',
    'searchSource.alan.sinif': 'text',
    'searchSource.zorlukDerecesi': 'text',
    'searchSource.tip': 'text'
  }, {
    name: 'soruSearch',
    default_language: 'turkish',
    weights: {
      'searchSource.kod': 3,
      'searchSource.kurum': 2,
      'searchSource.alan.ders': 2,
      'searchSource.alan.konu': 2
    }
  });
}

Meteor.startup(() => {
  M.C.Kurumlar.after.update(function(userId, doc, fieldNames, modifier, options) {

    const {
      _id = doc._id,
    } = this;

    if (this.previous.isim !== doc.isim) {
      M.C.Sorular.find({kurum: _id}).forEach(soru => {
        M.C.Sorular.update(
          {_id: soru._id},
          {$set: {'searchSource.kurum': M.L.LatinizeLower(doc.isim)}},
          {bypassCollection2: true}
        )
      });
    }
  });

  M.C.Dersler.after.update(function(userId, doc, fieldNames, modifier, options) {

    const {
      _id = doc._id,
    } = this;

    if (this.previous.isim !== doc.isim) {
      M.C.Sorular.find({'alan.ders': _id}).forEach(soru => {
        M.C.Sorular.update(
          {_id: soru._id},
          {$set: {'searchSource.alan.ders': M.L.LatinizeLower(doc.isim)}},
          {bypassCollection2: true}
        )
      });
    }
  });
});

Meteor.methods({
  'search.soru'(keywords, filters) {
    check(keywords, Match.OneOf(undefined, null, String));
    check(filters, {
      kurum: Match.Optional(String),
      sinif: Match.Optional(String),
      ders: Match.Optional(String),
      egitimYili: Match.Optional(String),
      tip: Match.Optional(String),
      soruSahibi: Match.Optional(String),
      konu: Match.Optional(String)
    });
    const userId = this.userId;
    if (userId) {
      let selector = {};
      if (!!keywords) {
        selector.$text = {$search: M.L.LatinizeLower(keywords)}
      }
      if (M.L.userHasRole(userId, 'mitolojix')) {
        if (filters.kurum) {
          selector.kurum = filters.kurum;
        }
      } else {
        selector.kurum = M.C.Users.findOne({_id: userId}).kurum
      }

      if (filters.ders) {
        selector['alan.ders'] = filters.ders;
      } else if (M.L.userHasRole(userId, 'ogretmen')) {
        selector['alan.ders'] = {$in: M.C.Users.findOne({_id: userId}).dersleri};
      }

      if (filters.sinif) {
        selector['alan.sinif'] = filters.sinif;
      }

      if (filters.egitimYili) {
        selector['alan.egitimYili'] = filters.egitimYili;
      }

      if (filters.tip) {
        selector.tip = filters.tip;
      }

      if (filters.soruSahibi) {
        selector.createdBy = filters.soruSahibi;
      }

      if(filters.konu){
        selector['alan.konu'] = filters.konu;
      }

      if (_.isEqual(selector, {})) {
        return 'all';
      } else {
        return M.C.Sorular.find(
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
        ).map(doc => doc._id);
      }
    } else {
      return [];
    }
  }
});

