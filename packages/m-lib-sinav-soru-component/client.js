Template.sorueslestirme.onRendered(function() {
  var template = this;
  if (!template.data.sinav) {
    Tracker.afterFlush(function() {
      var eslestirLength = template.data.solsecenekler.length;
      for(var sol=0;sol<eslestirLength;sol++) {
        for(var sag=0;sag<eslestirLength;sag++) {
          M.L.CizgiSil(sol,sag,'eslestirme');
        }
      }
      _.each(_.range(eslestirLength), function(ix) {
        M.L.CizgiCiz(ix,ix,'eslestirme');
      })
    });
  }
});

Template.eslestirmeKutu.helpers({
  eslemeIcinSecili: function(eslemeIcinSeciliKutu, pos,ix) {
    return eslemeIcinSeciliKutu && eslemeIcinSeciliKutu[pos] === ix;
  }
});

Template.soruboslukDoldurma.helpers({
  formatliBoslukDoldurma: function(cevap, sinav) {
    var bosluklar = cevap;
    if (!sinav) {
      bosluklar = '<p>' + splitOnNewlines(cevap.replace(/\[(.+?)\]/g, "<span class=\"boslukDoldurSecenekSpan\">$1</span>")).join('</p><p>') + '</p>';
    }
    return bosluklar;
  }
});

Template.sorucubugu.events({
  'click .sol': function(e,t) {
    t.$('.soruCubugu').animate({
      scrollLeft: '-=64'
    }, 0);
  },
  'click .sag': function(e,t) {
    t.$('.soruCubugu').animate({
      scrollLeft: '+=64'
    }, 0);
  }
});

Template.registerHelper('cevapVerildi', function(ix) {
  var aktifEgitimYili = M.C.AktifEgitimYili.findOne();
  var user = Meteor.user();
  var sinavKagidi = M.C.SinavKagitlari.findOne({
    ogrenci: user._id,
    kurum: user && user.kurum,
    sinif: user && user.sinif,
    egitimYili: aktifEgitimYili && aktifEgitimYili.egitimYili,
    'yanitlar.yanitlandi': {$gte: 0},
    ogrenciSinavaGirdi: true
  });
  return sinavKagidi && sinavKagidi.yanitlar[ix].yanitlandi;
});

Template.registerHelper('cevapDogruYanlis', function(ix) {
  var aktifEgitimYili = M.C.AktifEgitimYili.findOne();
  var user = Meteor.user();
  var sinavKagidi = M.C.SinavKagitlari.findOne({
    ogrenci: user._id,
    kurum: user && user.kurum,
    sinif: user && user.sinif,
    egitimYili: aktifEgitimYili && aktifEgitimYili.egitimYili,
    'yanitlar.yanitlandi': {$gte: 0},
    ogrenciSinavaGirdi: true
  });
  if (sinavKagidi && sinavKagidi.yanitlar[ix].yanitlandi > 0) {
    if (sinavKagidi.yanitlar[ix].dogru === true) {
      return ' cevapDogru';
    } else if (sinavKagidi.yanitlar[ix].dogru === false) {
      return ' cevapYanlis';
    } else {
      return undefined;
    }
  }
  return undefined;
});
