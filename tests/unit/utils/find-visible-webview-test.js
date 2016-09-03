import findVisibleWebview from 'ghost-desktop/utils/find-visible-webview';
import { module, test } from 'qunit';

module('Unit | Utility | find visible webview');

test('finds a webview if one is visible', function (assert) {
    // Insert webview for testing
    $('<webview src="https://ghost.org/ width="300" height="300" id="gh-test-webview"></webview>')
        .appendTo('body');

    let result = findVisibleWebview();
    assert.ok(result);

    $('#gh-test-webview').remove();
});

test('returns undefined if none is visible', function (assert) {
    // Insert webview for testing
    $('<webview src="https://ghost.org/ width="300" height="300" id="gh-test-webview"></webview>')
        .appendTo('body')
        .hide();

    let result = findVisibleWebview();
    assert.notOk(result);

    $('#gh-test-webview').remove();
});

test('returns the visibile one if multiples exist', function (assert) {
    assert.expect(2);

    // Insert webview for testing
    $('<div id="test-webviews"></div>')
        .append('<webview src="https://ghost.org/" width="300" height="300" id="gh-test-webview-1"></webview>')
        .append('<webview src="https://google.com" width="300" height="300" id="gh-test-webview-2"></webview></div>')
        .appendTo('body');
    $('#gh-test-webview-1').hide();

    let result = findVisibleWebview();
    assert.ok(result);
    assert.equal(result.id, 'gh-test-webview-2');

    $('#gh-test-webview-1').remove();
    $('#gh-test-webview-2').remove();
});

test('returns undefined if there is none', function (assert) {
    let result = findVisibleWebview();
    assert.notOk(result);
});

