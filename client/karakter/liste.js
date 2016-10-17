Template.karakterListe.helpers({
  karakterler(){
    const karakterlerCursor = M.C.Karakterler.find({},{sort:{cinsiyet: 1}});
    return karakterlerCursor.count() && {cursor: karakterlerCursor, count: karakterlerCursor.count()};
  }
});
