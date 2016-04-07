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
