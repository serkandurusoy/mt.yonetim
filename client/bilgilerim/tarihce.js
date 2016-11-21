import { Meteor } from 'meteor/meteor';
import { Blaze } from 'meteor/blaze';
import { Template } from 'meteor/templating';

import './tarihce.html';

Template.bilgilerimTarihce.helpers({
  bilgilerimTarihce() {
    return Blaze._globalHelpers.$mapped(Meteor.user().versions());
  }
});
