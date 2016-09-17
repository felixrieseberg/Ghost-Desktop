import Ember from 'ember';

export default Ember.Component.extend({
    classNameBindings: ['isDraggable:is-draggable:is-not-draggable', ':drag-region'],
    attributeBindings: ['style'],
    style: Ember.computed('isDraggable', function() {
        return Ember.String.htmlSafe(`width: ${this.get('width')}; height: ${this.get('height')};`);
    }),
    isDraggable: true
});
