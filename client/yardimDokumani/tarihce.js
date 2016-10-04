Template.yardimDokumaniTarihce.events({
  'click [data-trigger="revert"]': function(e,t) {
    var _id = this.ref;
    var doc = _.pick(this, 'isim','dokuman');
    var coll = 'YardimDokumanlari';
    Session.set('revert', {_id: _id, doc: doc, coll: coll});
    tarihceRevertModalView = Blaze.render(Template.tarihceRevertModal, document.getElementsByTagName('main')[0]);
    $('#tarihceRevertModal').openModal({
      complete: function() {
        Blaze.remove(tarihceRevertModalView);
      }
    });
  }
});
