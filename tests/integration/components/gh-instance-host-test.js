import { moduleForComponent, test } from 'ember-qunit';
import { TestBlog } from '../../fixtures/blogs';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

/**
 * Test Preparation
 */

moduleForComponent('gh-instance-host', 'Integration | Component | gh instance host', {
    integration: true
});

/**
 * Tests
 */
test('it renders', function(assert) {
    this.render(hbs`{{gh-instance-host}}`);
    assert.equal(this.$().text().trim(), '');
});

test('it initializes the webview', function(assert) {
    const path = require('path');
    const blog = TestBlog.create({
        id: 1,
        name: 'Testblog (Content)',
        url: `file://${path.join(__dirname, 'tests', 'fixtures', 'static-content', 'content.html')}`,
        isSelected: false,
        identification: "test@user.com",
        iconColor: "#ff0000"
    });

    this.set('isInstanceLoaded', false);
    this.set('fakeBlog', blog);
    this.render(hbs`{{gh-instance-host blog=fakeBlog isInstanceLoaded=isInstanceLoaded}}`);

    const src = self.$('webview').attr('src');
    const containsCorrectLink = src.includes('fixtures/static-content/content.html');
    assert.equal(containsCorrectLink, true);
});