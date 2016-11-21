import { Template } from 'meteor/templating';

import { M } from 'meteor/m:lib-core';

import './liste.html';

Template.karakterListe.helpers({
  karakterler(){
    const karakterlerCursor = M.C.Karakterler.find({},{sort:{cinsiyet: 1}});
    return karakterlerCursor.count() && {cursor: karakterlerCursor, count: karakterlerCursor.count()};
  }
});
