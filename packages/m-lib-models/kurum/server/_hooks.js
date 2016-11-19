import { _ } from 'meteor/underscore';

import { M } from 'meteor/m:lib-core';

M.C.Kurumlar.after.insert(function(userId,doc) {
  if (!userId) {
    userId = M.C.Users.findOne({'emails.address': 'admin@mitolojix.com'})._id;
  }
  const {
    _id = doc._id,
  } = this;

  const story = {
    kurum: 'mitolojix',
    collection: 'Kurumlar',
    doc: _id,
    operation: 'insert',
    createdBy: userId
  };

  M.C.Stories.insert(story);

});

M.C.Kurumlar.after.update(function(userId, doc, fieldNames, modifier, options) {
  if (!userId) {
    userId = M.C.Users.findOne({'emails.address': 'admin@mitolojix.com'})._id;
  }
  const {
    _id = doc._id,
  } = this;

  const story = {
    kurum: 'mitolojix',
    collection: 'Kurumlar',
    doc: _id,
    operation: 'update',
    createdBy: userId
  };

  if (this.previous.isim !== doc.isim) {
    story.operation = 'special';
    story.specialOperation = 'Kurumun ismi değişti';
    story.specialNote = 'Kurumun unvanı ' + this.previous.isim + ' iken ' + doc.isim + ' olarak değişti.';
  }

  if (!_.isEqual(this.previous.adres, doc.adres)) {
    story.operation = 'special';
    story.specialOperation = 'Kurumun adresi değişti';
    story.specialNote = doc.isim + ' adresi '+ doc.adres.adres + ' ' + M.C.Ilceler.findOne({_id: doc.adres.ilce}).ilce + ', ' + M.C.Ilceler.findOne({_id: doc.adres.ilce}).il + ' olarak değiştirildi.';
  }

  M.C.Stories.insert(story);

});
