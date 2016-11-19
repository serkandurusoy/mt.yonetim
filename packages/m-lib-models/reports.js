import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';

import { M } from 'meteor/m:lib-core';

const numericSort = array => {
  return array
    .slice()
    .sort((a, b) => a - b);
};

const mode = (x) => {
  if (x.length === 0) { return null; }
  else if (x.length === 1) { return x[0]; }
  const sorted = numericSort(x);
  let last = sorted[0],
    value,
    maxSeen = 0,
    seenThis = 1;
  for (let i = 1; i < sorted.length + 1; i++) {
    if (sorted[i] !== last) {
      if (seenThis > maxSeen) {
        maxSeen = seenThis;
        value = last;
      }
      seenThis = 1;
      last = sorted[i];
    } else { seenThis++; }
  }
  return value;
};

const statFormat = v => {
  return math.format(v, {notation: 'fixed', precision: 2})
};

Meteor.methods({
  'raporInit'(sinavId) {
    check(sinavId, String);

    const currentUser = M.C.Users.findOne({_id: this.userId});
    const sinav = currentUser && M.C.Sinavlar.findOne({_id: sinavId});
    const sinavKagitlari = sinav && M.C.SinavKagitlari.find({sinav: sinavId, ogrenciSinavaGirdi: true}, {sort: {puan: -1, dogumTarihi: -1, nameCollage: 1, lastNameCollate: 1, cinsiyet: -1}})
                                                      .map((sinavKagidi,ix) => {
                                                        sinavKagidi.sira = ix + 1;
                                                        return sinavKagidi;
                                                      });
    const kurum = sinav && M.C.Kurumlar.findOne({_id: sinav.kurum});
    let tumYanitlar, kagitSayisi, soruSayisi, tumYanitlarSayisi, dogruYanitSayisi, dogruYanitSayiListesi, sortedSinavKagitlari;

    if (!currentUser || M.L.userHasRole(currentUser._id, 'ogrenci')) {
      M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
    }

    if (!M.L.userHasRole(currentUser._id, 'mitolojix')) {
      if (currentUser.kurum !== sinav.kurum) {
        M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
      }
    }

    if (!sinav) {
      M.L.ThrowError({error:'404',reason:'Sınav bulunamadı',details:'Sınav bulunamadı'});
    }

    if (M.L.userHasRole(currentUser._id, 'ogretmen')) {
      if (!_.contains(currentUser.dersleri, sinav.ders)) {
        M.L.ThrowError({error:'503',reason:'Yetki yok',details:'Yetki yok'});
      }
    }

    if (!sinavKagitlari || sinavKagitlari.length < 1) {
      M.L.ThrowError({error:'404',reason:'Sınav kağıdı bulunamadı',details:'Sınav kağıdı bulunamadı'});
    }

    sortedSinavKagitlari = sinavKagitlari.map(sinavKagidi => {
      const sorular = _.pluck(sinav.sorular, 'soruId');
      const yanitlar = sinavKagidi.yanitlar;

      let yeniYanitlar = [];

      sorular.forEach(soruId => {
        yeniYanitlar.push(_.findWhere(yanitlar, {soruId}))
      });

      sinavKagidi.yanitlar = yeniYanitlar;

      return sinavKagidi;
    });


    tumYanitlar = _.flatten(_.pluck(sortedSinavKagitlari, 'yanitlar'));
    kagitSayisi = sortedSinavKagitlari.length || 0;
    soruSayisi = sinav.sorular.length || 0;
    tumYanitlarSayisi = tumYanitlar.length || 0;
    dogruYanitSayisi = _.where(tumYanitlar, {dogru: true}).length || 0;
    dogruYanitSayiListesi = sortedSinavKagitlari.map(sinavKagidi => {
      return _.where(sinavKagidi.yanitlar, {dogru: true}).length || 0
    });

    return {
      data: {
        sinav,
        sinavKagitlari: sortedSinavKagitlari,
        tumYanitlar,
      },
      meta: {
        raporTarihi: moment().format('DD.MM.YYYY'),
        kurum: kurum.isim,
        logo: M.FS.KurumLogo.findOne({_id: kurum.logo}).url(),
        egitimYili: sinav.egitimYili,
        kod: sinav.kod,
        ders: M.C.Dersler.findOne({_id: sinav.ders}).isim,
        sinif: M.L.enumLabel(sinav.sinif) + ' ' + sinav.subeler,
        sinifKisa: sinav.sinif.slice(1),
        tip: M.L.enumLabel(sinav.tip),
        aciklama: sinav.aciklama || '',
        testTarihi: moment(sinav.acilisTarihi).format('DD.MM.YYYY'),
        sure: sinav.sure ? (sinav.sure + 'dk') : 'Süresiz'
      },
      stats: {
        stdSapma: statFormat(math.std(dogruYanitSayiListesi)),
        medyan: statFormat(math.median(dogruYanitSayiListesi)),
        ranj: statFormat(math.chain(math.max(dogruYanitSayiListesi)).subtract(math.min(dogruYanitSayiListesi)).done()),
        mode: statFormat(mode(dogruYanitSayiListesi)),
        kagitSayisi,
        soruSayisi,
        tumYanitlarSayisi,
        dogruYanitSayisi,
        ortalamaDY: statFormat(math.chain(dogruYanitSayisi).divide(tumYanitlarSayisi).multiply(soruSayisi).done()),
        zorluk: statFormat(math.chain(math.sum(_.pluck(sinav.sorular, 'zorlukDerecesi'))).divide(soruSayisi).done())
      }
    };

  },
  'testCeldiriciAnalizi'(sinavId) {
    check(sinavId, String);
    this.unblock();

    const {
      data,
      meta,
      stats,
    } = Meteor.call('raporInit', sinavId);

    const report = _.pluck(data.sinav.sorular, 'soruId').map(soruId => {
      const soru = M.C.Sorular.findOne({_id: soruId});
      const tumSayi = _.where(data.tumYanitlar, {soruId}).length || 0;
      const dogruSayi = _.where(data.tumYanitlar, {dogru: true, soruId}).length || 0;
      const bosSayi = _.where(data.tumYanitlar, {yanitlandi: 0, soruId}).length || 0;
      const yanlisSayi = math.chain(tumSayi).subtract(dogruSayi).subtract(bosSayi).done();
      return {
        kod: soru.kod,
        tip: M.L.enumLabel(soru.tip),
        zorlukDerecesi: _.findWhere(data.sinav.sorular, {soruId}).zorlukDerecesi,
        puan: _.findWhere(data.sinav.sorular, {soruId}).puan,
        dogruSayi,
        dogruOran: statFormat(math.chain(dogruSayi).divide(tumSayi).multiply(100).done()),
        yanlisSayi,
        yanlisOran: statFormat(math.chain(yanlisSayi).divide(tumSayi).multiply(100).done()),
        bosSayi,
        bosOran: statFormat(math.chain(bosSayi).divide(tumSayi).multiply(100).done())
      };
    });

    return {
      meta,
      stats,
      report,
    }

  },
  'testMaddeAnalizi'(sinavId) {
    check(sinavId, String);
    this.unblock();

    const {
      data,
      meta,
      stats,
    } = Meteor.call('raporInit', sinavId);

    const report = {
      sorular: _.pluck(data.sinav.sorular, 'soruId').map(soruId => {
        const soru = M.C.Sorular.findOne({_id: soruId});
        const tumSayi = _.where(data.tumYanitlar, {soruId}).length || 0;
        const dogruSayi = _.where(data.tumYanitlar, {dogru: true, soruId}).length || 0;
        return {
          kod: soru.kod,
          dogruOran: statFormat(math.chain(dogruSayi).divide(tumSayi).multiply(100).done())
        };
      }),
      subeler: _.compact(data.sinav.subeler.map(sube => {
        if (_.where(data.sinavKagitlari, {sube}).length > 0) {
          return {
            sube,
            sinavKagitlari: _.sortBy(_.sortBy(_.where(data.sinavKagitlari, {sube}), 'lastNameCollate'), 'nameCollate').map(sinavKagidi => {
              const ogrenci = M.C.Users.findOne({_id: sinavKagidi.ogrenci});
              return {
                ogrenci: ogrenci.name + ' ' + ogrenci.lastName,
                yanitlar: sinavKagidi.yanitlar.map(yanit => {
                  const {
                    yanitlandi,
                    dogru,
                  } = yanit;
                  return {
                    yanitlandi,
                    dogru,
                  };
                })
              };
            }),
            dogruOran: _.pluck(data.sinav.sorular, 'soruId').map(soruId => {
              const tumYanitlar = _.flatten(_.pluck(_.where(data.sinavKagitlari, {sube}), 'yanitlar'));
              const tumSayi = _.where(tumYanitlar, {soruId}).length || 0;
              const dogruSayi = _.where(tumYanitlar, {dogru: true, soruId}).length || 0;
              return statFormat(math.chain(dogruSayi).divide(tumSayi).multiply(100).done());
            })
          };
        }
      }))
    };

    return {
      meta,
      stats,
      report,
    }

  },
  'analizRaporu'(sinavId) {
    check(sinavId, String);
    this.unblock();

    const {
      data,
      meta,
      stats,
    } = Meteor.call('raporInit', sinavId);

    const sinavPuanlari = _.pluck(data.sinavKagitlari, 'puan');

    const report = {
      subeler: _.compact(data.sinav.subeler.map(sube => {
        const subePuanlari = _.where(data.sinavKagitlari, {sube}).map(sinavKagidi => {
          return sinavKagidi.puan;
        });

        if (subePuanlari.length > 0) {
          return {
            sube,
            katilan: subePuanlari.length + '/' + M.C.Users.find({kurum: data.sinav.kurum, role: 'ogrenci', sinif: data.sinav.sinif, sube}).count(),
            enDusuk: statFormat(math.min(subePuanlari)),
            enYuksek: statFormat(math.max(subePuanlari)),
            ortalama: statFormat(math.mean(subePuanlari)),
            stdSapma: statFormat(math.std(subePuanlari)),
            medyan: statFormat(math.median(subePuanlari)),
            mode: statFormat(mode(subePuanlari)),
            ranj: statFormat(math.chain(math.max(subePuanlari)).subtract(math.min(subePuanlari)).done())
          };
        }

      })),
      genel: {
        katilan: data.sinavKagitlari.length,
        enDusuk: statFormat(math.min(sinavPuanlari)),
        enYuksek: statFormat(math.max(sinavPuanlari)),
        ortalama: statFormat(math.mean(sinavPuanlari)),
        stdSapma: statFormat(math.std(sinavPuanlari)),
        medyan: statFormat(math.median(sinavPuanlari)),
        mode: statFormat(mode(sinavPuanlari)),
        ranj: statFormat(math.chain(math.max(sinavPuanlari)).subtract(math.min(sinavPuanlari)).done())
      },
      grafik: {
        sinifKarsilastirmalari: _.compact(data.sinav.subeler.map(sube => {
          const subePuanlari = _.where(data.sinavKagitlari, {sube}).map(sinavKagidi => {
            return sinavKagidi.puan;
          });

          if (subePuanlari.length > 0) {
            return {
              sube,
              ortalama: statFormat(math.mean(subePuanlari))
            };
          }

        })),
        puanFrekanslari: _.keys(_.countBy(sinavPuanlari)).map((puan,index,list) => {
          return {
            puan,
            ogrenciSayisi: _.countBy(sinavPuanlari)[puan]
          };
        })
      }
    };

    return {
      meta,
      stats,
      report,
    }

  },
  'subeBazindaPuanlar'(sinavId) {
    check(sinavId, String);
    this.unblock();

    const {
      data,
      meta,
      stats,
    } = Meteor.call('raporInit', sinavId);

    let report = {
      subeler: _.sortBy(_.compact(data.sinav.subeler.map(sube => {
        if (_.where(data.sinavKagitlari, {sube}).length > 0) {
          return {
            sube,
            sinavKagitlari: _.sortBy(_.sortBy(_.sortBy(_.where(data.sinavKagitlari, {sube}), 'sira').map((sinavKagidi,ix) => {
              const counts = _.countBy(sinavKagidi.yanitlar, yanit => {
                return yanit.yanitlandi === 0 ? 'bosYanit' : (yanit.dogru === true ? 'dogruYanit' : 'yanlisYanit');
              });
              const dogruYanit = counts.dogruYanit ? counts.dogruYanit : 0;
              const yanlisYanit = counts.yanlisYanit ? counts.yanlisYanit : 0;
              const bosYanit = counts.bosYanit ? counts.bosYanit : 0;
              const ogrenci = M.C.Users.findOne({_id: sinavKagidi.ogrenci});
              return {
                ogrenci: ogrenci.name + ' ' + ogrenci.lastName,
                sube,
                dogruYanit,
                yanlisYanit,
                bosYanit,
                net: statFormat(math.chain(dogruYanit).subtract(math.chain(yanlisYanit).divide(3).done()).done()),
                yuzde: statFormat(math.chain(dogruYanit).divide(stats.soruSayisi).multiply(100).done()),
                netYuzde: statFormat(math.chain(math.chain(dogruYanit).subtract(math.chain(yanlisYanit).divide(3).done()).done()).divide(stats.soruSayisi).multiply(100).done()),
                puan: sinavKagidi.puan,
                sira: sinavKagidi.sira,
                subeSira: ix + 1,
                lastNameCollate: sinavKagidi.lastNameCollate,
                nameCollate: sinavKagidi.nameCollate
              };
            }), 'lastNameCollate'),'nameCollate').map(sinavKagidi => {
              return _.omit(sinavKagidi, ['lastNameCollate','nameCollate']);
            })
          };
        }
      })),'sube')
    };

    report.subeler = report.subeler.map(sube => {
      let ozet={};
      const sinavKagitlari = sube.sinavKagitlari;
      const dogruYanit = _.pluck(sinavKagitlari, 'dogruYanit');
      const yanlisYanit = _.pluck(sinavKagitlari, 'yanlisYanit');
      const bosYanit = _.pluck(sinavKagitlari, 'bosYanit');
      const net = _.pluck(sinavKagitlari, 'net').map(num => parseFloat(num));
      const yuzde = _.pluck(sinavKagitlari, 'yuzde').map(num => parseFloat(num));
      const netYuzde = _.pluck(sinavKagitlari, 'netYuzde').map(num => parseFloat(num));
      const puan = _.pluck(sinavKagitlari, 'puan');

      ozet.enYuksek = {
        dogruYanit: statFormat(math.max(dogruYanit)),
        yanlisYanit: statFormat(math.max(yanlisYanit)),
        bosYanit: statFormat(math.max(bosYanit)),
        net: statFormat(math.max(net)),
        yuzde: statFormat(math.max(yuzde)),
        netYuzde: statFormat(math.max(netYuzde)),
        puan: statFormat(math.max(puan))
      };
      ozet.enDusuk = {
        dogruYanit: statFormat(math.min(dogruYanit)),
        yanlisYanit: statFormat(math.min(yanlisYanit)),
        bosYanit: statFormat(math.min(bosYanit)),
        net: statFormat(math.min(net)),
        yuzde: statFormat(math.min(yuzde)),
        netYuzde: statFormat(math.min(netYuzde)),
        puan: statFormat(math.min(puan))
      };
      ozet.ortalama = {
        dogruYanit: statFormat(math.mean(dogruYanit)),
        yanlisYanit: statFormat(math.mean(yanlisYanit)),
        bosYanit: statFormat(math.mean(bosYanit)),
        net: statFormat(math.mean(net)),
        yuzde: statFormat(math.mean(yuzde)),
        netYuzde: statFormat(math.mean(netYuzde)),
        puan: statFormat(math.mean(puan))
      };
      ozet.mod = {
        dogruYanit: statFormat(mode(dogruYanit)),
        yanlisYanit: statFormat(mode(yanlisYanit)),
        bosYanit: statFormat(mode(bosYanit)),
        net: statFormat(mode(net)),
        yuzde: statFormat(mode(yuzde)),
        netYuzde: statFormat(mode(netYuzde)),
        puan: statFormat(mode(puan))
      };
      ozet.medyan = {
        dogruYanit: statFormat(math.median(dogruYanit)),
        yanlisYanit: statFormat(math.median(yanlisYanit)),
        bosYanit: statFormat(math.median(bosYanit)),
        net: statFormat(math.median(net)),
        yuzde: statFormat(math.median(yuzde)),
        netYuzde: statFormat(math.median(netYuzde)),
        puan: statFormat(math.median(puan))
      };
      ozet.ranj = {
        dogruYanit: statFormat(math.chain(math.max(dogruYanit)).subtract(math.min(dogruYanit)).done()),
        yanlisYanit: statFormat(math.chain(math.max(yanlisYanit)).subtract(math.min(yanlisYanit)).done()),
        bosYanit: statFormat(math.chain(math.max(bosYanit)).subtract(math.min(bosYanit)).done()),
        net: statFormat(math.chain(math.max(net)).subtract(math.min(net)).done()),
        yuzde: statFormat(math.chain(math.max(yuzde)).subtract(math.min(yuzde)).done()),
        netYuzde: statFormat(math.chain(math.max(netYuzde)).subtract(math.min(netYuzde)).done()),
        puan: statFormat(math.chain(math.max(puan)).subtract(math.min(puan)).done())
      };
      ozet.stdSapma = {
        dogruYanit: statFormat(math.std(dogruYanit)),
        yanlisYanit: statFormat(math.std(yanlisYanit)),
        bosYanit: statFormat(math.std(bosYanit)),
        net: statFormat(math.std(net)),
        yuzde: statFormat(math.std(yuzde)),
        netYuzde: statFormat(math.std(netYuzde)),
        puan: statFormat(math.std(puan))
      };
      ozet.ortalamaEksiStdSapma = {
        dogruYanit: statFormat(math.chain(math.mean(dogruYanit)).subtract(math.std(dogruYanit)).done()),
        yanlisYanit: statFormat(math.chain(math.mean(yanlisYanit)).subtract(math.std(yanlisYanit)).done()),
        bosYanit: statFormat(math.chain(math.mean(bosYanit)).subtract(math.std(bosYanit)).done()),
        net: statFormat(math.chain(math.mean(net)).subtract(math.std(net)).done()),
        yuzde: statFormat(math.chain(math.mean(yuzde)).subtract(math.std(yuzde)).done()),
        netYuzde: statFormat(math.chain(math.mean(netYuzde)).subtract(math.std(netYuzde)).done()),
        puan: statFormat(math.chain(math.mean(puan)).subtract(math.std(puan)).done())
      };

      return {
        sube: sube.sube,
        sinavKagitlari,
        ozet,
      }
    });

    return {
      meta,
      stats,
      report,
    }

  },
  'sinifBazindaPuanlar'(sinavId) {
    check(sinavId, String);
    this.unblock();

    let {
      meta,
      stats,
      report,
    } = Meteor.call('subeBazindaPuanlar', sinavId);

    report = _.sortBy(_.reduce(report.subeler, (memo, sube) => {
      return _.union(memo,sube.sinavKagitlari);
    }, []),'sira');

    return {
      meta,
      stats,
      report,
    }
  }

});
