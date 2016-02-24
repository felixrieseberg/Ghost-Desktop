import { moduleForModel, test } from 'ember-qunit';

moduleForModel('blog', 'Unit | Model | blog', {
    needs: []
});

test('it exists', function(assert) {
    let model = this.subject();
    assert.ok(!!model);
});
