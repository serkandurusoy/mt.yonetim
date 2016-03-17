Template.kurumDuzenle.helpers({
  kurum: function() {
    var kurum = M.C.Kurumlar.findOne({_id: FlowRouter.getParam('_id'), aktif: true});
    if (kurum) {
      kurum.adres.il = M.C.Ilceler.findOne({_id: kurum.adres.ilce}).il;
    }
    return kurum;
  }
});

AutoForm.hooks({
  kurumDuzenleForm: {
    before: {
      method: function(doc) {
        var form = this;
        form.removeStickyValidationError('isim');
        return doc;
      }
    },
    onSuccess: function(operation, result, template) {
      if (result) {
        FlowRouter.go('kurumDetay', {_id: FlowRouter.getParam('_id')});
      }
    },
    onError: function(operation, error) {
      var form = this;
      if (error) {

        if (error.reason && error.reason.indexOf('duplicate key error') > -1 && error.reason.indexOf('isim') > -1) {
          form.addStickyValidationError('isim', 'notUnique');
          AutoForm.validateField(form.formId, 'isim');
        }

      }
    }
  }
});

