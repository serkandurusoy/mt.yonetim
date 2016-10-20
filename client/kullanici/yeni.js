AutoForm.hooks({
  kullaniciYeniForm: {
    before: {
      method(doc) {
        const form = this;
        form.removeStickyValidationError('emails.0.address');
        form.removeStickyValidationError('tcKimlik');
        return doc;
      }
    },
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('kullaniciListe');
      }
    },
    onError(operation, error) {
      const form = this;
      if (error) {

        if (error.reason && error.reason === 'Email already exists.') {
          form.addStickyValidationError('emails.0.address', 'notUnique');
          AutoForm.validateField(form.formId, 'emails.0.address');
        }

        // TODO: this is not coming in like this any more, hidden in a match failed error!
        if (error.reason && error.reason === 'Geçerli bir TC kimlik numarası girilmeli') {
          form.addStickyValidationError('tcKimlik', 'tcKimlikHatali');
          AutoForm.validateField(form.formId, 'tcKimlik');
        }

        // TODO: this is not coming in at all! Some cryptic error message instead!
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
