M.C.setUpCollection({
  object: 'Dersler',
  collection: 'dersler',
  schema: {
    isim: {
      label: 'İsim',
      type: String,
      min: 2,
      max: 128,
      index: 1,
      unique: true,
      autoValue() {
        if (this.isSet) {
          return M.L.Trim(this.value).localeTitleize();
        } else {
          this.unset();
        }
      }
    },
    isimCollate: {
      type: String,
      autoValue() {
        const isim = this.field('isim');
        let sortCode='0';
        if (isim.isSet) {
          if (Meteor.isServer) {
            sortCode = Collate(isim.value);
          }
          return sortCode;
        } else {
          this.unset();
        }
      },
      index: 1,
      autoform: {
        omit: true
      }
    },
    muhurGrubu: {
      label: 'Mühür Grubu',
      type: Object
    },
    'muhurGrubu.isim': {
      label: 'Mühür Grubu İsmi',
      type: String,
      min: 2,
      max:256,
      index: 1,
      unique: true,
      autoValue() {
        if (this.isSet) {
          return M.L.Trim(this.value).localeTitleize();
        } else {
          this.unset();
        }
      }
    },
    'muhurGrubu.isimCollate': {
      type: String,
      autoValue() {
        const isim = this.field('muhurGrubu.isim');
        let sortCode='0';
        if (isim.isSet) {
          if (Meteor.isServer) {
            sortCode = Collate(isim.value);
          }
          return sortCode;
        } else {
          this.unset();
        }
      },
      index: 1,
      autoform: {
        omit: true
      }
    },
    'muhurGrubu.gorsel': {
      label: 'Görsel',
      type: String,
      unique: true,
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
    },
    'muhurGrubu.butonAktif': {
      label: 'Buton Aktif',
      type: String,
      unique: true,
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
    },
    'muhurGrubu.butonPasif': {
      label: 'Buton Pasif',
      type: String,
      unique: true,
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
  }
});
