M.C.setUpCollection = function(model) {
  check(model, {
    object: String,
    collection: String,
    schema: Object,
    permissions: {
      insert: String,
      update: String,
      remove: Match.Optional(String)
    },
    indexes: Match.Optional([{
      ix: Object,
      opt: Object
    }]),
    cloneable: Match.Optional(Boolean)
  });

  M.C[model.object] = new Mongo.Collection(model.collection);

  M.C[model.object].Schema = new SimpleSchema(model.schema);

  M.C[model.object].attachSchema(M.C[model.object].Schema);

  M.C[model.object].attachSchema(new SimpleSchema({
    aktif: {
      // TODO: Aktif/pasif'i kullan. Collection.findAktif vb gibi uygulamalar yapmaliyiz
      label: 'Aktif',
      type: Boolean,
      defaultValue: true,
      index: 1,
      autoform: {
        omit: true
      }
      /*autoform: {
        type: 'switch',
        trueLabel:"Aktif",
        falseLabel:"Pasif"
      }*/
    }
  }));

  if (model.cloneable) {
    M.C[model.object].attachSchema(new SimpleSchema({
      _clonedFrom: {
        type: Object,
        optional: true,
        autoValue: function() {
          if (this.isUpdate && this.isSet) {
            this.unset();
          }
        },
        autoform: {
          class : function() {
            var formId = AutoForm.getFormId();
            var cf = AutoForm.getFieldValue('_clonedFrom', formId);
            $('.autoform-object-field:has([name^="_clonedFrom"])').hide();
            return '';
          }
        }
      },
      '_clonedFrom._id': {
        type: String
      },
      '_clonedFrom._version': {
        type: Number
      }
    }));
  }

  M.C[model.object].attachBehaviour('timestampable');

  M.C[model.object].vermongo({timestamps: false, userId: false, ignoredFields: ['searchSource']});

  if (Meteor.isServer) {
    M.C[model.object].permit('insert').ifLoggedIn().userHasRole(model.permissions.insert).allowInClientCode();
    M.C[model.object].permit('update').ifLoggedIn().userHasRole(model.permissions.update).allowInClientCode();
    if (model.permissions.remove) {
      M.C[model.object].permit('remove').ifLoggedIn().userHasRole(model.permissions.remove).allowInClientCode();
    } else {
      M.C[model.object].permit('remove').never().allowInClientCode();
    }

    _.each(model.indexes, function (ix) {
      M.C[model.object]._ensureIndex(ix.ix, ix.opt)
    })
  }
};

if (Meteor.settings.public.APP === 'OYUN') {
  SimpleSchema.extendOptions({
    autoform: Match.Optional(Object)
  });
}

