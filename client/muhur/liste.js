Template.muhurListe.onCreated(function() {
  let template = this;
  template.searchResults = new ReactiveVar({});
  template.autorun(function() {
    const keywords = Session.get('keywords');
    const filters = Session.get('filters');
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
  muhurler() {
    const selector = Template.instance().searchResults.get();
    const muhurlerCursor = M.C.Muhurler.find(selector,{sort:{ders: 1, sira: 1}});
    return muhurlerCursor.count() && {cursor: muhurlerCursor, count: muhurlerCursor.count()};
  }
});

Template.filterMuhur.helpers({
  filterMuhurForm() {
    return new SimpleSchema({
      ders: {
        label: 'Ders',
        type: String,
        optional: true,
        autoform: {
          class: 'browser-default',
          firstOption: 'Tümü',
          options() {
            return M.C.Dersler.find().map(ders => {
              const {
                isim: label,
                _id: value,
              } = ders;
              return{
                label,
                value,
              };
            });
          }
        }
      }
    });
  }
});

AutoForm.hooks({
  filterMuhurForm: {
    onSubmit() {
      return false;
    }
  }
});

Template.filterMuhur.onRendered(function(){
  this.autorun(function() {
    let filters = {};
    const ders  = AutoForm.getFieldValue('ders', 'filterMuhurForm');

    if (ders) {
      filters.ders = ders;
    }

    Session.set('filters', filters);

  })
});
