import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { Accounts } from 'meteor/accounts-base';
import { Session } from 'meteor/session';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { M } from 'meteor/m:lib-core';

import './tarihce.html';

Template.kullaniciTarihce.onCreated(function() {
  const template = this;
  template.autorun(() => {
    template.subscribe('kullaniciById', FlowRouter.getParam('_id'));
  });
});

let kullaniciTarihceRevertModalView=null;

Template.kullaniciTarihce.events({
  'click [data-trigger="revert"]'(e,t) {
    const _id = this.ref;
    const doc = _.pick(this, 'name','lastName','tcKimlik','dogumTarihi','cinsiyet','emails','role','kurum','dersleri','sinif','sube');
    const email = doc.emails[0].address;
    Session.set('revert', {_id, doc, email});
    kullaniciTarihceRevertModalView = Blaze.render(Template.kullaniciTarihceRevertModal, document.getElementsByTagName('main')[0]);
    $('#kullaniciTarihceRevertModal').openModal({
      complete() {
        Blaze.remove(kullaniciTarihceRevertModalView);
      }
    });
  }
});

Template.kullaniciTarihceRevertModal.events({
  'click [data-trigger="revert"]'(e,t) {
    const revert = Session.get('revert');
    M.C.Users.update({_id: revert._id}, {$set: revert.doc}, (err,res) => {
      if (err) {
        toastr.error('İşlem başarısız. Düzenleme ekranını deneyin.');
      }
      if (res && revert.doc.role !== 'ogrenci') {
        Accounts.forgotPassword(
          {email: revert.email},
          (err) => {
            toastr.success('Kullanıcıya şifre yenileme mesajı iletildi.');
          }
        )
      }
    });
    M.L.clearSessionVariable('revert');
    $('#kullaniciTarihceRevertModal').closeModal({
      complete() {
        Blaze.remove(kullaniciTarihceRevertModalView);
      }
    });
  }
});
