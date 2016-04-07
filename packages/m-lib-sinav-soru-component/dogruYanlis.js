Template.sorudogruYanlis.onCreated(function() {
  var template = this;
  template.yanit = new ReactiveVar();
  template.sinav = new ReactiveVar();
  template.sinavKagidiId = new ReactiveVar();
  template.seciliSoruIndex = new ReactiveVar();
  template.dogruchecked = new ReactiveVar();
  template.yanlischecked = new ReactiveVar();

  template.autorun(function() {
    template.sinav.set(Template.currentData().sinav);
    template.sinavKagidiId.set(Template.currentData().sinavKagidiId);
    template.seciliSoruIndex.set(Template.currentData().seciliSoruIndex);
    template.dogruchecked.set(Template.currentData().dogruchecked);
    template.yanlischecked.set(Template.currentData().yanlischecked);

    template.yanit.set(template.sinav.get() === true && M.C.SinavKagitlari.findOne({
        _id: template.sinavKagidiId.get()
      }).yanitlar[template.seciliSoruIndex.get()].yanit);
  })
});

Template.sorudogruYanlis.helpers({
  dogruchecked: function() {
    if (Template.instance().sinav.get() === true) {
      return Template.instance().yanit.get().cevap === true;
    } else {
      return Template.instance().dogruchecked.get();
    }
  },
  yanlischecked: function() {
    if (Template.instance().sinav.get() === true) {
      return Template.instance().yanit.get().cevap === false;
    } else {
      return Template.instance().yanlischecked.get();
    }
  }
});
