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
