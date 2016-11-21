import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';

import { M } from 'meteor/m:lib-core';

import './duzenle.html';

Template.mufredatDuzenle.onCreated(function() {
  this.autorun(() => {
    this.subscribe('mufredat', FlowRouter.getParam('_id'));
    this.subscribe('fsdersicerik');
  });
});

Template.mufredatDuzenle.helpers({
  mufredat() {
    return M.C.Mufredat.findOne({_id: FlowRouter.getParam('_id'), aktif: true});
  },
  mufredatDuzenleyebilir() {
    if (Meteor.user()) {
      const kurum = Meteor.user().kurum;
      if (kurum === 'mitolojix') {
        return true;
      } else {
        const rol = Meteor.user().role;
        if (rol === 'teknik') {
          return M.C.Mufredat.findOne({_id: FlowRouter.getParam('_id'), aktif: true, kurum: Meteor.user().kurum});
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }
});

AutoForm.hooks({
  mufredatDuzenleForm: {
    before: {
      method(doc) {
        const form = this;
        form.removeStickyValidationError('ders');
        return doc;
      }
    },
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('mufredatDetay', {_id: FlowRouter.getParam('_id')});
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
