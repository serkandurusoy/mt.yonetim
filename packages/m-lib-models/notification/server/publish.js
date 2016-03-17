Meteor.publishComposite(null, function() {
  return {
    find: function() {
      if (this.userId && !M.L.userHasRole(this.userId, 'ogrenci')) {
        return M.C.Notifications.find({to: this.userId});
      }
    }
  };
});
