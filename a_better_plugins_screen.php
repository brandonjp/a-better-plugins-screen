<?php
/*
Plugin Name: A Better Plugins Screen
Plugin URI: https://github.com/brandonjp/a-better-plugins-screen
GitHub Plugin URI: https://github.com/brandonjp/a-better-plugins-screen
Description: On the plugins admin screen, this puts 'Deactivate' first and places a 'Settings' link second (if it can find one) under each active plugin. There are no options. Activate the plugin to enable. Deactivate to disable. 
Version: 0.5.0
Author: Brandon Pfeiffer
Author URI: http://brandonjp.com

Text Domain: a-better-plugins-screen
*/


// Require Dependencies: https://github.com/afragen/wp-dependency-installer#description
require_once __DIR__ . '/vendor/autoload.php';
add_action( 'plugins_loaded', function() {
  WP_Dependency_Installer::instance( __DIR__ )->run();
});



function a_better_plugins_screen($screen)
{
    // only run this on the plugins screen
    if ('plugins.php' != $screen) {
        return;
    }

    // make sure we can get plugin data for versioning
    if(!function_exists('get_plugin_data')){
        require_once(ABSPATH.'wp-admin/includes/plugin.php');
    }
    $plugin_data = get_plugin_data(__FILE__);

    // now add our script to the page
    $slug = 'a_better_plugins_screen';
    $js_file = plugin_dir_url(__FILE__) . $slug . '.js';
    wp_enqueue_script($slug . '_js', $js_file, array('jquery'), $plugin_data['Version'], false);
}

add_action('admin_enqueue_scripts', 'a_better_plugins_screen');
