# Testing

Ghost Desktop should work. Preferably all the time, so all code is tested - on Windows, OS X, and Linux. In addition, the JavaScript Code Style Checker ensures a common code style, while ESLint ensures that the JavaScript/ES6 in the project is actually valid. We also collect information about our code coverage statistics - and while those numbers don't fully represent how well a project is tested, it's a good idea to keep to keep the percentage of coverage up.

## Please Try This at Home
While every Pull Request is automatically tested, it's a good idea to run all tests yourself.

 * To run the full suite, execute `npm test`.
 * To run only unit and integration tests, run `ember electron:test`
 * To run unit and integration tests in development mode, run `ember electron:test --server`
 * To run the JavaScript Code Style test, run `grunt jscs:app`
 * To run the ESLint test, run `grunt eslint`
 * To print the main statistics on code coverage, run `grunt shell:logCoverage` (requires that unit & integration tests ran before)
 
If you have any questions about testing, please come visit our [slack community](https://ghost.org/slack). We're more than happy to help!