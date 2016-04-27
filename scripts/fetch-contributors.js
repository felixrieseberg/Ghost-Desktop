"use strict";

const fetch = require('node-fetch');

/**
 * Helpers
 */

/**
 * Fetch the name for a contributor
 *
 * @param contributor - Contributor object
 * @returns {Promise}
 */
function fetchName(contributor) {
    return new Promise((resolve) => {
        if (!contributor.api) {
            resolve(contributor.login);
        }

        fetch(contributor.api)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data && data.name) {
                    resolve(data.name);
                }
            })
            .catch(() => resolve(contributor.login));
    });
}

/**
 * Fetch the names for an array of contributors
 *
 * @param contributors - Array of contributor
 * @returns {Promise}
 */
function fetchNames(contributors) {
    return new Promise((resolve) => {
        let withNames = contributors;
        let promises = [];

        contributors.forEach((contributor, i) => {
            /**
             * (description)
             *
             * @param name (description)
             */
            let nameFetcher = fetchName(contributor)
                .then((name) => {
                    withNames[i].name = name;
                });

            promises.push(nameFetcher);
        });

        Promise.all(promises).then(() => resolve(withNames));
    });
}

/**
 * (description)
 *
 * @export
 * @returns {Promise}
 */
function fetchContributors() {
    return new Promise((resolve) => {
        let url = 'https://api.github.com/repos/TryGhost/Ghost-Desktop/contributors';
        let contributors = [];

        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data && data.forEach) {
                    data.forEach((contributor) => {
                        /* jscs: disable */
                        contributors.push({
                            url: contributor.html_url,
                            api: contributor.url,
                            login: contributor.login
                        });
                        /* jscs: enable */
                    });
                }

                return fetchNames(contributors);
            })
            .then((dataWithNames) => resolve(dataWithNames))
            .catch(() => resolve());
    });
}

module.exports = fetchContributors;
