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

moduleForComponent('gh-edit-blog', 'Integration | Component | gh edit blog', {
    integration: true,
    beforeEach() {
        recordCreated = false;
        recordSaved = false;

        this.register('service:store', store);
        this.inject.service('store');
    }
});

/**
 * Local Helpers
 */
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

function checkForSave(assert, qAsync, i = 0) {
    setTimeout(() => {
        if (recordSaved || i > 50) {
            assert.ok(recordSaved);
            qAsync();
        } else {
            checkForSave(assert, qAsync, i + 1);
        }
    }, 200);
}

/**
 * Tests
 */

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });"

    this.render(hbs`{{gh-edit-blog}}`);

    const text = this.$().text().trim();
    const containsText = text.includes('Before we get started, please tell us where to find your blog');
    assert.ok(containsText);
});

test('marks an incorrect url as invalid', function(assert) {
    this.render(hbs`{{gh-edit-blog}}`);

    this.$('input[name="url"]').focus();
    this.$('input[name="url"]').val('https://not-a-url');
    this.$('input[name="url"]').change();
    this.$('input[name="identification"]').focus();

    let errorDivs = this.$('div.error');
    assert.equal(errorDivs.length, 1);
});

test('does not mark a correct url as invalid', function(assert) {
    this.render(hbs`{{gh-edit-blog}}`);

    this.$('input[name="url"]').focus();
    this.$('input[name="url"]').val('https://www.a-url.com/ghost');
    this.$('input[name="url"]').change();
    this.$('input[name="identification"]').focus();

    let errorDivs = this.$('div.error');
    assert.equal(errorDivs.length, 0);
});

test('marks an incorrect identification as invalid', function(assert) {
    this.render(hbs`{{gh-edit-blog}}`);

    this.$('input[name="identification"]').focus();
    this.$('input[name="identification"]').val('not-a-identification');
    this.$('input[name="identification"]').change();
    this.$('input[name="url"]').focus();

    let errorDivs = this.$('div.error');
    assert.equal(errorDivs.length, 1);
});

test('does not mark a correct identification as invalid', function(assert) {
    this.render(hbs`{{gh-edit-blog}}`);

    this.$('input[name="identification"]').focus();
    this.$('input[name="identification"]').val('ident@ident.com');
    this.$('input[name="identification"]').change();
    this.$('input[name="url"]').focus();

    let errorDivs = this.$('div.error');
    assert.equal(errorDivs.length, 0);
});

test('marks an incorrect password as invalid', function(assert) {
    this.render(hbs`{{gh-edit-blog}}`);

    this.$('input[name="password"]').focus();
    this.$('input[name="password"]').change();
    this.$('input[name="url"]').focus();

    let errorDivs = this.$('div.error');
    assert.equal(errorDivs.length, 1);
});

test('does not mark a correct password as invalid', function(assert) {
    this.render(hbs`{{gh-edit-blog}}`);

    this.$('input[name="password"]').focus();
    this.$('input[name="password"]').val('p@ssw0rd');
    this.$('input[name="password"]').change();
    this.$('input[name="url"]').focus();

    let errorDivs = this.$('div.error');
    assert.equal(errorDivs.length, 0);
});

test('does not create a record for an unreachable url', function(assert) {
    const qAsync = assert.async();
    this.render(hbs`{{gh-edit-blog}}`);

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
    let timesCheckedForError = 0;
    this.render(hbs`{{gh-edit-blog}}`);

    this.$('input[name="url"]').val('http://bing.com');
    this.$('input[name="url"]').change();
    this.$('input[name="identification"]').val('test@user.com');
    this.$('input[name="identification"]').change();
    this.$('input[name="password"]').val('testp@ss');
    this.$('input[name="password"]').change();

    Ember.run(() => this.$('button:submit').click());

    function checkForError() {
        let errorDivs = this.$('div.error');

        if (timesCheckedForError > 80) {
            // 20 seconds passed, let's stop here
            return;
        }

        if (errorDivs.length > 0) {
            assert.equal(errorDivs.length, 1);
            qAsync();
        } else {
            timesCheckedForError++;
            setTimeout(checkForError, 250);
        }
    }

    setTimeout(checkForError, 500);
});

test('adding a blog creates a blog record', function(assert) {
    const qAsync = assert.async();

    this.render(hbs`{{gh-edit-blog}}`);

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

    this.render(hbs`{{gh-edit-blog}}`);

    this.$('input[name="url"]').val('https://dev.ghost.org/ghost');
    this.$('input[name="url"]').change();
    this.$('input[name="identification"]').val('test@user.com');
    this.$('input[name="identification"]').change();
    this.$('input[name="password"]').val('testp@ss');
    this.$('input[name="password"]').change();

    Ember.run(() => this.$('button:submit').click());

    checkForRecord(assert, qAsync);
});

test('passed a blog, the component shows the title', function(assert) {
    this.set('_blog', blogs[0]);
    this.render(hbs`{{gh-edit-blog blog=_blog}}`);

    const text = this.$().text().trim();
    const containsText = text.includes('Testblog');

    assert.ok(containsText);
});

test('passed a blog, the url is set to the blog\'s url', function(assert) {
    this.set('_blog', blogs[0]);
    this.render(hbs`{{gh-edit-blog blog=_blog}}`);

    let urlContent = this.$('input[name="url"]').val();
    assert.notEqual(urlContent, '');
});

test('passed a blog, the identification is set to the blog\'s identification', function(assert) {
    this.set('_blog', blogs[0]);
    this.render(hbs`{{gh-edit-blog blog=_blog}}`);

    let identificationContent = this.$('input[name="identification"]').val();
    assert.notEqual(identificationContent, '');
});

test('passed a blog, the password is set to the blog\'s password', function(assert) {
    this.set('_blog', blogs[0]);
    this.render(hbs`{{gh-edit-blog blog=_blog}}`);

    let passwordContent = this.$('input[name="password"]').val();
    assert.notEqual(passwordContent, '');
});

test('passed a blog, it checks values again', function(assert) {
    this.set('_blog', blogs[0]);
    this.render(hbs`{{gh-edit-blog blog=_blog}}`);

    let errorDivs = this.$('div.error');
    assert.equal(errorDivs.length, 0);
});

test('passed a blog, it does not create a new record - even if everything changed', function(assert) {
    const qAsync = assert.async();

    let blogProps = {
        name: blogs[0].get('name'),
        identification: blogs[0].get('identification')
    }

    this.set('_blog', blogs[0]);
    this.render(hbs`{{gh-edit-blog blog=_blog}}`);

    this.$('input[name="url"]').val('https://dev.ghost.org/ghost');
    this.$('input[name="url"]').change();
    this.$('input[name="identification"]').val('test@user.com');
    this.$('input[name="identification"]').change();
    this.$('input[name="password"]').val('testp@ss');
    this.$('input[name="password"]').change();

    Ember.run(() => this.$('button:submit').click());

    setTimeout(() => {
        if (recordCreated) {
            assert.fail(recordCreated, false, 'Record created');
            qAsync();
        } else {
            assert.ok(true);
            qAsync();
        }
    }, 500);
});