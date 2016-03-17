Template.sinavTarihce.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('sinav', FlowRouter.getParam('_id'));
    template.subscribe('mufredatlar');
  });
});

Template.sinavTarihce.events({
  'click [data-trigger="revert"]': function(e,t) {
    var _id = this.ref;
    var doc = _.pick(this, 'kurum', 'aciklama', 'egitimYili', 'ders', 'sinif', 'subeler', 'acilisTarihi', 'acilisSaati', 'kapanisTarihi', 'kapanisSaati', 'tip', 'sure', 'yanitlarAcilmaTarihi', 'yanitlarAcilmaSaati', 'sorularKarissin');
    var coll = 'Sinavlar';
    Session.set('revert', {_id: _id, doc: doc, coll: coll});
    tarihceRevertModalView = Blaze.render(Template.tarihceRevertModal, document.getElementsByTagName('main')[0]);
    $('#tarihceRevertModal').openModal({
      complete: function() {
        Blaze.remove(tarihceRevertModalView);
      }
    });
  }
});
