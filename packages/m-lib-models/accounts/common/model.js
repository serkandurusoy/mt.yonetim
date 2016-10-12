M.C.Users = Meteor.users;

M.C.Users.Schema = new SimpleSchema({
  name: {
    label: 'Ad',
    type: String,
    index: 1,
    min: 2,
    max:32,
    autoValue: function() {
      if (this.isSet) {
        var value = this.value;
        return M.L.Trim(value).localeTitleize();
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
    autoValue: function() {
      if (this.isSet) {
        var value = this.value;
        return M.L.Trim(value).localeTitleize();
      } else {
        this.unset();
      }
    }
  },
  dogumTarihi: {
    label: 'Doğum Tarihi',
    type: Date,
    autoValue: function() {
      var self = this;
      if (self.isSet) {
        return moment.tz(new Date(self.value.getFullYear(),self.value.getMonth(),self.value.getDate()),'Europe/Istanbul').toDate();
      }
    },
    custom: function() {
      var tcKimlik = this.field('tcKimlik');
      var dg = this.value;
      if (_.contains(['00000000001','00000000002','00000000003'], tcKimlik.value)) {
        return true;
      } else {
        var min = moment.tz(new Date(new Date().getFullYear() - 80,new Date().getMonth(),new Date().getDate()),'Europe/Istanbul').toDate();
        var max = moment.tz(new Date(new Date().getFullYear() - 5,new Date().getMonth(),new Date().getDate()),'Europe/Istanbul').toDate();
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
      pickadateOptions: function() {
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
    custom: function() {
      var tckimlik = this.value.toString();
      var ad = this.field('name').value;
      var soyad = this.field('lastName').value;
      var dogumyili = this.field('dogumTarihi').value && moment.tz(new Date(this.field('dogumTarihi').value),'Europe/Istanbul').toDate().getFullYear();

      if (tckimlik.indexOf('000000000') === 0 && tckimlik.length === 11) {
        return true;
      }

      if (!M.L.TCKimlikFormatCheck(tckimlik)) {
        return 'tcKimlikHatali';
      }
      if (Meteor.isServer) {
        return M.L.TCKimlikDogrula(tckimlik, ad, soyad, dogumyili) ? true : 'tcKimlikHatali';
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
      options: function() {
        var options = _.map(M.E.CinsiyetObjects, function(c) {
          return {
            label: c.label, value: c.name
          };
        });
        return options;
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
    custom: function() {
      var value = this.value;
      var testFormat = M.L.TestEmail(M.L.Trim(value).toLowerCase());
      if (!testFormat) {
        return 'emailHatali';
      }
      return true;
    },
    autoValue: function() {
      var value = this.value;
      if (this.isSet) {
        return M.L.Trim(value).toLowerCase();
      } else {
        this.unSet();
      }
    }
  },
  "emails.$.verified": {
    type: Boolean,
    autoValue: function() {
      var value = this.value;
      if (this.isSet) {
        return !!value;
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
    custom: function() {
      var kurum = this;
      var role = this.field('role');
      var user = M.C.Users.findOne({_id: this.userId});
      var userRole = !user ? 'mitolojix' : user.role;
      var kurumlar = M.C.Kurumlar.find().map(function(kurum) {return kurum._id;});
      var tumu = _.union('mitolojix',kurumlar);
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
    autoValue: function() {
      var kurum = this;
      var user = M.C.Users.findOne({_id: this.userId});
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
      type: function() {
        if (Meteor.user() && Meteor.user().role !== 'mitolojix') {
          return 'hidden';
        } else {
          var formId = AutoForm.getFormId();
          var kurum = AutoForm.getFieldValue('kurum', formId);
          var formContext = AutoForm.getCurrentDataForForm(formId);
          var formType = formContext && formContext.type;
          if (kurum && formType === 'update') {
            return 'selectDisabled'
          } else {
            return 'select';
          }
        }
      },
      value: function() {
        if (Meteor.user() && Meteor.user().role !== 'mitolojix') {
          return Meteor.user().kurum;
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
  //TODO: rol okul icinde degistiginde temizlik yapmak gerekebilir
  role: {
    label: 'Rol',
    type: String,
    index: 1,
    custom: function() {
      var role = this;
      var user = M.C.Users.findOne({_id: this.userId});
      var userRole = !user ? 'mitolojix' : user.role;
      var kurum = this.field('kurum');
      var roles = M.E.Roles;
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
      type: function() {
        var formId = AutoForm.getFormId();
        var role = AutoForm.getFieldValue('role', formId);
        var formContext = AutoForm.getCurrentDataForForm(formId);
        var formType = formContext && formContext.type;
        if (formType !== 'update') {
          return 'select';
        } else {
          if (_.contains(['ogrenci','mitolojix'], role)) {
            return 'selectDisabled';
          } else {
            return 'select';
          }
        }
      },
      class: 'browser-default',
      firstOption: 'Rol seçin',
      options: function() {
        var formId = AutoForm.getFormId();
        var kurum = Meteor.user().role !== 'mitolojix' ? Meteor.user().kurum : AutoForm.getFieldValue('kurum', formId);
        var role = AutoForm.getFieldValue('role', formId);
        var formContext = AutoForm.getCurrentDataForForm(formId);
        var formType = formContext && formContext.type;
        var options = _.map(M.E.RoleObjects, function(r) {
          return {
            label: r.label, value: r.name
          };
        });
        if (!kurum) {
          options = [];
        } else if (kurum === 'mitolojix') {
          options = [_.findWhere(options, {value : 'mitolojix'})];
        } else {
          options = _.reject(options, function(o) {
            return o.value === 'mitolojix';
          });
        }
        if (formType === 'update') {
          if (_.contains(['teknik','mudur','ogretmen'], role)) {
            options = _.reject(options, function(o) {
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
    custom: function() {
      var dersler = this.value;
      return !dersler ? true : _.uniq(dersler).length === dersler.length ? true : 'notUnique';
    },
    autoform: {
      type: function() {
        var formId = AutoForm.getFormId();
        var role = AutoForm.getFieldValue('role', formId);
        return role === 'ogretmen' ? 'select-checkbox' : 'hidden';
      },
      options: function() {
        return M.C.Dersler.find().map(function(ders) {return {label: ders.isim, value: ders._id};});
      }
    }
  },
  'dersleri.$': {
    label: 'Ders',
    type: String,
    allowedValues: function() {
      return M.C.Dersler.find({},{fields: {_id: 1}}).map(function(ders) {return ders._id;});
    }
  },
  // TODO: this MUST be placed into an array containing egitimYili information
  sinif: {
    label: 'Sınıf',
    type: String,
    index: 1,
    optional: true,
    custom: function() {
      var role = this.field('role');
      var sinif = this;
      if (role.isSet && role.value === 'ogrenci' && !sinif.isSet) {
        return 'required';
      } else if (role.isSet && role.value === 'ogrenci' && sinif.isSet && !_.contains(M.E.Sinif, sinif.value)) {
        return 'notAllowed';
      } else {
        return true;
      }
    },
    autoValue: function() {
      var role = this.field('role');
      var sinif = this;
      if (role.isSet && role.value === 'ogrenci') {
        return sinif.value;
      } else {
        this.unset();
      }
    },
    autoform: {
      type: function() {
        var formId = AutoForm.getFormId();
        var role = AutoForm.getFieldValue('role', formId);
        return role === 'ogrenci' ? 'select' : 'hidden';
      },
      class: 'browser-default',
      firstOption: 'Sınıf seçin',
      options: function() {
        return _.map(M.E.Sinif, function(sinif) {return {label: M.L.enumLabel(sinif), value: sinif};});
      }
    }
  },
  // TODO: this can be placed into an array containing egitimYili information
  sube: {
    label: 'Şube',
    type: String,
    index: 1,
    optional: true,
    custom: function() {
      var role = this.field('role');
      var sube = this;
      var sinif = this.field('sinif');
      if (role.isSet && role.value === 'ogrenci' && !sube.isSet) {
        return 'required';
      } else if (role.isSet && role.value === 'ogrenci' && sinif.isSet && sube.isSet && !_.contains(M.E.Sube, sube.value)) {
        return 'notAllowed';
      } else {
        return true;
      }
    },
    autoValue: function() {
      var role = this.field('role');
      var sube = this;
      if (role.isSet && role.value === 'ogrenci') {
        return sube.value;
      } else {
        this.unset();
      }
    },
    autoform: {
      type: function() {
        var formId = AutoForm.getFormId();
        var role = AutoForm.getFieldValue('role', formId);
        return role === 'ogrenci' ? 'select' : 'hidden';
      },
      class: 'browser-default',
      firstOption: 'Şube seçin',
      options: function() {
        return M.E.Sube.map(function(sube) {return {label: sube, value: sube};});
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
    autoValue: function() {
      var role = this.field('role');
      var puan = this;
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
    autoValue: function() {
      var name = this.field('name');
      var sortCode='0';
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
    autoValue: function() {
      var lastName = this.field('lastName');
      var sortCode='0';
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
      autoValue: function() {
        if (this.isInsert) {
          return "turkish";
        }
      }
    },
    'searchSource.name': {
      type: String,
      optional: true,
      autoValue: function() {
        var src = this.field('name');
        return src.isSet ? M.L.LatinizeLower(src.value) : this.unset();
      }
    },
    'searchSource.lastName': {
      type: String,
      optional: true,
      autoValue: function() {
        var src = this.field('lastName');
        return src.isSet ? M.L.LatinizeLower(src.value) : this.unset();
      }
    },
    'searchSource.kurum': {
      type: String,
      optional: true,
      autoValue: function() {
        var src = this.field('kurum');
        return this.isSet ? this.value : src.isSet ? M.L.LatinizeLower(src.value === 'mitolojix' ? 'mitolojix' : M.C.Kurumlar.findOne({_id: src.value}).isim) : this.unset();
      }
    },
    'searchSource.role': {
      type: String,
      optional: true,
      autoValue: function() {
        var src = this.field('role');
        return src.isSet ? M.L.LatinizeLower(M.L.enumLabel(src.value)) : this.unset();
      }
    },
    'searchSource.dersleri': {
      type: String,
      optional: true,
      autoValue: function() {
        var src = this.field('dersleri');
        if (!src.isSet) {
          this.unset();
        } else {
          return _.map(src.value, function(ders) {
            return M.L.LatinizeLower(M.C.Dersler.findOne({_id: ders}).isim);
          }).join(' ');
        }
      }
    },
    'searchSource.sinif': {
      type: String,
      optional: true,
      autoValue: function() {
        var src = this.field('sinif');
        return src.isSet ? M.L.LatinizeLower(M.L.enumLabel(src.value)) : this.unset();
      }
    },
    'searchSource.sube': {
      type: String,
      optional: true,
      autoValue: function() {
        var src = this.field('sube');
        return src.isSet ? M.L.LatinizeLower(src.value) : this.unset();
      }
    }
  }));
}

M.C.Users.attachBehaviour('timestampable',{createdAt: false, updatedAt: false, updatedBy: false});

M.C.Users.before.insert(function (userId, doc) {
  var role = doc.role;

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

M.C.Users.before.update(function (userId, doc, fields, modifier, options) {
  var role = modifier.$set && modifier.$set.role;

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
  'kullaniciYeniMethod': function(doc) {
    check(doc, M.C.Users.Schema);
    M.C.Users.Schema.clean(doc);
    if (Meteor.isServer) {
      var userRole = this.userId && M.C.Users.findOne({_id: this.userId}).role;
      var userKurum = this.userId && M.C.Users.findOne({_id: this.userId}).kurum;
      if (userRole && _.contains(['mitolojix','teknik'], userRole)) {
        if (userRole === 'teknik') {
          doc.kurum = userKurum;
        }
        var proposedUser = {
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
          var accountCreationError = null;
          var userId = Accounts.createUser(proposedUser);
          if (userId) {
            if (doc.role !== 'ogrenci') {
              Accounts.sendEnrollmentEmail(userId);
            } else {
              try {
                var kurumAdi = M.C.Kurumlar.findOne({_id: doc.kurum}).isim
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
    allow: function (type, role, userId, doc, fields, modifier) {
      return M.L.userHasRole(userId,role);
    }
  });

  Security.defineMethod('userInDocKurum', {
    //fetch: [],
    //transform: null,
    allow: function (type, arg, userId, doc, fields, modifier) {
      return M.L.userInKurum(userId,doc.kurum);
    }
  });

  Security.defineMethod('userOwnsDoc', {
    //fetch: [],
    //transform: null,
    allow: function (type, arg, userId, doc, fields, modifier) {
      return userId === doc.createdBy;
    }
  });

  Security.permit([ 'insert' ]).collections([ Meteor.users ]).never().allowInClientCode();
  Security.permit([ 'update' ]).collections([ Meteor.users ]).ifLoggedIn().userHasRole('mitolojix').allowInClientCode();
  Security.permit([ 'update' ]).collections([ Meteor.users ]).ifLoggedIn().userHasRole('teknik').userInDocKurum().allowInClientCode();
  Security.permit([ 'remove' ]).collections([ Meteor.users ]).never().allowInClientCode();

  Meteor.methods({
    'setAvatar': function(avatarId) {
      check(avatarId, String);
      var userId = this.userId;

      if (userId) {
        var result = M.C.Users.update({_id: userId}, {$set: {avatar: avatarId}});
        return result;
      } else {
        throw new Meteor.Error('403', 'Unable to set avatar ID for the user');
      }
    },
    'setKarakter': function(karakterId) {
      check(karakterId, String);
      var userId = this.userId;
      var karakter = M.C.Karakterler.findOne({_id: karakterId});

      if (karakter) {
        if (userId) {
          var result = M.C.Users.update({_id: userId}, {$set: {karakter: karakterId}});
          return result;
        } else {
          M.L.ThrowError({error: '403', reason: 'Unable to set karakter ID for the user', details: 'Unable to set karakter ID for the user'})
        }
      } else {
        M.L.ThrowError({error: '403', reason: 'Unable to set karakter ID for the user', details: 'Unable to set karakter ID for the user'})
      }
    },
    'getSifreZorlukFromToken': function(token) {
      check(token, String);

      var user = M.C.Users.findOne({'services.password.reset.token': token});
      if (!user) {
        throw new Meteor.Error(403, 'Token expired');
      }

      var userId = user._id;

      var userKurum = user.kurum;
      var kurum = userKurum === 'mitolojix' ? 'mitolojix' : M.C.Kurumlar.findOne({_id: userKurum});
      var sifreZorluk = kurum === 'mitolojix' ? 'kolay' : kurum.sifre;

      return {
        userId: userId,
        sifreZorluk: sifreZorluk
      };

    },
    'checkPassword': function(digest) {
      check(digest, String);
      var userId = this.userId;

      if (userId) {
        var user = M.C.Users.findOne({_id: userId});
        var password = {digest: digest, algorithm: 'sha-256'};
        var result = Accounts._checkPassword(user, password);
        return result.error == null;
      } else {
        return false;
      }
    }
  });

}
