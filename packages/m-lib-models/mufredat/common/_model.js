import { Meteor } from 'meteor/meteor';

import { _ } from 'meteor/underscore';

import { M } from 'meteor/m:lib-collections';

M.C.setUpCollection({
  object: 'Mufredat',
  collection: 'mufredat',
  schema: {
    kurum: {
      label: 'Kurum',
      type: String,
      index: 1,
      custom() {
        if (!this.userId && this.value === 'mitolojix') {
          return true;
        }
        const kurum = this;
        const user = M.C.Users.findOne({_id: this.userId});
        const userRole = user && user.role;
        const kurumlar = M.C.Kurumlar.find().map(kurum =>kurum._id);
        const tumu = _.union('mitolojix',kurumlar);
        if (kurum.isSet && !_.contains(tumu,kurum.value)) {
          return 'notAllowed';
        }
        if (kurum.isSet && kurum.value === 'mitolojix' && userRole !== 'mitolojix') {
          return 'yetkiYok';
        }
        return true;
      },
      autoValue() {
        const kurum = this;
        const user = M.C.Users.findOne({_id: this.userId});
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
        type() {
          if (Meteor.user() && Meteor.user().role !== 'mitolojix') {
            return 'hidden';
          }
        },
        class: 'browser-default',
        firstOption: 'Kurum seçin',
        options() {
          let kurumlar = [];
          if (Meteor.user().role === 'mitolojix') {
            kurumlar = _.union({label: 'Mitolojix', value: 'mitolojix'}, M.C.Kurumlar.find({}, {sort: {isimCollate: 1}})
                        .map(kurum => {
                          const {
                            isim: label,
                            _id: value,
                          } = kurum;
                          return {
                            label,
                            value,
                          };
                        })
            );
          } else {
            const userKurum = M.C.Kurumlar.findOne({_id: Meteor.user().kurum});
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
        options(){
          return M.E.EgitimYiliObjects.map(s => {
            const {
              label,
              name: value,
            } = s;
            return {
              label,
              value,
            };
          });
        }
      }
    },
    ders: {
      label: 'Ders',
      type: String,
      custom() {
        const ders = this;
        if (ders.isSet) {
          const tumDersler = M.C.Dersler.find().map(ders => ders._id);
          if (!_.contains(tumDersler,ders.value)) {
            return 'notAllowed';
          }
        }
        return true;
      },
      autoform: {
        class: 'browser-default',
        firstOption: 'Ders seçin',
        options() {
          return M.C.Dersler.find().map(ders => {
            const {
              isim: label,
              _id: value,
            } = ders;
            return {
              label,
              value,
            };
          });
        }
      }
    },
    sinif: {
      label: 'Sınıf',
      type: String,
      custom() {
        const sinif = this;
        if (sinif.isSet && !_.contains(M.E.Sinif, sinif.value)) {
          return 'notAllowed';
        }
        return true;
      },
      autoform: {
        class: 'browser-default',
        firstOption: 'Sınıf seçin',
        options(){
          return M.E.Sinif.map(sinif => {
            return {
              label: M.L.enumLabel(sinif),
              value: sinif,
            };
          });
        }
      }
    },
    konular: {
      label: 'Konular',
      type: [Object],
      minCount: 1,
      maxCount: 48,
      autoValue() {
        let konular = this;
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
          return konular.value.sort((a, b) => a.konu.localeCompare(b.konu));
        } else {
          this.unset();
        }
      },
      custom() {
        let konuObjects = this.value;
        konuObjects = _.compact(konuObjects);
        const konular = _.pluck(konuObjects, 'konu');
        const sag = konular.length;
        const sol = _.uniq(konular).length;
        return sol === sag ? true : 'notUnique'
      }
    },
    'konular.$.konu': {
      label: 'Konu',
      type: String,
      min: 2,
      max: 256,
      autoValue() {
        if (this.isSet) {
          return M.L.Trim(this.value);
        } else {
          this.unset();
        }
      }
    },
    'konular.$.icerik': {
      label: 'İçerikler',
      type: [String],
      optional: true,
      defaultValue: [],
      autoValue() {
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
      autoValue() {
        const kazanimlar = this;
        if (kazanimlar.isSet) {
          let value = kazanimlar.value;
          value = _.compact(value);
          value = value.map(v => M.L.Trim(v));
          if (Meteor.isServer) {
            /*
             TODO: use ilib sort for this
             */
          }
          return value.sort((a, b) => a.localeCompare(b));
        } else {
          kazanimlar.unset();
        }
      },
      custom() {
        let kazanimlar = this.value;
        kazanimlar = _.compact(kazanimlar);
        const sag = kazanimlar.length;
        const sol = _.uniq(kazanimlar).length;
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
  M.C.Mufredat.permit('insert').ifLoggedIn().userHasRole('teknik').userInDocKurum().allowInClientCode();
  M.C.Mufredat.permit('update').ifLoggedIn().userHasRole('teknik').userInDocKurum().allowInClientCode();
}
