import {getIsYosemiteOrHigher} from 'ghost-desktop/utils/versions';
import { module, test } from 'qunit';

module('Unit | Utility | versions');

test('getIsYosemiteOrHigher: True for Sierra', function(assert) {
    const oldRequire = window.requireNode;
    window.requireNode = function (module) {
        if (module === 'os') {
            return {
                platform: () => 'darwin',
                release: () => '16.1.0'
            };
        } else {
            oldRequire(...arguments);
        }
    }

    assert.ok(getIsYosemiteOrHigher());
    window.requireNode = oldRequire;
});

test('getIsYosemiteOrHigher: True for El Capitan', function(assert) {
    const oldRequire = window.requireNode;
    window.requireNode = function (module) {
        if (module === 'os') {
            return {
                platform: () => 'darwin',
                release: () => '15.6.0'
            };
        } else {
            oldRequire(...arguments);
        }
    }

    assert.ok(getIsYosemiteOrHigher());
    window.requireNode = oldRequire;
});

test('getIsYosemiteOrHigher: True for Yosemite', function(assert) {
    const oldRequire = window.requireNode;
    window.requireNode = function (module) {
        if (module === 'os') {
            return {
                platform: () => 'darwin',
                release: () => '14.0.0'
            };
        } else {
            oldRequire(...arguments);
        }
    }

    assert.ok(getIsYosemiteOrHigher());
    window.requireNode = oldRequire;
});

test('getIsYosemiteOrHigher: False for Mavericks', function(assert) {
    const oldRequire = window.requireNode;
    window.requireNode = function (module) {
        if (module === 'os') {
            return {
                platform: () => 'darwin',
                release: () => '13.0.0'
            };
        } else {
            oldRequire(...arguments);
        }
    }

    assert.equal(getIsYosemiteOrHigher(), false);
    window.requireNode = oldRequire;
});

test('getIsYosemiteOrHigher: False for Windows', function(assert) {
    const oldRequire = window.requireNode;
    window.requireNode = function (module) {
        if (module === 'os') {
            return {
                platform: () => 'win32',
                release: () => '14.0.0'
            };
        } else {
            oldRequire(...arguments);
        }
    }

    assert.equal(getIsYosemiteOrHigher(), false);
    window.requireNode = oldRequire;
});
