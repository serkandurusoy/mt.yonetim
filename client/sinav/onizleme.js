Template.sinavOnizlemeModal.onCreated(function() {
  var template = this;

  template.seciliSoruIndex = new ReactiveVar(0);

  template.autorun(function() {
    template.subscribe('fssorugorsel');
    var sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
    Tracker.afterFlush(function() {
      var seciliSoruIndex = template.seciliSoruIndex.get() ? template.seciliSoruIndex.get() : 0;
      var seciliSoru = M.C.Sorular.findOne({_id: sinav.sorular[seciliSoruIndex].soruId});
      if (seciliSoru && seciliSoru.tip === 'eslestirme') {
        var eslestirLength = seciliSoru.yanit.eslestirme.length;
        for(var sol=0;sol<eslestirLength;sol++) {
          for(var sag=0;sag<eslestirLength;sag++) {
            M.L.CizgiSil(sol,sag,'eslestirme');
          }
        }
        _.each(seciliSoru.yanit.eslestirme, function(eslesme, ix) {
          M.L.CizgiCiz(ix,ix,'eslestirme');
        })
      }
    });
  });

});

Template.sinavOnizlemeModal.helpers({
  formatliSinavSuresi: function(t) {
    return M.L.FormatSinavSuresi(t*60*1000);
  },
  sinav: function() {
    return M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
  },
  seciliSoruIndex: function() {
    return Template.instance().seciliSoruIndex.get();
  },
  soruPuani: function() {
    var seciliSoruIndex = Template.instance().seciliSoruIndex.get();
    var sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
    var soruPuani = sinav && sinav.sorular[seciliSoruIndex].puan;
    return sinav && soruPuani.toString();
  },
  soruSayisiCubugaSigmiyor: function() {
    var sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
    return sinav && sinav.sorular.length > 14;
  },
  seciliSoru: function() {
    var sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
    return sinav && M.C.Sorular.findOne({_id: sinav.sorular[Template.instance().seciliSoruIndex.get()].soruId});
  }
});

Template.sinavOnizlemeModal.events({
  'click .dugmeNav.anaEkran': function(e,t) {
    e.preventDefault();
    Blaze.remove(sinavOnizlemeView);
  },
  'click [data-soruIndex]': function(e,t) {
    var ix = e.currentTarget.getAttribute('data-soruIndex');
    t.seciliSoruIndex.set(ix);
    t.$('[data-soruIndex]').removeClass('secili');
    t.$(e.currentTarget).addClass('secili');
    var sinav = M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')});
    var seciliSoru = sinav && M.C.Sorular.findOne({_id: sinav.sorular[ix].soruId});
    Tracker.afterFlush(function() {
      if (seciliSoru && seciliSoru.tip === 'eslestirme') {
        var eslestirLength = seciliSoru.yanit.eslestirme.length;
        for(var sol=0;sol<eslestirLength;sol++) {
          for(var sag=0;sag<eslestirLength;sag++) {
            M.L.CizgiSil(sol,sag,'eslestirme');
          }
        }
        _.each(seciliSoru.yanit.eslestirme, function(eslesme, ix) {
          M.L.CizgiCiz(ix,ix,'eslestirme');
        })
      }
    })
  }
});
