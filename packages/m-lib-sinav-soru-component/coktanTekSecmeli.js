Template.sorucoktanTekSecmeli.onCreated(function() {
  this.yanit = this.data.sinav === true && M.C.SinavKagitlari.findOne({
      _id: this.data.sinavKagidiId
    }).yanitlar[this.data.seciliSoruIndex].yanit;
});

Template.sorucoktanTekSecmeli.helpers({
  secenekler: function() {
    if (Template.instance().data.sinav === true) {
      return Template.instance().yanit.secenekler;
    } else {
      return Template.instance().data.secenekler;
    }
  }
});
