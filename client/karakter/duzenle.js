import { Template } from 'meteor/templating';

import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { M } from 'meteor/m:lib-core';

import './duzenle.html';

Template.karakterDuzenle.helpers({
  karakter() {
    return M.C.Karakterler.findOne({_id: FlowRouter.getParam('_id'), aktif: true});
  }
});

AutoForm.hooks({
  karakterDuzenleForm: {
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('karakterDetay', {_id: FlowRouter.getParam('_id')});
      }
    }
  }
});
