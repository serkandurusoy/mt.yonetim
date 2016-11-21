import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { M } from 'meteor/m:lib-core';

import './yeni.html';

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
