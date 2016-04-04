M.C.Sorular.after.insert(function(userId,doc) {
  if (!userId) {
    userId = M.C.Users.findOne({'emails.address': 'admin@mitolojix.com'})._id;
  }

  var _id = this._id ? this._id : doc._id;

  var story = {
    kurum: doc.kurum,
    collection: 'Sorular',
    doc: _id,
    ders: doc.alan.ders,
    operation: 'insert',
    createdBy: userId
  };

  M.C.Stories.insert(story);

});

M.C.Sorular.after.update(function(userId, doc, fieldNames, modifier, options) {
  if (this.previous.searchSource.kurum === doc.searchSource.kurum) {

    var _id = this._id ? this._id : doc._id;

    if (userId) {

      var story = {
        kurum: doc.kurum,
        collection: 'Sorular',
        doc: _id,
        ders: doc.alan.ders,
        operation: 'update',
        createdBy: userId
      };

      var comment = {
        collection: 'Sorular',
        doc: _id,
        body: 'Soruda değişiklik yaptım.'
      };

      if (this.previous.taslak && !doc.taslak) {
        story.operation = 'special';
        story.specialOperation = 'Sorunun taslak işareti kalktı';
        story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' sorusunun taslak işareti kaldırıldı.';
        comment.body = comment.body + ' Taslak işaretini kaldırdım.';
      }

      if (!this.previous.taslak && doc.taslak) {
        story.operation = 'special';
        story.specialOperation = 'Soru taslak olarak işaretlendi';
        story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' sorusu taslak olarak işaretlendi.';
        comment.body = comment.body + ' Taslak olarak işaretledim.';
      }

      if (!this.previous.kilitli && doc.kilitli) {
        story.operation = 'special';
        story.specialOperation = 'Soru kilitli olarak işaretlendi';
        story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' sorusu kilitli olarak işaretlendi.';
        comment.body = comment.body + ' Kilitli olarak işaretledim.';
      }

      if (this.previous.tip !== doc.tip) {
        story.operation = 'special';
        story.specialOperation = 'Soru tipi ve yanıtı değişti';
        story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(this.previous.tip) + ' soru ' + M.L.enumLabel(doc.tip) + ' olarak yanıtı ile birlikte değiştirildi.';
        comment.body = comment.body + ' Tipini ' + M.L.enumLabel(this.previous.tip) + ' yerine ' + M.L.enumLabel(doc.tip) + ' olarak yanıtı ile birlikte değiştirdim.';
      }

      if (this.previous.zorlukDerecesi !== doc.zorlukDerecesi) {
        story.operation = 'special';
        story.specialOperation = 'Soru zorluk derecesi değişti';
        story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' sorusunun zorluk derecesi '+ doc.zorlukDerecesi +' olarak değiştirildi.';
        comment.body = comment.body + ' Zorluk derecesini '+ this.previous.zorlukDerecesi + ' yerine ' + doc.zorlukDerecesi +' olarak değiştirdim.';
      }

      if (this.previous.alan.ders !== doc.alan.ders ||
        this.previous.alan.sinif !== doc.alan.sinif) {
        story.operation = 'special';
        story.specialOperation = 'Sorunun dersi değiştirildi';
        story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' sorunun dersi ' + M.L.enumLabel(doc.alan.sinif) + ' ' + M.C.Dersler.findOne({_id: doc.alan.ders}).isim + ' olarak değişti.';
        comment.body = comment.body + ' Ait olduğu dersi değiştirdim.';
      }

      if (this.previous.alan.konu !== doc.alan.konu) {
        story.operation = 'special';
        story.specialOperation = 'Sorunun konusu değiştirildi';
        story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' sorunun konusu değişti.';
        comment.body = comment.body + ' Konusunu değiştirdim.';
      }

      if ( !this.previous.alan.kazanimlar.sort().sameAs(doc.alan.kazanimlar.sort()) ) {
        story.operation = 'special';
        story.specialOperation = 'Sorunun kazanımları değiştirildi';
        story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' sorunun kazanımları değişti.';
        comment.body = comment.body + ' Kazanımlarını değiştirdim.';
      }

      if (this.previous.soru.yonerge !== doc.soru.yonerge) {
        story.operation = 'special';
        story.specialOperation = 'Soru yönergesi değişti';
        story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' sorusunun yönergesi değiştirildi.';
        comment.body = comment.body + ' Yönergesini değiştirdim.';
      }

      if (this.previous.soru.metin !== doc.soru.metin) {
        story.operation = 'special';
        story.specialOperation = 'Soru metni değişti';
        story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' sorusunun metni değiştirildi.';
        comment.body = comment.body + ' Metnini değiştirdim.';
      }

      if (this.previous.soru.gorsel !== doc.soru.gorsel) {
        story.operation = 'special';
        story.specialOperation = 'Soru görseli değişti';
        story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' sorusunun görseli değiştirildi.';
        comment.body = comment.body + ' Görselini değiştirdim.';
      }

      if (this.previous.tip === doc.tip && !_.isEqual(this.previous.yanit,doc.yanit)) {
        story.operation = 'special';
        story.specialOperation = 'Soru yanıtı değişti';
        story.specialNote = doc.kod + ' kodlu ' + M.L.enumLabel(doc.tip) + ' sorusunun yanıtı değiştirildi.';
        comment.body = comment.body + ' Yanıtını değiştirdim.';
      }

      M.C.Stories.insert(story);

      M.C.Comments.insert(comment);

      M.C.Sinavlar.find({
        iptal: false,
        'sorular.soruId': _id
      }).forEach(function(sinav) {
        var sinavComment = {
          collection: 'Sinavlar',
          doc: sinav._id,
          body: doc.kod + ' kodlu ' + comment.body.toLocaleLowerCase()
        };
        M.C.Comments.insert(sinavComment);
      })

    }

  }
});
