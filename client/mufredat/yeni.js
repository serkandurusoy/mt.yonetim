Template.mufredatYeni.onCreated(function() {
  this.subscribe('mufredatlar');
  this.subscribe('fsdersicerik');
  this.data.mufredatClone = Session.get('mufredatClone');
  M.L.clearSessionVariable('mufredatClone');
});

AutoForm.hooks({
  mufredatYeniForm: {
    before: {
      method(doc) {
        const form = this;
        form.removeStickyValidationError('ders');
        return doc;
      }
    },
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('mufredatListe');
      }
    },
    onError(operation, error) {
      const form = this;
      if (error) {

        if (error.reason && error.reason.indexOf('duplicate key error')) {
          form.addStickyValidationError('ders', 'notUnique');
          AutoForm.validateField(form.formId, 'ders');
        }

      }
    }
  }
});
