import { Meteor } from 'meteor/meteor';

import { M } from 'meteor/m:lib-core';

Meteor.startup(() => {
  if (Meteor.settings.public.APP === 'YONETIM' && M.C.AktifEgitimYili.find().count() === 0) {

    M.C.AktifEgitimYili.insert({
      egitimYili: M.E.EgitimYili[0]
    });

  }
});
