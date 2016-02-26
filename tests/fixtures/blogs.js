import Ember from 'ember';

const path = requireNode('path');

export const TestBlog = Ember.Object.extend({
    select: function () {
        Ember.run(() => this.set('isSelected', true));
    },
    unselect: function () {
        Ember.run(() => this.set('isSelected', false));
    }
});

export const blogs = Ember.A([
    TestBlog.create({
        name: 'Testblog (Signin)',
        url: path.join(__dirname, 'tests', 'fixtures', 'static-signin', 'signin.html'),
        isSelected: false
    }),
    TestBlog.create({
        name: 'Testblog (Content)',
        url: path.join(__dirname, 'tests', 'fixtures', 'static-content', 'content.html'),
        isSelected: false
    }),
    TestBlog.create({
        name: 'Testblog (New Post)',
        url: path.join(__dirname, 'tests', 'fixtures', 'static-newpost', 'newpost.html'),
        isSelected: false
    })
]);
