# CTTab

Custom new tab page for the browser

The 'CT' in the name stands for 'Custom Tab'

[TODO List](./TODO.md)

# Setup

## Firefox

### Open in new window

1. Open Firefox and click the ☰ hamburger icon in the top right
2. Click 'Options' from the drop-down menu
3. Select 'Home' on the left panel
4. Beside 'Homepage and new windows', select 'Custom URLs' from the list.
5. Input 'https://darccyy.github.io/cttab' in the text box

### Open on new tab (Online)

1. Download '[New Tab Redirect](https://addons.mozilla.org/en-US/firefox/addon/custom-new-tab-page/)' from Firefox addons
2. Click the ☰ hamburger icon in the top right
3. Press 'Addons and Themes' from the drop-down menu
4. Find and click 'Custom New Tab Page' from the list
5. Click 'Options' on the top bar under the name
6. Input 'https://darccyy.github.io/cttab' in the text box
7. Scroll down and press 'Save'

### Open on new tab (Offline)

1. Create a text file one your Desktop and name it `autoconfig.cfg`
2. Insert this code: 

```
// First line must be comment! Do not delete this line!
var {classes:Cc,interfaces:Ci,utils:Cu} = Components;
try { Cu.import("resource:///modules/AboutNewTab.jsm");
var newTabURL = "file:///C:/Users/yourname/yourfile.html";
AboutNewTab.newTabURL = newTabURL;
} catch(e){Cu.reportError(e);} // report errors in the Browser Console 
```

3. Replace `file:///C:/Users/yourname/yourfile.html` with the path to the local file. Example: `file:///C:/Users/gangstaperson/Documents/new-tab.html`
4. Save the file and Copy and Paste it into the root Firefox program folder. It is most likely `C:\Program Files\Mozilla Firefox`. You need to copy + paste because the folder usually has permissions that restrict editing of files.
5. Create a new file called `autoconfig.js` and save it to Desktop
6. Insert this code: 

```
// First line must be comment! Do not delete this line!
pref("general.config.filename", "autoconfig.cfg");
pref("general.config.obscure_value", 0);
pref("general.config.sandbox_enabled", false);
```

7. Copy and Paste that file into `defaults/pref` in the Firefox program folder used before.
8. Disable any extensions that interfere with the tabs
9. Then restart Firefox.

To open on a new window, follow the steps under the above guide, with the file path the same as the new tab path.

## Chrome

### Open on new tab (Online)

1. Download 'New Tab Redirect' from Chrome Web Store
2. Click on the icon and press 'Options'
3. Type the url ('https://darccyy.github.io/cttab') in the text box

### Open on new tab (Offline)

1. Press the ⋮ menu button
2. Click on 'More Tools' and then 'Save page as'
3. Then choose a location to save it
4. See above to open on new tab, but use your own location instead

## Chromium Based (Edge, Brave, ect)

Try the method for Google Chrome, possibly using a ported extension.

## Internet Explorer

### Please use a different browser

## Other Browsers

If you are using a browser that is not supported, try the method with Chrome or Firefox. If it is not working, [Submit an Issue](https://github.com/darccyy/cttab/issues/new)

[Made by darcy](https://github.io/darccyy)
