import Ember from 'ember';
import {getBlogName} from '../utils/get-blog-name';

const {Component} = Ember;

export default Component.extend({
    store: Ember.inject.service(),
    classNames: ['gh-add-blog'],

    actions: {
        async addBlog() {
            let url = this.get('url');
            let pageUrl = url.replace(/\/ghost\//gi, '');
            let identification = this.get('identification');
            let name = await getBlogName(pageUrl);
            let record = this.get('store').createRecord('blog', {
                url,
                name,
                identification
            });

            record.setPassword(this.get('password'));
            record.save();
        }
    }
});
