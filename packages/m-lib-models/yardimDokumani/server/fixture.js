Meteor.startup(function () {
  if (Meteor.settings.public.APP === 'YONETIM' && M.C.YardimDokumanlari.find().count() === 0) {
    var yardimDokumaniId='';
    var yardimDokumani = new FS.File();
    yardimDokumani.attachData(
      FS.Utility.binaryToBuffer(Assets.getBinary('_privateAssets/yardimDokumani/mitolojix-brosuru.pdf')),
      {type: 'application/pdf'},
      function(err) {
        if (err) {
          M.L.ThrowError({error:'500',reason:'Yardim dokumani dosya kaydedilemedi',details: err});
        } else {
          yardimDokumani.name('mitolojix-brosuru.pdf');
          yardimDokumani.updatedAt(new Date());
          yardimDokumani.metadata = {};
          var yardimDokumaniObj = M.FS.YardimDokumani.insert(yardimDokumani);
          yardimDokumaniId = yardimDokumaniObj._id;
        }
      }
    );
    M.C.YardimDokumanlari.insert({
      isim: 'Mitolojix broşürü',
      dokuman: yardimDokumaniId
    });
  }
});
