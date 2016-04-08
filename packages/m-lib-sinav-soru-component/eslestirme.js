Template.sorueslestirme.onCreated(function() {
  var template = this;
  template.seciliSoru = new ReactiveVar();
  template.yanit = new ReactiveVar();
  template.eslestirme = new ReactiveVar([null,null]);

  template.sinav = new ReactiveVar();
  template.cevapAnahtari = new ReactiveVar();

  template.sinavKagidiId = new ReactiveVar();
  template.seciliSoruIndex = new ReactiveVar();
  template.solsecenekler = new ReactiveVar();
  template.sagsecenekler = new ReactiveVar();

  template.autorun(function() {
    template.sinav.set(Template.currentData().sinav);
    template.cevapAnahtari.set(Template.currentData().cevapAnahtari);
    template.sinavKagidiId.set(Template.currentData().sinavKagidiId);
    template.seciliSoruIndex.set(Template.currentData().seciliSoruIndex);
    template.solsecenekler.set(Template.currentData().solsecenekler);
    template.sagsecenekler.set(Template.currentData().sagsecenekler);

    template.seciliSoru.set(template.sinav.get() === true && M.C.SinavKagitlari.findOne({
        _id: template.sinavKagidiId.get()
      }).yanitlar[template.seciliSoruIndex.get()]);
    template.yanit.set(template.seciliSoru.get().yanit);
    template.eslestirme.set([null,null]);
  })
});

Template.sorueslestirme.onRendered(function() {
  var template = this;
  template.autorun(function() {
    Tracker.afterFlush(function() {

      if (template.sinav.get() === true && template.yanit.get().eslestirme.length >= 0) {
        var eslestirLength = template.yanit.get().sol.length;
        for(var sol=0;sol<eslestirLength;sol++) {
          for(var sag=0;sag<eslestirLength;sag++) {
            M.L.CizgiSil(sol,sag,'eslestirme');
          }
        }
        _.each(template.yanit.get().eslestirme, function(eslesme) {
          template.eslestirme.set([null,null]);
          if (template.seciliSoru.get().yanitlandi > 0) {
            M.L.CizgiCiz(eslesme[0],eslesme[1],'eslestirme');
          }
        });
      } else {
        var eslestirLength = template.solsecenekler.get().length;
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
    if (Template.instance().sinav.get() === true) {
      return Template.instance().yanit.get().sol;
    } else {
      return Template.instance().solsecenekler.get();
    }
  },
  sagsecenekler: function() {
    if (Template.instance().sinav.get() === true) {
      return Template.instance().yanit.get().sag;
    } else {
      return Template.instance().sagsecenekler.get();
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
    if (t.sinav.get() === true && !t.cevapAnahtari.get()) {
      //TODO: This is limited to 10 options
      var len = t.yanit.get().eslestirme.length;
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
    if (t.sinav.get() === true && !t.cevapAnahtari.get()) {
      var id = e.currentTarget.getAttribute('id');
      var sol = id.substr(4,1);
      var sag = id.substr(10,1);
      t.eslestirme.set([null,null]);
      M.L.CizgiSil(sol,sag,'eslestirme');
    }
  }
});
