const userCursor = userId => {
  return M.C.Users.find({_id: userId}, {fields: {name: 1, lastName: 1}})
};

const userAuditLog = [
  {
    find(user) {
      return M.C.Kurumlar.find({_id: user.kurum});
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
        return userCursor(doc.crudBy);
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
          return userCursor(version.crudBy);
        }
      }
    ]
  }
];

Meteor.publishComposite(null, function() {
  return {
    find() {
      if (this.userId) {
        return M.C.Users.find({_id: this.userId}, {
          fields: {
            emails: 1,
            tcKimlik: 1,
            name: 1,
            lastName: 1,
            cinsiyet: 1,
            dogumTarihi: 1,
            avatar: 1,
            karakter: 1,
            role: 1,
            dersleri: 1,
            sinif: 1,
            sube: 1,
            puan: 1,
            kurum: 1,
            aktif: 1,
            status: 1,
            createdAt: 1,
            createdBy: 1,
            modifiedAt: 1,
            crudBy: 1,
            _version: 1
          }
        });
      }
    },
    children: userAuditLog
  };
});

Meteor.publishComposite('kullaniciById', function(userId) {
  check(userId, String);
  return {
    find() {
      if (this.userId && !M.L.userHasRole(this.userId, 'ogrenci')) {
        const fields = {
          emails: 1,
          tcKimlik: 1,
          name: 1,
          lastName: 1,
          cinsiyet: 1,
          dogumTarihi: 1,
          avatar: 1,
          karakter: 1,
          role: 1,
          dersleri: 1,
          sinif: 1,
          sube: 1,
          puan: 1,
          kurum: 1,
          aktif: 1,
          status: 1,
          createdAt: 1,
          createdBy: 1,
          modifiedAt: 1,
          crudBy: 1,
          _version: 1
        };
        if (M.L.userHasRole(this.userId, 'mitolojix')) {
          return M.C.Users.find({_id: userId}, {
            fields: fields
          });
        } else {
          const userKurum = M.C.Users.findOne({_id: this.userId}).kurum;
          return M.C.Users.find({_id: userId, kurum: userKurum}, {
            fields: fields
          });
        }
      }
    },
    children: _.union(userAuditLog, [{
        find(user) {
          return M.C.UserConnectionLog.find({userId: user._id}, {sort: {createdAt: -1}, limit: 1});
        }
      }]
    )
  };
});

Meteor.publishComposite('kullanicilar', function() {
  return {
    find() {
      if (this.userId && !M.L.userHasRole(this.userId, 'ogrenci')) {
        const fields = {
          emails: 1,
          tcKimlik: 1,
          name: 1,
          nameCollate:1,
          lastNameCollate:1,
          lastName: 1,
          cinsiyet: 1,
          dogumTarihi: 1,
          avatar: 1,
          karakter: 1,
          role: 1,
          dersleri: 1,
          sinif: 1,
          sube: 1,
          puan: 1,
          kurum: 1,
          aktif: 1,
          status: 1,
          createdAt: 1,
          createdBy: 1,
          modifiedAt: 1,
          crudBy: 1,
          _version: 1
        };
        if (M.L.userHasRole(this.userId, 'mitolojix')) {
          return M.C.Users.find({}, {
            fields: fields
          });
        } else {
          const userKurum = M.C.Users.findOne({_id: this.userId}).kurum;
          return M.C.Users.find({kurum: userKurum}, {
            fields: fields
          });
        }
      }
    },
    children: [
      {
        find(user) {
          return M.C.Kurumlar.find({_id: user.kurum});
        }
      },
      {
        find(user) {
          return M.C.UserConnectionLog.find({userId: user._id}, {sort: {createdAt: -1}, limit: 1});
        }
      }
    ]
  };
});

Meteor.publishComposite('sinifArkadaslarim', function() {
  return {
    find() {
      if (this.userId && M.L.userHasRole(this.userId, 'ogrenci')) {
        const user = M.C.Users.findOne({_id: this.userId});
        return M.C.Users.find({
          aktif: true,
          kurum: user.kurum,
          role: 'ogrenci',
          sinif: user.sinif,
          puan: {$gte: 70}
        }, {
          fields: {
            name: 1,
            nameCollate: 1,
            lastName: 1,
            lastNameCollate: 1,
            cinsiyet: 1,
            dogumTarihi: 1,
            karakter: 1,
            sinif: 1,
            sube: 1,
            puan: 1,
            'searchSource.name': 1,
            'searchSource.lastName': 1
          }
        });
      }
    }
  };
});

Meteor.publishComposite('kullaniciGirisCikislari', function(userId) {
  check(userId, String);
  return {
    find() {
      if (this.userId && !M.L.userHasRole(this.userId, 'ogrenci')) {
        return M.C.UserConnectionLog.find({userId: userId});
      }
    }
  };
});
