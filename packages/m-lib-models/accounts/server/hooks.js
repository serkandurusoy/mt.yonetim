M.C.Users.after.insert(function(userId,doc) {
  if (!userId) {
    userId = M.C.Users.findOne({'emails.address': 'admin@mitolojix.com'})._id;
  }

  var _id = this._id ? this._id : doc._id;

  var story = {
    kurum: doc.kurum,
    collection: 'Users',
    doc: _id,
    operation: 'insert',
    createdBy: userId
  };

  M.C.Stories.insert(story);

});

M.C.Users.after.update(function(userId, doc, fieldNames, modifier, options) {
  if (!userId) {
    userId = M.C.Users.findOne({'emails.address': 'admin@mitolojix.com'})._id;
  }
  var _id = this._id ? this._id : doc._id;

  if (this.previous.emails[0].address !== doc.emails[0].address ||
    this.previous.cinsiyet !== doc.cinsiyet ||
    this.previous.role !== doc.role ||
    this.previous.kurum !== doc.kurum) {

    var story = {
      kurum: doc.kurum,
      collection: 'Users',
      doc: _id,
      operation: 'update',
      createdBy: userId
    };

    if (this.previous.role !== doc.role) {
      story.operation = 'special';
      story.specialOperation = 'Kullanıcının rolü değişti';
      story.specialNote = 'Kullanıcının rolü ' + M.L.enumLabel(this.previous.role) + ' iken ' + M.L.enumLabel(doc.role) + ' olarak değişti.';
    }

    if (this.previous.kurum !== doc.kurum) {
      story.operation = 'special';
      story.specialOperation = 'Kullanıcının kurumu değişti';
      story.specialNote = 'Kullanıcının kurumu ' + (M.C.Kurumlar.findOne({_id: this.previous.kurum}) ? M.C.Kurumlar.findOne({_id: this.previous.kurum}).isim : 'Mitolojix') + ' iken ' + (M.C.Kurumlar.findOne({_id: doc.kurum}) ? M.C.Kurumlar.findOne({_id: doc.kurum}).isim : 'Mitolojix') + ' olarak değişti.';
    }

    M.C.Stories.insert(story);

  }
});
