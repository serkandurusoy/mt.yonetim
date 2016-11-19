import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { _ } from 'meteor/underscore';

import { SyncedCron } from 'meteor/percolate:synced-cron';

import { M } from 'meteor/m:lib-core';

if (Meteor.settings.public.APP === 'YONETIM') {
  SyncedCron.add({
    name: 'Online olmayan herkese bekleyen notificationsini hatırlat.',
    schedule(parser) {
      return parser.recur().on(13).hour().onWeekday();
    },
    job() {
      Meteor.call('emailNotifications');
    }
  });

  SyncedCron.add({
    name: '1 haftadir okunmayan notificationsi sil',
    schedule(parser) {
      return parser.recur().on(0).hour();
    },
    job() {
      //TODO: bir user inaktife ceviriliyorsa o anda notification'larini da temizle
      Meteor.call('clearOldNotifications');
    }
  });

  Meteor.methods({
    'clearOldNotifications'() {
      this.unblock();
      M.C.Notifications.remove({
        at: {$lt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)}
      });
    },
    'emailNotifications'() {
      this.unblock();

      let users = [];

      M.C.Notifications.find().forEach(notification => {
        const online = M.C.Users.findOne({_id: notification.to, 'status.online': true});
        if (!online) {
          users = _.union(users, [notification.to])
        }
      });

      users = _.uniq(users);

      users.forEach(user => {
        const notifications = M.C.Notifications.find({to: user}, {sort: {at: -1}});

        if (notifications.count() > 0) {
          let notificationText = '';
          let notificationHTML = '';

          //TODO: create secure url's or redirect on nginx
          notifications.forEach(notification => {
            notification.url = Meteor.absoluteUrl(FlowRouter.path(notification.collection === 'Sinavlar' ? 'sinavDetay' : 'soruDetay', {_id: notification.doc}).substr(1));
            notificationText = notificationText.concat(
              'Konu  : ' , notification.kod , ' kodlu ' , notification.collection === 'Sinavlar' ? 'test' : 'soru', '\n',
              'Adet  : ' , notification.count , '\n',
              'Detay : ' , notification.url,
              '\n\n'
            );
            notificationHTML = notificationHTML.concat(
              '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">',
              '<strong style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: bold; color: #333333">Konu:</strong> ' , notification.kod , ' kodlu ' , notification.collection === 'Sinavlar' ? 'test' : 'soru', '<br/>',
              '<strong style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: bold; color: #333333">Adet:</strong> ' , notification.count , '<br/>',
              '<strong style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: bold; color: #333333">Detay:</strong> <a style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #2196F3" target="_blank" href="' , notification.url , '">' , notification.url , '</a>',
              '</p>'
            );
          });

          const userDoc = M.C.Users.findOne({_id: user});

          if (userDoc) {
            Email.send({
              to: userDoc.emails[0].address,
              from: '"Mitolojix'+( Meteor.settings.public.ENV === 'PRODUCTION' ? '' : (' ' + Meteor.settings.public.ENV) )+'" <bilgi@mitolojix.com>',
              subject: 'Bekleyen yeni yorumlar var',
              text: 'Sayın ' + userDoc.name + ' ' + userDoc.lastName + ',\n\n'
              + 'Aşağıdaki konularda, belirtilen adetler kadar yeni yorum dikkatinizi bekliyor.'
              + '\n\n'
              + notificationText
              + 'Detay bağlantılarına tıklayarak ayrıntıları görebilirsiniz.'
              + '\n\n'
              + 'Saygılarımızla,\nMitolojix\n',
              html: '<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>'
              + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sayın ' + userDoc.name + ' ' + userDoc.lastName + ',</p>'
              + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Aşağıdaki konularda, belirtilen adetler kadar yeni yorum dikkatinizi bekliyor.</p>'
              + notificationHTML
              + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Detay bağlantılarına tıklayarak ayrıntıları görebilirsiniz.</p>'
              + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Saygılarımızla,<br/>Mitolojix</p>'
              + '</body></html>'
            });
          }

        }
      });
    }
  });

}
