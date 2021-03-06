Template.mufredatTarihce.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('mufredat', FlowRouter.getParam('_id'));
    template.subscribe('fsdersicerik');
  });
});

Template.mufredatTarihce.events({
  'click [data-trigger="revert"]': function(e,t) {
    var _id = this.ref;
    var doc = _.pick(this, 'kurum', 'egitimYili', 'ders', 'sinif', 'konular');
    var coll = 'Mufredat';
    Session.set('revert', {_id: _id, doc: doc, coll: coll});
    tarihceRevertModalView = Blaze.render(Template.tarihceRevertModal, document.getElementsByTagName('main')[0]);
    $('#tarihceRevertModal').openModal({
      complete: function() {
        Blaze.remove(tarihceRevertModalView);
      }
    });
  }
});
