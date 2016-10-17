AutoForm.hooks({
  karakterYeniForm: {
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('karakterListe');
      }
    }
  }
});
