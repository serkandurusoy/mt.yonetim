import { Template } from 'meteor/templating';

import './initials-template.html';

Template.initials.onRendered(function() {
  this.$('img').initial(this.data.options);
});
