/* jshint node: true */
'use strict';

const electron         = require('electron');
const app              = electron.app;
const BrowserWindow    = electron.BrowserWindow;
const emberAppLocation = `file://${__dirname}/../dist/index.html`;

let mainWindow = null;

electron.crashReporter.start();

app.on('ready', function onReady() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        show: false
    });

    delete mainWindow.module;

    // If you want to open up dev tools programmatically, call
    // mainWindow.openDevTools();

    mainWindow.loadURL(emberAppLocation);

    // If a loading operation goes wrong, we'll send Electron back to
    // Ember App entry point
    mainWindow.webContents.on('did-fail-load', () => {
        mainWindow.loadURL(emberAppLocation);
    });
    mainWindow.on('closed', () => app.quit());
    mainWindow.webContents.on('did-finish-load', () => mainWindow.show());
});
