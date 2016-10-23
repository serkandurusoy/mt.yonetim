M.C.Sinavlar.after.insert(function(userId,doc) {
  if (!userId) {
    userId = M.C.Users.findOne({'emails.address': 'admin@mitolojix.com'})._id;
  }

  const {
    _id = doc._id,
  } = this;

  const story = {
    kurum: doc.kurum,
    collection: 'Sinavlar',
    doc: _id,
    ders: doc.ders,
    operation: 'insert',
    createdBy: userId
  };

  M.C.Stories.insert(story);

});

M.C.Sinavlar.after.update(function(userId, doc, fieldNames, modifier, options) {
  if (!this.previous.kilitli && doc.kilitli) {
    const soruIdleri = _.pluck(doc.sorular, 'soruId');
    M.C.Sorular.find({_id: {$in: soruIdleri}}).forEach(soru => {
      M.C.Sorular.update(
        {
          _id: soru._id,
          kilitli: false
        },
        {
          $set: {
            kilitli: true
          }
        }
      )
    });
  }

});

M.C.Sinavlar.after.update(function(userId, doc, fieldNames, modifier, options) {
  if (this.previous.searchSource.kurum === doc.searchSource.kurum) {

    let userEvent = true;
    if (!userId) {
      userEvent = false;
      userId = M.C.Users.findOne({'emails.address': 'admin@mitolojix.com'})._id;
    }
    const {
      _id = doc._id,
    } = this;

    const story = {
      kurum: doc.kurum,
      collection: 'Sinavlar',
      doc: _id,
      ders: doc.ders,
      operation: 'update',
      createdBy: userId
    };

    let comment = {
      collection: 'Sinavlar',
      doc: _id,
      body: 'Testte değişiklik yaptım.'
    };

    if (doc.iptal) {
      story.operation = 'special';
      story.specialOperation = 'Test iptal edildi';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' iptal edildi.';
      comment.body = comment.body + ' İptal ettim.';
    }

    if (this.previous.taslak && !doc.taslak) {
      story.operation = 'special';
      story.specialOperation = 'Test taslak işareti kalktı';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' taslak işareti kaldırıldı.';
      comment.body = comment.body + ' Taslak işaretini kaldırdım.';
    }

    if (!this.previous.taslak && doc.taslak) {
      story.operation = 'special';
      story.specialOperation = 'Test taslak olarak işaretlendi';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' taslak olarak işaretlendi.';
      comment.body = comment.body + ' Taslak olarak işaretledim.';
    }

    if (!this.previous.kilitli && doc.kilitli) {
      story.operation = 'special';
      story.specialOperation = 'Test kilitlendi';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' kilitlendi.';
      comment.body = comment.body + ' Kilitledim.';
    }

    if (this.previous.ders !== doc.ders) {
      story.operation = 'special';
      story.specialOperation = 'Test dersi değişti';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' dersi değiştirildi.';
      comment.body = comment.body + ' Ait olduğu dersi değiştirdim.';
    }

    if (this.previous.sorularKarissin !== doc.sorularKarissin) {
      story.operation = 'special';
      story.specialOperation = 'Soru sırası karışma ayarı değişti';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' soru sırası karışma ayarı değiştirildi.';
      comment.body = comment.body + ' Soru sırasının karışma ayarını değiştirdim.';
    }

    if (this.previous.sinif !== doc.sinif) {
      story.operation = 'special';
      story.specialOperation = 'Test sınıfı değişti';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' sınıfı değiştirildi.';
      comment.body = comment.body + ' Uygulanacağı sınıfı değiştirdim.';
    }

    if (!(this.previous.subeler.sort().sameAs(doc.subeler.sort()))) {
      story.operation = 'special';
      story.specialOperation = 'Test şubeleri değişti';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' şubeleri değiştirildi.';
      comment.body = comment.body + ' Uygulanacağı şubeleri değiştirdim.';
    }

    if (this.previous.aciklama !== doc.aciklama) {
      story.operation = 'special';
      story.specialOperation = 'Test açıklaması değişti';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' açıklaması değiştirildi.';
      comment.body = comment.body + ' Açıklamasını değiştirdim.';
    }

    if (this.previous.tip !== doc.tip) {
      story.operation = 'special';
      story.specialOperation = 'Test tipi değişti';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(this.previous.tip) + ' ' + M.L.enumLabel(doc.tip) + ' olarak değiştirildi.';
      comment.body = comment.body + ' Tipini ' + M.L.enumLabel(this.previous.tip) + ' yerine ' + M.L.enumLabel(doc.tip) + ' olarak değiştirdim.';
    }

    if (this.previous.muhur !== doc.muhur) {
      story.operation = 'special';
      story.specialOperation = 'Test öğrencilere açıldı';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' ' + M.C.Muhurler.findOne({_id: doc.muhur}).isim + ' mühürü ile öğrencilere açıldı.';
      comment.body = comment.body + ' Öğrencilere açıldı.';
    }

    if (doc.soruZDGuncellemesiYapilmaZamani) {
      story.operation = 'special';
      story.specialOperation = 'Soru zorluk dereceleri güncellendi';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' içindeki soruların zorluk dereceleri yeniden hesaplandı.';
      comment.body = comment.body + ' Soruların zorluk dereceleri yeniden hesaplandı.';
    }

    if (doc.sinavKagitlariKapanmaZamani) {
      story.operation = 'special';
      story.specialOperation = 'Test kağıtları kapatıldı';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' için açılan tüm kağıtlar kapatılarak puanları hesaplandı.';
      comment.body = comment.body + ' Test kağıtları kapandı ve puanları hesaplandı.';
    }

    if (doc.sinavKapanisiHatirlatmaZamani) {
      story.operation = 'special';
      story.specialOperation = 'Test kapanış hatırlatmaları gönderildi';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' için testi tamamlamamış öğrencilere hatırlatma gönderildi.';
      comment.body = comment.body + ' Testi almamış öğrencilere hatırlatma gönderildi.';
    }

    if (!(moment(this.previous.acilisTarihi).isSame(doc.acilisTarihi))  ||
      this.previous.acilisSaati !== doc.acilisSaati) {
      story.operation = 'special';
      story.specialOperation = 'Test açılış zamanı değişti';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' açılış zamanı değiştirildi.';
      comment.body = comment.body + ' Açılış zamanını değiştirdim.';
    }

    if (!(moment(this.previous.kapanisTarihi).isSame(doc.kapanisTarihi)) ||
      this.previous.kapanisSaati !== doc.kapanisSaati) {
      story.operation = 'special';
      story.specialOperation = 'Test kapanış zamanı değişti';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' kapanış zamanı değiştirildi.';
      comment.body = comment.body + ' Kapanış zamanını değiştirdim.';
    }

    if ( this.previous.yanitlarAcilmaTarihi && doc.yanitlarAcilmaTarihi &&
      (!(moment(this.previous.yanitlarAcilmaTarihi).isSame(doc.yanitlarAcilmaTarihi)) || this.previous.yanitlarAcilmaSaati !== doc.yanitlarAcilmaSaati)
    ) {
      story.operation = 'special';
      story.specialOperation = 'Test yanıtları açılma zamanı değişti';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' yanıtları açılma zamanı değiştirildi.';
      comment.body = comment.body + ' Yanıtların açılma zamanını değiştirdim.';
    }

    if (this.previous.sure && doc.sure && this.previous.sure !== doc.sure) {
      story.operation = 'special';
      story.specialOperation = 'Test süresi değişti';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' süresi '+ doc.sure +'dakika olarak değiştirildi.';
      comment.body = comment.body + ' Süresini ' + doc.sure + ' dakika olarak değiştirdim.';
    }

    if (this.previous.canliStatus && doc.canliStatus && this.previous.canliStatus !== doc.canliStatus) {
      story.operation = 'special';
      story.specialOperation = 'Test ' + M.L.enumLabel(doc.canliStatus);
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' canlı durumu '+ M.L.enumLabel(doc.canliStatus) +' olarak değiştirildi.';
      comment.body = comment.body + ' Canlı durumunu '+ M.L.enumLabel(doc.canliStatus) +' olarak değiştirdim.';
    }

    const onceSoru = this.previous.sorular || [];
    const sonraSoru = doc.sorular || [];

    if (onceSoru.length < sonraSoru.length) {
      const adet = sonraSoru.length - onceSoru.length;
      story.operation = 'special';
      story.specialOperation = 'Teste soru eklendi';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' içine ' + adet + ' adet soru eklendi.';
      comment.body = comment.body + ' ' + adet +' adet soru ekledim.';
    }

    if (onceSoru.length > sonraSoru.length) {
      const adet = onceSoru.length - sonraSoru.length;
      story.operation = 'special';
      story.specialOperation = 'Testten soru çıkarıldı';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' içinden ' + adet + ' adet soru çıkarıldı.';
      comment.body = comment.body + ' ' + adet +' adet soru çıkardım.';
    }

    const onceSoruIdleri = _.pluck(onceSoru, 'soruId');
    const sonraSoruIdleri = _.pluck(sonraSoru, 'soruId');
    if ((onceSoru.length === sonraSoru.length) && !(onceSoruIdleri.sameAs(sonraSoruIdleri))) {
      story.operation = 'special';
      story.specialOperation = 'Test soru sırası değişti';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' soru sırası değiştirildi.';
      comment.body = comment.body + ' Soru sırasını değiştirdim.';
    }

    const onceSoruToplamZD = _.pluck(onceSoru, 'zorlukDerecesi').reduce((memo,zorlukDerecesi) => {return memo+parseInt(zorlukDerecesi)}, 0);
    const sonraSoruToplamZD = _.pluck(sonraSoru, 'zorlukDerecesi').reduce((memo,zorlukDerecesi) => {return memo+parseInt(zorlukDerecesi)}, 0);
    if ((onceSoru.length === sonraSoru.length) && (onceSoruToplamZD !== sonraSoruToplamZD)) {
      story.operation = 'special';
      story.specialOperation = 'Test zorluğu değişti';
      story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' soru zorluk dereceleri değiştirildi.';
      comment.body = comment.body + ' Soru zorluk dereceleri değişti.';
    }

    M.C.Stories.insert(story);

    if (userEvent) {
      M.C.Comments.insert(comment);
    }

  }
});

