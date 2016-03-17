Package.describe({
  name: 'm:lib-router-frontend',
  version: '0.0.1',
  summary: 'Routing for mitolojix frontend'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use('m:lib-core@0.0.1');

  api.addFiles('common.js');

});
