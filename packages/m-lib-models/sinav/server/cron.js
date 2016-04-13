if (Meteor.settings.public.APP === 'YONETIM') {

  SyncedCron.add({
    name: 'Vakti geçen sınavları otomatik kapat.',
    schedule: function (parser) {
      return parser.recur().every(1).minute();
    },
    job: function () {
      Meteor.call('sinavlariKapat');
    }
  });

  SyncedCron.add({
    name: 'Zorluk derecelerini hesaplayıp güncelle.',
    schedule: function (parser) {
      return parser.recur().every(1).minute();
    },
    job: function () {
      Meteor.call('zdHesapla');
    }
  });

  SyncedCron.add({
    name: 'Başlayacak sınavlara mühür ataması yap ve email hatırlatmalarını gönder.',
    schedule: function (parser) {
      return parser.recur().every(1).minute();
    },
    job: function () {
      Meteor.call('sinavAcVeMuhurAta');
    }
  });

  SyncedCron.add({
    name: 'Yanıtları açıklanan sınavları email ile duyur.',
    schedule: function (parser) {
      return parser.recur().every(1).hour();
    },
    job: function () {
      Meteor.call('yanitAcildiBildir');
    }
  });

  Meteor.methods({

    'sinavlariKapat': function() {
      this.unblock();

      M.C.Sinavlar.find({
        $and: [
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
      }, {sort: {acilisZamani: 1}}).forEach(function(sinav) {

        M.C.Users.find({
          _id: {$nin: _.uniq(M.C.SinavKagitlari.find({sinav: sinav._id}, {fields: {ogrenci: 1}}).map(function(sinavKagidi) {return sinavKagidi.ogrenci;}))},
          kurum: sinav.kurum,
          sinif: sinav.sinif,
          sube: {$in: sinav.subeler}
        }).forEach(function(user) {
          Meteor.call('sinavaBasla', {sinavId: sinav._id, userId: user._id, ogrenciSinavaGirdi: false});
        });

        if (sinav.iptal === true) {
          M.C.SinavKagitlari.find({
            sinav: sinav._id,
            bitirmeZamani: {$exists: true},
            iptal: false
          }).forEach(function(sinavKagidi) {
            M.C.SinavKagitlari.update({
              _id: sinavKagidi._id
            },{
              $set: {
                iptal: true
              }
            });
          })
        }

        M.C.SinavKagitlari.find({
          sinav: sinav._id,
          bitirmeZamani: {$exists: false}
        }).forEach(function(sinavKagidi) {
          Meteor.call('sinaviBitir', {sinavKagidiId: sinavKagidi._id, userId: sinavKagidi.ogrenci, iptal: sinav.iptal});
        });

        M.C.Sinavlar._collection.update({_id: sinav._id},{
          $set: {sinavKagitlariKapanmaZamani: new Date()}
        });

      });

      M.C.SinavKagitlari.find({
        bitirmeZamani: {$exists: false},
        maxBitirmeZamani: {$lt: new Date()}
      }).forEach(function(sinavKagidi) {
        Meteor.call('sinaviBitir', {sinavKagidiId: sinavKagidi._id, userId: sinavKagidi.ogrenci});
      });

      M.C.SinavKagitlari.find({
        tip: {$nin: ['alistirma','konuTarama']},
        puanOrtalamayaGirdi: false,
        bitirmeZamani: {$exists: true},
        yanitlarAcilmaZamani: {$lt: new Date()}
      }).forEach(function(sinavKagidi) {
        M.C.SinavKagitlari.update({_id: sinavKagidi._id}, {$set: {puanOrtalamayaGirdi: true}});
        Meteor.call('ortalamaGuncelle', sinavKagidi.ogrenci);
      })

    },

    'zdHesapla': function() {
      this.unblock();

      var aktifEgitimYili = M.C.AktifEgitimYili.findOne().egitimYili;

      var soruSeti = [];
      var sinavSeti = [];
      var guncellenecekSinavlar = [];

      M.C.Sinavlar.find({
        tip: {$in: ['deneme', 'canli']},
        taslak: false,
        aktif: true,
        iptal: false,
        muhur: {$exists: true},
        egitimYili: aktifEgitimYili,
        kapanisZamani: {$lt: new Date()},
        soruZDGuncellemesiYapilmaZamani: {$exists: false}
      }, {sort: {acilisZamani: 1}}).forEach(function(sinav) {
        _.each(_.pluck(sinav.sorular, 'soruId'), function(soruId) {
          soruSeti.push(soruId);
        });
        sinavSeti.push(sinav._id);
      });

      soruSeti = _.uniq(soruSeti);
      sinavSeti = _.uniq(sinavSeti);

      if (soruSeti.length > 0 && sinavSeti.length > 0) {
        _.each(soruSeti, function(soruId) {
          var yanlisAdet = M.C.SinavKagitlari.aggregate([
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
          var dogruAdet = M.C.SinavKagitlari.aggregate([
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
          var toplamAdet = math.chain(yanlisAdet).add(dogruAdet).done();

          if (toplamAdet > 0) {
            var yeniZD = math.chain(5).subtract(math.chain(dogruAdet).divide(toplamAdet).multiply(4).round().done()).done();

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
            }).forEach(function(sinav) {
              guncellenecekSinavlar.push(sinav._id);
            });

          }

        });

        _.each(sinavSeti, function(sinavId) {
          M.C.Sinavlar._collection.update({_id: sinavId},{
            $set: {soruZDGuncellemesiYapilmaZamani: new Date()}
          });
        });

        guncellenecekSinavlar = _.uniq(guncellenecekSinavlar);
        _.each(guncellenecekSinavlar, function(sinavId) {
          M.C.Sinavlar.find({
            _id: sinavId,
            kilitli: false,
            aktif: true,
            iptal: false,
            muhur: {$exists: false},
            egitimYili: aktifEgitimYili,
            acilisZamani: {$gt: new Date()}
          }, {fields: {_id: 1, sorular: 1}}).forEach(function(sinav) {
            var sorular = _.map(sinav.sorular, function(soru) {
              soru.zorlukDerecesi = M.C.Sorular.findOne({_id: soru.soruId}).zorlukDerecesi;
              return soru;
            });

            var initialToplamZD = _.reduce(sorular, function(memo, soru) {
              return memo + soru.zorlukDerecesi
            }, 0);

            sorular = _.map(sorular, function(soru) {
              return {
                soruId: soru.soruId,
                zorlukDerecesi: soru.zorlukDerecesi,
                puan: math.chain(soru.zorlukDerecesi).divide(initialToplamZD).multiply(100).round().done()
              }
            });

            var initialToplamPuan = _.reduce(sorular, function(memo, soru) {
              return memo + soru.puan
            }, 0);

            var sortedSorular = _.sortBy(sorular, 'puan');
            var soruCount = sorular.length;
            var puanFarki = initialToplamPuan - 100;

            if (!!puanFarki) {
              for (var ix=0; ix < Math.abs(puanFarki); ix++) {
                var soruIndex = soruCount-ix-1;
                sorular = _.map(sorular, function(soru) {
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

    'yanitAcildiBildir': function() {
      this.unblock();

      M.C.Kurumlar.find().forEach(function(kurum) {

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
        }, {sort: {acilisZamani: 1}}).forEach(function(sinav) {
          var users = [];

          // sinavi olusturan ve son guncelleyenini al
          users = _.union(users, [sinav.createdBy]);
          users = !!sinav.updatedBy ? _.union(users, [sinav.updatedBy]) : users;

          // varsa eski versiyonlarin olusturan ve guncelleyenlerini al
          if (sinav._version > 1) {
            sinav.versions().forEach(function(sinav) {
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
          }).forEach(function(user) {
            users = _.union(users, [user._id]);
          });

          // sinava comment etmis kisilerin ogretmen olmayanlarinin kendi kurumlarindan roldaslarini al
          M.C.Comments.find({
            collection: 'Sinavlar',
            doc: sinav._id
          }).forEach(function(comment) {
            var user = M.C.Users.findOne({_id: comment.createdBy});
            if (user.role !== 'ogretmen' && user.role !== 'ogrenci') {
              M.C.Users.find({
                aktif: true,
                kurum: user.kurum,
                role: user.role
              }).forEach(function(user) {
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
          }).forEach(function(user) {
            users = _.union(users, [user._id]);
          });

          users = _.uniq(users);

          _.each(users, function(userId) {

            var user = M.C.Users.findOne({_id: userId});

            if (user) {
              var muhurGrubu = M.C.Dersler.findOne({_id: sinav.ders}).muhurGrubu.isim;
              var ders = M.C.Dersler.findOne({_id: sinav.ders}).isim;
              var muhur = M.C.Muhurler.findOne({_id: sinav.muhur}).isim;
              var sinifSube = M.L.enumLabel(sinav.sinif) + ' ' + sinav.subeler;
              var tip = M.L.enumLabel(sinav.tip);
              var soruSayisi = sinav.sorular.length;
              var kurum = user.kurum === 'mitolojix' ? ( M.C.Kurumlar.findOne({_id: sinav.kurum}).isim + ' altında ' ) : '';

              if (user.role === 'ogrenci') {

                Email.send({
                  to: user.emails[0].address,
                  from: '"Mitolojix" <admin@mitolojix.com>',
                  subject: 'Sınav yanıtları açıldı',
                  text: 'Sevgili ' + user.name + ',\n\n'
                  + ders + ' dersi ' + tip + ' yanıtları açıldı. Yanıtlara ' + muhurGrubu + ' grubuna ait ' + muhur + ' mühürünün bilgi ekranından erişebilirsin.'
                  + '\n\n'
                  + 'Oyuna gitmek için ' + Meteor.settings.public.URL.OYUN + ' bağlantısına tıklayabilirsin.'
                  + '\n\n'
                  + 'Sevgiler,\nMitolojix\n',
                  html: '<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sevgili ' + user.name + ',</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">' + ders + ' dersi ' + tip + ' yanıtları açıldı. Yanıtlara ' + muhurGrubu + ' grubuna ait ' + muhur + ' mühürünün bilgi ekranından erişebilirsin.</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Oyuna gitmek için <a href="' + Meteor.settings.public.URL.OYUN + '" target="_blank">buraya</a> tıklayabilirsin.</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sevgiler,<br/>Mitolojix</p>'
                  + '</body></html>'
                });

              } else {

                Email.send({
                  to: user.emails[0].address,
                  from: '"Mitolojix" <admin@mitolojix.com>',
                  subject: 'Sınav yanıtları açıldı',
                  text: 'Sayın ' + user.name + ' ' + user.lastName + ',\n\n'
                  + 'Mitolojix uygulamasında ' + kurum + sinifSube + ' şubeleri için ' + muhurGrubu + ' mühür grubu ' + ders + ' dersine ait ' + soruSayisi + ' soruluk ' + tip + ' yanıtları öğrencilere açıldı.'
                  + '\n\n'
                  + 'Saygılarımızla,\nMitolojix\n',
                  html: '<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sayın ' + user.name + ' ' + user.lastName + ',</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Mitolojix uygulamasında ' + sinifSube + ' şubeleri için ' + muhurGrubu + ' mühür grubu ' + ders + ' dersine ait ' + soruSayisi + ' soruluk ' + tip + ' yanıtları öğrencilere açıldı.</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Saygılarımızla,<br/>Mitolojix</p>'
                  + '</body></html>'
                });

              }

            }

          });

        });

      });

    },

    'sinavAcVeMuhurAta': function() {
      // TODO: there is some duplication of this code in comment/server/hooks.js
      this.unblock();

      M.C.Kurumlar.find().forEach(function(kurum) {

        var sinavlar = [];
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
        }, {sort: {acilisZamani: 1}}).forEach(function(sinav) {
          var kullanilmisMuhurler = _.pluck(M.C.Sinavlar.find({
            kurum: sinav.kurum,
            egitimYili: sinav.egitimYili,
            ders: sinav.ders,
            sinif: sinav.sinif,
            muhur: {$exists: true}
          },{fields: {muhur: 1}}).fetch(),'muhur');

          var tumMuhurler = _.pluck(M.C.Muhurler.find({
            ders: sinav.ders,
            aktif: true
          },{fields: {_id: 1}}).fetch(), '_id');

          var potansiyelMuhurler = _.difference(tumMuhurler, kullanilmisMuhurler);

          if (potansiyelMuhurler.length > 0) {
            var siradakiMuhur = M.C.Muhurler.find({
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
            var sorunluKurum = M.C.Kurumlar.findOne({_id: sinav.kurum}).isim;
            var sorunluDers = M.C.Dersler.findOne({_id: sinav.ders}).isim;
            var sorunluMuhurGrubu = M.C.Dersler.findOne({_id: sinav.ders}).muhurGrubu.isim;
            var sorunluSinavKodu = sinav.kod;
            var sorunluSubeler = M.L.enumLabel(sinav.sinif) + ' ' + sinav.subeler.join(', ') + ' ' + (sinav.subeler.length > 1 ? 'şubeleri' : 'şubesi');
            var sorunluAcilisZamani = moment(sinav.acilisZamani).format('DD MMMM YYYY HH:mm');
            var sorunluSinavTipi = M.L.enumLabel(sinav.tip);

            M.C.Users.find({role: 'mitolojix'}).forEach(function(user) {
              Email.send({
                to: user.emails[0].address,
                from: '"Mitolojix" <admin@mitolojix.com>',
                subject: 'Sınav öğrencilere açılamadı',
                text: 'Sayın ' + user.name + ' ' + user.lastName + ',\n\n'
                + sorunluKurum + ' ' + sorunluSubeler + ' için ' + sorunluAcilisZamani + ' itibariyle uygulanması gereken ' + sorunluSinavKodu + ' kodlu ' + sorunluDers + ' ' + sorunluSinavTipi + ' için kullanılmak üzere ' + sorunluMuhurGrubu + ' grubunda mühür kalmamış ve sınav öğrencilere açılamamıştır.'
                + '\n\n'
                + 'Sınavın açılabilmesi için sistem yöneticisi tarafından yeni mühür tanımlaması yapılması gerekmektedir.'
                + '\n\n'
                + 'Saygılarımızla,\nMitolojix\n',
                html: '<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>'
                + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sayın ' + user.name + ' ' + user.lastName + ',</p>'
                + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">' + sorunluKurum + ' ' + sorunluSubeler + ' için ' + sorunluAcilisZamani + ' itibariyle uygulanması gereken ' + sorunluSinavKodu + ' kodlu ' + sorunluDers + ' ' + sorunluSinavTipi + ' için kullanılmak üzere ' + sorunluMuhurGrubu + ' grubunda mühür kalmamış ve sınav öğrencilere açılamamıştır.' + '</p>'
                + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sınavın açılabilmesi için sistem yöneticisi tarafından yeni mühür tanımlaması yapılması gerekmektedir.</p>'
                + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Saygılarımızla,<br/>Mitolojix</p>'
                + '</body></html>'
              });
            });

          }

        });

        _.each(sinavlar, function(sinavId) {

          var users = [];

          var sinav = M.C.Sinavlar.findOne({
            _id: sinavId
          });

          // sinavi olusturan ve son guncelleyenini al
          users = _.union(users, [sinav.createdBy]);
          users = !!sinav.updatedBy ? _.union(users, [sinav.updatedBy]) : users;

          // varsa eski versiyonlarin olusturan ve guncelleyenlerini al
          if (sinav._version > 1) {
            sinav.versions().forEach(function(sinav) {
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
          }).forEach(function(user) {
            users = _.union(users, [user._id]);
          });

          // sinava comment etmis kisilerin ogretmen olmayanlarinin kendi kurumlarindan roldaslarini al
          M.C.Comments.find({
            collection: 'Sinavlar',
            doc: sinav._id
          }).forEach(function(comment) {
            var user = M.C.Users.findOne({_id: comment.createdBy});
            if (user.role !== 'ogretmen' && user.role !== 'ogrenci') {
              M.C.Users.find({
                aktif: true,
                kurum: user.kurum,
                role: user.role
              }).forEach(function(user) {
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
          }).forEach(function(user) {
            users = _.union(users, [user._id]);
          });

          users = _.uniq(users);

          _.each(users, function(userId) {

            var user = M.C.Users.findOne({_id: userId});

            if (user) {
              var muhurGrubu = M.C.Dersler.findOne({_id: sinav.ders}).muhurGrubu.isim;
              var ders = M.C.Dersler.findOne({_id: sinav.ders}).isim;
              var muhur = M.C.Muhurler.findOne({_id: sinav.muhur}).isim;
              var muhurURL = M.FS.Muhur.findOne({_id: M.C.Muhurler.findOne({_id: sinav.muhur}).gorsel}).url();
              var sinifSube = M.L.enumLabel(sinav.sinif) + ' ' + sinav.subeler;
              var tip = M.L.enumLabel(sinav.tip);
              var soruSayisi = sinav.sorular.length;
              var sureMetin = sinav.sure + ' dakika içinde tamamlanarak ';
              var sureMetinOgrenci = sinav.sure + ' dakika içinde yanıtlarsan ';
              var acilisZamani = moment(sinav.acilisZamani).format('DD MMMM YYYY HH:mm');
              var kapanisZamani = moment(sinav.kapanisZamani).format('DD MMMM YYYY HH:mm');
              var kurum = user.kurum === 'mitolojix' ? ( M.C.Kurumlar.findOne({_id: sinav.kurum}).isim + ' altında ' ) : '';

              if (user.role === 'ogrenci') {

                Email.send({
                  to: user.emails[0].address,
                  from: '"Mitolojix" <admin@mitolojix.com>',
                  subject: 'Mühür taşına yeni bir mühür eklendi',
                  text: 'Sevgili ' + user.name + ',\n\n'
                  + 'Mitolojix mühür taşına kazanabileceğin yeni bir mühür eklendi.'
                  + '\n\n'
                  + ders + ' dersi mühür sorularını ' + acilisZamani + ' ile ' + kapanisZamani + ' arasında ' + sureMetinOgrenci + muhurGrubu + ' grubuna ait ' + muhur + ' mühürünü kazanabilirsin.'
                  + '\n\n'
                  + 'Oyuna gitmek için ' + Meteor.settings.public.URL.OYUN + ' bağlantısına tıklayabilirsin.'
                  + '\n\n'
                  + 'Başarılar,\nMitolojix\n',
                  html: '<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sevgili ' + user.name + ',</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Mitolojix mühür taşına kazanabileceğin yeni bir mühür eklendi.</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">' + ders + ' dersi mühür sorularını ' + acilisZamani + ' ile ' + kapanisZamani + ' arasında ' + sureMetinOgrenci + muhurGrubu + ' grubuna ait ' + muhur + ' mühürünü kazanabilirsin.</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Oyuna gitmek için mühre tıklayabilirsin.</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333"><a href="' + Meteor.settings.public.URL.OYUN + '" target="_blank"><img src="' + Meteor.settings.public.URL.OYUN + muhurURL + '" style="border-style: none; width: 176px; height: 176px;" alt="' + muhur + '" width="176" height="176"/></a></p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Başarılar,<br/>Mitolojix</p>'
                  + '</body></html>'
                });

              } else {

                Email.send({
                  to: user.emails[0].address,
                  from: '"Mitolojix" <admin@mitolojix.com>',
                  subject: 'Yeni bir sınav açıldı',
                  text: 'Sayın ' + user.name + ' ' + user.lastName + ',\n\n'
                  + 'Mitolojix uygulamasında ' + kurum + sinifSube + ' şubeleri için ' + muhurGrubu + ' mühür grubu ' + ders + ' dersine ait ' + soruSayisi + ' soruluk yeni bir ' + tip + ' açıldı.'
                  + '\n\n'
                  + 'Sınav ' + acilisZamani + ' ile ' + kapanisZamani + ' arasında ' + sureMetin + muhur + ' mühürü kazanılabilir.'
                  + '\n\n'
                  + 'Saygılarımızla,\nMitolojix\n',
                  html: '<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sayın ' + user.name + ' ' + user.lastName + ',</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Mitolojix uygulamasında '+ kurum + sinifSube + ' şubeleri için ' + muhurGrubu + ' mühür grubu ' + ders + ' dersine ait ' + soruSayisi + ' soruluk yeni bir ' + tip + ' açıldı.</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sınav ' + acilisZamani + ' ile ' + kapanisZamani + ' arasında ' + sureMetin + muhur + ' mühürü kazanılabilir.</p>'
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
