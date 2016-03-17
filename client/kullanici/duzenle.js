Template.kullaniciDuzenle.onCreated(function() {
  template = this;
  template.autorun(function() {
    template.subscribe('kullaniciById', FlowRouter.getParam('_id'));
  });
});

Template.kullaniciDuzenle.helpers({
  kullanici: function() {
    var selector = {_id: FlowRouter.getParam('_id'), aktif: true};
    if (Meteor.user().kurum !== 'mitolojix') {
      selector.kurum = Meteor.user().kurum;
    }
    return M.C.Users.findOne(selector);
  }
});

AutoForm.hooks({
  kullaniciDuzenleForm: {
    before: {
      method: function(doc) {
        var form = this;
        form.removeStickyValidationError('emails.0.address');
        form.removeStickyValidationError('tcKimlik');
        return doc;
      }
    },
    onSuccess: function(operation, result, template) {
      if (result) {
        FlowRouter.go('kullaniciDetay', {_id: FlowRouter.getParam('_id')});
      }
    },
    onError: function(operation, error) {
      var form = this;
      if (error) {

        if (error.reason && error.reason.indexOf('duplicate key error') > -1 && error.reason.indexOf('email') > -1) {
          form.addStickyValidationError('emails.0.address', 'notUnique');
          AutoForm.validateField(form.formId, 'emails.0.address');
        }

        if (error.reason && error.reason === 'Geçerli bir TC kimlik numarası girilmeli') {
          form.addStickyValidationError('tcKimlik', 'tcKimlikHatali');
          AutoForm.validateField(form.formId, 'tcKimlik');
        }

        if (error.reason && error.reason.indexOf('duplicate key error') > -1 && error.reason.indexOf('tcKimlik') > -1) {
          form.addStickyValidationError('tcKimlik', 'notUnique');
          AutoForm.validateField(form.formId, 'tcKimlik');
        }

      }
    }
  }
});

