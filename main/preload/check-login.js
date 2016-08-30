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
 * We defer to the actual click on the login button
 * before we check whether or not the login actually
 * succeeded
 */
function init() {
    const element = document.querySelector('button.login');

    if (element) {
        element.off('click');
        element.on('click', () => {
            console.log('login-check-again');
            setTimeout(checkStatus, 100);
        });
    } else {
        setTimeout(init, 100);
    }
}

/**
 * Init
 */
setTimeout(init, 100);