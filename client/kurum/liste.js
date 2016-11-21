import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import { M } from 'meteor/m:lib-core';

import './liste.html';

Template.kurumListe.onCreated(function() {
  const template = this;
  template.searchResults = new ReactiveVar();
  template.autorun(() => {
    const keywords = Session.get('keywords');
    if (keywords) {
      Meteor.call('search.kurum',keywords, (err,res) => {
        if (err) {
          toastr.error(M.E.BilinmeyenHataMessage);
          template.searchResults.set({_id: {$in: []}});
        }
        if (res) {
          template.searchResults.set({_id: {$in: res}});
        }
      })
    } else {
      template.searchResults.set({});
    }
  })
});

Template.kurumListe.helpers({
  kurumlar(){
    const selector = Template.instance().searchResults.get();
    const kurumlarCursor = M.C.Kurumlar.find(selector,{sort:{isimCollate: 1}});
    return kurumlarCursor.count() && {cursor: kurumlarCursor, count: kurumlarCursor.count()};
  }
});
