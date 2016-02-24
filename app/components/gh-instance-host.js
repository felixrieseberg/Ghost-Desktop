import Ember from 'ember';

const {Component} = Ember;

export default Component.extend({
    classNames: ['instance-host'],
    isFocussed: true,

    didReceiveAttrs() {
        this._super(...arguments);
        this.set('isInstanceLoaded', false);
    },

    didRender() {
        this._super(...arguments);

        this.$('webview')
            .off('did-finish-load')
            .on('did-finish-load', () => {
                this.set('isInstanceLoaded', true);
            });
    }
});
