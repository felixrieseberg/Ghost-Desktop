'use strict';

let attempts = 100;
const betterUpgradeMessage =  'A new version of Ghost Core is available! Hot Damn. \
<a href="http://support.ghost.org/how-to-upgrade/" target="_blank">Click here</a> \
to learn more on upgrading Ghost Core.';

/**
 * Simple timeout + attempt based function that checks to see if Ghost Core has an update available,
 * and replaces the notification text with something a little more specific.';
 */
function upgradeNotification() {
    if (attempts === 0) {
        return;
    }

    let ghostCoreUpgradeAvailable = document.querySelector('aside.gh-alerts .gh-alert-content');

    if (ghostCoreUpgradeAvailable) {
        // The notification was found, replace the text.
        ghostCoreUpgradeAvailable.innerHTML = betterUpgradeMessage;
    } else {
        // Decrement the attempt count, and check again.
        attempts -= 1;
        setTimeout(upgradeNotification, 50);
    }
}

/**
 * Init
 */
setTimeout(upgradeNotification, 50);