Meteor.publishComposite(null, () => {
  return {
    find() {
      if (this.userId) {
        return M.C.AktifEgitimYili.find();
      }
    },
    children: M.C.AuditLog
  };
});
