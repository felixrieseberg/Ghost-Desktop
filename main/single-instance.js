const {app, BrowserWindow} = require('electron');
const {mainWindow} = require('./app');
const {parseArguments} = require('./parse-arguments');

/**
 * Ensures that there's always only one instance of Ghost Desktop running.
 * Should we open up a second instance due to a deeplink (which happens
 * only on Windows, this method's callback will be called with the instance's
 * arguments as a parameter, allowing us to respond to them).
 */
function ensureSingleInstance() {
    const shouldQuit = app.makeSingleInstance((args) => {
        let window = mainWindow;

        if (!window) {
            const allWindows = BrowserWindow.getAllWindows();
            window = allWindows && allWindows.length > 0 ? allWindows[0] : null;
        }

        // Focus and restore window, if it's not in the foreground
        if (window && window.isMinimized()) window.restore();
        if (window) window.focus();

        // Parse arguments
        parseArguments(args);
    });

    if (shouldQuit) app.quit();
}

module.exports = {ensureSingleInstance};
