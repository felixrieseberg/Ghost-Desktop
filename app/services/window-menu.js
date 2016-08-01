import Ember from 'ember';
import {setup as getMenuTemplate} from '../utils/window-menu';

export default Ember.Service.extend({
    preferencesCallback: undefined,
    blogs: [],

    /**
     * The menu can be easily extended by adding an injection to the
     * service's injections property:
     *
     * {
     *   name: {string}
     *   injection: function (template) { return template }
     * }
     */
    injections: [],

    /**
     * Schedules (debounced) the setup of the application menu
     */
    setup() {
        Ember.run.debounce(this, this._prepareMenu, 150);
    },

    /**
     * Adds blogs to the app's window menu
     *
     * @param preferencesCallback - The preferences callback
     * @param blogs - An array of blogs to add to the menu.
     */
    addQuickSwitchItemsToMenu(preferencesCallback, blogs) {
        if (blogs && preferencesCallback) {
            this.set('preferencesCallback', preferencesCallback);
            this.set('blogs', blogs);
            Ember.run.later(this, 'setup');
        }
    },

    /**
     * Setups the window menu for the application
     */
    _prepareMenu() {
        const {remote} = requireNode('electron');
        const {Menu} = remote;
        const template = getMenuTemplate();
        const withBlogs = this._injectBlogs(template);
        const withPrefs = this._injectPreferencesCallback(withBlogs);
        const withInjections = this._processInjections(withPrefs);
        const builtMenu = Menu.buildFromTemplate(withInjections);

        Menu.setApplicationMenu(builtMenu);
    },

    /**
     * If blogs are present, they are injected into the menu.
     *
     * @param template - Electron menu template
     * @returns template - Electron menu template
     */
    _injectBlogs(template) {
        const blogs = this.get('blogs');

        if (template && template.forEach && blogs) {
            template.forEach((item) => {
                if (item && item.label && item.label === 'View') {
                    item.submenu = item.submenu.concat(blogs);
                }
            });
        }

        return template;
    },

    /**
     * The electron app context doesn't have access to the running ghost app,
     * so application-specific shortcuts must be injected.
     *
     * Here, we add a click handler to open the preferences pane within the app.
     *
     * @param template - Electron menu template
     * @returns template - Electron menu template.
     */
    _injectPreferencesCallback(template) {
        let preferencesCallback = this.get('preferencesCallback');

        if (template && template.forEach && preferencesCallback) {
            template.forEach((menuItem) => {
                if (
                    menuItem &&
                    menuItem.label &&
                    menuItem.label === 'Ghost' ||
                    menuItem.label === 'Electron' ||
                    menuItem.label === 'File'
                ) {
                    menuItem.submenu.forEach((subMenuItem) => {
                        if (
                            subMenuItem &&
                            subMenuItem.label &&
                            subMenuItem.label === 'Preferences'
                        ) {
                            subMenuItem.click = preferencesCallback;
                        }
                    });
                }
            });
        }

        return template;
    },

    /**
     * The menu can be easily extended by adding an injection to the
     * service's injections property:
     *
     * {
     *   name: {string}
     *   injection: function (template) { return template }
     * }
     *
     * @param {Object} template - Electron Menu template
     * @returns {Object} template - Electron Menu template
     */
    _processInjections(template) {
        const injections = this.get('injections');
        let processedTemplate = template;

        if (injections && injections.length > 0) {
            injections.forEach((item) => {
                if (item.injection && typeof item.injection === 'function') {
                    processedTemplate = item.injection(processedTemplate);
                }
            });
        }

        return processedTemplate;
    }
});
