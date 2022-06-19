<?php
/*
Plugin Name: A Better Plugins Screen
Plugin URI: https://github.com/brandonjp/a-better-plugins-screen
Description: On the plugins admin screen, this puts 'Deactivate' first and places a 'Settings' link second (if it can find one) under each active plugin. There are no options. Activate the plugin to enable. Deactivate to disable. 
Version: 0.3.1
Author: Brandon Pfeiffer
Author URI: http://brandonjp.com

Text Domain: a-better-plugins-screen
*/


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
