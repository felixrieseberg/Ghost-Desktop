import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gh-find-in-webview', 'Integration | Component | gh find in webview', {
  integration: true
});

test('it renders', function(assert) {
	  this.render(hbs`{{gh-find-in-webview}}`);

    const text = this.$().text().trim();
    const containsText = text.includes('Search');
    assert.ok(containsText);
});

test('it searches', function(assert) {
    const done = assert.async();
    const path = require('path');
    this.set('url', `file://${path.join(__dirname, 'tests', 'fixtures', 'static-content', 'content.html')}`);
	  this.render(hbs`{{gh-find-in-webview searchterm="running"}} <webview id="theView" src={{url}} />`);

    const webview = document.getElementById('theView');
    webview.addEventListener('found-in-page', (e) => {
      assert.ok(e.result);
      done();
    });
    webview.addEventListener('dom-ready', () => {
        this.$('button.gh-nav-search-button').click();
    });
});