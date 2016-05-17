import { test, moduleForComponent } from 'ember-qunit';

moduleForComponent('gh-select-native', 'Unit | Component | gh select native', {
        unit: true
        // specify the other units that are required for this test
        // needs: ['component:foo', 'helper:bar']
    }
);

test('it renders', function(assert) {
    // creates the component instance
    let component = this.subject();

    assert.equal(component._state, 'preRender');

    // renders the component on the page
    this.render();
    assert.equal(component._state, 'inDOM');
});