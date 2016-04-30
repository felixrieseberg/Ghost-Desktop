import Ember from 'ember';
import { setup as setupContextMenu } from '../utils/context-menu';

const {Route} = Ember;

export default Route.extend({
    windowMenu: Ember.inject.service(),
    preferences: Ember.inject.service(),

    beforeModel() {
        this.get('preferences').setupZoom();
        this.get('windowMenu').setup();
        setupContextMenu();
    },

    model() {
        return this.store.findAll('blog');
    }
});
