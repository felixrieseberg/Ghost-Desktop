import getBlogName from 'ghost-desktop/utils/get-blog-name';
import { module, test } from 'qunit';

module('Unit | Utility | get blog name');

test('it get\'s the name of a blog', function(assert) {
    let path = requireNode('path');

    return getBlogName(path.join('..', '..', 'tests', 'fixtures', 'static-signin', 'signin.html'))
        .then((title) => {
            assert.equal(title, 'Sign In - Felix Rieseberg');
        });
});

test('rejects the promise if called without a parameter', function(assert) {
    return getBlogName()
        .catch((err) => {
            assert.ok(err);
        });
});

test('rejects the promise if the url is not reachable', function(assert) {
    return getBlogName('/nil/')
        .catch((err) => {
            assert.ok(err);
        });
});

test(`removes an ending 'ghost' from the given url`, function(assert) {
    // Forgive me for the url, I just need a stable website
    return getBlogName('http://bing.com/ghost/')
        .then((title) => {
            assert.equal(title, 'Bing');
        });
});