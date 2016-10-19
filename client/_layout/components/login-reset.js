Template.accountsTemplate.helpers({
  resetFlow() {
    return Session.get('resetToken');
  }
});

Template.resetForm.helpers({
  accountButtonsDisabled() {
    return Session.get('accountButtonsDisabled');
  }
});

Template.resetForm.events({
  'click [data-trigger="cancel"]'(e,t) {
    e.preventDefault();
    M.L.clearSessionVariable('resetToken');
    if (M.L.VerificationDoneCallback) {
      M.L.VerificationDoneCallback();
    }
  },
  'submit form'(e,t) {
    e.preventDefault();
    const password = M.L.Trim(t.$('[name="password"]').val());
    const confirm = M.L.Trim(t.$('[name="confirm"]').val());
    check(password, String);
    check(confirm, String);

    if (password!== confirm) {
      toastr.error('Şifre ile tekrarı aynı olmalı.');
    } else {
      Session.set('accountButtonsDisabled', 'disabled');
      Meteor.call('getSifreZorlukFromToken', Session.get('resetToken'),(error, result) => {
        if (error) {
          M.L.clearSessionVariable('accountButtonsDisabled');
          toastr.error('Geçersiz bağlantı. Yeniden istek oluşturun.');
        } else {
          const {
                userId,
                sifreZorluk,
          } = result;
          if ( !M.L.validatePasswordStrength(userId, password, sifreZorluk) ) {
            M.L.clearSessionVariable('accountButtonsDisabled');
            toastr.error(_.findWhere(M.E.SifreObjects, {name: sifreZorluk}).detail);
          } else {
            Accounts.resetPassword(
              Session.get('resetToken'),
              password,
              err => {
                M.L.clearSessionVariable('accountButtonsDisabled');
                if (err) {
                  if (err.error && err.error === 403) {
                    toastr.error('Geçersiz bağlantı. Yeniden istek oluşturun.');
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
  accountButtonsDisabled() {
    return Session.get('accountButtonsDisabled');
  }
});

Template.loginForm.events({
  'click [data-trigger="forgotPassword"]'(e,t) {
    e.preventDefault();
    const kullanici = M.L.LatinizeLower(M.L.Trim(t.$('[name="kullanici"]').val()));
    check(kullanici, String);
    M.L.clearSessionVariable('resetToken');

    if (kullanici.length < 1) {
      toastr.error('E-posta adresi girilmeli.');
    } else {
      if (!M.L.TestEmail(kullanici)) {
        toastr.error('Geçerli bir eposta adresi girilmeli.');
      } else {
        Session.set('accountButtonsDisabled', 'disabled');
        Accounts.forgotPassword(
          {email: kullanici},
          () => {
            M.L.clearSessionVariable('accountButtonsDisabled');
            toastr.success('Posta kutunuzu kontrol edin.');
          }
        )
      }
    }

  },
  'submit form'(e,t) {
    e.preventDefault();
    const kullanici = M.L.LatinizeLower(M.L.Trim(t.$('[name="kullanici"]').val()));
    const password = M.L.Trim(t.$('[name="password"]').val());
    check(kullanici, String);
    check(password, String);

    M.L.clearSessionVariable('resetToken');

    if (!M.L.TestEmail(kullanici)) {
      toastr.error('E-posta adresi veya şifre hatalı.');
    } else {
      Session.set('accountButtonsDisabled', 'disabled');
      Meteor.loginWithPassword(
        {email: kullanici},
        password,
        err => {
          M.L.clearSessionVariable('accountButtonsDisabled');
          if (err) {
            if (err.error && err.error === 403) {
              toastr.error('E-posta adresi veya şifre hatalı.');
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
