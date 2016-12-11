Package.describe({
  name: 'faisalman:ua-parser-js',
  version: '0.7.12_1',
  summary: 'Lightweight JavaScript-based user-agent string parser',
  git: 'https://github.com/faisalman/ua-parser-js.git',
  documentation: 'readme.md'
});

Package.onUse(function (api) {
  api.addFiles("ua-parser.js", 'server');
  api.export("UAParser");
});
