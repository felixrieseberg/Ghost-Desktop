/**
 * Injects a CSS file into a given webview, using a given css filename.
 *
 * @export
 * @param webview - Webview to inejct into
 * @param name - Filename to use
 */
export function injectCss(webview, name = '') {
    let fs = requireNode('fs');

    fs.readFile(`${__dirname}/assets/inject/css/${name}.css`, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }

        if (data) {
            webview.insertCSS(data);
        }
    });
}
