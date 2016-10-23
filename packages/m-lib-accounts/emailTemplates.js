const getOyunUrl = url => {
  return Meteor.settings.public.URL.OYUN + "/#" + url.split('#')[1];
};

const getYonetimUrl = url => {
  return Meteor.settings.public.URL.YONETIM + "/#" + url.split('#')[1];
};

const getSifreMesaji = user => {
  const userKurum = user.kurum;
  const kurum = userKurum === 'mitolojix' ? 'mitolojix' : M.C.Kurumlar.findOne({_id: userKurum});
  const sifreZorluk = kurum === 'mitolojix' ? 'kolay' : kurum.sifre;
  const sifreZorlukAciklama = _.findWhere(M.E.SifreObjects, {name: sifreZorluk}).detail;
  return ' ' + sifreZorlukAciklama.charAt(0).toLowerCase() + sifreZorlukAciklama.slice(1);
};

Accounts.emailTemplates.from = '"Mitolojix' + ( Meteor.settings.public.ENV === 'PRODUCTION' ? '' : (' ' + Meteor.settings.public.ENV) ) + '" <bilgi@mitolojix.com>';
Accounts.emailTemplates.siteName = 'Mitolojix';

Accounts.emailTemplates.resetPassword.subject = user => {
  return 'Yeni şifre oluşturma talebi';
};
Accounts.emailTemplates.resetPassword.text = (user, url) => {
  let body = '';
  if (user.role === 'ogrenci') {
    url = getOyunUrl(url);
    body+=('Sevgili ' + user.name + ',\n\n');
    body+=('Mitolojix oyununa giriş için yeni bir şifre oluşturmak üzere bir talep gerçekleşti.\n\n');
    body+=('Talebi sen yaptıysan, aşağıdaki bağlantıya tıklayarak yeni şifreni tanımlayabilirsin.\n\n');
    body+=(url + '\n\n');
    body+=('Tanımlayacağın şifre' + getSifreMesaji(user) + '\n\n');
    body+=('Böyle bir talebin olmadıysa, bu mesajı silebilirsin.\n\n');
    body+=('Başarılar,\nMitolojix\n');
  } else {
    url = getYonetimUrl(url);
    body+=('Sayın ' + user.name + ' ' + user.lastName + ',\n\n');
    body+=('Mitolojix hesabınıza giriş için yeni bir şifre oluşturmak üzere bir talep gerçekleşti.\n\n');
    body+=('Talebi siz yaptıysanız, aşağıdaki bağlantıya tıklayarak yeni şifrenizi tanımlayabilirsiniz.\n\n');
    body+=(url + '\n\n');
    body+=('Tanımlayacağınız şifre' + getSifreMesaji(user) + '\n\n');
    body+=('Böyle bir talebiniz olmadıysa, bu mesajı silebilirsiniz.\n\n');
    body+=('Saygılarımızla,\nMitolojix\n');
  }
  return body;
};
Accounts.emailTemplates.resetPassword.html = (user, url) => {
  let body = '';
  if (user.role === 'ogrenci') {
    url = getOyunUrl(url);
    body+=('<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sevgili ' + user.name + ',</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Mitolojix oyununa giriş için yeni bir şifre oluşturmak üzere bir talep gerçekleşti.</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Talebi sen yaptıysan, <a href="' + url + '" target="_blank"  style="color: #2196F3">buraya tıklayarak</a> yeni şifreni tanımlayabilirsin.</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Tanımlayacağın şifre' + getSifreMesaji(user) + '</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Böyle bir talebin olmadıysa, bu mesajı silebilirsin.</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Başarılar,<br/>Mitolojix</p>');
    body+=('</body></html>');
  } else {
    url = getYonetimUrl(url);
    body+=('<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sayın ' + user.name + ' ' + user.lastName + ',</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Mitolojix hesabınıza giriş için yeni bir şifre oluşturmak üzere bir talep gerçekleşti.</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Talebi siz yaptıysanız, <a href="' + url + '" target="_blank" style="color: #2196F3">buraya tıklayarak</a> yeni şifrenizi tanımlayabilirsiniz.</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Tanımlayacağınız şifre' + getSifreMesaji(user) + '</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Böyle bir talebiniz olmadıysa, bu mesajı silebilirsiniz.</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Saygılarımızla,<br/>Mitolojix</p>');
    body+=('</body></html>');
  }
  return body;
};

