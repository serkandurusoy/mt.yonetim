Meteor.publishComposite(null, function() {
  return {
    find: function() {
      if (this.userId) {
        if (M.L.userHasRole(this.userId, 'ogrenci')) {
          var user = M.C.Users.findOne({_id: this.userId});
          return M.C.SinavKagitlari.find({
            iptal: false,
            ogrenci: this.userId,
            kurum: user.kurum,
            sinif: user.sinif,
            egitimYili: M.C.AktifEgitimYili.findOne().egitimYili
          }, {
            fields: {
              yanitlar: 0
            }
          });
        }
      }
    },
    children: [
      {
        find: function(sinavKagidi) {
          return M.C.Sinavlar.find({_id: sinavKagidi.sinav});
        }
      }
    ]
  }
});

Meteor.publishComposite('sinavKagidi', function(sinavKagidiId) {
  check(sinavKagidiId, String);
  return {
    find: function() {
      if (this.userId) {
        if (M.L.userHasRole(this.userId, 'ogrenci')) {
          var user = M.C.Users.findOne({_id: this.userId});
          var sinavKagidi = M.C.SinavKagitlari.findOne({_id: sinavKagidiId, iptal: false, ogrenciSinavaGirdi: true});
          if (sinavKagidi) {
            var fields = {
              'yanitlar.dogru': 0
            };

            if (sinavKagidi.tip === 'alistirma') {
              fields = {
                none: 0
              }
            }

            return M.C.SinavKagitlari.find({
              _id: sinavKagidiId,
              iptal: false,
              ogrenci: this.userId,
              kurum: user.kurum,
              sinif: user.sinif,
              egitimYili: M.C.AktifEgitimYili.findOne().egitimYili
            }, {
              fields: fields
            });
          }
        }
      }
    },
    children: [
      {
        find: function(sinavKagidi) {
          return M.C.Sinavlar.find({_id: sinavKagidi.sinav});
        }
      }
    ]
  }
});
