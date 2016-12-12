const {app, BrowserWindow} = require('electron');
const debug = require('debug-electron')('ghost-desktop:main:app');

const {fetchWindowState} = require('./window-state');
const {state} = require('./state-manager');
const {ensureSingleInstance} = require('./single-instance');
const {parseArguments} = require('./parse-arguments');

const emberAppLocation = `file://${__dirname}/../dist/index.html`;

// Before we do anything else, handle Squirrel Events
if (require('./squirrel')()) return;

let mainWindow = null;

function setupListeners() {
    // If a loading operation goes wrong, we'll send Electron back to
    // Ember App entry point
    mainWindow.webContents.on('did-fail-load', () => mainWindow.loadURL(emberAppLocation));
    mainWindow.webContents.on('did-finish-load', () => mainWindow.show());

    // Chromium drag and drop events tend to navigate the app away, making the
    // app impossible to use without restarting. These events should be prevented.
    mainWindow.webContents.on('will-navigate', (event) => event.preventDefault());

    if (process.platform === 'darwin') {
        mainWindow.on('closed', () => {
            debug('Main window closed, closing application');
            app.quit();
        });

        app.on('window-all-closed', () => app.quit())
    }


    // Close stuff a bit harder than usual
    app.on('before-quit', () => {
        mainWindow.removeAllListeners();
        mainWindow.close();

        setTimeout(() => app.exit(), 2000);
    });
}

function setupWindowProperties() {
    const titleBarStyle = (process.platform === 'darwin') ? 'hidden' : 'default';
    const frame = !(process.platform === 'win32');
    let windowState, usableState, windowStateKeeper;

    // Instantiate the window with the existing size and position.
    try {
        windowState = fetchWindowState();
        usableState = windowState.usableState;
        windowStateKeeper = windowState.windowStateKeeper;

        mainWindow = new BrowserWindow(
            Object.assign(usableState, {show: false, titleBarStyle, vibrancy: 'dark', frame})
        );
    } catch (error) {
        // Window state keeper failed, let's still open a window
        debug(`Window state keeper failed: ${error}`);
        mainWindow = new BrowserWindow({
            show: false,
            height: 800,
            width: 1000,
            titleBarStyle,
            vibrancy: 'dark',
            frame
        });
    }

    delete mainWindow.module;

    // Letting the state keeper listen to window resizing and window moving
    // event, and save them accordingly.
    if (windowStateKeeper) windowStateKeeper.manage(mainWindow);
}

app.on('ready', function onReady() {
    ensureSingleInstance();
    setupWindowProperties();
    parseArguments();

    // Greetings
    if (process.platform === 'win32') {
        console.log('\n Welcome to Ghost \n');
    } else {
        console.log('\n ⚡️  Welcome to Ghost  👻\n');
    }

    // If you want to open up dev tools programmatically, call
    // mainWindow.openDevTools();
    mainWindow.loadURL(emberAppLocation);
    state.mainWindowId = mainWindow.id;

    setupListeners();

    require('./ipc');
    require('./basic-auth');
});

module.exports = {mainWindow};
