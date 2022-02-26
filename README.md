# CTTab <img src="./image/icon/128.png" alt="Small pink and cyan icon reading 'CTTab'" style="height: 1em" />

The easiest Custom New Tab page for the browser!

The '_CT_' in the name stands for '_Custom Tab_' :)

**Check it out**: [CTTab Website](https://darccyy.github.io/cttab)

# Contents

- [Features](#features) - Explains the Awesome Features!
- [Setup](#setup) - How to set up on browser
- [Contributing](#contributing) - How to contribute to the project
- [Issues](#issues) - How to submit an issue

<img src="./image/icon/512.png" alt="Pink and cyan icon reading 'CTTab'" title="Really cool icon!" />

# Features

## Shortcuts

Fully customizable shortcuts to commonly visited sites!

- Click the Edit button to change the link and title of each shortcut
- Remove by entering blank text into the URL input box
- Change the amount of shortcuts shown in the top bar '_Change shortcuts_'

## Quick Notes

Easy notepads for taking short notes in an instant!

- Create a new note in the top bar '_Add note_'
- Type some text
- Delete the note with the trash icon
- Create multiple notes at once!

## Custom Background Colour & Image

Create any sort of dynamic background, with random colours and images!

- Open the background editor in the top bar '_Change background_'
- Choose how to change the background

### Reset all (`0`)

Change all the background to default solid colour `#202038`

### Solid colour (Or background of transparent image) (`1`)

- Change the solid background color
- If an image is enabled with a transparent background, the colour will be the background
- Add any CSS compatible colour, hex codes (`#XXXXXX`), rgb (`rgb(xx, xx, xx)`), or hsl (`hsl(xx, xx, xx)`, **NOT** `hsv`),
- Add `$` to represent default colour
- Add multiple colours by seperating by space - Colour will be chosen randomly each load
- Add randomly generated colour with `?`
- - Any text after the `?` will be used as parameters, as follows
- - To change the HSV requirements, use `a=n`, `a<n`, `a>n` syntax, with `a` being a letter of `h` (hue), `s` (saturation), or `v` (value), and `n` being a number between `0-360` for hue, or `0-100` for saturation and value
- - To change the weight (chance) of the generated colour being chosen, use `w=n` or `W=n` with `n` being a number from `0-Infinity` - `w` (Lowercase) represents weight relative to the amount of other colours given, whereas `W` (Uppercase) represents absolute weight

### Local or online image (`2`)

Add the URL of a local image file, or an online link to an image

### Copy current colour (`3`)

If you like a randomly generated colour, you can use this option to select the current background colour (Also works with custom colours)

## Custom Title & Header

Change the Header bar and the Title (Seen in Tabs, Bookmarks, ect.)!

- Click the header to edit, very easy and simple!

## Confetti

Instant confetti celebration with one simple click!

This is a secret feature, can you find it?

## Import & Export Settings

Save and load settings to a JSON file on your computer! Back up your shortcuts!

- Export settings and save to `cttab-data.json` in the top bar '_Export_'
- Import settings from a file in the top bar '_Import_'
- Settings are saved to `localStorage`

## Change Language

Choose between **TWO** languages!

If you can translate into more languages, please consider [contributing](#contributing) to to this project!

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

**Please use a different browser**, this is not 2010

## Other Browsers

If you are using a browser that is not supported, try the method with Chrome or Firefox. If it is not working, [Submit an Issue](#issues)

# Contributing

Make sure you have [Git](https://git-scm.com/downloads) installed.

This has been tested in Windows 10 with PowerShell, but it should work for other systems and command interfaces.

If you run into any problems, [Submit an Issue](#issues) for this repo and I will try to help.

```powershell
# Clone repository into ./cttab
git clone https://github.com/darccyy/react-express-template.git

# ... make changes to files...

# Add and commit files
git add .
git commit -m "detailed commit message"

# Create pull request
git push -u origin main
```

# Issues

[Submit an Issue](https://github.com/darccyy/cttab/issues/new/choose) - Choose a template and follow the steps

[TODO List](./TODO.md) - View issues being worked on

---

[Made by darcy](https://github.io/darccyy)
