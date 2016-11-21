import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Blaze } from 'meteor/blaze';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';

import './tarihce.html';

Template.muhurTarihce.events({
  'click [data-trigger="revert"]'(e,t) {
    const {ref: _id} = this;
    const doc = _.pick(this, 'ders','isim','sira','gorsel');
    const coll = 'Muhurler';
    Session.set('revert', {_id, doc, coll});
    tarihceRevertModalView = Blaze.render(Template.tarihceRevertModal, document.getElementsByTagName('main')[0]);
    $('#tarihceRevertModal').openModal({
      complete() {
        Blaze.remove(tarihceRevertModalView);
      }
    });
  }
});
