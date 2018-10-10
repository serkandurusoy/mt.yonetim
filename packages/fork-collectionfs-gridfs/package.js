Package.describe({
  name: 'cfs:gridfs',
  version: '0.0.33_1',
  summary: 'GridFS storage adapter for CollectionFS',
  git: 'https://github.com/CollectionFS/Meteor-cfs-gridfs.git'
});

Npm.depends({
  mongodb: '3.1.6',
  'gridfs-stream': '1.1.1'
  //'gridfs-locking-stream': '0.0.3'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use(['cfs:base-package@0.0.30', 'cfs:storage-adapter@0.2.3', 'ecmascript@0.1.0']);
  api.addFiles('gridfs.server.js', 'server');
  api.addFiles('gridfs.client.js', 'client');
});

Package.onTest(function(api) {
  api.use(['cfs:gridfs', 'test-helpers', 'tinytest'], 'server');
  api.addFiles('tests/server-tests.js', 'server');
  api.addFiles('tests/client-tests.js', 'client');
});
