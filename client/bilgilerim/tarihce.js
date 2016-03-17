Template.bilgilerimTarihce.helpers({
  bilgilerimTarihce: function() {
    return Blaze._globalHelpers.$mapped(Meteor.user().versions());
  }
});
