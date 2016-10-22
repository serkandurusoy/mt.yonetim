Meteor.publishComposite(null,() => {
  return {
    find() {
      if (this.userId && !M.L.userHasRole(this.userId, 'ogrenci')) {
        return M.C.Notifications.find({to: this.userId});
      }
    }
  };
});
