import Ember           from 'ember';
import {getBlogName}   from '../utils/get-blog-name';
import {getIsGhost}    from '../utils/get-is-ghost';
import {sanitizeUrl}   from '../utils/sanitize-url';
import Phrases         from '../utils/phrases';

const {Component} = Ember;

export default Component.extend({
    store: Ember.inject.service(),
    classNames: ['gh-edit-blog'],

    /**
     * A boolean value that is true if any errors are present
     */
    hasError: Ember.computed('isIdentificationInvalid', 'isUrlInvalid', 'isPasswordInvalid', {
        get() {
            let identification = this.get('isIdentificationInvalid');
            let url = this.get('isUrlInvalid');
            let password = this.get('isPasswordInvalid');
            return (identification || url || password);
        }
    }),

    /**
     * If we received a blog, setup the properties on this baby
     */
    didReceiveAttrs() {
        if (this.get('blog')) {
            let blog = this.get('blog');
            this.setProperties({
                url: blog.get('url'),
                identification: blog.get('identification'),
                password: blog.getPassword()
            });
        }
    },

    /**
     * Validates that the passed url is actually a Ghost login page,
     * displaying errors if it isn't.
     *
     * @param url - Url to checl
     * @returns {Promise}
     */
    _validateUrlIsGhost(url = '') {
        return getIsGhost(url)
            .then((is) => {
                this.set('isUrlInvalid', !is);

                if (!is) {
                    this.set('urlError', Phrases.urlNotGhost);
                }

                return is;
            })
            .catch(() => {
                // We failed to reach the page, mark it as invalid
                this.set('isUrlInvalid', true);
                this.set('urlError', Phrases.urlNotReachable);
            });
    },

    /**
     * Attempts to find DS record for a given url,
     * return null if nothing is found.
     *
     * @param {string} [url='']
     * @returns {Promise}
     */
    _ensureSingleRecord(url = '') {
        return new Promise((resolve) => {
            this.get('store')
                .findAll('blog')
                .then((blogs) => {
                    if (!blogs || !blogs.content || blogs.length === 0) {
                        // Nothing found? That's cool, too
                        resolve(null);
                    }

                    // Resolve with the first blog that has the same url,
                    // or undefined
                    resolve(blogs.find((b) => (b.get('url') === url)));
                })
                .catch(() => resolve(null));
        });
    },

    /**
     * Creates a blog record, if it doesn't already exists
     *
     * @param {string} [url=''] Url
     * @param {string} [name=''] Name
     * @param {string} [identification=''] Identification
     * @returns {Promise} - Resolves with a blog record
     */
    _createBlogIfNotExists(url = '', name = '', identification = '') {
        return new Promise(async (resolve) => {
            let record = this.get('blog') || await this._ensureSingleRecord(url);

            if (!record) {
                // If the blog doesn't already exist, create it
                record = this.get('store').createRecord('blog', {url});
            }

            record.setProperties({
                url,
                name,
                identification
            });

            // Set the password in an extra step, because it's a native call
            record.setPassword(this.get('password'));
            record.save().then((savedBlog) => resolve(savedBlog));
        });
    },

    actions: {
        /**
         * Add's a blog, using the input given by the user
         */
        async addOrEditBlog() {
            // Manually begin a run loop, since async/await is still
            // black magic as far as Ember is concerned
            Ember.run.begin();
            this.set('isSubmitting', true);

            let url = sanitizeUrl(this.get('url'));
            let identification = this.get('identification');
            let isUrlGhost = await this._validateUrlIsGhost(url);

            if (isUrlGhost) {
                let name = await getBlogName(url);

                this._createBlogIfNotExists(url, name, identification)
                    .then((record) => this.sendAction('blogAdded', record));
            }

            this.set('isSubmitting', false);
            Ember.run.end();
        },

        /**
         * Validates the identification entered by the user. It should be an email.
         */
        validateIdentification(input) {
            let identificationPattern = /[^@]+@[^@]+\.[^@]+/gi;
            let invalid = !identificationPattern.test(input);

            this.set('identificationError', invalid ? Phrases.identificationInvalid : null);
            this.set('isIdentificationInvalid', invalid);
        },

        /**
         * Validates the url given by the user. It should be a properly formatted url.
         */
        validateUrl(input) {
            let urlPattern = /^http(s?)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]*(\/\S*)?/gi;
            let invalid = !urlPattern.test(sanitizeUrl(input));

            this.set('isUrlInvalid', invalid);
            this.set('urlError', invalid ? Phrases.urlInvalid : undefined);
        },

        /**
         * Validates the password given by the user. It should not be empty.
         */
        validatePassword(input) {
            this.set('isPasswordInvalid', (!input || input.length < 1));
        }
    }
});
