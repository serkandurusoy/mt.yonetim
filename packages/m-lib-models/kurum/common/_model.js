import { Meteor } from 'meteor/meteor';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { AutoForm } from 'meteor/aldeed:autoform';

import { Collate } from 'meteor/m:lib-collate';
import { M } from 'meteor/m:lib-core';


M.C.setUpCollection({
  object: 'Kurumlar',
  collection: 'kurumlar',
  schema: {
    logo: {
      label: 'Kurum Logosu',
      type: String,
      autoform: {
        afFieldInput: {
          type: 'fileUpload',
          collection: M.FS.KurumLogo,
          accept: 'image/*',
          dropEnabled: false,
          label: 'Logo seçin',
          buttonlabel: '<i class="material-icons">attach_file</i>',
          dropLabel: 'Veya sürükleyip buraya bırakın',
          //removeLabel: 'Sil',
          'remove-label': 'Sil',
          dropClasses: 'card-panel grey lighten-4 grey-text'
        }
      }
    },
    isim: {
      label: 'Kurum İsmi',
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
    yetkili: {
      label: 'Yetkili',
      type: Object
    },
    'yetkili.isim': {
      label: 'Yetkili İsmi',
      type: String,
      min: 5,
      max: 64,
      autoValue() {
        if (this.isSet) {
          return M.L.Trim(this.value).localeTitleize();
        } else {
          this.unset();
        }
      }
    },
    'yetkili.unvan': {
      label: 'Yetkili Unvanı',
      type: String,
      min: 3,
      max: 64,
      autoValue() {
        if (this.isSet) {
          return M.L.Trim(this.value).localeTitleize();
        } else {
          this.unset();
        }
      }
    },
    'yetkili.email': {
      label: 'Yetkili E-posta Adresi',
      type: String,
      min: 10,
      max: 128,
      regEx: SimpleSchema.RegEx.Email,
      custom() {
        const testFormat = M.L.TestEmail(M.L.Trim(this.value).toLowerCase());
        if (!testFormat) {
          return 'emailHatali';
        }
        return true;
      },
      autoValue() {
        if (this.isSet) {
          return M.L.Trim(this.value).toLowerCase();
        } else {
          this.unset();
        }
      }
    },
    'yetkili.telefon': {
      label: 'Yetkili Telefonu',
      type: String,
      min: 10,
      max: 10,
      custom() {
        const testFormat = M.L.TestTel(this.value);
        if (!testFormat) {
          return 'telHatali';
        }
        return true;
      }
    },
    adres: {
      label: 'Adres',
      type: Object
    },
    'adres.adres': {
      label: 'Adres',
      type: String,
      min: 3,
      max: 256,
      autoValue() {
        if (this.isSet) {
          return M.L.Trim(this.value).localeTitleize();
        } else {
          this.unset();
        }
      }
    },
    'adres.il': {
      label: 'İl',
      type: String,
      optional:true,
      autoValue() {
        this.unset();
      },
      autoform: {
        class: 'browser-default',
        firstOption: 'İl seçin',
        options() {
          return M.C.Iller.find({},{sort: {ilCollate: 1}, fields: {il: 1}}).map(il => {
            return {
              label: il.il,
              value: il.il,
            };
          });
        }
      }
    },
    'adres.ilce': {
      label: 'İlçe',
      type: String,
      allowedValues() {
        return M.C.Ilceler.find({},{fields: {ilce: 1}}).map(ilce => ilce._id);
      },
      autoform: {
        class: 'browser-default',
        firstOption: 'İlçe seçin',
        options() {
          const formId = AutoForm.getFormId();
          const il = AutoForm.getFieldValue('adres.il', formId);
          return M.C.Ilceler.find({il},{sort: {ilceCollate: 1}, fields: {ilce: 1}}).map(ilce => {
            return {
              label: ilce.ilce,
              value: ilce._id,
            };
          });
        }
      }
    },
    sifre: {
      label: 'Şifre Zorluk Derecesi',
      type: String,
      allowedValues: M.E.Sifre,
      autoform: {
        class: 'browser-default',
        firstOption: 'Derece seçin',
        options() {
          return M.E.SifreObjects.map(s => {
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
    }
  },
  permissions: {
    insert: 'mitolojix',
    update: 'mitolojix'
  }
});
