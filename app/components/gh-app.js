import Ember from 'ember';

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
    hasBlogs: Ember.computed('blogs', {
        get() {
            let b = this.get('blogs');
            return (b && b.content && b.content.length && b.content.length > 0);
        }
    }),

    /**
     * Setup method, determining which blog to display.
     */
    setup() {
        if (this.get('hasBlogs')) {
            this.send('switchToBlog', this.findSelectedBlog() || this.get('blogs.firstObject'));
        } else {
            this.set('isAddBlogVisible', true);
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

    actions: {
        /**
         * Switches to a given blog
         *
         * @param {Object} blog - Blog to switch to
         */
        switchToBlog(blog) {
            if (!blog) {
                return;
            }

            if (this.get('previousBlog')) {
                this.get('previousBlog').unselect();
            }

            blog.select();
            this.set('selectedBlog', blog);
            this.set('isAddBlogVisible', false);
        },

        /**
         * Displays the "add blog" UI
         */
        showAddBlog() {
            if (this.get('selectedBlog')) {
                this.get('selectedBlog').unselect();
            }

            this.set('isAddBlogVisible', true);
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
