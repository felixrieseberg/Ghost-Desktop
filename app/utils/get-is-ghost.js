import Ember from 'ember';

/**
 * Ensures that a given url is actually a Ghost signin page
 * @param  {string} url - Url for the blog
 * @return {Promise}
 */
export default function getIsGhost(url, auth) {
    return new Promise((resolve, reject) => {
        if (!url) {
            return reject('Tried to getIsGhost without providing url');
        }

        let options = {url};

        if (auth && (auth.basicUsername || auth.basicPassword)) {
            options.username = auth.basicUsername;
            options.password = auth.basicPassword;
        }

        Ember.$.ajax(options)
            .then((response) => {
                resolve((response.indexOf('name="application-name" content="Ghost"') > -1));
            })
            .fail((error) => reject(error));
    });
}
