M.L.reactiveFullScreenStatus = new ReactiveVar(false);

document.addEventListener(screenfull.raw.fullscreenchange, function() {
  M.L.reactiveFullScreenStatus.set(screenfull.enabled && screenfull.isFullscreen);
});
