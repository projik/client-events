Package.describe({
  name: 'projik:client-events',
  version: '0.1.5',
  summary: 'triggers more developer friendly client touch events',
  git: 'https://github.com/projik/client-events.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.use([
    'jquery'
  ], 'client');
  api.addFiles([
    'client-events.js'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('projik:client-events');
  api.addFiles('client-events-tests.js');
});