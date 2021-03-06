AutoForm.hooks({
  kullaniciYeniForm: {
    before: {
      method: function(doc) {
        var form = this;
        form.removeStickyValidationError('emails.0.address');
        form.removeStickyValidationError('tcKimlik');
        return doc;
      }
    },
    onSuccess: function(operation, result, template) {
      if (result) {
        FlowRouter.go('kullaniciListe');
      }
    },
    onError: function(operation, error) {
      var form = this;
      if (error) {

        if (error.reason && error.reason === 'Email already exists.') {
          form.addStickyValidationError('emails.0.address', 'notUnique');
          AutoForm.validateField(form.formId, 'emails.0.address');
        }

        if (error.error && error.error === 'tcKimlikHatali') {
          form.addStickyValidationError('tcKimlik', 'tcKimlikHatali');
          AutoForm.validateField(form.formId, 'tcKimlik');
        }

        if (error.reason && error.reason === 'Geçerli bir TC kimlik numarası girilmeli') {
          form.addStickyValidationError('tcKimlik', 'tcKimlikHatali');
          AutoForm.validateField(form.formId, 'tcKimlik');
        }

        if (error.error && error.error.stack && error.error.stack.indexOf('tcKimlik  dup key') > -1) {
          form.addStickyValidationError('tcKimlik', 'notUnique');
          AutoForm.validateField(form.formId, 'tcKimlik');
        }

        if (error.reason && error.reason.indexOf('duplicate key error') > -1 && error.reason.indexOf('tcKimlik') > -1) {
          form.addStickyValidationError('tcKimlik', 'notUnique');
          AutoForm.validateField(form.formId, 'tcKimlik');
        }

      }
    }
  }
});
