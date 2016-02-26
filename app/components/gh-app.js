import Ember from 'ember';

const {Component} = Ember;

export default Component.extend({
    classNames: ['gh-app'],

    didReceiveAttrs() {
        if (this.get('blogs') && !this.get('selectedBlog')) {
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
        }
    }
});
