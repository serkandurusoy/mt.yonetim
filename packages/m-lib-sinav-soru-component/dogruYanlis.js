Template.sorudogruYanlis.onCreated(function() {
  this.yanit = this.data.sinav === true && M.C.SinavKagitlari.findOne({
      _id: this.data.sinavKagidiId
    }).yanitlar[this.data.seciliSoruIndex].yanit;
});

Template.sorudogruYanlis.helpers({
  dogruchecked: function() {
    if (Template.instance().data.sinav === true) {
      return Template.instance().yanit.cevap === true;
    } else {
      return Template.instance().data.dogruchecked;
    }
  },
  yanlischecked: function() {
    if (Template.instance().data.sinav === true) {
      return Template.instance().yanit.cevap === false;
    } else {
      return Template.instance().data.yanlischecked;
    }
  }
});
