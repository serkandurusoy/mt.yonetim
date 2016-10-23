Template.soruYeni.onCreated(function() {
  this.subscribe('mufredatlar');
  this.subscribe('fssorugorsel');
  this.data.soruClone = Session.get('soruClone');
  M.L.clearSessionVariable('soruClone');
});

AutoForm.hooks({
  soruYeniForm: {
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('soruDetay', {_id: result});
      }
    }
  }
});
