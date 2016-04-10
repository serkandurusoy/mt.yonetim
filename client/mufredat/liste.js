Template.mufredatListe.onCreated(function() {
  var template = this;
  template.subscribe('mufredatlar');
  template.subscribe('fsdersicerik');
  template.searchResults = new ReactiveVar({});
  template.autorun(function() {
    var keywords = Session.get('keywords');
    var filters = Session.get('filters');
    if (_.isString(keywords) || _.isObject(filters)) {
      Meteor.call('search.mufredat',keywords, filters, function(err,res) {
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

Template.mufredatListe.helpers({
  mufredat: function(){
    var selector = Template.instance().searchResults.get();
    var mufredatCursor = M.C.Mufredat.find(selector, {sort: {kurum: 1, egitimYili: 1, ders: 1, sinif: 1}});
    return mufredatCursor.count() && mufredatCursor;
  }
});

Template.filterMufredat.helpers({
  filterMufredatForm: function() {
    return new SimpleSchema({
      kurum: {
        label: 'Kurum',
        type: String,
        optional: true,
        autoform: {
          type: function() {
            if (Meteor.user() && !_.contains(['mitolojix','teknik'], Meteor.user().role)) {
              return 'hidden';
            }
          },
          value: function() {
            if (Meteor.user() && !_.contains(['mitolojix','teknik'], Meteor.user().role)) {
              return Meteor.user().kurum;
            }
          },
          class: 'browser-default',
          firstOption: 'Tümü',
          options: function() {
            var kurumlar = [];
            var userKurum = M.C.Kurumlar.findOne({_id: Meteor.user().kurum});
            if (Meteor.user().role === 'mitolojix') {
              kurumlar = _.union({label: 'Mitolojix', value: 'mitolojix'}, M.C.Kurumlar.find({}, {sort: {isimCollate: 1}}).map(function(kurum) {return {label: kurum.isim, value: kurum._id};}));
            } else {
              kurumlar = _.union({label: 'Mitolojix', value: 'mitolojix'}, {label: userKurum.isim, value: userKurum._id});
            }
            return kurumlar;
          }
        }
      },
      egitimYili: {
        label: 'Eğitim Yılı',
        type: String,
        optional: true,
        autoform: {
          class: 'browser-default',
          firstOption: 'Tümü',
          options: function(){
            return _.map(M.E.EgitimYiliObjects, function(s) {
              return {
                label: s.label, value: s.name
              };
            });
          }
        }
      },
      ders: {
        label: 'Ders',
        type: String,
        optional: true,
        autoform: {
          class: 'browser-default',
          firstOption: 'Tümü',
          options: function() {
            if (M.L.userHasRole(Meteor.userId(), 'ogretmen')) {
              return M.C.Dersler.find({_id: {$in: Meteor.user().dersleri}}).map(function(ders) {return {label: ders.isim, value: ders._id};});
            } else {
              return M.C.Dersler.find().map(function(ders) {return {label: ders.isim, value: ders._id};});
            }
          }
        }
      },
      sinif: {
        label: 'Sınıf',
        type: String,
        optional: true,
        autoform: {
          class: 'browser-default',
          firstOption: 'Tümü',
          options: function() {
            return _.map(M.E.Sinif, function(sinif) {return {label: M.L.enumLabel(sinif), value: sinif};});
          }
        }
      }
    });
  }
});

AutoForm.hooks({
  filterMufredatForm: {
    onSubmit: function() {
      return false;
    }
  }
});

Template.filterMufredat.onRendered(function(){
  this.autorun(function() {
    var filters = {};
    var kurum = AutoForm.getFieldValue('kurum', 'filterMufredatForm'),
      egitimYili  = AutoForm.getFieldValue('egitimYili', 'filterMufredatForm'),
      ders  = AutoForm.getFieldValue('ders', 'filterMufredatForm'),
      sinif = AutoForm.getFieldValue('sinif', 'filterMufredatForm');

    if (kurum) {
      filters.kurum = kurum;
    }

    if (egitimYili) {
      filters.egitimYili = egitimYili;
    }

    if (ders) {
      filters.ders = ders;
    }

    if (sinif) {
      filters.sinif = sinif;
    }

    Session.set('filters', filters);

  })
});
