import getCurrentWindow from 'ghost-desktop/utils/get-current-window';
import {module, test} from 'qunit';

module('Unit | Utility | get current window');

test('it returns the currently highlighted window', function(assert) {
    let oldRequire = window.requireNode;
    let mockRemote = {
        BrowserWindow: {
            getFocusedWindow() {
                return { window: true};
            }
        }
    };

    window.requireNode = function(module) {
        if (module === 'electron') {
            return {
                remote: mockRemote
            };
        } else {
            oldRequire(...arguments);
        }
    }

    let result = getCurrentWindow();
    assert.ok(result);

    window.requireNode = oldRequire;
});

test('it returns the first, if the highlighted window is not available', function(assert) {
    let oldRequire = window.requireNode;
    let mockRemote = {
        BrowserWindow: {
            getFocusedWindow() {
                return undefined;
            },
            getAllWindows() {
                return [{window: true}];
            }
        }
    };

    window.requireNode = function(module) {
        if (module === 'electron') {
            return {
                remote: mockRemote
            };
        } else {
            oldRequire(...arguments);
        }
    }

    let result = getCurrentWindow();
    assert.ok(result);

    window.requireNode = oldRequire;
});