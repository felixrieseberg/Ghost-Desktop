import Ember from 'ember';
import {getBlogName} from '../utils/get-blog-name';
import {getIsGhost} from '../utils/get-is-ghost';
import Phrases from '../utils/phrases';

const {Component} = Ember;

export default Component.extend({
    store: Ember.inject.service(),
    classNames: ['gh-add-blog'],
    isUrlGhost: true,

    hasError: Ember.computed('isIdentificationInvalid', 'isUrlInvalid', {
        get() {
            return (this.get('isIdentificationInvalid') || this.get('isUrlInvalid'));
        }
    }),

    validateUrlIsGhost() {
        return getIsGhost(this.get('url'))
            .then((is) => {
                this.set('isUrlInvalid', !is);

                if (!is) {
                    this.set('urlError', Phrases.urlNotGhost);
                }

                return is;
            })
            .catch((error) => {
                // We failed to reach the page, mark it as invalid
                this.set('isUrlInvalid', true);
                this.set('urlError', Phrases.urlNotReachable);
            });
    },

    actions: {
        async addBlog() {
            // Manually begin a run loop, since async/await is still
            // black magic as far as Ember is concerned
            Ember.run.begin();
            this.set('isSubmitting', true);

            let url = this.get('url');
            let pageUrl = url.replace(/\/ghost\//gi, '');
            let identification = this.get('identification');
            let isGhost = await this.validateUrlIsGhost();

            // If it is a Ghost blog, create the record
            if (isGhost) {
                let name = await getBlogName(pageUrl);
                let record = this.get('store').createRecord('blog', {
                    url,
                    name,
                    identification
                });

                record.setPassword(this.get('password'));
                record.save();
            }

            this.set('isSubmitting', false);
            Ember.run.end();
        },

        validateIdentification() {
            let identificationPattern = /[^@]+@[^@]+\.[^@]+/gi;
            let invalid = !identificationPattern.test(this.get('identification'));

            this.set('identificationError', invalid ? Phrases.identificationInvalid : null);
            this.set('isIdentificationInvalid', invalid);
        },

        validateUrl() {
            let urlPattern = /^http(s?)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]*(\/\S*)?/gi;
            let invalid = !urlPattern.test(this.get('url'));

            this.set('isUrlInvalid', invalid);
            this.set('urlError', invalid ? Phrases.urlInvalid : undefined);
        },

        validatePassword() {
            if (!this.get('password') || this.get('password').length < 1) {
                this.set('isPasswordInvalid', true);
            } else {
                this.set('isPasswordInvalid', false);
            }
        }
    }
});
