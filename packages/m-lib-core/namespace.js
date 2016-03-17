//Mitolojix namespace
M={};

//Mitolojix libraries
M.L={};

//Mitolojix collections
M.C={};

//Mitolojix gridfs file system
M.FS={};

//Mitolojix enumerations
M.E={};

Meteor.startup(function() {
  if (Meteor.isServer) {
    console.log("======================================");
    console.log("Meteor instance for " + Meteor.settings.public.APP + " started.");
    console.log("======================================");
  }
});
