import { test, moduleForComponent } from 'ember-qunit';

moduleForComponent('gh-find-in-webview', 'Unit | Component | gh find in webview', {
        unit: true,
        // specify the other units that are required for this test
        needs: ['service:window-menu', 'util:find-visible-webview']
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
    const component = this.subject({ isActive: true });
    const oldjQuery = Ember.$;

    Ember.$ = function(selector) {
        if (selector === 'webview:visible') {
            return [{
                stopFindInPage: (action) => assert.equal(action, 'clearSelection')
            }]
        } else {
            return oldjQuery(...arguments);
        }
    }

    Ember.run(() => {
        this.render();
        component.handleFind();
        Ember.$ = oldjQuery;
    });
});

test('_insertMenuItem() injects an item', function(assert) {
    assert.expect(6);

    const component = this.subject({
        windowMenu: new Ember.Object({
            injectMenuItem(params) {
                assert.equal(params.menuName, 'Edit');
                assert.equal(params.name, 'find-in-webview');
                assert.equal(params.label, '&Find');
                assert.equal(params.accelerator, 'CmdOrCtrl+F');
                assert.equal(params.addSeperator, true);
                assert.equal(params.position, 3);
            }
        })
    });

    Ember.run(() => {
        this.render();
    });
});
