M.C.Users = Meteor.users;

M.C.Users.Schema = new SimpleSchema({
  name: {
    label: 'Ad',
    type: String,
    index: 1,
    min: 2,
    max:32,
    autoValue() {
      if (this.isSet) {
        return M.L.Trim(this.value).localeTitleize();
      } else {
        this.unset();
      }
    }
  },
  lastName: {
    label: 'Soyad',
    type: String,
    index: 1,
    min: 2,
    max:32,
    autoValue() {
      if (this.isSet) {
        return M.L.Trim(this.value).localeTitleize();
      } else {
        this.unset();
      }
    }
  },
  dogumTarihi: {
    label: 'Doğum Tarihi',
    type: Date,
    autoValue() {
      const self = this;
      if (self.isSet) {
        return moment.tz(new Date(self.value.getFullYear(),self.value.getMonth(),self.value.getDate()),'Europe/Istanbul').toDate();
      }
    },
    custom() {
      const tcKimlik = this.field('tcKimlik');
      const dg = this.value;
      if (_.contains(['00000000001','00000000002','00000000003'],tcKimlik.value)) {
        return true;
      } else {
        const min = moment.tz(new Date(new Date().getFullYear() - 80,new Date().getMonth(),new Date().getDate()),'Europe/Istanbul').toDate();
        const max = moment.tz(new Date(new Date().getFullYear() - 5,new Date().getMonth(),new Date().getDate()),'Europe/Istanbul').toDate();
        if (dg < min) {
          return 'minDate';
        }
        if (max < dg) {
          return 'maxDate';
        }
      }
      return true;
    },
    index: 1,
    autoform: {
      type: 'pickadate',
      pickadateOptions() {
        return _.extend(
          M.E.PickadateOptions,
          {min: moment.tz(new Date(new Date().getFullYear() - 80,new Date().getMonth(),new Date().getDate()),'Europe/Istanbul').toDate()},
          {max: moment.tz(new Date(new Date().getFullYear() - 5,new Date().getMonth(),new Date().getDate()),'Europe/Istanbul').toDate()}
        );
      }
    }
  },
  tcKimlik: {
    label: 'TC Kimlik No',
    type: String,
    min: 11,
    max: 11,
    custom() {
      const tckimlik = this.value.toString();
      const ad = this.field('name').value;
      const soyad = this.field('lastName').value;
      const dogumtarihi = this.field('dogumTarihi').value && moment.tz(new Date(this.field('dogumTarihi').value),'Europe/Istanbul').toDate().getFullYear();

      if (tckimlik.indexOf('000000000') === 0 && tckimlik.length === 11) {
        return true;
      }

      if (!M.L.TCKimlikFormatCheck(tckimlik)) {
        return 'tcKimlikHatali';
      }
      if (Meteor.isServer) {
        return M.L.TCKimlikDogrula(tckimlik, ad, soyad, dogumtarihi) ? true : 'tcKimlikHatali';
      }

      return true;
    },
    index: 1
  },
  cinsiyet: {
    label: 'Cinsiyet',
    type: String,
    allowedValues: M.E.Cinsiyet,
    index: 1,
    autoform: {
      class: 'browser-default',
      firstOption: 'Cinsiyet seçin',
      options() {
        return M.E.CinsiyetObjects.map(c => {
          const {
            label,
            name: value,
          } = c;
          return {
            label,
            value,
          };
        });
      }
    }
  },
  emails: {
    label: 'E-posta Adresi',
    type: [Object],
    minCount: 1,
    maxCount: 1
  },
  "emails.$.address": {
    label: 'E-posta Adresi',
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
        this.unSet();
      }
    }
  },
  "emails.$.verified": {
    type: Boolean,
    autoValue() {
      if (this.isSet) {
        return !!this.value;
      } else {
        return false;
      }
    },
    autoform: {
      type: 'hidden'
    }
  },
  kurum: {
    label: 'Kurum',
    type: String,
    index: 1,
    custom() {
      const kurum = this;
      const role = this.field('role');
      const user = M.C.Users.findOne({_id: this.userId});
      const userRole = !user ? 'mitolojix' : user.role;
      const kurumlar = M.C.Kurumlar.find().map(kurum => kurum._id);
      const tumu = _.union('mitolojix',kurumlar);
      if (kurum.isSet && !_.contains(tumu,kurum.value)) {
        return 'notAllowed';
      }
      if (kurum.isSet && kurum.value === 'mitolojix' && userRole !== 'mitolojix') {
        return 'yetkiYok'
      }
      if (kurum.isSet && role.isSet && ( (kurum.value === 'mitolojix' && role.value !== 'mitolojix') || (kurum.value !== 'mitolojix' && role.value === 'mitolojix') ) ) {
        return 'kurumRoluHatali'
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
      }
      if (kurum.isUpdate) {
        kurum.unset();
      }
    },
    autoform: {
      // TODO: selectDisabled yaptigimiz durumlarda custom icinde de handle edelim ki disaridan editleme de olmasin
      type() {
        if (Meteor.user() && Meteor.user().role !== 'mitolojix') {
          return 'hidden';
        } else {
          const formId = AutoForm.getFormId();
          const kurum = AutoForm.getFieldValue('kurum', formId);
          const formContext = AutoForm.getCurrentDataForForm(formId);
          const formType = formContext && formContext.type;
          if (kurum && formType === 'update') {
            return 'selectDisabled'
          } else {
            return 'select';
          }
        }
      },
      value() {
        if (Meteor.user() && Meteor.user().role !== 'mitolojix') {
          return Meteor.user().kurum;
        }
      },
      class: 'browser-default',
      firstOption: 'Kurum seçin',
      options() {
        let kurumlar = [];
        if (Meteor.user().role === 'mitolojix') {
          kurumlar = _.union({label: 'Mitolojix', value: 'mitolojix'}, M.C.Kurumlar.find({}, {sort: {isimCollate: 1}}).map(kurum =>  {
              return {
                label: kurum.isim,
                value: kurum._id,
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
  //TODO: rol okul icinde degistiginde temizlik yapmak gerekebilir
  role: {
    label: 'Rol',
    type: String,
    index: 1,
    custom() {
      const role = this;
      const user = M.C.Users.findOne({_id: this.userId});
      const userRole = !user ? 'mitolojix' : user.role;
      const kurum = this.field('kurum');
      const roles = M.E.Roles;
      if (role.isSet && !_.contains(roles,role.value)) {
        return 'notAllowed';
      }
      if (role.isSet && role.value === 'mitolojix' && userRole !== 'mitolojix') {
        return 'yetkiYok'
      }
      if (kurum.isSet && role.isSet && ( (kurum.value === 'mitolojix' && role.value !== 'mitolojix') || (kurum.value !== 'mitolojix' && role.value === 'mitolojix') ) ) {
        return 'kurumRoluHatali'
      }
      return true;
    },
    autoform: {
      // TODO: selectDisabled yaptigimiz durumlarda custom icinde de handle edelim ki disaridan editleme de olmasin
      type() {
        const formId = AutoForm.getFormId();
        const role = AutoForm.getFieldValue('role', formId);
        const formContext = AutoForm.getCurrentDataForForm(formId);
        const formType = formContext && formContext.type;
        if (formType !== 'update') {
          return 'select';
        } else {
          if (['ogrenci','mitolojix'].includes(role)) {
            return 'selectDisabled';
          } else {
            return 'select';
          }
        }
      },
      class: 'browser-default',
      firstOption: 'Rol seçin',
      options() {
        const formId = AutoForm.getFormId();
        const kurum = Meteor.user().role !== 'mitolojix' ? Meteor.user().kurum : AutoForm.getFieldValue('kurum', formId);
        const role = AutoForm.getFieldValue('role', formId);
        const formContext = AutoForm.getCurrentDataForForm(formId);
        const formType = formContext && formContext.type;
        let options = M.E.RoleObjects.map(r => {
          const {
            label,
            name: value,
          } = r;
          return {
            label,
            value,
          };
        });
        if (!kurum) {
          options = [];
        } else if (kurum === 'mitolojix') {
          options = [_.findWhere(options, {value : 'mitolojix'})];
        } else {
          options = _.reject(options, o => {
            return o.value === 'mitolojix';
          });
        }
        if (formType === 'update') {
          if (_.contains(['teknik','mudur','ogretmen'], role)) {
            options = _.reject(options, o => {
              return _.contains(['ogrenci','mitolojix'], o.value);
            });
          }
        }
        return options;
      }
    }
  },
  dersleri: {
    label: 'Dersleri',
    type: [String],
    index: 1,
    optional: true,
    custom() {
      const dersler = this.value;
      return !dersler ? true : _.uniq(dersler).length === dersler.length ? true : 'notUnique';
    },
    autoform: {
      type() {
        const formId = AutoForm.getFormId();
        const role = AutoForm.getFieldValue('role', formId);
        return role === 'ogretmen' ? 'select-checkbox' : 'hidden';
      },
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
  'dersleri.$': {
    label: 'Ders',
    type: String,
    allowedValues() {
      return M.C.Dersler.find({},{fields: {_id: 1}}).map(ders => ders._id);
    }
  },
  // TODO: this MUST be placed into an array containing egitimYili information
  sinif: {
    label: 'Sınıf',
    type: String,
    index: 1,
    optional: true,
    custom() {
      const role = this.field('role');
      const sinif = this;
      if (role.isSet && role.value === 'ogrenci' && !sinif.isSet) {
        return 'required';
      } else if (role.isSet && role.value === 'ogrenci' && sinif.isSet && !_.contains(M.E.Sinif,sinif.value)) {
        return 'notAllowed';
      } else {
        return true;
      }
    },
    autoValue() {
      const role = this.field('role');
      const sinif = this;
      if (role.isSet && role.value === 'ogrenci') {
        return sinif.value;
      } else {
        this.unset();
      }
    },
    autoform: {
      type() {
        const formId = AutoForm.getFormId();
        const role = AutoForm.getFieldValue('role', formId);
        return role === 'ogrenci' ? 'select' : 'hidden';
      },
      class: 'browser-default',
      firstOption: 'Sınıf seçin',
      options() {
        return M.E.Sinif.map(sinif => {
          return {
            label: M.L.enumLabel(sinif),
            value: sinif,
          };
        });
      }
    }
  },
  // TODO: this can be placed into an array containing egitimYili information
  sube: {
    label: 'Şube',
    type: String,
    index: 1,
    optional: true,
    custom() {
      const role = this.field('role');
      const sube = this;
      const sinif = this.field('sinif');
      if (role.isSet && role.value === 'ogrenci' && !sube.isSet) {
        return 'required';
      } else if (role.isSet && role.value === 'ogrenci' && sinif.isSet && sube.isSet && !_.contains(M.E.Sube,sube.value)) {
        return 'notAllowed';
      } else {
        return true;
      }
    },
    autoValue() {
      const role = this.field('role');
      const sube = this;
      if (role.isSet && role.value === 'ogrenci') {
        return sube.value;
      } else {
        this.unset();
      }
    },
    autoform: {
      type() {
        const formId = AutoForm.getFormId();
        const role = AutoForm.getFieldValue('role', formId);
        return role === 'ogrenci' ? 'select' : 'hidden';
      },
      class: 'browser-default',
      firstOption: 'Şube seçin',
      options() {
        return M.E.Sube.map(sube => {
          return {
            label: sube,
            value: sube,
          };
        });
      }
    }
  }
});

M.C.Users.SchemaDecorators = new SimpleSchema({
  avatar: {
    type: String,
    defaultValue: 'default',
    autoform: {
      omit: true
    }
  },
  karakter: {
    type: String,
    defaultValue: 'default',
    autoform: {
      omit: true
    }
  },
  aktif: {
    type: Boolean,
    defaultValue: true,
    index: 1,
    autoform: {
      omit: true
    }
  },
  // TODO: this can be placed into an array containing egitimYili information
  puan: {
    type: Number,
    optional: true,
    autoValue() {
      const role = this.field('role');
      const puan = this;
      if (role.isSet && role.value === 'ogrenci') {
        return puan.value;
      } else {
        this.unset();
      }
    },
    autoform: {
      omit: true
    }
  },
  createdAt: {
    type: Date,
    autoform: {
      omit: true
    }
  },
  createdBy: {
    type: String,
    autoform: {
      omit: true
    }
  },
  modifiedAt: {
    type: Date,
    optional: true,
    autoform: {
      omit: true
    }
  },
  crudBy: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  services: {
    type: Object,
    blackbox: true,
    optional: true,
    autoform: {
      omit: true
    }
  },
  status: {
    type: Object,
    optional: true,
    autoform: {
      omit: true
    }
  },
  'status.online': {
    type: Boolean,
    optional: true,
    index: 1,
    autoform: {
      omit: true
    }
  },
  'status.serverId': {
    type: String,
    optional: true,
    index: 1,
    autoform: {
      omit: true
    }
  },
  heartbeat: {
    type: Date,
    optional: true,
    index: 1,
    autoform: {
      omit: true
    }
  },
  _version: {
    type: Number,
    optional: true,
    autoform: {
      omit: true
    }
  },
  nameCollate: {
    type: String,
    autoValue() {
      const name = this.field('name');
      let sortCode='0';
      if (name.isSet) {
        if (Meteor.isServer) {
          sortCode = Collate(name.value);
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
  lastNameCollate: {
    type: String,
    autoValue() {
      const lastName = this.field('lastName');
      let sortCode='0';
      if (lastName.isSet) {
        if (Meteor.isServer) {
          sortCode = Collate(lastName.value);
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
  }
});

M.C.Users.attachSchema(M.C.Users.Schema);
M.C.Users.attachSchema(M.C.Users.SchemaDecorators);

if (Meteor.isServer) {
  M.C.Users._ensureIndex({kurum: 1, tcKimlik: 1}, { unique: true });
}

if (Meteor.isServer) {
  M.C.Users.attachSchema(new SimpleSchema({
    'searchSource.language': {
      type: String,
      autoValue() {
        if (this.isInsert) {
          return "turkish";
        }
      }
    },
    'searchSource.name': {
      type: String,
      optional: true,
      autoValue() {
        const src = this.field('name');
        return src.isSet ? M.L.LatinizeLower(src.value) : this.unset();
      }
    },
    'searchSource.lastName': {
      type: String,
      optional: true,
      autoValue() {
        const src = this.field('lastName');
        return src.isSet ? M.L.LatinizeLower(src.value) : this.unset();
      }
    },
    'searchSource.kurum': {
      type: String,
      optional: true,
      autoValue() {
        const src = this.field('kurum');
        return this.isSet ? this.value : src.isSet ? M.L.LatinizeLower(src.value === 'mitolojix' ? 'mitolojix' : M.C.Kurumlar.findOne({_id: src.value}).isim) : this.unset();
      }
    },
    'searchSource.role': {
      type: String,
      optional: true,
      autoValue() {
        const src = this.field('role');
        return src.isSet ? M.L.LatinizeLower(M.L.enumLabel(src.value)) : this.unset();
      }
    },
    'searchSource.dersleri': {
      type: String,
      optional: true,
      autoValue() {
        const src = this.field('dersleri');
        if (!src.isSet) {
          this.unset();
        } else {
          return src.value.map(ders => {
            return M.L.LatinizeLower(M.C.Dersler.findOne({_id: ders}).isim);
          }).join(' ');
        }
      }
    },
    'searchSource.sinif': {
      type: String,
      optional: true,
      autoValue() {
        const src = this.field('sinif');
        return src.isSet ? M.L.LatinizeLower(M.L.enumLabel(src.value)) : this.unset();
      }
    },
    'searchSource.sube': {
      type: String,
      optional: true,
      autoValue() {
        const src = this.field('sube');
        return src.isSet ? M.L.LatinizeLower(src.value) : this.unset();
      }
    }
  }));
}

M.C.Users.attachBehaviour('timestampable',{createdAt: false, updatedAt: false, updatedBy: false});

M.C.Users.before.insert( (userId, doc) => {
  const role = doc.role;

  if (role && role !== 'ogretmen') {
    doc.dersleri = [];
  }

  if (role && role === 'ogretmen') {
    doc.dersleri = doc.dersleri || [];
  }

  if (role && role === 'ogrenci') {
    doc.puan = 0;
  }

});

M.C.Users.before.update((userId, doc, fields, modifier, options) => {
  const role = modifier.$set && modifier.$set.role;

  if (role && role !== 'ogrenci') {
    delete modifier.$set.sinif;
    delete modifier.$set.sube;
    delete modifier.$set.puan;
    modifier.$unset = modifier.$unset || {};
    modifier.$unset = _.extend(modifier.$unset, {sinif: ''});
    modifier.$unset = _.extend(modifier.$unset, {sube: ''});
    modifier.$unset = _.extend(modifier.$unset, {puan: ''});
  }

  if (role && role !== 'ogretmen') {
    modifier.$unset = modifier.$unset || {};
    delete modifier.$unset.dersleri;
    modifier.$set = modifier.$set || {};
    modifier.$set.dersleri = [];
  }

  if (role && role === 'ogrenci') {
    modifier.$set = modifier.$set || {};
    modifier.$set.puan = modifier.$set.puan || 0;
  }

  if (modifier.$unset && _.keys(modifier.$unset).length === 0) {
    delete modifier.$unset;
  }

  if (modifier.$set && _.keys(modifier.$set).length === 0) {
    delete modifier.$set;
  }

});

M.C.Users.vermongo({timestamps: true, userId: 'crudBy', ignoredFields: ['heartbeat','status','services','avatar','karakter','puan','searchSource']});

Meteor.methods({
  'kullaniciYeniMethod'(doc) {
    check(doc, M.C.Users.Schema);
    M.C.Users.Schema.clean(doc);
    if (Meteor.isServer) {
      const userRole = this.userId && M.C.Users.findOne({_id: this.userId}).role;
      const userKurum = this.userId && M.C.Users.findOne({_id: this.userId}).kurum;
      if (userRole && _.contains(['mitolojix','teknik'],userRole)) {
        if (userRole === 'teknik') {
          doc.kurum = userKurum;
        }
        const proposedUser = {
          email: doc.emails[0].address,
          profile: {
            tcKimlik: doc.tcKimlik,
            name: doc.name,
            lastName: doc.lastName,
            cinsiyet: doc.cinsiyet,
            dogumTarihi: doc.dogumTarihi,
            role: doc.role,
            kurum: doc.kurum,
            dersleri: doc.dersleri ? doc.dersleri : [],
            sinif: doc.sinif ? doc.sinif : '',
            sube: doc.sube ? doc.sube : '',
            aktif: doc.aktif
          }
        }
        if (doc.role === 'ogrenci') {
          proposedUser.password = doc.tcKimlik.substr(doc.tcKimlik.length - 6)
        }
        try {
          let accountCreationError = null;
          const userId = Accounts.createUser(proposedUser);
          if (userId) {
            if (doc.role !== 'ogrenci') {
              Accounts.sendEnrollmentEmail(userId);
            } else {
              try {
                const kurumAdi = M.C.Kurumlar.findOne({_id: doc.kurum}).isim
                Email.send({
                  to: doc.emails[0].address,
                  from: '"Mitolojix'+( Meteor.settings.public.ENV === 'PRODUCTION' ? '' : (' ' + Meteor.settings.public.ENV) )+'" <bilgi@mitolojix.com>',
                  subject: 'Hesap etkinleştirme',
                  text: 'Sevgili ' + doc.name + ',\n\n'
                  + kurumAdi + ' senin için Mitolojix Test Uygulaması\'nda bir hesap oluşturdu. Bu konuda henüz bilgin yoksa, önce öğretmenlerine danışabilirsin.'
                  + '\n\n'
                  + 'Mitolojix\'e giriş yapmak için www.mitolojix.com sitesinden "Öğrenci" seçeneğine tıkla. Giriş için e-posta adresini (' + doc.emails[0].address + ') ve şifre olarak T.C. Kimlik numaranın son 6 hanesini (' + proposedUser.password + ') kullanmalısın.'
                  + '\n\n'
                  + 'Bazı önemli hatırlatmalar:'
                  + '\n\n'
                  + '* Mitolojix, Google Chrome tarayıcıda çalışır. Bilgisayarında Google Chrome yoksa https://www.google.com/chrome/ adresinden indirip kurabilirsin.'
                  + '\n\n'
                  + '* Bilgisayarında Google Chrome varsa ve Mitolojix yüklenmezse, lütfen Google Chrome\'un en son sürümünü kurup, bilgisayarı yeniden başlat ve tekrar dene.'
                  + '\n\n'
                  + '* Ekran çözünürlüğün en az 1024x768 olmalı.'
                  + '\n\n'
                  + 'Bir sorunla karşılaştığında bilgi@mitolojix.com adresine e-posta atarak bize bildirirsen sana yardımcı olabiliriz.'
                  + '\n\n'
                  + 'Başarılar,\nMitolojix\n',
                  html: '<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sevgili ' + doc.name + ',</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">' + kurumAdi + ' senin için Mitolojix Test Uygulaması\'nda bir hesap oluşturdu. Bu konuda henüz bilgin yoksa, önce öğretmenlerine danışabilirsin.</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Mitolojix\'e giriş yapmak için <a href="http://www.mitolojix.com" target="_blank" style="color: #2196F3">www.mitolojix.com</a> sitesinden "Öğrenci" seçeneğine tıkla. Giriş için e-posta adresini (' + doc.emails[0].address + ') ve şifre olarak T.C. Kimlik numaranın son 6 hanesini (' + proposedUser.password + ') kullanmalısın.</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Bazı önemli hatırlatmalar:</p>'
                  + '<ul>'
                  + '<li style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Mitolojix, Google Chrome tarayıcıda çalışır. Bilgisayarında Google Chrome yoksa <a href="https://www.google.com/chrome/" target="_blank" style="color: #2196F3">buradan</a> indirip kurabilirsin.</li>'
                  + '<li style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Bilgisayarında Google Chrome varsa ve Mitolojix yüklenmezse, lütfen Google Chrome\'un en son sürümünü kurup, bilgisayarı yeniden başlat ve tekrar dene.</li>'
                  + '<li style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Ekran çözünürlüğün en az 1024x768 olmalı.</li>'
                  + '</ul>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Bir sorunla karşılaştığında <a href="mailto:bilgi@mitolojix.com" target="_blank" style="color: #2196F3">bilgi@mitolojix.com</a> adresine e-posta atarak bize bildirirsen sana yardımcı olabiliriz.</p>'
                  + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Başarılar,<br/>Mitolojix</p>'
                  + '</body></html>'
                });
              } catch(error) {
                console.log("Yeni tanimlanan " + userId + " id'li ogrenciye bilgilendirme mesaji gonderirken bilinmeyen bir hata olustu:\n", error)
              }
            }
          }
          return userId;
        } catch (error) {
          accountCreationError = error;
        }
        if (accountCreationError) {
          if (accountCreationError.errorType === 'Meteor.Error') {
            M.L.ThrowError(accountCreationError);
          } else {
            M.L.ThrowError({error: 'accountCreationError', reason: accountCreationError.err, details: accountCreationError});
          }
        }
      } else {
        M.L.ThrowError({error: '403', reason: 'Yetki yok', details: 'Yetki yok'})
      }
    }
  }
});

// TODO: EMAIL CHANGED Collection hook, set verified false by sending out verifyemail
// TODO: verifyemail templates
// TODO: send old address a warning in AFTER HOOK (this.previousvalue) that the address is changing
// TODO: email verified degilse iceri kabul etme, gerekirse verification tekrar iste

if (Meteor.isServer) {
  Security.defineMethod('userHasRole', {
    //fetch: [],
    //transform: null,
    allow(type, role, userId, doc, fields, modifier) {
      return M.L.userHasRole(userId,role);
    }
  });

  Security.defineMethod('userInDocKurum', {
    //fetch: [],
    //transform: null,
    allow(type, arg, userId, doc, fields, modifier) {
      return M.L.userInKurum(userId,doc.kurum);
    }
  });

  Security.defineMethod('userOwnsDoc', {
    //fetch: [],
    //transform: null,
    allow(type, arg, userId, doc, fields, modifier) {
      return userId === doc.createdBy;
    }
  });

  Security.permit([ 'insert' ]).collections([ Meteor.users ]).never().allowInClientCode();
  Security.permit([ 'update' ]).collections([ Meteor.users ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
  Security.permit([ 'update' ]).collections([ Meteor.users ]).ifLoggedIn().userHasRole('teknik').userInDocKurum().allowInClientCode();
  Security.permit([ 'remove' ]).collections([ Meteor.users ]).never().allowInClientCode();

  Meteor.methods({
    'setAvatar'(avatarId) {
      check(avatarId, String);
      const userId = this.userId;

      if (userId) {
        return M.C.Users.update({_id: userId}, {$set: {avatar: avatarId}});
      } else {
        throw new Meteor.Error('403', 'Unable to set avatar ID for the user');
      }
    },
    'setKarakter'(karakterId) {
      check(karakterId, String);
      const userId = this.userId;
      const karakter = M.C.Karakterler.findOne({_id: karakterId});

      if (karakter) {
        if (userId) {
          return M.C.Users.update({_id: userId}, {$set: {karakter: karakterId}});;
        } else {
          M.L.ThrowError({error: '403', reason: 'Unable to set karakter ID for the user', details: 'Unable to set karakter ID for the user'})
        }
      } else {
        M.L.ThrowError({error: '403', reason: 'Unable to set karakter ID for the user', details: 'Unable to set karakter ID for the user'})
      }
    },
    'getSifreZorlukFromToken'(token) {
      check(token, String);

      const user = M.C.Users.findOne({'services.password.reset.token': token});
      if (!user) {
        throw new Meteor.Error(403, 'Token expired');
      }

      const userId = user._id;

      const userKurum = user.kurum;
      const kurum = userKurum === 'mitolojix' ? 'mitolojix' : M.C.Kurumlar.findOne({_id: userKurum});
      const sifreZorluk = kurum === 'mitolojix' ? 'kolay' : kurum.sifre;

      return {
        userId,
        sifreZorluk,
      };

    },
    'checkPassword'(digest) {
      check(digest, String);
      const userId = this.userId;

      if (userId) {
        const user = M.C.Users.findOne({_id: userId});
        const password = {digest: digest, algorithm: 'sha-256'};
        const result = Accounts._checkPassword(user, password);
        return result.error == null;
      } else {
        return false;
      }
    }
  });

}
