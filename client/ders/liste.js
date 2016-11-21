import { Template } from 'meteor/templating';

import { M } from 'meteor/m:lib-core';

import './liste.html';

Template.dersListe.helpers({
  dersler() {
    const derslerCursor = M.C.Dersler.find({},{sort:{isimCollate: 1}});
    return derslerCursor.count() && {cursor: derslerCursor, count: derslerCursor.count()};
  }
});
