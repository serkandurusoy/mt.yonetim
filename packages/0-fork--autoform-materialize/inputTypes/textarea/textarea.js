Template.afTextarea_materialize.helpers({
  atts: function() {
    var atts = Utility.attsToggleInvalidClass.call(this);
    return AutoForm.Utility.addClass(atts, "materialize-textarea");
  }
});
