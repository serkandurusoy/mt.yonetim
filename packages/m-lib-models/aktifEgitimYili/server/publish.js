Meteor.publishComposite(null, function() {
  return {
    find: function() {
      if (this.userId) {
        return M.C.AktifEgitimYili.find();
      }
    },
    children: M.C.AuditLog
  };
});
