=== A Better Plugins Screen ===
Contributors: brandonjp
Tags: 
Donate link: https://paypal.me/brandonjp
Requires at least: 4.9
Tested up to: 6.0 
Requires PHP: 5.6
Stable tag: 3.1

Add consistency to the Plugins screen for finding your way around. 

== Description ==

Sometimes, I know I have a plugin installed but can't remember what it's called or where menu link for the settings page is. So I go to the Plugins Screen in the WordPress Admin.

But on the WordPress Admin Plugins Screen, the links under each plugin are in a random order and not every plugin adds it's own Settings link. 

So, this plugin creates "A Better Plugins Screen" by always putting 'Deactivate' first and placing a 'Settings' link second (if it can find one). 

There are no additional options. Activate the plugin to enable. Deactivate to disable. 

![PixelSnap 2021-10-04 at 21 28 57@2x](https://user-images.githubusercontent.com/199599/135952335-5eb98ae3-9054-4081-af10-89376740b492.png)

Note: Some plugins don't use their 'slug' or plugin name as their menu link title, so I've created a rudimentary dictionary at the top of the JS file to address these cases. You can create a pull request to contribute others. 


== Installation ==

Just install from your WordPress "Plugins > Add New" screen and all will be well. Manual installation is very straightforward as well:

1. Upload the zip file and unzip it in the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. That's it. There are no settings for this plugin.

== Frequently Asked Questions ==

= What does it do? =

It primarily does two things for each plugin in your plugin list:

1. It adds a "Settings" link to the admin screen for each plugin.
2. It reorders links under the plugin name so that "Deactivate" & "Settings" are always first.

= How does it do it? =

With JavaScript. When you visit your plugins screen, this plugin will...

1. scan your list of plugins
2. if it finds a plugin that does not have a "Settings" link on the screen
3. it will try to find a matching admin menu link
4. if it finds a match, it will add a "Settings" link.

Finally, it will re-order the links under each plugin name to ensure that "Deactivate" is always first, followed by "Settings" of "No Settings Found", followed by any other links that were already on the screen. 

= Does this change any files? =

No. This plugin does not change anything. It does not write anything to your database. In fact, it does not even run unless you are on your plugins screen.

= Help, it's not finding the settings like for a plugin. How fix that? =

See the next question...

= How can I help / contribute? =

Just [edit the JS file on Github](https://github.com/brandonjp/a-better-plugins-screen/blob/main/a_better_plugins_screen.js#L7) by adding the slug and admin url for the plugin you want to support, then submit a pull request! 

Too complicated? [Create an issue on Github](https://github.com/brandonjp/a-better-plugins-screen/issues) and give us the name of the plugin and a link to it. And we'll see if we can add it. 

== Changelog ==

= 0.5.0 =
* add toggle to switch between original and better row action links

= 0.4.1 =
* add WP Dependency Installer as dependency
* add Git Updater to allow updates from public git repo

= 0.3.1 =
* add content and FAQ to readme.txt
* JS: add comments to the 'betterLinks' object
* JS: add support for a couple new plugins

= 0.3.0 =
* init changelog entry 
* JS: improve lookup of admin links
