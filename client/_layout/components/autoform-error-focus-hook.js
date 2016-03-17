AutoForm.addHooks(null, {
  onError: function(formType, error) {
    AutoForm.selectFirstInvalidField(this.formId, this.ss);
  }
});
