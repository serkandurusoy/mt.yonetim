M.C.Comments = new Mongo.Collection('comments');

M.C.Comments.Schema = new SimpleSchema({
  collection: {
    type: String,
    index: 1,
    allowedValues: ['Sinavlar','Sorular'],
    autoform: {
      type: 'hidden'
    }
  },
  doc: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    index: 1,
    custom: function() {
      var collection = this.field('collection');
      var item = this;
      if (collection.isSet && item.isSet) {
        var hit = M.C[collection.value].findOne({_id: item.value});
        return hit ? true : 'notAllowed';
      }
    },
    autoform: {
      type: 'hidden'
    }
  },
  body: {
    label: 'Yorum',
    type: String,
    max: 2000,
    autoValue: function() {
      if (this.isSet) {
        var value = this.value;
        return M.L.TrimButKeepParagraphs(value);
      } else {
        this.unset();
      }
    },
    autoform: {
      type: 'textarea',
      length: 2000
    }
  }
});

M.C.Comments.attachSchema(M.C.Comments.Schema);

M.C.Comments.attachBehaviour('timestampable',{updatedAt: false, updatedBy: false});

if (Meteor.isServer) {
  M.C.Comments.permit('insert').ifLoggedIn().userHasRole('mitolojix').apply();
  M.C.Comments.permit('insert').ifLoggedIn().userHasRole('teknik').apply();
  M.C.Comments.permit('insert').ifLoggedIn().userHasRole('ogretmen').apply();
  M.C.Comments.permit('update').never().apply();
  M.C.Comments.permit('remove').never().apply();
}
