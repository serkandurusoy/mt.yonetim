import { M } from 'meteor/m:lib-core';
import { publishComposite } from 'meteor/reywood:publish-composite';

publishComposite(null, function() {
  return {
    find() {
      if (this.userId) {
        return M.C.Muhurler.find();
      }
    },
    children: M.C.AuditLog
  };
});
