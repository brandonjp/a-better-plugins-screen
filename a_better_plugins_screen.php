<?php
/*
Plugin Name: A Better Plugins Screen
Plugin URI: https://github.com/brandonjp/a-better-plugins-screen
Description: On the plugins admin screen, this puts 'Deactivate' first and places a 'Settings' link second (if it can find one) under each active plugin. There are no options. Activate the plugin to enable. Deactivate to disable. 
Version: 0.1.3
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
    $slug = 'a_better_plugins_screen';
    $js_file = plugin_dir_url(__FILE__) . $slug . '.js';
    // Reminder: `filemtime` gives warning on MacOS, but should be fine on server
    wp_enqueue_script($slug . '_js', $js_file, array(), date("ymdGis", filemtime($js_file)), false);
}

add_action('admin_enqueue_scripts', 'a_better_plugins_screen');
