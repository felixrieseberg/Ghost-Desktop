'use strict';
/**
 * This file provides a basic "is there a new version?" interface,
 * using GitHub as a backend. It's pretty basic and only intended
 * to warn users of the dev build to update.
 */

/**
 * Displays a simple "Thanks for using the dev build, please update" dialog
 */
function showUpdateDialog() {
    const dialog = require('electron').dialog;
    const shell = require('electron').shell;
    
    dialog.showMessageBox({
        type: 'warning',
        title: 'Update Available',
        message: 'Thank you for trying out the Ghost Developer Build. An updated version is now available. We heavily recommend updating - do you want to download it now?',
        buttons: ['Yes', 'Cancel']
    }, (response) => {
        if (reponse === 0) {
            shell.openExternal('https://github.com/TryGhost/Ghost-Desktop/releases');
        }
    });
}

/**
 * Pings GitHub for a small json file, warns if it contains 'updateRequested'
 */
function checkForUpdate() {
    const https = require('https');

    https.get('https://raw.githubusercontent.com/TryGhost/Ghost-Desktop/master/.github/devbuild.json', (response) => {
        let body = '';
        
        // Bail out if anything is fishy
        if (response.statusCode >= 400) {
            return;
        }
        
        response.on('data', (d) => body += d);
        response.on('end', () => {
            let parsedData;
                        
            try {
                parsedData = JSON.parse(body);
            } catch (e) {
                //no-up
            }
            
            if (parsedData && parsedData.updateRequested !== undefined) {
                console.log(`Update requested: ${parsedData.updateRequested}`);
                
                if (parsedData.updateRequested) {
                    showUpdateDialog();
                }
            }
        });
    }).on('error', (e) => {
        console.log(`Attempted to get Ghost Desktop releases, got error: ${e.message}`);
    });
}

module.exports = checkForUpdate;