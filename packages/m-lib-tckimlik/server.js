M.L.TCKimlikDogrula = function(tckimlik, ad, soyad, dogumyili) {
  var url = 'https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL';
  var args = {
    TCKimlikNo: tckimlik,
    Ad: ad.toLocaleUpperCase(),
    Soyad: soyad.toLocaleUpperCase(),
    DogumYili: dogumyili
  };

  try {
    var client = Soap.createClient(url);
    var result = client.TCKimlikNoDogrula(args);
    return result.TCKimlikNoDogrulaResult;
  } catch (err) {
    if(err.error === 'soap-creation') {
      console.log('SOAP Client creation failed');
      return false;
    }
    else if (err.error === 'soap-method') {
      console.log('SOAP Method call failed');
      return false;
    } else {
      console.log('Unknown SOAP error:');
      console.log(err);
      return false;
    }
  }

};


