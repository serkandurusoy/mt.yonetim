Meteor.publishComposite(null, function() {
  return {
    find: function() {
      if (this.userId) {
        return M.C.Muhurler.find();
      }
    },
    children: M.C.AuditLog
  };
});
