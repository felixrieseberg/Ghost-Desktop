import { firstLetter } from 'ghost-desktop/helpers/first-letter';
import { module, test } from 'qunit';

module('Unit | Helper | first letter');

// Replace this with your real tests.
test('it works', function(assert) {
    let result = firstLetter('Testblog');
    assert.equal(result, 'T');
});
