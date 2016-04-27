import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Service.extend({
    preferences: storageFor('preferences'),

    isNotificationsEnabled: Ember.computed.alias('preferences.isNotificationsEnabled'),
    contributors: Ember.computed.alias('preferences.contributors'),

    setupContributors: function () {
        Ember.$.getJSON('contributors.json').then(
            (data) => this.set('preferences.contributors', data)
        );
    }.on('init')
});
