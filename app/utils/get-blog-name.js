import Ember from 'ember';

/**
 * Get's the blog name for a given blog url
 * @param  {string} url - Url for the blog
 * @return {Promise}
 */
export default function getBlogName(url) {
    return new Promise((resolve, reject) => {
        if (!url) {
            return reject('Tried to getBlogName without providing url');
        }

        if (url.slice(-7) === '/ghost/') {
            url = `${url.slice(0, url.length - 7)}/`;
        }

        Ember.$.get(url)
            .then((response) => {
                let titleResult = response.match('<title>(.*)</title>');
                let title = (titleResult && titleResult.length > 1) ? titleResult[1] : url;

                resolve(title);
            })
            .fail((error) => reject(error));
    });
}
