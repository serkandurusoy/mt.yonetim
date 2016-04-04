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
      toastr.error('Şifre ile tekrarı aynı olmalı');
    } else {
      Session.set('accountButtonsDisabled', 'disabled');
      Meteor.call('getSifreZorlukFromToken', Session.get('resetToken'), function(error, result) {
        if (error) {
          M.L.clearSessionVariable('accountButtonsDisabled');
          toastr.error('Geçersiz bağlantı, yeniden istek oluşturun');
        } else {
          var userId = result.userId;
          var sifreZorluk = result.sifreZorluk;
          if ( !M.L.validatePasswordStrength(userId, password, sifreZorluk) ) {
            M.L.clearSessionVariable('accountButtonsDisabled');
            toastr.error(_.findWhere(M.E.SifreObjects, {name: sifreZorluk}).detail);
          } else {
            Accounts.resetPassword(
              Session.get('resetToken'),
              password,
              function(err) {
                M.L.clearSessionVariable('accountButtonsDisabled');
                if (err) {
                  if (err.error && err.error === 403) {
                    toastr.error('Geçersiz bağlantı, yeniden istek oluşturun');
                  } else {
                    toastr.error(M.E.BilinmeyenHataMessage);
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
      toastr.error('E-posta adresi girilmeli');
    } else {
      if (!M.L.TestEmail(kullanici)) {
        toastr.error('Geçerli bir eposta adresi girilmeli');
      } else {
        Session.set('accountButtonsDisabled', 'disabled');
        Accounts.forgotPassword(
          {email: kullanici},
          function(err) {
            M.L.clearSessionVariable('accountButtonsDisabled');
            toastr.success('Posta kutunuzu kontrol edin');
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
      toastr.error('E-posta adresi veya şifre hatalı');
    } else {
      Session.set('accountButtonsDisabled', 'disabled');
      Meteor.loginWithPassword(
        {email: kullanici},
        password,
        function (err) {
          M.L.clearSessionVariable('accountButtonsDisabled');
          if (err) {
            if (err.error && err.error === 403) {
              toastr.error('E-posta adresi veya şifre hatalı');
            } else {
              toastr.error(M.E.BilinmeyenHataMessage);
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
