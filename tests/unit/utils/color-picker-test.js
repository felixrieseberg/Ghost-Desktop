import getIconColor from 'ghost-desktop/utils/color-picker';
import { module, test } from 'qunit';

module ('Unit | Utility | get icon color');

test('it generates a color for the icon', function (assert) {
    let color = getIconColor(null);

    assert.ok(
      /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color)
    );
})
