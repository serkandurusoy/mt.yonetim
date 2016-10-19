M.C.setUpCollection({
  object: 'Muhurler',
  collection: 'muhurler',
  schema: {
    ders: {
      label: 'Dersi',
      type: String,
      index: 1,
      custom() {
        const ders = this;
        const tumu = M.C.Dersler.find({},{fields: {_id: 1}}).map(ders => ders._id);
        if (ders.isSet && !_.contains(tumu,ders.value)) {
          return 'notAllowed';
        }
        return true;
      },
      autoform: {
        class: 'browser-default',
        firstOption: 'Ders seçin',
        options() {
          return M.C.Dersler.find({}, {sort: {isim: 1}}).map(ders => {
            const {
              isim: dersIsmi,
              muhurGrubu: {
                isim: muhurIsmi,
              },
              _id: value,
            } = ders;
            return {
              label: `${dersIsmi} / ${muhurIsmi}`,
              value,
            };
          });
        }
      }
    },
    isim: {
      label: 'İsim',
      type: String,
      min: 2,
      max:256,
      autoValue() {
        if (this.isSet) {
          return M.L.Trim(this.value).localeTitleize();
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
      custom() {
        const sira = this;
        const ders = this.field('ders');
        const count = ders.isSet && M.C.Muhurler.find({ders: ders.value}).count();

        if (ders.isSet && sira.isSet && sira.value > count+1){
          return 'maxNumber';
        }

        return true;
      },
      autoform: {
        class: 'browser-default',
        firstOption: 'Sıra seçin',
        options() {
          const formId = AutoForm.getFormId();
          const ders = AutoForm.getFieldValue('ders', formId);
          const count = M.C.Muhurler.find({ders: ders}).count();
          const sira = _.range(1, count+1+1);
          return options = sira.map(sira => {
            return {
              label: sira, value: sira,
            };
          });
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
