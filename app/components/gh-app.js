import Ember from 'ember';
import setWindowTitle from '../utils/set-window-title';
import setDockMenu from '../utils/set-dock-menu';
import setUsertasks from '../utils/set-user-tasks';
import getCurrentWindow from '../utils/get-current-window';
import {sanitizeUrl} from '../utils/sanitize-url';

const {Component, inject, computed, observer} = Ember;

export default Component.extend({
    store: inject.service(),
    autoUpdate: inject.service(),
    ipc: inject.service(),
    webviewShortcuts: inject.service(),
    classNameBindings: ['isMac:mac', 'isWindows:win',':gh-app'],
    isFindInViewActive: false,
    isMac: !!(process.platform === 'darwin'),
    isWindows: !!(process.platform === 'win32'),

    /**
     * Called when the attributes passed into the component have been updated.
     * Called both during the initial render of a container and during a rerender.
     * Can be used in place of an observer; code placed here will be executed
     * every time any attribute updates.
     */
    didReceiveAttrs() {
        this.setup();
        this.createSingleInstance();
        this.get('autoUpdate').checkForUpdates();
    },

    /**
     * Called when the element of the view has been inserted into the DOM.
     */
    didInsertElement() {
        const ipc = this.get('ipc');

        ipc.notifyReady();
        ipc.on('open-blog', (blogUrl) => this.handleOpenBlogEvent(blogUrl));
        ipc.on('create-draft', (details) => this.handleCreateDraftEvent(details));
    },

    /**
     * Open a blog. If it doesn't exist yet, open the "add blog" UI.
     *
     * @param {String} url
     */
    handleOpenBlogEvent(rawUrl) {
        const url = sanitizeUrl(rawUrl);
        const blogs = this.get('blogs');
        const matchedBlog = blogs ? blogs.find((b) => b.get('url') === url) : null;

        if (matchedBlog) {
            this.send('switchToBlog', matchedBlog);
        } else {
            this.send('showAddBlog', { url });
        }
    },

    handleCreateDraftEvent({title, content} = {title: '', content: ''}) {
        this.get('webviewShortcuts').openNewPost(true, {title, content});
    },

    /**
     * Boolean value that returns true if there are any blogs
     */
    hasBlogs: computed('blogs', function () {
        const b = this.get('blogs');
        return (b && b.content && b.content.length && b.content.length > 0);
    }),

    blogsObserver: observer('hasBlogs', function () {
        if (!this.get('hasBlogs')) this.send('showAddBlog');
    }),

    titleObserver: observer('title', function () {
        setWindowTitle(this.get('title'));
    }),

    /**
     * Setup method, determining which blog to display.
     */
    setup() {
        if (this.get('hasBlogs')) {
            this.send('switchToBlog', this.findSelectedBlog() || this.get('blogs.firstObject'));
            this.createMenus();
        } else {
            this.set('isEditBlogVisible', true);
        }
    },

    /**
     * Ensures Ghost runs as a single instance.
     */
    createSingleInstance() {
        const {remote} = requireNode('electron');
        const {app} = remote;

        if (!this.appWindow) this.appWindow = getCurrentWindow();

        const shouldQuit = app.makeSingleInstance(this.onInstanceCheck.bind(this));
        if (shouldQuit) app.quit();
    },

    /**
     * Checks if the instance was supplied with a blog url as a parameter, if so, switch to it.
     *
     * @param {Array} argv - Arguments used to start the instance
     * @param {string} workingDirectory - The working directory when the instance was created.
     */
    onInstanceCheck(argv) {
        if (argv.length >= 2) {
            const [ , url] = argv;
            const blog = this.get('blogs').find((blog) => blog.get('url') === url);

            if (blog) this.send('switchToBlog', blog);
        }

        if (this.appWindow) {
            if (this.appWindow.isMinimized()) this.appWindow.restore();
            this.appWindow.focus();
        }
    },

    /**
     * Gets the current blogs and creates the various menus.
     * On Windows: User Tasks (taskbar)
     * On OS X: Dock Menu
     * On all: Window Menu
     */
    createMenus() {
        const he = requireNode('he');
        const blogs = this.get('blogs');
        let menu = [];

        blogs.forEach((blog) => {
            menu.push({
                name: he.decode(blog.get('name')),
                callback: () => this.send('switchToBlog', blog)
            });
        });

        if (process.platform === 'darwin') setDockMenu(menu);
        if (process.platform === 'win32') setUsertasks(menu);
    },

    /**
     * Finds the first blog marked as "selected"
     *
     * @returns {Object|null} blog
     */
    findSelectedBlog() {
        if (!this.get('hasBlogs')) return null;

        return this.get('blogs').find((blog) =>  blog.get('isSelected'));
    },

    /**
     * Reloads the blogs from the local databse
     */
    refreshBlogs() {
        this.get('store').findAll('blog')
            .then((result) => {
                this.set('blogs', result);
                this.setup();
            });
    },

    /**
     * Sets the visibility of the preferences ui, the edit blog ui,
     * and the blogs.
     *
     * @param {Object}   [options={}] - Options object
     * @param {boolean}  [options.showBlog=true] - "Edit Blog" UI
     * @param {boolean}  [options.showPreferences=false] - "Preferences" UI
     * @param {DS.Model} [options.blog] - Blog to display
     */
    setScreenVisibility({showAddBlog = true, showPreferences = false, blog = null}) {
        const selectedBlog = this.get('selectedBlog');

        if ((!blog && selectedBlog) || (selectedBlog && blog && selectedBlog !== blog)) {
            selectedBlog.unselect();
        }

        if (blog) {
            blog.select();
            this.set('title', `Ghost - ${blog.get('name')}`);
            this.set('selectedBlog', blog);
        }

        this.setProperties({
            isPreferencesVisible: showPreferences,
            isEditBlogVisible: showAddBlog
        });
    },

    /**
     * Displays the "add blog" UI
     */
    showEditBlogUI() {
        this.setScreenVisibility({
            showAddBlog: true,
            showPreferences: false
        });
    },

    /**
     * Displays the "preferences" UI
     */
    showPreferencesUI() {
        this.setScreenVisibility({
            showAddBlog: false,
            showPreferences: true
        });
    },

    actions: {
        /**
         * Switches to a given blog
         *
         * @param {Object} blog - Blog to switch to
         */
        switchToBlog(blog) {
            if (blog) {
                this.setScreenVisibility({
                    showAddBlog: false,
                    showPreferences: false,
                    blog
                });
            }
        },

        /**
         * Clears the "blogToEdit" property, turning the
         * edit blog UI into an "add blog" UI
         */
        showAddBlog(preFillValues) {
            this.set('blogToEdit', undefined);
            this.set('preFillValues', preFillValues);
            this.showEditBlogUI();
        },

        /**
         * Sets the blogToEdit property to a given blog
         *
         * @param blog - Blog to edit
         */
        showEditBlog(blog, editWarning) {
            this.set('blogToEdit', blog);
            this.set('editWarning', editWarning);
            this.set('preFillValues', null);
            this.showEditBlogUI();
        },

        /**
         * Shows the preferences
         */
        showPreferences() {
            this.showPreferencesUI();
        },

        /**
         * Handles an added blog
         *
         * @param {Object} blog - Added blog
         */
        blogAdded(blog) {
            this.send('switchToBlog', blog);
        },

        /**
         * Handles the removal of a blog
         */
        blogRemoved() {
            this.refreshBlogs();
        }
    }
});
