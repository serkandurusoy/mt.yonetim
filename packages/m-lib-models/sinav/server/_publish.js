import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { M } from 'meteor/m:lib-core';

Meteor.publishComposite('sinavlar', function(time) {
  check(time, Match.Optional(Date));
  let currentTime = new Date();
  if (time) {
    currentTime = time;
  }
  return {
    find(){
      if (this.userId) {
        if (M.L.userHasRole(this.userId, 'mitolojix')) {
          return M.C.Sinavlar.find();
        } else {
          const user = M.C.Users.findOne({_id: this.userId});
          if (!M.L.userHasRole(this.userId, 'ogrenci')) {
            let selector = {kurum: user.kurum};
            if (M.L.userHasRole(this.userId, 'ogretmen')) {
              selector.ders = {
                $in: M.C.Users.findOne({_id: this.userId}).dersleri
              };
            }
            return M.C.Sinavlar.find(selector);
          } else {
            return M.C.Sinavlar.find({
              kurum: user.kurum,
              taslak: false,
              aktif: true,
              iptal: false,
              muhur: {$exists: true},
              sinif: user.sinif,
              subeler: user.sube,
              egitimYili: M.C.AktifEgitimYili.findOne().egitimYili,
              // TODO: check this for timezone compatibility for NON-Europe/Istanbul
              acilisZamani: {$lt: currentTime}
            });
          }
        }
      }
    }
  };
});

Meteor.publish('girilmemisSinavVar', function(time) {
  check(time, Match.Optional(Date));
  let currentTime = new Date();
  if (time) {
    currentTime = time;
  }
  if (this.userId && M.L.userHasRole(this.userId, 'ogrenci')) {
    const user = M.C.Users.findOne({_id: this.userId});

    const girilenSinavlar = M.C.SinavKagitlari.find({
      ogrenci: user._id,
      kurum: user.kurum,
      sinif: user.sinif,
      egitimYili: M.C.AktifEgitimYili.findOne().egitimYili
    }).map(sinavKagidi => sinavKagidi.sinav);

    Counts.publish(this, 'girilmemisHalaAcikSinav', M.C.Sinavlar.find({
      $and: [
        {
          _id: {$nin: girilenSinavlar},
          kurum: user.kurum,
          taslak: false,
          aktif: true,
          iptal: false,
          muhur: {$exists: true},
          sinif: user.sinif,
          subeler: user.sube,
          egitimYili: M.C.AktifEgitimYili.findOne().egitimYili,
          acilisZamani: {$lt: currentTime}
        },
        {
          $or: [
            {
              tip: {$ne: 'canli'},
              kapanisZamani: {$gt: currentTime}
            },
            {
              tip: 'canli',
              kapanisZamani: {$gt: currentTime},
              canliStatus: {$ne: 'completed'}
            }
          ]
        }
      ]
    }));
  }
});

Meteor.publishComposite('sinav', function(sinavId, time) {
  check(sinavId, String);
  check(time, Match.Optional(Date));
  let currentTime = new Date();
  if (time) {
    currentTime = time;
  }
  return {
    find() {
      if (this.userId) {
        if (M.L.userHasRole(this.userId, 'mitolojix')) {
          return M.C.Sinavlar.find({_id: sinavId});
        } else {
          const user = M.C.Users.findOne({_id: this.userId});
          if (!M.L.userHasRole(this.userId, 'ogrenci')) {
            return M.C.Sinavlar.find({_id: sinavId, kurum: user.kurum});
          } else {
            return M.C.Sinavlar.find({
              _id: sinavId,
              kurum: user.kurum,
              taslak: false,
              aktif: true,
              iptal: false,
              muhur: {$exists: true},
              sinif: user.sinif,
              subeler: user.sube,
              egitimYili: M.C.AktifEgitimYili.findOne().egitimYili,
              // TODO: check this for timezone compatibility for NON-Europe/Istanbul
              acilisZamani: {$lt: currentTime}
            })
          }
        }
      }
    },
    children: sinavAuditLog
  }
});

const userCursor = userId => {
  return M.C.Users.find({_id: userId}, {fields: {cinsiyet: 1, status: 1, avatar: 1, kurum: 1, role: 1, name: 1, lastName: 1}})
};

const sinavAuditLog = [
  {
    find(doc) {
      return M.C.Comments.find({collection: 'Sinavlar', doc: doc._id});
    },
    children: [
      {
        find(comment) {
          return userCursor(comment.createdBy);
        }
      }
    ]
  },
  {
    find(doc) {
      if (doc.sorular) {
        let fields = {_id: 1, alan: 1, zorlukDerecesi: 1, tip: 1, aktif: 1, kod: 1, soru: 1};
        if (!M.L.userHasRole(this.userId, 'ogrenci')) {
          fields.yanit = 1;
        }
        return M.C.Sorular.find({_id: {$in: _.pluck(doc.sorular, 'soruId')}}, {fields: fields});
      }
    }
  },
  {
    find(doc) {
      return userCursor(doc.createdBy);
    }
  },
  {
    find(doc) {
      return userCursor(doc.updatedBy);
    }
  },
  {
    find(doc) {
      return doc.versions();
    },
    children: [
      {
        find(version) {
          if (version.sorular) {
            return M.C.Sorular.find({_id: {$in: _.pluck(version.sorular, 'soruId')}}, {fields: {_id: 1, alan: 1, zorlukDerecesi: 1, tip: 1, aktif: 1, kod: 1, soru: 1}});
          }
        }
      },
      {
        find(version) {
          return userCursor(version.createdBy);
        }
      },
      {
        find(version) {
          return userCursor(version.updatedBy);
        }
      }
    ]
  }
];

