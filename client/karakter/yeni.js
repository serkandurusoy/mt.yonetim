import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

AutoForm.hooks({
  karakterYeniForm: {
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('karakterListe');
      }
    }
  }
});
