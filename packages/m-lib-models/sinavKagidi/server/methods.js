Meteor.methods({
  'sinavaBasla': function(args) {
    check(args, {
      sinavId: String,
      userId: Match.Optional(String),
      ogrenciSinavaGirdi: Match.Optional(Boolean)
    });

    var sinavId = args.sinavId;
    var user = args.userId ? M.C.Users.findOne({_id: args.userId}) : Meteor.user();
    var ogrenciSinavaGirdi = _.has(args, 'ogrenciSinavaGirdi') ? args.ogrenciSinavaGirdi : true;

    if (!user || user.role!=='ogrenci') {
      M.L.ThrowError({error: '403', reason: 'Yetki yok', details: 'Yetki yok'})
    }

    var sinav;

    if (ogrenciSinavaGirdi === false) {
      sinav = M.C.Sinavlar.findOne({_id: sinavId});
    } else {
      sinav = M.C.Sinavlar.findOne({
        _id: sinavId,
        kurum: user.kurum,
        taslak: false,
        aktif: true,
        iptal: false,
        muhur: {$exists: true},
        sinif: user.sinif,
        subeler: user.sube,
        egitimYili: M.C.AktifEgitimYili.findOne().egitimYili,
        acilisZamani: {$lt: new Date()},
        kapanisZamani: {$gt: new Date()}
      });
    }

    if (!sinav) {
      M.L.ThrowError({error: '404', reason: 'Sınav yok', details: 'Bu sınav girişe uygun değil'})
    }

    var bitmemisSinavKagidi = M.C.SinavKagitlari.findOne({
      ogrenci: user._id,
      bitirmeZamani: {$exists: false}
    });

    if (bitmemisSinavKagidi && ogrenciSinavaGirdi === true) {
      M.L.ThrowError({error: '500', reason: 'Aynı anda tek sınav yapılabilir', details: 'Devam eden başka bir sınav var'})
    }

    var sinavKagidi = M.C.SinavKagitlari.findOne({
      ogrenci: user._id,
      sinav: sinavId
    });

    if (sinavKagidi) {
      M.L.ThrowError({error: '500', reason: 'Sınava zaten başlanmış', details: 'Sınava zaten başlanmış'})
    }

    var sorular = _.pluck(sinav.sorular, 'soruId');
    var yanitlar = [];

    _.each(sorular, function(soruId) {
      var yanit;
      var soru = M.C.Sorular.findOne({_id: soruId});
      if (soru) {

        if (soru.tip === 'dogruYanlis') {
          yanit = {
            cevap: null
          }
        }

        if (soru.tip === 'coktanTekSecmeli') {
          yanit = {
            secenekler: _.shuffle(_.map(soru.yanit.coktanTekSecmeli, function(secenek,sIx) {
              return {
                secenekMetin: secenek.secenekMetin,
                secenekGorsel: secenek.secenekGorsel,
                dogru: false
              };
            }))
          }
        }

        if (soru.tip === 'coktanCokSecmeli') {
          yanit = {
            secenekler: _.shuffle(_.map(soru.yanit.coktanCokSecmeli, function(secenek) {
              return {
                secenekMetin: secenek.secenekMetin,
                secenekGorsel: secenek.secenekGorsel,
                dogru: false
              };
            }))
          }
        }

        if (soru.tip === 'siralama') {
          yanit = {
            secenekler: _.shuffle(_.map(soru.yanit.siralama, function(secenek) {
              return {
                metin: secenek.metin,
                gorsel: secenek.gorsel
              };
            }))
          }
        }

        if (soru.tip === 'eslestirme') {
          var eslestirArray = [];
          var eslestirLength = soru.yanit.eslestirme.length;
          for(var i = 0; i < eslestirLength; i++) {
            eslestirArray.push([i,i]);
          }
          yanit = {
            sol: _.shuffle(_.map(soru.yanit.eslestirme, function(secenek) {
              return {
                metin: secenek.solMetin,
                gorsel: secenek.solGorsel
              }
            })),
            sag: _.shuffle(_.map(soru.yanit.eslestirme, function(secenek) {
              return {
                metin: secenek.sagMetin,
                gorsel: secenek.sagGorsel
              }
            })),
            eslestirme: eslestirArray
          }
        }

        if (soru.tip === 'boslukDoldurma') {
          var boslukArray = [];
          var bosluklar;
          var boslukLength = soru.yanit.boslukDoldurma.cevap.match(/\[(.+?)\]/g).length;
          for(var i = 0; i < boslukLength; i++) {
            boslukArray.push('');
          }
          var boslukIndex = 0;
          bosluklar = '<p>' + splitOnNewlines(soru.yanit.boslukDoldurma.cevap.replace(/\[(.+?)\]/g, function () {
            return "<input type=\"text\" id=\""+ boslukIndex++ +"\" maxlength=\"40\" size=\"8\" class=\"boslukDoldurSecenek\"/>";
          })).join('</p><p>') + '</p>';
          yanit = {
            bosluklar: bosluklar,
            cevaplar: boslukArray
          }
        }

        if (yanit) {
          yanitlar.push({
            soruId: soruId,
            yanit: yanit
          });
        }
      }
    });

    if (sinav.sorularKarissin) {
      yanitlar = _.shuffle(yanitlar);
    }

    M.C.SinavKagitlari.insert({
      sinav: sinavId,
      ogrenci: user._id,
      ogrenciSinavaGirdi: ogrenciSinavaGirdi,
      yanitlar: yanitlar
    });

    return 'OK';

  },
  'sinaviBitir': function(args) {
    check(args, {
      sinavKagidiId: String,
      userId: Match.Optional(String),
      iptal: Match.Optional(Boolean)
    });

    var dogruPuan;

    var sinavKagidiId = args.sinavKagidiId;
    var user = args.userId ? M.C.Users.findOne({_id: args.userId}) : Meteor.user();
    var iptal = _.has(args, 'iptal') ? args.iptal : false;

    if (!user || user.role!=='ogrenci') {
      M.L.ThrowError({error: '403', reason: 'Yetki yok', details: 'Yetki yok'})
    }

    var sinavKagidi = M.C.SinavKagitlari.findOne({
      _id: sinavKagidiId,
      ogrenci: user._id,
      bitirmeZamani: {$exists: false}
    });

    if (!sinavKagidi) {
      M.L.ThrowError({error: '403', reason: 'Sınav yok veya zaten kapanmış', details: 'Sınav yok veya zaten kapanmış'})
    }

    if (sinavKagidi.tip === 'alistirma') {
      dogruPuan = _.reduce(_.where(sinavKagidi.yanitlar, {dogru: true}), function(memo,yanit) {
        return math.chain(memo).add(math.chain(yanit.puan).divide(parseInt(yanit.yanitlandi)).round().done()).done()
      }, 0);
    } else {
      dogruPuan = _.reduce(_.where(sinavKagidi.yanitlar, {dogru: true}), function(memo,yanit) {
        return math.chain(memo).add(yanit.puan).done()
      }, 0);
    }

    var puanOrtalamayaGirdi = false;
    if (_.contains(['alistirma','konuTarama'], sinavKagidi.tip)) {
      puanOrtalamayaGirdi = true;
    }

    M.C.SinavKagitlari.update({
      _id: sinavKagidiId,
      ogrenci: user._id,
      bitirmeZamani: {$exists: false}
    },{
      $set: {
        iptal: iptal,
        bitirmeZamani: new Date(),
        puan: dogruPuan,
        puanOrtalamayaGirdi: puanOrtalamayaGirdi
      }
    });

    Meteor.call('ortalamaGuncelle', user._id);

    return 'OK';

  },
  'ortalamaGuncelle': function(userId) {
    check(userId, String);
    var aktifEgitimYili = M.C.AktifEgitimYili.findOne().egitimYili;
    var ortalamaPuan = M.C.SinavKagitlari.aggregate([
      {
        $match:
        {
          puanOrtalamayaGirdi: true,
          ogrenci: userId,
          egitimYili: aktifEgitimYili,
          iptal: false
        }
      },
      {
        $group:
        {
          _id: null,
          ortalamaPuan: { $avg: "$puan" }
        }
      }
    ])[0];
    ortalamaPuan = !!ortalamaPuan ? math.chain(ortalamaPuan.ortalamaPuan).round().done() : 0;

    M.C.Users._collection.update({_id: userId},{
      $set: {puan: ortalamaPuan}
    });

    return 'OK';
  },
  'soruYanitla': function(sinavKagidiId,yanitIndex,yanit) {
    check(sinavKagidiId, String);
    check(yanitIndex, Match.Integer);
    // TODO: We are going to sanitize this below! We can write a complex Match.Where but it is not that necessary
    check(yanit, Match.Any);

    var user = Meteor.user();

    if (!user || user.role!=='ogrenci') {
      M.L.ThrowError({error: '403', reason: 'Yetki yok', details: 'Yetki yok'})
    }

    var sinavKagidi = M.C.SinavKagitlari.findOne({
      _id: sinavKagidiId,
      ogrenci: user._id,
      bitirmeZamani: {$exists: false}
    });

    if (!sinavKagidi) {
      M.L.ThrowError({error: '500', reason: 'Sınav yok veya zaten bitmiş', details: 'Sınav yok veya zaten bitmiş'})
    }

    if (sinavKagidi.yanitlar.length < yanitIndex + 1) {
      M.L.ThrowError({error: '500', reason: 'Index hatalı', details: 'Sınavda bu kadar çok soru yok'})
    }

    var kayitliYanit = sinavKagidi.yanitlar[yanitIndex];
    var yanitlanmaSayisi = parseInt(sinavKagidi.yanitlar[yanitIndex].yanitlandi);
    var zatenDogruyduVeAlistirmaTesti = sinavKagidi.yanitlar[yanitIndex].dogru === true && sinavKagidi.tip === 'alistirma';

    var dogruYanit = M.C.Sorular.findOne({_id: kayitliYanit.soruId}).yanit;

    var dogru = false;

    if (kayitliYanit.tip === 'dogruYanlis') {
      check(yanit, {
        cevap: Boolean
      });

      if (dogruYanit.dogruYanlis.cevap === yanit.cevap) {
        dogru = true;
      }

      var setter = {};

      setter['yanitlar.'+yanitIndex+'.yanit.cevap'] = yanit.cevap;
      setter['yanitlar.'+yanitIndex+'.yanitlandi'] = zatenDogruyduVeAlistirmaTesti ? yanitlanmaSayisi : (yanitlanmaSayisi + 1);
      setter['yanitlar.'+yanitIndex+'.dogru'] = dogru;

      M.C.SinavKagitlari.update({
        _id: sinavKagidiId,
        ogrenci: user._id,
        bitirmeZamani: {$exists: false}
      }, {
        $set: setter
      })

    }


    if (kayitliYanit.tip === 'coktanTekSecmeli') {
      check(yanit, {
        secenekler: [Object]
      });

      var dogruHash = _.map(dogruYanit.coktanTekSecmeli, function(secenek) {
        return (secenek.secenekMetin?secenek.secenekMetin:'')+''+(secenek.secenekGorsel?secenek.secenekGorsel:'')+''+secenek.dogru;
      });

      var yanitHash = _.map(yanit.secenekler, function(secenek) {
        return (secenek.secenekMetin?secenek.secenekMetin:'')+''+(secenek.secenekGorsel?secenek.secenekGorsel:'')+''+secenek.dogru;
      });

      if (M.L.ArraysEqual(dogruHash,yanitHash)) {
        dogru = true;
      }

      var setter = {};

      setter['yanitlar.'+yanitIndex+'.yanit.secenekler'] = yanit.secenekler;
      setter['yanitlar.'+yanitIndex+'.yanitlandi'] = zatenDogruyduVeAlistirmaTesti ? yanitlanmaSayisi : (yanitlanmaSayisi + 1);
      setter['yanitlar.'+yanitIndex+'.dogru'] = dogru;

      M.C.SinavKagitlari.update({
        _id: sinavKagidiId,
        ogrenci: user._id,
        bitirmeZamani: {$exists: false}
      }, {
        $set: setter
      })

    }

    if (kayitliYanit.tip === 'coktanCokSecmeli') {
      check(yanit, {
        secenekler: [Object]
      });

      var dogruHash = _.map(dogruYanit.coktanCokSecmeli, function(secenek) {
        return (secenek.secenekMetin?secenek.secenekMetin:'')+''+(secenek.secenekGorsel?secenek.secenekGorsel:'')+''+secenek.dogru;
      });

      var yanitHash = _.map(yanit.secenekler, function(secenek) {
        return (secenek.secenekMetin?secenek.secenekMetin:'')+''+(secenek.secenekGorsel?secenek.secenekGorsel:'')+''+secenek.dogru;
      });

      if (M.L.ArraysEqual(dogruHash,yanitHash)) {
        dogru = true;
      }

      var setter = {};

      setter['yanitlar.'+yanitIndex+'.yanit.secenekler'] = yanit.secenekler;
      setter['yanitlar.'+yanitIndex+'.yanitlandi'] = zatenDogruyduVeAlistirmaTesti ? yanitlanmaSayisi : (yanitlanmaSayisi + 1);
      setter['yanitlar.'+yanitIndex+'.dogru'] = dogru;

      M.C.SinavKagitlari.update({
        _id: sinavKagidiId,
        ogrenci: user._id,
        bitirmeZamani: {$exists: false}
      }, {
        $set: setter
      })

    }

    if (kayitliYanit.tip === 'siralama') {
      check(yanit, {
        secenekler: [Object]
      });

      var dogruHash = _.map(dogruYanit.siralama, function(secenek) {
        return (secenek.metin?secenek.metin:'')+''+(secenek.gorsel?secenek.gorsel:'')+'';
      });

      var yanitHash = _.map(yanit.secenekler, function(secenek) {
        return (secenek.metin?secenek.metin:'')+''+(secenek.gorsel?secenek.gorsel:'')+'';
      });

      if (_.isEqual(dogruHash,yanitHash)) {
        dogru = true;
      }

      var setter = {};

      setter['yanitlar.'+yanitIndex+'.yanit.secenekler'] = yanit.secenekler;
      setter['yanitlar.'+yanitIndex+'.yanitlandi'] = zatenDogruyduVeAlistirmaTesti ? yanitlanmaSayisi : (yanitlanmaSayisi + 1);
      setter['yanitlar.'+yanitIndex+'.dogru'] = dogru;

      M.C.SinavKagitlari.update({
        _id: sinavKagidiId,
        ogrenci: user._id,
        bitirmeZamani: {$exists: false}
      }, {
        $set: setter
      })

    }

    if (kayitliYanit.tip === 'eslestirme') {
      check(yanit, {
        eslestirme: [[Match.Integer]]
      });

      var dogruHash = _.map(dogruYanit.eslestirme, function(secenek) {
        return (secenek.solMetin?secenek.solMetin:'')
          +''
          +(secenek.solGorsel?secenek.solGorsel:'')
          +''
          +(secenek.sagMetin?secenek.sagMetin:'')
          +''
          +(secenek.sagGorsel?secenek.sagGorsel:'');
      });

      var yanitHash = _.map(yanit.eslestirme, function(eslesme) {
        return (kayitliYanit.yanit.sol[eslesme[0]].metin?kayitliYanit.yanit.sol[eslesme[0]].metin:'')
          +''
          +(kayitliYanit.yanit.sol[eslesme[0]].gorsel?kayitliYanit.yanit.sol[eslesme[0]].gorsel:'')
          +''
          +(kayitliYanit.yanit.sag[eslesme[1]].metin?kayitliYanit.yanit.sag[eslesme[1]].metin:'')
          +''
          +(kayitliYanit.yanit.sag[eslesme[1]].gorsel?kayitliYanit.yanit.sag[eslesme[1]].gorsel:'');
      });

      if (M.L.ArraysEqual(dogruHash,yanitHash)) {
        dogru = true;
      }

      var setter = {};

      setter['yanitlar.'+yanitIndex+'.yanit.eslestirme'] = yanit.eslestirme;
      setter['yanitlar.'+yanitIndex+'.yanitlandi'] = zatenDogruyduVeAlistirmaTesti ? yanitlanmaSayisi : (yanitlanmaSayisi + 1);
      setter['yanitlar.'+yanitIndex+'.dogru'] = dogru;

      M.C.SinavKagitlari.update({
        _id: sinavKagidiId,
        ogrenci: user._id,
        bitirmeZamani: {$exists: false}
      }, {
        $set: setter
      })

    }

    if (kayitliYanit.tip === 'boslukDoldurma') {
      check(yanit, {
        cevaplar: [String]
      });

      var dogruHash = dogruYanit.boslukDoldurma.cevap.match(/\[(.+?)\]/g).map(function(cevap) {
        return cevap.replace(/\[(.+?)\]/g, "$1")
      });

      var yanitHash = yanit.cevaplar;

      if (dogruYanit.boslukDoldurma.toleransBuyukKucukHarf === true) {
        dogruHash = _.map(dogruHash, function(cevap) {
          return cevap.toLocaleLowerCase();
        });
        yanitHash = _.map(yanitHash, function(cevap) {
          return cevap.toLocaleLowerCase();
        });
      }

      if (dogruYanit.boslukDoldurma.toleransTurkce === true) {
        dogruHash = _.map(dogruHash, function(cevap) {
          //TODO: slug kullanma, doğrudan türkçe harf çevrimi yap
          return getSlug(cevap, {
            separator: '',
            lang: 'tr',
            symbols: false,
            maintainCase: true,
            uric: true,
            mark: true
          });
        });
        yanitHash = _.map(yanitHash, function(cevap) {
          //TODO: slug kullanma, doğrudan türkçe harf çevrimi yap
          return getSlug(cevap, {
            separator: '',
            lang: 'tr',
            symbols: false,
            maintainCase: true,
            uric: true,
            mark: true
          });
        });
      }

      dogru = _.every(dogruHash, function(dogruCevap,ix) {
        return s.levenshtein(dogruCevap, yanitHash[ix]) <= dogruYanit.boslukDoldurma.toleransKarakter
      });

      var setter = {};

      setter['yanitlar.'+yanitIndex+'.yanit.cevaplar'] = yanit.cevaplar;
      setter['yanitlar.'+yanitIndex+'.yanitlandi'] = zatenDogruyduVeAlistirmaTesti ? yanitlanmaSayisi : (yanitlanmaSayisi + 1);
      setter['yanitlar.'+yanitIndex+'.dogru'] = dogru;

      M.C.SinavKagitlari.update({
        _id: sinavKagidiId,
        ogrenci: user._id,
        bitirmeZamani: {$exists: false}
      }, {
        $set: setter
      }, {
        removeEmptyStrings: false
      })

    }

    return 'OK';

  },
  'sonMuhur': function() {
    var user = Meteor.user();

    if (user && user.role === 'ogrenci') {
      var sinavKagidi = M.C.SinavKagitlari.find({
        ogrenci: user._id,
        iptal: false,
        kurum: user.kurum,
        sinif: user.sinif,
        egitimYili: M.C.AktifEgitimYili.findOne().egitimYili
      }, {sort: {bitirmeZamani: -1}, limit: 1}).fetch()[0];

      var muhur =  sinavKagidi && M.C.Sinavlar.findOne({_id: sinavKagidi.sinav}).muhur;

      return muhur && M.C.Muhurler.findOne({_id: muhur}).gorsel;

    }

    return false;
  }
});
