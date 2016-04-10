BlazeLayout.setRoot('body');

Reload.delay = 4000;
Reload.beforeHook = function() {
  if (Meteor.userId()) {
    toastr.error('Birkaç saniye içinde Mitolojix uygulamasının güncel sürümüne yükseltileceksiniz.');
  }
};

Template.mainLayout.onRendered(function() {
  if (Reload.didHotReload) {
    if (Meteor.userId()) {
      toastr.success('Mitolojix uygulamasının güncel sürümüne başarıyla yükseltildiniz.', null, {onHidden: function() {Reload.didHotReload = false;}});
    }
  }
});

Template.registerHelper('isHotReloading', function() {
  return Reload.isHotReloading;
});
