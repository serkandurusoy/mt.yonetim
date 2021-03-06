M.C.Mufredat.after.insert(function(userId,doc) {
  if (!userId) {
    userId = M.C.Users.findOne({'emails.address': 'admin@mitolojix.com'})._id;
  }

  var _id = this._id ? this._id : doc._id;

  var story = {
    kurum: doc.kurum,
    collection: 'Mufredat',
    doc: _id,
    operation: 'insert',
    createdBy: userId
  };

  M.C.Stories.insert(story);

});

M.C.Mufredat.after.update(function(userId, doc, fieldNames, modifier, options) {
  if (this.previous.searchSource.kurum === doc.searchSource.kurum) {

    if (!userId) {
      userId = M.C.Users.findOne({'emails.address': 'admin@mitolojix.com'})._id;
    }
    var _id = this._id ? this._id : doc._id;

    var story = {
      kurum: doc.kurum,
      collection: 'Mufredat',
      doc: _id,
      operation: 'update',
      createdBy: userId
    };

    if (this.previous.egitimYili !== doc.egitimYili) {
      story.operation = 'special';
      story.specialOperation = 'Müfredat eğitim yılı değişti';
      story.specialNote = 'Müfredatın ait olduğu eğitim yılı değiştirildi.';
    }

    M.C.Stories.insert(story);

  }

});
