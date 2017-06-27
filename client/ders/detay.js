import { Template } from 'meteor/templating';

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { M } from 'meteor/m:lib-core';

import './detay.html';
import './detayKart.html';

Template.dersDetay.helpers({
  ders() {
    return M.C.Dersler.findOne({_id: FlowRouter.getParam('_id')});
  }
});

Template.dersDetayKart.onRendered(function(){
  this.parent().$('.collapsible').collapsible();
});
