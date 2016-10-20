Template.kullaniciDetay.onCreated(function() {
  const template = this;
  template.autorun(() => {
    template.subscribe('kullaniciById', FlowRouter.getParam('_id'));
  });
});

Template.kullaniciDetay.helpers({
  kullanici() {
    let selector = {_id: FlowRouter.getParam('_id')};
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
  initialsOptions() {
    const {
      name,
      lastName,
    } = this;
    return {
      name: `${name} ${lastName}`,
      height: 250,
      width: 250,
      textColor: '#ffffff',
      fontSize: 80,
      fontWeight: 400,
      radius: 0
    };
  },
  accountActivated() {
    return !!M.C.UserConnectionLog.findOne({userId: this._id});
  }
});

Template.kullaniciDetayKart.events({
  'click [data-trigger="giris-cikis"]'(e,t) {
    const girisCikisView = Blaze.render(Template.girisCikisModal, document.getElementsByTagName('main')[0]);
    $('#girisCikisModal').openModal({
      complete() {
        Blaze.remove(girisCikisView);
      }
    });
  }
});

Template.girisCikisModal.onCreated(function() {
  const template = this;
  template.autorun(() => {
    template.subscribe('kullaniciGirisCikislari', FlowRouter.getParam('_id'));
  });
});

Template.girisCikisModal.helpers({
  girisCikis() {
    return M.C.UserConnectionLog.find({userId: FlowRouter.getParam('_id')}, {sort: {createdAt: -1}})
  }
});
