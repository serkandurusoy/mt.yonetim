Template.yardimDokumaniDuzenle.helpers({
  yardimDokumani: function() {
    var yardimDokumani = M.C.YardimDokumanlari.findOne({_id: FlowRouter.getParam('_id'), aktif: true});
    return yardimDokumani;
  }
});

AutoForm.hooks({
  yardimDokumaniDuzenleForm: {
    onSuccess: function(operation, result, template) {
      if (result) {
        FlowRouter.go('yardimDokumaniDetay', {_id: FlowRouter.getParam('_id')});
      }
    }
  }
});
