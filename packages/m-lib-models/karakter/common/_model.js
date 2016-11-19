import { M } from 'meteor/m:lib-core';

M.C.setUpCollection({
  object: 'Karakterler',
  collection: 'karakterler',
  schema: {
    cinsiyet: {
      label: 'Cinsiyet',
      type: String,
      allowedValues: M.E.Cinsiyet,
      index: 1,
      autoform: {
        class: 'browser-default',
        firstOption: 'Cinsiyet seçin',
        options() {
          return options = M.E.CinsiyetObjects.map(cinsiyet => {
            const {
              label,
              name: value,
            } = cinsiyet;
            return {
              label,
              value,
            };
          });
        }
      }
    },
    gorsel: {
      label: 'Görsel',
      type: String,
      index: 1,
      unique: true,
      autoform: {
        afFieldInput: {
          type: 'fileUpload',
          collection: M.FS.Karakter,
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