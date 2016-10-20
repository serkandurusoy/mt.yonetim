M.C.Comments.after.insert((userId, document) => {
  // TODO: there is some duplication of this code in sinav/server/cron.js
  let collaborators = [];

  // Tum commentlerin commentorlarini al
  const {
    collection,
    doc,
  } = document;
  M.C.Comments.find({
    collection,
    doc,
  }).forEach(comment => {
    collaborators = _.union(collaborators, [comment.createdBy]);
  });

  const item = M.C[collection].findOne({
    _id: doc,
  });

  // Itemin olusturan ve son guncelleyenini al
  collaborators = _.union(collaborators, [item.createdBy]);
  collaborators = !!item.updatedBy ? _.union(collaborators, [item.updatedBy]) : collaborators;

  // Itemin varsa versiyonlarinin olusturan ve son guncelleyenlerini al
  if (item._version > 1) {
    item.versions().forEach(item => {
      collaborators = _.union(collaborators, [item.createdBy]);
      collaborators = !!item.updatedBy ? _.union(collaborators, [item.updatedBy]) : collaborators;
    })
  }

  const user = M.C.Users.findOne({_id: document.createdBy});
  const ders = item.ders || item.alan.ders;

  // Item ile ayni kurum ve dersteki ogretmenleri al
  M.C.Users.find({
    aktif: true,
    kurum: item.kurum,
    role: 'ogretmen',
    dersleri: ders
  }).forEach(user => {
    collaborators = _.union(collaborators, [user._id]);
  });

  // Eger islemi yapan ogretmen degilse, kendiyle ayni kurum ve roldeki kisileri al
  if (user.role !== 'ogretmen' && user.role !== 'ogrenci') {
    M.C.Users.find({
      aktif: true,
      kurum: user.kurum,
      role: user.role
    }).forEach(user => {
      collaborators = _.union(collaborators, [user._id]);
    });
  }

  // collaboratorlarin unique oldugundan emin olalim, aslinda _.union oyle yapiyor ama olsun
  collaborators = _.uniq(collaborators);

  // collaboratorlar arasindan kendini cikart
  collaborators = _.compact(_.without(collaborators, document.createdBy));

  collaborators.forEach(to => {
    // bu kisi bu item icin notification aldiysa count 1 arttir
    const updated = M.C.Notifications.update({
      collection,
      doc,
      to,
    },{
      $inc: {count: 1}
    });
    // safeguard against nonexistent user id information
    const userId = M.C.Users.findOne({_id: to});
    if (userId) {
      // bu kisi bu item icin notification almadiyse yeni olustur
      if (!updated) {
        M.C.Notifications.insert({
          collection,
          doc,
          to,
        })
      }
    }
  });

});
