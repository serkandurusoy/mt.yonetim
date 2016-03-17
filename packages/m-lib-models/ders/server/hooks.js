M.C.Dersler.after.insert(function(userId,doc) {
  if (!userId) {
    userId = M.C.Users.findOne({'emails.address': 'admin@mitolojix.com'})._id;
  }

  var _id = this._id ? this._id : doc._id;

  var story = {
    kurum: 'mitolojix',
    collection: 'Dersler',
    doc: _id,
    operation: 'insert',
    createdBy: userId
  };

  M.C.Stories.insert(story);

});

M.C.Dersler.after.update(function(userId, doc, fieldNames, modifier, options) {
  if (!userId) {
    userId = M.C.Users.findOne({'emails.address': 'admin@mitolojix.com'})._id;
  }
  var _id = this._id ? this._id : doc._id;

  var story = {
    kurum: 'mitolojix',
    collection: 'Dersler',
    doc: _id,
    operation: 'update',
    createdBy: userId
  };

  var onceMuhurGrup = this.previous.muhurGrubu.isim;
  var yeniMuhurGrup = doc.muhurGrubu.isim;

  if (onceMuhurGrup !== yeniMuhurGrup) {
    story.operation = 'special';
    story.specialOperation = 'Dersin mühür grup ismi değişti';
    story.specialNote = 'Derse ait mühür grubunun isminde değişiklik yapıldı.'
  }

  M.C.Stories.insert(story);

});
