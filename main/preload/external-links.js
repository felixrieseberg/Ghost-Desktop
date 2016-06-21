'use strict';

/**
 * This method ensures that all links are set to "external"
 * If a user adds a link in markedown that doesn't have the
 * correct "target", the app *will* open it in the current
 * webview, which is obviously bad.
 *
 * This works together with a CSS animation, which is defined
 * in /public/assets/inject/css/all.css
 */
function setupLinkExternalizer() {
    function externalize(event) {
        if (event.animationName === 'linkInserted') {
            let t = event.target;

            if (t.href && t.href.indexOf(location.hostname) === -1) {
                t.setAttribute('target', '_blank');
            }
        }
    }

    document.addEventListener('webkitAnimationStart', externalize, false);
}

setupLinkExternalizer();
