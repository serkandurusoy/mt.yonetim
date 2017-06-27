import { Template } from 'meteor/templating';

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { M } from 'meteor/m:lib-core';

import './detay.html';
import './detayKart.html';

Template.muhurDetay.helpers({
  muhur() {
    return M.C.Muhurler.findOne({_id: FlowRouter.getParam('_id')});
  }
});

Template.muhurDetayKart.onRendered(function(){
  this.parent().$('.collapsible').collapsible();
});

