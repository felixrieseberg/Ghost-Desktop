import { test, moduleForComponent } from 'ember-qunit';

moduleForComponent('gh-find-in-webview', 'Unit | Component | gh find in webview', {
        unit: true,
        // specify the other units that are required for this test
        needs: ['service:window-menu']
    }
);

test('it renders', function(assert) {
    // creates the component instance
    let component = this.subject();

    assert.equal(component._state, 'preRender');

    // renders the component on the page
    this.render();
    assert.equal(component._state, 'inDOM');
});

test('handleFind() toggles the find ui', function(assert) {
    const component = this.subject({isActive: false});

    Ember.run(() => {
        this.render();
        component.handleFind();

        assert.ok(component.get('isActive'));
    });
});

test('handleFind() stops an active search if a webview is found', function(assert) {
    const component = this.subject({
        isActive: true,
        _findVisibleWebview: () => {
            return {
                stopFindInPage: (action) => assert.equal(action, 'clearSelection')
            }
        }
    });

    Ember.run(() => {
        this.render();
        component.handleFind();
    });
});

test('_insertMenuItem() injects an item', function(assert) {
    assert.expect(3);

    const component = this.subject({
        windowMenu: new Ember.Object({
            injections: {
                find() { return false },
                pushObject(item) {
                    assert.equal(item.name, 'find-in-webview');
                    assert.ok(typeof item.injection === 'function');
                }
            },
            setup() { assert.ok(true) }
        })
    });

    Ember.run(() => {
        this.render();
    });
});

test('_insertMenuItem() injects no item if already present', function(assert) {
    assert.expect(0);

    const component = this.subject({
        windowMenu: new Ember.Object({
            injections: {
                find() { return true },
                pushObject() { assert.ok(false) }
            }
        })
    });

    Ember.run(() => {
        this.render();
    });
});

test('_findVisibleWebview() tries to find the first visible webview', function(assert) {
    const component = this.subject();
    
    const oldjQuery = Ember.$;
    Ember.$ = function(selector) {
        if (selector === 'webview:visible') {
            return [{
                isWebview: true
            }]
        } else {
            return oldjQuery(...arguments);
        }
    }

    const webview = component._findVisibleWebview();
    assert.ok(webview.isWebview);

    Ember.$ = oldjQuery;
});
