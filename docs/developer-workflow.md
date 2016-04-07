# Development Workflow
Ghost Desktop is built on top of Electron, the now famous framework underneath Atom, Visual Studio Code, or Slack. It uses [Electron](http://electron.atom.io/) as a container for an [Ember App](http://emberjs.com), which draws on the power of native components and ES6 JS. If you go and checkout the `app` folder, you'll quickly find multiple references to the filesystem, the user's operating system's credential store,or other native components that we wouldn't be able to call from a "normal" website. Ghost Desktop is capable of doing anything Node is capable of. 

The development workflow is enabled by [Ember-Electron](https://github.com/felixrieseberg/ember-electron) and various Grunt tasks. 

 * `ember electron` or `npm start` builds the current version of the app and starts it using a prebuilt binary of Electron, live-reloading the app on any code changes. Ember-Inspector can't be installed in Electron, but will be available as soon as the app is launched from any web browser on `http://localhost:30820`.
 * `ember electron:test` runs tests using QUnit as defined in `tests`.
 * `ember electron:test --server` runs the same tests, but in a live-reloading development mode. It uses incremental builds to allow for a fast dev/test workflow.
 * `npm run test` or `grunt validate` runs JSCS (a code style checker) and the QUnit tests together. It is also what our CI system runs whenever you make a pull request.
 * `npm run build` or `grunt build` compiles Ghost Desktop into a standalone binary (.exe on Windows, .app on OS X).
 * `npm run build-native-deps-64` (or -32, if you're running on a 32 bit machine) compiles native dependencies using the Electron headers. It should be run whenever you run `npm install`.
