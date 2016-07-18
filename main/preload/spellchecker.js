'use strict';

const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;
const webFrame = require('electron').webFrame;
const spellchecker = require('spellchecker');

const webContents = remote.getCurrentWebContents();
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
function setupSpellChecker(data) {
    // We expect the language in data
    let language = data || remote.require('app').getLocale() || 'en-US';

    spellchecker.setDictionary(data);
    console.log(`Spellchecking setup with locale ${language}`);

    webFrame.setSpellCheckProvider(language, false, {
        spellCheck(text) {
            let textIsMisspelled = spellchecker.isMisspelled(text);

            if (textIsMisspelled && window.getSelection().toString()) {
                // Prime the context menu with spelling suggestions _if_ the user has selected text. Electron
                // may sometimes re-run the spell-check provider for an outdated selection e.g. if the user
                // right-clicks some misspelled text and then an image.
                selection.isMisspelled = true;
                selection.spellingSuggestions = spellchecker.getCorrectionsForMisspelling(text).slice(0, 3);
            }

            return !textIsMisspelled;
        }
    });

    resetSelection();
}

/**
 * Handles pasting, temporarily disabling spellcheck to speed things up
 * @param {PasteEvent} e
 */
function handlePaste(e) {
    if (e.target && e.target.id && e.target.spellcheck) {
        const elem = document.getElementById(e.target.id);
        elem.setAttribute('spellcheck', false);

        window.requestIdleCallback(function () {
            elem.setAttribute('spellcheck', true);
        })
    }
}

function setup() {
    window.addEventListener('mousedown', resetSelection);
    window.addEventListener('contextmenu', handleContextMenu);
	window.addEventListener('paste', handlePaste);

    ipc.on('spellchecker', (sender, data) => setupSpellChecker(data));
}

setup();
