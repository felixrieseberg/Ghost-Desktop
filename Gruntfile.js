// # Task automation for Ghost
//
// Run various tasks when developing for and working with Ghost Desktop.
//
// **Usage instructions:** can be found in the by running `grunt --help`.
//
// **Debug tip:** If you have any problems with any Grunt tasks, try running them with the `--verbose` command
const configureGrunt = function (grunt) {
        // #### Load all grunt tasks
        //
        // Find all of the task which start with `grunt-` and load them, rather than explicitly declaring them all
        require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);

        const config = {
            // ### grunt-contrib-jshint
            // Linting rules, run as part of `grunt validate`. See [grunt validate](#validate) and its subtasks for
            // more information.
            jshint: {
                options: {
                    jshintrc: true
                },

                app: [
                    'app/**/*.js',
                    '!node_modules/**/*.js',
                    '!bower_components/**/*.js',
                    '!tests/**/*.js',
                    '!tmp/**/*.js',
                    '!dist/**/*.js'
                ]
            },

            jscs: {
                app: {
                    files: {
                        src: [
                            'app/**/*.js',
                            '!node_modules/**/*.js',
                            '!bower_components/**/*.js',
                            '!tests/**/*.js',
                            '!tmp/**/*.js',
                            '!dist/**/*.js'
                        ]
                    }
                },

                tests: {
                    files: {
                        src: [
                            'tests/**/*.js'
                        ]
                    }
                }
            }
        }

        grunt.initConfig(config);

        grunt.registerTask('validate', 'Test Code Style and App', ['jscs:app', 'jshint:app']);
    };

module.exports = configureGrunt;
