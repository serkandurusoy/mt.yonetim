import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Blaze } from 'meteor/blaze';

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { M } from 'meteor/m:lib-core';

import './onizleme.html';

Template.sinavOnizlemeModal.onCreated(function() {
  this.renderComponent = new ReactiveVar(true);
  this.seciliSoruIndex = new ReactiveVar(0);
  this.subscribe('fssorugorsel');
  this.sinav = new ReactiveVar(M.C.Sinavlar.findOne({_id: FlowRouter.getParam('_id')}));
});

Template.sinavOnizlemeModal.helpers({
  formatliSinavSuresi(t) {
    return M.L.FormatSinavSuresi(t*60*1000);
  },
  sinav() {
    return Template.instance().sinav.get();
  },
  renderComponent() {
    return Template.instance().renderComponent.get();
  },
  seciliSoruIndex() {
    return Template.instance().seciliSoruIndex.get();
  },
  soruPuani() {
    const seciliSoruIndex = Template.instance().seciliSoruIndex.get();
    const sinav = Template.instance().sinav.get();
    const soruPuani = sinav && sinav.sorular[seciliSoruIndex].puan;
    return sinav && soruPuani.toString();
  },
  seciliSoru() {
    const seciliSoruIndex = Template.instance().seciliSoruIndex.get();
    const sinav = Template.instance().sinav.get();
    return sinav && M.C.Sorular.findOne({_id: sinav.sorular[seciliSoruIndex].soruId});
  },
  soruKomponent() {
    const seciliSoruIndex = Template.instance().seciliSoruIndex.get();
    const sinav = Template.instance().sinav.get();
    const seciliSoru = sinav && M.C.Sorular.findOne({_id: sinav.sorular[seciliSoruIndex].soruId});
    return M.L.komponentSec(seciliSoru);
  }
});

Template.sinavOnizlemeModal.events({
  'click .dugmeNav.anaEkran'(e,t) {
    e.preventDefault();
    Blaze.remove(sinavOnizlemeView);
  }
});
