# Welcome to the contributing guide for Ghost Desktop!

So you're interested in giving us a hand? That's awesome! We've put together some guidelines that should help
you get started quickly and easily. If you need help with anything, please come visit our [slack community](https://ghost.org/slack) and the [contributer's guide over in the Ghost repository](https://github.com/TryGhost/Ghost/blob/master/.github/CONTRIBUTING.md). Thank you for stopping by!

### Need Support?
If you need help with Ghost or have questions, please use [slack](https://ghost.org/slack) (documentation is [here](http://support.ghost.org)). If you're [raising a bug](#bugs) please be sure to [include as much info as possible](#bug-template) so that we can fix it! If you've got some code you want to [pull request](#pull-requests) please [squash commits](https://github.com/TryGhost/Ghost/wiki/Git-workflow#wiki-clean-up-history), use this [commit message format](https://github.com/TryGhost/Ghost/wiki/Git-workflow#commit-messages) and check it passes the tests by running `npm test`. Thanks for helping us make Ghost Desktop better.

# Working on Ghost Desktop

 * [Setting up your Developer Environment](developer-environment.md)
 * [Development Workflow](developer-workflow.md)
 * [Creating Builds](creating-builds.md)
 * [Ember Documentation](https://emberjs.com)
 * [Ember-Electron Documentation](https://github.com/felixrieseberg/ember-electron)
 * [Electron Documentation](https://github.com/atom/electron/tree/master/docs)

## Current Status
| Platform | Windows | OS X  | Linux |
|----------|---------|-------|-------|
| Tests    | <a href="https://ci.appveyor.com/project/felixrieseberg/ghost-desktop/branch/master"><img title="Windows" align="right" src="https://ci.appveyor.com/api/projects/status/d4n4jvhaex9s5ya4/branch/master?svg=true" /></a>        | <a href="https://travis-ci.org/TryGhost/Ghost-Desktop"><img align="right" src="http://badges.herokuapp.com/travis/TryGhost/Ghost-Desktop/?label=OS X&env=NODE_VERSION=5.1%20TARGET_ARCH=x64%20OS=DARWIN" /></a>      | <a href="https://travis-ci.org/TryGhost/Ghost-Desktop"><img align="right" src="http://badges.herokuapp.com/travis/TryGhost/Ghost-Desktop/?label=Linux&env=NODE_VERSION=5.1%20TARGET_ARCH=x64%20OS=LINUX" /></a>      |

| Code Coverage |
|----------|
| [![codecov.io](https://codecov.io/github/TryGhost/Ghost-Desktop/coverage.svg?branch=master)](https://codecov.io/github/TryGhost/Ghost-Desktop?branch=master) |
| ![codecov.io](https://codecov.io/github/TryGhost/Ghost-Desktop/branch.svg?branch=master) |