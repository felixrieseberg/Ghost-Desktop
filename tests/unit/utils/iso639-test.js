import getLanguageNames from 'ghost-desktop/utils/iso639';
import {module, test} from 'qunit';

module('Unit | Utility | ISO-639-1');

test('properly turns a ISO-639-1 key into a language object', function(assert) {
    let language = getLanguageNames('de');

    assert.deepEqual(language, {
        key: 'de',
        name: 'German',
		nativeName: 'Deutsch',
        label: 'German | Deutsch'
    });
});

test('returns for an unknown dialect with a known major language', function(assert) {
    let language = getLanguageNames('pt_BR');

    assert.equal(language.label, 'Portuguese (BR) | Português (BR)');
});

test('returns a simple label for an English language name', function(assert) {
    let language = getLanguageNames('en_GB');

    assert.equal(language.label, 'English (GB)');
});

test('returns even for something unknown', function(assert) {
    let language = getLanguageNames('00');

    assert.equal(language.label, '00');
});