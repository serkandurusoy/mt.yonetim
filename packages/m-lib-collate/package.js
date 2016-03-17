Package.describe({
  name: 'm:lib-collate',
  version: '0.0.1',
  summary: 'Language based sorting and collations for mongo'
});

Package.onUse(function(api) {
  Npm.depends({
    ilib: "11.0.6"
  });

  api.versionsFrom('1.0');

  api.use('check');

  api.addFiles('collate.js', 'server');

  api.export('Collate', 'server');

});
