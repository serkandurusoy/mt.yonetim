AutoForm.hooks({
  yardimDokumaniYeniForm: {
    onSuccess: function(operation, result, template) {
      if (result) {
        FlowRouter.go('yardimDokumaniListe');
      }
    }
  }
});
