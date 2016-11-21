import { Autoform } from 'meteor/aldeed:autoform';

AutoForm.addHooks(null, {
  onError(formType, error) {
    AutoForm.selectFirstInvalidField(this.formId, this.ss);
  }
});
