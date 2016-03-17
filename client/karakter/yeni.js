AutoForm.hooks({
  karakterYeniForm: {
    onSuccess: function(operation, result, template) {
      if (result) {
        FlowRouter.go('karakterListe');
      }
    }
  }
});
