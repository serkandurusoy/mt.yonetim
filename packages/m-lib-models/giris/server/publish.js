Meteor.publish(null, function() {
  if (this.userId && !M.L.userHasRole(this.userId, 'ogrenci')) {
    if (M.L.userHasRole(this.userId, 'mitolojix')) {
      Counts.publish(this, 'kurum', M.C.Kurumlar.find());
      Counts.publish(this, 'kullanici', M.C.Users.find());
      Counts.publish(this, 'sinav', M.C.Sinavlar.find());
      Counts.publish(this, 'soru', M.C.Sorular.find());
      Counts.publish(this, 'story', M.C.Stories.find());
    } else {
      const userKurum = M.C.Users.findOne({_id: this.userId}).kurum;
      Counts.publish(this, 'ogretmen', M.C.Users.find({kurum: userKurum, role: 'ogretmen'}));
      Counts.publish(this, 'ogrenci', M.C.Users.find({kurum: userKurum, role: 'ogrenci'}));
      Counts.publish(this, 'sinav', M.C.Sinavlar.find({kurum: userKurum}));
      Counts.publish(this, 'soru', M.C.Sorular.find({kurum: userKurum}));
      Counts.publish(this, 'story', M.C.Stories.find({
        // TODO: this is not correct, counts change depending on user
        kurum: userKurum
      }));
    }
  }
});

Meteor.publishComposite('stories', function(limit) {
  check(limit, Match.Optional(Match.Integer));
  if (limit < 10) {
    limit = 10;
  }
  return {
    find() {
      if (this.userId && !M.L.userHasRole(this.userId, 'ogrenci')) {
        if (M.L.userHasRole(this.userId, 'mitolojix')) {
          return M.C.Stories.find({}, {
            sort: {createdAt: -1},
            limit: limit
          });
        } else {
          const userKurum = M.C.Users.findOne({_id: this.userId}).kurum;
          if (!M.L.userHasRole(this.userId, 'ogretmen')) {
            return M.C.Stories.find({
              kurum: userKurum
            },{
              sort: {createdAt: -1},
              limit: limit
            });
          } else {
            const dersler = M.C.Users.findOne({_id: this.userId}).dersleri;
            return M.C.Stories.find({
              $or: [
                {
                  kurum: userKurum,
                  collection: {$in: ['Users','Dersler','Mufredat','Muhurler','YardimDokumanlari']}
                },
                {
                  kurum: userKurum,
                  collection: {$in: ['Sinavlar','Sorular']},
                  ders: {$in: dersler}
                }
              ]
            },{
              sort: {createdAt: -1},
              limit: limit
            });
          }
        }
      }
    },
    children: [
      {
        find(story) {
          return M.C.Users.find({_id: story.createdBy}, {fields: {kurum: 1, name: 1, lastName: 1}});
        }
      }
    ]
  };
});

