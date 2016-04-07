Package.describe({
  name: 'm:lib-sinav-soru-component',
  version: '0.0.1',
  summary: 'Sinav & soru components for mitolojix'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use('m:lib-core@0.0.1');

  api.addFiles('yonerge.html', 'client');

  api.addFiles('dogruYanlis.html', 'client');
  api.addFiles('dogruYanlis.js', 'client');

  api.addFiles('coktanTekSecmeli.html', 'client');
  api.addFiles('coktanTekSecmeli.js', 'client');

  api.addFiles('coktanCokSecmeli.html', 'client');
  api.addFiles('coktanCokSecmeli.js', 'client');

  api.addFiles('siralama.html', 'client');
  api.addFiles('siralama.js', 'client');

  api.addFiles('eslestirme.html', 'client');
  api.addFiles('eslestirme.js', 'client');

  api.addFiles('boslukDoldurma.html', 'client');
  api.addFiles('boslukDoldurma.js', 'client');

  api.addFiles('soruCubugu.html', 'client');
  api.addFiles('soruCubugu.js', 'client');

});
