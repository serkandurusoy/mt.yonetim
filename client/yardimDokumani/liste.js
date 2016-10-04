Template.yardimDokumaniListe.helpers({
  yardimDokumanlari: function(){
    var yardimDokumanlariCursor = M.C.YardimDokumanlari.find({},{sort:{isim: 1}});
    return yardimDokumanlariCursor.count() && {cursor: yardimDokumanlariCursor, count: yardimDokumanlariCursor.count()};
  }
});
