import { Template } from 'meteor/templating';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';

import { M } from 'meteor/m:lib-core';

import './duzenle.html';

Template.yardimDokumaniDuzenle.helpers({
  yardimDokumani() {
    return M.C.YardimDokumanlari.findOne({_id: FlowRouter.getParam('_id'), aktif: true});
  }
});

AutoForm.hooks({
  yardimDokumaniDuzenleForm: {
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('yardimDokumaniDetay', {_id: FlowRouter.getParam('_id')});
      }
    }
  }
});
