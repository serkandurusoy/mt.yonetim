import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { M } from 'meteor/m:lib-core';

import './liste.html';

Template.soruOnizlemeModal.helpers({
  seciliSoru() {
    return M.C.Sorular.findOne(this._id);
  },
  soruKomponent() {
    const seciliSoru = M.C.Sorular.findOne(this._id);
    return M.L.komponentSec(seciliSoru);
  }
});

Template.soruOnizlemeModal.events({
  'click'(e,t) {
    Blaze.remove(soruOnizlemeView);
  }
});
