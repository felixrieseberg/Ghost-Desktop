import Ember from 'ember';

const browserWindow = require('electron').remote.getCurrentWindow();

export default Ember.Component.extend({
    classNameBindings: [':win-titlebar'],
    title: 'Ghost',
    windowMenu: Ember.inject.service(),
    isMaximized: browserWindow.isMaximized(),

    didInsertElement() {
        this._super(...arguments);

        browserWindow.on('enter-full-screen', () => this.setMaximized(true));
        browserWindow.on('maximize', () => this.setMaximized(true));
        browserWindow.on('leave-full-screen', () => this.setMaximized(false));
        browserWindow.on('unmaximize', () => this.setMaximized(false));
    },

    setMaximized(isMaximized) {
        this.set('isMaximized', isMaximized);

        if (isMaximized) {
            document.body.classList.add('maximized');
        } else {
            document.body.classList.remove('maximized');
        }
    },

    actions: {
        maximize() {
            browserWindow.maximize();
        },

        minimize() {
            browserWindow.minimize();
        },

        unmaximize() {
            browserWindow.unmaximize();
        },

        close() {
            browserWindow.close();
        },

        mousedown(e) {
            e.preventDefault();
        },

        popupMenu() {
            this.get('windowMenu').popup();
        }
    }
});
