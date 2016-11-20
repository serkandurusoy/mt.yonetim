Package.describe({
  name: 'm:lib-accounts',
  version: '0.0.1',
  summary: 'Common utilities for mitolojix'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use('m:lib-core@0.0.1');

  api.mainModule('main-server.js','server');
  api.mainModule('main-client.js','client');

});
