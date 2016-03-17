// - staleSessionHeartbeatInterval: interval (in ms) at which activity heartbeats are sent up to the server
// - staleSessionActivityEvents: the jquery events which are considered indicator of activity e.g. in an on() call.
//
M.E.heartbeatInterval = 3*60*1000; // 3mins
M.E.activityEvents = 'touchstart touchend mousemove click keydown';

M.L.activityDetected = false;

Meteor.startup(function() {

  //
  // first send an initial hearbeat and then do it
  // periodically if activity has been detected within the interval
  //
  if (Meteor.userId()) {
    Meteor.call('heartbeat');
  }
  Meteor.setInterval(function() {
    if (Meteor.userId() && M.L.activityDetected) {
      Meteor.call('heartbeat');
      M.L.activityDetected = false;
    }
  }, M.E.heartbeatInterval);

  //
  // detect activity and mark it as detected on any of the following events
  //
  $(document).on(M.E.activityEvents, function() {
    M.L.activityDetected = true;
  });
});
