import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _ } from 'meteor/underscore';

import { M } from 'meteor/m:lib-core';

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
Meteor.setInterval(() => {
  const ping = new Date();
  ping.setSeconds(0,0);
  const find = {serverId: M.E.serverId};
  const modifier = {$set: {ping}};
  M.C.UserPresenceServers.upsert(find, modifier);
}, 1000 * 30);


// remove old servers and sessions
// update status of users connected to that server
Meteor.setInterval(() => {
  const cutoff = new Date();
  cutoff.setSeconds(0,0);
  cutoff.setMinutes(new Date().getMinutes() - 5);
  M.C.UserPresenceServers.find({ping: {$lt: cutoff}}).forEach(server => {
    const {
      _id,
      serverId,
    } = server;
    M.C.UserPresenceServers.remove({_id});
    M.C.UserPresenceSessions.remove({serverId});
    M.C.Users.find({'status.serverId': serverId}).forEach(user => {
      M.L.trackUserStatus(user._id);
    })
  })
}, 1000 * 10);


// track user connection and disconnection
Meteor.publish(null, function(){

  if(this.userId && this.connection && this.connection.id){
    M.L.userConnected(this.userId, this.connection);

    this.onStop(() => {
      M.L.userDisconnected(this.userId, this.connection);
    });
  }

  this.ready();
});


M.L.userConnected = (userId, connection) => {
  const createdAt = new Date();
  createdAt.setSeconds(0,0);
  M.C.UserPresenceSessions.insert({serverId: M.E.serverId, userId, connectionId: connection.id, createdAt});
  M.L.trackUserStatus(userId, connection);
};


M.L.userDisconnected = (userId, connection) => {
  M.C.UserPresenceSessions.remove({userId, connectionId:connection.id});
  M.L.trackUserStatus(userId, connection);
};


M.L.trackUserStatus = (userId, connection) => {
  let status = {
    serverId: M.E.serverId
  };

  const isOnline = M.C.UserPresenceSessions.find({userId}).count();

  if (isOnline) {
    status.online = true;

    if (connection) {
      const {
        id: connectionId,
        clientAdress: ipAddress,
        httpHeaders,
      } = connection;
      const createdAt = new Date();
      createdAt.setSeconds(0,0);
      M.C.UserConnectionLog.insert({
        userId,
        createdAt,
        connectionId,
        ipAddress,
        httpHeaders,
        information: _.omit(UAParser(httpHeaders['user-agent']), 'ua')
      })
    }

  } else {
    status.online = false;
  }

  M.C.Users.update({_id: userId}, {$set: {status}});

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
  heartbeat() {
    if (!this.userId) { return; }
    const user = M.C.Users.findOne(this.userId);
    if (user) {
      const heartbeat = new Date();
      heartbeat.setSeconds(0,0);
      M.C.Users.update(user._id, {$set: {heartbeat}});
    }
  }
});


//
// periodically purge any stale sessions, removing their login tokens and clearing out the stale heartbeat.
//
Meteor.setInterval(() => {
  const now = new Date(), overdueTimestamp = new Date(now- M.E.inactivityTimeout);
  Meteor.users.find({
    heartbeat: {$lt: overdueTimestamp}
  }, {
    fields: {_id: 1}
  }).forEach(user => {
    M.C.UserPresenceSessions.remove({userId: user._id});
    M.C.Users.update(user._id, {
      $set: {'services.resume.loginTokens': [], 'status.online': false},
      $unset: {heartbeat: 1}
    });
  })}, M.E.staleSessionPurgeInterval);
