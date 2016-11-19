import { M } from 'meteor/m:lib-core';

M.C.YardimDokumanlari.after.insert(function(userId,doc) {
  if (!userId) {
    userId = M.C.Users.findOne({'emails.address': 'admin@mitolojix.com'})._id;
  }
  const {
    _id = doc._id,
  } = this;

  const story = {
    kurum: 'mitolojix',
    collection: 'YardimDokumanlari',
    doc: _id,
    operation: 'insert',
    createdBy: userId
  };

  M.C.Stories.insert(story);

});

M.C.YardimDokumanlari.after.update(function(userId, doc, fieldNames, modifier, options) {
  if (!userId) {
    userId = M.C.Users.findOne({'emails.address': 'admin@mitolojix.com'})._id;
  }

  const {
    _id = doc._id,
  } = this;

  const story = {
    kurum: 'mitolojix',
    collection: 'YardimDokumanlari',
    doc: _id,
    operation: 'update',
    createdBy: userId
  };

  M.C.Stories.insert(story);

});
