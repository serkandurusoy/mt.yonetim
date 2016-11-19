import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { M } from 'meteor/m:lib-core';

Meteor.publishComposite('mufredatlar', function() {
  return {
    find() {
      if (this.userId) {
        if (M.L.userHasRole(this.userId, 'mitolojix')) {
          return M.C.Mufredat.find();
        } else {
          let kurumlar = [M.C.Users.findOne({_id: this.userId}).kurum];
          if (M.L.userHasRole(this.userId, 'teknik')) {
            kurumlar.push('mitolojix');
          }
          let selector = {kurum: {$in: kurumlar}};
          if (M.L.userHasRole(this.userId, 'ogretmen')) {
            selector.ders = {
              $in: M.C.Users.findOne({_id: this.userId}).dersleri
            };
          }
          return M.C.Mufredat.find(selector);
        }
      }
    }
  };
});

Meteor.publishComposite('mufredat', function(mufredatId) {
  check(mufredatId, String);
  return {
    find() {
      if (this.userId) {
        if (M.L.userHasRole(this.userId, 'mitolojix')) {
          return M.C.Mufredat.find({_id: mufredatId});
        } else {
          let kurumlar = [M.C.Users.findOne({_id: this.userId}).kurum];
          if (!M.L.userHasRole(this.userId, 'ogrenci')) {
            kurumlar.push('mitolojix');
          }
          return M.C.Mufredat.find({_id: mufredatId, kurum: {$in: kurumlar}});
        }
      }
    },
    children: M.C.AuditLog
  }
});
