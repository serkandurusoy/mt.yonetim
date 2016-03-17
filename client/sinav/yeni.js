Template.sinavYeni.onCreated(function() {
  this.subscribe('mufredatlar');
  this.data.sinavClone = Session.get('sinavClone');
  M.L.clearSessionVariable('sinavClone');
});

AutoForm.hooks({
  sinavYeniForm: {
    before: {
      insert: function(doc) {
        if (doc._clonedFrom) {
          doc.sorular = AutoForm.getCurrentDataForForm('sinavYeniForm').doc.sorular;
        }
        return doc;
      }
    },
    onSuccess: function(operation, result, template) {
      if (result) {
        Session.set('yeniSinav', result);
        FlowRouter.go('sinavDetay', {_id: result});
      }
    }
  }
});
