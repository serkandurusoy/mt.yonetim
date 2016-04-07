Template.sorueslestirme.onCreated(function() {
  var template = this;
  template.eslestirme = new ReactiveVar([null,null]);
  template.autorun(function() {
    template.seciliSoru = template.data.sinav === true && M.C.SinavKagitlari.findOne({
        _id: template.data.sinavKagidiId
      }).yanitlar[template.data.seciliSoruIndex];
    template.yanit = template.seciliSoru.yanit;
    template.eslestirme.set([null,null]);
  })
});

Template.sorueslestirme.onRendered(function() {
  var template = this;
  template.autorun(function() {
    Tracker.afterFlush(function() {

      if (template.data.sinav === true && template.yanit.eslestirme.length >= 0) {
        var eslestirLength = template.yanit.sol.length;
        for(var sol=0;sol<eslestirLength;sol++) {
          for(var sag=0;sag<eslestirLength;sag++) {
            M.L.CizgiSil(sol,sag,'eslestirme');
          }
        }
        _.each(template.yanit.eslestirme, function(eslesme) {
          template.eslestirme.set([null,null]);
          if (template.seciliSoru.yanitlandi > 0) {
            M.L.CizgiCiz(eslesme[0],eslesme[1],'eslestirme');
          }
        });
      } else {
        var eslestirLength = template.data.solsecenekler.length;
        for(var sol=0;sol<eslestirLength;sol++) {
          for(var sag=0;sag<eslestirLength;sag++) {
            M.L.CizgiSil(sol,sag,'eslestirme');
          }
        }
        _.each(_.range(eslestirLength), function(ix) {
          M.L.CizgiCiz(ix,ix,'eslestirme');
        });
      }

    })
  })
});

Template.sorueslestirme.helpers({
  solsecenekler: function() {
    if (Template.instance().data.sinav === true) {
      return Template.instance().yanit.sol;
    } else {
      return Template.instance().data.solsecenekler;
    }
  },
  sagsecenekler: function() {
    if (Template.instance().data.sinav === true) {
      return Template.instance().yanit.sag;
    } else {
      return Template.instance().data.sagsecenekler;
    }
  },
  eslemeIcinSeciliKutu: function() {
    return Template.instance().eslestirme.get();
  }
});

Template.eslestirmeKutu.helpers({
  eslemeIcinSecili: function(eslemeIcinSeciliKutu, pos,ix) {
    return eslemeIcinSeciliKutu && eslemeIcinSeciliKutu[pos] === ix;
  }
});

Template.sorueslestirme.events({
  'click .eslestir': function(e,t) {
    if (t.data.sinav === true) {
      //TODO: This is limited to 10 options
      var seciliSoruIndex = t.data.seciliSoruIndex;
      var len = t.yanit.eslestirme.length;
      var id = e.currentTarget.getAttribute('id');
      var ix = parseInt(id.substr(4,1));
      if (id.substr(0,3) === 'sol') {
        for(var i=0;i<len;i++) {
          M.L.CizgiSil(ix,i,'eslestirme');
        }
        t.eslestirme.set([ix,t.eslestirme.get()[1]]);
      } else {
        for(var i=0;i<len;i++) {
          M.L.CizgiSil(i,ix,'eslestirme');
        }
        t.eslestirme.set([t.eslestirme.get()[0],ix]);
      }
      if (_.isNumber(t.eslestirme.get()[0]) && _.isNumber(t.eslestirme.get()[1])) {
        M.L.CizgiCiz(t.eslestirme.get()[0],t.eslestirme.get()[1],'eslestirme');
        t.eslestirme.set([null,null]);
      }
    }
  },
  'click .cizgi': function(e,t) {
    if (t.data.sinav === true) {
      var seciliSoruIndex = t.data.seciliSoruIndex;
      var id = e.currentTarget.getAttribute('id');
      var sol = id.substr(4,1);
      var sag = id.substr(10,1);
      t.eslestirme.set([null,null]);
      M.L.CizgiSil(sol,sag,'eslestirme');
    }
  }
});
