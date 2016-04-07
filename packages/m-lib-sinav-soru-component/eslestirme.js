Template.sorueslestirme.onCreated(function() {
  this.seciliSoru = this.data.sinav === true && M.C.SinavKagitlari.findOne({
      _id: this.data.sinavKagidiId
    }).yanitlar[this.data.seciliSoruIndex];

  this.yanit = this.seciliSoru.yanit;

  this.eslestirme = new ReactiveDict();

});

Template.sorueslestirme.onRendered(function() {
  var template = this;

  Tracker.afterFlush(function() {
    if (template.data.sinav === true) {
      var seciliSoruIndex = template.data.seciliSoruIndex;
      var eslestirLength = template.yanit.sol.length;
      for(var sol=0;sol<eslestirLength;sol++) {
        for(var sag=0;sag<eslestirLength;sag++) {
          M.L.CizgiSil(sol,sag,'eslestirme');
        }
      }
      _.each(template.yanit.eslestirme, function(eslesme) {
        template.eslestirme.set('eslestirme'+seciliSoruIndex,[null,null]);
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
  });
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
    var seciliSoruIndex = Template.instance().data.seciliSoruIndex;
    var eslestirme = Template.instance().eslestirme.get('eslestirme'+seciliSoruIndex);
    return eslestirme;
  }
});

Template.eslestirmeKutu.helpers({
  eslemeIcinSecili: function(eslemeIcinSeciliKutu, pos,ix) {
    return eslemeIcinSeciliKutu && eslemeIcinSeciliKutu[pos] === ix;
  }
});

Template.sorueslestirme.events({
  'click .eslestir': function(e,t) {
    //TODO: This is limited to 10 options
    var seciliSoruIndex = t.data.seciliSoruIndex;
    var len = t.yanit.eslestirme.length;
    var id = e.currentTarget.getAttribute('id');
    var ix = parseInt(id.substr(4,1));
    if (id.substr(0,3) === 'sol') {
      for(var i=0;i<len;i++) {
        M.L.CizgiSil(ix,i,'eslestirme');
      }
      t.eslestirme.set('eslestirme'+ seciliSoruIndex,[ix,t.eslestirme.get('eslestirme'+ seciliSoruIndex)[1]]);
    } else {
      for(var i=0;i<len;i++) {
        M.L.CizgiSil(i,ix,'eslestirme');
      }
      t.eslestirme.set('eslestirme'+ seciliSoruIndex,[t.eslestirme.get('eslestirme'+ seciliSoruIndex)[0],ix]);
    }
    if (_.isNumber(t.eslestirme.get('eslestirme'+ seciliSoruIndex)[0]) && _.isNumber(t.eslestirme.get('eslestirme'+ seciliSoruIndex)[1])) {
      M.L.CizgiCiz(t.eslestirme.get('eslestirme'+ seciliSoruIndex)[0],t.eslestirme.get('eslestirme'+ seciliSoruIndex)[1],'eslestirme');
      t.eslestirme.set('eslestirme'+ seciliSoruIndex,[null,null]);
    }
  },
  'click .cizgi': function(e,t) {
    var seciliSoruIndex = t.data.seciliSoruIndex;
    var id = e.currentTarget.getAttribute('id');
    var sol = id.substr(4,1);
    var sag = id.substr(10,1);
    t.eslestirme.set('eslestirme'+ seciliSoruIndex,[null,null]);
    M.L.CizgiSil(sol,sag,'eslestirme');
  }
});
