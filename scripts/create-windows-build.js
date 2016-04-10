var windowsBuildTools = {
    getSigningCert() {
        if (process.platform !== 'win32') {
            return;
        }

        if (process.env.CODESIGN_CERTIFICATE) {
            return process.env.CODESIGN_CERTIFICATE;
        } else {
            console.log('Codesigning certificate can not be found, release build will fail');
            console.log('To fix, set CODESIGN_CERTIFICATE');
        }
    },

    getSigningPassword() {
        if (process.platform !== 'win32') {
            return;
        }

        if (process.env.CODESIGN_PASSWORD) {
            return process.env.CODESIGN_PASSWORD;
        } else {
            console.log('Codesigning password can not be found, release build will fail');
            console.log('To fix, set CODESIGN_PASSWORD');
        }
    }
}

module.exports = windowsBuildTools;