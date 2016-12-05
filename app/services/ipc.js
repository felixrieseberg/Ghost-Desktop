import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
    init() {
        this.ipcRenderer = require('electron').ipcRenderer;

        // Setup all the handlers
        this.ipcRenderer.on('create-draft', (...args) => {
            this.restoreWindow();
            this.trigger('create-draft', ...args);
        });
        this.ipcRenderer.on('open-blog', (...args) => {
            this.restoreWindow();
            this.trigger('open-blog', ...args)
        });
    },

    /**
     * Notifies the main thread that we're ready to receive
     * instructions
     */
    notifyReady() {
        this.ipcRenderer.send('main-window-ready', true);
    },

    restoreWindow() {
        this.window = this.window || require('electron').remote.getCurrentWindow();

        if (this.window && !this.window.isVisible()) {
            this.window.show();
        }

        if (this.window && this.window.isMinimized()) {
            this.window.restore();
        }
    }
});
