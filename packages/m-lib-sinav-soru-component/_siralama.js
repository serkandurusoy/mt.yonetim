import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var'
import { $ } from 'meteor/jquery';

import { M } from 'meteor/m:lib-core';

import './_siralama.html';

Template.sorusiralama.onCreated(function() {
  this.seciliSoru = new ReactiveVar();

  this.sinav = new ReactiveVar();
  this.sinavKagidiId = new ReactiveVar();
  this.seciliSoruIndex = new ReactiveVar();
  this.secenekler = new ReactiveVar();

  this.autorun(() => {
    this.sinav.set(Template.currentData().sinav);
    this.sinavKagidiId.set(Template.currentData().sinavKagidiId);
    this.seciliSoruIndex.set(Template.currentData().seciliSoruIndex);
    this.secenekler.set(Template.currentData().secenekler);

    this.seciliSoru.set(this.sinav.get() === true && M.C.SinavKagitlari.findOne({
        _id: this.sinavKagidiId.get()
      }).yanitlar[this.seciliSoruIndex.get()]);
  })
});

Template.sorusiralama.onRendered(function() {
  this.autorun(() => {
    Tracker.afterFlush(() => {
      if (this.sinav.get() === true && this.seciliSoru.get().yanit.secenekler.length >=0) {
        const el = document.getElementById('siralama-'+this.seciliSoru.get().soruId+'-'+this.seciliSoru.get().yanitlandi);
        if (el) {
          if (typeof siralamaSortable !== 'undefined') {
            siralamaSortable.destroy()
          }
          const siralamaSortable = new Sortable(el, {
            forceFallback: true,
            onEnd() {
              $('#cozumAlani').animate({
                scrollTop: '-=500'
              }, 0)
            }
          });
          siralamaSortable.sort(this.seciliSoru.get().yanit.secenekler.map(secenek => JSON.stringify(secenek).toString().toHashCode()));
        }
      }
    })
  })
});

Template.sorusiralama.helpers({
  secenekler() {
    if (Template.instance().sinav.get() === true) {
      return Template.instance().seciliSoru.get().yanit.secenekler;
    } else {
      return Template.instance().secenekler.get();
    }
  },
  id() {
    let id = 'siralama';
    if (Template.instance().sinav.get() === true) {
      id = id + '-' + Template.instance().seciliSoru.get().soruId + '-' + Template.instance().seciliSoru.get().yanitlandi;
    }
    return id;
  }
});
