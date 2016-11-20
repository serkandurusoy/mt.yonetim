import { Accounts } from 'meteor/accounts-base';
import { _ } from 'meteor/underscore';

import { M } from 'meteor/m:lib-core';

Accounts.config({
  loginExpirationInDays: 1,
  forbidClientAccountCreation: true
});

Accounts.onCreateUser((options,user) =>{

  const {
    profile: {
      tcKimlik,
      name,
      lastName,
      cinsiyet,
      dogumTarihi,
      role,
      kurum,
      dersleri = [],
      sinif = '',
      sube = '',
      aktif,
    },
  } = options;

  _.extend(user, {
    tcKimlik,
    name,
    lastName,
    cinsiyet,
    dogumTarihi,
    role,
    kurum,
    dersleri,
    sinif,
    sube,
    aktif,
  });

  delete user.profile;

  return user;
});

Accounts.validateLoginAttempt(attempt =>{
  if (!attempt.allowed) {
    return false;
  }

  const user = attempt.user;

  if (!user.aktif) {
    throw new Meteor.Error(403, 'User is not marked active');
  }

  if (user.kurum !== 'mitolojix') {
    const kurum = M.C.Kurumlar.findOne({_id: user.kurum});
    if (!(kurum && kurum.aktif)) {
      throw new Meteor.Error(403, 'User\'s kurum is not marked active');
    }
  }

  if (user.role === 'ogrenci') {
    if (Meteor.settings.public.APP === 'YONETIM') {
      throw new Meteor.Error(403, 'This application is only for teachers and administrators');
    }
  } else {
    if (Meteor.settings.public.APP === 'OYUN') {
      throw new Meteor.Error(403, 'This application is only for students');
    }
  }

  return true;

});

