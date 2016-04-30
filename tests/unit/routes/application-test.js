import {moduleFor, test} from 'ember-qunit';
import {autoUpdateMock} from '../../fixtures/auto-update';

moduleFor('route:application', 'Unit | Route | application', {
    // Specify the other units that are required for this test.
    needs: ['model:blog', 'service:window-menu', 'service:preferences'],
    beforeEach: function () {
        this.register('service:auto-update', autoUpdateMock);
        this.inject.service('auto-update', { as: 'autoUpdate' });
    }
});

test('it exists', function(assert) {
    let route = this.subject();
    assert.ok(route);
});

test('it returns blogs as a model', function(assert) {
    let route = this.subject();

    // stub store on the route
    route.store = {
        findAll: function(args) {
            assert.equal(args, 'blog');
            return new Promise((resolve) => resolve([{ name: 'hi'}, {name: 'ho'}]));
        }
    };

    return route.model().then((result) => assert.equal(result.length, 2));
});

test('before the model loads, we setup window and context menu', function(assert) {
    assert.expect(3);

    let oldAddEventListener = window.addEventListener;
    let oldRequire = window.requireNode;

    window.addEventListener = () => assert.ok(true);
    window.requireNode = function(target) {
        if (target === 'electron') {
            return {
                remote: {
                    Menu: {
                        setApplicationMenu() {
                                assert.ok(true);
                            },
                            buildFromTemplate() {
                                assert.ok(true);
                            }
                    },
                    getCurrentWindow() {
                        return {}
                    }
                }
            }
        } else {
            return oldRequire(...arguments);
        }
    }

    let route = this.subject();
    route.beforeModel();

    window.addEventListener = oldAddEventListener;
    window.requireNode = oldRequire;
});