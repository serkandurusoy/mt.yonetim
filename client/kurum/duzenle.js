import { Template } from 'meteor/templating';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';

import { M } from 'meteor/m:lib-core';

import './duzenle.html';

Template.kurumDuzenle.helpers({
  kurum() {
    const kurum = M.C.Kurumlar.findOne({_id: FlowRouter.getParam('_id'), aktif: true});
    if (kurum) {
      kurum.adres.il = M.C.Ilceler.findOne({_id: kurum.adres.ilce}).il;
    }
    return kurum;
  }
});

AutoForm.hooks({
  kurumDuzenleForm: {
    before: {
      method(doc) {
        const form = this;
        form.removeStickyValidationError('isim');
        return doc;
      }
    },
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('kurumDetay', {_id: FlowRouter.getParam('_id')});
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

