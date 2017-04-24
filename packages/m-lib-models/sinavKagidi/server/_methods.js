import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { _ } from 'meteor/underscore';

import { getSlug } from 'meteor/ongoworks:speakingurl';

import { M } from 'meteor/m:lib-core';


Meteor.methods({
  'sinavaBasla'(args) {
    check(args, {
      sinavId: String,
      userId: Match.Optional(String),
      ogrenciSinavaGirdi: Match.Optional(Boolean)
    });

    const sinavId = args.sinavId;
    const user = args.userId ? M.C.Users.findOne({_id: args.userId}) : Meteor.user();
    const ogrenciSinavaGirdi = _.has(args, 'ogrenciSinavaGirdi') ? args.ogrenciSinavaGirdi : true;

    if (!user || user.role!=='ogrenci') {
      M.L.ThrowError({error: '403', reason: 'Yetki yok', details: 'Yetki yok'})
    }

    let sinav;

    const {
      kurum,
      sinif,
      sube: subeler,
    } = user;

    if (ogrenciSinavaGirdi === false) {
      sinav = M.C.Sinavlar.findOne({_id: sinavId});
    } else {
      sinav = M.C.Sinavlar.findOne({
        _id: sinavId,
        kurum,
        taslak: false,
        aktif: true,
        iptal: false,
        muhur: {$exists: true},
        sinif,
        subeler,
        egitimYili: M.C.AktifEgitimYili.findOne().egitimYili,
        acilisZamani: {$lt: new Date()},
        kapanisZamani: {$gt: new Date()}
      });
    }

    if (!sinav) {
      M.L.ThrowError({error: '404', reason: 'Sınav yok', details: 'Bu sınav girişe uygun değil'})
    }

    const bitmemisSinavKagidi = M.C.SinavKagitlari.findOne({
      ogrenci: user._id,
      bitirmeZamani: {$exists: false}
    });

    if (bitmemisSinavKagidi && ogrenciSinavaGirdi === true) {
      M.L.ThrowError({error: '500', reason: 'Aynı anda tek sınav yapılabilir', details: 'Devam eden başka bir sınav var'})
    }

    const sinavKagidi = M.C.SinavKagitlari.findOne({
      ogrenci: user._id,
      sinav: sinavId
    });

    if (sinavKagidi) {
      M.L.ThrowError({error: '500', reason: 'Sınava zaten başlanmış', details: 'Sınava zaten başlanmış'})
    }

    const sorular = _.pluck(sinav.sorular, 'soruId');
    let yanitlar = [];

    sorular.forEach(soruId => {
      let yanit;
      const soru = M.C.Sorular.findOne({_id: soruId});
      if (soru) {

        if (soru.tip === 'dogruYanlis') {
          yanit = {
            cevap: null
          }
        }

        if (soru.tip === 'coktanTekSecmeli') {
          yanit = {
            secenekler: _.shuffle(soru.yanit.coktanTekSecmeli.map((secenek,sIx) => {
              const {
                secenekMetin,
                secenekGorsel,
              } = secenek;
              return {
                secenekMetin,
                secenekGorsel,
                dogru: false
              };
            }))
          }
        }

        if (soru.tip === 'coktanCokSecmeli') {
          yanit = {
            secenekler: _.shuffle(soru.yanit.coktanCokSecmeli.map(secenek => {
              const {
                secenekMetin,
                secenekGorsel,
              } = secenek;
              return {
                secenekMetin,
                secenekGorsel,
                dogru: false
              };
            }))
          }
        }

        if (soru.tip === 'siralama') {
          const hashOriginal = soru.yanit.siralama.map(secenek => secenek.metin).join('')

          let shuffledArray = []
          let hashShuffled = []

          do{
            shuffledArray = _.shuffle(soru.yanit.siralama.map(secenek => {
              const {
                metin,
                gorsel,
              } = secenek;
              return {
                metin,
                gorsel,
              };
            }))
            hashShuffled = shuffledArray.map(secenek => {
              return secenek.metin
            }).join('')
          }
          while(hashOriginal === hashShuffled)

          yanit = {
            secenekler: shuffledArray.map(secenek => {
              const {
                metin,
                gorsel,
              } = secenek;
              return {
                metin,
                gorsel,
              };
            })
          }
        }

        if (soru.tip === 'eslestirme') {
          let eslestirArray = [];
          const eslestirLength = soru.yanit.eslestirme.length;
          for(let i = 0; i < eslestirLength; i++) {
            eslestirArray.push([i,i]);
          }
          yanit = {
            sol: _.shuffle(soru.yanit.eslestirme.map(secenek => {
              const {
                solMetin: metin,
                solGorsel: gorsel,
              } = secenek;
              return {
                metin,
                gorsel,
              }
            })),
            sag: _.shuffle(soru.yanit.eslestirme.map(secenek => {
              const {
                sagMetin: metin,
                sagGorsel: gorsel,
              } = secenek;
              return {
                metin,
                gorsel,
              }
            })),
            eslestirme: eslestirArray
          }
        }

        if (soru.tip === 'boslukDoldurma') {
          let boslukArray = [];
          let bosluklar;
          const boslukLength = soru.yanit.boslukDoldurma.cevap.match(/\[(.+?)\]/g).length;
          for(let i = 0; i < boslukLength; i++) {
            boslukArray.push('');
          }
          let boslukIndex = 0;
          bosluklar = '<p>' + splitOnNewlines(soru.yanit.boslukDoldurma.cevap.replace(/\[(.+?)\]/g, () => {
              return "<input type=\"text\" id=\""+ boslukIndex++ +"\" maxlength=\"40\" size=\"8\" class=\"boslukDoldurSecenek\"/>";
            })).join('</p><p>') + '</p>';
          yanit = {
            bosluklar,
            cevaplar: boslukArray
          }
        }

        if (yanit) {
          yanitlar.push({
            soruId,
            yanit,
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
      ogrenciSinavaGirdi,
      yanitlar,
    });

    return 'OK';

  },
  'sinaviBitir'(args) {
    check(args, {
      sinavKagidiId: String,
      userId: Match.Optional(String),
      iptal: Match.Optional(Boolean)
    });

    let dogruPuan;

    const sinavKagidiId = args.sinavKagidiId;
    const user = args.userId ? M.C.Users.findOne({_id: args.userId}) : Meteor.user();
    const iptal = _.has(args, 'iptal') ? args.iptal : false;

    if (!user || user.role!=='ogrenci') {
      M.L.ThrowError({error: '403', reason: 'Yetki yok', details: 'Yetki yok'})
    }

    const sinavKagidi = M.C.SinavKagitlari.findOne({
      _id: sinavKagidiId,
      ogrenci: user._id,
      bitirmeZamani: {$exists: false}
    });

    if (!sinavKagidi) {
      M.L.ThrowError({error: '403', reason: 'Sınav yok veya zaten kapanmış', details: 'Sınav yok veya zaten kapanmış'})
    }

    if (sinavKagidi.tip === 'alistirma') {
      dogruPuan = _.where(sinavKagidi.yanitlar, {dogru: true}).reduce((memo,yanit) => {
        return math.chain(memo).add(math.chain(yanit.puan).divide(parseInt(yanit.yanitlandi)).round().done()).done()
      }, 0);
    } else {
      dogruPuan = _.where(sinavKagidi.yanitlar, {dogru: true}).reduce((memo,yanit) => {
        return math.chain(memo).add(yanit.puan).done()
      }, 0);
    }

    let puanOrtalamayaGirdi = false;
    if (_.contains(['alistirma','konuTarama'], sinavKagidi.tip)) {
      puanOrtalamayaGirdi = true;
    }

    M.C.SinavKagitlari.update({
      _id: sinavKagidiId,
      ogrenci: user._id,
      bitirmeZamani: {$exists: false}
    },{
      $set: {
        iptal,
        bitirmeZamani: new Date(),
        puan: dogruPuan,
        puanOrtalamayaGirdi,
      }
    });

    Meteor.call('ortalamaGuncelle', user._id);

    return 'OK';

  },
  'ortalamaGuncelle'(userId) {
    check(userId, String);
    const aktifEgitimYili = M.C.AktifEgitimYili.findOne().egitimYili;
    let ortalamaPuan = M.C.SinavKagitlari.aggregate([
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
  'soruYanitla'(sinavKagidiId,yanitIndex,yanit) {
    check(sinavKagidiId, String);
    check(yanitIndex, Match.Integer);
    // TODO: We are going to sanitize this below! We can write a complex Match.Where but it is not that necessary
    check(yanit, Match.Any);

    const user = Meteor.user();

    if (!user || user.role!=='ogrenci') {
      M.L.ThrowError({error: '403', reason: 'Yetki yok', details: 'Yetki yok'})
    }

    const sinavKagidi = M.C.SinavKagitlari.findOne({
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

    const kayitliYanit = sinavKagidi.yanitlar[yanitIndex];
    const yanitlanmaSayisi = parseInt(sinavKagidi.yanitlar[yanitIndex].yanitlandi);
    const zatenDogruyduVeAlistirmaTesti = sinavKagidi.yanitlar[yanitIndex].dogru === true && sinavKagidi.tip === 'alistirma';

    const dogruYanit = M.C.Sorular.findOne({_id: kayitliYanit.soruId}).yanit;

    let dogru = false;

    if (kayitliYanit.tip === 'dogruYanlis') {
      check(yanit, {
        cevap: Boolean
      });

      if (dogruYanit.dogruYanlis.cevap === yanit.cevap) {
        dogru = true;
      }

      let setter = {};

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

      const dogruHash = dogruYanit.coktanTekSecmeli.map(secenek => {
        return (secenek.secenekMetin?secenek.secenekMetin:'')+''+(secenek.secenekGorsel?secenek.secenekGorsel:'')+''+secenek.dogru;
      });

      const yanitHash = yanit.secenekler.map(secenek => {
        return (secenek.secenekMetin?secenek.secenekMetin:'')+''+(secenek.secenekGorsel?secenek.secenekGorsel:'')+''+secenek.dogru;
      });

      if (M.L.ArraysEqual(dogruHash,yanitHash)) {
        dogru = true;
      }

      let setter = {};

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

      const dogruHash = dogruYanit.coktanCokSecmeli.map(secenek => {
        return (secenek.secenekMetin?secenek.secenekMetin:'')+''+(secenek.secenekGorsel?secenek.secenekGorsel:'')+''+secenek.dogru;
      });

      const yanitHash = yanit.secenekler.map(secenek => {
        return (secenek.secenekMetin?secenek.secenekMetin:'')+''+(secenek.secenekGorsel?secenek.secenekGorsel:'')+''+secenek.dogru;
      });

      if (M.L.ArraysEqual(dogruHash,yanitHash)) {
        dogru = true;
      }

      let setter = {};

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

      const dogruHash = dogruYanit.siralama.map(secenek => {
        return (secenek.metin?secenek.metin:'')+''+(secenek.gorsel?secenek.gorsel:'')+'';
      });

      const yanitHash = yanit.secenekler.map(secenek => {
        return (secenek.metin?secenek.metin:'')+''+(secenek.gorsel?secenek.gorsel:'')+'';
      });

      if (_.isEqual(dogruHash,yanitHash)) {
        dogru = true;
      }

      let setter = {};

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

      const dogruHash = dogruYanit.eslestirme.map(secenek => {
        return (secenek.solMetin?secenek.solMetin:'')
          +''
          +(secenek.solGorsel?secenek.solGorsel:'')
          +''
          +(secenek.sagMetin?secenek.sagMetin:'')
          +''
          +(secenek.sagGorsel?secenek.sagGorsel:'');
      });

      const yanitHash = yanit.eslestirme.map(eslesme => {
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

      let setter = {};

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

      let dogruHash = dogruYanit.boslukDoldurma.cevap.match(/\[(.+?)\]/g).map(cevap => {
        return cevap.replace(/\[(.+?)\]/g, "$1")
      });

      let yanitHash = yanit.cevaplar;

      if (dogruYanit.boslukDoldurma.toleransBuyukKucukHarf === true) {
        dogruHash = dogruHash.map(cevap => {
          return cevap.toLocaleLowerCase();
        });
        yanitHash = yanitHash.map(cevap => {
          return cevap.toLocaleLowerCase();
        });
      }

      if (dogruYanit.boslukDoldurma.toleransTurkce === true) {
        dogruHash = dogruHash.map(cevap => {
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
        yanitHash = yanitHash.map(cevap => {
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

      dogru = _.every(dogruHash, (dogruCevap,ix) => {
        return s.levenshtein(dogruCevap, yanitHash[ix]) <= dogruYanit.boslukDoldurma.toleransKarakter
      });

      let setter = {};

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
  'sonMuhur'() {
    const user = Meteor.user();

    if (user && user.role === 'ogrenci') {
      const {
        _id: ogrenci,
        kurum,
        sinif,
      } = user;
      const sinavKagidi = M.C.SinavKagitlari.find({
        ogrenci,
        iptal: false,
        kurum,
        sinif,
        egitimYili: M.C.AktifEgitimYili.findOne().egitimYili
      }, {sort: {bitirmeZamani: -1}, limit: 1}).fetch()[0];

      const muhur =  sinavKagidi && M.C.Sinavlar.findOne({_id: sinavKagidi.sinav}).muhur;

      return muhur && M.C.Muhurler.findOne({_id: muhur}).gorsel;

    }

    return false;
  }
});
