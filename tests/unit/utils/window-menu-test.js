import { setup, reload, toggleDevTools, toggleGhostDevTools, toggleFullscreen, openReportIssues, openRepository } from 'ghost-desktop/utils/window-menu';
import { module, test } from 'qunit';

module('Unit | Utility | window menu');

test('creates a menu (6 elements)', function(assert) {
    let result = setup();
    let expected = 6;

    assert.equal(result.length, expected);
});

test('reloads a given BrowserWindow', function(assert) {
    reload({}, {
        reload() {
            assert.ok(true, 'reload called');
        }
    });
});

test('toggles devtools on a given BrowserWindow', function(assert) {
    toggleDevTools({}, {
        toggleDevTools() {
            assert.ok(true, 'toggleDevTools called');
        }
    });
});

test('toggles fullscreen on a given BrowserWindow', function(assert) {
    toggleFullscreen({}, {
        setFullScreen(bool) {
            assert.ok(bool);
        },
        isFullScreen() {
            return false;
        }
    });
});

test('toggles fullscreen in a ghost instance', function(assert) {
    assert.expect(2);

    // Monkeypatch
    const _$ = window.Ember.$;
    let isDevToolsOpened = false;
    let openDevToolsCalled = false;
    let closeDevToolsCalled = false;

    window.Ember.$ = function (selector) {
        if (selector && selector === 'div.instance-host.selected') {
            return 'host';
        } else if (selector === 'host') {
            return {
                find() {
                    return [{
                        isDevToolsOpened() {
                            return isDevToolsOpened;
                        },
                        openDevTools() {
                            openDevToolsCalled = true;
                            isDevToolsOpened = true;
                        },
                        closeDevTools() {
                            closeDevToolsCalled = true;
                            isDevToolsOpened = false;
                        }
                    }];
                }
            }
        } else {
            return _$(...arguments);
        }
    }

    toggleGhostDevTools({}, {});
    assert.ok(openDevToolsCalled, 'dev tools have been opened');
    toggleGhostDevTools({}, {});
    assert.ok(openDevToolsCalled, 'dev tools have been closed');

    window.Ember.$ = _$;
});

test('does not do anything if there\'s no webview', function(assert) {
    assert.expect(0);

    // Monkeypatch
    const _$ = window.Ember.$;
    let isDevToolsOpened = false;
    let openDevToolsCalled = false;
    let closeDevToolsCalled = false;

    window.Ember.$ = function (selector) {
        if (selector && selector === 'div.instance-host.selected') {
            return undefined;
        } else {
            return _$(...arguments);
        }
    }

    toggleGhostDevTools();

    window.Ember.$ = _$;
});

test('opens the repo on GitHub', function(assert) {
   let _requireNode = window.requireNode;
   let openExternalCalled = false;

   window.requireNode = function (target) {
       if (target === 'electron') {
           return {
               shell: {
                   openExternal() {
                       openExternalCalled = true;
                   }
               }
           }
       } else {
           return _requireNode(...arguments);
       }
   }

   openRepository();
   assert.ok(openExternalCalled);
   window.requireNode = _requireNode;
});

test('opens the issues on GitHub', function(assert) {
   let _requireNode = window.requireNode;
   let openExternalCalled = false;

   window.requireNode = function (target) {
       if (target === 'electron') {
           return {
               shell: {
                   openExternal() {
                       openExternalCalled = true;
                   }
               }
           }
       } else {
           return _requireNode(...arguments);
       }
   }

   openReportIssues();
   assert.ok(openExternalCalled);
   window.requireNode = _requireNode;
});
