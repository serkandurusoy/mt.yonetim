Template.karakterListe.helpers({
  karakterler: function(){
    var karakterlerCursor = M.C.Karakterler.find({},{sort:{cinsiyet: 1}});
    return karakterlerCursor.count() && {cursor: karakterlerCursor, count: karakterlerCursor.count()};
  }
});
