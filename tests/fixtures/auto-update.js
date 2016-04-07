import Ember from 'ember';

export const autoUpdateMock = Ember.Service.extend({
    appVersion: '1.0.0',
    checkForUpdates() {},
    update() {}
 });