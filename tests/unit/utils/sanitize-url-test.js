import {sanitizeUrl} from 'ghost-desktop/utils/sanitize-url';
import { module, test } from 'qunit';

module('Unit | Utility | sanitize url');

test('adds a trailing slash', function(assert) {
    let result = sanitizeUrl('http://testblog.com/ghost');
    assert.equal(result, 'http://testblog.com/ghost/');
});

test('doesn\'t add a trailing slash if not needed', function(assert) {
    let result = sanitizeUrl('http://testblog.com/ghost/');
    assert.equal(result, 'http://testblog.com/ghost/');
});