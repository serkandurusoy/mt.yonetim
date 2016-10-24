M.L.TCKimlikDogrula = (tckimlik, ad, soyad, dogumyili) => {
  const url = 'https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL';
  const args = {
    TCKimlikNo: tckimlik,
    Ad: ad.toLocaleUpperCase(),
    Soyad: soyad.toLocaleUpperCase(),
    DogumYili: dogumyili
  };

  try {
    const client = Soap.createClient(url);
    const result = client.TCKimlikNoDogrula(args);
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


