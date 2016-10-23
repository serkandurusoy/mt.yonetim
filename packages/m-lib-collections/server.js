const userCursor = userId => {
  return M.C.Users.find({_id: userId}, {fields: {name: 1, lastName: 1}})
};

M.C.AuditLog = [
  {
    find(doc) {
      return userCursor(doc.createdBy);
    }
  },
  {
    find(doc) {
      return userCursor(doc.updatedBy);
    }
  },
  {
    find(doc) {
      return doc.versions();
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
