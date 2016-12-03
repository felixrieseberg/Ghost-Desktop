import Ember from 'ember';

export default Ember.Component.extend({
    classNameBindings: [':win-titlebar'],
    title: 'Ghost',
    windowMenu: Ember.inject.service(),
    isMaximized: require('electron').remote.getCurrentWindow().isMaximized(),
    browserWindow: require('electron').remote.getCurrentWindow(),

    didInsertElement() {
        this._super(...arguments);

        this.browserWindow.on('enter-full-screen', () => this.setMaximized(true));
        this.browserWindow.on('maximize', () => this.setMaximized(true));
        this.browserWindow.on('leave-full-screen', () => this.setMaximized(false));
        this.browserWindow.on('unmaximize', () => this.setMaximized(false));
    },

    setMaximized(isMaximized) {
        if (this.isDestroyed || this.isDestroying) return;

        this.set('isMaximized', isMaximized);

        if (isMaximized) {
            document.body.classList.add('maximized');
        } else {
            document.body.classList.remove('maximized');
        }
    },

    actions: {
        maximize() {
            this.browserWindow.maximize();
        },

        minimize() {
            this.browserWindow.minimize();
        },

        unmaximize() {
            this.browserWindow.unmaximize();
        },

        close() {
            this.browserWindow.close();
        },

        mousedown(e) {
            e.preventDefault();
        },

        popupMenu() {
            this.get('windowMenu').popup();
        }
    }
});
