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
