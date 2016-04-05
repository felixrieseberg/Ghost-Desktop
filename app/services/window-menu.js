import Ember from 'ember';
import {setup as getMenuTemplate} from '../utils/window-menu';

export default Ember.Service.extend({
    autoUpdate: Ember.inject.service(),
    blogs: [],

    /**
     * Setups the window menu for the application
     */
    setup() {
        let {remote} = requireNode('electron');
        let {Menu} = remote;
        let template = getMenuTemplate();
        let withBlogs = this._injectBlogs(template);
        let withQuitHandler = this._injectQuitHandler(withBlogs);
        let builtMenu = Menu.buildFromTemplate(withQuitHandler);

        Menu.setApplicationMenu(builtMenu);
    },

    /**
     * Adds blogs to the app's window menu
     *
     * @param blogs - An array of blogs to add to the menu.
     */
    addBlogsToMenu(blogs) {
        if (blogs) {
            this.set('blogs', blogs);
            Ember.run.later(this, 'setup');
        }
    },

    /**
     * If blogs are present, they are injected into the menu
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
     * If a quit handler is present, it is injected into the menu
     *
     * @param template - Electron menu template
     * @returns template - Electron menu template
     */
    _injectQuitHandler(template) {
        let self = this;

        if (template && template.forEach) {
            template.forEach((item) => {
                if (item && item.label && item.label === 'Ghost') {
                    item.submenu.forEach((subitem) => {
                        if (subitem && subitem.label && subitem.label === 'Quit') {
                            subitem.click = function click() {
                                self.get('autoUpdate').updateAndShutdown();
                            };
                        }
                    })
                }
            });
        }

        return template;
    },

});
