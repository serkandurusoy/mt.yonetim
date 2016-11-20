Package.describe({
  name: 'm:lib-sinav-soru-component',
  version: '0.0.1',
  summary: 'Sinav & soru components for mitolojix'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use('m:lib-core@0.0.1');
  api.use('m:lib-utils@0.0.1');

  api.mainModule('main-client.js','client');

});
