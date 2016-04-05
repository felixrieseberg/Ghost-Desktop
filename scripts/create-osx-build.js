'use strict';

const lazyRequire = require('lazy-require');
const path = require('path');
const fs = require('fs');
const appdmg = lazyRequire('appdmg');

if (appdmg instanceof Error) {
    console.log('Building Ghost Desktop for OS X requires appdmg.');
    console.log('Automatic installation was attempted, but failed.');
    console.log('\nYou can probably fix this error by running "npm install appdmg"\n');
    console.log(appdmg.stack);

    return;
}

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
});

ee.on('error', (err) => {
    console.log('Building the Ghost Desktop DMG failed:')
    console.log(err);
});