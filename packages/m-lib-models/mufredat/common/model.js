M.C.setUpCollection({
  object: 'Mufredat',
  collection: 'mufredat',
  schema: {
    kurum: {
      label: 'Kurum',
      type: String,
      index: 1,
      custom: function() {
        if (!this.userId && this.value === 'mitolojix') {
          return true;
        }
        var kurum = this;
        var user = M.C.Users.findOne({_id: this.userId});
        var userRole = user && user.role;
        var kurumlar = M.C.Kurumlar.find().map(function(kurum) {return kurum._id;});
        var tumu = _.union('mitolojix',kurumlar);
        if (kurum.isSet && !_.contains(tumu,kurum.value)) {
          return 'notAllowed';
        }
        if (kurum.isSet && kurum.value === 'mitolojix' && userRole !== 'mitolojix') {
          return 'yetkiYok';
        }
        return true;
      },
      autoValue: function() {
        var kurum = this;
        var user = M.C.Users.findOne({_id: this.userId});
        if (user && user.role !== 'mitolojix') {
          if (kurum.isInsert) {
            return user.kurum;
          }
          if (kurum.isUpdate && kurum.isSet) {
            return user.kurum;
          }
          if (kurum.isUpdate && !kurum.isSet) {
            return kurum.unset();
          }
        }
      },
      autoform: {
        type: function() {
          if (Meteor.user() && Meteor.user().role !== 'mitolojix') {
            return 'hidden';
          }
        },
        class: 'browser-default',
        firstOption: 'Kurum seçin',
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
    egitimYili: {
      label: 'Eğitim Yılı',
      type: String,
      index: 1,
      allowedValues: M.E.EgitimYili,
      autoform: {
        class: 'browser-default',
        firstOption: 'Eğitim yılı seçin',
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
      custom: function() {
        var ders = this;
        if (ders.isSet) {
          var tumDersler = M.C.Dersler.find().map(function(ders) {return ders._id;});
          if (!_.contains(tumDersler,ders.value)) {
            return 'notAllowed';
          }
        }
        return true;
      },
      autoform: {
        class: 'browser-default',
        firstOption: 'Ders seçin',
        options: function() {
          return M.C.Dersler.find().map(function(ders) {return {label: ders.isim, value: ders._id};});
        }
      }
    },
    sinif: {
      label: 'Sınıf',
      type: String,
      custom: function() {
        var sinif = this;
        if (sinif.isSet && !_.contains(M.E.Sinif, sinif.value)) {
          return 'notAllowed';
        }
        return true;
      },
      autoform: {
        class: 'browser-default',
        firstOption: 'Sınıf seçin',
        options: function(){
          return _.map(M.E.Sinif, function(sinif) {return {label: M.L.enumLabel(sinif), value: sinif};});
        }
      }
    },
    konular: {
      label: 'Konular',
      type: [Object],
      minCount: 1,
      maxCount: 48,
      autoValue: function() {
        var konular = this;
        konular.value = _.compact(konular.value);
        if (konular.isSet) {
          if (Meteor.isServer) {
            /*
             TODO: see if we want to use ilib sort for this on the server, or perhaps use this elsewhere as necessary
             http://www.docs.jedlsoft.com/ilib/2.0/jsdoc/symbols/ilib.Collator.html

             The Collator constructor returns a collator object tailored with the above options.
             The object contains an internal compare() method which compares two strings according to those options.
             This can be used directly to compare two strings, but is not useful for passing to the javascript sort
             function because then it will not have its collation data available. Instead, use the getComparator()
             method to retrieve a function that is bound to the collator object. (You could also bind it yourself
             using ilib.bind()). The bound function can be used with the standard Javascript array sorting algorithm,
             or as a comparator with your own sorting algorithm.

             Example using the standard Javascript array sorting call with the bound function:

             var arr = ["ö", "oe", "ü", "o", "a", "ae", "u", "ß", "ä"];
             var collator = ilib.Collator({locale: 'de-DE', style: "dictionary"});
             arr.sort(collator.getComparator());
             console.log(JSON.stringify(arr));

             Would give the output:

             ["a", "ae", "ä", "o", "oe", "ö", "ß", "u", "ü"]

             When sorting an array of Javascript objects according to one of the string properties of the objects,
             wrap the collator's compare function in your own comparator function that knows the structure of the
             objects being sorted:

             var collator = ilib.Collator({locale: 'de-DE'});
             var myComparator = function (collator) {
             var comparator = collator.getComparator();
             // left and right are your own objects
             return function (left, right) {
             return comparator(left.x.y.textProperty, right.x.y.textProperty);
             };
             };
             arr.sort(myComparator(collator));

             */
          }
          return konular.value.sort(function(a, b) {
            return a.konu.localeCompare(b.konu);
          });
        } else {
          this.unset();
        }
      },
      custom: function() {
        var konuObjects = this.value;
        konuObjects = _.compact(konuObjects);
        var konular = _.pluck(konuObjects, 'konu');
        var sag = konular.length;
        var sol = _.uniq(konular).length;
        return sol === sag ? true : 'notUnique'
      }
    },
    'konular.$.konu': {
      label: 'Konu',
      type: String,
      min: 2,
      max: 256,
      autoValue: function() {
        var konu = this;
        if (konu.isSet) {
          return M.L.Trim(konu.value);
        } else {
          konu.unset();
        }
      }
    },
    'konular.$.icerik': {
      label: 'İçerikler',
      type: [String],
      optional: true,
      defaultValue: [],
      autoValue: function() {
        if (this.isSet) {
          return _.compact(this.value);
        } else {
          this.unset();
        }
      }
    },
    'konular.$.icerik.$': {
      label: 'İçerik',
      type: String,
      autoform: {
        afFieldInput: {
          type: 'fileUpload',
          collection: M.FS.DersIcerik,
          accept: 'application/pdf',
          dropEnabled: false,
          label: 'PDF içerik seçin',
          buttonlabel: '<i class="material-icons">attach_file</i>',
          dropLabel: 'Veya sürükleyip buraya bırakın',
          //removeLabel: 'Sil',
          'remove-label': 'Sil',
          dropClasses: 'card-panel grey lighten-4 grey-text'
        }
      }
    },
    'konular.$.kazanimlar': {
      label: 'Kazanımlar',
      type: [String],
      minCount: 1,
      maxCount: 48,
      autoValue: function() {
        var kazanimlar = this;
        if (kazanimlar.isSet) {
          var value = kazanimlar.value;
          value = _.compact(value);
          value = _.map(value, function(v) {
            return M.L.Trim(v);
          });
          if (Meteor.isServer) {
            /*
             TODO: use ilib sort for this
             */
          }
          return value.sort(function(a, b) {
            return a.localeCompare(b);
          });
        } else {
          kazanimlar.unset();
        }
      },
      custom: function() {
        var kazanimlar = this.value;
        kazanimlar = _.compact(kazanimlar);
        var sag = kazanimlar.length;
        var sol = _.uniq(kazanimlar).length;
        return sol === sag ? true : 'notUnique'
      }
    },
    'konular.$.kazanimlar.$': {
      label: 'Kazanım',
      type: String,
      min: 2,
      max: 256
    }
  },
  permissions: {
    insert: 'mitolojix',
    update: 'mitolojix'
  },
  indexes: [
    {ix: {kurum: 1, egitimYili: 1, ders: 1, sinif: 1}, opt: { unique: true }}
  ],
  cloneable: true
});

if (Meteor.isServer) {
  M.C.Mufredat.permit('insert').ifLoggedIn().userHasRole('teknik').userInDocKurum().apply();
  M.C.Mufredat.permit('update').ifLoggedIn().userHasRole('teknik').userInDocKurum().apply();
}
