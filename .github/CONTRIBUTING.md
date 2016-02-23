# Welcome to the contributing guide for Ghost!

So you're interested in giving us a hand? That's awesome! We've put together some guidelines that should help
you get started quickly and easily. If you need help with anything, please come visit our [slack community](https://ghost.org/slack) and the [contributer's guide over in the Ghost repository](https://github.com/TryGhost/Ghost/blob/master/.github/CONTRIBUTING.md). Thank you for stopping by!

### TL;DR

If you need help with Ghost or have questions, please use [slack](https://ghost.org/slack) (documentation is [here](http://support.ghost.org)). If you're [raising a bug](#bugs) please be sure to [include as much info as possible](#bug-template) so that we can fix it! If you've got some code you want to [pull request](#pull-requests) please [squash commits](https://github.com/TryGhost/Ghost/wiki/Git-workflow#wiki-clean-up-history), use this [commit message format](https://github.com/TryGhost/Ghost/wiki/Git-workflow#commit-messages) and check it passes the tests by running `npm test`. Thanks for helping us make Ghost Desktop better.

## Working on Ghost Desktop

In order to get up and running with Ghost-Desktop, ensure that you have Node 4 (or higher) and npm installed.

 * Clone this repository
 * Run `npm install` to install all Node dependencies
 * Run `bower install` to install all Bower dependencies
 * Run `npm install -g grunt-cli` to install the Grunt Cli, which is used to test and build Ghost Desktop
 * Run `npm start` to compile and start Ghost Desktop
