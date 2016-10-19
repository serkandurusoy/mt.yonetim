Template.dersDuzenle.helpers({
  ders() {
    return M.C.Dersler.findOne({_id: FlowRouter.getParam('_id'), aktif: true});
  }
});

AutoForm.hooks({
  dersDuzenleForm: {
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('dersDetay', {_id: FlowRouter.getParam('_id')});
      }
    }
  }
});
