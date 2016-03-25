import Ember from 'ember';

/**
 * Ensures that a given url is actually a Ghost signin page
 * @param  {string} url - Url for the blog
 * @return {Promise}
 */
export default function getIsGhost(url) {
    return new Promise((resolve, reject) => {
        if (!url) {
            return reject('Tried to getIsGhost without providing url');
        }

        Ember.$.get(url)
            .then((response) => {
                resolve((response.indexOf('name="application-name" content="Ghost"') > -1));
            })
            .fail((error) => reject(error));
    });
}
