Template.dersListe.helpers({
  dersler() {
    const derslerCursor = M.C.Dersler.find({},{sort:{isimCollate: 1}});
    return derslerCursor.count() && {cursor: derslerCursor, count: derslerCursor.count()};
  }
});
