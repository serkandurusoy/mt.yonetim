import { Template } from 'meteor/templating';

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { AutoForm } from 'meteor/aldeed:autoform';

import { M } from 'meteor/m:lib-core';

import './duzenle.html';

Template.muhurDuzenle.helpers({
  muhur() {
    return M.C.Muhurler.findOne({_id: FlowRouter.getParam('_id'), aktif: true});
  }
});

AutoForm.hooks({
  muhurDuzenleForm: {
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
        FlowRouter.go('muhurDetay', {_id: FlowRouter.getParam('_id')});
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
