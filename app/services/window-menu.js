import Ember from 'ember';
import {setup as getMenuTemplate} from '../utils/window-menu';

export default Ember.Service.extend({
    blogs: [],

    /**
     * Setups the window menu for the application
     */
    setup() {
        let {remote} = requireNode('electron');
        let {Menu} = remote;
        let template = getMenuTemplate();
        let withBlogs = this._injectBlogs(template);
        let builtMenu = Menu.buildFromTemplate(withBlogs);

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
    }
});
