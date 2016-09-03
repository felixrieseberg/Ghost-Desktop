import Ember from 'ember';
import findVisibleWebview from '../utils/find-visible-webview';

export default Ember.Component.extend({
    classNames: ['find-webview'],
    classNameBindings: ['isActive:active'],
    windowMenu: Ember.inject.service(),

    didInsertElement() {
        this._super(...arguments);
        this._insertMenuItem();
    },

    /**
     * Handler for the 'Find' menu item (called by the user with Cmd/Ctrl+F)
     * or using the application menu
     */
    handleFind() {
        this.toggleProperty('isActive');

        if (!this.get('isActive')) {
            const $webview = findVisibleWebview();
            if ($webview && $webview.stopFindInPage) {
                $webview.stopFindInPage('clearSelection');
            }
        } else {
            this.set('searchterm', '');
            Ember.run.later(() => this.$('input').focus());
        }
    },

    /**
     * Inserts the MenuItem for the find action into the app's menu,
     * using the window menu service
     */
    _insertMenuItem() {
        this.get('windowMenu').injectMenuItem({
            menuName: 'Edit',
            click: () => this.handleFind(),
            name: 'find-in-webview',
            label: '&Find',
            accelerator: 'CmdOrCtrl+F',
            addSeperator: true,
            position: 3
        });
    },

    actions: {
        /**
         * Handles the "key-up" event of the search input,
         * determining whether ot search or to cancel.
         *
         * @param {String} text
         * @param {Object} jQuery event object for "keyup"
         */
        keyup(text, e) {
            if (e.keyCode === 27) {
                this.send('cancel');
            } else {
                this.send('search');
            }
        },

        /**
         * Performs the search action, using Electron's
         * instance methods on a webview
         *
         * @param $webview {DOMElement} - jQuery DOMElement Webview
         */
        search($webview = findVisibleWebview()) {
            const searchterm = this.get('searchterm');

            if (searchterm && $webview) {
                $webview.findInPage(searchterm);
            }
        },

        /**
         * Cancels the current search
         *
         * @param $webview {DOMElement} - jQuery DOMElement Webview
         */
        cancel($webview = findVisibleWebview()) {
            if ($webview) {
                $webview.stopFindInPage('clearSelection');
            }
        }
    }
});
