# Creating Builds
While you can always run the current source code with `npm start` or `ember electron`, creating a production build involves a few steps to ensure that everything is setup correctly. We aim to automate builds as much as possible, so these instructions should ideally always boil down to only a few grunt tasks.

## Windows
`npm run installer`, executed from a Windows machine. This will build both 32- and 64-bit versions. Currently, we only release 32-bit versions for Windows - to just build that version, run `npm run installer-32`. To enable code-signing, set the environment variables `CODESIGN_CERTIFICATE` (path to your PFX code signing certifcate) and `CODESIGN_PASSWORD` (password for said certificate). Ensure that your machine [is setup for development and has native build tools](developer-environment.md).

The command will first build the ember app using `ember electron:package`, and then use Atom's Windows-Installer tools to create a Squirrel-compatible installer. Once done, find the installer file in `electron-builds/Ghost-win32-installer`.

## Mac OS X
`npm run dmg`, executed from a Mac OS X machine. Ensure that your machine [is setup for development and has native build tools](developer-environment.md). 

The command will first build the ember app using `ember electron:package`, and then use `appdmg` and some Python to create dmg image. Once done, find the dmg file in `electron-builds/Ghost-darwin64-installer`.

## Debian
`npm run debian`, executed from a Ubuntu machine. Ensure that your machine [is setup for development and has native build tools](developer-environment.md). 

# Creating Alpha/Beta Releases
Simply create a GitHub release semver-tagged (`0.5.2-alpha-0` - make sure to identify the version of your alpha (0,1, whatever). Then, to test the auto-updater, set the environment variable `GHOST_UPDATER_URL` to `http://desktop-updates.ghost.org/update/osx/0.5.2-alpha`, adjusting for your version and release channel. Then, launch Ghost - the updater service will overwrite the usual updater feed with your new url, hopefully find the new alpha version, and start the automatic update.

To test the updater service, the expected result of calling your service should look like this:

```
{
    "url":"http://desktop-updates.ghost.org/download/version/0.5.2-alpha-1/osx_64?filetype=zip",
    "name":"0.5.2-alpha-1",
    "notes":"",
    "pub_date":"2016-06-21T18:58:10.000Z"
}
```