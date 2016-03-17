Meteor.startup(function() {
  if (Meteor.settings.public.APP === 'BACKEND' && M.C.AktifEgitimYili.find().count() === 0) {

    M.C.AktifEgitimYili.insert({
      egitimYili: M.E.EgitimYili[0]
    });

  }
});
