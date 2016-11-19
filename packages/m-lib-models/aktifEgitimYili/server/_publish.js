import { Meteor } from 'meteor/meteor';

import { M } from 'meteor/m:lib-core';

Meteor.publishComposite(null, () => {
  return {
    find() {
      if (this.userId) {
        return M.C.AktifEgitimYili.find();
      }
    },
    children: M.C.AuditLog
  };
});
