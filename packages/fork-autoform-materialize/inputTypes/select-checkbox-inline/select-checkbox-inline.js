Template.afCheckboxGroupInline_materialize.helpers({
  dsk:      Utility.dsk,
  itemAtts: Utility.selectedAttsAdjust
});

Template.afCheckboxGroupInline_materialize.events({
  'click [data-trigger="sec"]': function(e,t) {
    e.preventDefault();
    t.$('input[type="checkbox"]').prop("checked", true);
  },
  'click [data-trigger="kaldir"]': function(e,t) {
    e.preventDefault();
    t.$('input[type="checkbox"]').prop("checked", false);
  }
});
