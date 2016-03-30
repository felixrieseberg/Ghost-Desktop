
/**
 * Gets the currently focussed Window (or the first found window)
 *
 */
export default function getCurrentWindow() {
    let {remote} = requireNode('electron');
    let {BrowserWindow} = remote;

    return BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
}
