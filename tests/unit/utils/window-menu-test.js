import windowMenu from 'ghost-desktop/utils/window-menu';
import { module, test } from 'qunit';

module('Unit | Utility | window menu');

test('creates a menu', function(assert) {
    let result = windowMenu();
    assert.equal(result.constructor.name, 'Menu');
});
