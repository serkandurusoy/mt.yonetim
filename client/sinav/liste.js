Template.sinavListe.onCreated(function() {
  var template = this;
  template.subscribe('sinavlar');
  template.subscribe('mufredatlar');
  template.searchResults = new ReactiveVar({});
  template.autorun(function() {
    var keywords = Session.get('keywords');
    var filters = Session.get('filters');
    if (_.isString(keywords) || _.isObject(filters)) {
      Meteor.call('search.sinav',keywords, filters, function(err,res) {
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

Template.sinavListe.helpers({
  sinavlar: function(){
    var selector = Template.instance().searchResults.get();
    var sinavlarCursor = M.C.Sinavlar.find(selector,{sort:{kurum: 1, egitimYili: -1, ders: 1, sinif: 1, acilisZamani: -1}}); //TODO: sort by dersCollate
    return sinavlarCursor.count() && {cursor: sinavlarCursor, count: sinavlarCursor.count()};
  }
});

Template.filterSinav.helpers({
  filterSinavForm: function() {
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
        label: 'Test Tipi',
        type: String,
        optional: true,
        autoform: {
          class: 'browser-default',
          firstOption: 'Tümü',
          options: function() {
            var options = _.map(M.E.SinavTipiObjects, function(t) {
              return {
                label: t.label, value: t.name
              };
            });
            return options;
          }
        }
      },
      sinavSahibi: {
        label: 'Test Sahibi',
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
              label: 'Kendi Testlerim', value: Meteor.userId()
            }];
          }
        }
      },
      sinavDurumu: {
        label: 'Test Durumu',
        type: String,
        optional: true,
        autoform: {
          class: 'browser-default',
          firstOption: 'Tümü',
          options: function() {
            return [
              {label: 'Taslak', value: 'taslak'},
              {label: 'Kilitli', value: 'kilitli'},
              {label: 'Bekliyor', value: 'bekliyor'},
              {label: 'Yayında', value: 'yayinda'},
              {label: 'Tamamlandı', value: 'tamamlandi'},
              {label: 'İptal', value: 'iptal'}
            ];
          }
        }
      },
      konu: {
        label: 'Konu',
        type: String,
        optional: true,
        autoform:{
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
          options: function(){
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
  filterSinavForm: {
    onSubmit: function() {
      return false;
    }
  }
});

Template.filterSinav.onRendered(function(){
  this.autorun(function() {
    var filters = {};
    var kurum = AutoForm.getFieldValue('kurum', 'filterSinavForm'),
      egitimYili  = AutoForm.getFieldValue('egitimYili', 'filterSinavForm'),
      ders  = AutoForm.getFieldValue('ders', 'filterSinavForm'),
      sinif = AutoForm.getFieldValue('sinif', 'filterSinavForm'),
      tip = AutoForm.getFieldValue('tip', 'filterSinavForm'),
      sinavDurumu = AutoForm.getFieldValue('sinavDurumu', 'filterSinavForm'),
      sinavSahibi = AutoForm.getFieldValue('sinavSahibi', 'filterSinavForm'),
      konu = AutoForm.getFieldValue('konu','filterSinavForm');

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

    if (sinavDurumu) {
      filters.sinavDurumu = sinavDurumu;
    }

    if (sinavSahibi) {
      filters.sinavSahibi = sinavSahibi;
    }

    if(konu) {
      filters.konu = konu;
    }

    Session.set('filters', filters);

  })
});
