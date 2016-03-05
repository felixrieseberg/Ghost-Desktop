import { moduleForComponent } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import test from 'ghost-desktop/tests/ember-sinon-qunit/test';

let recordCreated = false;
let recordSaved = false;

const store = Ember.Service.extend({
    createRecord() {
        recordCreated = true;
        return {
            setPassword() {},
            save() {
                recordSaved = true;
            }
        }
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

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });"

    this.render(hbs`{{gh-add-blog}}`);

    const text = this.$().text().trim();
    const containsText = text.includes('Before we get started, please tell us where to find your blog');
    assert.ok(containsText);
});

test('adding a blog creates a blog record', function(assert) {
    const path = requireNode('path');
    const qAsync = assert.async();

    this.render(hbs`{{gh-add-blog}}`);

    this.$('input[name="url"]').val(path.join(process.cwd(), 'tests', 'fixtures', 'static-signin', 'signin.html'));
    this.$('input[name="url"]').change();
    this.$('input[name="identification"]').val('test@user.com');
    this.$('input[name="identification"]').change();
    this.$('input[name="password"]').val('testp@ss');
    this.$('input[name="password"]').change();

    this.$('button:submit').click();

    setTimeout(() => {
        assert.ok(recordCreated);
        qAsync();
    }, 500);
});

test('adding a blog saves a blog record', function(assert) {
    const path = requireNode('path');
    const qAsync = assert.async();

    this.render(hbs`{{gh-add-blog}}`);

    this.$('input[name="url"]').val(path.join(process.cwd(), 'tests', 'fixtures', 'static-signin', 'signin.html'));
    this.$('input[name="url"]').change();
    this.$('input[name="identification"]').val('test@user.com');
    this.$('input[name="identification"]').change();
    this.$('input[name="password"]').val('testp@ss');
    this.$('input[name="password"]').change();

    this.$('button:submit').click();

    setTimeout(() => {
        assert.ok(recordSaved);
        qAsync();
    }, 500);
});
