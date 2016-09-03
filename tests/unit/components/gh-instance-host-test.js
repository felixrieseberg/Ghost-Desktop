import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { blogs } from '../../fixtures/blogs';

/**
 * Test Preparation
 */

moduleForComponent('gh-instance-host', 'Unit | Component | gh instance host', {
    unit: true,
    needs: ['service:preferences', 'component:gh-basic-auth', 'storage:preferences']
});

const path = requireNode('path');
const blog501 = {
    blog: {
        url: path.join('http://0.0.0.0/404'),
        identification: 'testuser',
        getPassword() {
            return undefined;
        },
        updateName() {
            return new Promise((resolve) => resolve());
        }
    }
};
const blog404 = {
    blog: {
        url: path.join('http://0.0.0.0/404'),
        identification: 'testuser',
        getPassword() {
            return 'p@ssword';
        },
        updateName() {
            return new Promise((resolve) => resolve());
        }
    }
};
const blog200 = {
    blog: {
        url: path.join(__dirname, 'tests', 'fixtures', 'static-signin', 'signin.html'),
        identification: 'testuser',
        getPassword() {
            return 'p@ssword';
        },
        updateName() {
            return new Promise((resolve) => resolve());
        }
    }
};
const blogFile404 = {
    blog: {
        url: 'file://hi.com',
        identification: 'testuser',
        getPassword() {
            return 'p@ssword';
        },
        updateName() {
            return new Promise((resolve) => resolve());
        }
    }
};

/**
 * Tests
 */

test('show sets the instance to loaded', function(assert) {
    const component = this.subject(blog200);

    component.show();

    assert.ok(component.get('isInstanceLoaded'));
});

test('signing aborts attempts to signin when username or password are missing', function(assert) {
    const component = this.subject(blog501);

    this.render();
    Ember.run(() => component.signin());

    assert.ok(component.get('isInstanceLoaded'));
});

test('signing attempts to signin', function(assert) {
    const component = this.subject(blog200);

    this.render();
    component.signin();

    assert.ok(component.get('isAttemptedSignin'));
});

test('handleLoaded eventually shows the webview', function(assert) {
    const done = assert.async();
    const component = this.subject();

    this.render();
    Ember.run.later(() => component._handleLoaded(), 500);
    Ember.run.later(() => {
        assert.ok(component.get('isInstanceLoaded'));
        done();
    }, 750);
});

test('console message "loaded" eventually shows the webview', function(assert) {
    const component = this.subject();
    const e = { originalEvent: {}};

    e.originalEvent.message = 'loaded'
    component._handleConsole(e);
    assert.ok(component.get('isInstanceLoaded'));
});

test('handleLoadFailure redirects the webview to the error page', function(assert) {
    // This test crashes Electron on Windows (and I have no idea why)
    if (process.platform === 'win32') {
        return assert.ok(true);
    }

    const done = assert.async();
    const path = requireNode('path');
    const component = this.subject(blog404);
    const e = {
        originalEvent: {
            validatedURL: 'http://hi.com'
        }
    };

    this.render();
    Ember.run.later(() => component._handleLoadFailure(e), 1000);
    Ember.run.later(() => {
        const isErrorPage = this.$('webview').attr('src').includes('load-error');
        assert.ok(isErrorPage);
        done();
    }, 1500);
});

test('handleLoadFailure does not redirect for failed file:// loads', function(assert) {
    const done = assert.async();
    const path = requireNode('path');
    const component = this.subject(blogFile404);

    this.render();
    Ember.run.later(() => {
        assert.equal(this.$('webview').attr('src'), 'file://hi.com');
        done();
    }, 750);
});