M.C.Karakterler.after.insert(function(userId,doc) {
  if (!userId) {
    userId = M.C.Users.findOne({'emails.address': 'admin@mitolojix.com'})._id;
  }

  var _id = this._id ? this._id : doc._id;

  var story = {
    kurum: 'mitolojix',
    collection: 'Karakterler',
    doc: _id,
    operation: 'insert',
    createdBy: userId
  };

  M.C.Stories.insert(story);

});

M.C.Karakterler.after.update(function(userId, doc, fieldNames, modifier, options) {
  if (!userId) {
    userId = M.C.Users.findOne({'emails.address': 'admin@mitolojix.com'})._id;
  }
  var _id = this._id ? this._id : doc._id;

  var story = {
    kurum: 'mitolojix',
    collection: 'Karakterler',
    doc: _id,
    operation: 'update',
    createdBy: userId
  };

  M.C.Stories.insert(story);

});
