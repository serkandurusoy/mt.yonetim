Template.sinavTarihce.onCreated(function() {
  this.autorun(() => {
    this.subscribe('sinav', FlowRouter.getParam('_id'));
    this.subscribe('mufredatlar');
  });
});

Template.sinavTarihce.events({
  'click [data-trigger="revert"]'(e,t) {
    const _id = this.ref;
    const doc = _.pick(this, 'kurum', 'aciklama', 'egitimYili', 'ders', 'sinif', 'subeler', 'acilisTarihi', 'acilisSaati', 'kapanisTarihi', 'kapanisSaati', 'tip', 'sure', 'yanitlarAcilmaTarihi', 'yanitlarAcilmaSaati', 'sorularKarissin');
    const coll = 'Sinavlar';
    Session.set('revert', {_id, doc, coll});
    tarihceRevertModalView = Blaze.render(Template.tarihceRevertModal, document.getElementsByTagName('main')[0]);
    $('#tarihceRevertModal').openModal({
      complete() {
        Blaze.remove(tarihceRevertModalView);
      }
    });
  }
});
