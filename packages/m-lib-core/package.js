Package.describe({
  name: 'm:lib-core',
  version: '0.0.1',
  summary: 'Mitolojix core'
});

Package.onUse(function(api) {

  api.versionsFrom('1.0');

  var packages = [
    'meteor-base',
    'jquery',
    'underscore',
    'check',
    'random',
    'mongo',
    'reactive-var',
    'reactive-dict',
    'tracker',
    'session',
    'blaze-html-templates',
    'email',
    'ejson',
    'accounts-base',
    'accounts-password',
    'fastclick',
    //'appcache',
    'standard-minifier-css',
    'standard-minifier-js',
    'meteorhacks:kadira@2.0.0',
    'kadira:debug@3.0.0',
    'kadira:flow-router@2.0.0',
    'kadira:blaze-layout@2.0.0',
    'zimme:active-route@2.3.0',
    'arillo:flow-router-helpers@0.5.0',
    'okgrow:router-autoscroll@0.1.0',
    'aldeed:template-extension@4.0.0',
    'raix:handlebar-helpers@0.2.0',
    'yagni:split-on-newlines@0.0.5',
    'konecty:autolinker@1.0.3',
    'aldeed:reload-extras@0.0.1',
    'underscorestring:underscore.string@3.0.0',
    'ongoworks:speakingurl@9.0.0',
    'ecwyne:mathjs@2.0.0',
    'gfk:underscore-deep@1.0.0',
    'momentjs:moment@2.0.0',
    'rzymek:moment-locale-tr@2.0.0',
    'momentjs:twix@0.9.0',
    'risul:moment-timezone@0.5.0',
    'lbee:moment-helpers@1.2.0',
    'mizzao:timesync@0.4.0',
    'east5th:check-checker@0.2.0',
    'audit-argument-checks',
    'simple:reactive-method',
    'percolate:synced-cron@1.3.0',
    'aldeed:simple-schema@1.0.0',
    'aldeed:collection2@2.0.0',
    'dburles:collection-helpers@1.0.0',
    'matb33:collection-hooks@0.8.0',
    'zimme:collection-behaviours@1.0.0',
    'zimme:collection-timestampable@1.0.0',
    'mickaelfm:vermongo@1.0.0',
    'meteorhacks:aggregate@1.0.0',
    'ongoworks:security@2.0.0',
    'reywood:publish-composite@1.0.0',
    'tmeasday:publish-counts@0.7.0',
    'cfs:standard-packages@0.5.0',
    'cfs:ejson-file@0.1.0',
    'cfs:gridfs@0.0.33',
    'cfs:graphicsmagick@0.0.18',
    'cfs:ui@0.1.0',
    'faisalman:ua-parser-js@0.7.10',
    'pascoual:pdfjs@1.1.114',
    'manuel:reactivearray@1.0.0',
    'rubaxa:sortable@1.3.0',
    'flemay:less-autoprefixer@1.0.0'
  ];

  api.imply(packages);

  api.use('meteor-base');
  api.use('percolate:synced-cron@1.3.0');

  api.addFiles('cron-setup.js','server');

  api.addFiles('namespace.js');

  api.export('M');

});
