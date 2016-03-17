Meteor.publishComposite(null, function() {
  return {
    find: function() {
      if (this.userId && !M.L.userHasRole(this.userId, 'ogrenci')) {
        return M.C.SoruFavorileri.find({createdBy: this.userId}, {sort: {createdAt: 1}});
      }
    },
    children: [
      {
        find: function(favori) {
          return M.C.Sorular.find({_id: favori.soru})
        }
      }
    ]
  };
});
