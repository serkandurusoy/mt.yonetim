M.C.Stories = new Mongo.Collection('stories');

M.C.Stories.Schema = new SimpleSchema({
  kurum: {
    type: String,
    index: 1,
    custom: function() {
      var kurum = this;
      if (kurum.isSet) {
        if (kurum.value === 'mitolojix') {
          return true;
        }
        var hit = M.C.Kurumlar.findOne({_id: kurum.value});
        return hit ? true : 'notAllowed';
      }
    }
  },
  collection: {
    type: String,
    index: 1,
    allowedValues: ['Users','Sinavlar','Sorular','Kurumlar','Karakterler','Dersler','Mufredat','Muhurler']
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
  ders: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    allowedValues: function() {
      return M.C.Dersler.find({},{fields: {_id: 1}}).map(function(ders) {return ders._id;});
    }
  },
  operation: {
    type: String,
    allowedValues: ['insert','update','special']
  },
  specialOperation: {
    type: String,
    min: 1,
    optional: true
  },
  specialNote: {
    type: String,
    min: 1,
    optional: true
  },
  createdBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  createdAt: {
    type: Date,
    index: -1,
    autoValue: function() {
      return new Date();
    }
  }
});

M.C.Stories.attachSchema(M.C.Stories.Schema);

if (Meteor.isServer) {
  // All operations are done on the server within collection hooks and crons
  M.C.Stories.permit('insert').never().allowInClientCode();
  M.C.Stories.permit('update').never().allowInClientCode();
  M.C.Stories.permit('remove').never().allowInClientCode();
}
