import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { M } from 'meteor/m:lib-core';

AutoForm.hooks({
  kurumYeniForm: {
    before: {
      method(doc) {
        const form = this;
        form.removeStickyValidationError('isim');
        return doc;
      }
    },
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('kurumListe');
      }
    },
    onError(operation, error) {
      const form = this;
      if (error) {
        if (error.reason && error.reason.indexOf('duplicate key error') > -1 && error.reason.indexOf('isim') > -1) {
          form.addStickyValidationError('isim', 'notUnique');
          AutoForm.validateField(form.formId, 'isim');
        }

      }
    }
  }
});
