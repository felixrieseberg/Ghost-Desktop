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
            .on('did-finish-load', () => this._handleLoaded())
            .off('new-window')
            .on('new-window', (e) => this._handleNewWindow(e));
    },

    _handleLoaded() {
        let keytar = requireNode('keytar');
        let $webview = this.$('webview')[0];
        let title = $webview.getTitle();

        if (title.includes('Sign In')) {
            let username = this.get('blog.username');
            let password = this.get('blog.password');
            console.log(username, password);
        } else {
            this.set('isInstanceLoaded', true);
        }
    },

    _handleNewWindow(e) {
        if (e && e.originalEvent && e.originalEvent.url) {
            requireNode('electron').shell.openExternal(e.originalEvent.url);
        }
    }
});
