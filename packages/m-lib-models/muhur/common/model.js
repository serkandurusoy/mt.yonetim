M.C.setUpCollection({
  object: 'Muhurler',
  collection: 'muhurler',
  schema: {
    ders: {
      label: 'Dersi',
      type: String,
      index: 1,
      custom: function() {
        var ders = this;
        var tumu = M.C.Dersler.find({},{fields: {_id: 1}}).map(function(ders) {return ders._id;});
        if (ders.isSet && !_.contains(tumu,ders.value)) {
          return 'notAllowed';
        }
        return true;
      },
      autoform: {
        class: 'browser-default',
        firstOption: 'Ders seçin',
        options: function() {
          return M.C.Dersler.find({}, {sort: {isim: 1}}).map(function(ders) {return {label: ders.isim + ' / ' + ders.muhurGrubu.isim, value: ders._id};});
        }
      }
    },
    isim: {
      label: 'İsim',
      type: String,
      min: 2,
      max:256,
      autoValue: function() {
        if (this.isSet) {
          var value = this.value;
          return M.L.Trim(value).localeTitleize();
        } else {
          this.unset();
        }
      }
    },
    sira: {
      label: 'Sıra',
      type: Number,
      index: 1,
      min: 1,
      custom: function() {
        var sira = this;
        var ders = this.field('ders');
        var count = ders.isSet && M.C.Muhurler.find({ders: ders.value}).count();

        if (ders.isSet && sira.isSet && sira.value > count+1){
          return 'maxNumber';
        }

        return true;
      },
      autoform: {
        class: 'browser-default',
        firstOption: 'Sıra seçin',
        options: function() {
          var formId = AutoForm.getFormId();
          var ders = AutoForm.getFieldValue('ders', formId);
          var count = M.C.Muhurler.find({ders: ders}).count();
          var sira = _.range(1, count+1+1);
          var options = _.map(sira, function(s) {
            return {
              label: s, value: s
            };
          });
          return options;
        }
      }
    },
    gorsel: {
      label: 'Görsel',
      type: String,
      autoform: {
        afFieldInput: {
          type: 'fileUpload',
          collection: M.FS.Muhur,
          accept: 'image/*',
          dropEnabled: false,
          label: 'Görsel seçin',
          buttonlabel: '<i class="material-icons">attach_file</i>',
          dropLabel: 'Veya sürükleyip buraya bırakın',
          //removeLabel: 'Sil',
          'remove-label': 'Sil',
          dropClasses: 'card-panel grey lighten-4 grey-text'
        }
      }

    }
  },
  permissions: {
    insert: 'mitolojix',
    update: 'mitolojix'
  },
  indexes: [
    {ix: {ders: 1, isim: 1}, opt: { unique: true }},
    {ix: {ders: 1, sira: 1}, opt: { unique: true }},
    {ix: {ders: 1, gorsel: 1}, opt: { unique: true }}
  ]
});
