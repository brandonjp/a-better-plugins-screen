<?php
/*
Plugin Name: A Better Plugins Screen
Plugin URI: http://brandonjp.com
Description: On the WordPress Admin Plugins Screen, the links under each plugin are in a random order. This always puts 'Deactivate' first and places a 'Settings' link second (if it can find one). There are no options. Activate the plugin to enable. Deactivate to disable. 
Version: 0.1.2
Author: Brandon Pfeiffer
Author URI: http://brandonjp.com

Text Domain: a-better-plugins-screen
*/

function a_better_plugins_screen()
{
    // only run this on the plugins screen
    if ('plugins.php' != $hook) {
        return;
    }
    $slug = 'a_better_plugins_screen';
    $js_file = plugin_dir_url(__FILE__) . $slug . '.js';
    // $css_file = plugin_dir_url(__FILE__) . $slug . '.css';
    wp_enqueue_script($slug . '_js', $js_file, array(), filemtime($js_file), false);
    // wp_enqueue_style($slug . '_css', $css_file, array(), filemtime($css_file), false);
}

add_action('admin_enqueue_scripts', 'a_better_plugins_screen');
