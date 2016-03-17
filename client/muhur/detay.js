Template.muhurDetay.helpers({
  muhur: function() {
    return M.C.Muhurler.findOne({_id: FlowRouter.getParam('_id')});
  }
});

Template.muhurDetayKart.onRendered(function(){
  this.parent().$('.collapsible').collapsible();
});

