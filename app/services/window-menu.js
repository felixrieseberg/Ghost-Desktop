import Ember from 'ember';
import {setup as getMenuTemplate} from '../utils/window-menu';

export default Ember.Service.extend({
    preferencesCallback: undefined,
    blogs: [],

    /**
     * Setups the window menu for the application
     */
    setup() {
        let {remote} = requireNode('electron');
        let {Menu} = remote;
        let template = getMenuTemplate();
        let withBlogs = this._injectBlogs(template);
        let withBlogsAndPrefsCallback = this._injectPreferencesCallback(withBlogs);
        let builtMenu = Menu.buildFromTemplate(withBlogsAndPrefsCallback);

        Menu.setApplicationMenu(builtMenu);
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
     * If blogs are present, they are injected into the menu.
     *
     * @param template - Electron menu template
     * @returns template - Electron menu template
     */
    _injectBlogs(template) {
        let blogs = this.get('blogs');

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
    }
});
