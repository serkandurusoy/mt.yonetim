Template.sorudogruYanlis.onCreated(function() {
  this.yanit = new ReactiveVar();
  this.sinav = new ReactiveVar();
  this.sinavKagidiId = new ReactiveVar();
  this.seciliSoruIndex = new ReactiveVar();
  this.dogruchecked = new ReactiveVar();
  this.yanlischecked = new ReactiveVar();

  this.autorun(() => {
    this.sinav.set(Template.currentData().sinav);
    this.sinavKagidiId.set(Template.currentData().sinavKagidiId);
    this.seciliSoruIndex.set(Template.currentData().seciliSoruIndex);
    this.dogruchecked.set(Template.currentData().dogruchecked);
    this.yanlischecked.set(Template.currentData().yanlischecked);

    this.yanit.set(this.sinav.get() === true && M.C.SinavKagitlari.findOne({
        _id: this.sinavKagidiId.get()
      }).yanitlar[this.seciliSoruIndex.get()].yanit);
  })
});

Template.sorudogruYanlis.helpers({
  dogruchecked() {
    if (Template.instance().sinav.get() === true) {
      return Template.instance().yanit.get().cevap === true;
    } else {
      return Template.instance().dogruchecked.get();
    }
  },
  yanlischecked() {
    if (Template.instance().sinav.get() === true) {
      return Template.instance().yanit.get().cevap === false;
    } else {
      return Template.instance().yanlischecked.get();
    }
  }
});
