import escapeString from 'ghost-desktop/utils/escape-string';
import { module, test } from 'qunit';

module ('Unit | Utility | escape string');

test('escapes a string with single quotes', function (assert) {
    let password = 'hi\'';
    let output = `$('input[name="password"]').val('${escapeString(password)}');`;
    let expected = '$(\'input[name="password"]\').val(\'hi\\\'\');';
    assert.equal(output, expected);
});

test('escapes a string with newlines', function (assert) {
    let password = '\n';
    let output = `$('input[name="password"]').val('${escapeString(password)}');`;
    let expected = '$(\'input[name="password"]\').val(\'\\n\');';
    assert.equal(output, expected);
});
