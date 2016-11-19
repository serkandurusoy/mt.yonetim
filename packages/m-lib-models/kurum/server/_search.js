import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { M } from 'meteor/m:lib-core';

M.C.Kurumlar.attachSchema(new SimpleSchema({
  'searchSource.language': {
    type: String,
    autoValue() {
      //TODO: ileride multilingual bir sey yaparsak bunu da dinamik olusturmak gerekir
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
  'searchSource.yetkili.isim': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('yetkili.isim');
      return src.isSet ? M.L.LatinizeLower(src.value) : this.unset();
    }
  },
  'searchSource.yetkili.unvan': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('yetkili.unvan');
      return src.isSet ? M.L.LatinizeLower(src.value) : this.unset();
    }
  },
  'searchSource.yetkili.email': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('yetkili.email');
      return src.isSet ? M.L.LatinizeLower(src.value) : this.unset();
    }
  },
  'searchSource.yetkili.telefon': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('yetkili.telefon');
      return src.isSet ? M.L.LatinizeLower(src.value) : this.unset();
    }
  },
  'searchSource.adres.il': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('adres.ilce');
      return src.isSet ? M.L.LatinizeLower(M.C.Ilceler.findOne({_id: src.value}).il) : this.unset();
    }
  },
  'searchSource.adres.ilce': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('adres.ilce');
      return src.isSet ? M.L.LatinizeLower(M.C.Ilceler.findOne({_id: src.value}).ilce) : this.unset();
    }
  }
}));

if (Meteor.isServer) {
  M.C.Kurumlar._ensureIndex({
    'searchSource.isim': 'text',
    'searchSource.yetkili.isim': 'text',
    'searchSource.yetkili.unvan': 'text',
    'searchSource.yetkili.email': 'text',
    'searchSource.yetkili.telefon': 'text',
    'searchSource.adres.il': 'text',
    'searchSource.adres.ilce': 'text'
  }, {
    name: 'kurumSearch',
    default_language: 'turkish',
    weights: {
      'searchSource.isim': 2 // default is 1 for the others
    }
  });
}

Meteor.methods({
  'search.kurum'(keywords) {
    check(keywords, String);
    if (this.userId && M.L.userHasRole(this.userId, 'mitolojix')) {
      return M.C.Kurumlar.find(
        {
          $text: {$search: M.L.LatinizeLower(keywords)}
        },
        {
          fields: {
            score: {$meta: 'textScore'}
          },
          sort: {
            score: {$meta: 'textScore'}
          },
          // TODO: make this configurable or perhaps a part of the search, or better yet create a separate advanced search section
          limit: 100
        }
      ).map(doc => doc._id);
    } else {
      return [];
    }
  }
});
