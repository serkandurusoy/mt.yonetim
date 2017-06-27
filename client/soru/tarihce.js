import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Blaze } from 'meteor/blaze';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './tarihce.html';

Template.soruTarihce.onCreated(function() {
  this.autorun(() => {
    this.subscribe('soru', FlowRouter.getParam('_id'));
    this.subscribe('mufredatlar');
    this.subscribe('fssorugorsel');
  });
});

Template.soruTarihce.events({
  'click [data-trigger="revert"]'(e,t) {
    const _id = this.ref;
    const doc = _.pick(this, 'kurum', 'aciklama', 'alan', 'tip', 'zorlukDerecesi', 'soru', 'yanit');
    const coll = 'Sorular';
    Session.set('revert', {_id, doc, coll});
    tarihceRevertModalView = Blaze.render(Template.tarihceRevertModal, document.getElementsByTagName('main')[0]);
    $('#tarihceRevertModal').openModal({
      complete() {
        Blaze.remove(tarihceRevertModalView);
      }
    });
  }
});
