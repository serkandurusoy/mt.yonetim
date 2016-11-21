import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Blaze } from 'meteor/blaze';
import { $ } from 'meteor/jquery';

import './tarihce.html';

Template.dersTarihce.events({
  'click [data-trigger="revert"]'(e,t) {
    const {ref: _id} = this;
    const doc = _.pick(this, 'isim','muhurGrubu');
    const coll = 'Dersler';
    Session.set('revert', {_id, doc, coll});
    tarihceRevertModalView = Blaze.render(Template.tarihceRevertModal, document.getElementsByTagName('main')[0]);
    $('#tarihceRevertModal').openModal({
      complete() {
        Blaze.remove(tarihceRevertModalView);
      }
    });
  }
});
