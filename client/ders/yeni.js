import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { M } from 'meteor/m:lib-core';

AutoForm.hooks({
  dersYeniForm: {
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('dersListe');
      }
    }
  }
});
