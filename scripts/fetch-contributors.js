"use strict";

const fetch = require('node-fetch');
const fs = require('fs');
const util = require('util');
const contributorsFilePath = 'public/contributors.json';

fs.stat(contributorsFilePath, (err, stats) => {
    if (err && err.code === 'ENOENT') {
        // File does not exist, move to fetch right away
        return fetchAndWriteContributorsFile();
    } else if (err) {
        throw err;
    };


    const mtime = new Date(util.inspect(stats.mtime));
    const maxAge = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));

    if (mtime < maxAge) {
        // File exists, but is too old
        console.log('Contributors file on disk, but older than 24 hours.')
        fetchAndWriteContributorsFile();
    }
});

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

/**
 * Fetch the contributors and write the result to disk
 */
function fetchAndWriteContributorsFile() {
    fs.access(contributorsFilePath, fs.F_OK | fs.R_OK | fs.W_OK, (error) => {
        if (!error) {
            console.log('Deleting existing contributors file');
            fs.unlinkSync(contributorsFilePath);
        }

        console.log('Fetching contributors');

        fetchContributors()
            .then((data) =>  {
                console.log('Building new contributor file\n');
                fs.writeFileSync(contributorsFilePath, JSON.stringify(data));
                console.log('Done');
            });
    });
}
