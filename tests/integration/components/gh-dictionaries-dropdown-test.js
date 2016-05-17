import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

let oldRequire;
let language;

//Stub location service
const preferencesStub = Ember.Service.extend({
    spellcheckLanguage: Ember.computed({
        get() {
            return language;
        },
        set(key, value) {
            language = value;
        }
    }),

    trigger() {
        // no-op
    }
});

moduleForComponent('gh-dictionaries-dropdown', 'Integration | Component | gh dictionaries dropdown', {
    integration: true,
    beforeEach() {
        oldRequire = window.requireNode;
        window.requireNode = function(target) {
            if (target === 'spellchecker') {
                return {
                    getAvailableDictionaries() {
                        return ['en', 'de', 'fr'];
                    }
                }
            } else {
                return oldRequire(target);
            }
        }

        this.register('service:preferences', preferencesStub);
        // Calling inject puts the service instance in the test's context,
        // making it accessible as "preferences" within each test
        this.inject.service('preferences', { as: 'preferences' });
    },
    afterEach() {
        window.requireNode = oldRequire;
    }
});

test('it renders', function (assert) {
    this.render(hbs`{{gh-dictionaries-dropdown}}`);

    const text = this.$().text().trim();
    const containsText = text.includes('Spellchecker Dictionary');

    assert.ok(containsText);
});

test('selecting a new dictionary updates preferences', function (assert) {
    this.render(hbs`{{gh-dictionaries-dropdown}}`);

    this.$('select').val('de').change();

    console.log(language);

    assert.equal(language, 'de');
});

