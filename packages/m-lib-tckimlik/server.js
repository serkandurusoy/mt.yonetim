M.L.TCKimlikDogrula = (tckimlik, ad, soyad, dogumtarihi) => {
  let url;
  let args;
  let dogrulaMethod;
  const tarih = moment.tz(new Date(dogumtarihi),'Europe/Istanbul').toDate();
  const dogumgun = tarih.getDate();
  const dogumay = tarih.getMonth() + 1;
  const dogumyil = tarih.getFullYear();
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
    const client = Soap.createClient(url);
    const result = client[dogrulaMethod](args);
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


