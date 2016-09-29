Template.soruListe.onCreated(function() {
  var template = this;
  template.subscribe('sorular');
  template.subscribe('mufredatlar');
  template.subscribe('fssorugorsel');
  template.searchResults = new ReactiveVar({});
  template.autorun(function() {
    var keywords = Session.get('keywords');
    var filters = Session.get('filters');
    if (_.isString(keywords) || _.isObject(filters)) {
      Meteor.call('search.soru',keywords, filters, function(err,res) {
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

Template.soruListe.helpers({
  sorular: function(){
    var selector = Template.instance().searchResults.get();
    var sorularCursor = M.C.Sorular.find(selector,{sort:{kurum: 1, 'alan.ders': 1, 'alan.sinif': 1, 'alan.konu': 1, kod: 1}}); //TODO: sort by dersCollate
    return sorularCursor.count() && sorularCursor;
  }
});

Template.soruKart.helpers({
  inCart: function() {
    return M.C.SoruSepetleri.findOne({createdBy: Meteor.userId(), soru: this._id});
  },
  inFavori: function() {
    return M.C.SoruFavorileri.findOne({createdBy: Meteor.userId(), soru: this._id});
  }
});

Template.soruKart.events({
  'click [data-trigger="cart"]': function(e,t) {
    var soru = t.data._id;
    var sepet = M.C.SoruSepetleri.findOne({createdBy: Meteor.userId(), soru: soru});
    if (sepet) {
      M.C.SoruSepetleri.remove({_id: sepet._id});
    } else {
      M.C.SoruSepetleri.insert({soru: soru});
    }
  },
  'click [data-trigger="favorite"]': function(e,t) {
    var soru = t.data._id;
    var favori = M.C.SoruFavorileri.findOne({createdBy: Meteor.userId(), soru: soru});
    if (favori) {
      M.C.SoruFavorileri.remove({_id: favori._id});
    } else {
      M.C.SoruFavorileri.insert({soru: soru});
    }
  }
});

Template.filterSoru.helpers({
  filterSoruForm: function() {
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
          options: function(){
            var formId = AutoForm.getFormId();
            var kurum = AutoForm.getFieldValue('kurum', formId);
            var egitimYili = AutoForm.getFieldValue('egitimYili', formId);
            var ders = AutoForm.getFieldValue('ders', formId);
            var sinif = AutoForm.getFieldValue('sinif', formId);
            return M.C.Mufredat.findOne({
              $and: [
                {kurum: kurum},
                {egitimYili: egitimYili},
                {ders: ders},
                {sinif: sinif}
              ]
            }).konular.map(function(konu){
              return {
                label: konu.konu,
                value: konu.konu
              }
            });
          }

        }
      },
    });
  }
});

AutoForm.hooks({
  filterSoruForm: {
    onSubmit: function() {
      return false;
    }
  }
});

Template.filterSoru.onRendered(function(){
  this.autorun(function() {
    var filters = {};
    var kurum = AutoForm.getFieldValue('kurum', 'filterSoruForm'),
      egitimYili  = AutoForm.getFieldValue('egitimYili', 'filterSoruForm'),
      ders  = AutoForm.getFieldValue('ders', 'filterSoruForm'),
      sinif = AutoForm.getFieldValue('sinif', 'filterSoruForm'),
      tip = AutoForm.getFieldValue('tip', 'filterSoruForm'),
      soruSahibi = AutoForm.getFieldValue('soruSahibi', 'filterSoruForm'),
      konu = AutoForm.getFieldValue('konu','filterSoruForm');

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
