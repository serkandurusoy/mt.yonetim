import { Meteor } from 'meteor/meteor';

import './_cron-setup';

import { M as namespace } from './_common';

Meteor.startup(function() {
  if (Meteor.isServer) {
    console.log("======================================");
    console.log("Meteor instance for " + Meteor.settings.public.APP + " started.");
    console.log("======================================");
  }
});

export const M = namespace;
