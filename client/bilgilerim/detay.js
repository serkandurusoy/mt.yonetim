import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';

import { FS } from 'meteor/cfs:base-package';

import { M } from 'meteor/m:lib-core';

import './detayKart.html';

Template.bilgilerimDetayKart.onRendered(function(){
  this.parent().$('.collapsible').collapsible();
  this.$('[data-tooltip]').tooltip({delay: 50, position: 'bottom'});
});

Template.bilgilerimDetayKart.onDestroyed(function(){
  this.$('[data-tooltip]').tooltip('remove');
  $('.material-tooltip').remove();
});

Template.bilgilerimDetayKart.helpers({
  initialsOptions() {
    return {
      name: this.name + ' ' + this.lastName,
      height: 250,
      width: 250,
      charCount: 2,
      textColor: '#ffffff',
      fontSize: 80,
      fontWeight: 400,
      radius: 0
    };
  }
});

Template.bilgilerimDetayKart.events({
  'click .upload-avatar img'(e,t) {
    const fileSelect = document.createElement('input');
    fileSelect.setAttribute('type', 'file');
    fileSelect.addEventListener('change', e => {
      const avatar = e.target.files[0];
      if (!avatar.type.match('image/*') || !(avatar.size <= M.E.uploadMaxImage)) {
        toastr.error(M.E.uploadMaxImageMessage);
      } else {
        const avatarFS = new FS.File(avatar);
        avatarFS.metadata = avatarFS.metadata || {};
        M.FS.Avatar.insert(avatarFS, (error, uploaded) => {
          if (!error) {
            Meteor.call('setAvatar', uploaded._id, (error,result) => {
              if (error) {
                toastr.error(M.E.BilinmeyenHataMessage);
              }
            });
          }
        });
      }
    });
    fileSelect.click();
  }
});

Template.bilgilerimChangePassword.helpers({
  accountButtonsDisabled() {
    return Session.get('accountButtonsDisabled');
  }
});

Template.bilgilerimChangePassword.events({
  'submit form'(e,t) {
    e.preventDefault();
    const password = M.L.Trim(t.$('[name="password"]').val());
    const confirm = M.L.Trim(t.$('[name="confirm"]').val());
    const oldpass = M.L.Trim(t.$('[name="oldpass"]').val());
    check(password, String);
    check(confirm, String);
    check(oldpass, String);

    const digest = Package.sha.SHA256(oldpass);

    Meteor.call('checkPassword', digest, (err, result) => {
      if (!result) {
        toastr.error('Eski şifrenizi doğru girmelisiniz.');
      }
      if (result) {
        if (password !== confirm) {
          toastr.error('Şifre ile tekrarı aynı olmalı.');
        } else if ( !M.L.validatePasswordStrength(Meteor.userId(), password) ) {
          const userKurum = Meteor.user().kurum;
          const kurum = userKurum === 'mitolojix' ? 'mitolojix' : M.C.Kurumlar.findOne({_id: userKurum});
          const sifreZorluk = kurum === 'mitolojix' ? 'kolay' : kurum.sifre;
          toastr.error(_.findWhere(M.E.SifreObjects, {name: sifreZorluk}).detail);
        } else {
          Session.set('accountButtonsDisabled', 'disabled');
          Accounts.changePassword(
            oldpass,
            password,
            err => {
              M.L.clearSessionVariable('accountButtonsDisabled');
              if (err) {
                toastr.error(M.E.BilinmeyenHataMessage);
              } else {
                toastr.success('Şifreniz başarıyla değiştirildi.');
              }
            }
          );
        }
      }
    });

  }
});
