import { Meteor } from 'meteor/meteor';

import { M } from 'meteor/m:lib-core';

Meteor.publishComposite(null, function() {
  return {
    find() {
      if (this.userId) {
        return M.C.Karakterler.find();
      }
    },
    children: M.C.AuditLog
  };
});
