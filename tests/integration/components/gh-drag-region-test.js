import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gh-drag-region', 'Integration | Component | gh drag region', {
    integration: true
});

test('it renders', function (assert) {
    this.render(hbs`{{gh-drag-region}}`);

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(hbs`
    {{#gh-drag-region}}
      template block text
    {{/gh-drag-region}}
  `);

    assert.equal(this.$().text().trim(), 'template block text');
});

