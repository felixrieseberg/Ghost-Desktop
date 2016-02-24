import Ember from 'ember';

const {Component} = Ember;

export default Component.extend({
    classNames: ['switcher'],

    actions: {
        switchToBlog(blog) {
            this.sendAction('switchToBlog', blog);
        },

        showAddBlog() {
            this.sendAction('showAddBlog');
        }
    }
});
