Template.accountsTemplate.helpers({
  resetFlow: function() {
    return Session.get('resetToken');
  }
});

Template.resetForm.helpers({
  accountButtonsDisabled: function() {
    return Session.get('accountButtonsDisabled');
  }
});

Template.resetForm.events({
  'click [data-trigger="cancel"]' : function(e,t) {
    e.preventDefault();
    M.L.clearSessionVariable('resetToken');
    if (M.L.VerificationDoneCallback) {
      M.L.VerificationDoneCallback();
    }
  },
  'submit form': function(e,t) {
    e.preventDefault();
    var password = M.L.Trim(t.$('[name="password"]').val());
    var confirm = M.L.Trim(t.$('[name="confirm"]').val());
    check(password, String);
    check(confirm, String);

    if (password!== confirm) {
      Materialize.toast('Şifre ile tekrarı aynı olmalı', M.E.ToastDismiss, 'red');
    } else {
      Session.set('accountButtonsDisabled', 'disabled');
      Meteor.call('getSifreZorlukFromToken', Session.get('resetToken'), function(error, result) {
        if (error) {
          M.L.clearSessionVariable('accountButtonsDisabled');
          Materialize.toast('Geçersiz bağlantı, yeniden istek oluşturun', M.E.ToastDismiss, 'red');
        } else {
          var userId = result.userId;
          var sifreZorluk = result.sifreZorluk;
          if ( !M.L.validatePasswordStrength(userId, password, sifreZorluk) ) {
            M.L.clearSessionVariable('accountButtonsDisabled');
            Materialize.toast(_.findWhere(M.E.SifreObjects, {name: sifreZorluk}).detail, M.E.ToastDismiss, 'red');
          } else {
            Accounts.resetPassword(
              Session.get('resetToken'),
              password,
              function(err) {
                M.L.clearSessionVariable('accountButtonsDisabled');
                if (err) {
                  if (err.error && err.error === 403) {
                    Materialize.toast('Geçersiz bağlantı, yeniden istek oluşturun', M.E.ToastDismiss, 'red');
                  } else {
                    Materialize.toast(M.E.BilinmeyenHataMessage, M.E.ToastDismiss, 'red');
                  }
                } else {
                  M.L.clearSessionVariable('resetToken');
                  if (M.L.VerificationDoneCallback) {
                    M.L.VerificationDoneCallback();
                  }
                  FlowRouter.go('giris');
                }
              }
            );
          }
        }
      });
    }
  }
});

Template.loginForm.helpers({
  accountButtonsDisabled: function() {
    return Session.get('accountButtonsDisabled');
  }
});

Template.loginForm.events({
  'click [data-trigger="forgotPassword"]' : function(e,t) {
    e.preventDefault();
    var kullanici = M.L.LatinizeLower(M.L.Trim(t.$('[name="kullanici"]').val()));
    check(kullanici, String);
    M.L.clearSessionVariable('resetToken');

    if (kullanici.length < 1) {
      Materialize.toast('E-posta adresi girilmeli', M.E.ToastDismiss, 'red');
    } else {
      if (!M.L.TestEmail(kullanici)) {
        Materialize.toast('Geçerli bir eposta adresi girilmeli', M.E.ToastDismiss, 'red');
      } else {
        Session.set('accountButtonsDisabled', 'disabled');
        Accounts.forgotPassword(
          {email: kullanici},
          function(err) {
            M.L.clearSessionVariable('accountButtonsDisabled');
            Materialize.toast('Posta kutunuzu kontrol edin', M.E.ToastDismiss, 'green');
          }
        )
      }
    }

  },
  'submit form': function(e,t) {
    e.preventDefault();
    var kullanici = M.L.LatinizeLower(M.L.Trim(t.$('[name="kullanici"]').val()));
    var password = M.L.Trim(t.$('[name="password"]').val());
    check(kullanici, String);
    check(password, String);

    M.L.clearSessionVariable('resetToken');

    if (!M.L.TestEmail(kullanici)) {
      Materialize.toast('E-posta adresi veya şifre hatalı', M.E.ToastDismiss, 'red');
    } else {
      Session.set('accountButtonsDisabled', 'disabled');
      Meteor.loginWithPassword(
        {email: kullanici},
        password,
        function (err) {
          M.L.clearSessionVariable('accountButtonsDisabled');
          if (err) {
            if (err.error && err.error === 403) {
              Materialize.toast('E-posta adresi veya şifre hatalı', M.E.ToastDismiss, 'red');
            } else {
              Materialize.toast(M.E.BilinmeyenHataMessage, M.E.ToastDismiss, 'red');
            }
          } else {
            Meteor.logoutOtherClients();
            if (Meteor.userId()) {
              Meteor.call('heartbeat');
            }
          }
        }
      );
    }

  }
});