SimpleSchema.messages({
  required: '[label] boş bırakılamaz.',
  minString: '[label] en az [min] karakter olmalı.',
  maxString: '[label] en fazla [max] karakter olmalı.',
  minNumber: '[label] en az [min] olmalı.',
  maxNumber: '[label] en fazla [max] olmalı.',
  minDate: '[label] en erken [min] olmalı.',
  maxDate: '[label] en geç [max] olmalı.',
  minCount: '[label] için en az [minCount] değer girilmeli.',
  maxCount: '[label] için en fazla [maxCount] değer girilmeli.',
  noDecimal: '[label] bir tam sayı olmalı.',
  notAllowed: '[label] için "[value]" izin verilmeyen bir değer.',
  expectedString: '[label] bir metin tipinde olmalı.',
  expectedNumber: '[label] bir rakam tipinde olmalı.',
  expectedBoolean: '[label] bir doğru/yanlış tipinde olmalı.',
  expectedArray: '[label] bir dizi tipinde olmalı.',
  expectedObject: '[label] bir nesne tipinde olmalı.',
  expectedConstructor: '[label] uygun tipte veri olmalı.',
  regEx: [
    {msg: '[label] beklenen kalıba uygun değil.'},
    {exp: SimpleSchema.RegEx.Email, msg: 'Geçersiz e-posta adresi.'},
    {exp: SimpleSchema.RegEx.WeakEmail, msg: 'Geçersiz e-posta adresi.'},
    {exp: SimpleSchema.RegEx.Domain, msg: '[label] geçerli bir alan adı olmalı.'},
    {exp: SimpleSchema.RegEx.WeakDomain, msg: '[label] geçerli bir alan adı olmalı.'},
    {exp: SimpleSchema.RegEx.IP, msg: '[label] geçerli bir IPv4 veya IPv6 adresi olmalı.'},
    {exp: SimpleSchema.RegEx.IPv4, msg: '[label] geçerli bir IPv4 adresi olmalı.'},
    {exp: SimpleSchema.RegEx.IPv6, msg: '[label] geçerli bir IPv6 adresi olmalı.'},
    {exp: SimpleSchema.RegEx.Url, msg: '[label] geçerli bir internet adresi olmalı.'},
    {exp: SimpleSchema.RegEx.Id, msg: '[label] geçerli bir alfanümerik ID olmalı.'}
  ],
  keyNotInSchema: 'Veri yapısında olmayan alanlar kullanılamaz.',
  notUnique: 'Bu [label] bir başka kayıtta kullanılıyor.',
  tcKimlikHatali: 'Geçerli bir TC kimlik numarası girilmeli.',
  emailHatali: 'Geçersiz e-posta adresi.',
  telHatali: 'Geçerli bir telefon numarası girilmeli.',
  acilisSonraOlmali: 'Açılış zamanı şu andan sonra olmalı.',
  kapanisSonraOlmali: 'Kapanış zamanı açılış zamanından sonra olmalı.',
  sureIcinZamanYok: 'Test açılış ve kapanış zaman aralığı bu süre için yetersiz.',
  yanitlarSonraOlmali: 'Yanıt açılış zamanı test kapanış zamanından sonra olmalı.',
  dersKonusuHatali: 'Bu ders ve bu konu birarada kullanılamaz.',
  dersKazanimiHatali: 'Bu ders ve bu kazanım birarada kullanılamaz.',
  kurumRoluHatali: 'Bu kurum ve bu rol birarada kullanılamaz.',
  boslukFormatiHatali: 'En az bir adet [BOŞLUK] girilmeli.',
  enAzBirDogruOlmali: 'En az bir seçenek doğru olarak işaretlenmeli.',
  sadeceBirDogruOlmali: 'Sadece bir seçenek doğru olarak işaretlenmeli.',
  metinGorselBiriniGir: 'Metin veya görselden biri girilmeli.',
  notUniqueYanitlar: 'Seçenek metin ve görselleri birbirlerinden farklı olmalı.',
  yetkiYok: '[label] için bu kaydı oluşturmaya yetkiniz yok.',
  muhurTukendi: 'Bu derse ait mühürler tükendi.',
  sorusuzSinavTaslakKalmali: 'Soru eklenmemiş bir testin taslak işaretini kaldıramazsınız.',
  sorusuzSinavKilitsizKalmali: 'Soru eklenmemiş bir testi kilitleyemezsiniz.',
  taslakSoruKilitlenemez: 'Taslak haldeki bir soruyu kilitleyemezsiniz.',
  taslakSinavKilitlenemez: 'Taslak haldeki bir testi kilitleyemezsiniz.',
  sinavdakiSoruTaslakYapilamaz: 'Bu soru bir teste eklenmiş, taslak olarak işaretleyemezsiniz.',
  sifreKolay: _.findWhere(M.E.SifreObjects, {name: 'kolay'}).detail,
  sifreOrta: _.findWhere(M.E.SifreObjects, {name: 'orta'}).detail,
  sifreZor: _.findWhere(M.E.SifreObjects, {name: 'zor'}).detail
});
