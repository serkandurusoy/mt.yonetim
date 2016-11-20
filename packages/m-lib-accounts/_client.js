import { Session } from 'meteor/session';
import { Accounts } from 'meteor/accounts-base';

import { M } from 'meteor/m:lib-core';

Accounts.onEnrollmentLink((token, done) => {
  Session.set('resetToken', token);
  M.L.VerificationDoneCallback = done;
});

Accounts.onResetPasswordLink((token, done) => {
  Session.set('resetToken', token);
  M.L.VerificationDoneCallback = done;
});
