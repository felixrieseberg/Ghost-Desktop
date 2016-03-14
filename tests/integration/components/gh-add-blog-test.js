import { moduleForComponent } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import test from 'ghost-desktop/tests/ember-sinon-qunit/test';
import { blogs } from '../../fixtures/blogs';

/**
 * Test Preparation
 */

let recordCreated = false;
let recordSaved = false;

const store = Ember.Service.extend({
    createRecord() {
        recordCreated = true;
        return {
            setPassword() {},
            save() {
                recordSaved = true;
                return new Promise((resolve, reject) => resolve());
            }
        }
    },

    findAll() {
        return new Promise((resolve, reject) => {
            let blogContent = blogs;
            blogContent.content = blogs;
            blogContent.find = blogs.find;

            resolve(blogContent);
        });
    }
});

moduleForComponent('gh-add-blog', 'Integration | Component | gh add blog', {
    integration: true,
    beforeEach() {
        recordCreated = false;
        recordSaved = false;

        this.register('service:store', store);
        this.inject.service('store');
    }
});

function checkForRecord(assert, qAsync, i = 0) {
    setTimeout(() => {
        if (recordCreated || i > 50) {
            assert.ok(recordCreated);
            qAsync();
        } else {
            checkForRecord(assert, qAsync, i + 1);
        }
    }, 200);
}

/**
 * Tests
 */

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });"

    this.render(hbs`{{gh-add-blog}}`);

    const text = this.$().text().trim();
    const containsText = text.includes('Before we get started, please tell us where to find your blog');
    assert.ok(containsText);
});

test('marks an incorrect url as invalid', function(assert) {
    this.render(hbs`{{gh-add-blog}}`);

    this.$('input[name="url"]').focus();
    this.$('input[name="url"]').val('https://not-a-url');
    this.$('input[name="url"]').change();
    this.$('input[name="identification"]').focus();

    let errorDivs = this.$('div.error');
    assert.equal(errorDivs.length, 1);
});

test('does not mark a correct url as invalid', function(assert) {
    this.render(hbs`{{gh-add-blog}}`);

    this.$('input[name="url"]').focus();
    this.$('input[name="url"]').val('https://www.a-url.com/ghost');
    this.$('input[name="url"]').change();
    this.$('input[name="identification"]').focus();

    let errorDivs = this.$('div.error');
    assert.equal(errorDivs.length, 0);
});

test('marks an incorrect identification as invalid', function(assert) {
    this.render(hbs`{{gh-add-blog}}`);

    this.$('input[name="identification"]').focus();
    this.$('input[name="identification"]').val('not-a-identification');
    this.$('input[name="identification"]').change();
    this.$('input[name="url"]').focus();

    let errorDivs = this.$('div.error');
    assert.equal(errorDivs.length, 1);
});

test('does not mark a correct identification as invalid', function(assert) {
    this.render(hbs`{{gh-add-blog}}`);

    this.$('input[name="identification"]').focus();
    this.$('input[name="identification"]').val('ident@ident.com');
    this.$('input[name="identification"]').change();
    this.$('input[name="url"]').focus();

    let errorDivs = this.$('div.error');
    assert.equal(errorDivs.length, 0);
});

test('marks an incorrect password as invalid', function(assert) {
    this.render(hbs`{{gh-add-blog}}`);

    this.$('input[name="password"]').focus();
    this.$('input[name="password"]').change();
    this.$('input[name="url"]').focus();

    let errorDivs = this.$('div.error');
    assert.equal(errorDivs.length, 1);
});

test('does not mark a correct password as invalid', function(assert) {
    this.render(hbs`{{gh-add-blog}}`);

    this.$('input[name="password"]').focus();
    this.$('input[name="password"]').val('p@ssw0rd');
    this.$('input[name="password"]').change();
    this.$('input[name="url"]').focus();

    let errorDivs = this.$('div.error');
    assert.equal(errorDivs.length, 0);
});

test('does not create a record for an unreachable url', function(assert) {
    const qAsync = assert.async();
    this.render(hbs`{{gh-add-blog}}`);

    this.$('input[name="url"]').val('https://0.0.0.0:1111/');
    this.$('input[name="url"]').change();
    this.$('input[name="identification"]').val('test@user.com');
    this.$('input[name="identification"]').change();
    this.$('input[name="password"]').val('testp@ss');
    this.$('input[name="password"]').change();

    Ember.run(() => this.$('button:submit').click());
    setTimeout(() => {
        let errorDivs = this.$('div.error');
        assert.equal(errorDivs.length, 1);
        qAsync();
    }, 500);
});

test('does not create a record for a non-ghost url', function(assert) {
    const qAsync = assert.async();
    this.render(hbs`{{gh-add-blog}}`);

    this.$('input[name="url"]').val('https://bing.com');
    this.$('input[name="url"]').change();
    this.$('input[name="identification"]').val('test@user.com');
    this.$('input[name="identification"]').change();
    this.$('input[name="password"]').val('testp@ss');
    this.$('input[name="password"]').change();

    Ember.run(() => this.$('button:submit').click());
    setTimeout(() => {
        let errorDivs = this.$('div.error');
        assert.equal(errorDivs.length, 1);
        qAsync();
    }, 500);
});

test('adding a blog creates a blog record', function(assert) {
    const qAsync = assert.async();

    this.render(hbs`{{gh-add-blog}}`);

    this.$('input[name="url"]').val('https://dev.ghost.org/ghost');
    this.$('input[name="url"]').change();
    this.$('input[name="identification"]').val('test@user.com');
    this.$('input[name="identification"]').change();
    this.$('input[name="password"]').val('testp@ss');
    this.$('input[name="password"]').change();

    Ember.run(() => this.$('button:submit').click());

    checkForRecord(assert, qAsync);
});

test('adding a blog saves a blog record', function(assert) {
    const qAsync = assert.async();

    this.render(hbs`{{gh-add-blog}}`);

    this.$('input[name="url"]').val('https://dev.ghost.org/ghost');
    this.$('input[name="url"]').change();
    this.$('input[name="identification"]').val('test@user.com');
    this.$('input[name="identification"]').change();
    this.$('input[name="password"]').val('testp@ss');
    this.$('input[name="password"]').change();

    Ember.run(() => this.$('button:submit').click());

    checkForRecord(assert, qAsync);
});
