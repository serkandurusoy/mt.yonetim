M.C.Muhurler.after.insert(function(userId,doc) {
  if (!userId) {
    userId = M.C.Users.findOne({'emails.address': 'admin@mitolojix.com'})._id;
  }

  var _id = this._id ? this._id : doc._id;

  var story = {
    kurum: 'mitolojix',
    collection: 'Muhurler',
    doc: _id,
    operation: 'insert',
    createdBy: userId
  };

  M.C.Stories.insert(story);

});

M.C.Muhurler.after.update(function(userId, doc, fieldNames, modifier, options) {
  if (!userId) {
    userId = M.C.Users.findOne({'emails.address': 'admin@mitolojix.com'})._id;
  }
  var _id = this._id ? this._id : doc._id;

  var story = {
    kurum: 'mitolojix',
    collection: 'Muhurler',
    doc: _id,
    operation: 'update',
    createdBy: userId
  };

  M.C.Stories.insert(story);

});
