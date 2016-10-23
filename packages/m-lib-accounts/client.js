Accounts.onEnrollmentLink((token, done) => {
  Session.set('resetToken', token);
  M.L.VerificationDoneCallback = done;
});

Accounts.onResetPasswordLink((token, done) => {
  Session.set('resetToken', token);
  M.L.VerificationDoneCallback = done;
});
