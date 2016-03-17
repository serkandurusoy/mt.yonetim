Template.dersDetay.helpers({
  ders: function() {
    return M.C.Dersler.findOne({_id: FlowRouter.getParam('_id')});
  }
});

Template.dersDetayKart.onRendered(function(){
  this.parent().$('.collapsible').collapsible();
});
