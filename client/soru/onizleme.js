Template.soruOnizlemeModal.helpers({
  seciliSoru: function() {
    return M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')});
  }
});

Template.soruOnizlemeModal.events({
  'click': function(e,t) {
    Blaze.remove(soruOnizlemeView);
  }
});
