import { Meteor } from 'meteor/meteor';

import { M } from 'meteor/m:lib-core';

Meteor.publishComposite(null,() => {
  return {
    find() {
      if (this.userId && !M.L.userHasRole(this.userId, 'ogrenci')) {
        return M.C.Notifications.find({to: this.userId});
      }
    }
  };
});
