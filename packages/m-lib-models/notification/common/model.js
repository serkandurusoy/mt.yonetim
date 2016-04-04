M.C.Notifications = new Mongo.Collection('notifications');

M.C.Notifications.Schema = new SimpleSchema({
  collection: {
    type: String,
    index: 1,
    allowedValues: ['Sinavlar','Sorular']
  },
  doc: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    custom: function() {
      var collection = this.field('collection');
      var item = this;
      if (collection.isSet && item.isSet) {
        var hit = M.C[collection.value].findOne({_id: item.value});
        return hit ? true : 'notAllowed';
      }
    }
  },
  kod: {
    type: String,
    min: 8,
    max: 8,
    autoValue: function() {
      var collection = this.field('collection');
      var doc = this.field('doc');
      if (collection.isSet && doc.isSet) {
        var item = M.C[collection.value].findOne({_id: doc.value});
        return item && item.kod;
      } else {
        this.unset();
      }
    }
  },
  at: {
    type: Date,
    index: -1,
    autoValue: function() {
      return new Date();
    }
  },
  to: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    index: 1
  },
  count: {
    type: Number,
    min: 1,
    defaultValue: 1
  }
});

M.C.Notifications.attachSchema(M.C.Notifications.Schema);

if (Meteor.isServer) {
  // All inserts are done on the server within collection hooks, client can remove own document
  M.C.Notifications.permit('insert').never().allowInClientCode();
  M.C.Notifications.permit('update').never().allowInClientCode();

  Security.defineMethod('notificationOwner', {
    //fetch: [],
    //transform: null,
    allow: function (type, role, userId, doc, fields, modifier) {
      return doc.to === userId;
    }
  });

  M.C.Notifications.permit('remove').notificationOwner().allowInClientCode();
}
