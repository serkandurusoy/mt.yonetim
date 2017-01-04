import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { M } from 'meteor/m:lib-core';

import './yeni.html';

Template.sinavYeni.onCreated(function() {
  this.subscribe('mufredatlar');
  this.data.sinavClone = Session.get('sinavClone');
  M.L.clearSessionVariable('sinavClone');
});

AutoForm.hooks({
  sinavYeniForm: {
    before: {
      insert(doc) {
        if (doc._clonedFrom) {
          const form = AutoForm.getCurrentDataForForm('sinavYeniForm');
          if (form && form.doc && form.doc.sorular) {
            doc.sorular = form.doc.sorular;
          }
        }
        return doc;
      }
    },
    onSuccess(operation, result, template) {
      if (result) {
        Session.set('yeniSinav', result);
        FlowRouter.go('sinavDetay', {_id: result});
      }
    }
  }
});
