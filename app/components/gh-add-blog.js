import Ember from 'ember';

const {Component} = Ember;

export default Component.extend({
    store: Ember.inject.service(),
    classNames: ['gh-add-blog'],

    getBlogName(url) {
        return new Promise((resolve, reject) => {
            if (!url) {
                return reject('Tried to getBlogName without providing url');
            }

            let blogUrl = url.replace(/\/ghost/gi, '');

            Ember.$.get(blogUrl)
                .then((response) => {
                    let titleResult = response.match('<title>(.*)</title>');
                    let title = (titleResult && titleResult.length > 1) ? titleResult[1] : blogUrl;

                    resolve(title);
                })
                .fail((error) => reject(error));
        });
    },

    actions: {
        async addBlog() {
            let url = this.get('url');
            let name = await this.getBlogName(url);
            let record = this.get('store').createRecord('blog', {
                url,
                name
            });

            record.save();
        }
    }
});