M.C.Sinavlar.after.update((userId, doc, fieldNames, modifier, options) => {
  if (doc.iptal) {

    const sinav = M.C.Sinavlar.findOne({
      _id: doc._id,
      taslak: false,
      aktif: true,
      muhur: {$exists: true},
      egitimYili: M.C.AktifEgitimYili.findOne().egitimYili,
      acilisZamani: {$lt: new Date()}
    });

    if (sinav) {

      let users = [];

      // sinavi olusturan ve son guncelleyenini al
      users = _.union(users, [sinav.createdBy]);
      users = !!sinav.updatedBy ? _.union(users, [sinav.updatedBy]) : users;

      // varsa eski versiyonlarin olusturan ve guncelleyenlerini al
      if (sinav._version > 1) {
        sinav.versions().forEach(sinav => {
          users = _.union(users, [sinav.createdBy]);
          users = !!sinav.updatedBy ? _.union(users, [sinav.updatedBy]) : users;
        })
      }

      // kurumda derse yetkisi olan ogretmenleri al
      M.C.Users.find({
        aktif: true,
        kurum: sinav.kurum,
        role: 'ogretmen',
        dersleri: sinav.ders
      }).forEach(user => {
        users = _.union(users, [user._id]);
      });

      // sinava comment etmis kisilerin ogretmen olmayanlarinin kendi kurumlarindan roldaslarini al
      M.C.Comments.find({
        collection: 'Sinavlar',
        doc: sinav._id
      }).forEach(comment => {
        const user = M.C.Users.findOne({_id: comment.createdBy});
        if (user.role !== 'ogretmen' && user.role !== 'ogrenci') {
          M.C.Users.find({
            aktif: true,
            kurum: user.kurum,
            role: user.role
          }).forEach(user => {
            users = _.union(users, [user._id]);
          });
        }
      });

      // sinavin yapilacagi kurumun ayni sinif ve subelerdeki ogrencilerini al
      M.C.Users.find({
        aktif: true,
        role: 'ogrenci',
        kurum: sinav.kurum,
        sinif: sinav.sinif,
        sube: {$in: sinav.subeler}
      }).forEach(user => {
        users = _.union(users, [user._id]);
      });

      users = _.uniq(users);

      users.forEach(userId => {

        const user = M.C.Users.findOne({_id: userId});

        if (user) {
          const muhurGrubu = M.C.Dersler.findOne({_id: sinav.ders}).muhurGrubu.isim;
          const ders = M.C.Dersler.findOne({_id: sinav.ders}).isim;
          const muhur = M.C.Muhurler.findOne({_id: sinav.muhur}).isim;
          const sinifSube = M.L.enumLabel(sinav.sinif) + ' ' + sinav.subeler;
          const subeMetin = sinav.subeler.length === 1 ? 'şubesi' : 'şubeleri';
          const tip = M.L.enumLabel(sinav.tip);
          const kod = sinav.kod;
          const kurum = user.kurum === 'mitolojix' ? ( M.C.Kurumlar.findOne({_id: sinav.kurum}).isim + ' altında ' ) : '';

          if (user.role === 'ogrenci') {

            Email.send({
              to: user.emails[0].address,
              from: '"Mitolojix'+( Meteor.settings.public.ENV === 'PRODUCTION' ? '' : (' ' + Meteor.settings.public.ENV) )+'" <bilgi@mitolojix.com>',
              subject: 'Test iptal edildi',
              text: 'Sevgili ' + user.name + ',\n\n'
              +  muhur + ' mühürüne ait ' + ders + ' testi öğretmenin tarafından iptal edildi ve Mitolojix\'den kaldırıldı. Yeni bir test eklendiğinde yine bir mesajla bilgilendirileceksin.'
              + '\n\n'
              + 'Mitolojix\'e gitmek için ' + Meteor.settings.public.URL.OYUN + ' bağlantısına tıklayabilirsin.'
              + '\n\n'
              + 'Sevgiler,\nMitolojix\n',
              html: '<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>'
              + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sevgili ' + user.name + ',</p>'
              + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">' + muhur + ' mührüne ait ' + ders + ' testi öğretmenin tarafından iptal edildi ve Mitolojix\'den kaldırıldı. Yeni bir test eklendiğinde yine bir mesajla bilgilendirileceksin.</p>'
              + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Mitolojix\'e gitmek için <a href="' + Meteor.settings.public.URL.OYUN + '" target="_blank" style="color: #2196F3">buraya</a> tıklayabilirsin.</p>'
              + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sevgiler,<br/>Mitolojix</p>'
              + '</body></html>'
            });

          } else {

            Email.send({
              to: user.emails[0].address,
              from: '"Mitolojix'+( Meteor.settings.public.ENV === 'PRODUCTION' ? '' : (' ' + Meteor.settings.public.ENV) )+'" <bilgi@mitolojix.com>',
              subject: 'Test iptal edildi',
              text: 'Sayın ' + user.name + ' ' + user.lastName + ',\n\n'
              + 'Mitolojix uygulamasında ' + kurum + sinifSube + ' ' + subeMetin + ' için ' + muhurGrubu + ' mühür grubu ' + ders + ' dersine ait ' + kod + ' numaralı ' + tip + ' iptal edilmiştir. Bilginize sunarız.'
              + '\n\n'
              + 'Saygılarımızla,\nMitolojix\n',
              html: '<html><head><!--[if !mso]><!-- --><link href=\'http://fonts.googleapis.com/css?family=Open+Sans\' rel=\'stylesheet\' type=\'text/css\'><!--<![endif]--></head><body>'
              + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Sayın ' + user.name + ' ' + user.lastName + ',</p>'
              + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Mitolojix uygulamasında ' + sinifSube + ' ' + subeMetin +  ' için ' + muhurGrubu + ' mühür grubu ' + ders + ' dersine ait ' + kod + ' numaralı ' + tip + ' iptal edilmiştir. Bilginize sunarız.</p>'
              + '<p style="font-family: \'Open Sans\', Helvetica, Arial, Verdana, \'Trebuchet MS\', sans-serif; font-size: 16px; line-height: 22px; font-weight: normal; color: #333333">Saygılarımızla,<br/>Mitolojix</p>'
              + '</body></html>'
            });

          }

        }

      });

    }

  }
});
