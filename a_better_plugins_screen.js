(function ($) {
  'use strict';

  $(window).load(function () {

    // Optional debug output we'll use later, if desired
    let debugOn = false;

    // Some plugins have names that don't match their slugs/urls
    // Here is a manual dictionary for matching those
    // Add new ones in alphabetical order as `slug:url`
    let betterLinks = {
      'peters-login-redirect': 'options-general.php?page=wplogin_redirect.php',
      'varnish-http-purge': 'admin.php?page=varnish-page'
    }

    // Collect all active plugin rows
    let $allRows = jQuery('table.plugins #the-list tr.active');
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
      // If there's no existing Settings link, try to locate & build one
      if (!settingsHref || !settingsHref.length) {
        console.log(`${name} does not have a Settings link - ${slug}`);
        // First, look directly for the slug in the admin menu
        settingsHref = jQuery('ul#adminmenu').find(`a[href*="page=${slug}"]`).attr('href');
        console.warn(slug, settingsHref);
        // If we didn't find a url, try matching the pluing Name/Title
        if (!settingsHref || !settingsHref.length) {
          settingsHref = jQuery('ul#adminmenu').find(`a:contains("${name}")`).attr('href');
        }
        // If we still didn't find a url, try looking up the slug in the manual dictionary
        if (!settingsHref || !settingsHref.length) {
          settingsHref = betterLinks[slug];
        }
        // If we found a url for the Settings page, build the link
        if (settingsHref && settingsHref.length) {
          console.log(`${name} has a Settings link at: ${settingsHref}`);
          $settingsLink = jQuery(`<span class="settings"><a href="${settingsHref}">Settings</a></span>`);
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

  });
})(jQuery);