/**
 * Overwrite ember-cli-blanket's default reporter to just a write a file
 * directly from electron
 */
(function reportCoverage() {
    window.sendCoverage = function() {
        var fs = require('fs');
        var path = require('path');
        var jsonFile = path.resolve(__dirname, '..', '..', '..', 'coverage.json');
        var lcovFile = path.resolve(__dirname, '..', '..', '..', 'coverage.lcov');
        var data = window._$blanket_coverageData;

        // JSON
        var jsonOutput = reportJSON(data);
        var lcovOutput = reportLCOV(data);

        fs.writeFileSync(jsonFile, JSON.stringify(jsonOutput), 'utf8');
        fs.writeFileSync(lcovFile, lcovOutput, 'utf8');
    };
} ());

function reportJSON(coverageData) {
    var output = {
        stats: coverageData.stats,
        coverage: {
            total: {},
            files: []
        }
    };

    output.coverage.files = _.map(coverageData.fileData, fileCoverage, this);
    output.coverage.total = totals(coverageData, output.coverage.files, this.options);

    if (this.options.modulePattern) {
        output.coverage.modules = modulesCoverage(output.coverage.files, this.options);
    }

    return output;
}

function reportLCOV(coverageData) {
    if (
        !coverageData
        || !coverageData.fileData
        || !coverageData.fileData.map
    ) { return; }

    var data = coverageData.fileData.map(lcovRecord, this);
    return data.join('\n');
}

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

    /**
     * Felix Hack: The reports counted lines that were hit.
     * This code is therefore changed.
     */

    var statements = _.without(data.lines, null);
    statements = _.without(statements, undefined);

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

var lcovRecord = function(data) {
    var str = '',
        lineHandled = 0,
        lineFound = 0,
        fileName = data.fileName;

    /**
     * Felix Hack: Replacing the filename to ensure that Codecov knows what's happening
     */

    fileName = fileName.replace('ghost-desktop', 'app');
    fileName = fileName + '.js';

    if (this.options.cliOptions && this.options.cliOptions.lcovOptions && this.options.cliOptions.lcovOptions.renamer) {
        fileName = this.options.cliOptions.lcovOptions.renamer(fileName);
    }

    // Skip entries with falsy filenames -- lets ignoring files from renamer
    if (!fileName) { return; }

    // Skip non-existent files if lcovOptions.excludeMissingFiles is set
    if (this.options.cliOptions && this.options.cliOptions.lcovOptions && this.options.cliOptions.lcovOptions.excludeMissingFiles) {
        try {
            fs.accessSync(fileName, fs.F_OK);
        } catch (e) {
            return;
        }
    }

    str += 'SF:' + fileName + '\n';
    data.lines.forEach(function(value, num) {
        if (value !== null) {
            str += 'DA:' + num + ',' + value + '\n';
            lineFound += 1;
            if (value > 0) {
                lineHandled += 1;
            }
        }
    });

    str += 'LF:' + lineFound + '\n';
    str += 'LH:' + lineHandled + '\n';
    str += 'end_of_record';
    return str;
};