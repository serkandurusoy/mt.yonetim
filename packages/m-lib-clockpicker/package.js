Package.describe({
  name: 'm:lib-clockpicker',
  version: '0.0.1',
  summary: 'Materialize clockpicker for mitolojix'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.addFiles('materialize.clockpicker.css','client');
  api.addFiles('materialize.clockpicker.js','client');

});
