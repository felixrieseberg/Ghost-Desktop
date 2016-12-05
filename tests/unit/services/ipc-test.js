import { moduleFor, test } from 'ember-qunit';

const EventEmitter = require('events');
class FakeIpcRenderer extends EventEmitter {};

moduleFor('service:ipc', 'Unit | Service | ipc', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
});

// Replace this with your real tests.
test('it exists', function(assert) {
    const service = this.subject();
    assert.ok(service);
});

test('it triggers create-draft on ipc create-draft', function(assert) {
    const done = assert.async();
    const oldRequire = window.require;
    const fakeIpcRenderer = new FakeIpcRenderer();

    window.require = function(target) {
        if (target === 'electron') {
            return {
                ipcRenderer: fakeIpcRenderer,
                remote: {
                    getCurrentWindow() {
                        return {
                            isVisible: () => true,
                            isMinimized: () => false
                        }
                    }
                }
            }
        } else {
            return oldRequire(...arguments);
        }
    }

    const service = this.subject();
    service.on('create-draft', (argument) => {
        assert.equal(argument, 'test');
        done();
    });
    fakeIpcRenderer.emit('create-draft', {}, 'test');

    window.require = oldRequire;
});

test('it triggers open-blog on ipc open-blog', function(assert) {
    const done = assert.async();
    const oldRequire = window.require;
    const fakeIpcRenderer = new FakeIpcRenderer();

    window.require = function(target) {
        if (target === 'electron') {
            return {
                ipcRenderer: fakeIpcRenderer,
                remote: {
                    getCurrentWindow() {
                        return {
                            isVisible: () => true,
                            isMinimized: () => false
                        }
                    }
                }
            }
        } else {
            return oldRequire(...arguments);
        }
    }

    const service = this.subject();
    service.on('open-blog', (argument) => {
        assert.equal(argument, 'test');
        done();
    });
    fakeIpcRenderer.emit('open-blog', {}, 'test');

    window.require = oldRequire;
});

test('restoreWindow shows window if hidden', function(assert) {
    const done = assert.async();
    const oldRequire = window.require;
    const fakeIpcRenderer = new FakeIpcRenderer();

    window.require = function(target) {
        if (target === 'electron') {
            return {
                ipcRenderer: fakeIpcRenderer,
                remote: {
                    getCurrentWindow() {
                        return {
                            isVisible: () => false,
                            isMinimized: () => false,
                            show() {
                                assert.ok(true);
                                done();
                            }
                        }
                    }
                }
            }
        } else {
            return oldRequire(...arguments);
        }
    }

    const service = this.subject();
    service.restoreWindow();

    window.require = oldRequire;
});

test('restoreWindow restores window if minimized', function(assert) {
    const done = assert.async();
    const oldRequire = window.require;
    const fakeIpcRenderer = new FakeIpcRenderer();

    window.require = function(target) {
        if (target === 'electron') {
            return {
                ipcRenderer: fakeIpcRenderer,
                remote: {
                    getCurrentWindow() {
                        return {
                            isVisible: () => true,
                            isMinimized: () => true,
                            restore() {
                                assert.ok(true);
                                done();
                            }
                        }
                    }
                }
            }
        } else {
            return oldRequire(...arguments);
        }
    }

    const service = this.subject();
    service.restoreWindow();

    window.require = oldRequire;
});
