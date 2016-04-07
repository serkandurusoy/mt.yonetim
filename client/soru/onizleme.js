Template.soruOnizlemeModal.helpers({
  seciliSoru: function() {
    return M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')});
  },
  soruKomponent: function() {
    var seciliSoru = M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')});
    return M.L.komponentSec(seciliSoru);
  }
});

Template.soruOnizlemeModal.events({
  'click': function(e,t) {
    Blaze.remove(soruOnizlemeView);
  }
});
