import Ember from 'ember';

const {Component} = Ember;

/**
 * The switcher component is a Slack-like quick switcher on the left side of
 * the app, allowing users to quickly switch between blogs.
 */
export default Component.extend({
    store: Ember.inject.service(),
    classNames: ['switcher'],

    didRender() {
        this._super(...arguments);
        this._setupContextMenu();
    },

    /**
     * In addition to the app-wide context menu, a context menu allowing
     * interaction with the blog below is setup.
     */
    _setupContextMenu() {
        let {remote} = requireNode('electron');
        let {Menu} = remote;
        let self = this;
        let selectedBlog = null;

        let removeTeamMenu = Menu.buildFromTemplate([{
            label: 'Remove Blog',
            click(item, focusedWindow) {
                if (selectedBlog) {
                    self.send('removeBlog', selectedBlog);
                }
            }
        }]);

        this.$()
            .off('contextmenu')
            .on('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();

                let node = e.target;

                while (node) {
                    if (node.classList && node.classList.contains('switch-btn')
                    && node.dataset && node.dataset.blog) {
                        selectedBlog = node.dataset.blog;
                        removeTeamMenu.popup(remote.getCurrentWindow());
                        break;
                    }

                    node = node.parentNode;
                }
            }
        );
    },

    actions: {
        switchToBlog(blog) {
            this.sendAction('switchToBlog', blog);
        },

        showAddBlog() {
            this.sendAction('showAddBlog');
        },

        removeBlog(id) {
            if (id) {
                this.get('store').findRecord('blog', id).then((result) => {
                    if (result) {
                        result.deleteRecord();
                        result.save();
                    }
                });
            }
        }
    }
});
