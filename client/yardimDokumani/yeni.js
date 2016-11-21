import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

AutoForm.hooks({
  yardimDokumaniYeniForm: {
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('yardimDokumaniListe');
      }
    }
  }
});
