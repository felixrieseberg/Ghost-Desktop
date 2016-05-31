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

test('sets zoom factor', function(assert) {
    this.render(hbs`{{gh-preferences}}`);

    this.$('input#zoomFactor').val(120);
    this.$('input#zoomFactor').change();

    Ember.run(() => {
      this.$('button:contains("Set Zoom")').click();

      const frame = require('electron').webFrame;
      const zf = frame.getZoomFactor();

      assert.equal(zf, 1.2);
    });
});

test('resets zoom factor', function(assert) {
    this.render(hbs`{{gh-preferences}}`);

    this.$('input#zoomFactor').val(120);
    this.$('input#zoomFactor').change();

    Ember.run(() => {
      this.$('button:contains("Reset")').click();

      const frame = require('electron').webFrame;
      const zf = frame.getZoomFactor();

      assert.equal(zf, 1);
    });
});
