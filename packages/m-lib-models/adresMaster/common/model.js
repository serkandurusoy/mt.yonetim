M.C.Iller = new Mongo.Collection('iller');
M.C.Ilceler = new Mongo.Collection('ilceler');

if (Meteor.isServer) {
  Meteor.startup(() => {
    M.C.Iller._ensureIndex({il: 1});
    M.C.Iller._ensureIndex({ilCollate: 1});
    M.C.Ilceler._ensureIndex({il: 1});
    M.C.Ilceler._ensureIndex({ilCollate: 1});
    M.C.Ilceler._ensureIndex({ilce: 1});
    M.C.Ilceler._ensureIndex({ilceCollate: 1});
  });
}
