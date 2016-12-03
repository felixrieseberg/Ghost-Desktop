import Ember from 'ember';

const browserWindow = require('electron').remote.getCurrentWindow();

export default Ember.Component.extend({
    classNameBindings: [':win-titlebar'],
    title: 'Ghost',
    windowMenu: Ember.inject.service(),
    isMaximized: browserWindow.isMaximized(),

    didInsertElement() {
        this._super(...arguments);

        browserWindow.on('enter-full-screen', () => this.set('isMaximized', true));
        browserWindow.on('maximize', () => this.set('isMaximized', true));
        browserWindow.on('leave-full-screen', () => this.set('isMaximized', false));
        browserWindow.on('unmaximize', () => this.set('isMaximized', false));
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
