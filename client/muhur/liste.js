Template.muhurListe.onCreated(function() {
  var template = this;
  template.searchResults = new ReactiveVar({});
  template.autorun(function() {
    var keywords = Session.get('keywords');
    var filters = Session.get('filters');
    if (_.isString(keywords) || _.isObject(filters)) {
      Meteor.call('search.muhur',keywords, filters, function(err,res) {
        if (err) {
          toastr.error(M.E.BilinmeyenHataMessage);
          template.searchResults.set({});
        }
        if (res) {
          if (res==='all') {
            template.searchResults.set({});
          } else {
            template.searchResults.set({_id: {$in: res}});
          }
        }
      })
    } else {
      template.searchResults.set({});
    }
  });
});

Template.muhurListe.helpers({
  muhurler: function(){
    var selector = Template.instance().searchResults.get();
    var muhurlerCursor = M.C.Muhurler.find(selector,{sort:{ders: 1, sira: 1}});
    return muhurlerCursor.count() && muhurlerCursor;
  }
});

Template.filterMuhur.helpers({
  filterMuhurForm: function() {
    return new SimpleSchema({
      ders: {
        label: 'Ders',
        type: String,
        optional: true,
        autoform: {
          class: 'browser-default',
          firstOption: 'Tümü',
          options: function() {
            return M.C.Dersler.find().map(function(ders) {return {label: ders.isim, value: ders._id};});
          }
        }
      }
    });
  }
});

AutoForm.hooks({
  filterMuhurForm: {
    onSubmit: function() {
      return false;
    }
  }
});

Template.filterMuhur.onRendered(function(){
  this.autorun(function() {
    var filters = {};
    var ders  = AutoForm.getFieldValue('ders', 'filterMuhurForm');

    if (ders) {
      filters.ders = ders;
    }

    Session.set('filters', filters);

  })
});
