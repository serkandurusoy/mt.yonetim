Template.bilgilerimTarihce.helpers({
  bilgilerimTarihce() {
    return Blaze._globalHelpers.$mapped(Meteor.user().versions());
  }
});
