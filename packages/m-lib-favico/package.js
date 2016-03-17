Package.describe({
  name: 'm:lib-favico',
  version: '0.0.1',
  summary: 'Mitolojix animated favicons'
});

Package.onUse(function(api) {

  api.versionsFrom('1.0');

  api.addFiles('favico.js');

});
