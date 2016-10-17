Template.karakterTarihce.events({
  'click [data-trigger="revert"]'(e,t) {
    const {ref: _id} = this;
    const doc = _.pick(this, 'cinsiyet','gorsel');
    const coll = 'Karakterler';
    Session.set('revert', {_id, doc, coll});
    tarihceRevertModalView = Blaze.render(Template.tarihceRevertModal, document.getElementsByTagName('main')[0]);
    $('#tarihceRevertModal').openModal({
      complete() {
        Blaze.remove(tarihceRevertModalView);
      }
    });
  }
});
