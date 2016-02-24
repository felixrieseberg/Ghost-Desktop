import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gh-app', 'Integration | Component | gh app', {
    integration: true
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });"

    this.render(hbs`{{gh-app}}`);

    const text = this.$().text().trim();
    const containsText = text.includes('Before we get started, please tell us where to find your blog');
    assert.ok(containsText);
});
