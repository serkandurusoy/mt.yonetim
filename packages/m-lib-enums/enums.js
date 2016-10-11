M.E.ZorlukDereceleri = [1,2,3,4,5];

M.E.Levenshtein = [0,1,2,3,4,5];

M.E.GraphicsMagickNotInstalledMessage = 'Graphicsmagic library is not installed on the server. Cannot scale down images.';

M.E.BilinmeyenHataMessage = 'Bilinmeyen bir hata oluştu. Daha sonra tekrar deneyin.';

M.E.uploadMaxImage = 2 * 1024 * 1024; // 2MB
M.E.uploadMaxImageMessage = 'Yalnızca 2MB altındaki resim dosyaları yüklenebilir.';
M.E.uploadMaxPDF = 20 * 1024 * 1024; // 20MB
M.E.uploadMaxPDFMessage = 'Yalnızca 20MB altındaki PDF dosyaları yüklenebilir.';

M.E.PickadateOptions = {
  labelMonthNext: 'Sonraki ay',
  labelMonthPrev: 'Önceki ay',
  labelMonthSelect: 'Ay seçin',
  labelYearSelect: 'Yıl seçin',
  monthsFull: [ 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık' ],
  monthsShort: [ 'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara' ],
  weekdaysFull: [ 'Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi' ],
  weekdaysShort: [ 'Paz', 'Pts', 'Sal', 'Çar', 'Per', 'Cum', 'Cts' ],
  weekdaysLetter: [ 'Pa', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct' ],
  today: 'Bugün',
  clear: 'Temizle',
  close: 'Kapat',
  selectYears: true,
  selectMonths: true,
  firstDay: 1,
  format: 'dd.mm.yyyy',
  timezoneId: 'Europe/Istanbul',
  onClose: function() {
    $(document.activeElement).blur();
  }
};

M.E.ClockPickerOptions = {
  default: '00:00',           // default time, 'now' or '13:14' e.g.
  fromnow: 0,            // set default time to * milliseconds from now
  donetext: 'KAPAT',       // done button text
  autoclose: true,       // auto close when minute is selected
  ampmclickable: false,  // set am/pm button on itself
  darktheme: false,      // set to dark theme
  twelvehour: false,     // change to 12 hour AM/PM clock from 24 hour
  vibrate: false         // vibrate the device when dragging clock hand
};

M.E.CinsiyetObjects = [
  {name: 'kadin', label: 'Kadın'},
  {name: 'erkek', label: 'Erkek'}
];
M.E.Cinsiyet = _.pluck(M.E.CinsiyetObjects,'name');

M.E.SifreObjects = [
  {name: 'kolay', label: 'Kolay', detail: 'En az 6 karakter olmalı ve boşluk içermemeli.'},
  {name: 'orta', label: 'Orta', detail: 'En az 6 karakter olmalı, boşluk içermemeli, en az bir harf ve bir rakam içermeli.'},
  {name: 'zor', label: 'Zor', detail: 'En az 6 karakter olmalı, boşluk içermemeli, en az bir küçük harf, en az bir büyük harf, en az bir rakam ve en az bir noktalama işareti içermeli.'}
];
M.E.Sifre = _.pluck(M.E.SifreObjects,'name');

M.E.RoleObjects = [
  {name: 'mitolojix',label:'Mitolojix Personeli'},
  {name: 'teknik',label:'Teknik Sorumlu'},
  {name: 'mudur',label:'İdari Sorumlu'},
  {name: 'ogretmen',label:'Öğretmen'},
  {name: 'ogrenci',label:'Öğrenci'}
];
M.E.Roles = _.pluck(M.E.RoleObjects,'name');

M.E.EgitimYiliObjects = [];
_.each(_.range(2016, new Date().getFullYear() + 6, 1), function(yil) {
  var yilString = yil.toString() + '-' + (parseInt(yil)+1).toString();
  M.E.EgitimYiliObjects.push(
    {
      name: yilString,
      label: yilString
    }
  );
});
M.E.EgitimYili = _.pluck(M.E.EgitimYiliObjects,'name');

M.E.SinifObjects = [
  {name: '04', label: 'İlkokul 4. Sınıf', kisa: 'İlkokul 4'},
  {name: '05', label: 'Ortaokul 5. Sınıf', kisa: 'Ortaokul 5'},
  {name: '06', label: 'Ortaokul 6. Sınıf', kisa: 'Ortaokul 6'},
  {name: '07', label: 'Ortaokul 7. Sınıf', kisa: 'Ortaokul 7'},
  {name: '08', label: 'Ortaokul 8. Sınıf', kisa: 'Ortaokul 8'}
];
M.E.Sinif = _.pluck(M.E.SinifObjects,'name');

M.E.Sube = ['A','B','C','D','E','F','G','H','I','J'];

M.E.SoruTipiObjects = [
  {name: 'dogruYanlis', label: 'Doğru Yanlış'},
  {name: 'coktanTekSecmeli', label: 'Çoktan Tek Seçmeli'},
  {name: 'coktanCokSecmeli', label: 'Çoktan Çok Seçmeli'},
  {name: 'siralama', label: 'Sıralama'},
  {name: 'eslestirme', label: 'Eşleştirme'},
  {name: 'boslukDoldurma', label: 'Boşluk Doldurma'}
];
M.E.SoruTipi = _.pluck(M.E.SoruTipiObjects,'name');

M.E.SinavTipiObjects = [
  {name: 'alistirma', label: 'Alıştırma Testi'},
  {name: 'konuTarama', label: 'Konu Tarama Testi'},
  {name: 'deneme', label: 'Deneme Sınavı'},
  {name: 'canli', label: 'Canlı Sınav'}
];
M.E.SinavTipi = _.pluck(M.E.SinavTipiObjects,'name');

M.E.CanliStatusObjects = [
  {name: 'pending', label: 'başlamayı bekliyor'},
  {name: 'running', label: 'devam ediyor'},
  {name: 'paused', label: 'durduruldu'},
  {name: 'completed', label: 'bitirildi'}
];
M.E.CanliStatus = _.pluck(M.E.CanliStatusObjects,'name');

M.L.enumLabel = function(name) {
  var enumArray = _.flatten(_.map([M.E.CinsiyetObjects, M.E.SifreObjects, M.E.RoleObjects, M.E.EgitimYiliObjects, M.E.SinifObjects, M.E.SoruTipiObjects, M.E.SinavTipiObjects, M.E.CanliStatusObjects], function(o) {
    return _.map(o,function(e){
      return {
        name:e.name,
        label:e.label
      };
    });
  }));
  return _.findWhere(enumArray,{name:name}).label;
};
