import setWindowTitle from 'ghost-desktop/utils/set-window-title';
import { module, test } from 'qunit';

module('Unit | Utility | set window title');

test('it sets the window title', function(assert) {
    let oldRequire = window.requireNode;
    let newTitle = 'Testtitle'

    window.requireNode = function (module) {
        if (module === 'electron') {
            return {
                remote: {
                    BrowserWindow: {
                        getFocusedWindow() {
                            return {
                                setTitle(title) {
                                    assert.equal(title, `Ghost - ${newTitle}`);
                                }
                            }
                        }
                    }
                }
            }
        } else {
            oldRequire(...arguments);
        }
    }

    setWindowTitle(newTitle);

    // Reset
    window.requireNode = oldRequire;
});
