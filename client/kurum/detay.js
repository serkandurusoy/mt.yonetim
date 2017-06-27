import { Template } from 'meteor/templating';

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { M } from 'meteor/m:lib-core';

import './detay.html';
import './detayKart.html';

Template.kurumDetay.helpers({
  kurum() {
    return M.C.Kurumlar.findOne({_id: FlowRouter.getParam('_id')});
  }
});

Template.kurumDetayKart.onRendered(function(){
  this.parent().$('.collapsible').collapsible();
});
