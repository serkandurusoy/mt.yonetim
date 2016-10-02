Template.dersListe.helpers({
  dersler: function(){
    var derslerCursor = M.C.Dersler.find({},{sort:{isimCollate: 1}});
    return derslerCursor.count() && {cursor: derslerCursor, count: derslerCursor.count()};
  }
});
