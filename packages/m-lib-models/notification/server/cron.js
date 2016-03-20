if (Meteor.settings.public.APP === 'YONETIM') {
  SyncedCron.add({
    name: 'Online olmayan herkese bekleyen notificationsini hatırlat.',
    schedule: function (parser) {
      return parser.recur().on(13).hour().onWeekday();
    },
    job: function () {
      Meteor.call('emailNotifications');
    }
  });

  SyncedCron.add({
    name: '1 haftadir okunmayan notificationsi sil',
    schedule: function (parser) {
      return parser.recur().on(0).hour();
    },
    job: function () {
      //TODO: bir user inaktife ceviriliyorsa o anda notification'larini da temizle
      Meteor.call('clearOldNotifications');
    }
  });

  Meteor.methods({
    'clearOldNotifications': function() {
      this.unblock();
      M.C.Notifications.remove({
        at: {$lt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)}
      });
    },
    'emailNotifications': function() {
      this.unblock();

      var users = [];

      M.C.Notifications.find().forEach(function(notification) {
        var online = M.C.Users.findOne({_id: notification.to, 'status.online': true});
        if (!online) {
          users = _.union(users, [notification.to])
        }
      });

      users = _.uniq(users);

      _.each(users, function(user) {
        var notifications = M.C.Notifications.find({to: user}, {sort: {at: -1}});

        if (notifications.count() > 0) {
          var notificationText = '';
          var notificationHTML = '';

          //TODO: create secure url's or redirect on nginx
          notifications.forEach(function(notification) {
            notification.url = Meteor.absoluteUrl(FlowRouter.path(notification.collection === 'Sinavlar' ? 'sinavDetay' : 'soruDetay', {_id: notification.doc}).substr(1));
            notificationText = notificationText.concat(
              'Konu  : ' , notification.kod , ' kodlu ' , notification.collection === 'Sinavlar' ? 'sınav' : 'soru', '\n',
              'Adet  : ' , notification.count , '\n',
              'Detay : ' , notification.url,
              '\n\n'
            );
            notificationHTML = notificationHTML.concat(
              '<p>',
              '<strong>Konu:</strong> ' , notification.kod , ' kodlu ' , notification.collection === 'Sinavlar' ? 'sınav' : 'soru', '<br/>',
              '<strong>Adet:</strong> ' , notification.count , '<br/>',
              '<strong>Detay:</strong> <a target="_blank" href="' , notification.url , '">' , notification.url , '</a>',
              '</p>'
            );
          });

          var userDoc = M.C.Users.findOne({_id: user});

          if (userDoc) {
            Email.send({
              to: userDoc.emails[0].address,
              from: '"Mitolojix" <admin@mitolojix.com>',
              subject: 'Bekleyen yeni yorumlar var',
              text: 'Sayın ' + userDoc.name + ' ' + userDoc.lastName + ',\n\n'
              + 'Aşağıdaki konularda, belirtilen adetler kadar yeni yorum dikkatinizi bekliyor.'
              + '\n\n'
              + notificationText
              + 'Detay bağlantılarına tıklayarak ayrıntıları görebilirsiniz.'
              + '\n\n'
              + 'Saygılarımızla,\nMitolojix\n',
              html: '<html><head></head><body>'
              + '<p>Sayın ' + userDoc.name + ' ' + userDoc.lastName + ',</p>'
              + '<p>Aşağıdaki konularda, belirtilen adetler kadar yeni yorum dikkatinizi bekliyor.</p>'
              + notificationHTML
              + '<p>Detay bağlantılarına tıklayarak ayrıntıları görebilirsiniz.</p>'
              + '<p>Saygılarımızla,<br/>Mitolojix</p>'
              + '</body></html>'
            });
          }

        }
      });
    }
  });

}
