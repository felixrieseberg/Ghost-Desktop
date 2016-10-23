const tmp = require('tmp');
const path = require('path');
const sign = require('electron-osx-sign');
const fs = require('fs-extra');
const replace = require('replace-in-file')
const package = require('../package.json');

function main() {
  tmp.setGracefulCleanup();

  replacePlists();
  signAppBundle().then(() => console.log('All done!'))
}

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
  const platform = 'mas';

  return new Promise((resolve, reject) => {
    sign({
      app,
      binaries,
      platform,
      entitlements,
      'entitlements-inherit': entitlementsInherit
    }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function replacePlists() {
  const tmpFolder = tmp.dirSync().name;
  const appFolder = path.join(__dirname, '..', 'electron-builds/Ghost-x64-mas/Ghost.app');
  const assetFolder = path.join(__dirname, '..', 'assets/mas')
  const appPlist = {
    from: path.join(tmpFolder, 'app-contents-info.plist'),
    to: path.join(appFolder, '/Contents/Info.plist')
  };
  const helperPlist = {
    from: path.join(tmpFolder, 'helper-contents-info.plist'),
    to: path.join(appFolder, '/Contents/Frameworks/Ghost Helper.app/Contents/Info.plist')
  };
  const files = `${tmpFolder}/**/*`;

  fs.copySync(assetFolder, tmpFolder);
  replace.sync({files, replace: '${CFBundleVersion}', with: package.version});
  replace.sync({files, replace: '${CFBundleShortVersionString}', with: package.build});
  fs.copySync(helperPlist.from, helperPlist.to);
  fs.copySync(appPlist.from, appPlist.to);
}

main();
