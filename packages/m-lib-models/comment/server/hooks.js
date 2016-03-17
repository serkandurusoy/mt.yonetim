M.C.Comments.after.insert(function (userId, doc) {
  // TODO: there is some duplication of this code in sinav/server/cron.js
  var collaborators = [];

  // Tum commentlerin commentorlarini al
  M.C.Comments.find({
    collection: doc.collection,
    doc: doc.doc
  }).forEach(function(comment) {
    collaborators = _.union(collaborators, [comment.createdBy]);
  });

  var item = M.C[doc.collection].findOne({
    _id: doc.doc
  });

  // Itemin olusturan ve son guncelleyenini al
  collaborators = _.union(collaborators, [item.createdBy]);
  collaborators = !!item.updatedBy ? _.union(collaborators, [item.updatedBy]) : collaborators;

  // Itemin varsa versiyonlarinin olusturan ve son guncelleyenlerini al
  if (item._version > 1) {
    item.versions().forEach(function(item) {
      collaborators = _.union(collaborators, [item.createdBy]);
      collaborators = !!item.updatedBy ? _.union(collaborators, [item.updatedBy]) : collaborators;
    })
  }

  var user = M.C.Users.findOne({_id: doc.createdBy});
  var ders = item.ders || item.alan.ders;

  // Item ile ayni kurum ve dersteki ogretmenleri al
  M.C.Users.find({
    aktif: true,
    kurum: item.kurum,
    role: 'ogretmen',
    dersleri: ders
  }).forEach(function(user) {
    collaborators = _.union(collaborators, [user._id]);
  });

  // Eger islemi yapan ogretmen degilse, kendiyle ayni kurum ve roldeki kisileri al
  if (user.role !== 'ogretmen' && user.role !== 'ogrenci') {
    M.C.Users.find({
      aktif: true,
      kurum: user.kurum,
      role: user.role
    }).forEach(function(user) {
      collaborators = _.union(collaborators, [user._id]);
    });
  }

  // collaboratorlarin unique oldugundan emin olalim, aslinda _.union oyle yapiyor ama olsun
  collaborators = _.uniq(collaborators);

  // collaboratorlar arasindan kendini cikart
  collaborators = _.compact(_.without(collaborators, doc.createdBy));

  _.each(collaborators, function(to) {
    // bu kisi bu item icin notification aldiysa count 1 arttir
    var updated = M.C.Notifications.update({
      collection: doc.collection,
      doc: doc.doc,
      to: to
    },{
      $inc: {count: 1}
    });
    // safeguard against nonexistent user id information
    var userId = M.C.Users.findOne({_id: to});
    if (userId) {
      // bu kisi bu item icin notification almadiyse yeni olustur
      if (!updated) {
        M.C.Notifications.insert({
          collection: doc.collection,
          doc: doc.doc,
          to: to
        })
      }
    }
  });

});
