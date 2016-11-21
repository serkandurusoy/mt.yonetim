import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { XLSX } from 'meteor/huaming:js-xlsx';

import { M } from 'meteor/m:lib-core';

import './yukle.html';

Template.ogrenciYukleme.onCreated(function() {
  this.disabled = new ReactiveVar("disabled");
  this.ogrenciListesi = new ReactiveVar(null);
  this.status = new ReactiveDict();
});

Template.ogrenciYukleme.helpers({
  kurumlar() {
    const kurumlarCursor = M.C.Kurumlar.find({}, {fields: {_id:1, isim: 1, isimCollate: 1}, sort: {isimCollate: 1}});
    return kurumlarCursor.count() && kurumlarCursor;
  },
  disabled(){
    return Template.instance().disabled.get();
  },
  ogrenciListesi() {
    return Template.instance().ogrenciListesi.get();
  },
  checkStatus(sira) {
    const status = Template.instance().status.get(sira);
    return status ? status : 'new';
  }
});

Template.ogrenciYukleme.events({
  'change #kurum'(e,t) {
    t.$('#ogrenciler,#ogrencilerpath').val("");
    t.ogrenciListesi.set(null);
    const kurum = t.$('#kurum').val();
    t.disabled.set(!!kurum ? "": "disabled");
    if (!kurum) {
      toastr.error('Öğrencilerin yükleneceği kurum seçilmeli.');
    }
  },
  'change #ogrenciler'(e,t) {
    const fixdata = (data) => {
      let o = "", l = 0, w = 10240;
      for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
      o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
      return o;
    };
    const file = e.target.files[0];
    if (file && s.endsWith(file.name,'.xls') && file.type === 'application/vnd.ms-excel') {
      let reader = new FileReader();
      reader.onload = e => {
        const data = e.target.result;
        const workbook = data && XLSX.read(btoa(fixdata(data)), {type: 'base64'});
        const first_sheet_name = workbook && workbook.SheetNames[0];
        const worksheet = first_sheet_name && workbook.Sheets[first_sheet_name];
        let ogrenciler = worksheet && XLSX.utils.sheet_to_json(worksheet);
        if (ogrenciler) {
          t.$('#ogrenciler,#ogrencilerpath').val("");
          t.ogrenciListesi.set(null);
          t.status.clear();
          toastr.success('Dosya okunuyor. Lütfen bekleyin.', null, {onHidden() {
            ogrenciler = _.filter(ogrenciler, ogrenci => {
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
                  custom() {
                    const tckimlik = this.value.toString();
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
                  custom() {
                    const dogumTarihi = this.value.toString();
                    return moment(dogumTarihi, "YYYY-MM-DD").isValid() ? true : 'notAllowed'
                  }
                },
                EPOSTAADRESI: {
                  type: String,
                  min: 10,
                  max: 128,
                  regEx: SimpleSchema.RegEx.Email,
                  custom() {
                    const value = this.value;
                    const testFormat = M.L.TestEmail(M.L.Trim(value).toLowerCase());
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
              toastr.success('Dosya okundu. Listelenen kayıtlar yükleme için denenecekler.');
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
  'click [data-trigger="yukle"]'(e,t) {
    e.preventDefault();
    t.$('[data-trigger="yukle"]').css('visibility','hidden');
    const ogrenciler = t.ogrenciListesi.get();
    ogrenciler.forEach(ogrenci => {
      Meteor.call('kullaniciYeniMethod', {
        kurum: t.$('#kurum').val(),
        name: ogrenci.AD,
        lastName: ogrenci.SOYAD,
        dogumTarihi: moment(ogrenci.DOGUMTARIHI, "YYYY-MM-DD").toDate(),
        tcKimlik: ogrenci.TCKIMLIKNO,
        cinsiyet: ogrenci.CINSIYET,
        emails: [{address: ogrenci.EPOSTAADRESI, verified: true}],
        role: 'ogrenci',
        sinif: ogrenci.SINIF,
        sube: ogrenci.SUBE
      }, (err,res) => {
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
