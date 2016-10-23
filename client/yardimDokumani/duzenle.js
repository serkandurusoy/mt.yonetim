Template.yardimDokumaniDuzenle.helpers({
  yardimDokumani() {
    return M.C.YardimDokumanlari.findOne({_id: FlowRouter.getParam('_id'), aktif: true});
  }
});

AutoForm.hooks({
  yardimDokumaniDuzenleForm: {
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('yardimDokumaniDetay', {_id: FlowRouter.getParam('_id')});
      }
    }
  }
});
