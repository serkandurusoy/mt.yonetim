AutoForm.hooks({
  yardimDokumaniYeniForm: {
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('yardimDokumaniListe');
      }
    }
  }
});
