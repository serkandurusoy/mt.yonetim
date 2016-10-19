Template.dersDetay.helpers({
  ders() {
    return M.C.Dersler.findOne({_id: FlowRouter.getParam('_id')});
  }
});

Template.dersDetayKart.onRendered(function(){
  this.parent().$('.collapsible').collapsible();
});
