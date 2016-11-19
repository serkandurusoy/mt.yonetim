import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { M } from 'meteor/m:lib-core'

Meteor.publishComposite('sorular', function() {
  return {
    find() {
      if (this.userId && !M.L.userHasRole(this.userId, 'ogrenci')) {
        if (M.L.userHasRole(this.userId, 'mitolojix')) {
          return M.C.Sorular.find();
        } else {
          const userKurum = M.C.Users.findOne({_id: this.userId}).kurum;
          let selector = {kurum: userKurum};
          if (M.L.userHasRole(this.userId, 'ogretmen')) {
            selector['alan.ders'] = {
              $in: M.C.Users.findOne({_id: this.userId}).dersleri
            };
          }
          return M.C.Sorular.find(selector);
        }
      }
    }
  };
});

Meteor.publishComposite('soru', function(soruId) {
  check(soruId, String);
  return {
    find() {
      if (this.userId && !M.L.userHasRole(this.userId, 'ogrenci')) {
        if (M.L.userHasRole(this.userId, 'mitolojix')) {
          return M.C.Sorular.find({_id: soruId});
        } else {
          const userKurum = M.C.Users.findOne({_id: this.userId}).kurum;
          return M.C.Sorular.find({_id: soruId, kurum: userKurum});
        }
      }
    },
    children: soruAuditLog
  }
});

const userCursor = userId => {
  return M.C.Users.find({_id: userId}, {fields: {cinsiyet: 1, status: 1, avatar: 1, kurum: 1, role: 1, name: 1, lastName: 1}})
};

const soruAuditLog = [
  {
    find(doc) {
      if (!M.L.userHasRole(this.userId, 'ogrenci')) {
        return M.C.Comments.find({ collection: 'Sorular', doc: doc._id });
      }
    },
    children: [
      {
        find(comment) {
          return userCursor(comment.createdBy);
        }
      }
    ]
  },
  {
    find(doc) {
      if (!M.L.userHasRole(this.userId, 'ogrenci')) {
        return M.C.Sinavlar.find({'sorular.soruId': doc._id});
      }
    }
  },
  {
    find(doc) {
      if (!M.L.userHasRole(this.userId, 'ogrenci')) {
        return userCursor(doc.createdBy);
      }
    }
  },
  {
    find(doc) {
      if (!M.L.userHasRole(this.userId, 'ogrenci')) {
        return userCursor(doc.updatedBy);
      }
    }
  },
  {
    find(doc) {
      if (!M.L.userHasRole(this.userId, 'ogrenci')) {
        return doc.versions();
      }
    },
    children: [
      {
        find(version) {
          return userCursor(version.createdBy);
        }
      },
      {
        find(version) {
          return userCursor(version.updatedBy);
        }
      }
    ]
  }
];
