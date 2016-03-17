if (Meteor.settings.public.APP === 'BACKEND') {
  SyncedCron.add({
    name: '1 aydan eski storiesi sil',
    schedule: function(parser) {
      return parser.recur().on(1).hour();
    },
    job: function() {
      Meteor.call('clearOldStories');
    }
  });

  Meteor.methods({
    'clearOldStories': function() {
      this.unblock();
      M.C.Stories.remove({
        createdAt: {$lt: new Date(new Date().getTime() - 31 * 24 * 60 * 60 * 1000)}
      });
    }
  });
}
