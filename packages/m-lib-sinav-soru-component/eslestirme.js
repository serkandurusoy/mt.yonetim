Template.sorueslestirme.onRendered(function() {
  var template = this;
  if (!template.data.sinav) {
    Tracker.afterFlush(function() {
      var eslestirLength = template.data.solsecenekler.length;
      for(var sol=0;sol<eslestirLength;sol++) {
        for(var sag=0;sag<eslestirLength;sag++) {
          M.L.CizgiSil(sol,sag,'eslestirme');
        }
      }
      _.each(_.range(eslestirLength), function(ix) {
        M.L.CizgiCiz(ix,ix,'eslestirme');
      })
    });
  }
});

Template.eslestirmeKutu.helpers({
  eslemeIcinSecili: function(eslemeIcinSeciliKutu, pos,ix) {
    return eslemeIcinSeciliKutu && eslemeIcinSeciliKutu[pos] === ix;
  }
});
