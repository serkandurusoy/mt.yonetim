Template.soruSepeti.onCreated(function() {
  var template = this;
  template.subscribe('mufredatlar');
  template.searchResults = new ReactiveVar({_id: {$in: [""]}});
  template.autorun(function() {
    var keywords = Session.get('keywords');
    var filters = Session.get('filters');

    var selector = {};

    var sepettekiSoruIdleri = _.pluck(M.C.SoruSepetleri.find({createdBy: Meteor.userId()}).fetch(),'soru');
    selector._id = {$in: sepettekiSoruIdleri};

    if (_.isString(keywords) || _.isObject(filters)) {
      Meteor.call('search.soruSepeti',keywords, filters, function(err,res) {
        if (err) {
          toastr.error(M.E.BilinmeyenHataMessage);
          template.searchResults.set(selector);
        }
        if (res) {
          if (res==='all') {
            template.searchResults.set(selector);
          } else {
            selector._id = {$in: res};
            template.searchResults.set(selector);
          }
        }
      })
    }
    template.searchResults.set(selector);
  });
});

Template.soruSepeti.helpers({
  sorular: function(){
    var selector = Template.instance().searchResults.get();
   //TODO: sort and group by relevant fields
    var sorularCursor = M.C.Sorular.find(selector);
    return sorularCursor.count() && {cursor: sorularCursor, count: sorularCursor.count()};
  }
});

Template.soruSepeti.events({
  'click [data-trigger="bosalt"]': function(e,t) {
    e.preventDefault();
    Meteor.call('soruSepetiBosalt', function(err,res) {
      if (err) {
        toastr.error(M.E.BilinmeyenHataMessage)
      }
      if (res) {
        toastr.success('Sepetinizdeki tüm sorular boşaltıldı.')
      }
    });
  }
});

Template.filterSoruSepeti.helpers({
  filterSoruSepetiForm: function() {
    return new SimpleSchema({
      kurum: {
        label: 'Kurum',
        type: String,
        optional: true,
        autoform: {
          type: function() {
            if (Meteor.user() && Meteor.user().role !== 'mitolojix') {
              return 'hidden';
            }
          },
          value: function() {
            if (Meteor.user() && Meteor.user().role !== 'mitolojix') {
              return Meteor.user().kurum;
            }
          },
          class: 'browser-default',
          firstOption: 'Tümü',
          options: function() {
            var kurumlar = [];
            if (Meteor.user().role === 'mitolojix') {
              kurumlar = _.union(M.C.Kurumlar.find({}, {sort: {isimCollate: 1}}).map(function(kurum) {return {label: kurum.isim, value: kurum._id};}));
            } else {
              var userKurum = M.C.Kurumlar.findOne({_id: Meteor.user().kurum});
              kurumlar.push({label: userKurum.isim, value: userKurum._id});
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
      },
      tip: {
        label: 'Soru Tipi',
        type: String,
        optional: true,
        autoform: {
          class: 'browser-default',
          firstOption: 'Tümü',
          options: function() {
            var options = _.map(M.E.SoruTipiObjects, function(t) {
              return {
                label: t.label, value: t.name
              };
            });
            return options;
          }
        }
      },
      soruSahibi: {
        label: 'Soru Sahibi',
        type: String,
        optional: true,
        autoform: {
          type: function() {
            if (Meteor.user() && Meteor.user().role === 'mudur') {
              return 'hidden';
            }
          },
          class: 'browser-default',
          firstOption: 'Herkes',
          options: function() {
            return [{
              label: 'Kendi Sorularım', value: Meteor.userId()
            }];
          }
        }
      },
      konu: {
        label: 'Konu',
        type: String,
        optional: true,
        autoform: {
          type: function() {
            var formId = AutoForm.getFormId();
            var kurum = AutoForm.getFieldValue('kurum', formId);
            var egitimYili = AutoForm.getFieldValue('egitimYili', formId);
            var ders = AutoForm.getFieldValue('ders', formId);
            var sinif = AutoForm.getFieldValue('sinif', formId);
            if (!kurum || !egitimYili || !ders || !sinif) {
              return 'hidden';
            }
          },
          class: 'browser-default',
          firstOption: 'Tümü',
          options: function() {
            var formId = AutoForm.getFormId();
            var kurum = AutoForm.getFieldValue('kurum', formId);
            var egitimYili = AutoForm.getFieldValue('egitimYili', formId);
            var ders = AutoForm.getFieldValue('ders', formId);
            var sinif = AutoForm.getFieldValue('sinif', formId);
            var konular = M.C.Mufredat.findOne({
              $and: [
                {kurum: kurum},
                {egitimYili: egitimYili},
                {ders: ders},
                {sinif: sinif}
              ]
            });
            var uniqueSortedKonuListesi = konular && konular.konular && _.sortBy(_.uniq(konular.konular));
            return  uniqueSortedKonuListesi && uniqueSortedKonuListesi.map(function(konu) {
                return {
                  label: konu.konu,
                  value: konu.konu
                }
              });
          }
        }
      }
    });
  }
});

AutoForm.hooks({
  filterSoruSepetiForm: {
    onSubmit: function() {
      return false;
    }
  }
});

Template.filterSoruSepeti.onRendered(function(){
  this.autorun(function() {
    var filters = {};
    var kurum = AutoForm.getFieldValue('kurum', 'filterSoruSepetiForm'),
      egitimYili  = AutoForm.getFieldValue('egitimYili', 'filterSoruSepetiForm'),
      ders  = AutoForm.getFieldValue('ders', 'filterSoruSepetiForm'),
      sinif = AutoForm.getFieldValue('sinif', 'filterSoruSepetiForm'),
      tip = AutoForm.getFieldValue('tip', 'filterSoruSepetiForm'),
      soruSahibi = AutoForm.getFieldValue('soruSahibi', 'filterSoruSepetiForm'),
      konu = AutoForm.getFieldValue('konu','filterSoruSepetiForm');

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

    if (tip) {
      filters.tip = tip;
    }

    if (soruSahibi) {
      filters.soruSahibi = soruSahibi;
    }

    if(konu) {
      filters.konu = konu;
    }

    Session.set('filters', filters);

  })
});
