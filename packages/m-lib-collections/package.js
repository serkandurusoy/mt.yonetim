Package.describe({
  name: 'm:lib-collections',
  version: '0.0.1',
  summary: 'Collections for mitolojix'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use('m:lib-core@0.0.1');

  api.addFiles('common.js');
  api.addFiles('server.js','server');

});
