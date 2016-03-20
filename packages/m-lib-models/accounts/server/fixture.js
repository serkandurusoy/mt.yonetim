Meteor.startup(function() {
  if (Meteor.settings.public.APP === 'YONETIM' && M.C.Users.find().count() === 0) {

    var userArray = [
      {
        email : 'admin@mitolojix.com',
        profile: {
          tcKimlik: '00000000001',
          name: 'Mitolojix',
          lastName: 'Admin 1',
          cinsiyet: 'erkek',
          dogumTarihi: moment.tz(new Date(2015,0,1),'Europe/Istanbul').toDate(),
          role: 'mitolojix',
          kurum: 'mitolojix',
          aktif: true
        }
      },
      {
        email : 'birol@mitolojix.com',
        profile: {
          tcKimlik: '00000000002',
          name: 'Mitolojix',
          lastName: 'Admin 2',
          cinsiyet: 'erkek',
          dogumTarihi: moment.tz(new Date(2015,0,1),'Europe/Istanbul').toDate(),
          role: 'mitolojix',
          kurum: 'mitolojix',
          aktif: true
        }
      },
      {
        email : 'murat@mitolojix.com',
        profile: {
          tcKimlik: '00000000003',
          name: 'Mitolojix',
          lastName: 'Admin 3',
          cinsiyet: 'erkek',
          dogumTarihi: moment.tz(new Date(2015,0,1),'Europe/Istanbul').toDate(),
          role: 'mitolojix',
          kurum: 'mitolojix',
          aktif: true
        }
      }
    ];

    _.each(userArray, function (user) {
      var userId = Accounts.createUser({
        email: user.email,
        profile: user.profile
      });

      Accounts.sendEnrollmentEmail(userId);

    });

  }

});

