import Ember from 'ember';
import ENV from 'ghost-desktop/config/environment';
import phrases from '../utils/phrases';

export default Ember.Service.extend(Ember.Evented, {
    autoUpdater: null,
    isCheckingForUpdate: null,
    isUpdateAvailable: null,
    isUpdateDownloaded: null,
    isLatestVersion: null,

    /**
     * Returns the current environment (testing, development, production)
     */
    environment: Ember.computed({
        get() {
            return ENV.environment;
        }
    }),

    /**
     * Returns the current Ghost Desktop version, by querying the version
     * defined in package.json. If that fails, it'll check the version of
     * the current executable.
     */
    appVersion: Ember.computed({
        get() {
            let {remote} = requireNode('electron');
            let appVersion = remote.require('app').getVersion();

            return appVersion;
        }
    }),

    /**
     * Checks Ghost Desktop's update server for updates.
     */
    checkForUpdates() {
        if (this.get('environment') !== 'production' || this.get('isCheckingForUpdate')) {
            return;
        }

        if (!this.get('autoUpdater')) {
            this._setup();
        }

        if (this.get('autoUpdater')) {
            this.get('autoUpdater').checkForUpdates();
        }
    },

    /**
     * Updates the app, if an update is available
     */
    update() {
        let autoUpdater = this.get('autoUpdater');

        if (autoUpdater && this.get('isUpdateDownloaded')) {
            this.set('doNotAskForUpdate', true);
            autoUpdater.quitAndInstall();
        }
    },

    /**
     * On Windows, we need to ensure that we capture the "before-quit" event.
     */
    _captureBeforeQuit() {
        let {remote} = requireNode('electron');
        let app = remote.require('app');

        // Ensure we do this only once
        if (!this.get('isBeforeQuitHandled')) {
            app.on('before-quit', this._handleQuit);
            this.set('isBeforeQuitHandled', true);
        }
    },

    /**
     * Handles the app's "before-quit" event
     *
     * @param e {Object} - Event
     */
    _handleQuit(e) {
        let {remote} = requireNode('electron');
        let app = remote.require('app');
        let dialog = remote.require('dialog');
        let autoUpdater = this.get('autoUpdater');

        // Only move forward if we have an update - and if we didn't ask before.
        if (autoUpdater && this.get('isUpdateDownloaded') && !this.get('doNotAskForUpdate')) {
            e.preventDefault();
            this.set('doNotAskForUpdate', true);

            dialog.showMessageBox({
                type: 'question',
                buttons: ['Cancel', 'Update'],
                defaultId: 1,
                title: 'Update Ghost?',
                message: phrases.updateNow
            }, (response) => {
                if (response === 1) {
                    autoUpdater.quitAndInstall();
                } else {
                    app.quit();
                }
            });
        }
    },

    /**
     * Creates the autoUpdater, using Electorn's built-in auto-update module.
     */
    _setup() {
        let {remote} = requireNode('electron');
        let os = requireNode('os').platform();
        let autoUpdater = remote.require('auto-updater');

        // If we're not running signed code, requiring auto updater will fail
        if (this.get('environment') !== 'production') {
            return;
        }

        // Todo: Handle Linux
        let updateFeed = (os === 'darwin') ?
            `http://desktop-updates.ghost.org/update/osx/${this.get('appVersion')}` :
            `http://desktop-updates.ghost.org/update/win32/${this.get('appVersion')}`;

        autoUpdater.setFeedURL(updateFeed);

        autoUpdater.on('checking-for-update', () => {
            this.set('isCheckingForUpdate', true);
            this.trigger('checking-for-update');
        });

        autoUpdater.on('update-available', () => {
            this.set('isCheckingForUpdate', false);
            this.set('isUpdateAvailable', true);
            this.trigger('update-available');
        });

        autoUpdater.on('update-downloaded', () => {
            this.set('isCheckingForUpdate', false);
            this.set('isUpdateAvailable', true);
            this.set('isUpdateDownloaded', true);
            this.trigger('update-downloaded');
        });

        autoUpdater.on('update-not-available', () => {
            this.set('isCheckingForUpdate', false);
            this.set('isUpdateAvailable', false);
            this.set('isLatestVersion', true);
            this.trigger('update-not-available');
        });

        this._captureBeforeQuit();
        this.set('autoUpdater', autoUpdater);
    }
});
