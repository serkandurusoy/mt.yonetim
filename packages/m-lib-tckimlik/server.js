M.L.TCKimlikDogrula = function(tckimlik, ad, soyad, dogumtarihi) {
  var url;
  var args;
  var dogrulaMethod;
  var tarih = moment.tz(new Date(dogumtarihi),'Europe/Istanbul').toDate();
  var dogumgun = tarih.getDate();
  var dogumay = tarih.getMonth() + 1;
  var dogumyil = tarih.getFullYear();
  if (tckimlik.substr(0,1) === '9') {
    dogrulaMethod = 'YabanciKimlikNoDogrula';
    url = 'https://tckimlik.nvi.gov.tr/Service/KPSPublicYabanciDogrula.asmx?WSDL';
    args = {
      KimlikNo: tckimlik,
      Ad: ad.toLocaleUpperCase(),
      Soyad: soyad.toLocaleUpperCase(),
      DogumGun: dogumgun,
      DogumAy: dogumay,
      DogumYil: dogumyil
    };
  } else {
    dogrulaMethod = 'TCKimlikNoDogrula';
    url = 'https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL';
    args = {
      TCKimlikNo: tckimlik,
      Ad: ad.toLocaleUpperCase(),
      Soyad: soyad.toLocaleUpperCase(),
      DogumYili: dogumyil
    };
  }

  try {
    var client = Soap.createClient(url);
    var result = client[dogrulaMethod](args);
    if (result[dogrulaMethod + 'Result']) {
      return result[dogrulaMethod + 'Result'];
    } else {
      throw new Meteor.Error('tcKimlikHatali');
    }
  } catch (err) {
    if(err.error === 'soap-creation') {
      console.log('SOAP Client creation failed');
      return false;
    } else if (err.error === 'tcKimlikHatali') {
      throw new Meteor.Error('tcKimlikHatali');
    } else if (err.error === 'soap-method') {
      throw new Meteor.Error('tcKimlikHatali');
    } else {
      console.log('Unknown SOAP error:');
      console.log(err);
      return false;
    }
  }

};


