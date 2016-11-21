import { Template } from 'meteor/templating';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';

import { M } from 'meteor/m:lib-core';

import './duzenle.html';

Template.dersDuzenle.helpers({
  ders() {
    return M.C.Dersler.findOne({_id: FlowRouter.getParam('_id'), aktif: true});
  }
});

AutoForm.hooks({
  dersDuzenleForm: {
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('dersDetay', {_id: FlowRouter.getParam('_id')});
      }
    }
  }
});
