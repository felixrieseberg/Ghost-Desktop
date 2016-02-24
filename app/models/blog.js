import DS from 'ember-data';

const {Model, attr, hasMany} = DS;

export default DS.Model.extend({
    name: attr('string'),
    url: attr('string'),
    isSelected: attr('boolean')
});
