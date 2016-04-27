'use strict';

const fs = require('fs');
const fetchContributors = require('./fetch-contributors');

let contributorsFilePath = 'public/contributors.json';

console.log("Deleting existing contributor file");

fs.access(contributorsFilePath, fs.F_OK | fs.R_OK | fs.W_OK, function (error) {
    if (!error) {
        // Delete the contributor file if it exists.
        fs.unlinkSync(contributorsFilePath);
    }

    console.log("Fetching contributors");
    fetchContributors().then(function (data) {
        console.log("Building new contributor file\n");

        let contributorData = JSON.stringify(data);
        fs.writeFileSync(contributorsFilePath, contributorData);

        console.log("Done");
    });

});
