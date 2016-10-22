import Ember from 'ember';
import ENV from 'ghost-desktop/config/environment';
import {injectCss} from '../utils/inject-css';
import Phrases from '../utils/phrases';

const {Component} = Ember;

/**
 * The instance host component contains a webview, displaying a Ghost blog
 * inside an isolated container without Node integration.
 */
export default Component.extend({
    classNames: ['instance-host'],
    classNameBindings: ['blog.isSelected:selected'],
    preferences: Ember.inject.service(),

    /**
     * Observes the 'isResetRequested' property, resetting the instance if
     * it is set to true. This is our way of being able to refresh the blog
     * if properties changed that are not part of the cleartext model (like
     * the password, for instance)
     */
    blogObserver: Ember.observer('blog.isResetRequested', function() {
        const blog = this.get('blog');

        if (blog && blog.get('isResetRequested')) {
            blog.set('isResetRequested', false);
            blog.save();

            if (this.get('isAttemptedSignin')) {
                this.reload();
            }
        }
    }),

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
            .off('did-start-loading')
            .on('did-start-loading', () => this._handleStartLoading())
            .off('did-finish-load')
            .on('did-finish-load', () => this._handleLoaded())
            .off('did-fail-load')
            .on('did-fail-load', (e, c, s) => this._handleLoadFailure(e, c, s))
            .off('new-window')
            .on('new-window', (e) => this._handleNewWindow(e))
            .off('console-message')
            .on('console-message', (e) => this._handleConsole(e));
    },

    didInsertElement() {
        this.get('preferences').on('selectedDictionaryChanged', () => this._setupSpellchecker());

        if (this.get('blog.isResetRequested')) {
            this.set('blog.isResetRequested', false);
        }
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
            return Ember.run(() => this.set('isInstanceLoaded', true));
        }

        Ember.run.later(() => this.set('isInstanceLoaded', true), 1500);

    },

    /**
     * A crude attempt at trying things again.
     */
    reload() {
        this.set('isInstanceLoaded', false);
        this.set('isAttemptedSignin', false);
        this.didRender();

        Ember.run.later(() => this.signin());
    },

    /**
     * Programmatically attempt to login
     */
    signin($webview = this._getWebView()) {
        let username = this.get('blog.identification');
        let password = this.get('blog').getPassword();

        // If we can't find username or password, bail out and let the
        // user deal with whatever happened
        //
        // TODO: Ask the user for credentials and add them back to the OS
        // keystore
        if (!username || !password || !$webview) {
            return this.show();
        }

        let commands = [
            `$('input[name="identification"]').val('${username}');`,
            `$('input[name="identification"]').change();`,
            `$('input[name="password"]').val('${password}');`,
            `$('input[name="password"]').change();`,
            `$('button.login').click();`
        ];

        // Execute the commands. Once done, the load handler will
        // be called again, and the instance set to loaded.
        $webview.executeJavaScript(commands.join(''));
        this.set('isAttemptedSignin', true);
    },

    /**
     * Injects CSS files into the webview, one for each OS
     *
     * CSS files can be found in /public/assets/inject/css/*
     */
    _insertCss($webview = this._getWebView()) {
        if ($webview) {
            // Inject a CSS file for the specific platform (OS X; Windows)
            injectCss($webview, process.platform);
            // Inject a CSS file for all platforms (all.css)
            injectCss($webview, 'all');
        }
    },

    /**
     * The webview started loading, meaning that it moved on from being a simple
     * HTMLElement to bloom into a beautiful webview (with all the methods we need)
     */
    _handleStartLoading() {
        let $webview = this._getWebView();

        this._insertCss();
        this._updateName();
        this._setupSpellchecker($webview);
        this._setupWindowFocusListeners($webview);
    },

    /**
     * Handle's the 'did-finish-load' event on the webview hosting the Ghost blog
     */
    _handleLoaded() {
        let $webview = this._getWebView();
        let title = '';

        try {
            title = $webview.getTitle();
        } catch (e) {
            console.warn('Error while trying to to get web view title:', e);
        }

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
        let $webview = this._getWebView();
        let path = requireNode('path');
        let errorPage = path.join(__dirname, '..', 'main', 'load-error', 'error.html');
        let validatedURL = e.originalEvent.validatedURL || '';

        // Don't try this at home
        if (validatedURL.includes('file://')) {
            return;
        }

        if (ENV.environment === 'test') {
            errorPage = path.join(process.cwd(), 'main', 'load-error', 'error.html');
        }

        if ($webview) {
            $webview.loadURL(`file://${errorPage}?error=${errorDescription}`);
            this.show();
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
     * @param e {Object} - jQuery Event
     */
    _handleConsole(e) {
        if (e && e.originalEvent && e.originalEvent.message.includes('login-error')) {
            /*eslint-disable no-unused-vars*/
            if (this.get('preferences.isNotificationsEnabled')) {
                let errorNotify = new Notification(Phrases.loginFailed);
            }
            /*eslint-enable no-unused-vars*/

            return this.sendAction('showEditBlog', this.get('blog'), Phrases.loginFailed);
        }

        if (e.originalEvent.message.includes('loaded')) {
            this.show();
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
    _setupSpellchecker($webview = this._getWebView()) {
        $webview.send('spellchecker', this.get('preferences.spellcheckLanguage'));
    },

    /**
     * Ensures that Alt-Tab on Ghost Desktop windows doesn't mean that the user
     * looses focus in the Ghost Admin editor
     */
    _setupWindowFocusListeners($webview = this._getWebView()) {
        window.addEventListener('blur', () => $webview.blur());
        window.addEventListener('focus', () => $webview.focus());
    },

    /**
     * Looks for all webviews on the page, returning the first one
     * @returns
     */
    _getWebView() {
        let $webviews = this.$('webview');
        let $webview = ($webviews && $webviews[0]) ? $webviews[0] : undefined;

        if (!$webview) {
            console.log(new Error('Could not find webview containing Ghost blog.'));
        }

        return $webview;
    }
});
