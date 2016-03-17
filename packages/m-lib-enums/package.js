Package.describe({
  name: 'm:lib-enums',
  version: '0.0.1',
  summary: 'Mitolojix enumerations'
});

Package.onUse(function(api) {

  api.versionsFrom('1.0');

  api.use('m:lib-core@0.0.1');

  api.addFiles('enums.js');

});
