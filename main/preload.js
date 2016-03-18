'use strict';

/**
 * This file is being preloaded in Ghost Instances.
 * ⚠ Remember: No jQuery! ⚠
 */
var remote = require('electron').remote;
var Menu   = remote.Menu;

var template = [{
    label: 'Undo',
    role: 'undo'
}, {
    label: 'Redo',
    role: 'redo'
}, {
    type: 'separator'
}, {
    label: 'Cut',
    role: 'cut'
}, {
    label: 'Copy',
    role: 'copy'
}, {
    label: 'Paste',
    role: 'paste'
}, {
    label: 'Select All',
    role: 'selectall'
}];
var editorMenu = Menu.buildFromTemplate(template);

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

/**
 * Setup the context menu
 */
function handleContextMenu(e) {
    // Do nothing when there's no input nearby
    if (!e.target.closest('textarea, input, [contenteditable="true"]')) {
        return;
    };

    e.preventDefault();
    e.stopPropagation();

    var node = e.target;

    while (node) {
        if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
            editorMenu.popup(remote.getCurrentWindow());
            break;
        }

        node = node.parentNode;
    }
}

/**
 * Init
 */
setTimeout(checkStatus, 100);
window.addEventListener('contextmenu', handleContextMenu);

/**
 * Cleanup
 */
remote = undefined;
Menu = undefined;