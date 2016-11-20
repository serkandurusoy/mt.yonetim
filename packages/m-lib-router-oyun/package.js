Package.describe({
  name: 'm:lib-router-oyun',
  version: '0.0.1',
  summary: 'Routing for mitolojix oyun'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use('m:lib-core@0.0.1');

  api.mainModule('main.js');

});
