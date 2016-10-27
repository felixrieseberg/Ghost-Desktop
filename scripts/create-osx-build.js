'use strict';

const lazyRequire = require('lazy-require');
const path = require('path');
const fs = require('fs');
const appdmg = lazyRequire('appdmg');
const sign = require('electron-osx-sign');

/**
 * Signs the application package in a way that hopefully
 * satisfies Apple.
 */
function signAppBundle() {
    const app = path.join(__dirname, '..', 'electron-builds/Ghost-darwin-x64/Ghost.app');
    const nm = path.join(app, 'Contents/Resources/app/node_modules');
    const platform = 'darwin';
    const identity = '6RKE5ET24A';
    const requirements = path.join(__dirname, '../assets/dmg/requirements');
    const binaries = [
        path.join(nm, 'keytar/Build/Release/keytar.node'),
        path.join(nm, 'spellchecker/Build/Release/hunspell.a'),
        path.join(nm, 'spellchecker/Build/Release/spellchecker.node')
    ];

    return new Promise((resolve, reject) => {
        sign({
            app,
            binaries,
            identity,
            platform,
            requirements
        }, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

function createDmg() {
    return new Promise((resolve, reject) => {
        // Create appdmg
        const source = path.join('.appdmg.json');
        const dir = path.join('electron-builds', 'Ghost-darwin-x64-dmg');
        const target = path.join(dir, 'ghost.dmg');

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const ee = appdmg({ source, target });

        ee.on('progress', (info) => {
            if (info.type === 'step-begin') {
                console.log(`Starting ${info.title}`);
            } else if (info.type === 'step-end') {
                console.log(`Finished with status "${info.status}"`);
            }
        });

        ee.on('finish', () => {
            console.log('Ghost Desktop sucessfully packaged - find the dmg in ./electron-builds/!');
            resolve();
        });

        ee.on('error', (err) => {
            console.log('Building the Ghost Desktop DMG failed:')
            console.log(err);
            reject();
        });
    });
}

function main() {
    if (appdmg instanceof Error) {
        console.log('Building Ghost Desktop for OS X requires appdmg.');
        console.log('Automatic installation was attempted, but failed.');
        console.log('\nYou can probably fix this error by running "npm install appdmg"\n');
        console.log(appdmg.stack);

        return;
    }

    signAppBundle().then(() => createDmg());
}

main();
