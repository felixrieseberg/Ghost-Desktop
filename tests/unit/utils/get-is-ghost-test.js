import getIsGhost from 'ghost-desktop/utils/get-is-ghost';
import {module, test} from 'qunit';

module('Unit | Utility | get is ghost host');

test('correctly marks a Ghost app as Ghost', function (assert) {
    let path = requireNode('path');
    let url = path.join(process.cwd(), 'tests', 'fixtures', 'static-signin', 'signin.html');

    return getIsGhost(url)
        .then((result) => {
            assert.ok(result);
        });
});

test('correctly marks a non-Ghost site as Ghost', function (assert) {
    let path = requireNode('path');
    let url = path.join(process.cwd(), 'tests', 'fixtures', 'not-ghost', 'not-ghost.html');

    return getIsGhost(url)
        .then((result) => {
            assert.ok(!result);
        });
});

test('rejects the promise if called without a parameter', function (assert) {
    return getIsGhost()
        .catch((err) => assert.ok(err));
});