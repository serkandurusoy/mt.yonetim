var getOyunUrl = function(url) {
  return Meteor.settings.public.URL.OYUN + "/#" + url.split('#')[1];
};

var getYonetimUrl = function(url) {
  return Meteor.settings.public.URL.YONETIM + "/#" + url.split('#')[1];
};

var getSifreMesaji = function(user) {
  var userKurum = user.kurum;
  var kurum = userKurum === 'mitolojix' ? 'mitolojix' : M.C.Kurumlar.findOne({_id: userKurum});
  var sifreZorluk = kurum === 'mitolojix' ? 'kolay' : kurum.sifre;
  var sifreZorlukAciklama = _.findWhere(M.E.SifreObjects, {name: sifreZorluk}).detail;
  return ' ' + sifreZorlukAciklama.charAt(0).toLowerCase() + sifreZorlukAciklama.slice(1);
};

Accounts.emailTemplates.from = '"Mitolojix" <admin@mitolojix.com>';
Accounts.emailTemplates.siteName = 'Mitolojix';

Accounts.emailTemplates.resetPassword.subject = function(user) {
  return 'Yeni şifre oluşturma talebi';
};
Accounts.emailTemplates.resetPassword.text = function(user, url) {
  var body = '';
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
Accounts.emailTemplates.resetPassword.html = function(user, url) {
  var body = '';
  if (user.role === 'ogrenci') {
    url = getOyunUrl(url);
    body+=('<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sevgili ' + user.name + ',</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Mitolojix oyununa giriş için yeni bir şifre oluşturmak üzere bir talep gerçekleşti.</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Talebi sen yaptıysan, <a href="' + url + '" target="_blank">buraya tıklayarak</a> yeni şifreni tanımlayabilirsin.</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Tanımlayacağın şifre' + getSifreMesaji(user) + '</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Böyle bir talebin olmadıysa, bu mesajı silebilirsin.</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Başarılar,<br/>Mitolojix</p>');
    body+=('</body></html>');
  } else {
    url = getYonetimUrl(url);
    body+=('<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sayın ' + user.name + ' ' + user.lastName + ',</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Mitolojix hesabınıza giriş için yeni bir şifre oluşturmak üzere bir talep gerçekleşti.</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Talebi siz yaptıysanız, <a href="' + url + '" target="_blank">buraya tıklayarak</a> yeni şifrenizi tanımlayabilirsiniz.</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Tanımlayacağınız şifre' + getSifreMesaji(user) + '</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Böyle bir talebiniz olmadıysa, bu mesajı silebilirsiniz.</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Saygılarımızla,<br/>Mitolojix</p>');
    body+=('</body></html>');
  }
  return body;
};

Accounts.emailTemplates.enrollAccount.subject = function(user) {
  return 'Hesap etkinleştirme';
};
Accounts.emailTemplates.enrollAccount.text = function(user, url) {
  var body = '';
  if (user.role === 'ogrenci') {
    url = getOyunUrl(url);
    body+=('Sevgili ' + user.name + ',\n\n');
    body+=(M.C.Kurumlar.findOne({_id: user.kurum}).isim + ' senin için Mitolojix oyununda bir hesap oluşturdu. Hesabını etkinleştirmek için aşağıdaki bağlantıya tıklayarak şifreni tanımlaman gerekiyor. Bu konuda henüz bilgin yoksa, önce öğretmenlerine danışabilirsin.\n\n');
    body+=(url + '\n\n');
    body+=('Tanımlayacağın şifre' + getSifreMesaji(user) + '\n\n');
    body+=('Oyuna giriş için kullanıcı adı olarak ' + user.emails[0].address + ' e-posta adresini kullanacaksın.\n\n');
    body+=('Başarılar,\nMitolojix\n');
  } else {
    url = getYonetimUrl(url);
    body+=('Sayın ' + user.name + ' ' + user.lastName + ',\n\n');
    body+=('Sizin adınıza bir Mitolojix hesabı oluşturuldu. Hesabınızı etkinleştirmek için aşağıdaki bağlantıya tıklayarak şifrenizi tanımlamanız gerekiyor.\n\n');
    body+=(url + '\n\n');
    body+=('Tanımlayacağınız şifre' + getSifreMesaji(user) + '\n\n');
    body+=('Oyuna giriş için kullanıcı adı olarak ' + user.emails[0].address + ' e-posta adresinizi kullanacaksınız.\n\n');
    body+=('Saygılarımızla,\nMitolojix\n');
  }
  return body;
};
Accounts.emailTemplates.enrollAccount.html = function(user, url) {
  var body = '';
  if (user.role === 'ogrenci') {
    url = getOyunUrl(url);
    body+=('<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sevgili ' + user.name + ',</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">' + M.C.Kurumlar.findOne({_id: user.kurum}).isim + ' senin için Mitolojix oyununda bir hesap oluşturdu. Hesabını etkinleştirmek için <a href="' + url + '" target="_blank">buraya tıklayarak</a> şifreni tanımlaman gerekiyor. Bu konuda henüz bilgin yoksa, önce öğretmenlerine danışabilirsin.</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Tanımlayacağın şifre' + getSifreMesaji(user) + '</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Oyuna giriş için kullanıcı adı olarak ' + user.emails[0].address + ' e-posta adresini kullanacaksın.</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Başarılar,<br/>Mitolojix</p>');
    body+=('</body></html>');
  } else {
    url = getYonetimUrl(url);
    body+=('<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sayın ' + user.name + ' ' + user.lastName + ',</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sizin adınıza bir Mitolojix hesabı oluşturuldu. Hesabınızı etkinleştirmek için <a href="' + url + '" target="_blank">buraya tıklayarak</a> şifrenizi tanımlamanız gerekiyor.</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Tanımlayacağınız şifre' + getSifreMesaji(user) + '</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Oyuna giriş için kullanıcı adı olarak ' + user.emails[0].address + ' e-posta adresinizi kullanacaksınız.</p>');
    body+=('<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Saygılarımızla,<br/>Mitolojix</p>');
    body+=('</body></html>');
  }
  return body;
};
