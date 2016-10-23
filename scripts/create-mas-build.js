const tmp = require('tmp');
const path = require('path');
const sign = require('electron-osx-sign');
const flat = require('electron-osx-sign').flat;
const fs = require('fs-extra');
const replace = require('replace-in-file')
const package = require('../package.json');

const app = path.join(__dirname, '..', 'electron-builds', 'Ghost-mas-x64', 'Ghost.app');
const platform = 'mas';
const identity = '6RKE5ET24A';

function main() {
    tmp.setGracefulCleanup();

    signAppBundle()
        .then(() => createPkg())
        .then(() => console.log('All done!'))
        .catch((err) => console.error(err));
}

/**
 * Signs the application package in a way that hopefully
 * satisfies Apple.
 */
function signAppBundle() {
    const app = path.join(__dirname, '..', 'electron-builds/Ghost-mas-x64/Ghost.app');
    const nm = path.join(app, 'Contents/Resources/app/node_modules');
    const binaries = [
        path.join(nm, 'keytar/Build/Release/keytar.node'),
        path.join(nm, 'spellchecker/Build/Release/hunspell.a'),
        path.join(nm, 'spellchecker/Build/Release/spellchecker.node')
    ];
    const entitlements = path.join(__dirname, '..', 'assets/mas/app-store-parent.plist');
    const entitlementsInherit = path.join(__dirname, '..', 'assets/mas/app-store-child.plist');

    return new Promise((resolve, reject) => {
        sign({
            app,
            binaries,
            identity,
            platform,
            entitlements,
            'entitlements-inherit': entitlementsInherit
        }, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

/**
 * Creates a valid pkg file
 */
function createPkg() {
    return new Promise((resolve, reject) => {
        const pkg = path.join(__dirname, '..', 'electron-builds', 'Ghost-mas-x64', 'Ghost.pkg');

        flat({app, identity, platform, pkg}, function done(err) {
            if (err) return reject(err);
            resolve();
        })
    })
}

/**
 * Currently not used.
 */
function replacePlists() {
    const tmpFolder = tmp.dirSync().name;
    const assetFolder = path.join(__dirname, '..', 'assets/mas')
    const appPlist = {
        from: path.join(tmpFolder, 'app-contents-info.plist'),
        to: path.join(app, '/Contents/Info.plist')
    };
    const helperPlist = {
        from: path.join(tmpFolder, 'helper-contents-info.plist'),
        to: path.join(app, '/Contents/Frameworks/Ghost Helper.app/Contents/Info.plist')
    };
    const files = `${tmpFolder}/**/*`;

    fs.copySync(assetFolder, tmpFolder);
    replace.sync({ files, replace: '${CFBundleVersion}', with: package.version });
    replace.sync({ files, replace: '${CFBundleShortVersionString}', with: package.build });
    fs.copySync(helperPlist.from, helperPlist.to);
    fs.copySync(appPlist.from, appPlist.to);
}

main();
