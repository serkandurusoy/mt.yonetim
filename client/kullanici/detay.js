Template.kullaniciDetay.onCreated(function() {
  template = this;
  template.autorun(function() {
    template.subscribe('kullaniciById', FlowRouter.getParam('_id'));
  });
});

Template.kullaniciDetay.helpers({
  kullanici: function() {
    var selector = {_id: FlowRouter.getParam('_id')};
    if (Meteor.user().kurum !== 'mitolojix') {
      selector.kurum = Meteor.user().kurum;
    }
    return M.C.Users.findOne(selector);
  }
});

Template.kullaniciDetayKart.onRendered(function(){
  this.parent().$('.collapsible').collapsible();
});

Template.kullaniciDetayKart.helpers({
  initialsOptions: function() {
    var doc = this;
    return {
      name: doc.name + ' ' + doc.lastName,
      height: 250,
      width: 250,
      textColor: '#ffffff',
      fontSize: 80,
      fontWeight: 400,
      radius: 0
    };
  }
});
