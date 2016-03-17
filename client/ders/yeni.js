AutoForm.hooks({
  dersYeniForm: {
    onSuccess: function(operation, result, template) {
      if (result) {
        FlowRouter.go('dersListe');
      }
    }
  }
});
