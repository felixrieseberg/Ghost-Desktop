import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const browserWindow = requireNode('electron').remote.getCurrentWindow();

moduleForComponent('gh-win-titlebar', 'Integration | Component | gh win titlebar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{gh-win-titlebar}}`);

  assert.ok(this.$('button[title="Minimize"]'));
});

test('minimizes the window', function(assert) {
  this.render(hbs`{{gh-win-titlebar}}`);

  this.$('button[title="Minimize"]').click();

  assert.ok(browserWindow.isMinimized())
});

test('maximizes the window', function(assert) {
  this.render(hbs`{{gh-win-titlebar}}`);

  this.$('button[title="maximize"]').click();

  assert.ok(browserWindow.isMaximized())
});

test('unmaxizimes the window', function(assert) {
  this.render(hbs`{{gh-win-titlebar}}`);

  this.$('button[title="unmaximize"]').click();

  assert.equal(browserWindow.isMaximized(), false)
});
