Package.describe({
  name: 'chart:chart',
  version: '1.0.2',
  summary: 'Responsive charting for the browser'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.addFiles('chart.js', 'client');
  api.addFiles('export.js', 'client');

  api.export('Chart', 'client');

});
