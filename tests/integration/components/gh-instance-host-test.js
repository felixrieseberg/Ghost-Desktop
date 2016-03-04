import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { blogs } from '../../fixtures/blogs';

moduleForComponent('gh-instance-host', 'Integration | Component | gh instance host', {
    integration: true
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });"

    this.render(hbs`{{gh-instance-host}}`);
    assert.equal(this.$().text().trim(), '');
});

test('it renders a blog', function(assert) {
    this.set('_blog', blogs[2]);
    this.render(`{{gh-instance-host blog=_blog}}`);

    //assert.equal(this.$('webview').attr('src'), blogs[2].url);
});
