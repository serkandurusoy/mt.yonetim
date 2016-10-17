Template.karakterDetay.helpers({
  karakter() {
    return M.C.Karakterler.findOne({_id: FlowRouter.getParam('_id')});
  }
});

Template.karakterDetayKart.onRendered(function(){
  this.parent().$('.collapsible').collapsible();
});

