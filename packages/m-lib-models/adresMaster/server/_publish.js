import { Meteor } from 'meteor/meteor';

import { M } from 'meteor/m:lib-core';


Meteor.publishComposite(null, function() {
  return {
    find() {
      if (this.userId && !M.L.userHasRole(this.userId, 'ogrenci')) {
        return M.C.Iller.find();
      }
    },
    children: [
      {
        find(il) {
          if (il && il.il) {
            return M.C.Ilceler.find({il: il.il});
          }
        }
      }
    ]
  };
});
