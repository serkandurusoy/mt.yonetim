Template.sinavDuzenle.onCreated(function() {
  template = this;
  template.autorun(function() {
    template.subscribe('sinav', FlowRouter.getParam('_id'));
    template.subscribe('mufredatlar');
  });
});

Template.sinavDuzenle.helpers({
  sinav: function() {
    var sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id'), aktif: true, kilitli: false, iptal: false});
    return sinav;
  }
});

AutoForm.hooks({
  sinavDuzenleForm: {
    before: {
      update: function(doc) {
        if (doc.$set.sorular.length > 0) {
          doc.$set.sorular = AutoForm.getCurrentDataForForm('sinavDuzenleForm').doc.sorular;
        }
        return doc;
      }
    },
    onSuccess: function(operation, result, template) {
      if (result) {
        FlowRouter.go('sinavDetay', {_id: FlowRouter.getParam('_id')});
      }
    }
  }
});
