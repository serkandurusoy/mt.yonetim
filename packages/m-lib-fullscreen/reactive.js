Meteor.startup(function() {

  M.L.reactiveFullScreenStatus = new ReactiveVar(false);

  document.addEventListener(screenfull.raw.fullscreenchange, function() {
    M.L.reactiveFullScreenStatus.set(screenfull.enabled && screenfull.isFullscreen);
  });
  
  Template.registerHelper('fullScreenTest', function() {
    return {
      enabled: screenfull.enabled,
      active: M.L.reactiveFullScreenStatus.get()
    }
  })

});
