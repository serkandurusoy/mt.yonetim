import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { M } from 'meteor/m:lib-core';

AutoForm.hooks({
  muhurYeniForm: {
    before: {
      method(doc) {
        const form = this;
        form.removeStickyValidationError('isim');
        form.removeStickyValidationError('sira');
        form.removeStickyValidationError('gorsel');
        return doc;
      }
    },
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('muhurListe');
      }
    },
    onError(operation, error) {
      const form = this;
      if (error) {

        if (error.reason && error.reason.indexOf('duplicate key error') > -1 && error.reason.indexOf('isim') > -1) {
          form.addStickyValidationError('isim', 'notUnique');
          AutoForm.validateField(form.formId, 'isim');
        }

        if (error.reason && error.reason.indexOf('duplicate key error') > -1 && error.reason.indexOf('sira') > -1) {
          form.addStickyValidationError('sira', 'notUnique');
          AutoForm.validateField(form.formId, 'sira');
        }

        if (error.reason && error.reason.indexOf('duplicate key error') > -1 && error.reason.indexOf('gorsel') > -1) {
          form.addStickyValidationError('gorsel', 'notUnique');
          AutoForm.validateField(form.formId, 'gorsel');
        }

      }
    }
  }
});
