import { setup } from 'ghost-desktop/utils/window-menu';
import { module, test } from 'qunit';

module('Unit | Utility | window menu');

test('creates a menu (5 elements, 6 for OS X)', function(assert) {
    let result = setup();
    let expected = (process.platform === 'darwin') ? 6 : 5;

    assert.equal(result.items.length, expected);
});
