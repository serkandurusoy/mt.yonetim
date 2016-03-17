Template.kullaniciListe.onCreated(function() {
  var template = this;
  template.subscribe('kullanicilar');
  template.searchResults = new ReactiveVar({});
  template.autorun(function() {
    var keywords = Session.get('keywords');
    var filters = Session.get('filters');
    if (_.isString(keywords) || _.isObject(filters)) {
      Meteor.call('search.kullanici',keywords, filters, function(err,res) {
        if (err) {
          Materialize.toast('Bilinmeyen bir hata oluştu, daha sonra tekrar deneyin.', M.E.ToastDismiss, 'red');
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

Template.kullaniciListe.helpers({
  kullanicilar: function(){
    var selector = Template.instance().searchResults.get();
    if (Meteor.user().kurum !== 'mitolojix') {
      selector.kurum = Meteor.user().kurum;
    }
    var kullanicilarCursor = M.C.Users.find(selector,{sort:{kurum: 1, nameCollate: 1, lastNameCollate: 1}});
    return kullanicilarCursor.count() && kullanicilarCursor;
  }
});

Template.kullaniciKart.helpers({
  initialsOptions: function() {
    var doc = this;
    return {
      name: doc.name + ' ' + doc.lastName,
      height: 250,
      width: 250,
      textColor: '#ffffff',
      fontSize: 80,
      fontWeight: 400,
      radius: 0
    };
  }
});

Template.filterKullanici.helpers({
  filterKullaniciForm: function() {
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
              kurumlar = _.union({label: 'Mitolojix', value: 'mitolojix'}, M.C.Kurumlar.find({}, {sort: {isimCollate: 1}}).map(function(kurum) {return {label: kurum.isim, value: kurum._id};}));
            } else {
              var userKurum = M.C.Kurumlar.findOne({_id: Meteor.user().kurum});
              kurumlar.push({label: userKurum.isim, value: userKurum._id});
            }
            return kurumlar;
          }
        }
      },
      role: {
        label: 'Rol',
        type: String,
        optional: true,
        autoform: {
          type: function() {
            var formId = AutoForm.getFormId();
            var kurum = AutoForm.getFieldValue('kurum', formId);

            if (!kurum) {
              return 'hidden';
            } else if (kurum === 'mitolojix') {
              return 'hidden';
            } else {
              return 'select';
            }

          },
          class: 'browser-default',
          firstOption: 'Tümü',
          options: function() {
            var formId = AutoForm.getFormId();
            var kurum = AutoForm.getFieldValue('kurum', formId);
            var options = _.map(M.E.RoleObjects, function(r) {
              return {
                label: r.label, value: r.name
              };
            });
            if (kurum) {
              if (kurum === 'mitolojix') {
                options = [_.findWhere(options, {value : 'mitolojix'})];
              } else {
                options = _.reject(options, function(o) {
                  return o.value === 'mitolojix';
                });
              }
            }
            return options;
          }
        }
      },
      sinif: {
        label: 'Sınıf',
        type: String,
        optional: true,
        autoform: {
          type: function() {
            var formId = AutoForm.getFormId();
            var role = AutoForm.getFieldValue('role', formId);
            return role === 'ogrenci' ? 'select' : 'hidden';
          },
          class: 'browser-default',
          firstOption: 'Tümü',
          options: function() {
            return _.map(M.E.Sinif, function(sinif) {return {label: M.L.enumLabel(sinif), value: sinif};});
          }
        }
      },
      sube: {
        label: 'Şube',
        type: String,
        optional: true,
        autoform: {
          type: function() {
            var formId = AutoForm.getFormId();
            var sinif = AutoForm.getFieldValue('sinif', formId);
            return !!sinif ? 'select' : 'hidden';
          },
          class: 'browser-default',
          firstOption: 'Tümü',
          options: function() {
            return M.E.Sube.map(function(sube) {return {label: sube, value: sube};});
          }
        }
      }
    });
  }
});

AutoForm.hooks({
  filterKullaniciForm: {
    onSubmit: function() {
      return false;
    }
  }
});

Template.filterKullanici.onRendered(function(){
  this.autorun(function() {
    var filters = {};
    var kurum = AutoForm.getFieldValue('kurum', 'filterKullaniciForm'),
        role  = AutoForm.getFieldValue('role', 'filterKullaniciForm'),
        sinif = AutoForm.getFieldValue('sinif', 'filterKullaniciForm'),
        sube = AutoForm.getFieldValue('sube', 'filterKullaniciForm');

    if (kurum) {
      filters.kurum = kurum;
    }

    if (role) {
      filters.role = role;
    }

    if (sinif) {
      filters.sinif = sinif;
    }

    if (sube) {
      filters.sube = sube;
    }

    Session.set('filters', filters);

  })
});
