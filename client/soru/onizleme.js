Template.soruOnizlemeModal.onRendered(function() {
  Tracker.afterFlush(function() {
    var seciliSoru = M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')});
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

Template.soruOnizlemeModal.helpers({
  seciliSoru: function() {
    return M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')});
  }
});

Template.soruOnizlemeModal.events({
  'click': function(e,t) {
    Blaze.remove(soruOnizlemeView);
  }
});
