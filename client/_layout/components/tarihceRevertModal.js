tarihceRevertModalView=null;

Template.tarihceRevertModal.events({
  'click [data-trigger="revert"]': function(e,t) {
    var revert = Session.get('revert');
    M.C[revert.coll].update({_id: revert._id}, {$set: revert.doc});
    M.L.clearSessionVariable('revert');
    $('#tarihceRevertModal').closeModal({
      complete: function() {
        Blaze.remove(tarihceRevertModalView);
      }
    });
  }
});
