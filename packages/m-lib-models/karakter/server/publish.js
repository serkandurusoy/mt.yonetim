Meteor.publishComposite(null, function() {
  return {
    find: function() {
      if (this.userId) {
        return M.C.Karakterler.find();
      }
    },
    children: M.C.AuditLog
  };
});
