import { moduleFor, test } from 'ember-qunit';

moduleFor('service:auto-update', 'Unit | Service | auto update', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

test('it exists', function(assert) {
    let service = this.subject();
    assert.ok(service);
});

test('reports the correct environment', function(assert) {
    let service = this.subject();
    assert.ok(service.get('environment'));
});

test('reports the correct application version', function(assert) {
    let oldRequire = window.requireNode;

    window.requireNode = function(target) {
        if (target === 'electron') {
            return {
                remote: {
                    require(module) {
                        return {
                            getVersion() {
                                return '1.0.0-beta';
                            }
                        }
                    }
                }
            }
        } else {
            return oldRequire(...arguments);
        }
    }

    let service = this.subject();
    assert.equal(service.get('appVersion'), '1.0.0-beta');

    window.requireNode = oldRequire;
});

test('calls setup if during checkForUpdates', function(assert) {
    let oldRequire = window.requireNode;
    let service = this.subject();

    service.set('environment', 'production');
    service._setup = () => assert.ok(true);
    service.checkForUpdates();
});

test('can call checkForUpdates from the wrong environment', function(assert) {
    assert.expect(0);

    let service = this.subject();
    service.checkForUpdates();
});

test('can call setup from the wrong environment', function(assert) {
    assert.expect(0);

    let service = this.subject();
    service._setup();
});

test('calls Electron\'s autoUpdater for update checking', function(assert) {
    let oldRequire = window.requireNode;
    let service = this.subject();

    service.set('environment', 'production');
    service.set('autoUpdater', {
        checkForUpdates() {
            assert.ok(true);
        }
    });
    service.checkForUpdates();
});

test('update does attempt to update if one is downloaded', function(assert) {
    let service = this.subject();
    service.set('isUpdateDownloaded', true);
    service.set('autoUpdater', {
        quitAndInstall() {
            assert.ok(true);
        }
    });
    service.update();
});

test('update does not attempt to update if none is downloaded', function(assert) {
    assert.expect(0);

    let service = this.subject();
    service.set('isUpdateDownloaded', false);
    service.set('autoUpdater', {
        quitAndInstall() {
            assert.ok(false);
        }
    });
    service.update();
});


test('attempts to update before shutting down if an update is downloaded', function(assert) {
    let oldRequire = window.requireNode;

    window.requireNode = function(target) {
        if (target === 'electron') {
            return {
                remote: {
                    require(module) {
                        return {
                            quit() {
                                assert.ok(false);
                            },
                            showMessageBox(opts, handler) {
                                handler(1);
                            }
                        }
                    }
                }
            }
        } else {
            return oldRequire(...arguments);
        }
    }

    let service = this.subject();
    service.set('isUpdateDownloaded', true);
    service.set('autoUpdater', {
        quitAndInstall() {
            assert.ok(true);
        }
    });
    service.updateAndShutdown();

    window.requireNode = oldRequire;
});

test('does not attempt update if downloaded and user declined', function(assert) {
    let oldRequire = window.requireNode;

    window.requireNode = function(target) {
        if (target === 'electron') {
            return {
                remote: {
                    require(module) {
                        return {
                            quit() {
                                assert.ok(true);
                            },
                            showMessageBox(opts, handler) {
                                handler(0);
                            }
                        }
                    }
                }
            }
        } else {
            return oldRequire(...arguments);
        }
    }

    let service = this.subject();
    service.set('isUpdateDownloaded', true);
    service.set('autoUpdater', {
        quitAndInstall() {
            assert.ok(false);
        }
    });
    service.updateAndShutdown();

    window.requireNode = oldRequire;
});

test('does not attempt to update if no update is downloaded', function(assert) {
    let oldRequire = window.requireNode;

    window.requireNode = function(target) {
        if (target === 'electron') {
            return {
                remote: {
                    require(module) {
                        return {
                            quit() {
                                assert.ok(true);
                            }
                        }
                    }
                }
            }
        } else {
            return oldRequire(...arguments);
        }
    }

    let service = this.subject();
    service.set('isUpdateDownloaded', false);
    service.set('autoUpdater', {
        quitAndInstall() {
            assert.ok(false);
        }
    });
    service.updateAndShutdown();

    window.requireNode = oldRequire;
});

test('_setup sets the feed url', function(assert) {
    let oldRequire = window.requireNode;

    window.requireNode = function(target) {
        if (target === 'electron') {
            return {
                remote: {
                    require(module) {
                        return {
                            setFeedURL(url) {
                                assert.ok(url);
                            },
                            on() {}
                        }
                    }
                }
            }
        } else {
            return oldRequire(...arguments);
        }
    }

    let service = this.subject();
    service.set('appVersion', '1.0.0-beta');
    service.set('environment', 'production');
    service._setup();

    window.requireNode = oldRequire;
});

test('_setup handles autoUpdater events', function(assert) {
    assert.expect(4);
    let oldRequire = window.requireNode;

    window.requireNode = function(target) {
        if (target === 'electron') {
            return {
                remote: {
                    require(module) {
                        return {
                            setFeedURL() {},
                            on(e, handler) {
                                if (e === 'checking-for-update') {
                                    assert.ok(true, 'handles checking-for-update');
                                }

                                if (e === 'update-available') {
                                    assert.ok(true, 'handles update-available');
                                }

                                if (e === 'update-downloaded') {
                                    assert.ok(true, 'handles update-downloaded');
                                }

                                if (e === 'update-not-available') {
                                    assert.ok(true, 'handles update-not-available');
                                }
                            }
                        }
                    }
                }
            }
        } else {
            return oldRequire(...arguments);
        }
    }

    let service = this.subject();
    service.set('appVersion', '1.0.0-beta');
    service.set('environment', 'production');
    service._setup();

    window.requireNode = oldRequire;
});

test('autoUpdater\'s update checks is reflected in isCheckingForUpdate', function(assert) {
    let oldRequire = window.requireNode;

    window.requireNode = function(target) {
        if (target === 'electron') {
            return {
                remote: {
                    require(module) {
                        return {
                            setFeedURL() {},
                            on(e, handler) {
                                if (e === 'checking-for-update') {
                                    handler();
                                }
                            }
                        }
                    }
                }
            }
        } else {
            return oldRequire(...arguments);
        }
    }

    let service = this.subject();
    service.set('appVersion', '1.0.0-beta');
    service.set('environment', 'production');
    service._setup();

    assert.equal(service.get('isCheckingForUpdate'), true);

    window.requireNode = oldRequire;
});

test('autoUpdater\'s update-available is reflected in isUpdateAvailable', function(assert) {
    let oldRequire = window.requireNode;

    window.requireNode = function(target) {
        if (target === 'electron') {
            return {
                remote: {
                    require(module) {
                        return {
                            setFeedURL() {},
                            on(e, handler) {
                                if (e === 'update-available') {
                                    handler();
                                }
                            }
                        }
                    }
                }
            }
        } else {
            return oldRequire(...arguments);
        }
    }

    let service = this.subject();
    service.set('appVersion', '1.0.0-beta');
    service.set('environment', 'production');
    service._setup();

    assert.equal(service.get('isUpdateAvailable'), true);

    window.requireNode = oldRequire;
});

test('autoUpdater\'s update-downloaded is reflected in isUpdateDownloaded', function(assert) {
    let oldRequire = window.requireNode;

    window.requireNode = function(target) {
        if (target === 'electron') {
            return {
                remote: {
                    require(module) {
                        return {
                            setFeedURL() {},
                            on(e, handler) {
                                if (e === 'update-downloaded') {
                                    handler();
                                }
                            }
                        }
                    }
                }
            }
        } else {
            return oldRequire(...arguments);
        }
    }

    let service = this.subject();
    service.set('appVersion', '1.0.0-beta');
    service.set('environment', 'production');
    service._setup();

    assert.equal(service.get('isUpdateDownloaded'), true);

    window.requireNode = oldRequire;
});

test('autoUpdater\'s update-not-available is reflected in isUpdateAvailable', function(assert) {
    let oldRequire = window.requireNode;

    window.requireNode = function(target) {
        if (target === 'electron') {
            return {
                remote: {
                    require(module) {
                        return {
                            setFeedURL() {},
                            on(e, handler) {
                                if (e === 'update-not-available') {
                                    handler();
                                }
                            }
                        }
                    }
                }
            }
        } else {
            return oldRequire(...arguments);
        }
    }

    let service = this.subject();
    service.set('appVersion', '1.0.0-beta');
    service.set('environment', 'production');
    service._setup();

    assert.equal(service.get('isUpdateAvailable'), false);

    window.requireNode = oldRequire;
});