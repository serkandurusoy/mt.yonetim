Template.mufredatTarihce.onCreated(function() {
  this.autorun(() => {
    this.subscribe('mufredat', FlowRouter.getParam('_id'));
    this.subscribe('fsdersicerik');
  });
});

Template.mufredatTarihce.events({
  'click [data-trigger="revert"]'(e,t) {
    const _id = this.ref;
    const doc = _.pick(this, 'kurum', 'egitimYili', 'ders', 'sinif', 'konular');
    const coll = 'Mufredat';
    Session.set('revert', {_id, doc, coll});
    tarihceRevertModalView = Blaze.render(Template.tarihceRevertModal, document.getElementsByTagName('main')[0]);
    $('#tarihceRevertModal').openModal({
      complete() {
        Blaze.remove(tarihceRevertModalView);
      }
    });
  }
});
