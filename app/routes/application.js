import Ember from 'ember';
import { setup as setupContextMenu } from '../utils/context-menu';

const {Route} = Ember;

export default Route.extend({
    windowMenu: Ember.inject.service(),
    
    beforeModel() {
        this.get('windowMenu').setup();
        setupContextMenu();
    },

    model() {
        return this.store.findAll('blog');
    }
});
