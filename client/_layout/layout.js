import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import { M } from 'meteor/m:lib-core';

import './layout.html';

window.M = M;

BlazeLayout.setRoot('body');

Reload.delay = 4000;
Reload.beforeHook = () => {
  if (Meteor.userId()) {
    toastr.error('Birkaç saniye içinde Mitolojix uygulamasının güncel sürümüne yükseltileceksiniz.');
  }
};

Template.mainLayout.onRendered(function() {
  if (Reload.didHotReload) {
    if (Meteor.userId()) {
      toastr.success('Mitolojix uygulamasının güncel sürümüne başarıyla yükseltildiniz.', null, {onHidden() {Reload.didHotReload = false;}});
    }
  }
});

Template.mainLayout.helpers({
  env() {
    return Meteor.settings.public.ENV === 'PRODUCTION' ? false : Meteor.settings.public.ENV
  }
});

Template.registerHelper('isHotReloading', function() {
  return Reload.isHotReloading;
});
