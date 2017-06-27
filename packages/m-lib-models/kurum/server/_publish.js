import { M } from 'meteor/m:lib-core';
import { publishComposite } from 'meteor/reywood:publish-composite';

publishComposite(null, function() {
  // TODO: explore using this.unblock() and see if it helps with performance. watch out for gotchas!!!
  return {
    find() {
      if (this.userId) {
        if (M.L.userHasRole(this.userId, 'mitolojix')) {
          return M.C.Kurumlar.find();
        } else {
          return M.C.Kurumlar.find({_id: M.C.Users.findOne({_id: this.userId}).kurum});
        }
      }
    },
    children: M.C.AuditLog
    /*
    TODO: use this for search subscriptions and paging
    collectionName: 'clientonly' http://braindump.io/meteor/2014/09/20/publishing-to-an-alternative-clientside-collection-in-meteor.html
    */
  };
});
