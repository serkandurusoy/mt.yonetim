BlazeLayout.setRoot('body');

Reload.delay = M.E.ToastDismiss;
Reload.beforeHook = function() {
  if (Meteor.userId()) {
    Materialize.toast('Birkaç saniye içinde Mitolojix uygulamasının güncel sürümüne yükseltileceksiniz', M.E.ToastDismiss, 'red');
  }
};

Template.mainLayout.onRendered(function() {
  if (Reload.didHotReload) {
    if (Meteor.userId()) {
      Materialize.toast('Mitolojix uygulamasının güncel sürümüne başarıyla yükseltildiniz', M.E.ToastDismiss, 'green', function() {Reload.didHotReload = false;});
    }
  }
});

Template.registerHelper('isHotReloading', function() {
  return Reload.isHotReloading;
});
