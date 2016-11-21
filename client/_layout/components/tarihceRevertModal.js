import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Blaze } from 'meteor/blaze';
import { $ } from 'meteor/jquery';

import { M } from 'meteor/m:lib-core';

import './tarihceRevertModal.html';

tarihceRevertModalView=null;

Template.tarihceRevertModal.events({
  'click [data-trigger="revert"]'(e,t) {
    const revert = Session.get('revert');
    M.C[revert.coll].update({_id: revert._id}, {$set: revert.doc});
    M.L.clearSessionVariable('revert');
    $('#tarihceRevertModal').closeModal({
      complete() {
        Blaze.remove(tarihceRevertModalView);
      }
    });
  }
});
