Package.describe({
  name: 'm:lib-tckimlik',
  version: '0.0.1',
  summary: 'TC kimlik no kontrolu for mitolojix'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use('zardak:soap@0.2.0');

  api.use('m:lib-core@0.0.1');

  api.mainModule('main-client.js','client');
  api.mainModule('main-server.js','server');

});
