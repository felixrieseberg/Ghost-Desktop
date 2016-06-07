import Ember from 'ember';
import {injectCss} from '../utils/inject-css';
import Phrases from '../utils/phrases';

const {
    Component
} = Ember;

/**
 * The instance host component contains a webview, displaying a Ghost blog
 * inside an isolated container without Node integration.
 */
export default Component.extend({
    classNames: ['instance-host'],
    classNameBindings: ['blog.isSelected:selected'],
    preferences: Ember.inject.service(),

    didReceiveAttrs() {
        this._super(...arguments);
        this.set('isInstanceLoaded', false);
    },

    didRender() {
        this._super(...arguments);

        // Once the webview is created, we immediatly attach handlers
        // to handle the successful load of the content - and a
        // "new window" request coming from the instance
        this.$('webview')
            .off('did-finish-load')
            .on('did-finish-load', () => this._handleLoaded())
            .off('did-fail-load')
            .on('did-fail-load', (e, c, s) => this._handleLoadFailure(e, c, s))
            .off('new-window')
            .on('new-window', (e) => this._handleNewWindow(e))
            .off('console-message')
            .on('console-message', (e) => this._handleConsole(e));

        // Inject CSS, Update Name, Setup Spellchecker
        this._insertCss();
        this._updateName();
        this._setupSpellchecker();
        this._setupWindowFocusListeners();
    },

    didInsertElement() {
        this.get('preferences').on('selectedDictionaryChanged', () => this._setupSpellchecker());
    },

    /**
     * Makes the instance visible, overlaying the loading cat in the process
     */
    show() {
        // Fun fact: Chrome's loading apis will consider the website loaded as
        // soon as all assets are loaded. The app however still has to boot up.
        // To make things "feel" more snappy, we're hiding the loading from the
        // user.
        if (window.QUnit) {
            return this.set('isInstanceLoaded', true);
        }

        Ember.run.later(() => this.set('isInstanceLoaded', true), 1500);

    },

    /**
     * Programmatically attempt to login
     */
    signin() {
        let $webviews = this.$('webview');
        let username = this.get('blog.identification');
        let password = this.get('blog').getPassword();

        // If we can't find username or password, bail out and let the
        // user deal with whatever happened
        //
        // TODO: Ask the user for credentials and add them back to the OS
        // keystore
        if (!username || !password || !$webviews || !$webviews[0]) {
            return this.show();
        }

        let commands = [
            `$('input[name="identification"]').val('${username}');`,
            `$('input[name="password"]').val('${password}');`,
            `$('button.login').click();`
        ];

        // Execute the commands. Once done, the load handler will
        // be called again, and the instance set to loaded.
        $webviews[0].executeJavaScript(commands.join(''));
        this.set('isAttemptedSignin', true);
    },

    /**
     * Injects CSS files into the webview, one for each OS
     *
     * CSS files can be found in /public/assets/inject/css/*
     */
    _insertCss() {
        let $webviews = this.$('webview');

        if (!$webviews || !$webviews[0]) {
            return;
        }

        // Inject a CSS file for the specific platform (OS X; Windows)
        injectCss($webviews[0], process.platform);
        // Inject a CSS file for all platforms (all.css)
        injectCss($webviews[0], 'all');
    },

    /**
     * Handle's the 'did-finish-load' event on the webview hosting the Ghost blog
     */
    _handleLoaded() {
        let $webviews = this.$('webview');
        let title = ($webviews && $webviews[0]) ? $webviews[0].getTitle() : '';

        // Check if we're on the sign in page, and if so, attempt to
        // login automatically (without bothering the user)
        if (title.includes('Sign In') && !this.get('isAttemptedSignin')) {
            this.signin();
        } else {
            this.show();
        }
    },

    /**
     * Handles "new window" requests from the Ghost blog, piping them
     * through to the operating system's default browser
     * @param  {Object} e - jQuery Event
     */
    _handleNewWindow(e) {
        if (e && e.originalEvent && e.originalEvent.url) {
            requireNode('electron').shell.openExternal(e.originalEvent.url);
        }
    },

    /**
     * Handles failures while trying to load the Ghost Instance. Most common
     * cause: no internet. Information about error codes and descriptions
     * can be found in the Chrome source:
     * https://code.google.com/p/chromium/codesearch#chromium/src/net/base/net_error_list.h
     *
     * @param e {Object} - event
     * @param errorCode {number}
     * @param errorDescription {string}
     */
    _handleLoadFailure(e, errorCode, errorDescription = '') {
        let $webviews = this.$('webview');
        let path = requireNode('path');
        let errorPage = path.join(__dirname, '..', 'main', 'load-error', 'error.html');
        let validatedURL = e.originalEvent.validatedURL || '';

        // Don't try this at home
        if (validatedURL.includes('file://')) {
            return;
        }

        if ($webviews && $webviews[0]) {
            $webviews[0].loadURL(`file://${errorPage}?error=${errorDescription}`);
            this.set('isInstanceLoaded', true);
        }

        console.log(`Ghost Instance failed to load. Error Code: ${errorCode}`, errorDescription);
        // TODO: Handle notification click
        /*eslint-disable no-unused-vars*/
        if (this.get('preferences.isNotificationsEnabled')) {
            let errorNotify = new Notification('Ghost Desktop', {
                body: Phrases.noInternet
            });
        }
        /*eslint-enable no-unused-vars*/
    },

    /**
     * Handles console messages logged in the webview
     * @param  {Object} e - jQuery Event
     */
    _handleConsole(e) {
        if (e && e.originalEvent && e.originalEvent.message.includes('login-error')) {
            /*eslint-disable no-unused-vars*/
            if (this.get('preferences.isNotificationsEnabled')) {
                let errorNotify = new Notification(Phrases.loginFailed);
            }
            /*eslint-enable no-unused-vars*/

            // TODO: Show "update credentials screen here"
            return this.set('isInstanceLoaded', true);
        }

        if (e.originalEvent.message.includes('loaded')) {
            this.set('isInstanceLoaded', true);
        }
    },

    /**
     * Updates the current blog's name
     */
    _updateName() {
        if (this.get('blog')) {
            this.get('blog').updateName();
        }
    },

    /**
     * Sends the current spellchecker language to the webview
     */
    _setupSpellchecker() {
        let $webviews = this.$('webview');
        let $webview = ($webviews && $webviews[0]) ? $webviews[0] : undefined;

        if ($webview) {
            $webview.send('spellchecker', this.get('preferences.spellcheckLanguage'));
        }
    },

    _setupWindowFocusListeners() {
        let $webviews = this.$('webview');
        let $webview = ($webviews && $webviews[0]) ? $webviews[0] : undefined;

        window.addEventListener('blur', () => {
            $webview.blur();
        });

        window.addEventListener('focus', () => {
            $webview.focus();
        });
    }
});
