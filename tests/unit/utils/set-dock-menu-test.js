import setDockMenu from 'ghost-desktop/utils/set-dock-menu';
import { module, test } from 'qunit';
import { blogs } from '../../fixtures/blogs';

module('Unit | Utility | set dock menu');

test('it setups a dock menu', function(assert) {
    let oldRequire = window.requireNode;
    let mockRemote = { app: { dock: {} } };
    let menuSetup = false;
    mockRemote.Menu = requireNode('electron').remote.Menu;
    mockRemote.MenuItem = requireNode('electron').remote.MenuItem;

    mockRemote.app.dock.setMenu = function(menu) {
        assert.equal(menu.items.length, 3);
    }

    window.requireNode = function (module) {
        if (module === 'electron') {
            return { remote: mockRemote };
        } else {
            oldRequire(...arguments);
        }
    }

    setDockMenu([{
        name: 'Testblog A',
        callback: function() {}
    }, {
        name: 'Testblog B',
        callback: function() {}
    }, {
        name: 'Testblog C',
        callback: function() {}
    }]);

    window.requireNode = oldRequire;
});

test('ignores borked blog items', function(assert) {
    let oldRequire = window.requireNode;
    let mockRemote = { app: { dock: {} } };
    let menuSetup = false;
    mockRemote.Menu = requireNode('electron').remote.Menu;
    mockRemote.MenuItem = requireNode('electron').remote.MenuItem;

    mockRemote.app.dock.setMenu = function(menu) {
        assert.equal(menu.items.length, 2);
    }

    window.requireNode = function (module) {
        if (module === 'electron') {
            return { remote: mockRemote };
        } else {
            oldRequire(...arguments);
        }
    }

    setDockMenu([{
        name: 'Testblog A',
        callback: function() {}
    }, {
        name: 'Testblog B',
        callback: undefined
    }, {
        name: 'Testblog C',
        callback: function() {}
    }]);

    window.requireNode = oldRequire;
});

test('does not do anything if called without items', function(assert) {
    assert.expect(0);

    let oldRequire = window.requireNode;
    let mockRemote = { app: { dock: {} } };
    let menuSetup = false;
    mockRemote.Menu = requireNode('electron').remote.Menu;
    mockRemote.MenuItem = requireNode('electron').remote.MenuItem;

    mockRemote.app.dock.setMenu = function(menu) {
        assert.ok(false);
    }

    window.requireNode = function (module) {
        if (module === 'electron') {
            return { remote: mockRemote };
        } else {
            oldRequire(...arguments);
        }
    }

    setDockMenu();

    window.requireNode = oldRequire;
});