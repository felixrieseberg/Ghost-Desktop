import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { blogs } from '../../fixtures/blogs';

/**
 * Test Preparation
 */

moduleForComponent('gh-app', 'Integration | Component | gh app', {
    integration: true
});

/**
 * Tests
 */

test('displays the "add new blog" UI if no blog is added', function(assert) {
    this.render(hbs`{{gh-app}}`);

    const text = this.$().text().trim();
    const containsText = text.includes('Before we get started, please tell us where to find your blog');
    assert.ok(containsText);
});

test('renders all existing blogs in a webview', function (assert) {
    this.set('_blogs', blogs);
    this.render(hbs`{{gh-app blogs=_blogs}}`);

    const webviews = this.$('webview');
    assert.equal(webviews.length, blogs.length);
});

test('displays the first blog if it has blogs (none selected)', function(assert) {
    let qasync = assert.async();
    let blogContent = blogs;
    blogContent.content = blogs;
    blogContent.firstObject = blogs[0];
    blogContent.find = blogs.find;

    Ember.run(() => {
        this.set('_blogs', blogContent);
        this.render(hbs`{{gh-app blogs=_blogs}}`);

        const instanceHost = this.$('.instance-host')[0];
        assert.ok(this.$(instanceHost).hasClass('selected'));
        qasync();
    });
});

test('displays the selected blog if it has blogs (one selected)', function(assert) {
    blogs[1].select();
    let blogContent = blogs;
    blogContent.content = blogs;
    blogContent.firstObject = blogs[0];
    blogContent.find = blogs.find;

    this.set('_blogs', blogContent);
    this.render(hbs`{{gh-app blogs=_blogs}}`);

    const instanceHost = this.$('.instance-host')[1];
    assert.ok(this.$(instanceHost).hasClass('selected'));

    blogs[1].unselect();
});
