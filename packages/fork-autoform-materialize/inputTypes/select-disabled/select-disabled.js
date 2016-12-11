AutoForm.addInputType('selectDisabled', {
  template: 'afSelectDisabled',
  valueIn: function(value) {
    return value;
  },
  valueOut: function() {
    return this.val();
  }
});

Template.afSelectDisabled_materialize.helpers({
  atts: Utility.attsToggleInvalidClass,
  hiddenAtts: function() {
    var atts = _.clone(this.atts);
    delete atts.id;
    delete atts.class;
    delete atts.firstOption;
    return atts;
  },
  showValue: function() {
    var value = this.value;
    var items = this.selectOptions;
    return _.findWhere(items, {value: value}).label;
  }
});

Template.afSelectDisabled_materialize.onRendered(function() {
  var template = this;
  template.autorun(function() {
    Tracker.afterFlush(function() {
      if (template.data && template.data.atts && template.data.atts.id) {
        $('label[for="'+template.data.atts.id+'"]').addClass('active')
      }
    })
  })
});
