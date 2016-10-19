Meteor.publishComposite(null, function() {
  return {
    find() {
      if (this.userId) {
        return M.C.Muhurler.find();
      }
    },
    children: M.C.AuditLog
  };
});
