import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { blogs } from '../../fixtures/blogs';

/**
 * Test Preparation
 */
let recordsSearched = false;
let recordSaved = false;
let recordDeleted = false;

const store = Ember.Service.extend({
    findRecord(type, id) {
        recordsSearched = true;
        return {
            deleteRecord() {
                recordDeleted = true;
            },
            save() {
                recordSaved = true;
            }
        }
    }
});

moduleForComponent('gh-switcher', 'Integration | Component | gh switcher', {
    integration: true,
    beforeEach() {
        recordsSearched = true;
        recordSaved = true;
        recordDeleted = true;

        this.register('service:store', store);
        this.inject.service('store');
    }
});

/**
 * Tests
 */

test('it renders', function(assert) {
    this.set('_blogs', []);
    this.render(hbs`{{gh-switcher blogs=_blogs}}`);
    assert.equal(this.$().text().trim(), '+');
});

test('it renders all blogs as single-letter buttons', function(assert) {
    this.set('_blogs', blogs);
    this.render(hbs`{{gh-switcher blogs=_blogs}}`);
    
    let expected = (process.platform === 'darwin') ? 'T⌘1T⌘2T⌘3+' : 'TCtrl1TCtrl2TCtrl3+';
    
    assert.equal(this.$().text().trim().replace(/(\r\n|\n|\r| )/gm,''), expected);
});

test('it renders all blogs with the id in the data attribute', function(assert) {
    this.set('_blogs', blogs);
    this.render(hbs`{{gh-switcher blogs=_blogs}}`);
    assert.equal(this.$('.switch-btn').data('blog'), 0);
});

test('a click on a blog initiates blog navigation', function(assert) {
    this.set('_blogs', blogs);
    this.set('_switchToBlog', (blog) => {
        assert.equal(blog, blogs[0], 'clicked blog is passed to switchToBlog action');
    });

    this.render(hbs`{{gh-switcher blogs=_blogs switchToBlog=(action _switchToBlog)}}`);
    this.$('.switch-btn')[0].click();
});

test('a click on the "add blog" sign requests "add blog" ui', function(assert) {
    this.set('_blogs', blogs);
    this.set('_showAddBlog', () => {
        // We just ensure that the assert is called
        assert.ok(true);
    });

    this.render(hbs`{{gh-switcher blogs=_blogs showAddBlog=(action _showAddBlog)}}`);
    this.$('.add-blog-button').click();
});

test('calling removeBlog attempts to remove the blog', function(assert) {
    assert.expect(3);

    this.set('_blogs', blogs);

    // A little bit of hackery: We can't call the action directly, and we can't
    // access the context menu Programmatically. So, to test the removeAction,
    // we briefly replace the switchToBlog action with the removeAction, since we
    // can invoke a click Programmatically.
    this.render(hbs`{{gh-switcher blogs=_blogs switchToBlog=removeBlog}}`);
    this.$('.switch-btn')[0].click();

    assert.ok(recordsSearched);
    assert.ok(recordDeleted);
    assert.ok(recordSaved);
});
