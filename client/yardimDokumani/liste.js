import { Template } from 'meteor/templating';

import { M } from 'meteor/m:lib-core';

import './liste.html';

Template.yardimDokumaniListe.helpers({
  yardimDokumanlari(){
    const yardimDokumanlariCursor = M.C.YardimDokumanlari.find({},{sort:{isim: 1}});
    return yardimDokumanlariCursor.count() && {cursor: yardimDokumanlariCursor, count: yardimDokumanlariCursor.count()};
  }
});
