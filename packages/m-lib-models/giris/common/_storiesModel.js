import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { M } from 'meteor/m:lib-core';

M.C.Stories = new Mongo.Collection('stories');

M.C.Stories.Schema = new SimpleSchema({
  kurum: {
    type: String,
    index: 1,
    custom() {
      const kurum = this;
      if (kurum.isSet) {
        if (kurum.value === 'mitolojix') {
          return true;
        }
        const hit = M.C.Kurumlar.findOne({_id: kurum.value});
        return hit ? true : 'notAllowed';
      }
    }
  },
  collection: {
    type: String,
    index: 1,
    allowedValues: ['Users','Sinavlar','Sorular','Kurumlar','Karakterler','Dersler','Mufredat','Muhurler','YardimDokumanlari']
  },
  doc: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    custom() {
      const collection = this.field('collection');
      const item = this;
      if (collection.isSet && item.isSet) {
        const hit = M.C[collection.value].findOne({_id: item.value});
        return hit ? true : 'notAllowed';
      }
    }
  },
  ders: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    allowedValues() {
      return M.C.Dersler.find({},{fields: {_id: 1}}).map(ders => ders._id);
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
    autoValue() {
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