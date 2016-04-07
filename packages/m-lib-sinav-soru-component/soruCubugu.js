Template.sorucubugu.onCreated(function() {
  this.isaretliSorular = new ReactiveArray([]);
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
  },
  'dblclick [data-soruIndex]': function(e,t) {
    var ix = e.currentTarget.getAttribute('data-soruIndex');
    var isaretliSorular = t.isaretliSorular.array();
    if (_.contains(isaretliSorular, ix)) {
      t.isaretliSorular.remove(ix);
    } else {
      t.isaretliSorular.push(ix);
    }
    t.$(e.currentTarget).toggleClass('isaretli');
  },
  'click [data-soruIndex]': function(e,t) {
    var ix = e.currentTarget.getAttribute('data-soruIndex');
    t.parent().seciliSoruIndex.set(ix);
  }
});

Template.registerHelper('cevapVerildi', function(sinavKagidiId, ix) {
  var sinavKagidi = M.C.SinavKagitlari.findOne({
    _id: sinavKagidiId
  });
  return sinavKagidi && sinavKagidi.yanitlar[ix].yanitlandi;
});

Template.registerHelper('cevapDogruYanlis', function(sinavKagidiId, ix) {
  var sinavKagidi = M.C.SinavKagitlari.findOne({
    _id: sinavKagidiId
  });
  if (sinavKagidi && sinavKagidi.tip === 'alistirma' && sinavKagidi.yanitlar[ix].yanitlandi > 0) {
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

M.L.komponentSec = function(seciliSoru) {
  if (seciliSoru) {
    var template=null,data=null;

    switch (seciliSoru.tip) {
      case 'dogruYanlis':
        template = 'sorudogruYanlis';
        data = {
          dogruchecked: seciliSoru.yanit.dogruYanlis.cevap === true,
          yanlischecked: seciliSoru.yanit.dogruYanlis.cevap === false,
          disabled: true
        };
        break;
      case 'coktanTekSecmeli':
        template = 'sorucoktanTekSecmeli';
        data = {
          secenekler: seciliSoru.yanit.coktanTekSecmeli,
          disabled: true
        };
        break;
      case 'coktanCokSecmeli':
        template = 'sorucoktanCokSecmeli';
        data = {
          secenekler: seciliSoru.yanit.coktanCokSecmeli,
          disabled: true
        };
        break;
      case 'siralama':
        template = 'sorusiralama';
        data = {
          secenekler: seciliSoru.yanit.siralama
        };
        break;
      case 'eslestirme':
        template = 'sorueslestirme';
        data = {
          solsecenekler: seciliSoru.yanit.eslestirme,
          sagsecenekler: seciliSoru.yanit.eslestirme
        };
        break;
      case 'boslukDoldurma':
        template = 'soruboslukDoldurma';
        data = {
          cevap: seciliSoru.yanit.boslukDoldurma.cevap
        };
        break;
      default:
        template = null;
        data = null;
        break;
    }

    return {
      template: template,
      data: data
    }
  }
};
