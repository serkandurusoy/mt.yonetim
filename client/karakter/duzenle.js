Template.karakterDuzenle.helpers({
  karakter: function() {
    var karakter = M.C.Karakterler.findOne({_id: FlowRouter.getParam('_id'), aktif: true});
    return karakter;
  }
});

AutoForm.hooks({
  karakterDuzenleForm: {
    onSuccess: function(operation, result, template) {
      if (result) {
        FlowRouter.go('karakterDetay', {_id: FlowRouter.getParam('_id')});
      }
    }
  }
});
