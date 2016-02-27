export function setup() {
    let {remote} = requireNode('electron');
    let {Menu} = remote;
    let buildEditorContextMenu = remote.require('electron-editor-context-menu');

    window.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();

        let node = e.target;

        while (node) {
            if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
                let editorMenu = buildEditorContextMenu();
                editorMenu.popup(remote.getCurrentWindow());
                break;
            }

            node = node.parentNode;
        }
    });
};
