// # Task automation for Ghost
//
// Run various tasks when developing for and working with Ghost Desktop.
//
// **Usage instructions:** can be found in the by running `grunt --help`.
//
// **Debug tip:** If you have any problems with any Grunt tasks, try running them with the `--verbose` command

const package = require('./package.json');

const configureGrunt = function(grunt) {
    // #### Load all grunt tasks
    //
    // Find all of the task which start with `grunt-` and load them, rather than explicitly declaring them all
    require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);

    const config = {
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
        },

        eslint: {
            configFile: '.eslintrc.json',
            target: [
                'app/**/*.js',
                '!node_modules/**/*.js',
                '!bower_components/**/*.js',
                '!tests/**/*.js',
                '!tmp/**/*.js',
                '!dist/**/*.js'
            ]
        },

        shell: {
            test: {
                command: 'ember electron:test'
            },
            build: {
                command: `ember electron:package --platform ${process.platform} --app-version ${package.version} --overwrite`
            },
            logCoverage: {
                command: 'node ./scripts/log-coverage.js'
            },
            dmg: {
                command: 'node ./scripts/create-osx-build.js'
            }
        },

        'create-windows-installer': {
            ia32: {
                appDirectory: './electron-builds/Ghost-win32-ia32',
                outputDirectory: './electron-builds/Ghost-win32-installer',
                authors: 'Ghost Foundation',
                exe: 'Ghost.exe',
                iconUrl: `https://raw.githubusercontent.com/TryGhost/Ghost-Desktop/master/assets/icons/ghost.ico`,
                setupIcon: `${__dirname}/assets/icons/ghost.ico`,
                title: 'Ghost',
                noMsi: true
            }
        }
    };
    
    grunt.initConfig(config);

    grunt.registerTask('validate', 'Test Code Style and App', ['eslint', 'jscs:app', 'shell:test', 'shell:logCoverage']);
    grunt.registerTask('build', 'Compile Ghost Desktop for the current platform', ['shell:build']);
    grunt.registerTask('installer', 'Create Windows Installers for Ghost', ['shell:build', 'create-windows-installer']);
    grunt.registerTask('dmg', 'Create an OS X dmg for Ghost', ['shell:build', 'shell:dmg']);
};

module.exports = configureGrunt;
