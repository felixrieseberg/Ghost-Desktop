import Ember from 'ember';

const {Component} = Ember;

export default Component.extend({
    classNames: ['gh-app'],

    hasBlogs: Ember.computed('model', {
        get() {
            let blogs = this.get('blogs');
            return (blogs && blogs.content && blogs.content.length && blogs.content.length > 0);
        }
    }).readOnly(),

    didReceiveAttrs() {
        if (this.get('hasBlogs') && !this.get('selectedBlog')) {
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

    actions: {
        switchToBlog(blog) {
            let previousBlog = this.get('selectedBlog');

            if (previousBlog) {
                previousBlog.set('isSelected', false);
                previousBlog.save();
            }

            blog.set('isSelected', true);
            blog.save();
            this.set('selectedBlog', blog);

            this.set('isAddBlogVisible', false);
        },

        showAddBlog() {
            this.set('isAddBlogVisible', true);
        }
    }
});
