Package.describe({
  name: 'm:lib-fullscreen',
  version: '0.0.1',
  summary: 'Mitolojix fullscreen'
});

Package.onUse(function(api) {

  api.versionsFrom('1.0');

  api.use('m:lib-core@0.0.1');

  api.addFiles('fullscreen.js', 'client');
  api.addFiles('reactive.js', 'client');

});
