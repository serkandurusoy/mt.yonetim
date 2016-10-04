Meteor.publishComposite(null, function() {
  return {
    find: function() {
      if (this.userId) {
        return M.C.YardimDokumanlari.find();
      }
    },
    children: M.C.AuditLog
  };
});
