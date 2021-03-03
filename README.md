# a-better-plugins-screen
A Better Plugins Screen for Wordpress

Sometimes, I know I have a plugin installed but can't remember what it's called or where menu link for the settings page is. So I go to the Plugins Screen in the WordPress Admin.

But on the WordPress Admin Plugins Screen, the links under each plugin are in a random order and not every plugin adds it's own Settings link. 

So, this plugin creates "A Better Plugins Screen" by always putting 'Deactivate' first and placing a 'Settings' link second (if it can find one). 

There are no additional options. Activate the plugin to enable. Deactivate to disable. 

Note: Some plugins don't use their 'slug' or plugin name as their menu link title, so I've created a rudimentary dictionary at the top of the JS file to address these cases. You can create a pull request to contribute others. 


## To-Do

* Use `plugin_action_links_` instead?
