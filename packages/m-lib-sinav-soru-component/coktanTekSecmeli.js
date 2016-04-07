Template.sorucoktanTekSecmeli.onCreated(function() {
  var template = this;
  template.yanit = new ReactiveVar();
  template.sinav = new ReactiveVar();
  template.sinavKagidiId = new ReactiveVar();
  template.seciliSoruIndex = new ReactiveVar();
  template.secenekler = new ReactiveVar();
  
  template.autorun(function() {
    template.sinav.set(Template.currentData().sinav);
    template.sinavKagidiId.set(Template.currentData().sinavKagidiId);
    template.seciliSoruIndex.set(Template.currentData().seciliSoruIndex);
    template.secenekler.set(Template.currentData().secenekler);
    
    template.yanit.set(template.sinav.get() === true && M.C.SinavKagitlari.findOne({
        _id: template.sinavKagidiId.get()
      }).yanitlar[template.seciliSoruIndex.get()].yanit);
  })
});

Template.sorucoktanTekSecmeli.helpers({
  secenekler: function() {
    if (Template.instance().sinav.get() === true) {
      return Template.instance().yanit.get().secenekler;
    } else {
      return Template.instance().secenekler.get();
    }
  }
});
