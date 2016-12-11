import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { moment } from 'meteor/momentjs:moment';

import { M } from 'meteor/m:lib-core';

Meteor.startup(() => {
  if (Meteor.settings.public.APP === 'YONETIM' && M.C.Users.find().count() === 0) {

    const userArray = [
      {
        email : 'admin@mitolojix.com',
        profile: {
          tcKimlik: '00000000001',
          name: 'Mitolojix',
          lastName: 'Admin 1',
          cinsiyet: 'erkek',
          dogumTarihi: moment.tz(new Date(2016,0,1),'Europe/Istanbul').toDate(),
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
          dogumTarihi: moment.tz(new Date(2016,0,1),'Europe/Istanbul').toDate(),
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
          dogumTarihi: moment.tz(new Date(2016,0,1),'Europe/Istanbul').toDate(),
          role: 'mitolojix',
          kurum: 'mitolojix',
          aktif: true
        }
      }
    ];

    userArray.forEach(user => {
      const {
        email,
        profile,
      } = user;
      const userId = Accounts.createUser({
        email,
        profile,
      });

      Accounts.sendEnrollmentEmail(userId);

    });

  }

});

