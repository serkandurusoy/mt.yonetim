import { Meteor } from 'meteor/meteor';

import { SyncedCron } from 'meteor/percolate:synced-cron';

import { M } from 'meteor/m:lib-core';

if (Meteor.settings.public.APP === 'YONETIM') {
  SyncedCron.add({
    name: '1 aydan eski storiesi sil',
    schedule(parser) {
      return parser.recur().on(1).hour();
    },
    job() {
      Meteor.call('clearOldStories');
    }
  });

  Meteor.methods({
    'clearOldStories'() {
      this.unblock();
      M.C.Stories.remove({
        createdAt: {$lt: new Date(new Date().getTime() - 31 * 24 * 60 * 60 * 1000)}
      });
    }
  });
}
