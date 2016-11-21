import { Template } from 'meteor/templating';

import { FlowRouter } from 'meteor/kadira:flow-router';

import { M } from 'meteor/m:lib-core';

import './detay.html';
import './detayKart.html';

Template.karakterDetay.helpers({
  karakter() {
    return M.C.Karakterler.findOne({_id: FlowRouter.getParam('_id')});
  }
});

Template.karakterDetayKart.onRendered(function(){
  this.parent().$('.collapsible').collapsible();
});

