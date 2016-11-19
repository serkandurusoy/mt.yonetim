import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { M } from 'meteor/m:lib-core';

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
    custom() {
      const collection = this.field('collection');
      const item = this;
      if (collection.isSet && item.isSet) {
        const hit = M.C[collection.value].findOne({_id: item.value});
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
    autoValue() {
      if (this.isSet) {
        return M.L.TrimButKeepParagraphs(this.value);
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
  M.C.Comments.permit('insert').ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
  M.C.Comments.permit('insert').ifLoggedIn().userHasRole('teknik').allowInClientCode();
  M.C.Comments.permit('insert').ifLoggedIn().userHasRole('ogretmen').allowInClientCode();
  M.C.Comments.permit('update').never().allowInClientCode();
  M.C.Comments.permit('remove').never().allowInClientCode();
}
