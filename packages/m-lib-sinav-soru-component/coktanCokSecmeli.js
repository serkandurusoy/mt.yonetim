Template.sorucoktanCokSecmeli.onCreated(function() {
  var template = this;
  template.autorun(function() {
    template.yanit = template.data.sinav === true && M.C.SinavKagitlari.findOne({
        _id: template.data.sinavKagidiId
      }).yanitlar[template.data.seciliSoruIndex].yanit;
  })
});

Template.sorucoktanCokSecmeli.helpers({
  secenekler: function() {
    if (Template.instance().data.sinav === true) {
      return Template.instance().yanit.secenekler;
    } else {
      return Template.instance().data.secenekler;
    }
  }
});
