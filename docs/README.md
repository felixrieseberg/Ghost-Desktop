# Welcome to the contributing guide for Ghost Desktop!

So you're interested in giving us a hand? That's awesome! We've put together some guidelines that should help
you get started quickly and easily. If you need help with anything, please come visit our [slack community](https://ghost.org/slack) and the [contributer's guide over in the Ghost repository](https://github.com/TryGhost/Ghost/blob/master/.github/CONTRIBUTING.md). Thank you for stopping by!

### Need Support?

If you need help with Ghost or have questions, please use [slack](https://ghost.org/slack) (documentation is [here](http://support.ghost.org)). If you're [raising a bug](#bugs) please be sure to [include as much info as possible](#bug-template) so that we can fix it! If you've got some code you want to [pull request](#pull-requests) please [squash commits](https://github.com/TryGhost/Ghost/wiki/Git-workflow#wiki-clean-up-history), use this [commit message format](https://github.com/TryGhost/Ghost/wiki/Git-workflow#commit-messages) and check it passes the tests by running `npm test`. Thanks for helping us make Ghost Desktop better.

# Working on Ghost Desktop

## Developer Environment
In order to get up and running with Ghost Desktop, ensure that you have Node 4 (or higher) and npm installed. Then, run the following steps:

 * Clone this repository
 * Run `npm install` to install all Node dependencies
 * Run `bower install` to install all Bower dependencies
 * Run `npm install -g grunt-cli` to install the Grunt Cli, which is used to test and build Ghost Desktop
 * Run `npm run build-native-deps` to rebuild native C++ dependencies against the Electron headers
 * Run `npm start` to compile and start Ghost Desktop
 
## Development Workflow
Ghost Desktop is built on top of Electron, the now famous framework underneath Atom, Visual Studio Code, or Slack. It uses [Electron](http://electron.atom.io/) as a container for an [Ember App](http://emberjs.com), which draws on the power of native components and ES6 JS. If you go and checkout the `app` folder, you'll quickly find multiple references to the filesystem, the user's operating system's credential store,or other native components that we wouldn't be able to call from a "normal" website. Ghost Desktop is capable of doing anything Node is capable of. 

The development workflow is enabled by [Ember-Electron](https://github.com/felixrieseberg/ember-electron) and various Grunt tasks. 

 * `ember electron` or `npm start` builds the current version of the app and starts it using a prebuilt binary of Electron, live-reloading the app on any code changes. Ember-Inspector can't be installed in Electron, but will be available as soon as the app is launched from any web browser on `http://localhost:30820`.
 * `ember electron:test` runs tests using QUnit as defined in `tests`.
 * `ember electron:test --server` runs the same tests, but in a live-reloading development mode. It uses incremental builds to allow for a fast dev/test workflow.
 * `npm run test` or `grunt validate` runs JSCS (a code style checker) and the QUnit tests together. It is also what our CI system runs whenever you make a pull request.
 * `npm run build` or `grunt build` compiles Ghost Desktop into a standalone binary (.exe on Windows, .app on OS X).
 * `npm run build-native-deps` compiles native dependencies using the Electron headers. It should be run whenever you run `npm install`.
 
 #### Native Dependencies
Ghost Desktop isn't just a dumb alternative to a web browser - it tries to enhance the user's experience 