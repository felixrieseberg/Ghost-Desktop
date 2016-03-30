const he = require('he');

/**
 * Sets the title on the currently focussed Window (or the first found window)
 *
 * @export
 * @param {string} [title='Ghost'] - New title
 */
export default function setWindowTitle(title = 'Ghost') {
    let {remote} = requireNode('electron');
    let {BrowserWindow} = remote;
    let currentWindow = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
    let decodedTitle = he.decode(title);

    // We should always have only one Window
    if (currentWindow) {
        currentWindow.setTitle(`Ghost - ${decodedTitle}`);
    }
}
