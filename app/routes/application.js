import Ember from 'ember';
import { setup as setupWindowMenu } from '../utils/window-menu';
import { setup as setupContextMenu } from '../utils/context-menu';
import config from '../config/environment';

const {Route} = Ember;

export default Route.extend({
    beforeModel() {
        setupWindowMenu();
        setupContextMenu();
    },

    model() {
        return this.store.findAll('blog');
    }
});
