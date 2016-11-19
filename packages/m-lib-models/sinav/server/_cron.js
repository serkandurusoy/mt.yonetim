import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';
import { _ } from 'meteor/underscore';

import { SyncedCron } from 'meteor/percolate:synced-cron';

import { M } from 'meteor/m:lib-core';

if (Meteor.settings.public.APP === 'YONETIM') {

  SyncedCron.add({
    name: 'Kapanışı yaklaşan sınavları almamışlara hatırlat.',
    schedule(parser) {
      return parser.recur().every(1).minute();
    },
    job() {
      Meteor.call('sinavKapanislariniHatirlat');
    }
  });

  SyncedCron.add({
    name: 'Vakti geçen sınavları otomatik kapat.',
    schedule(parser) {
      return parser.recur().every(1).minute();
    },
    job() {
      Meteor.call('sinavlariKapat');
    }
  });

  SyncedCron.add({
    name: 'Zorluk derecelerini hesaplayıp güncelle.',
    schedule(parser) {
      return parser.recur().every(1).minute();
    },
    job() {
      Meteor.call('zdHesapla');
    }
  });

  SyncedCron.add({
    name: 'Başlayacak sınavlara mühür ataması yap ve email hatırlatmalarını gönder.',
    schedule(parser) {
      return parser.recur().every(1).minute();
    },
    job() {
      Meteor.call('sinavAcVeMuhurAta');
    }
  });

  SyncedCron.add({
    name: 'Yanıtları açıklanan sınavları email ile duyur.',
    schedule(parser) {
      return parser.recur().every(1).hour();
    },
    job() {
      Meteor.call('yanitAcildiBildir');
    }
  });

  Meteor.methods({

    'sinavKapanislariniHatirlat'() {
      this.unblock();

      M.C.Sinavlar.find({
        taslak: false,
        iptal: false,
        kilitli: true,
        muhur: {$exists: true},
        acilisZamani: {$lt: new Date()},
        acilisKapanisArasindakiSureSaat: {$gt: 48},
        kapanisZamani: {$lt: moment().add(24,'hours').toDate()},
        tip: {$in: ['alistirma','konuTarama','deneme']},
        sinavKapanisiHatirlatmaZamani: {$exists: false}
      }, {sort: {acilisZamani: 1}}).forEach(sinav => {

        M.C.Users.find({
          _id: {$nin: _.uniq(M.C.SinavKagitlari.find({sinav: sinav._id}, {fields: {ogrenci: 1}}).map(sinavKagidi => sinavKagidi.ogrenci))},
          aktif: true,
          role: 'ogrenci',
          kurum: sinav.kurum,
          sinif: sinav.sinif,
          sube: {$in: sinav.subeler}
        }).forEach(user => {

          const ders = M.C.Dersler.findOne({_id: sinav.ders}).isim;
          const muhur = M.C.Muhurler.findOne({_id: sinav.muhur}).isim;
          const muhurURL = M.FS.Muhur.findOne({_id: M.C.Muhurler.findOne({_id: sinav.muhur}).gorsel}).url();

          try {

            Email.send({
              to: user.emails[0].address,
              from: '"Mitolojix'+( Meteor.settings.public.ENV === 'PRODUCTION' ? '' : (' ' + Meteor.settings.public.ENV) )+'" <bilgi@mitolojix.com>',
              subject: 'Test kapanmak üzere',
              text: 'Sevgili ' + user.name + ',\n\n'
              + 'Öğretmeninin Mitolojix\'e eklediği '+ ders + ' testi kapanmak üzere. Testi bilgisayarında çözmek için ' + Meteor.settings.public.URL.OYUN + ' adresinden giriş yap.'
              + '\n\n'
              + 'Başarılar,\nMitolojix\n',
              html: '<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>'
              + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sevgili ' + user.name + ',</p>'
              + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Öğretmeninin Mitolojix\'e eklediği '+ ders + ' testi kapanmak üzere. Testi bilgisayarında çözmek için aşağıdaki ' + muhur + ' mühürüne tıkla ya da <a href="' + Meteor.settings.public.URL.OYUN + '" target="_blank" style="color: #2196F3"> ' + Meteor.settings.public.URL.OYUN + '</a> adresinden giriş yap.</p>'
              + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333"><a href="' + Meteor.settings.public.URL.OYUN + '" target="_blank" style="color: #2196F3"><img src="' + Meteor.settings.public.URL.OYUN + muhurURL + '" style="border-style: none; width: 176px; height: 176px;" alt="' + muhur + '" width="176" height="176"/></a></p>'
              + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Başarılar,<br/>Mitolojix</p>'
              + '</body></html>'
            });

          } catch (error) {
            console.log(sinav._id + ' id\'li sinav kapanis hatirlatma bildirimi ' + user._id + ' id\'li ogrenciye iletilirken bilinmeyen hata olustu:\n', error);
          }

        });

        M.C.Sinavlar._collection.update({_id: sinav._id},{
          $set: {sinavKapanisiHatirlatmaZamani: new Date()}
        });

      })
    },

    'sinavlariKapat'() {
      this.unblock();

      M.C.Sinavlar.find({
        $and: [
          {taslak: false},
          {
            sinavKagitlariKapanmaZamani: {$exists: false}
          },
          {
            $or: [
              {
                kapanisZamani: {$lt: new Date()}
              },
              {
                tip: 'canli',
                canliStatus: 'completed'
              },
              {
                iptal: true
              }
            ]
          }
        ]
      }, {sort: {acilisZamani: 1}}).forEach(sinav => {

        M.C.Users.find({
          _id: {$nin: _.uniq(M.C.SinavKagitlari.find({sinav: sinav._id}, {fields: {ogrenci: 1}}).map(sinavKagidi => sinavKagidi.ogrenci))},
          kurum: sinav.kurum,
          sinif: sinav.sinif,
          sube: {$in: sinav.subeler}
        }).forEach(user => {
          Meteor.call('sinavaBasla', {sinavId: sinav._id, userId: user._id, ogrenciSinavaGirdi: false});
        });

        if (sinav.iptal === true) {
          M.C.SinavKagitlari.find({
            sinav: sinav._id,
            bitirmeZamani: {$exists: true},
            iptal: false
          }).forEach(sinavKagidi => {
            M.C.SinavKagitlari.update({
              _id: sinavKagidi._id
            },{
              $set: {
                iptal: true
              }
            });
          })
        } else {
          Meteor.call('sinavKapanisiBildir', {sinavId: sinav._id})
        }

        M.C.SinavKagitlari.find({
          sinav: sinav._id,
          bitirmeZamani: {$exists: false}
        }).forEach(sinavKagidi => {
          Meteor.call('sinaviBitir', {sinavKagidiId: sinavKagidi._id, userId: sinavKagidi.ogrenci, iptal: sinav.iptal});
        });

        M.C.Sinavlar._collection.update({_id: sinav._id},{
          $set: {sinavKagitlariKapanmaZamani: new Date()}
        });

      });

      M.C.SinavKagitlari.find({
        bitirmeZamani: {$exists: false},
        maxBitirmeZamani: {$lt: new Date()}
      }).forEach(sinavKagidi => {
        Meteor.call('sinaviBitir', {sinavKagidiId: sinavKagidi._id, userId: sinavKagidi.ogrenci});
      });

      M.C.SinavKagitlari.find({
        tip: {$nin: ['alistirma','konuTarama']},
        puanOrtalamayaGirdi: false,
        bitirmeZamani: {$exists: true},
        yanitlarAcilmaZamani: {$lt: new Date()}
      }).forEach(sinavKagidi => {
        M.C.SinavKagitlari.update({_id: sinavKagidi._id}, {$set: {puanOrtalamayaGirdi: true}});
        Meteor.call('ortalamaGuncelle', sinavKagidi.ogrenci);
      })

    },

    'sinavKapanisiBildir'(args) {
      this.unblock();

      check(args, {
        sinavId: String
      });

      const sinav = M.C.Sinavlar.findOne(args.sinavId);

      if (sinav) {

        try {

          let users = [];

          // sinavi olusturan ve son guncelleyenini al
          users = _.union(users, [sinav.createdBy]);
          users = !!sinav.updatedBy ? _.union(users, [sinav.updatedBy]) : users;

          // varsa eski versiyonlarin olusturan ve guncelleyenlerini al
          if (sinav._version > 1) {
            sinav.versions().forEach(sinav => {
              users = _.union(users, [sinav.createdBy]);
              users = !!sinav.updatedBy ? _.union(users, [sinav.updatedBy]) : users;
            })
          }

          // kurumda derse yetkisi olan ogretmenleri al
          M.C.Users.find({
            aktif: true,
            kurum: sinav.kurum,
            role: 'ogretmen',
            dersleri: sinav.ders
          }).forEach(user => {
            users = _.union(users, [user._id]);
          });

          // sinava comment etmis kisilerin ogretmen olmayanlarinin kendi kurumlarindan roldaslarini al
          M.C.Comments.find({
            collection: 'Sinavlar',
            doc: sinav._id
          }).forEach(comment => {
            const user = M.C.Users.findOne({_id: comment.createdBy});
            if (user.role !== 'ogretmen' && user.role !== 'ogrenci') {
              M.C.Users.find({
                aktif: true,
                kurum: user.kurum,
                role: user.role
              }).forEach(user => {
                users = _.union(users, [user._id]);
              });
            }
          });

          users = _.uniq(users);

          users.forEach(userId => {

            const user = M.C.Users.findOne({_id: userId});

            if (user) {

              try {

                const ders = M.C.Dersler.findOne({_id: sinav.ders}).isim;
                const sinifSube = M.L.enumLabel(sinav.sinif) + ' ' + sinav.subeler;
                const subeMetin = sinav.subeler.length === 1 ? 'şubesi' : 'şubeleri';
                const tip = M.L.enumLabel(sinav.tip);
                const sinavKod = sinav.kod;
                const acilisZamani = moment(sinav.acilisZamani).format('DD MMMM YYYY HH:mm');
                const kapanisZamani = moment(sinav.kapanisZamani).format('DD MMMM YYYY HH:mm');
                const soruSayisi = sinav.sorular.length;
                const kurum = user.kurum === 'mitolojix' ? ( M.C.Kurumlar.findOne({_id: sinav.kurum}).isim + ' altında ' ) : '';

                if (user.role !== 'ogrenci') {

                  Email.send({
                    to: user.emails[0].address,
                    from: '"Mitolojix'+( Meteor.settings.public.ENV === 'PRODUCTION' ? '' : (' ' + Meteor.settings.public.ENV) )+'" <bilgi@mitolojix.com>',
                    subject: 'Test kapandı',
                    text: 'Sayın ' + user.name + ' ' + user.lastName + ',\n\n'
                    + 'Mitolojix uygulamasında ' + acilisZamani + ' ile ' + kapanisZamani + ' arasında tanımlanan ' + kurum + sinifSube + ' ' + subeMetin + ' için ' + ders + ' dersine ait ' + soruSayisi + ' soruluk ' + sinavKod + ' numaralı ' + tip + ' kapandı.'
                    + '\n\n'
                    + 'Test raporlarına ' + Meteor.settings.public.URL.YONETIM + ' adresinden ulaşabilirsiniz.'
                    + '\n\n'
                    + 'Saygılarımızla,\nMitolojix\n',
                    html: '<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>'
                    + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sayın ' + user.name + ' ' + user.lastName + ',</p>'
                    + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Mitolojix uygulamasında ' + acilisZamani + ' ile ' + kapanisZamani + ' arasında tanımlanan ' + kurum + sinifSube + ' ' + subeMetin + ' için ' + ders + ' dersine ait ' + soruSayisi + ' soruluk ' + sinavKod + ' numaralı ' + tip + ' kapandı.</p>'
                    + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Test raporlarına <a href="' + Meteor.settings.public.URL.YONETIM + '" target="_blank" style="color: #2196F3">buradan</a> ulaşabilirsiniz.</p>'
                    + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Saygılarımızla,<br/>Mitolojix</p>'
                    + '</body></html>'
                  });

                }

              } catch (error) {
                console.log(sinav._id + ' id\'li sinav kapanisi icin ' + userId + ' id\'li kullaniciya email bildirimi yapilirken bilinmeyen hata oluştu:\n', error);
              }

            }

          });

        } catch (error) {
          console.log(sinav._id + ' id\'li sinav kapanisi email bildirimi alicilari taranirken bilinmeyen hata oluştu:\n', error);
        }

      }

    },

    'zdHesapla'() {
      this.unblock();

      const aktifEgitimYili = M.C.AktifEgitimYili.findOne().egitimYili;

      let soruSeti = [];
      let sinavSeti = [];
      let guncellenecekSinavlar = [];

      M.C.Sinavlar.find({
        tip: {$in: ['deneme', 'canli']},
        taslak: false,
        aktif: true,
        iptal: false,
        muhur: {$exists: true},
        egitimYili: aktifEgitimYili,
        kapanisZamani: {$lt: new Date()},
        soruZDGuncellemesiYapilmaZamani: {$exists: false}
      }, {sort: {acilisZamani: 1}}).forEach(sinav => {
        _.pluck(sinav.sorular, 'soruId').forEach(soruId => {
          soruSeti.push(soruId);
        });
        sinavSeti.push(sinav._id);
      });

      soruSeti = _.uniq(soruSeti);
      sinavSeti = _.uniq(sinavSeti);

      if (soruSeti.length > 0 && sinavSeti.length > 0) {
        soruSeti.forEach(soruId => {
          let yanlisAdet = M.C.SinavKagitlari.aggregate([
            {
              $match:
              {
                bitirmeZamani: {$exists: true},
                iptal: false,
                egitimYili: aktifEgitimYili,
                yanitlar: {$elemMatch : {soruId: soruId, dogru: false}}
              }
            },
            {
              $group:
              {
                _id: null,
                adet: { $sum: 1 }
              }
            }
          ])[0];
          yanlisAdet = !!yanlisAdet ? parseInt(yanlisAdet.adet) : 0;
          let dogruAdet = M.C.SinavKagitlari.aggregate([
            {
              $match:
              {
                bitirmeZamani: {$exists: true},
                iptal: false,
                egitimYili: aktifEgitimYili,
                yanitlar: {$elemMatch : {soruId: soruId, dogru: true}}
              }
            },
            {
              $group:
              {
                _id: null,
                adet: { $sum: 1 }
              }
            }
          ])[0];
          dogruAdet = !!dogruAdet ? parseInt(dogruAdet.adet) : 0;
          const toplamAdet = math.chain(yanlisAdet).add(dogruAdet).done();

          if (toplamAdet > 0) {
            const yeniZD = math.chain(5).subtract(math.chain(dogruAdet).divide(toplamAdet).multiply(4).round().done()).done();

            M.C.Sorular._collection.update({_id: soruId},{
              $set: {zorlukDerecesi: yeniZD}
            });

            M.C.Sinavlar.find({
              'sorular.soruId': soruId,
              kilitli: false,
              aktif: true,
              iptal: false,
              muhur: {$exists: false},
              egitimYili: aktifEgitimYili,
              acilisZamani: {$gt: new Date()}
            }).forEach(sinav => {
              guncellenecekSinavlar.push(sinav._id);
            });

          }

        });

        sinavSeti.forEach(sinavId => {
          M.C.Sinavlar._collection.update({_id: sinavId},{
            $set: {soruZDGuncellemesiYapilmaZamani: new Date()}
          });
        });

        guncellenecekSinavlar = _.uniq(guncellenecekSinavlar);
        guncellenecekSinavlar.forEach(sinavId => {
          M.C.Sinavlar.find({
            _id: sinavId,
            kilitli: false,
            aktif: true,
            iptal: false,
            muhur: {$exists: false},
            egitimYili: aktifEgitimYili,
            acilisZamani: {$gt: new Date()}
          }, {fields: {_id: 1, sorular: 1}}).forEach(sinav => {
            let sorular = sinav.sorular.map(soru => {
              soru.zorlukDerecesi = M.C.Sorular.findOne({_id: soru.soruId}).zorlukDerecesi;
              return soru;
            });

            const initialToplamZD = sorular.reduce((memo, soru) => {
              return memo + soru.zorlukDerecesi
            }, 0);

            sorular = sorular.map(soru => {
              return {
                soruId: soru.soruId,
                zorlukDerecesi: soru.zorlukDerecesi,
                puan: math.chain(soru.zorlukDerecesi).divide(initialToplamZD).multiply(100).round().done()
              }
            });

            const initialToplamPuan = sorular.reduce((memo, soru) => {
              return memo + soru.puan
            }, 0);

            const sortedSorular = _.sortBy(sorular, 'puan');
            const soruCount = sorular.length;
            const puanFarki = initialToplamPuan - 100;

            if (!!puanFarki) {
              for (let ix=0; ix < Math.abs(puanFarki); ix++) {
                let soruIndex = soruCount-ix-1;
                sorular = sorular.map(soru => {
                  if (soru.soruId === sortedSorular[soruIndex].soruId) {
                    soru.puan = soru.puan - ( puanFarki / Math.abs(puanFarki) );
                  }
                  return soru;
                })
              }
            }

            M.C.Sinavlar._collection.update({_id: sinav._id},{
              $set: {sorular: sorular}
            });

          })

        })

      }

    },

    'yanitAcildiBildir'() {
      this.unblock();

      M.C.Kurumlar.find().forEach(kurum => {

        M.C.Sinavlar.find({
          $and: [
            {kurum: kurum._id},
            {tip: {$in: ['deneme','canli']}},
            {aktif: true},
            {iptal: false},
            {taslak: false},
            {yanitlarAcilmaZamani: {$gt: moment(new Date()).subtract(1,'hours').toDate()}},
            {yanitlarAcilmaZamani: {$lt: new Date()}},
            {muhur: {$exists: true}},
            {egitimYili: M.C.AktifEgitimYili.findOne().egitimYili}
          ]
        }, {sort: {acilisZamani: 1}}).forEach(sinav => {
          let users = [];

          // sinavi olusturan ve son guncelleyenini al
          users = _.union(users, [sinav.createdBy]);
          users = !!sinav.updatedBy ? _.union(users, [sinav.updatedBy]) : users;

          // varsa eski versiyonlarin olusturan ve guncelleyenlerini al
          if (sinav._version > 1) {
            sinav.versions().forEach(sinav => {
              users = _.union(users, [sinav.createdBy]);
              users = !!sinav.updatedBy ? _.union(users, [sinav.updatedBy]) : users;
            })
          }

          // kurumda derse yetkisi olan ogretmenleri al
          M.C.Users.find({
            aktif: true,
            kurum: sinav.kurum,
            role: 'ogretmen',
            dersleri: sinav.ders
          }).forEach(user => {
            users = _.union(users, [user._id]);
          });

          // sinava comment etmis kisilerin ogretmen olmayanlarinin kendi kurumlarindan roldaslarini al
          M.C.Comments.find({
            collection: 'Sinavlar',
            doc: sinav._id
          }).forEach(comment => {
            const user = M.C.Users.findOne({_id: comment.createdBy});
            if (user.role !== 'ogretmen' && user.role !== 'ogrenci') {
              M.C.Users.find({
                aktif: true,
                kurum: user.kurum,
                role: user.role
              }).forEach(user => {
                users = _.union(users, [user._id]);
              });
            }
          });

          // sinavin yapilacagi kurumun ayni sinif ve subelerdeki ogrencilerini al
          M.C.Users.find({
            aktif: true,
            role: 'ogrenci',
            kurum: sinav.kurum,
            sinif: sinav.sinif,
            sube: {$in: sinav.subeler}
          }).forEach(user => {
            users = _.union(users, [user._id]);
          });

          users = _.uniq(users);

          users.forEach(userId => {

            const user = M.C.Users.findOne({_id: userId});

            if (user) {
              const muhurGrubu = M.C.Dersler.findOne({_id: sinav.ders}).muhurGrubu.isim;
              const ders = M.C.Dersler.findOne({_id: sinav.ders}).isim;
              const muhur = M.C.Muhurler.findOne({_id: sinav.muhur}).isim;
              const sinifSube = M.L.enumLabel(sinav.sinif) + ' ' + sinav.subeler;
              const subeMetin = sinav.subeler.length === 1 ? 'şubesi' : 'şubeleri';
              const tip = M.L.enumLabel(sinav.tip);
              const soruSayisi = sinav.sorular.length;
              const kurum = user.kurum === 'mitolojix' ? ( M.C.Kurumlar.findOne({_id: sinav.kurum}).isim + ' altında ' ) : '';

              if (user.role === 'ogrenci') {

                Email.send({
                  to: user.emails[0].address,
                  from: '"Mitolojix'+( Meteor.settings.public.ENV === 'PRODUCTION' ? '' : (' ' + Meteor.settings.public.ENV) )+'" <bilgi@mitolojix.com>',
                  subject: 'Test yanıtları açıldı',
                  text: 'Sevgili ' + user.name + ',\n\n'
                  + ders + ' dersi ' + tip + ' yanıtları açıldı. Yanıtlara ' + muhurGrubu + ' grubuna ait ' + muhur + ' mühürünün bilgi ekranından erişebilirsin.'
                  + '\n\n'
                  + 'Oyuna gitmek için ' + Meteor.settings.public.URL.OYUN + ' bağlantısına tıklayabilirsin.'
                  + '\n\n'
                  + 'Sevgiler,\nMitolojix\n',
                  html: '<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sevgili ' + user.name + ',</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">' + ders + ' dersi ' + tip + ' yanıtları açıldı. Yanıtlara ' + muhurGrubu + ' grubuna ait ' + muhur + ' mühürünün bilgi ekranından erişebilirsin.</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Oyuna gitmek için <a href="' + Meteor.settings.public.URL.OYUN + '" target="_blank" style="color: #2196F3">buraya</a> tıklayabilirsin.</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sevgiler,<br/>Mitolojix</p>'
                  + '</body></html>'
                });

              } else {

                Email.send({
                  to: user.emails[0].address,
                  from: '"Mitolojix'+( Meteor.settings.public.ENV === 'PRODUCTION' ? '' : (' ' + Meteor.settings.public.ENV) )+'" <bilgi@mitolojix.com>',
                  subject: 'Test yanıtları açıldı',
                  text: 'Sayın ' + user.name + ' ' + user.lastName + ',\n\n'
                  + 'Mitolojix uygulamasında ' + kurum + sinifSube + ' ' + subeMetin +  ' için ' + muhurGrubu + ' mühür grubu ' + ders + ' dersine ait ' + soruSayisi + ' soruluk ' + tip + ' yanıtları öğrencilere açıldı.'
                  + '\n\n'
                  + 'Saygılarımızla,\nMitolojix\n',
                  html: '<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sayın ' + user.name + ' ' + user.lastName + ',</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Mitolojix uygulamasında ' + sinifSube + ' ' + subeMetin + ' için ' + muhurGrubu + ' mühür grubu ' + ders + ' dersine ait ' + soruSayisi + ' soruluk ' + tip + ' yanıtları öğrencilere açıldı.</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Saygılarımızla,<br/>Mitolojix</p>'
                  + '</body></html>'
                });

              }

            }

          });

        });

      });

    },

    'sinavAcVeMuhurAta'() {
      // TODO: there is some duplication of this code in comment/server/_hooks.js
      this.unblock();

      M.C.Kurumlar.find().forEach(kurum => {

        let sinavlar = [];
        // TODO: use a query iterator or isolated find/update here for possible concurrency issues
        M.C.Sinavlar.find({
          kurum: kurum._id,
          aktif: true,
          iptal: false,
          taslak: false,
          acilisZamani: {$lt: moment(new Date()).add(1,'minutes').toDate()},
          //kapanisZamani: {$gt: moment(new Date()).add(1,'minutes').toDate()},
          'sorular.0': {$exists: true}, // en az bir soru var
          muhur: {$exists: false},
          egitimYili: M.C.AktifEgitimYili.findOne().egitimYili
        }, {sort: {acilisZamani: 1}}).forEach(sinav => {
          const kullanilmisMuhurler = _.pluck(M.C.Sinavlar.find({
            kurum: sinav.kurum,
            egitimYili: sinav.egitimYili,
            ders: sinav.ders,
            sinif: sinav.sinif,
            muhur: {$exists: true}
          },{fields: {muhur: 1}}).fetch(),'muhur');

          const tumMuhurler = _.pluck(M.C.Muhurler.find({
            ders: sinav.ders,
            aktif: true
          },{fields: {_id: 1}}).fetch(), '_id');

          const potansiyelMuhurler = _.difference(tumMuhurler, kullanilmisMuhurler);

          if (potansiyelMuhurler.length > 0) {
            const siradakiMuhur = M.C.Muhurler.find({
              _id: {$in: potansiyelMuhurler}
            },{sort: {sira: 1}, limit: 1, fields: {_id: 1, sira: 1}}).fetch()[0]._id;

            M.C.Sinavlar.update({_id: sinav._id}, {
              $set: {
                muhur: siradakiMuhur,
                kilitli: true
              }
            });
            sinavlar.push(sinav._id);
          } else {
            const sorunluKurum = M.C.Kurumlar.findOne({_id: sinav.kurum}).isim;
            const sorunluDers = M.C.Dersler.findOne({_id: sinav.ders}).isim;
            const sorunluMuhurGrubu = M.C.Dersler.findOne({_id: sinav.ders}).muhurGrubu.isim;
            const sorunluSinavKodu = sinav.kod;
            const sorunluSubeler = M.L.enumLabel(sinav.sinif) + ' ' + sinav.subeler.join(', ') + ' ' + (sinav.subeler.length > 1 ? 'şubeleri' : 'şubesi');
            const sorunluAcilisZamani = moment(sinav.acilisZamani).format('DD MMMM YYYY HH:mm');
            const sorunluSinavTipi = M.L.enumLabel(sinav.tip);

            M.C.Users.find({role: 'mitolojix'}).forEach(user => {
              Email.send({
                to: user.emails[0].address,
                from: '"Mitolojix'+( Meteor.settings.public.ENV === 'PRODUCTION' ? '' : (' ' + Meteor.settings.public.ENV) )+'" <bilgi@mitolojix.com>',
                subject: 'Test öğrencilere açılamadı',
                text: 'Sayın ' + user.name + ' ' + user.lastName + ',\n\n'
                + sorunluKurum + ' ' + sorunluSubeler + ' için ' + sorunluAcilisZamani + ' itibariyle uygulanması gereken ' + sorunluSinavKodu + ' kodlu ' + sorunluDers + ' ' + sorunluSinavTipi + ' için kullanılmak üzere ' + sorunluMuhurGrubu + ' grubunda mühür kalmamış ve test öğrencilere açılamamıştır.'
                + '\n\n'
                + 'Testin açılabilmesi için sistem yöneticisi tarafından yeni mühür tanımlaması yapılması gerekmektedir.'
                + '\n\n'
                + 'Saygılarımızla,\nMitolojix\n',
                html: '<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>'
                + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sayın ' + user.name + ' ' + user.lastName + ',</p>'
                + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">' + sorunluKurum + ' ' + sorunluSubeler + ' için ' + sorunluAcilisZamani + ' itibariyle uygulanması gereken ' + sorunluSinavKodu + ' kodlu ' + sorunluDers + ' ' + sorunluSinavTipi + ' için kullanılmak üzere ' + sorunluMuhurGrubu + ' grubunda mühür kalmamış ve test öğrencilere açılamamıştır.' + '</p>'
                + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Testin açılabilmesi için sistem yöneticisi tarafından yeni mühür tanımlaması yapılması gerekmektedir.</p>'
                + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Saygılarımızla,<br/>Mitolojix</p>'
                + '</body></html>'
              });
            });

          }

        });

        sinavlar.forEach(sinavId => {

          let users = [];

          let sinav = M.C.Sinavlar.findOne({
            _id: sinavId
          });

          // sinavi olusturan ve son guncelleyenini al
          users = _.union(users, [sinav.createdBy]);
          users = !!sinav.updatedBy ? _.union(users, [sinav.updatedBy]) : users;

          // varsa eski versiyonlarin olusturan ve guncelleyenlerini al
          if (sinav._version > 1) {
            sinav.versions().forEach(sinav => {
              users = _.union(users, [sinav.createdBy]);
              users = !!sinav.updatedBy ? _.union(users, [sinav.updatedBy]) : users;
            })
          }

          // kurumda derse yetkisi olan ogretmenleri al
          M.C.Users.find({
            aktif: true,
            kurum: sinav.kurum,
            role: 'ogretmen',
            dersleri: sinav.ders
          }).forEach(user => {
            users = _.union(users, [user._id]);
          });

          // sinava comment etmis kisilerin ogretmen olmayanlarinin kendi kurumlarindan roldaslarini al
          M.C.Comments.find({
            collection: 'Sinavlar',
            doc: sinav._id
          }).forEach(comment => {
            const user = M.C.Users.findOne({_id: comment.createdBy});
            if (user.role !== 'ogretmen' && user.role !== 'ogrenci') {
              M.C.Users.find({
                aktif: true,
                kurum: user.kurum,
                role: user.role
              }).forEach(user =>{
                users = _.union(users, [user._id]);
              });
            }
          });

          // sinavin yapilacagi kurumun ayni sinif ve subelerdeki ogrencilerini al
          M.C.Users.find({
            aktif: true,
            role: 'ogrenci',
            kurum: sinav.kurum,
            sinif: sinav.sinif,
            sube: {$in: sinav.subeler}
          }).forEach(user => {
            users = _.union(users, [user._id]);
          });

          users = _.uniq(users);

          users.forEach(userId => {

            const user = M.C.Users.findOne({_id: userId});

            if (user) {
              const muhurGrubu = M.C.Dersler.findOne({_id: sinav.ders}).muhurGrubu.isim;
              const ders = M.C.Dersler.findOne({_id: sinav.ders}).isim;
              const muhur = M.C.Muhurler.findOne({_id: sinav.muhur}).isim;
              const muhurURL = M.FS.Muhur.findOne({_id: M.C.Muhurler.findOne({_id: sinav.muhur}).gorsel}).url();
              const sinifSube = M.L.enumLabel(sinav.sinif) + ' ' + sinav.subeler;
              const subeMetin = sinav.subeler.length === 1 ? 'şubesi' : 'şubeleri';
              const tip = M.L.enumLabel(sinav.tip);
              const kod = sinav.kod;
              const soruSayisi = sinav.sorular.length;
              const sureMetin = sinav.sure + ' dakika içinde tamamlanarak ';
              const sureMetinOgrenci = sinav.sure + ' dakika içinde yanıtlarsan ';
              const acilisZamani = moment(sinav.acilisZamani).format('DD MMMM YYYY HH:mm');
              const kapanisZamani = moment(sinav.kapanisZamani).format('DD MMMM YYYY HH:mm');
              const kurum = user.kurum === 'mitolojix' ? ( M.C.Kurumlar.findOne({_id: sinav.kurum}).isim + ' altında ' ) : '';

              if (user.role === 'ogrenci') {

                Email.send({
                  to: user.emails[0].address,
                  from: '"Mitolojix'+( Meteor.settings.public.ENV === 'PRODUCTION' ? '' : (' ' + Meteor.settings.public.ENV) )+'" <bilgi@mitolojix.com>',
                  subject: 'Yeni bir test açıldı',
                  text: 'Sevgili ' + user.name + ',\n\n'
                  + 'Öğretmenin Mitolojix\'e yeni bir '+ ders + ' testi ekledi. Testi bilgisayarında çözmek için ' + Meteor.settings.public.URL.OYUN + ' adresinden giriş yap.'
                  + '\n\n'
                  + 'Başarılar,\nMitolojix\n',
                  html: '<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sevgili ' + user.name + ',</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Öğretmenin Mitolojix\'e yeni bir '+ ders + ' testi ekledi. Testi bilgisayarında çözmek için aşağıdaki ' + muhur + ' mühürüne tıkla ya da <a href="' + Meteor.settings.public.URL.OYUN + '" target="_blank" style="color: #2196F3">' + Meteor.settings.public.URL.OYUN + '</a> adresinden giriş yap.</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333"><a href="' + Meteor.settings.public.URL.OYUN + '" target="_blank" style="color: #2196F3"><img src="' + Meteor.settings.public.URL.OYUN + muhurURL + '" style="border-style: none; width: 176px; height: 176px;" alt="' + muhur + '" width="176" height="176"/></a></p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Başarılar,<br/>Mitolojix</p>'
                  + '</body></html>'
                });

              } else {

                Email.send({
                  to: user.emails[0].address,
                  from: '"Mitolojix'+( Meteor.settings.public.ENV === 'PRODUCTION' ? '' : (' ' + Meteor.settings.public.ENV) )+'" <bilgi@mitolojix.com>',
                  subject: 'Yeni bir test açıldı',
                  text: 'Sayın ' + user.name + ' ' + user.lastName + ',\n\n'
                  + 'Mitolojix uygulamasında ' + kurum + sinifSube + ' ' + subeMetin + ' için ' + muhurGrubu + ' mühür grubu ' + ders + ' dersine ait ' + soruSayisi + ' soruluk ' + kod + ' numaralı yeni bir ' + tip + ' açıldı.'
                  + '\n\n'
                  + 'Test ' + acilisZamani + ' ile ' + kapanisZamani + ' arasında ' + sureMetin + muhur + ' mühürü kazanılabilir.'
                  + '\n\n'
                  + 'Saygılarımızla,\nMitolojix\n',
                  html: '<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sayın ' + user.name + ' ' + user.lastName + ',</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Mitolojix uygulamasında '+ kurum + sinifSube + ' ' + subeMetin +  ' için ' + muhurGrubu + ' mühür grubu ' + ders + ' dersine ait ' + soruSayisi + ' soruluk ' + kod + ' numaralı yeni bir ' + tip + ' açıldı.</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Test ' + acilisZamani + ' ile ' + kapanisZamani + ' arasında ' + sureMetin + muhur + ' mühürü kazanılabilir.</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Saygılarımızla,<br/>Mitolojix</p>'
                  + '</body></html>'
                });

              }

            }

          });


        });


      });

    }

  });

}
