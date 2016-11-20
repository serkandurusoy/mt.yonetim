import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var'
import { _ } from 'meteor/underscore';

import { M } from 'meteor/m:lib-core';

import './_eslestirme.html';

Template.sorueslestirme.onCreated(function() {
  this.seciliSoru = new ReactiveVar();
  this.yanit = new ReactiveVar();
  this.eslestirme = new ReactiveVar([null,null]);

  this.sinav = new ReactiveVar();
  this.cevapAnahtari = new ReactiveVar();

  this.sinavKagidiId = new ReactiveVar();
  this.seciliSoruIndex = new ReactiveVar();
  this.solsecenekler = new ReactiveVar();
  this.sagsecenekler = new ReactiveVar();

  this.autorun(() => {
    this.sinav.set(Template.currentData().sinav);
    this.cevapAnahtari.set(Template.currentData().cevapAnahtari);
    this.sinavKagidiId.set(Template.currentData().sinavKagidiId);
    this.seciliSoruIndex.set(Template.currentData().seciliSoruIndex);
    this.solsecenekler.set(Template.currentData().solsecenekler);
    this.sagsecenekler.set(Template.currentData().sagsecenekler);

    this.seciliSoru.set(this.sinav.get() === true && M.C.SinavKagitlari.findOne({
        _id: this.sinavKagidiId.get()
      }).yanitlar[this.seciliSoruIndex.get()]);
    this.yanit.set(this.seciliSoru.get().yanit);
    this.eslestirme.set([null,null]);
  })
});

Template.sorueslestirme.onRendered(function() {
  this.autorun(() => {
    Tracker.afterFlush(() => {

      if (this.sinav.get() === true && this.yanit.get().eslestirme.length >= 0) {
        const eslestirLength = this.yanit.get().sol.length;
        for(let sol=0;sol<eslestirLength;sol++) {
          for(let sag=0;sag<eslestirLength;sag++) {
            M.L.CizgiSil(sol,sag,'eslestirme');
          }
        }
        this.yanit.get().eslestirme.forEach(eslesme => {
          this.eslestirme.set([null,null]);
          if (this.seciliSoru.get().yanitlandi > 0) {
            M.L.CizgiCiz(eslesme[0],eslesme[1],'eslestirme');
          }
        });
      } else {
        const eslestirLength = this.solsecenekler.get().length;
        for(let sol=0;sol<eslestirLength;sol++) {
          for(let sag=0;sag<eslestirLength;sag++) {
            M.L.CizgiSil(sol,sag,'eslestirme');
          }
        }
        _.range(eslestirLength).forEach(ix => {
          M.L.CizgiCiz(ix,ix,'eslestirme');
        });
      }

    })
  })
});

Template.sorueslestirme.helpers({
  solsecenekler() {
    if (Template.instance().sinav.get() === true) {
      return Template.instance().yanit.get().sol;
    } else {
      return Template.instance().solsecenekler.get();
    }
  },
  sagsecenekler() {
    if (Template.instance().sinav.get() === true) {
      return Template.instance().yanit.get().sag;
    } else {
      return Template.instance().sagsecenekler.get();
    }
  },
  eslemeIcinSeciliKutu() {
    return Template.instance().eslestirme.get();
  }
});

Template.eslestirmeKutu.helpers({
  eslemeIcinSecili(eslemeIcinSeciliKutu, pos,ix) {
    return eslemeIcinSeciliKutu && eslemeIcinSeciliKutu[pos] === ix;
  }
});

Template.sorueslestirme.events({
  'click .eslestir'(e,t) {
    if (t.sinav.get() === true && !t.cevapAnahtari.get()) {
      //TODO: This is limited to 10 options
      const len = t.yanit.get().eslestirme.length;
      const id = e.currentTarget.getAttribute('id');
      const ix = parseInt(id.substr(4,1));
      if (id.substr(0,3) === 'sol') {
        for(let i=0;i<len;i++) {
          M.L.CizgiSil(ix,i,'eslestirme');
        }
        t.eslestirme.set([ix,t.eslestirme.get()[1]]);
      } else {
        for(let i=0;i<len;i++) {
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
  'click .cizgi'(e,t) {
    if (t.sinav.get() === true && !t.cevapAnahtari.get()) {
      const id = e.currentTarget.getAttribute('id');
      const sol = id.substr(4,1);
      const sag = id.substr(10,1);
      t.eslestirme.set([null,null]);
      M.L.CizgiSil(sol,sag,'eslestirme');
    }
  }
});
