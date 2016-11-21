import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

AutoForm.hooks({
  dersYeniForm: {
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('dersListe');
      }
    }
  }
});
