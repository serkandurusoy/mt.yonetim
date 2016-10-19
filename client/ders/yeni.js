AutoForm.hooks({
  dersYeniForm: {
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('dersListe');
      }
    }
  }
});
