Package.describe({
  name: 'm:lib-utils',
  version: '0.0.1',
  summary: 'Common utilities for mitolojix'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use('m:lib-core@0.0.1');

  api.mainModule('main-client.js','client');
  api.mainModule('main-server.js','server');

});
