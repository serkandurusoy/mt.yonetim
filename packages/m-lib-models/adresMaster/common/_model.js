import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { M } from 'meteor/m:lib-core';

M.C.Iller = new Mongo.Collection('iller');
M.C.Ilceler = new Mongo.Collection('ilceler');

if (Meteor.isServer) {
  Meteor.startup(() => {
    M.C.Iller.rawCollection().createIndex({il: 1});
    M.C.Iller.rawCollection().createIndex({ilCollate: 1});
    M.C.Ilceler.rawCollection().createIndex({il: 1});
    M.C.Ilceler.rawCollection().createIndex({ilCollate: 1});
    M.C.Ilceler.rawCollection().createIndex({ilce: 1});
    M.C.Ilceler.rawCollection().createIndex({ilceCollate: 1});
  });
}