Accounts.emailTemplates.enrollAccount.subject = user => {
  return 'Hesap etkinleştirme';
};
Accounts.emailTemplates.enrollAccount.text = (user, url) => {
  let body = '';
  if (user.role === 'ogrenci') {
    url = getOyunUrl(url);
    body+=('Sevgili ' + user.name + ',\n\n');
    body+=(M.C.Kurumlar.findOne({_id: user.kurum}).isim + ' senin için Mitolojix oyununda bir hesap oluşturdu. Hesabını etkinleştirmek için aşağıdaki bağlantıya tıklayarak şifreni tanımlaman gerekiyor. Bu konuda henüz bilgin yoksa, önce öğretmenlerine danışabilirsin.\n\n');
    body+=(url + '\n\n');
    body+=('Bazı önemli hatırlatmalar:\n\n');
    body+=('• Tanımlayacağın şifre' + getSifreMesaji(user) + '\n');
    body+=('• Oyuna giriş için kullanıcı adı olarak ' + user.emails[0].address + ' e-posta adresini kullanmalısın.\n');
    body+=('• Oyunu Google Chrome tarayıcıda açmanı öneriyoruz.\n');
    body+=('• Oyun yüklenmezse tarayıcının en son versiyonunu yükleyip ve bilgisayarı yeniden başlatıp lütfen tekrar dene.\n');
    body+=('• Ekran çözünürlüğün en az 1024x768 olmalı.\n\n');
    body+=('Bir sorunla karşılaştığında bilgi@mitolojix.com adresine e-posta atarak bildirirsen sana yardımcı olabiliriz.\n\n');
    body+=('Başarılar,\nMitolojix\n');
  } else {
    url = getYonetimUrl(url);
    body+=('Sayın ' + user.name + ' ' + user.lastName + ',\n\n');
    body+=('Sizin adınıza bir Mitolojix hesabı oluşturuldu. Hesabınızı etkinleştirmek için aşağıdaki bağlantıya tıklayarak şifrenizi tanımlamanız gerekiyor.\n\n');
    body+=(url + '\n\n');
    body+=('Tanımlayacağınız şifre' + getSifreMesaji(user) + '\n\n');
    body+=('Uygulamaya giriş için kullanıcı adı olarak ' + user.emails[0].address + ' e-posta adresinizi kullanmalısınız.\n\n');
    body+=('Saygılarımızla,\nMitolojix\n');
  }
  return body;
};
Accounts.emailTemplates.enrollAccount.html = (user, url) => {
  let body = '';
  if (user.role === 'ogrenci') {
    url = getOyunUrl(url);
    body+=('<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sevgili ' + user.name + ',</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">' + M.C.Kurumlar.findOne({_id: user.kurum}).isim + ' senin için Mitolojix oyununda bir hesap oluşturdu. Hesabını etkinleştirmek için <a href="' + url + '" target="_blank" style="color: #2196F3">buraya tıklayarak</a> şifreni tanımlaman gerekiyor. Bu konuda henüz bilgin yoksa, önce öğretmenlerine danışabilirsin.</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Bazı önemli hatırlatmalar:</p>');
    body+=('<ul>');
    body+=('<li style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Tanımlayacağın şifre' + getSifreMesaji(user) + '</li>');
    body+=('<li style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Oyuna giriş için kullanıcı adı olarak ' + user.emails[0].address + ' e-posta adresini kullanmalısın.</li>');
    body+=('<li style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Oyunu Google Chrome tarayıcıda açmanı öneriyoruz.</li>');
    body+=('<li style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Oyun yüklenmezse tarayıcının en son versiyonunu yükleyip ve bilgisayarı yeniden başlatıp lütfen tekrar dene.</li>');
    body+=('<li style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Ekran çözünürlüğün en az 1024x768 olmalı.</li>');
    body+=('</ul>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Bir sorunla karşılaştığında <a href="mailto:bilgi@mitolojix.com" style="color: #2196F3">bilgi@mitolojix.com</a> adresine e-posta atarak bildirirsen sana yardımcı olabiliriz.</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Başarılar,<br/>Mitolojix</p>');
    body+=('</body></html>');
  } else {
    url = getYonetimUrl(url);
    body+=('<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sayın ' + user.name + ' ' + user.lastName + ',</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sizin adınıza bir Mitolojix hesabı oluşturuldu. Hesabınızı etkinleştirmek için <a href="' + url + '" target="_blank" style="color: #2196F3">buraya tıklayarak</a> şifrenizi tanımlamanız gerekiyor.</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Tanımlayacağınız şifre' + getSifreMesaji(user) + '</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Uygulamaya giriş için kullanıcı adı olarak ' + user.emails[0].address + ' e-posta adresinizi kullanmalısınız.</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Saygılarımızla,<br/>Mitolojix</p>');
    body+=('</body></html>');
  }
  return body;
};
