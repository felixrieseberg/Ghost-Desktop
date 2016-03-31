import { setup } from 'ghost-desktop/utils/context-menu';
import { module, test } from 'qunit';

module('Unit | Utility | context menu');

test('binds to the "contextmenu" event', function(assert) {
    // Monkeypatch
    let addEventListenerCalled = false;
    let oldAddEvent = window.addEventListener;
    window.addEventListener = function (e, cb) {
        if (e === 'contextmenu' && cb) {
            addEventListenerCalled = true;
        }

        return oldAddEvent(...arguments);
    }

    setup();
    assert.ok(addEventListenerCalled);
});

test('right click opens context menu', function(assert) {
    assert.expect(2);

    let element = document.querySelector('input#qunit-filter-input');
    let event = document.createEvent('MouseEvents');
    let x = 10, y = 10;

    let oldRequire = window.requireNode;
    let mockRemote = { BrowserWindow: {}, Menu: {}, getCurrentWindow() { return true; } };
    let menuSetup = false;

    mockRemote.BrowserWindow = window.requireNode('electron').remote.BrowserWindow;
    mockRemote.Menu.buildFromTemplate = function (menu) {
        return {
            popup() {
                assert.ok(true);
            }
        }
    }
    window.requireNode = function (module) {
        if (module === 'electron') {
            return { remote: mockRemote };
        } else {
            oldRequire(...arguments);
        }
    }

    setup();

    event.initMouseEvent('contextmenu', true, true, element.ownerDocument.defaultView, 1, x, y, x, y, false, false, false, false, 2, null);
    element.dispatchEvent(event);

    assert.ok(window.CONTEXTMENU_OPENED);
    window.requireNode = oldRequire;
});

test('does not error on non-input', function(assert) {
    setup();

    var element = document.querySelector('div#qunit');
    var event = document.createEvent('MouseEvents');

    var x = 10, y = 10;

    event.initMouseEvent('contextmenu', true, true, element.ownerDocument.defaultView, 1, x, y, x, y, false, false, false, false, 2, null);
    element.dispatchEvent(event);

    assert.ok(window.CONTEXTMENU_OPENED);
});
