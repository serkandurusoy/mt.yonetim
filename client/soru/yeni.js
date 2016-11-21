import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';

import { M } from 'meteor/m:lib-core';

import './yeni.html';

Template.soruYeni.onCreated(function() {
  this.subscribe('mufredatlar');
  this.subscribe('fssorugorsel');
  this.data.soruClone = Session.get('soruClone');
  M.L.clearSessionVariable('soruClone');
});

AutoForm.hooks({
  soruYeniForm: {
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('soruDetay', {_id: result});
      }
    }
  }
});
