/**
 * Takes an array of blogs and turns it into a dock menu
 *
 * Expected format
 * items: [{
 *   name: string,
 *   callback: function
 * }];
 *
 * @export
 * @param items - Items to add
 */
export default function setDockMenu(items) {
    let {remote} = requireNode('electron');
    let {app, Menu, MenuItem} = remote;
    let menu = new Menu();

    if (!items || !items.length) {
        return;
    }

    items.forEach((item) => {
        if (!item || !item.name || !item.callback) {
            return;
        }

        menu.append(new MenuItem({
            label: item.name,
            click: item.callback
        }));
    });

    app.dock.setMenu(menu);
}