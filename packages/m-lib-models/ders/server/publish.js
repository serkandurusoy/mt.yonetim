Meteor.publishComposite(null, function() {
  return {
    find() {
      if (this.userId) {
        return M.C.Dersler.find();
      }
    },
    children: M.C.AuditLog
  };
});
