import { Template } from 'meteor/templating';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';

import { M } from 'meteor/m:lib-core';

import './duzenle.html';

Template.soruDuzenle.onCreated(function() {
  this.autorun(() => {
    this.subscribe('soru', FlowRouter.getParam('_id'));
    this.subscribe('mufredatlar');
    this.subscribe('fssorugorsel');
  });
});

Template.soruDuzenle.helpers({
  soruKullanimda() {
    return M.C.Sinavlar.findOne({'sorular.soruId': FlowRouter.getParam('_id'), iptal: false});
  },
  soruMufredatVersionDegismis() {
    const soru = M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')});
    const mufredat = soru && M.C.Mufredat.findOne({_id: soru.alan.mufredat});
    return soru && mufredat && soru.alan.mufredatVersion !== mufredat._version;
  },
  soruMufredatEgitimYiliDegismis() {
    const soru = M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')});
    const mufredat = soru && M.C.Mufredat.findOne({_id: soru.alan.mufredat});
    return soru && mufredat && soru.alan.egitimYili !== mufredat.egitimYili;
  },
  soru() {
    return M.C.Sorular.findOne({_id: FlowRouter.getParam('_id'), aktif: true, kilitli: false});
  }
});

AutoForm.hooks({
  soruDuzenleForm: {
    onSuccess(operation, result, template) {
      if (result) {
        FlowRouter.go('soruDetay', {_id: FlowRouter.getParam('_id')});
      }
    }
  }
});
