Template.mufredatDuzenle.onCreated(function() {
  template = this;
  template.autorun(function() {
    template.subscribe('mufredat', FlowRouter.getParam('_id'));
    template.subscribe('fsdersicerik');
  });
});

Template.mufredatDuzenle.helpers({
  mufredat: function() {
    var mufredat = M.C.Mufredat.findOne({_id: FlowRouter.getParam('_id'), aktif: true});
    return mufredat;
  },
  mufredatDuzenleyebilir: function() {
    if (Meteor.user()) {
      var kurum = Meteor.user().kurum;
      if (kurum === 'mitolojix') {
        return true;
      } else {
        var rol = Meteor.user().role;
        if (rol === 'teknik') {
          return M.C.Mufredat.findOne({_id: FlowRouter.getParam('_id'), aktif: true, kurum: Meteor.user().kurum});
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }
});

AutoForm.hooks({
  mufredatDuzenleForm: {
    before: {
      method: function(doc) {
        var form = this;
        form.removeStickyValidationError('ders');
        return doc;
      }
    },
    onSuccess: function(operation, result, template) {
      if (result) {
        FlowRouter.go('mufredatDetay', {_id: FlowRouter.getParam('_id')});
      }
    },
    onError: function(operation, error) {
      var form = this;
      if (error) {

        if (error.reason && error.reason.indexOf('duplicate key error')) {
          form.addStickyValidationError('ders', 'notUnique');
          AutoForm.validateField(form.formId, 'ders');
        }

      }
    }
  }
});
