Template.sorudogruYanlis.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.yanit = template.data.sinav === true && M.C.SinavKagitlari.findOne({
        _id: template.data.sinavKagidiId
      }).yanitlar[template.data.seciliSoruIndex].yanit;
  })
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
