import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { M } from 'meteor/m:lib-core';

Meteor.publishComposite(null, function() {
  return {
    find() {
      if (this.userId) {
        if (M.L.userHasRole(this.userId, 'ogrenci')) {
          const {
            kurum,
            sinif,
          } = M.C.Users.findOne({_id: this.userId});;
          return M.C.SinavKagitlari.find({
            iptal: false,
            ogrenci: this.userId,
            kurum,
            sinif,
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
        find(sinavKagidi) {
          return M.C.Sinavlar.find({_id: sinavKagidi.sinav});
        }
      }
    ]
  }
});

Meteor.publishComposite('sinavKagidi', function(sinavKagidiId) {
  check(sinavKagidiId, String);
  return {
    find() {
      if (this.userId) {
        if (M.L.userHasRole(this.userId, 'ogrenci')) {
          const {
            kurum,
            sinif,
          } = M.C.Users.findOne({_id: this.userId});
          const sinavKagidi = M.C.SinavKagitlari.findOne({_id: sinavKagidiId, iptal: false, ogrenciSinavaGirdi: true});
          if (sinavKagidi) {
            let fields = {
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
              kurum,
              sinif,
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
        find(sinavKagidi) {
          return M.C.Sinavlar.find({_id: sinavKagidi.sinav});
        }
      }
    ]
  }
});
