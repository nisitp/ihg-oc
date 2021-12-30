<?php
$databases['default']['default'] = array (
  'database' => 'oc',
  'username' => 'root',
  'password' => 'root',
  'prefix' => '',
  'host' => 'ocdb',
  'port' => '3306',
  'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql',
  'driver' => 'mysql',
);

$settings['cache']['bins']['render'] = 'cache.backend.null';
$settings['cache']['bins']['page'] = 'cache.backend.null';
$settings['cache']['bins']['dynamic_page_cache'] = 'cache.backend.null';
$settings['rebuild_access'] = TRUE;
$settings['skip_permissions_hardening'] = TRUE;
$config['system.logging']['error_level'] = 'verbose';
$settings['container_yamls'][] = DRUPAL_ROOT . '/sites/default/development.services.yml';

// disable caching
$conf['preprocess_css'] = FALSE;
$conf['preprocess_js'] = FALSE;
