(function ($) {
  // 'use strict';

  $(window).on('load',function () {

    // Optional debug output we'll use later, if desired
    let debugOn = false;

    // Some plugins have names that don't match their slugs/urls
    // Here is a manual dictionary for matching those
    // Add new ones in alphabetical order as `slug:url`
    let betterLinks = {
      'peters-login-redirect': 'options-general.php?page=wplogin_redirect.php',
      'varnish-http-purge': 'admin.php?page=varnish-page'
    }

    let scanForPluginSettings = function scanForPluginSettings(scanType,plugData,debugOn){
      let returnValue;
      let $adminMenu = jQuery('ul#adminmenu');
      if (scanType==='custom') {
        if (debugOn) console.log(`[${plugData.name}] Looking for a match in custom locations.`);
        returnValue = betterLinks[plugData.slug];
      }
      if (scanType==='name') {
        if (debugOn) console.log(`[${plugData.name}] Looking for a match with name: ${plugData.name}`);
        returnValue = $adminMenu.find(`a:contains("${plugData.name}")`).attr('href');
      }
      if (scanType==='slug') {
        if (debugOn) console.log(`[${plugData.name}] Looking for a match with slug: ${plugData.slug}`);
        returnValue = $adminMenu.find(`a[href*="${plugData.slug}"]`).attr('href');
      }
      if (scanType==='plug') {
        if (debugOn) console.log(`[${plugData.name}] Looking for a match with plugin file: ${plugData.plug}`);
        returnValue = $adminMenu.find(`a[href*="${plugData.plug}"]`).attr('href');
        // check for variations
        if (!returnValue || !returnValue.length) {
          // take a plugin path 'this-folder/this-file.php' and return array ['this-file','this-folder']
          let stringParts = plugData.plug.replaceAll('.php','').split('/');
          if (stringParts && stringParts.length) {
            // start by amending the array with other possible variations
            stringParts.forEach(function(l,i){
              let withHyphens = l.replaceAll('_','-');
              stringParts.push(withHyphens);

              let withUnderscores = l.replaceAll('-','_');
              stringParts.push(withUnderscores);

              let withoutSeparators = l.replaceAll('-','').replaceAll('_','');
              stringParts.push(withoutSeparators);
            });
            // then check each variation in the array for a match
            stringParts.forEach(function(ll,ii){
              if (debugOn) console.log(`[${plugData.name}] Looking for a match with string: ${ll}`);
              returnValue = $adminMenu.find(`a[href*="${ll}"]`).attr('href');
              if (returnValue) return returnValue;
            });
          }
        }
      }
      return returnValue;
    }

    // Collect all active plugin rows
    let $allRows = jQuery('table.plugins #the-list tr.active').not('.plugin-update-tr');
    $allRows.each((_i, l) => {
      let $thisRow = jQuery(l);
      // Slug we'll use to find the settings page
      let slug = $thisRow.data('slug');
      // Plugin path, we probably won't use this
      let plug = $thisRow.data('plugin');
      // Name of the plugin
      let name = $thisRow.find('td.plugin-title strong').text();
      // The existing row actions wrapper
      let $rowActionsDiv = $thisRow.find('td.plugin-title div.row-actions');
      $rowActionsDiv.find('span').each((ii, ll) => {
        // Remove the " | " pipe separators
        jQuery(ll).html(jQuery(ll).children());
      });

      // The existing Settings link, if any
      let $settingsLink = $rowActionsDiv.find('span:contains("Settings")');
      let settingsHref = $settingsLink.find('a').attr('href');
      let plugData = {
        'name': name,
        'slug': slug,
        'plug': plug
      };
      // If there's no existing Settings link, try to locate & build one
      if (!settingsHref || !settingsHref.length) {
        console.log(`Found: ${name}, ${slug}, ${plug}`);
        console.log(`[${name}] No default Settings link found. Looking for matches.`);
        
        // First, look directly for the slug in the admin menu
        settingsHref = scanForPluginSettings('slug',plugData,debugOn);

        // If we didn't find a url, try matching the plugin file
        if (!settingsHref || !settingsHref.length) settingsHref = scanForPluginSettings('plug',plugData,debugOn);

        // If we didn't find a url, try matching the plugin Name/Title
        if (!settingsHref || !settingsHref.length) settingsHref = scanForPluginSettings('name',plugData,debugOn);

        // If we still didn't find a url, try looking up the slug in the manual dictionary
        if (!settingsHref || !settingsHref.length) settingsHref = scanForPluginSettings('custom',plugData,debugOn);

        // If we found a url for the Settings page, build the link
        if (settingsHref && settingsHref.length) {
          if (debugOn) console.log(`[${name}] Found settings link at: ${settingsHref}`);
          $settingsLink = jQuery(`<span class="settings a-better-plugins-screen-link"><a href="${settingsHref}">Settings</a></span>`);
        } else {
          if (debugOn) console.log(`[${name}] Could not find a Settings link for ${plug}.`);
          $settingsLink = jQuery(`<span class="settings a-better-plugins-screen-link">No Settings Found</span>`);
        }
      }
      // If there is now a Settings link, move it to the front (it will be bumped to second place in a moment)
      if ($settingsLink.length) {
        $settingsLink.prependTo($rowActionsDiv);
      }
      // The Deactivate link
      let $deactivateLink = $rowActionsDiv.find('span.deactivate');
      // Move the 'Deactivate' link to the front
      $deactivateLink.prependTo($rowActionsDiv);

      // Maybe we should add back / update the default classes 0,1,2,etc
      // but I don't think they actually matter - so skipping for now

      // Add some debug info to each row, if enabled
      if (debugOn) {
        let debugInfo = {
          'Slug': slug,
          'Plugin': plug,
          'Settings': settingsHref,
        };
        jQuery.each(debugInfo, function (k, v) {
          $rowActionsDiv.prepend(`<div>${k}: ${v}</div>`);
        });
      }

    }); // END allRows.each

    // Go back to allRows and re-collect action spans, add separators 
    $allRows.find('td.plugin-title div.row-actions span + span').prepend(' | ');
    // console.log(jQuery.migrateWarnings);

  });
})(jQuery);
