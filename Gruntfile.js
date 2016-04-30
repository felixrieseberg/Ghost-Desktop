// # Task automation for Ghost
//
// Run various tasks when developing for and working with Ghost Desktop.
//
// **Usage instructions:** can be found in the by running `grunt --help`.
//
// **Debug tip:** If you have any problems with any Grunt tasks, try running them with the `--verbose` command

const package = require('./package.json');
const winTools = require('./scripts/create-windows-build');

const configureGrunt = function (grunt) {
    // #### Load all grunt tasks
    //
    // Find all of the task which start with `grunt-` and load them, rather than explicitly declaring them all
    require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);

    if (process.platform === 'linux') {
        grunt.loadNpmTasks('grunt-electron-installer-debian');
    }

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
                'main/**/*.js',
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
                command: `ember electron:package --environment production --arch x64 --platform ${process.platform} --app-version ${package.version} --overwrite`
            },
            build32: {
                command: `ember electron:package --environment production --arch ia32 --platform ${process.platform} --app-version ${package.version} --overwrite`
            },
            logCoverage: {
                command: 'node ./scripts/log-coverage.js'
            },
            dmg: {
                command: 'node ./scripts/create-osx-build.js'
            },
            fetchContributors: {
                command: 'node ./scripts/fetch-github-contributors.js'
            },
        },

        clean: {
            builds32: [
                'electron-builds/Ghost-win32-ia32-installer/**/*',
                'electron-builds/Ghost-win32-ia32/**/*',
                'electron-builds/Ghost-linux-ia32-installer/**/*',
                'electron-builds/Ghost-linux-ia32/**/*',
                'electron-builds/Ghost-darwin-ia32/**/*'
                ],
            builds64: [
                'electron-builds/Ghost-win32-x64-installer/**/*',
                'electron-builds/Ghost-win32-x64/**/*',
                'electron-builds/Ghost-linux-x64-installer/**/*',
                'electron-builds/Ghost-linux-x64/**/*',
                'electron-builds/Ghost-darwin-x64/**/*'
                ],
        },

        'create-windows-installer': {
            ia32: {
                appDirectory: './electron-builds/Ghost-win32-ia32',
                outputDirectory: './electron-builds/Ghost-win32-ia32-installer',
                authors: 'Ghost Foundation',
                exe: 'Ghost.exe',
                iconUrl: `https://raw.githubusercontent.com/TryGhost/Ghost-Desktop/master/assets/icons/ghost.ico`,
                setupIcon: `${__dirname}/assets/icons/ghost.ico`,
                title: 'Ghost',
                noMsi: true,
                loadingGif: './assets/win/installer-dev.gif',
                certificateFile: winTools.getSigningCert(),
                certificatePassword: winTools.getSigningPassword()
            },
            x64: {
                appDirectory: './electron-builds/Ghost-win32-x64',
                outputDirectory: './electron-builds/Ghost-win32-x64-installer',
                authors: 'Ghost Foundation',
                exe: 'Ghost.exe',
                iconUrl: `https://raw.githubusercontent.com/TryGhost/Ghost-Desktop/master/assets/icons/ghost.ico`,
                setupIcon: `${__dirname}/assets/icons/ghost.ico`,
                title: 'Ghost',
                noMsi: true,
                loadingGif: './assets/win/installer-dev.gif'
            }
        },

        'electron-installer-debian': {
            app: {
                options: {
                    name: 'Ghost',
                    maintainer: 'Felix Rieseberg <felix@felixrieseberg.com>',
                    homepage: 'https://tryghost.com',
                    genericName: 'Blogging Software',
                    arch: 'amd64',
                    icon: `${__dirname}/assets/icons/ghost-osx.png`,
                    bin: 'Ghost',
                    productDescription: 'A beautiful desktop application enabling you to easily manage multiple Ghost blogs and work without distractions.'
                },
                src: './electron-builds/Ghost-linux-x64',
                dest: './electron-builds/Ghost-linux-x64-installer'
            }
        },

        trimtrailingspaces: {
            main: {
                src: ['app/**/*.js', 'tests/**/*.js', 'scripts/**/*.js', 'Gruntfile.js', 'main/**/*.js'],
                options: {
                    filter: 'isFile',
                    encoding: 'utf8',
                    failIfTrimmed: false
                }
            }
        }

    };

    grunt.initConfig(config);

    grunt.registerTask('codestyle', 'Test Code Style', ['trimtrailingspaces', 'eslint', 'jscs:app']);
    grunt.registerTask('validate', 'Test Code Style and App', ['codestyle', 'shell:test', 'shell:logCoverage']);
    grunt.registerTask('build', 'Compile Ghost Desktop for the current platform', ['shell:fetchContributors', 'shell:build']);
    grunt.registerTask('installer-32', ['clean:builds32', 'shell:fetchContributors', 'shell:build32', 'create-windows-installer:ia32'])
    grunt.registerTask('installer-64', ['clean:builds64', 'shell:fetchContributors', 'shell:build', 'create-windows-installer:x64'])
    grunt.registerTask('installer', 'Create Windows Installers for Ghost', ['installer-32', 'installer-64']);
    grunt.registerTask('debian', ['clean:builds64', 'shell:fetchContributors', 'shell:build', 'electron-installer-debian']);
    grunt.registerTask('dmg', 'Create an OS X dmg for Ghost', ['shell:fetchContributors', 'shell:build', 'shell:dmg']);
};

module.exports = configureGrunt;
