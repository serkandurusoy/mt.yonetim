M.C.setUpCollection({
  object: 'SoruFavorileri',
  collection: 'sorufavorileri',
  schema: {
    'soru': {
      type: String,
      custom: function () {
        var soru = this;
        var exists = M.C.Sorular.findOne({_id: soru.value});
        if (!exists) {
          return 'notAllowed';
        }
        return true;
      }
    }
  },
  permissions: {
    insert: 'mitolojix', // TODO: Must have access to soru
    update: 'nobody',
    remove: 'mitolojix'
  },
  indexes: [
    {ix: {createdBy: 1, soru: 1}, opt: { unique: true }}
  ]
});

if (Meteor.isServer) {
  M.C.SoruFavorileri.permit('insert').ifLoggedIn().userHasRole('teknik').allowInClientCode();
  M.C.SoruFavorileri.permit('insert').ifLoggedIn().userHasRole('ogretmen').allowInClientCode();

  M.C.SoruFavorileri.permit('remove').ifLoggedIn().userHasRole('teknik').userOwnsDoc().allowInClientCode();
  M.C.SoruFavorileri.permit('remove').ifLoggedIn().userHasRole('ogretmen').userOwnsDoc().allowInClientCode();
}

Meteor.methods({
  'soruFavoriBosalt': function() {
    if (this.userId) {
      var res = M.C.SoruFavorileri.remove({createdBy: this.userId});
      return res;
    }
  }
});
