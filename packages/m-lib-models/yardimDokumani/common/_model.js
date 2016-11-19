import { M } from 'meteor/m:lib-core';

M.C.setUpCollection({
  object: 'YardimDokumanlari',
  collection: 'yardimdokumanlari',
  schema: {
    isim: {
      label: 'İsim',
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
    dokuman: {
      label: 'Doküman',
      type: String,
      autoform: {
        afFieldInput: {
          type: 'fileUpload',
          collection: M.FS.YardimDokumani,
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
    }
  },
  permissions: {
    insert: 'mitolojix',
    update: 'mitolojix'
  }
});
