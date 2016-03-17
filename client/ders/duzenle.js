Template.dersDuzenle.helpers({
  ders: function() {
    var ders = M.C.Dersler.findOne({_id: FlowRouter.getParam('_id'), aktif: true});
    return ders;
  }
});

AutoForm.hooks({
  dersDuzenleForm: {
    onSuccess: function(operation, result, template) {
      if (result) {
        FlowRouter.go('dersDetay', {_id: FlowRouter.getParam('_id')});
      }
    }
  }
});
