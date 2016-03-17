Accounts.config({
  loginExpirationInDays: 1,
  forbidClientAccountCreation: true
});

Accounts.onCreateUser(function(options,user){
  _.extend(user, {
    tcKimlik: options.profile.tcKimlik,
    name: options.profile.name,
    lastName: options.profile.lastName,
    cinsiyet: options.profile.cinsiyet,
    dogumTarihi: options.profile.dogumTarihi,
    role: options.profile.role,
    kurum: options.profile.kurum,
    dersleri: options.profile.dersleri ? options.profile.dersleri : [],
    sinif: options.profile.sinif ? options.profile.sinif : '',
    sube: options.profile.sube ? options.profile.sube : '',
    aktif: options.profile.aktif
  });

  delete user.profile;

  return user;
});

Accounts.validateLoginAttempt(function(attempt) {
  if (!attempt.allowed) {
    return false;
  }

  var user = attempt.user;

  if (!user.aktif) {
    throw new Meteor.Error(403, 'User is not marked active');
  }

  if (user.kurum !== 'mitolojix') {
    var kurum = M.C.Kurumlar.findOne({_id: user.kurum});
    if (!(kurum && kurum.aktif)) {
      throw new Meteor.Error(403, 'User\'s kurum is not marked active');
    }
  }

  if (user.role === 'ogrenci') {
    if (Meteor.settings.public.APP === 'BACKEND') {
      throw new Meteor.Error(403, 'This application is only for teachers and administrators');
    }
  } else {
    if (Meteor.settings.public.APP === 'FRONTEND') {
      throw new Meteor.Error(403, 'This application is only for students');
    }
  }

  return true;

});

