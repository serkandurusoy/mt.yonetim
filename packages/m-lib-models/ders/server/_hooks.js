import { M } from 'meteor/m:lib-core';

M.C.Dersler.after.insert(function(userId,doc) {
  if (!userId) {
    userId = M.C.Users.findOne({'emails.address': 'admin@mitolojix.com'})._id;
  }
  const{
    _id = doc._id,
  } = this;

  const story = {
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
  const {
    _id = doc._id,
  } = this;

  const story = {
    kurum: 'mitolojix',
    collection: 'Dersler',
    doc: _id,
    operation: 'update',
    createdBy: userId
  };

  const {
    previous: {
      muhurGrubu: {
        isim: onceMuhurGrup,
      }
    }
  }= this;

  const {
    muhurGrubu: {
      isim: yeniMuhurGrup,
    }
  }= doc;

  if (onceMuhurGrup !== yeniMuhurGrup) {
    story.operation = 'special';
    story.specialOperation = 'Dersin mühür grup ismi değişti';
    story.specialNote = 'Derse ait mühür grubunun isminde değişiklik yapıldı.'
  }

  M.C.Stories.insert(story);

});
