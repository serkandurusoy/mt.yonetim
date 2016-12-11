Package.describe({
  name: 'm:lib-toastr',
  version: '0.0.1',
  summary: 'Mitolojix toastr'
});

Package.onUse(function(api) {

  api.versionsFrom('1.0');

  api.use('m:lib-core@0.0.1');

  api.addFiles('toastr.less', 'client');
  api.addFiles('overrides.less', 'client');
  api.addFiles('toastr.js', 'client');

});
