const {app, BrowserWindow} = require('electron');
const {stateManager} = require('./state-manager');
const debug = require('debug-electron')('ghost-desktop:main:open-url');
const queryString = require('query-string');

const urlMatchers = {
    openBlog: /ghost:\/\/open-blog\/\?(\S*)/,
    createDraft: /ghost:\/\/create-draft\/\?(\S*)/
};
let instance;

class OpenUrlManager {
    constructor() {
        if (instance) return instance;

        this.registerAsProtocolHandler();

        instance = this;
    }

    handleOpenUrlEvent(event, url = '') {
        if (event) {
            event.preventDefault();
        }

        debug(`Received open-url event with url ${url}`);

        if (urlMatchers.openBlog.test(url)) {
            return this.handleOpenBlogUrl(url);
        }

        if (urlMatchers.createDraft.test(url)) {
            return this.handleCreateDraftUrl(url);
        }
    }

    handleOpenBlogUrl(url = '') {
        const [, rawDetails] = url.match(urlMatchers.openBlog);
        let details;

        try {
            details = queryString.parse(rawDetails);
        } catch (e) {
            return debug('Failed to queryString.parse open-blog url');
        }

        debug(`Received open-blog event with blog url ${JSON.stringify(details)}`);
        this.sendToMainWindow('open-blog', details);
    }

    handleCreateDraftUrl(url = '') {
        const [, rawDetails] = url.match(urlMatchers.createDraft);
        let details;

        debug(`Received create-draft event with url ${rawDetails}`);

        try {
            details = queryString.parse(rawDetails);
        } catch (e) {
            return debug('Failed to queryString.parse create-draft url');
        }

        debug(`Received with create-draft event with details ${JSON.stringify(details || '{}')}`);
        this.sendToMainWindow('create-draft', details);
    }

    registerAsProtocolHandler() {
        app.on('open-url', (...args) => this.handleOpenUrlEvent(...args));

        if (process.platform === 'win32') {
            app.setAsDefaultProtocolClient('ghost');
        }
    }

    sendToMainWindow(channel, args) {
        stateManager.on('set-main-window-ready', () => {
            const win = BrowserWindow.fromId(stateManager.state.mainWindowId);
            if (win) win.webContents.send(channel, args);
        });
    }
}

const openUrlManager = new OpenUrlManager();

module.exports = {openUrlManager};
