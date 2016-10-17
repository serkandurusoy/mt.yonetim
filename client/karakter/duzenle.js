Template.karakterDuzenle.helpers({
  karakter() {
    return M.C.Karakterler.findOne({_id: FlowRouter.getParam('_id'), aktif: true});
  }
});

AutoForm.hooks({
  karakterDuzenleForm: {
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('karakterDetay', {_id: FlowRouter.getParam('_id')});
      }
    }
  }
});
