import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { FlowRouter } from 'meteor/kadira:flow-router';

import { M } from 'meteor/m:lib-core';

import './liste.html';

Template.soruOnizlemeModal.helpers({
  seciliSoru() {
    return M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')});
  },
  soruKomponent() {
    const seciliSoru = M.C.Sorular.findOne({_id: FlowRouter.getParam('_id')});
    return M.L.komponentSec(seciliSoru);
  }
});

Template.soruOnizlemeModal.events({
  'click'(e,t) {
    Blaze.remove(soruOnizlemeView);
  }
});
