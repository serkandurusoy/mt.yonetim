M.C.Sinavlar.attachSchema(new SimpleSchema({
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
  'searchSource.aciklama': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('aciklama');
      return src.isSet ? M.L.LatinizeLower(src.value) : this.unset();
    }
  },
  'searchSource.sinif': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('sinif');
      return src.isSet ? M.L.LatinizeLower(M.L.enumLabel(src.value)) : this.unset();
    }
  },
  'searchSource.subeler': {
    type: String,
    optional: true,
    autoValue() {
      const src = this.field('subeler');
      return src.isSet ? M.L.LatinizeLower(src.value.join(' ')) : this.unset();
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
  M.C.Sinavlar._ensureIndex({
    'searchSource.kurum': 'text',
    'searchSource.kod': 'text',
    'searchSource.egitimYili': 'text',
    'searchSource.ders': 'text',
    'searchSource.aciklama': 'text',
    'searchSource.sinif': 'text',
    'searchSource.subeler': 'text',
    'searchSource.tip': 'text'
  }, {
    name: 'sinavSearch',
    default_language: 'turkish',
    weights: {
      'searchSource.kod': 3,
      'searchSource.kurum': 2,
      'searchSource.ders': 2
    }
  });
}

// TODO: mufredat.after.update (konu) ayrica bunun diger bagli kontrolleri de var tabii ki
Meteor.startup(() => {
  M.C.Kurumlar.after.update(function(userId, doc, fieldNames, modifier, options) {

    const {
      _id = doc._id,
    } = this;

    if (this.previous.isim !== doc.isim) {
      M.C.Sinavlar.find({kurum: _id}).forEach(sinav => {
        M.C.Sinavlar.update(
          {_id: sinav._id},
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
      M.C.Sinavlar.find({ders: _id}).forEach(sinav => {
        M.C.Sinavlar.update(
          {_id: sinav._id},
          {$set: {'searchSource.ders': M.L.LatinizeLower(doc.isim)}},
          {bypassCollection2: true}
        )
      });
    }
  });
});

Meteor.methods({
  'search.sinav'(keywords, filters) {
    check(keywords, Match.OneOf(undefined, null, String));
    check(filters, {
      kurum: Match.Optional(String),
      sinif: Match.Optional(String),
      ders: Match.Optional(String),
      egitimYili: Match.Optional(String),
      tip: Match.Optional(String),
      sinavDurumu: Match.Optional(String),
      sinavSahibi: Match.Optional(String),
      konu: Match.Optional(String)
    });
    const userId = this.userId;
    if (userId) {
      let selector = {};
      let soruSelector = {};

      if (!!keywords) {
        selector.$text = {$search: M.L.LatinizeLower(keywords)}
      }
      if (M.L.userHasRole(userId, 'mitolojix')) {
        if (filters.kurum) {
          selector.kurum = filters.kurum;
          soruSelector.kurum = filters.kurum;
        }
      } else {
        selector.kurum = M.C.Users.findOne({_id: userId}).kurum;
        soruSelector.kurum = M.C.Users.findOne({_id: userId}).kurum;
      }

      if (filters.ders) {
        selector.ders = filters.ders;
        soruSelector['alan.ders'] = filters.ders;
      } else if (M.L.userHasRole(userId, 'ogretmen')) {
        selector.ders = {$in: M.C.Users.findOne({_id: userId}).dersleri};
        soruSelector['alan.ders'] = {$in: M.C.Users.findOne({_id: userId}).dersleri};
      }

      if (filters.sinif) {
        selector.sinif = filters.sinif;
        soruSelector['alan.sinif'] = filters.sinif;
      }

      if (filters.egitimYili) {
        selector.egitimYili = filters.egitimYili;
        soruSelector['alan.egitimYili'] = filters.egitimYili;
      }

      if (filters.tip) {
        selector.tip = filters.tip;
      }

      if (filters.sinavSahibi) {
        selector.createdBy = filters.sinavSahibi;
      }

      if (filters.sinavDurumu) {
        switch (filters.sinavDurumu) {
          case 'taslak':
            selector.taslak = true;
            break;
          case 'kilitli':
            selector.kilitli = true;
            break;
          case 'iptal':
            selector.iptal = true;
            break;
          case 'bekliyor':
            selector.iptal = false;
            selector.taslak = false;
            selector.muhur = {$exists: false};
            selector.acilisZamani = {$gt: new Date()};
            break;
          case 'yayinda':
            selector.iptal = false;
            selector.taslak = false;
            selector.muhur = {$exists: true};
            selector.acilisZamani = {$lte: new Date()};
            selector.kapanisZamani = {$gt: new Date()};
            break;
          case 'tamamlandi':
            selector.iptal = false;
            selector.taslak = false;
            selector.muhur = {$exists: true};
            selector.kapanisZamani = {$lte: new Date()};
            break;
        }
      }

      if(filters.konu){
        soruSelector['alan.konu'] = filters.konu;
        const konuyuIcerenSoruIdleri = _.pluck(M.C.Sorular.find(soruSelector).fetch(),'_id');
        const sorulariIcerenSinavIdleri = _.pluck(M.C.Sinavlar.find({'sorular.soruId': {$in: konuyuIcerenSoruIdleri}}).fetch(),'_id');
        selector._id = {$in: sorulariIcerenSinavIdleri};
      }

      if (_.isEqual(selector, {})) {
        return 'all';
      } else {
        return M.C.Sinavlar.find(
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

