Meteor.methods({
  'search.soruSepeti': function(keywords, filters) {
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
    var userId = this.userId;
    if (userId) {

      var selector = {};

      var sepettekiSoruIdleri = _.pluck(M.C.SoruSepetleri.find({createdBy: userId}).fetch(),'soru');
      selector._id = {$in: sepettekiSoruIdleri};

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
        ).map(function(doc) {
          return doc._id;
        });
      }
    } else {
      return [];
    }
  }
});
