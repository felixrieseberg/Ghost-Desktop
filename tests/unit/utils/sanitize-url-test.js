import { sanitizeUrl, isValidUrl } from 'ghost-desktop/utils/sanitize-url';
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

test('adds a trailing /ghost/', function(assert) {
    let result = sanitizeUrl('http://testblog.com/');
    assert.equal(result, 'http://testblog.com/ghost/');
});

test('does not remove a middleing /ghost/', function(assert) {
    let result = sanitizeUrl('http://testblog.com/ghost/myblog/');
    assert.equal(result, 'http://testblog.com/ghost/myblog/ghost/');
});

test('does not remove a middleing ghost', function(assert) {
    let result = sanitizeUrl('http://testblog.com/ghost-blogs/myblog/');
    assert.equal(result, 'http://testblog.com/ghost-blogs/myblog/ghost/');
});

test('adds a http:// if required', function(assert) {
    let result = sanitizeUrl('testblog.com/ghost-blogs/myblog/ghost/');
    assert.equal(result, 'http://testblog.com/ghost-blogs/myblog/ghost/');
});

test('does correctly identify https as not-to-be-replaced', function(assert) {
    let result = sanitizeUrl('https://testblog.com/ghost-blogs/myblog/ghost/');
    assert.equal(result, 'https://testblog.com/ghost-blogs/myblog/ghost/');
});

module('Unit | Utility | isValidUrl');

test('Approves http://localhost:3000', function(assert) {
    assert.ok(isValidUrl('http://localhost:3000'));
});

test('Approves https://localhost:3000', function(assert) {
    assert.ok(isValidUrl('https://localhost:3000'));
});

test('Approves http://my.blog.com', function(assert) {
    assert.ok(isValidUrl('http://my.blog.com'));
});

test('Approves http://my.blog.com/ghost', function(assert) {
    assert.ok(isValidUrl('http://my.blog.com/ghost'));
});

test('Approves http://my.blog.com/ghost/', function(assert) {
    assert.ok(isValidUrl('http://my.blog.com/ghost/'));
});

test('Approves http://my.blog.com/ghost:3000', function(assert) {
    assert.ok(isValidUrl('http://my.blog.com/ghost:3000'));
});

test('Approves https://my.blog.com/ghost:3000', function(assert) {
    assert.ok(isValidUrl('https://my.blog.com/ghost:3000'));
});

test('Approves http://ghost.local:3000', function(assert) {
    assert.ok(isValidUrl('http://ghost.local:3000'));
});
