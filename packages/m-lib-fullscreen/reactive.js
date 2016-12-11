Meteor.startup(function() {

  M.L.reactiveFullScreenStatus = new ReactiveVar(false);

  document.addEventListener(window.screenfull.raw.fullscreenchange, function() {
    M.L.reactiveFullScreenStatus.set(window.screenfull.enabled && window.screenfull.isFullscreen);
  });

  Template.registerHelper('fullScreenTest', function() {
    return {
      enabled: window.screenfull.enabled,
      active: M.L.reactiveFullScreenStatus.get()
    }
  })

});
