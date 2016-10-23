Meteor.publishComposite(null, function() {
  return {
    find() {
      if (this.userId && !M.L.userHasRole(this.userId, 'ogrenci')) {
        return M.C.SoruFavorileri.find({createdBy: this.userId});
      }
    },
    children: [
      {
        find(favori) {
          return M.C.Sorular.find({_id: favori.soru})
        }
      }
    ]
  };
});
