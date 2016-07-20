import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gh-basic-auth', 'Integration | Component | gh basic auth', {
  integration: true
});

test('it does not render if not enabled', function(assert) {
  this.render(hbs`{{gh-basic-auth}}`);
  assert.equal(this.$().text().trim(), '');
});

test('it renders if enabled', function(assert) {
  this.render(hbs`{{gh-basic-auth isEnabled=true}}`);

  let isRendered = this.$().text().trim().includes('HTTP authentication')
  assert.equal(isRendered, true);
});

