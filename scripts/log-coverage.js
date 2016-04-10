'use strict';

/**
 * Little helper script that logs the coverage to console
 */

const report = require('../coverage.json');

if (!report) {
    return console.log('Coverage report not found');
}

if (report.coverage && report.coverage.total) {
    const total = report.coverage.total;

    console.log(`Total statements:   ${total.statementsTotal}`);
    console.log(`Covered statements: ${total.statementsCovered}`);
    console.log(`--------------------------------------`)
    console.log(`Percentage: ${total.percentage}%`);
    console.log(`--------------------------------------`);
}