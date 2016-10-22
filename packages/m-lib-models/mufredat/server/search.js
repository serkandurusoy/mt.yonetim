M.C.Mufredat.attachSchema(new SimpleSchema({
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
  'searchSource.egitimYili': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('egitimYili');
      return src.isSet ? M.L.LatinizeLower(M.L.enumLabel(src.value)) : this.unset();
    }
  },
  'searchSource.ders': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('ders');
      return src.isSet ? M.L.LatinizeLower(M.C.Dersler.findOne({_id: src.value}).isim) : this.unset();
    }
  },
  'searchSource.sinif': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('sinif');
      return src.isSet ? M.L.LatinizeLower(M.L.enumLabel(src.value)) : this.unset();
    }
  }
}));

if (Meteor.isServer) {
  M.C.Mufredat._ensureIndex({
    'searchSource.kurum': 'text',
    'searchSource.egitimYili': 'text',
    'searchSource.ders': 'text',
    'searchSource.sinif': 'text'
  }, {
    name: 'mufredatSearch',
    default_language: 'turkish',
    weights: {
      'searchSource.kurum': 2
    }
  });
}

Meteor.startup(() => {
  M.C.Kurumlar.after.update(function(userId, doc, fieldNames, modifier, options) {
    const {
      _id = doc._id,
    } = this;
    if (this.previous.isim !== doc.isim) {
      M.C.Mufredat.find({kurum: _id}).forEach(mufredat => {
        M.C.Mufredat.update(
          {_id: mufredat._id},
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
      M.C.Mufredat.find({ders: _id}).forEach(mufredat => {
        M.C.Mufredat.update(
          {_id: mufredat._id},
          {$set: {'searchSource.ders': M.L.LatinizeLower(doc.isim)}},
          {bypassCollection2: true}
        )
      });
    }
  });
});

Meteor.methods({
  'search.mufredat'(keywords, filters) {
    check(keywords, Match.OneOf(undefined, null, String));
    check(filters, {
      kurum: Match.Optional(String),
      sinif: Match.Optional(String),
      ders: Match.Optional(String),
      egitimYili: Match.Optional(String)
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
      } else if (M.L.userHasRole(userId, 'teknik')) {
        if (filters.kurum && _.contains([M.C.Users.findOne({_id: userId}).kurum, 'mitolojix'],filters.kurum)) {
          selector.kurum = filters.kurum;
        } else {
          selector.kurum = {$in: [M.C.Users.findOne({_id: userId}).kurum, 'mitolojix']};
        }
      } else {
        selector.kurum = M.C.Users.findOne({_id: userId}).kurum
      }

      if (filters.sinif) {
        selector.sinif = filters.sinif;
      }

      if (filters.ders) {
        selector.ders = filters.ders;
      } else if (M.L.userHasRole(userId, 'ogretmen')) {
        selector.ders = {$in: M.C.Users.findOne({_id: userId}).dersleri};
      }

      if (filters.egitimYili) {
        selector.egitimYili = filters.egitimYili;
      }

      if (_.isEqual(selector, {})) {
        return 'all';
      } else {
        return M.C.Mufredat.find(
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

