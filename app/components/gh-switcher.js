import Ember from 'ember';

const {Component} = Ember;

/**
 * The switcher component is a Slack-like quick switcher on the left side of
 * the app, allowing users to quickly switch between blogs.
 */
export default Component.extend({
    store: Ember.inject.service(),
    classNames: ['switcher'],

    didRender() {
        this._super(...arguments);
        this._setupContextMenu();
        this._setupQuickSwitch();
    },

    /**
     * Setups the shortcut handling
     */
    _setupQuickSwitch() {
        let {remote} = requireNode('electron');
        let {globalShortcut} = remote;

        // Cleanup leftover shortcuts - required for reloads and the such
        globalShortcut.unregisterAll();

        // Register shortcuts for each blog
        this.get('blogs')
            .slice(0, 8)
            .map((blog, i) => {
                let sc = `CmdOrCtrl+${i + 1}`;

                globalShortcut.unregister(sc);
                globalShortcut.register(sc, () => this.send('switchToBlog', blog));
            });
    },

    /**
     * In addition to the app-wide context menu, a context menu allowing
     * interaction with the blog below is setup.
     */
    _setupContextMenu() {
        let {remote} = requireNode('electron');
        let {Menu} = remote;
        let self = this;
        let selectedBlog = null;

        let editMenu = Menu.buildFromTemplate([
            {
                label: 'Edit Blog',
                click() {
                    if (selectedBlog) {
                        self.editBlog(selectedBlog);
                    }
                }
            },
            {
                label: 'Remove Blog',
                click() {
                    if (selectedBlog) {
                        self.removeBlog(selectedBlog);
                    }
                }
            }
        ]);

        this.$()
            .off('contextmenu')
            .on('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();

                let node = e.target;

                while (node) {
                    if (node.classList && node.classList.contains('switch-btn')
                        && node.dataset && node.dataset.blog) {
                        selectedBlog = node.dataset.blog;
                        editMenu.popup(remote.getCurrentWindow());
                        break;
                    }

                    node = node.parentNode;
                }
            });
    },

    /**
     * Remove a blog
     *
     * @param id - Ember Data id of the blog to remove
     */
    removeBlog(id) {
        if (id) {
            this.get('store').findRecord('blog', id)
                .then((result) => {
                    if (result) {
                        result.deleteRecord();
                        result.save().then(() => this.sendAction('blogRemoved'));
                    }
                });
        }
    },

    /**
     * Show the "edit blog" UI, passing along the blog object for a given id
     *
     * @param id - Ember Data id of the blog to edit
     */
    editBlog(id) {
        if (id) {
            this.get('store').findRecord('blog', id)
                .then((result) => {
                    if (result) {
                        this.sendAction('showEditBlog', result);
                    }
                });
        }
    },

    actions: {
        /**
         * Switch to a blog
         *
         * @param blog - Blog to switch to
         */
        switchToBlog(blog) {
            this.sendAction('switchToBlog', blog);
        },

        /**
         * Switch to the "add blog" UI
         */
        showAddBlog() {
            this.sendAction('showAddBlog');
        }
    }
});
