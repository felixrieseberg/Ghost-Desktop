'use strict';

function getBetterUpgradeMessage(foundVersion) {
    let version = (foundVersion && foundVersion[1]) ? `(${foundVersion[1]}) ` : '';
    return `A new version of Ghost Core ${version}is available! Hot Damn. \
<a href="http://support.ghost.org/how-to-upgrade/" target="_blank">Click here</a> \
to learn more on upgrading Ghost Core.`;
}

/**
 * Simple timeout + attempt based function that checks to see if Ghost Core has an update available,
 * and replaces the notification text with something a little more specific.';
 */
function upgradeNotification(attempts = 100) {
    const elements = document.querySelectorAll('aside.gh-alerts .gh-alert-content');

    elements.forEach((element) => {
        let foundVersion = /Ghost (\d\.\d\.\d) is available/g.exec(element.innerText);
        element.innerHTML = getBetterUpgradeMessage(foundVersion);
    });

    if (elements.length === 0 && attempts > 0) {
        setTimeout(() => upgradeNotification(attempts - 1), 50);
    }
}

/**
 * Init
 */
document.addEventListener('DOMContentLoaded', () => setTimeout(upgradeNotification, 50));