import Ember from 'ember';

const {Component} = Ember;

export default Component.extend({
    classNames: ['instance-host'],
    classNameBindings: ['blog.isSelected:selected'],

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
            })
            .off('new-window')
            .on('new-window', (e) => {
                if (e && e.originalEvent && e.originalEvent.url) {
                    require('electron').shell.openExternal(e.originalEvent.url);
                }
            });
    }
});
