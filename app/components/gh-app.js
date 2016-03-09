import Ember from 'ember';

const {Component} = Ember;

export default Component.extend({
    store: Ember.inject.service(),
    classNames: ['gh-app'],

    didReceiveAttrs() {
        this.setup();
    },

    hasBlogs: Ember.computed('blogs', {
        get() {
            let b = this.get('blogs');
            return (b && b.content && b.content.length && b.content.length > 0);
        }
    }),

    setup() {
        if (this.get('hasBlogs')) {
            this.send('switchToBlog', this.findSelectedBlog() || this.get('blogs.firstObject'));
        } else {
            this.set('isAddBlogVisible', true);
        }
    },

    findSelectedBlog() {
        if (!this.get('hasBlogs')) {
            return null;
        }

        return this.get('blogs').find((blog) => {
            return blog.get('isSelected');
        });
    },

    refreshBlogs() {
        this.get('store').findAll('blog')
            .then((result) => {
                this.set('blogs', result);
                this.setup();
            });
    },

    actions: {
        switchToBlog(blog) {
            let previousBlog = this.get('selectedBlog');

            if (!blog) {
                return;
            }

            if (previousBlog) {
                previousBlog.unselect();
            }

            blog.select();
            this.set('selectedBlog', blog);
            this.set('isAddBlogVisible', false);
        },

        showAddBlog() {
            if (this.get('selectedBlog')) {
                this.get('selectedBlog').unselect();
            }

            this.set('isAddBlogVisible', true);
        },

        blogAdded(blog) {
            this.send('switchToBlog', blog);
        },

        blogRemoved() {
            this.refreshBlogs();
        }
    }
});
