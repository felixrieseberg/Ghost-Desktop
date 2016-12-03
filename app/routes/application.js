import Ember from 'ember';
import { setup as setupContextMenu } from '../utils/context-menu';

const {Route} = Ember;

export default Route.extend({
    windowMenu: Ember.inject.service(),
    preferences: Ember.inject.service(),

    beforeModel() {
        this.get('preferences').setupZoom();
        this.get('windowMenu').setup();
        this.setupTeardown();
        setupContextMenu();
    },

    setupTeardown() {
        const browserWindow = require('electron').remote.getCurrentWindow();

        window.onbeforeunload = function () {
            browserWindow.removeAllListeners();
        }
    },

    model() {
        return this.store.findAll('blog');
    },

    /**
     * Whenever we load all blogs, we also inform the main thread about the
     * blogs we're dealing with.
     *
     * @param {any} blogs
     */
    afterModel(blogs) {
        if (blogs) {
            const {ipcRenderer} = require('electron');

            blogs.forEach((blog) => {
                const serializedData = blog.toJSON({includeId: true});
                ipcRenderer.send('blog-data', serializedData);
            });
        }
    }
});
