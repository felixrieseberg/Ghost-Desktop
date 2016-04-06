import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { blogs } from '../../fixtures/blogs';

/**
 * Test Preparation
 */

moduleForComponent('gh-instance-host', 'Unit | Component | gh instance host', {
    unit: true
});

/**
 * Tests
 */

test('show sets the instance to loaded', function(assert) {
    const component = this.subject();
    
    component.show();
    
    assert.ok(component.get('isInstanceLoaded'));
});

test('signing aborts attempts to signin when username or password are missing', function(assert) {
    const path = requireNode('path');
    const component = this.subject({
        blog: {
            url: path.join(__dirname, 'tests', 'fixtures', 'static-signin', 'signin.html'),
            identification: 'testuser',
            getPassword() {
                return undefined;
            }
        }
    });
    
    this.render();
    Ember.run(() => component.signin());
    
    assert.ok(component.get('isInstanceLoaded'));
});

test('signing attempts to signin', function(assert) {
    const path = requireNode('path');
    const component = this.subject({
        blog: {
            url: path.join(__dirname, 'tests', 'fixtures', 'static-signin', 'signin.html'),
            identification: 'testuser',
            getPassword() {
                return 'p@ssword';
            }
        }
    });
    
    this.render();
    component.signin();
    
    assert.ok(component.get('isAttemptedSignin'));
});

test('handleLoaded eventually shows the webview', function(assert) {
    // Testing async, ensuring that the webview had enough time to setup
    stop();
    
    const path = requireNode('path');
    const component = this.subject({
        blog: {
            url: path.join(__dirname, 'tests', 'fixtures', 'static-signin', 'signin.html'),
            identification: 'testuser',
            getPassword() {
                return 'p@ssword';
            }
        }
    });
    
    this.render();
    Ember.run.later(() => component._handleLoaded(), 500);
    Ember.run.later(() => {
        assert.ok(component.get('isInstanceLoaded'));
        start();
    }, 750);
});

test('console message "loaded" eventually shows the webview', function(assert) {
    const path = requireNode('path');
    const component = this.subject();
    const e = { originalEvent: {}};
    
    e.originalEvent.message = 'login-error'
    component._handleConsole(e);
    assert.ok(component.get('isInstanceLoaded'));
});

test('console message "login-error" eventually shows the webview', function(assert) {
    const path = requireNode('path');
    const component = this.subject();
    const e = { originalEvent: {}};
    
    e.originalEvent.message = 'login-error'
    component._handleConsole(e);
    assert.ok(component.get('isInstanceLoaded'));
});

test('handleLoadFailure redirects the webview to the error page', function(assert) {
    // This test crashes Electron on Windows (and I have no idea why)
    if (process.platform === 'win32') {
        return assert.ok(true);
    }
    
    // Testing async, ensuring that the webview had enough time to setup
    stop();
    
    const path = requireNode('path');
    const component = this.subject({
        blog: {
            url: 'http://0.0.0.0/404',
            identification: 'testuser',
            getPassword() {
                return 'p@ssword';
            }
        }
    });
    const e = {
        originalEvent: {
            validatedURL: 'http://hi.com'
        }
    };
    
    this.render();
    Ember.run.later(() => component._handleLoadFailure(e), 300);
    Ember.run.later(() => {
        assert.ok(component.get('isInstanceLoaded'));
        start();
    }, 750);
});

test('handleLoadFailure does not redirect for failed file:// loads', function(assert) {
    // Testing async, ensuring that the webview had enough time to setup
    stop();
    
    const path = requireNode('path');
    const component = this.subject({
        blog: {
            url: path.join('http://0.0.0.0/404'),
            identification: 'testuser',
            getPassword() {
                return 'p@ssword';
            }
        }
    });
    const e = {
        originalEvent: {
            validatedURL: 'file://hi.com'
        }
    };
    
    this.render();
    Ember.run.later(() => component._handleLoadFailure(e), 300);
    Ember.run.later(() => {
        assert.equal(component.get('isInstanceLoaded'), false);
        start();
    }, 750);
});