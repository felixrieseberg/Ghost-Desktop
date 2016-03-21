/* jshint node: true */
'use strict';

const electron         = require('electron');
const winStateKeeper   = require('electron-window-state');
const checkForUpdate   = require('./basic-update');
const app              = electron.app;
const BrowserWindow    = electron.BrowserWindow;
const globalShortcut   = electron.globalShortcut;
const emberAppLocation = `file://${__dirname}/../dist/index.html`;


// Before we do anything else, handle Squirrel Events
if (require('./squirrel')) {
    return;
}

let mainWindow = null;
electron.crashReporter.start();

app.on('ready', function onReady() {
    // Default window state, if it doesn't exist.
    const mainWindowState = winStateKeeper({
      defaultWidth: 1000,
      defaultHeight: 800
    })

    // Instantiate the window with the existing size and position.
    mainWindow = new BrowserWindow({
        width: mainWindowState.width,
        height: mainWindowState.height,
        x: mainWindowState.x,
        y: mainWindowState.y,
        show: false
    });

    delete mainWindow.module;

    // Letting the state keeper listen to window resizing and window moving
    // event, and save them accordingly.
    mainWindowState.manage(mainWindow);

    // If you want to open up dev tools programmatically, call
    // mainWindow.openDevTools();
    mainWindow.loadURL(emberAppLocation);

    // If a loading operation goes wrong, we'll send Electron back to
    // Ember App entry point
    mainWindow.webContents.on('did-fail-load', () => mainWindow.loadURL(emberAppLocation));
    mainWindow.webContents.on('did-finish-load', () => mainWindow.show());
    mainWindow.on('closed', () => app.quit());

    // Setup Dev Shortcut on Windows (on Mac, the App Menu will take care of it)
    if (process.platform === 'win32') {
        globalShortcut.register('Ctrl+Shift+I', () => mainWindow.toggleDevTools());
    }
    
    checkForUpdate();
});
