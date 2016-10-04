// serverId - unique per server per restart
M.E.serverId = Random.id();

// user connection log
M.C.UserConnectionLog = new Mongo.Collection('userconnectionlog');
M.C.UserConnectionLog._ensureIndex({userId: 1, createdAt: -1});

// user connections
M.C.UserPresenceSessions = new Mongo.Collection('userpresencesessions');
M.C.UserPresenceSessions._ensureIndex({userId: 1});


// list of servers
M.C.UserPresenceServers = new Mongo.Collection('userpresenceservers');
M.C.UserPresenceServers._ensureIndex({ping: 1});
M.C.UserPresenceServers._ensureIndex({serverId: 1});


// keep track of which servers are online
Meteor.setInterval(function() {
  var ping = new Date();
  ping.setSeconds(0,0);
  var find = {serverId: M.E.serverId};
  var modifier = {$set: {ping: ping}};
  M.C.UserPresenceServers.upsert(find, modifier);
}, 1000 * 30);


// remove old servers and sessions
// update status of users connected to that server
Meteor.setInterval(function() {
  var cutoff = new Date();
  cutoff.setSeconds(0,0);
  cutoff.setMinutes(new Date().getMinutes() - 5);
  M.C.UserPresenceServers.find({ping: {$lt: cutoff}}).forEach(function(server) {
    M.C.UserPresenceServers.remove({_id: server._id});
    M.C.UserPresenceSessions.remove({serverId: server.serverId});
    M.C.Users.find({'status.serverId': server.serverId}).forEach(function(user) {
      M.L.trackUserStatus(user._id);
    })
  })
}, 1000 * 10);


// track user connection and disconnection
Meteor.publish(null, function(){
  var self = this;

  if(self.userId && self.connection && self.connection.id){
    M.L.userConnected(self.userId, self.connection);

    self.onStop(function(){
      M.L.userDisconnected(self.userId, self.connection);
    });
  }

  self.ready();
});


M.L.userConnected = function(userId, connection) {
  var createdAt = new Date();
  createdAt.setSeconds(0,0);
  M.C.UserPresenceSessions.insert({serverId: M.E.serverId, userId: userId, connectionId: connection.id, createdAt: createdAt});
  M.L.trackUserStatus(userId, connection);
};


M.L.userDisconnected = function(userId, connection) {
  M.C.UserPresenceSessions.remove({userId:userId, connectionId:connection.id});
  M.L.trackUserStatus(userId, connection);
};


M.L.trackUserStatus = function(userId, connection) {
  var status = {
    serverId: M.E.serverId
  };

  var isOnline = M.C.UserPresenceSessions.find({userId: userId}).count();

  if (isOnline) {
    status.online = true;

    if (connection) {
      var createdAt = new Date();
      createdAt.setSeconds(0,0);
      M.C.UserConnectionLog.insert({
        userId: userId,
        createdAt: createdAt,
        connectionId: connection.id,
        ipAddress: connection.clientAddress,
        httpHeaders: connection.httpHeaders,
        information: _.omit(UAParser(connection.httpHeaders['user-agent']), 'ua')
      })
    }

  } else {
    status.online = false;
  }

  M.C.Users.update({_id: userId}, {$set: {status: status}});

};

//
// Server side activity detection for the session timeout
//
M.E.staleSessionPurgeInterval = 1*60*1000; // 1min
M.E.inactivityTimeout = 30*60*1000; // 30mins

//
// provide a user activity heartbeat method which stamps the user record with a timestamp of the last
// received activity heartbeat.
//
Meteor.methods({
  heartbeat: function() {
    if (!this.userId) { return; }
    var user = M.C.Users.findOne(this.userId);
    if (user) {
      var heartbeat = new Date();
      heartbeat.setSeconds(0,0);
      M.C.Users.update(user._id, {$set: {heartbeat: heartbeat}});
    }
  }
});


//
// periodically purge any stale sessions, removing their login tokens and clearing out the stale heartbeat.
//
Meteor.setInterval(function() {
  var now = new Date(), overdueTimestamp = new Date(now- M.E.inactivityTimeout);
  Meteor.users.find({
    heartbeat: {$lt: overdueTimestamp}
  }, {
    fields: {_id: 1}
  }).forEach(function(user){
    M.C.UserPresenceSessions.remove({userId: user._id});
    M.C.Users.update(user._id, {
      $set: {'services.resume.loginTokens': [], 'status.online': false},
      $unset: {heartbeat: 1}
    });
  })}, M.E.staleSessionPurgeInterval);