Meteor.publishComposite('sinavYanitlari', function(sinavId, time) {
  check(sinavId, String);
  check(time, Match.Optional(Date));
  let currentTime = new Date();
  if (time) {
    currentTime = time;
  }
  return {
    find() {
      if (this.userId && M.L.userHasRole(this.userId, 'ogrenci')) {
        const user = M.C.Users.findOne({_id: this.userId});
        const sinavCursor = M.C.Sinavlar.find({
          _id: sinavId,
          kurum: user.kurum,
          taslak: false,
          aktif: true,
          iptal: false,
          muhur: {$exists: true},
          sinif: user.sinif,
          subeler: user.sube,
          egitimYili: M.C.AktifEgitimYili.findOne().egitimYili,
          // TODO: check this for timezone compatibility for NON-Europe/Istanbul
          acilisZamani: {$lt: currentTime}
        });
        const buSinavAlinmis = M.C.SinavKagitlari.findOne({sinav: sinavId, ogrenciSinavaGirdi: true, bitirmeZamani: {$exists: true}});
        const sinav = M.C.Sinavlar.findOne({_id: sinavId});

        if (_.contains(['alistirma','konuTarama'],sinav.tip)) {
          if (buSinavAlinmis) {
            return sinavCursor;
          } else if (moment(sinav.kapanisZamani).isBefore(new Date())) {
            return sinavCursor;
          }
        } else if (moment(sinav.yanitlarAcilmaZamani).isBefore(new Date())) {
          return sinavCursor;
        }

      }
    },
    children: [
      {
        find(sinav) {
          if (sinav.sorular) {
            return M.C.Sorular.find({_id: {$in: _.pluck(sinav.sorular, 'soruId')}});
          }
        }
      },
      {
        find(sinav) {
          const user = M.C.Users.findOne({_id: this.userId});
          return M.C.SinavKagitlari.find({
            sinav: sinav._id,
            iptal: false,
            ogrenciSinavaGirdi: true,
            ogrenci: user._id,
            kurum: user.kurum,
            sinif: user.sinif,
            egitimYili: M.C.AktifEgitimYili.findOne().egitimYili
          });
        }
      }
    ]
  }
});

Meteor.publishComposite('sinavinOgrencileri', function(sinavId) {
  check(sinavId, String);
  const sinav = M.C.Sinavlar.findOne({
    _id: sinavId,
    taslak: false,
    aktif: true,
    iptal: false,
    kilitli: true,
    muhur: {$exists: true},
    acilisZamani: {$lt: new Date()}
  });
  return {
    find() {
      if (sinav && this.userId && !M.L.userHasRole(this.userId, 'ogrenci') && (M.L.userHasRole(this.userId, 'mitolojix') || sinav.kurum === M.C.Users.findOne({_id: this.userId}).kurum)) {
        return M.C.Users.find({
          aktif: true,
          role: 'ogrenci',
          kurum: sinav.kurum,
          sinif: sinav.sinif,
          sube: {$in: sinav.subeler}
        }, {
          fields: {
            aktif: 1,
            role: 1,
            kurum: 1,
            sinif: 1,
            sube: 1,
            name: 1,
            lastName: 1,
            nameCollate: 1,
            lastNameCollate: 1
          }
        })
      }
    }
  }
});

Meteor.publishComposite('sinavinKagitlari', function(sinavId) {
  check(sinavId, String);
  const sinav = M.C.Sinavlar.findOne({
    _id: sinavId,
    taslak: false,
    aktif: true,
    iptal: false,
    kilitli: true,
    muhur: {$exists: true},
    acilisZamani: {$lt: new Date()}
  });
  return {
    find() {
      if (sinav && this.userId && !M.L.userHasRole(this.userId, 'ogrenci') && (M.L.userHasRole(this.userId, 'mitolojix') || sinav.kurum === M.C.Users.findOne({_id: this.userId}).kurum)) {
        return M.C.SinavKagitlari.find({
          sinav: sinavId,
          ogrenciSinavaGirdi: true
        }, {
          fields: {
            _id: 1,
            sinav: 1,
            ogrenci: 1,
            ogrenciSinavaGirdi: 1,
            baslamaZamani: 1,
            bitirmeZamani: 1
          }
        })
      }
    }
  }
});
