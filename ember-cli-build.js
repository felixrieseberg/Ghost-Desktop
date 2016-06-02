/*jshint node:true*/
/* global require, module */
const EmberApp = require('ember-cli/lib/broccoli/ember-app'),
    environment = EmberApp.env(),
    isProduction = environment === 'production',
    mythCompress = isProduction || environment === 'test';

module.exports = function(defaults) {
    const isTest = (process.env.EMBER_ENV || 'development') === 'test';
    const blacklist = isTest ? [] : [
        'es6.arrowFunctions',
        'es6.blockScoping',
        'es6.classes',
        'es6.forOf',
        'es6.templateLiterals',
        'es6.constants',
        'es6.properties.computed',
        'es6.properties.shorthand',
        'es6.literals',
        'es6.spec.symbols',
        'es6.spread',
        'es6.parameters',
        'es6.spec.arrowFunctions',
        'es6.spec.templateLiterals',
        'es6.spec.blockScoping',
        'es6.tailCall',
        'es6.regex.sticky',
        'es6.regex.unicode',
        'es6.objectSuper',
        'es6.destructuring'
    ];

    var app = new EmberApp(defaults, {
        babel: {
            includePolyfill: true,
            blacklist: blacklist,
            comments: false,
        },
        fingerprint: {
            enabled: false
        },
        hinting: false,
        minifyJS: {
            enabled: false
        },
        sourcemaps: {
            enabled: EmberApp.env() !== 'production'
        },
        mythOptions: {
            source: './app/styles/app.css',
            inputFile: 'app.css',
            browsers: 'last 2 Chrome versions',
            sourcemap: true,
            compress: mythCompress,
            outputFile: 'ghost-desktop.css'
        },
    });

    // Use `app.import` to add additional libraries to the generated
    // output files.
    //
    // If you need to use different assets in different
    // environments, specify an object as the first parameter. That
    // object's keys should be the environment name and the values
    // should be the asset to use in that environment.
    //
    // If the library that you are including contains AMD or ES6
    // modules that you would like to import into your application
    // please specify an object with the list of modules as keys
    // along with the exports of each module as its value.

    return app.toTree();
};
