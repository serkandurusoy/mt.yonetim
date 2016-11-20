import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var'

import { M } from 'meteor/m:lib-core';

import './_coktanCokSecmeli.html';

Template.sorucoktanCokSecmeli.onCreated(function() {
  this.yanit = new ReactiveVar();
  this.sinav = new ReactiveVar();
  this.sinavKagidiId = new ReactiveVar();
  this.seciliSoruIndex = new ReactiveVar();
  this.secenekler = new ReactiveVar();

  this.autorun(() => {
    this.sinav.set(Template.currentData().sinav);
    this.sinavKagidiId.set(Template.currentData().sinavKagidiId);
    this.seciliSoruIndex.set(Template.currentData().seciliSoruIndex);
    this.secenekler.set(Template.currentData().secenekler);

    this.yanit.set(this.sinav.get() === true && M.C.SinavKagitlari.findOne({
        _id: this.sinavKagidiId.get()
      }).yanitlar[this.seciliSoruIndex.get()].yanit);
  })
});

Template.sorucoktanCokSecmeli.helpers({
  secenekler() {
    if (Template.instance().sinav.get() === true) {
      return Template.instance().yanit.get().secenekler;
    } else {
      return Template.instance().secenekler.get();
    }
  }
});
