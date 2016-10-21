Template.kurumTarihce.events({
  'click [data-trigger="revert"]'(e,t) {
    const _id = this.ref;
    const doc = _.pick(this, 'isim','yetkili','adres','logo');
    const coll = 'Kurumlar';
    Session.set('revert', {_id, doc, coll});
    tarihceRevertModalView = Blaze.render(Template.tarihceRevertModal, document.getElementsByTagName('main')[0]);
    $('#tarihceRevertModal').openModal({
      complete() {
        Blaze.remove(tarihceRevertModalView);
      }
    });
  }
});
