import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';

import './tarihce.html';

Template.yardimDokumaniTarihce.events({
  'click [data-trigger="revert"]'(e,t) {
    const _id = this.ref;
    const doc = _.pick(this, 'isim','dokuman');
    const coll = 'YardimDokumanlari';
    Session.set('revert', {_id, doc, coll});
    tarihceRevertModalView = Blaze.render(Template.tarihceRevertModal, document.getElementsByTagName('main')[0]);
    $('#tarihceRevertModal').openModal({
      complete() {
        Blaze.remove(tarihceRevertModalView);
      }
    });
  }
});
