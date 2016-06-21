'use strict';

/**
 * Simple timeout function checking for
 * a) failed login
 * b) successful loaded
 */
function checkStatus() {
    let err    = document.querySelector('p.main-error');
    let loaded = document.querySelector('a[title="New Post"]');

    if (err && ((err.childElementCount && err.childElementCount > 0) || (err.textContent && err.textContent.length > 0))) {
        // Noooo, login errors!
        console.log(`login-error`);
    } else if (loaded) {
        // Yay, successfully loaded - let's give the renderer 200 more ms
        // for rendering
        setTimeout(() => console.log('loaded'), 200);
    } else {
        setTimeout(checkStatus, 100);
    }
}

/**
 * Init
 */
setTimeout(checkStatus, 100);
