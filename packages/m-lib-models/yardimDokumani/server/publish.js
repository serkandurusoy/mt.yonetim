Meteor.publishComposite(null, function() {
  return {
    find() {
      if (this.userId) {
        return M.C.YardimDokumanlari.find();
      }
    },
    children: M.C.AuditLog
  };
});
