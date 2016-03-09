'use strict';

/**
 * This file is being preloaded in Ghost Instances.
 * ⚠ Remember: No jQuery! ⚠
 */

/**
 * Simple timeout function checking for 
 * a) failed login
 * b) successful loaded
 */
function checkStatus() {
    var err = document.querySelector('p.main-error');
    var loaded = document.querySelector('a[title="New Post"]');
    
    
    if (err && ((err.childElementCount && err.childElementCount > 0) || (err.textContent && err.textContent.length > 0))) {
        // Noooo, login errors!
        console.log(`login-error`)
    } else if (loaded) {
        // Yay, successfully loaded
        console.log('loaded');
    } else {
        setTimeout(checkStatus, 100);
    }
}

setTimeout(checkStatus, 100);