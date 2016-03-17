Accounts.onEnrollmentLink(function(token, done) {
  Session.set('resetToken', token);
  M.L.VerificationDoneCallback = done;
});

Accounts.onResetPasswordLink(function(token, done) {
  Session.set('resetToken', token);
  M.L.VerificationDoneCallback = done;
});
