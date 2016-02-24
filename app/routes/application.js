import Ember from 'ember';
import setupMenu from '../utils/window-menu';

const {Route} = Ember;

export default Route.extend({
    beforeModel() {
        setupMenu();
    },

    model() {
        return this.store.findAll('blog');
    }
});
