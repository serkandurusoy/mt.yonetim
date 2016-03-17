Template.bilgilerimDetayKart.onRendered(function(){
  this.parent().$('.collapsible').collapsible();
  this.$('[data-tooltip]').tooltip({delay: 50, position: 'bottom'});
});

Template.bilgilerimDetayKart.onDestroyed(function(){
  this.$('[data-tooltip]').tooltip('remove');
  $('.material-tooltip').remove();
});

Template.bilgilerimDetayKart.helpers({
  initialsOptions: function() {
    var doc = this;
    return {
      name: doc.name + ' ' + doc.lastName,
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
  'click .upload-avatar img': function(e,t) {
    var fileSelect = document.createElement('input');
    fileSelect.setAttribute('type', 'file');
    fileSelect.addEventListener('change', function(e) {
      var avatar = e.target.files[0];
      if (!avatar.type.match('image/*') || !(avatar.size <= M.E.uploadMaxImage)) {
        Materialize.toast(M.E.uploadMaxImageMessage, M.E.ToastDismiss, 'red');
      } else {
        var avatarFS = new FS.File(avatar);
        avatarFS.metadata = avatarFS.metadata || {};
        M.FS.Avatar.insert(avatarFS, function(error, uploaded) {
          if (!error) {
            Meteor.call('setAvatar', uploaded._id, function(error,result) {
              if (error) {
                Materialize.toast(M.E.BilinmeyenHataMessage, M.E.ToastDismiss, 'red');
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
  accountButtonsDisabled: function() {
    return Session.get('accountButtonsDisabled');
  }
});

Template.bilgilerimChangePassword.events({
  'submit form': function(e,t) {
    e.preventDefault();
    var password = M.L.Trim(t.$('[name="password"]').val());
    var confirm = M.L.Trim(t.$('[name="confirm"]').val());
    var oldpass = M.L.Trim(t.$('[name="oldpass"]').val());
    check(password, String);
    check(confirm, String);
    check(oldpass, String);

    var digest = Package.sha.SHA256(oldpass);

    Meteor.call('checkPassword', digest, function(err, result) {
      if (!result) {
        Materialize.toast('Eski şifrenizi doğru girmelisiniz', M.E.ToastDismiss, 'red');
      }
      if (result) {
        if (password !== confirm) {
          Materialize.toast('Şifre ile tekrarı aynı olmalı', M.E.ToastDismiss, 'red');
        } else if ( !M.L.validatePasswordStrength(Meteor.userId(), password) ) {
          var userKurum = Meteor.user().kurum;
          var kurum = userKurum === 'mitolojix' ? 'mitolojix' : M.C.Kurumlar.findOne({_id: userKurum});
          var sifreZorluk = kurum === 'mitolojix' ? 'kolay' : kurum.sifre;
          Materialize.toast(_.findWhere(M.E.SifreObjects, {name: sifreZorluk}).detail, M.E.ToastDismiss, 'red');
        } else {
          Session.set('accountButtonsDisabled', 'disabled');
          Accounts.changePassword(
            oldpass,
            password,
            function(err) {
              M.L.clearSessionVariable('accountButtonsDisabled');
              if (err) {
                Materialize.toast(M.E.BilinmeyenHataMessage, M.E.ToastDismiss, 'red');
              } else {
                Materialize.toast('Şifreniz başarıyla değiştirildi', M.E.ToastDismiss, 'green');
              }
            }
          );
        }
      }
    });

  }
});
