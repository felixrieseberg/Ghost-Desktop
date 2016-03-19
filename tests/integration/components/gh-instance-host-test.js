import { moduleForComponent, test } from 'ember-qunit';
import { blogs } from '../../fixtures/blogs';
import hbs from 'htmlbars-inline-precompile';

/**
 * Test Preparation
 */

moduleForComponent('gh-instance-host', 'Integration | Component | gh instance host', {
    integration: true
});

/**
 * Tests
 */

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });"

    this.render(hbs`{{gh-instance-host}}`);
    assert.equal(this.$().text().trim(), '');
});