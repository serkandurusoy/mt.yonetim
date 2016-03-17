Meteor.publishComposite(null, function() {
  return {
    find: function() {
      if (this.userId && !M.L.userHasRole(this.userId, 'ogrenci')) {
        return M.C.Iller.find();
      }
    },
    children: [
      {
        find: function(il) {
          if (il && il.il) {
            return M.C.Ilceler.find({il: il.il});
          }
        }
      }
    ]
  };
});
