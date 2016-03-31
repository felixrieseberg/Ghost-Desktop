/**
 * Takes an array of blogs and turns it into a user tasks list
 *
 * Expected format
 * items: [{
 *   name: string,
 *   url: string
 * }];
 *
 * @export
 * @param items - Items to add
 */
export default function setUserTasks(items) {
    let {remote} = requireNode('electron');
    let {app} = remote;
    let tasks = [];

    if (!items || !items.length) {
        return;
    }

    items.forEach((item) => {
        if (!item || !item.name || !item.url) {
            return;
        }

        tasks.push({
            program: process.execPath,
            arguments: item.url,
            title: item.name
        });
    });

    app.setUserTasks(tasks);
}