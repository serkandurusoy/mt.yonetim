Template.ogrenciYukleme.onCreated(function() {
  this.disabled = new ReactiveVar("disabled");
  this.ogrenciListesi = new ReactiveVar(null);
  this.status = new ReactiveDict();
});

Template.ogrenciYukleme.helpers({
  kurumlar: function() {
    var kurumlarCursor = M.C.Kurumlar.find({}, {fields: {_id:1, isim: 1, isimCollate: 1}, sort: {isimCollate: 1}});
    return kurumlarCursor.count() && kurumlarCursor;
  },
  disabled: function(){
    return Template.instance().disabled.get();
  },
  ogrenciListesi: function() {
    return Template.instance().ogrenciListesi.get();
  },
  checkStatus: function(sira) {
    var status = Template.instance().status.get(sira);
    return status ? status : 'new';
  }
});

Template.ogrenciYukleme.events({
  'change #kurum': function(e,t) {
    t.$('#ogrenciler,#ogrencilerpath').val("");
    t.ogrenciListesi.set(null);
    var kurum = t.$('#kurum').val();
    t.disabled.set(!!kurum ? "": "disabled");
    if (!kurum) {
      toastr.error('Öğrencilerin yükleneceği kurum seçilmeli.');
    }
  },
  'change #ogrenciler': function(e,t) {
    var fixdata = function(data) {
      var o = "", l = 0, w = 10240;
      for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
      o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
      return o;
    };
    var file = e.target.files[0];
    if (file && s.endsWith(file.name,'.xls') && file.type === 'application/vnd.ms-excel') {
      var reader = new FileReader();
      reader.onload = function(e) {
        var data = e.target.result;
        var workbook = data && XLSX.read(btoa(fixdata(data)), {type: 'base64'});
        var first_sheet_name = workbook && workbook.SheetNames[0];
        var worksheet = first_sheet_name && workbook.Sheets[first_sheet_name];
        var ogrenciler = worksheet && XLSX.utils.sheet_to_json(worksheet);
        if (ogrenciler) {
          t.$('#ogrenciler,#ogrencilerpath').val("");
          t.ogrenciListesi.set(null);
          t.status.clear();
          toastr.success('Dosya okunuyor. Lütfen bekleyin.', null, {onHidden: function() {
            ogrenciler = _.filter(ogrenciler, function (ogrenci) {
              return Match.test(ogrenci, new SimpleSchema({
                __rowNum__: {
                  type: Number,
                  min: 1
                },
                AD: {
                  type: String,
                  min: 2,
                  max: 32
                },
                SOYAD: {
                  type: String,
                  min: 2,
                  max: 32
                },
                CINSIYET: {
                  type: String,
                  allowedValues: M.E.Cinsiyet
                },
                TCKIMLIKNO: {
                  type: String,
                  min: 11,
                  max: 11,
                  custom: function () {
                    var tckimlik = this.value.toString();
                    if (tckimlik.indexOf('000000000') === 0 && tckimlik.length === 11) {
                      return true;
                    }
                    if (!M.L.TCKimlikFormatCheck(tckimlik)) {
                      return 'notAllowed';
                    }
                    return true;
                  }
                },
                DOGUMTARIHI: {
                  type: String,
                  min: 10,
                  max: 10,
                  custom: function () {
                    var dogumTarihi = this.value.toString();
                    return moment(dogumTarihi, "YYYY-MM-DD").isValid() ? true : 'notAllowed'
                  }
                },
                EPOSTAADRESI: {
                  type: String,
                  min: 10,
                  max: 128,
                  regEx: SimpleSchema.RegEx.Email,
                  custom: function () {
                    var value = this.value;
                    var testFormat = M.L.TestEmail(M.L.Trim(value).toLowerCase());
                    if (!testFormat) {
                      return 'notAllowed';
                    }
                    return true;
                  }
                },
                SINIF: {
                  type: String,
                  allowedValues: M.E.Sinif
                },
                SUBE: {
                  type: String,
                  allowedValues: M.E.Sube
                }
              }))
            });
            if (ogrenciler.length > 0) {
              t.ogrenciListesi.set(ogrenciler);
              toastr.success('Dosya okundu. Aşağıdaki kayıtlar yükleme için denenecekler.');
            } else {
              t.ogrenciListesi.set(null);
              toastr.error('Dosyada yüklenmeye uygun kayıt bulunamadı.');
            }
          }});
        } else {
          t.$('#ogrenciler,#ogrencilerpath').val("");
          t.ogrenciListesi.set(null);
          toastr.error('Bilinmeyen bir hata oluştu. Yüklenen dosya okunamadı.');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      t.$('#ogrenciler,#ogrencilerpath').val("");
      t.ogrenciListesi.set(null);
      toastr.error('XLS uzantılı ve geçerli bir Excel dosyası seçilmeli.');
    }
  },
  'click [data-trigger="yukle"]': function(e,t) {
    e.preventDefault();
    t.$('[data-trigger="yukle"]').css('visibility','hidden');
    var ogrenciler = t.ogrenciListesi.get();
    _.each(ogrenciler, function(ogrenci) {
      Meteor.call('kullaniciYeniMethod', {
        kurum: t.$('#kurum').val(),
        name: ogrenci.AD,
        lastName: ogrenci.SOYAD,
        dogumTarihi: moment(ogrenci.DOGUMTARIHI, "YYYY-MM-DD").toDate(),
        tcKimlik: ogrenci.TCKIMLIKNO,
        cinsiyet: ogrenci.CINSIYET,
        emails: [{address: ogrenci.EPOSTAADRESI, verified: false}],
        role: 'ogrenci',
        sinif: ogrenci.SINIF,
        sube: ogrenci.SUBE
      }, function(err,res) {
        if (res) {
          t.status.set(ogrenci.__rowNum__,'success')
        }
        if (err) {
          t.status.set(ogrenci.__rowNum__,'error')
        }
      })
    })
  }
});
