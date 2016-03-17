Template.kurumDetay.helpers({
  kurum: function() {
    return M.C.Kurumlar.findOne({_id: FlowRouter.getParam('_id')});
  }
});

Template.kurumDetayKart.onRendered(function(){
  this.parent().$('.collapsible').collapsible();
});
