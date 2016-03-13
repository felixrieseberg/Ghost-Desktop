/**
 * Overwrite ember-cli-blanket's default reporter to just a write a file
 * directly from electron
 */
(function reportCoverage() {
    window.sendCoverage = function() {
        var fs = require('fs');
        var path = require('path');
        var file = path.resolve(__dirname, '..', '..', '..', 'coverage.json');
        var data = window._$blanket_coverageData;

        var output = {
            stats: data.stats,
            coverage: {
                total: {},
                files: []
            }
        };
        
        output.coverage.files = _.map(data.fileData, fileCoverage, this);
        output.coverage.total = totals(data, output.coverage.files, this.options);
        
        if (this.options.modulePattern) {
            output.coverage.modules = modulesCoverage(output.coverage.files, this.options);
        }
        
        fs.writeFileSync(file, JSON.stringify(output), 'utf8');
    };
}());

/**
 * Reporter functions below taken from ember-cli-blanket
 * https://github.com/sglanzer/ember-cli-blanket
 * 
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

var percentage = function(number, total) {
    return (Math.round(((number / total) * 100) * 100) / 100);
};

function totalProperty(fileData, propName) {
    return _(fileData).pluck(propName).reduce(function(memo, value) {
        return memo + value;
    }, 0);
}

function addPercentage(output) {
    output.percentage = percentage(output.statementsCovered, output.statementsTotal);
}

function sumProperty(aTotal, other, property) {
    return (aTotal[property] ? aTotal[property] : 0) + other[property];
}

var branchCoverage = function(fileData) {
    var branches = fileData.branchData;
    var totalBranches, passedBranches;
    totalBranches = passedBranches = 0;

    if (_.isArray(branches)) {
        for (var j = 0; j < branches.length; j++) {
            if (_.isArray(branches[j])) {
                for (var k = 0; k < branches[j].length; k++) {
                    if (_.isObject(branches[j][k])) {
                        totalBranches++;
                        if (_.isArray(branches[j][k][0]) &&
                            branches[j][k][0].length > 0 &&
                            _.isArray(branches[j][k][1]) &&
                            branches[j][k][1].length > 0) {
                            passedBranches++;
                        }
                    }
                }
            }
        }
        return {
            branchesTotal: totalBranches,
            branchesCovered: passedBranches
        };
    }
};

/*
 * Output coverage for a specific file
 */
var fileCoverage = function(data) {
    var output = {
        name: data.fileName
    };

    var statements = _.without(data.lines, null);

    output.statementsTotal = statements.length;
    output.statementsCovered = _.compact(statements).length;
    output.percentage = percentage(output.statementsCovered, output.statementsTotal);

    if (this.options.branchTracking) {
        output = _.assign(output, branchCoverage(data));
    }
    return output;

};

function totals(coverageData, fileCoverage, options) {
    var output = {
        statementsTotal: totalProperty(fileCoverage, 'statementsTotal'),
        statementsCovered: totalProperty(fileCoverage, 'statementsCovered')
    };
    addPercentage(output);
    if (options.branchTracking) {
        output.branchesTotal = totalProperty(fileCoverage, 'branchesTotal');
        output.branchesCovered = totalProperty(fileCoverage, 'branchesCovered');
    }
    return output;
}

function modulesCoverage(fileData, options) {
    var moduleRegex = new RegExp(options.modulePattern),
        output,
        collection = {};
    fileData.forEach(function(aFile) {
        var moduleName = aFile.name.match(moduleRegex)[1];
        var current = collection[moduleName] || { name: moduleName };

        current.statementsTotal = sumProperty(current, aFile, 'statementsTotal');
        current.statementsCovered = sumProperty(current, aFile, 'statementsCovered');

        if (options.branchTracking) {
            current.branchesTotal = sumProperty(current, aFile, 'branchesTotal');
            current.branchesCovered = sumProperty(current, aFile, 'branchesCovered');
        }
        collection[moduleName] = current;
    });

    output = _.values(collection);
    output.forEach(addPercentage);
    return output;
}
