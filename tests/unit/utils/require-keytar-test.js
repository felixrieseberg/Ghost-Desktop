import requireKeytar from 'ghost-desktop/utils/require-keytar';
import {module, test} from 'qunit';

module('Unit | Utility | require keytar');

test('it returns the keytar module', function(assert) {
    let result = requireKeytar();
    assert.ok(result);
});

test('it returns false when require keytar fails', function(assert) {
    let oldRequire = window.requireNode;

    window.requireNode = function(module) {
        if (module === 'keytar') {
            throw new Error("Module loading error");
        } else {
            oldRequire(...arguments);
        }
    }

    let result = requireKeytar();
    assert.equal(result, false);

    window.requireNode = oldRequire;
});