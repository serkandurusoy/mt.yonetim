M.C.setUpCollection({
  object: 'SoruSepetleri',
  collection: 'sorusepetleri',
  schema: {
    'soru': {
      type: String,
      custom() {
        const exists = M.C.Sorular.findOne({_id: this.value});
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
  M.C.SoruSepetleri.permit('insert').ifLoggedIn().userHasRole('teknik').allowInClientCode();
  M.C.SoruSepetleri.permit('insert').ifLoggedIn().userHasRole('ogretmen').allowInClientCode();

  M.C.SoruSepetleri.permit('remove').ifLoggedIn().userHasRole('teknik').userOwnsDoc().allowInClientCode();
  M.C.SoruSepetleri.permit('remove').ifLoggedIn().userHasRole('ogretmen').userOwnsDoc().allowInClientCode();
}

Meteor.methods({
  'soruSepetiBosalt'() {
    if (this.userId) {
      return M.C.SoruSepetleri.remove({createdBy: this.userId});
    }
  }
});
