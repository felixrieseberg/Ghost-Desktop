import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gh-preferences', 'Integration | Component | gh preferences', {
  integration: true
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });"

    this.render(hbs`{{gh-preferences}}`);

    const text = this.$().text().trim();
    const containsText = text.includes('Preferences');
    assert.ok(containsText);
});
