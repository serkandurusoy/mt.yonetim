Package.describe({
  name: 'm:lib-utils',
  version: '0.0.1',
  summary: 'Common utilities for mitolojix'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use('m:lib-core@0.0.1');

  api.addFiles('client.js', 'client');
  api.addFiles('common.js');

});
