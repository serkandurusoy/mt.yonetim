Template.sinavOnizlemeModal.onCreated(function() {
  this.seciliSoruIndex = new ReactiveVar(0);
  this.subscribe('fssorugorsel');
  this.sinav = new ReactiveVar(M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')}));
});

Template.sinavOnizlemeModal.helpers({
  formatliSinavSuresi: function(t) {
    return M.L.FormatSinavSuresi(t*60*1000);
  },
  sinav: function() {
    return Template.instance().sinav.get();
  },
  seciliSoruIndex: function() {
    return Template.instance().seciliSoruIndex.get();
  },
  soruPuani: function() {
    var seciliSoruIndex = Template.instance().seciliSoruIndex.get();
    var sinav = Template.instance().sinav.get();
    var soruPuani = sinav && sinav.sorular[seciliSoruIndex].puan;
    return sinav && soruPuani.toString();
  },
  seciliSoru: function() {
    var seciliSoruIndex = Template.instance().seciliSoruIndex.get();
    var sinav = Template.instance().sinav.get();
    return sinav && M.C.Sorular.findOne({_id: sinav.sorular[seciliSoruIndex].soruId});
  }
});

Template.sinavOnizlemeModal.events({
  'click .dugmeNav.anaEkran': function(e,t) {
    e.preventDefault();
    Blaze.remove(sinavOnizlemeView);
  }
});
