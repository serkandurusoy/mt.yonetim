Template.kullaniciTarihce.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.subscribe('kullaniciById', FlowRouter.getParam('_id'));
  });
});

var kullaniciTarihceRevertModalView=null;

Template.kullaniciTarihce.events({
  'click [data-trigger="revert"]': function(e,t) {
    var _id = this.ref;
    var doc = _.pick(this, 'name','lastName','tcKimlik','dogumTarihi','cinsiyet','emails','role','kurum','dersleri','sinif','sube');
    var email = doc.emails[0].address;
    Session.set('revert', {_id: _id, doc: doc, email: email});
    kullaniciTarihceRevertModalView = Blaze.render(Template.kullaniciTarihceRevertModal, document.getElementsByTagName('main')[0]);
    $('#kullaniciTarihceRevertModal').openModal({
      complete: function() {
        Blaze.remove(kullaniciTarihceRevertModalView);
      }
    });
  }
});

Template.kullaniciTarihceRevertModal.events({
  'click [data-trigger="revert"]': function(e,t) {
    var revert = Session.get('revert');
    M.C.Users.update({_id: revert._id}, {$set: revert.doc}, function(err,res) {
      if (err) {
        toastr.error('İşlem başarısız. Düzenleme ekranını deneyin.');
      }
      if (res && revert.doc.role !== 'ogrenci') {
        Accounts.forgotPassword(
          {email: revert.email},
          function(err) {
            toastr.success('Kullanıcıya şifre yenileme mesajı iletildi.');
          }
        )
      }
    });
    M.L.clearSessionVariable('revert');
    $('#kullaniciTarihceRevertModal').closeModal({
      complete: function() {
        Blaze.remove(kullaniciTarihceRevertModalView);
      }
    });
  }
});
