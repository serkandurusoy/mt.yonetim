Package.describe({
  name: 'm:lib-core',
  version: '0.0.1',
  summary: 'Mitolojix core'
});

Package.onUse(function(api) {

  api.versionsFrom('1.0');

  const packages = [
    'meteor-base@1.1.0',
    'mobile-experience@1.0.5',
    'jquery@1.11.10',
    'underscore@1.0.10',
    'check@1.2.5',
    'random@1.0.10',
    'mongo@1.2.2',
    'reactive-var@1.0.11',
    'reactive-dict@1.1.9',
    'tracker@1.1.3',
    'session@1.1.7',
    'blaze@2.3.2',
    'blaze-html-templates@1.1.2',
    'email@1.2.3',
    'ejson@1.0.14',
    'accounts-base@1.3.4',
    'accounts-password@1.4.0',
    'standard-minifier-css@1.3.5',
    'standard-minifier-js@2.1.2',
    'es5-shim@4.6.15',
    'ecmascript@0.8.3',
    'ostrio:flow-router-extra@3.3.3',
    'kadira:blaze-layout@2.3.0',
    'okgrow:router-autoscroll@0.1.8',
    'aldeed:template-extension@4.1.0',
    'raix:handlebar-helpers@0.2.5',
    'yagni:split-on-newlines@0.0.5',
    'konecty:autolinker@1.0.3',
    'aldeed:reload-extras@0.0.1',
    'underscorestring:underscore.string@3.3.4',
    'ongoworks:speakingurl@9.0.0',
    'ecwyne:mathjs@2.7.0',
    'gfk:underscore-deep@1.0.0',
    'momentjs:moment@2.18.1',
    'rzymek:moment-locale-tr@2.14.1',
    'momentjs:twix@0.9.0',
    'risul:moment-timezone@0.5.7',
    'lbee:moment-helpers@1.3.10',
    'mizzao:timesync@0.5.0',
    'east5th:check-checker@0.2.1',
    'audit-argument-checks@1.0.7',
    'simple:reactive-method@1.0.2',
    'percolate:synced-cron@1.3.2',
    'aldeed:simple-schema@1.5.3',
    'aldeed:collection2@2.10.0',
    'dburles:collection-helpers@1.1.0',
    'matb33:collection-hooks@0.8.4',
    'zimme:collection-behaviours@1.1.3',
    'zimme:collection-timestampable@1.0.9',
    'mickaelfm:vermongo@2.0.1',
    'meteorhacks:aggregate@1.3.0',
    'ongoworks:security@2.1.0',
    'reywood:publish-composite@1.5.2',
    'tmeasday:publish-counts@0.8.0',
    'cfs:standard-packages@0.5.9',
    'cfs:ejson-file@0.1.4',
    'cfs:gridfs@0.0.33',
    'cfs:graphicsmagick@0.0.18',
    'cfs:ui@0.1.3',
    'faisalman:ua-parser-js@0.7.13',
    'pascoual:pdfjs@1.1.114',
    'manuel:reactivearray@1.0.6',
    'rubaxa:sortable@1.3.0',
    'flemay:less-autoprefixer@1.2.0'
  ];

  api.imply(packages);

  api.use('es5-shim@4.6.15');
  api.use('ecmascript@0.8.3');
  api.use('meteor-base@1.1.0');
  api.use('percolate:synced-cron@1.3.2');

  api.mainModule('main-server.js','server');
  api.mainModule('main-client.js','client');

});
