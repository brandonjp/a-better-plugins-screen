jQuery( document ).ready( function( $ ) {

  // Optional debug output we'll use later, if desired
  let debugOn = false;
  let allowToggle = true;
  
  // Some plugins have names that don't match their slugs/urls
  // Here is a manual dictionary for matching those
  // Add new ones in alphabetical order as `slug:url`
  let betterLinks = {
    'peters-login-redirect': 'options-general.php?page=wplogin_redirect.php',
    'plainview-protect-passwords': 'options-general.php?page=pv_protect_passwords',
    'uam_user_group': 'admin.php?page=uam_user_group',
    'varnish-http-purge': 'admin.php?page=varnish-page'
  }

  // create a jquery method of :contains that is case-insensitive
  // from https://stackoverflow.com/a/8747204/264601 and https://stackoverflow.com/a/8747170/264601
  jQuery.expr[':'].icontains = function(a, i, m) {
    return jQuery(a).text().toUpperCase()
        .indexOf(m[3].toUpperCase()) >= 0;
  };

  // function to get the host of a url string
  let returnHost = function returnHost(urlString){
    let thisHost;
    let url = (urlString || '');
    if (url.length) {
      let a = document.createElement('a');
      a.href = url;
      thisHost = a.host;
    }
    return (thisHost || '');
  }
  // function to check if the host of a url matches current site
  let hostsMatch = function hostsMatch(urlString){
    let siteHost = window.location.host;
    let urlHost = returnHost(urlString || '');
    return siteHost===urlHost;
  }

  // function we'll use for various scanning methods
  let scanForPluginSettings = function scanForPluginSettings(scanType,plugData,debugOn){
    let returnValue, matchFound;
    let $adminMenu = jQuery('ul#adminmenu');
    // try looking up the slug in the manual dictionary
    if (scanType==='custom') {
      if (debugOn) console.log(`[${plugData.name}] Looking for a match in custom locations.`);
      matchFound = betterLinks[plugData.slug]; 
    }
    // try looking in the description column
    if (scanType==='description') {
      // Occasionally a developer will put their own Settings link in the plugin description
      // right now we're only looking for a link that contains the text string 'settings'
      if (debugOn) console.log(`[${plugData.name}] Looking for a match in the description.`);
      matchFound = plugData['row'].find(`a:icontains("settings")`).attr('href');
    }
    // try matching the plugin Name/Title in the menus
    if (scanType==='name') {
      if (debugOn) console.log(`[${plugData.name}] Looking for a match with name: ${plugData.name}`);
      matchFound = $adminMenu.find(`a:contains("${plugData.name}")`).attr('href');
    }
    // try matching the slug to an href in the admin menu
    if (scanType==='slug') {
      if (debugOn) console.log(`[${plugData.name}] Looking for a match with slug: ${plugData.slug}`);
      matchFound = $adminMenu.find(`a[href*="${plugData.slug}"]`).attr('href');
    }
    // try matching the plugin's filename
    if (scanType==='file') {
      // first search for a direct match with the plugin's full folder/file.php 
      if (debugOn) console.log(`[${plugData.name}] Looking for a match with filename: ${plugData.file}`);
      matchFound = $adminMenu.find(`a[href*="${plugData.file}"]`).attr('href');
    }
    // try matching variations of the plugin's filename
    if (scanType==='fileVariations') {
      // first search for a direct match with the plugin's full folder/file.php 
      if (debugOn) console.log(`[${plugData.name}] Looking for a match with filename variations: ${plugData.file}`);
      matchFound = $adminMenu.find(`a[href*="${plugData.file}"]`).attr('href');
      // check for variations
      if (!matchFound || !matchFound.length) {
        // take a plugin path 'this-folder/this-file.php' and return array ['this-file','this-folder']
        let stringParts = plugData.file.replaceAll('.php','').split('/');
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
          // remove duplicates from the array
          let stringPartsSet = [...new Set(stringParts)];
          if (debugOn) console.log('stringParts',stringParts);
          if (debugOn) console.log('stringPartsSet',stringPartsSet);
          // then check each variation in the array for a match 
          stringPartsSet.some(function(ll,ii){
            if (debugOn) console.log(`[${plugData.name}] Looking for a match with variation string #${ii}: ${ll}`);
            matchFound = $adminMenu.find(`a[href*="${ll}"]`).attr('href');
            if (matchFound && hostsMatch(matchFound)) {
              if (debugOn) console.log(`[${plugData.name}] Found a match with variation string #${ii}: ${ll} --  Match: ${matchFound}`);
              return matchFound;
            } else if (matchFound && !hostsMatch(matchFound)) {
              if (debugOn) console.log(`[${plugData.name}] Found a match but Hosts to do not match #${ii}: ${ll} --  Match: ${matchFound}`);
            }
          });
        }
      }
    }
    if (hostsMatch(matchFound)) returnValue = matchFound;
    return returnValue;
  }

  // Collect all active plugin rows
  let $allRows = jQuery('table.plugins #the-list tr.active').not('.plugin-update-tr');
  $allRows.each((_i, l) => {
    let $thisRow = jQuery(l);
    // Slug we'll use to find the settings page
    let slug = $thisRow.data('slug');
    // Plugin path, we probably won't use this
    let file = $thisRow.data('plugin');
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
      'file': file,
      'row' : $thisRow
    };
    // If there's no existing Settings link, try to locate & build one
    if (!settingsHref || !settingsHref.length) {
      if (debugOn) console.log(`Name: ${name}`,`Slug: ${slug}`,`File: ${file}`);
      if (debugOn) console.log(`[${name}] No default Settings link found. Looking for matches.`);
      
      // First, look directly for the slug in the admin menu
      settingsHref = scanForPluginSettings('slug',plugData,debugOn);

      // If we didn't find a url, try looking up the slug in the manual dictionary
      if (!settingsHref || !settingsHref.length) settingsHref = scanForPluginSettings('custom',plugData,debugOn);

      // If we didn't find a url, try matching the plugin file
      if (!settingsHref || !settingsHref.length) settingsHref = scanForPluginSettings('file',plugData,debugOn);

      // If we didn't find a url, try matching the plugin Name/Title
      if (!settingsHref || !settingsHref.length) settingsHref = scanForPluginSettings('name',plugData,debugOn);

      // If we didn't find a url, try looking in the description column
      if (!settingsHref || !settingsHref.length) settingsHref = scanForPluginSettings('description',plugData,debugOn);

      // If we didn't find a url, try matching the plugin file
      if (!settingsHref || !settingsHref.length) settingsHref = scanForPluginSettings('fileVariations',plugData,debugOn);

      // If we found a url for the Settings page, build the link
      if (settingsHref && settingsHref.length) {
        if (debugOn) console.log(`[${name}] Found settings link at: ${settingsHref}`);
        $settingsLink = jQuery(`<span class="settings a-better-plugins-screen-link"><a href="${settingsHref}">Settings</a></span>`);
      } else {
        if (debugOn) console.log(`[${name}] Could not find a Settings link for ${file}.`);
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
    if (debugOn || allowToggle) {
      let debugInfo = {
        'Name': name,
        'Slug': slug,
        'File': file,
        'Settings': settingsHref,
      };
      let $debugInfoDiv = jQuery('<div class="abps_debug_info"></div>');
      jQuery.each(debugInfo, function (k, v) {
        $debugInfoDiv.append(`<div>${k}: ${v}</div>`);
      });
      $debugInfoDiv.prependTo($rowActionsDiv).hide();
    }

  }); // END allRows.each

  if (allowToggle) {
    let $abpsRow = jQuery('#the-list > tr.active[data-slug="a-better-plugins-screen"][data-plugin="a-better-plugins-screen/a_better_plugins_screen.php"]');
    $abpsRow.find('.row-actions.visible').append('<span id="toggleInfo">Toggle Infos</span>');
    jQuery('#toggleInfo').on('click',function(){
      jQuery('div.abps_debug_info').toggle();
    });
  }

  // Go back to allRows and re-collect action spans, add separators 
  $allRows.find('td.plugin-title div.row-actions span + span').prepend(' | ');
  // console.log(jQuery.migrateWarnings);

} );
