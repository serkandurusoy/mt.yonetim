Template.soruTarihce.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('soru', FlowRouter.getParam('_id'));
    template.subscribe('mufredatlar');
    template.subscribe('fssorugorsel');
  });
});

Template.soruTarihce.events({
  'click [data-trigger="revert"]': function(e,t) {
    var _id = this.ref;
    var doc = _.pick(this, 'kurum', 'alan', 'tip', 'zorlukDerecesi', 'soru', 'yanit');
    var coll = 'Sorular';
    Session.set('revert', {_id: _id, doc: doc, coll: coll});
    tarihceRevertModalView = Blaze.render(Template.tarihceRevertModal, document.getElementsByTagName('main')[0]);
    $('#tarihceRevertModal').openModal({
      complete: function() {
        Blaze.remove(tarihceRevertModalView);
      }
    });
  }
});
