var userCursor = function(userId) {
  return M.C.Users.find({_id: userId}, {fields: {name: 1, lastName: 1}})
};

M.C.AuditLog = [
  {
    find: function (doc) {
      return userCursor(doc.createdBy);
    }
  },
  {
    find: function (doc) {
      return userCursor(doc.updatedBy);
    }
  },
  {
    find: function(doc) {
      return doc.versions();
    },
    children: [
      {
        find: function (version) {
          return userCursor(version.createdBy);
        }
      },
      {
        find: function (version) {
          return userCursor(version.updatedBy);
        }
      }
    ]
  }
];
