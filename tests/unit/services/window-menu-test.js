import { moduleFor, test } from 'ember-qunit';

moduleFor('service:window-menu', 'Unit | Service | window menu', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

test('it exists', function(assert) {
    const service = this.subject();
    assert.ok(service);
});

test('has an injections property (array)', function(assert) {
    const service = this.subject();
    const injections = service.get('injections');

    assert.ok(injections.forEach);
});

test('injectMenuItem() eventually calls setApplicationMenu', function(assert) {
    const done = assert.async();
    const oldRequire = window.requireNode;

    window.requireNode = function(target) {
        if (target === 'electron') {
            return {
                remote: {
                    Menu: {
                        buildFromTemplate(template) {
                            return template;
                        },
                        setApplicationMenu(menu) {
                            assert.ok(menu);
                            done();

                            window.requireNode = oldRequire;
                        }
                    },
                    getCurrentWindow() {
                        return { close() {}}
                    }
                }
            }
        } else {
            return oldRequire(...arguments);
        }
    }

    const service = this.subject();
    Ember.run(() => service.injectMenuItem());
});

test('injectMenuItem() adds the correct properties', function(assert) {
    const done = assert.async();
    const oldRequire = window.requireNode;
    assert.expect(3);

    window.requireNode = function(target) {
        if (target === 'electron') {
            return {
                remote: {
                    Menu: {
                        buildFromTemplate(template) {
                            return template;
                        },
                        setApplicationMenu(menu) {
                            const expectedMenu = menu[2].submenu;

                            assert.equal(expectedMenu[2].type, 'separator', 'does pass separator prop correctly');
                            assert.equal(expectedMenu[3].click(), 'test', 'does pass click callback correclty');
                            assert.equal(expectedMenu[3].label, 'test label', 'does pass label prop correctly');

                            done();
                            window.requireNode = oldRequire;
                        }
                    },
                    getCurrentWindow() {
                        return { close() {}}
                    }
                }
            }
        } else {
            return oldRequire(...arguments);
        }
    }

    const service = this.subject();
    Ember.run(() => service.injectMenuItem({
        menuName: 'View',
        click: () => 'test',
        name: 'test-item',
        label: 'test label',
        accelerator: 'CmdOrCtrl+Test',
        addSeperator: true,
        position: 3
    }));
});

test('injectMenuItem() does not inject if injection already exists', function(assert) {
    const oldRequire = window.requireNode;
    const service = this.subject();

    service.set('injections', [{ name: 'test-item' }]);
    service.injectMenuItem({ name: 'test-item'});

    assert.equal(service.get('injections').length, 1);
});
