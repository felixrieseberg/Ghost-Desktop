import Ember from 'ember';
import setWindowTitle from '../utils/set-window-title';
import setDockMenu from '../utils/set-dock-menu';

const {Component} = Ember;

export default Component.extend({
    store: Ember.inject.service(),
    classNames: ['gh-app'],

    didReceiveAttrs() {
        this.setup();
    },

    /**
     * Boolean value that returns true if there are any blogs
     */
    hasBlogs: Ember.computed('blogs', function () {
        let b = this.get('blogs');
        return (b && b.content && b.content.length && b.content.length > 0);
    }),

    /**
     * Setup method, determining which blog to display.
     */
    setup() {
        if (this.get('hasBlogs')) {
            this.send('switchToBlog', this.findSelectedBlog() || this.get('blogs.firstObject'));
            this.createDockMenu();
        } else {
            this.set('isEditBlogVisible', true);
        }
    },

    /**
     * Gets the current blogs and creates the dock menu
     */
    createDockMenu() {
        let blogs = this.get('blogs');
        let menu = [];

        blogs.forEach((blog) => {
            menu.push({
                name: blog.get('name'),
                callback: () => this.send('switchToBlog', blog)
            });
        });

        if (process.platform === 'darwin') {
            setDockMenu(menu);
        }
    },

    /**
     * Finds the first blog marked as "selected"
     *
     * @returns {Object} blog
     */
    findSelectedBlog() {
        if (!this.get('hasBlogs')) {
            return null;
        }

        return this.get('blogs').find((blog) => {
            return blog.get('isSelected');
        });
    },

    /**
     * Reloads the blogs from the local databse
     */
    refreshBlogs() {
        this.get('store').findAll('blog')
            .then((result) => {
                this.set('blogs', result);
                this.setup();
            });
    },

    /**
     * Sets the visibility of the preferences ui, the edit blog ui,
     * and the blogs.
     *
     * @param {Object}   [options={}] - Options object
     * @param {boolean}  [options.showBlog=true] - "Edit Blog" UI
     * @param {boolean}  [options.showPreferences=false] - "Preferences" UI
     * @param {DS.Model} [options.blog] - Blog to display
     */
    setScreenVisibility({showAddBlog = true, showPreferences = false, blog = null}) {
        let selectedBlog = this.get('selectedBlog');

        if ((!blog && selectedBlog) || (selectedBlog && blog && selectedBlog !== blog)) {
            selectedBlog.unselect();
        }

        if (blog) {
            blog.select();
            setWindowTitle(blog.get('name'));
            this.set('selectedBlog', blog);
        }

        this.setProperties({
            isPreferencesVisible: showPreferences,
            isEditBlogVisible: showAddBlog
        });
    },

    /**
     * Displays the "add blog" UI
     */
    showEditBlogUI() {
        this.setScreenVisibility({
            showAddBlog: true,
            showPreferences: false
        });
    },

    /**
     * Displays the "preferences" UI
     */
    showPreferencesUI() {
        this.setScreenVisibility({
            showAddBlog: false,
            showPreferences: true
        });
    },

    actions: {
        /**
         * Switches to a given blog
         *
         * @param {Object} blog - Blog to switch to
         */
        switchToBlog(blog) {
            if (blog) {
                this.setScreenVisibility({
                    showAddBlog: false,
                    showPreferences: false,
                    blog
                });
            }
        },

        /**
         * Clears the "blogToEdit" property, turning the
         * edit blog UI into an "add blog" UI
         */
        showAddBlog() {
            this.set('blogToEdit', undefined);
            this.showEditBlogUI();
        },

        /**
         * Sets the blogToEdit property to a given blog
         *
         * @param blog - Blog to edit
         */
        showEditBlog(blog) {
            this.set('blogToEdit', blog);
            this.showEditBlogUI();
        },

        /**
         * Shows the preferences
         */
        showPreferences() {
            this.showPreferencesUI();
        },

        /**
         * Handles an added blog
         *
         * @param {Object} blog - Added blog
         */
        blogAdded(blog) {
            this.send('switchToBlog', blog);
        },

        /**
         * Handles the removal of a blog
         */
        blogRemoved() {
            this.refreshBlogs();
        }
    }
});
