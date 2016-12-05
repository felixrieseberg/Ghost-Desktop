const {ipcMain, BrowserWindow} = require('electron');
const {state} = require('./state-manager');
const debug = require('debug-electron')('ghost-desktop:main:ipc');

ipcMain.on('blog-data', (event, data) => {
    state.blogs = state.blogs || [];

    if (state.blogs.length === 0) {
        state.blogs.push(data);
    } else {
        const foundBlogIndex = state.blogs.findIndex(item => (item.id === data.id));

        if (foundBlogIndex > -1) {
            state.blogs[foundBlogIndex] = data;
        } else {
            state.blogs.push(data);
        }
    }

    debug(`Blog ${data.id} (${data.url}) updated. Blogs known to main thread: ${state.blogs.length}`);
});

ipcMain.on('main-window-ready', (event, data) => {
    state['main-window-ready'] = true;

    debug(`Main window ready: ${data}`);
})

ipcMain.on('shutdown-requested', (event) => {
    if (event.sender) {
        const win = BrowserWindow.fromWebContents(event.sender);

        setTimeout(() => {
            if (win && !win.isDestroyed()) win.destroy();
        }, 300);
    }
});
