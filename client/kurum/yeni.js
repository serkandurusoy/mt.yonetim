AutoForm.hooks({
  kurumYeniForm: {
    before: {
      method: function(doc) {
        var form = this;
        form.removeStickyValidationError('isim');
        return doc;
      }
    },
    onSuccess: function(operation, result, template) {
      if (result) {
        FlowRouter.go('kurumListe');
      }
    },
    onError: function(operation, error) {
      var form = this;
      if (error) {

        if (error.reason && error.reason.indexOf('duplicate key error') > -1 && error.reason.indexOf('isim') > -1) {
          form.addStickyValidationError('isim', 'notUnique');
          AutoForm.validateField(form.formId, 'isim');
        }

      }
    }
  }
});
