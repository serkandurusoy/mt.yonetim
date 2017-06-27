import { Template } from 'meteor/templating';

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { AutoForm } from 'meteor/aldeed:autoform';

import { M } from 'meteor/m:lib-core';

import './duzenle.html';

Template.sinavDuzenle.onCreated(function() {
  this.autorun(() => {
    this.subscribe('sinav', FlowRouter.getParam('_id'));
    this.subscribe('mufredatlar');
  });
});

Template.sinavDuzenle.helpers({
  sinav() {
    const sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id'), aktif: true, kilitli: false, iptal: false});
    return sinav;
  }
});

AutoForm.hooks({
  sinavDuzenleForm: {
    before: {
      update(doc) {
        if (doc.$set.sorular && doc.$set.sorular.length > 0) {
          doc.$set.sorular = AutoForm.getCurrentDataForForm('sinavDuzenleForm').doc.sorular;
        }
        return doc;
      }
    },
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('sinavDetay', {_id: FlowRouter.getParam('_id')});
      }
    }
  }
});
