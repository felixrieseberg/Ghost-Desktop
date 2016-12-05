const {app, BrowserWindow} = require('electron');
const stateManager = require('./state-manager');
const debug = require('debug-electron')('ghost-desktop:main:open-url');

const urlMatcher = /ghost:\/\/open-blog\/(\S*)/;
let instance;

class OpenUrlManager {
    constructor() {
        if (instance) return instance;
        instance = this;
    }

    handleOpenUrlEvent(event, url = '') {
        event.preventDefault();

        debug(`Received open-url event with url ${url}`);

        if (urlMatcher.test(url)) {
            return this.handleOpenBlogUrl(url);
        }
    }

    handleOpenBlogUrl(url = '') {
        const [, blogUrl] = url.match(urlMatcher);

        debug(`Received open-blog event with blog url ${blogUrl}`);

        // Wait for the app to be ready
        stateManager.on('set-main-window-ready', () => {
            const win = BrowserWindow.fromId(stateManager.state.mainWindowId);
            if (win) win.webContents.send('open-blog', blogUrl);
        });
    }

    registerAsProtocolHandler() {
        if (process.platform === 'win32') {
            app.setAsDefaultProtocolClient('ghost');
        }
    }
}


module.exports = OpenUrlManager;
