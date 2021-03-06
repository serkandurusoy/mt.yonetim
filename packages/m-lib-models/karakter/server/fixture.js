Meteor.startup(function () {
  if (Meteor.settings.public.APP === 'YONETIM' && M.C.Karakterler.find().count() === 0) {
    _.each(M.E.Cinsiyet, function(cinsiyet) {
      for (var i=1; i<=10; i++) {
        var karakterGorselId='';
        var karakterGorsel = new FS.File();
        karakterGorsel.attachData(
          FS.Utility.binaryToBuffer(Assets.getBinary('_privateAssets/' + 'karakter/' + cinsiyet + '/' + i + '.png')),
          {type: 'image/png'},
          function(err) {
            if (err) {
              M.L.ThrowError({error:'500',reason:'Karakter dosya kaydedilemedi',details: err});
            } else {
              karakterGorsel.name('karakter-' + cinsiyet + '-' + (i<10 ? '0' : '') + i + '.png');
              karakterGorsel.updatedAt(new Date());
              karakterGorsel.metadata = {};
              var karakterGorselObj = M.FS.Karakter.insert(karakterGorsel);
              karakterGorselId = karakterGorselObj._id;
            }
          }
        );
        M.C.Karakterler.insert({
          cinsiyet: cinsiyet,
          gorsel: karakterGorselId
        });
      }
    })
  }
});
