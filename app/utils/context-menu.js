export function setup() {
    let {remote} = requireNode('electron');
    let editorMenu = remote.require('electron-editor-context-menu')();

    window.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();

        let node = e.target;

        while (node) {
            if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
                editorMenu.popup(remote.getCurrentWindow());
                break;
            }

            node = node.parentNode;
        }
    });

    return editorMenu;
};
