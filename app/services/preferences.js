import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Service.extend({
    preferences: storageFor('preferences'),

    isNotificationsEnabled: Ember.computed.alias('preferences.isNotificationsEnabled'),
    contributors: Ember.computed.alias('preferences.contributors'),

    zoomFactor: Ember.computed({
        get() {
            return this.get('preferences.zoomFactor');
        },
        set(k, v) {
            let frame = require('web-frame');
            let setting = (v >= 50 && v <= 300) ? v : 100;

            frame.setZoomFactor(setting / 100);
            this.set('preferences.zoomFactor', setting);
        }
    }),

    setupContributors: function () {
        Ember.$.getJSON('contributors.json').then(
            (data) => this.set('preferences.contributors', data)
        );
    }.on('init'),

    setupZoom() {
        this.set('zoomFactor', this.get('zoomFactor'));
    }
});
