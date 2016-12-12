const {openUrlManager} = require('./open-url');

/**
 * Parses the command lin
 *
 * @param {Array} Array of command line arguments
 * @returns {boolean} True if a deeplink was found, false if not
 */
function parseArguments(argv) {
    const args = argv ? [...argv.slice(1)] : [...process.argv.slice(1)];
    const deepLink = args.find((arg) => /^ghost:\/\//.test(arg));

    if (deepLink) {
        openUrlManager.handleOpenUrlEvent(null, deepLink);
        return true;
    }

    return false;
}

module.exports = {parseArguments};
