'use strict';

/**
 * This file is being preloaded in Ghost Instances. It's a bit scripting like it's 1999 (just this file).
 * ⚠ Remember: No jQuery! ⚠
 */
const remote = require('electron').remote;

/**
 * Preload & Error Communication###############################################################################################
 * ############################################################################################################################
 */

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
 * Spellchecker & Context Menu ################################################################################################
 * ############################################################################################################################
 */

const webFrame = require('electron').webFrame;
const webContents = remote.getCurrentWebContents();
const SpellCheckProvider = require('electron-spell-check-provider');
const Menu = remote.Menu;
const template = [{
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
let selection;

/**
 * Returns a build context menu, including spelling suggestions
 *
 * @returns {Menu} - The built menu
 */
function buildMenu() {
    let buildTemplate = template.slice();
    buildTemplate.unshift({type: 'separator'});

    if (selection && selection.spellingSuggestions && selection.spellingSuggestions.length > 0) {
        selection.spellingSuggestions.reverse();

        selection.spellingSuggestions.forEach(function(suggestion) {
            buildTemplate.unshift({
                label: suggestion,
                /**
                 * (description)
                 */
                click() {
                    webContents.replaceMisspelling(suggestion);
                }
            });
        });
    }

    return Menu.buildFromTemplate(buildTemplate);
}

/**
 * Handles the "contextmenu" event
 *
 * @param e {MouseEvent}
 */
function handleContextMenu(e) {
    // Do nothing when there's no input nearby
    if (!e.target.closest('textarea, input, [contenteditable="true"]')) {
        return;
    };

    e.preventDefault();
    e.stopPropagation();

    let node = e.target;

    while (node) {
        if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
            let editorMenu = buildMenu();
            editorMenu.popup(remote.getCurrentWindow());
            break;
        }

        node = node.parentNode;
    }
}

/**
 * Reset's the current selection object
 */
function resetSelection() {
    selection = {
        isMisspelled: false,
        spellingSuggestions: []
    };
}

/**
 * Initiates the spellchecker
 */
function setupSpellChecker() {
    let locale = remote.require('app').getLocale() || 'en-US';

    console.log(`Spellchecking setup with locale ${locale}`);
    webFrame.setSpellCheckProvider(locale, true, new SpellCheckProvider(locale).on('misspelling',
        function(suggestions) {
            // Prime the context menu with spelling suggestions _if_ the user has selected text. Electron
            // may sometimes re-run the spell-check provider for an outdated selection e.g. if the user
            // right-clicks some misspelled text and then an image.
            if (window.getSelection().toString()) {
                selection.isMisspelled = true;
                // Take the first three suggestions if any.
                selection.spellingSuggestions = suggestions.slice(0, 3);
            }
        })
    );

    resetSelection();
}

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

/**
 * Init
 */
setTimeout(checkStatus, 100);
window.addEventListener('mousedown', resetSelection);
window.addEventListener('contextmenu', handleContextMenu);
setupSpellChecker();
setupLinkExternalizer();
