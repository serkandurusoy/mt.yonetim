Meteor.publishComposite(null, function() {
  return {
    find: function() {
      if (this.userId && !M.L.userHasRole(this.userId, 'ogrenci')) {
        return M.C.SoruSepetleri.find({createdBy: this.userId});
      }
    },
    children: [
      {
        find: function(sepet) {
          return M.C.Sorular.find({_id: sepet.soru})
        }
      }
    ]
  };
});
