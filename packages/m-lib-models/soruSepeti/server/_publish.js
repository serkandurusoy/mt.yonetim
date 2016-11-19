import { Meteor } from 'meteor/meteor';

import { M } from 'meteor/m:lib-core';

Meteor.publishComposite(null, function() {
  return {
    find() {
      if (this.userId && !M.L.userHasRole(this.userId, 'ogrenci')) {
        return M.C.SoruSepetleri.find({createdBy: this.userId});
      }
    },
    children: [
      {
        find(sepet) {
          return M.C.Sorular.find({_id: sepet.soru})
        }
      }
    ]
  };
});
