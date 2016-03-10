import Ember from 'ember';

export function setup() {
    let {remote} = requireNode('electron');
    let {Menu, app} = remote;
    let template = [
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'CmdOrCtrl+Z',
                    role: 'undo'
                },
                {
                    label: 'Redo',
                    accelerator: 'Shift+CmdOrCtrl+Z',
                    role: 'redo'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Cut',
                    accelerator: 'CmdOrCtrl+X',
                    role: 'cut'
                },
                {
                    label: 'Copy',
                    accelerator: 'CmdOrCtrl+C',
                    role: 'copy'
                },
                {
                    label: 'Paste',
                    accelerator: 'CmdOrCtrl+V',
                    role: 'paste'
                },
                {
                    label: 'Select All',
                    accelerator: 'CmdOrCtrl+A',
                    role: 'selectall'
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click(item, focusedWindow) {
                        if (focusedWindow) {
                            focusedWindow.reload();
                        }
                    }
                },
                {
                    label: 'Toggle Full Screen',
                    accelerator: (function accelerator() {
                        if (process.platform === 'darwin') {
                            return 'Ctrl+Command+F';
                        }
                        return 'F11';
                    }()),
                    click(item, focusedWindow) {
                        if (focusedWindow) {
                            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                        }
                    }
                }
            ]
        },
        {
            label: 'Window',
            role: 'window',
            submenu: [
                {
                    label: 'Minimize',
                    accelerator: 'CmdOrCtrl+M',
                    role: 'minimize'
                },
                {
                    label: 'Close',
                    accelerator: 'CmdOrCtrl+W',
                    role: 'close'
                }
            ]
        },
        {
            label: 'Developer',
            submenu: [
                {
                    label: 'Toggle Developer Tools',
                    accelerator: (function accelerator() {
                        if (process.platform === 'darwin') {
                            return 'Alt+Command+I';
                        }
                        return 'Ctrl+Shift+I';
                    }()),
                    click(item, focusedWindow) {
                        if (focusedWindow) {
                            focusedWindow.toggleDevTools();
                        }
                    }
                },
                {
                    label: 'Toggle Developer Tools (Current Blog)',
                    accelerator: (function accelerator() {
                        if (process.platform === 'darwin') {
                            return 'Alt+Command+Shift+I';
                        }
                        return 'Ctrl+Alt+Shift+I';
                    }()),
                    click(item, focusedWindow) {
                        if (focusedWindow) {
                            let host = Ember.$('div.instance-host.selected');
                            let webviews = host ? Ember.$(host).find('webview') : null;

                            if (!webviews || !webviews[0]) {
                                return;
                            }

                            if (webviews[0].isDevToolsOpened()) {
                                webviews[0].closeDevTools();
                            } else {
                                webviews[0].openDevTools();
                            }
                        }
                    }
                },
                {
                    label: 'Repository',
                    click() {
                        require('electron').shell.openExternal('http://github.com/tryghost/ghost-desktop');
                    }
                },
                {
                    label: 'Report Issues',
                    click() {
                        require('electron').shell.openExternal('http://github.com/tryghost/ghost-desktop/issues');
                    }
                }
            ]
        },
        {
            label: 'Help',
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click() {
                        require('electron').shell.openExternal('http://github.com/tryghost/ghost-desktop');
                    }
                }
            ]
        }
    ];

    if (process.platform === 'darwin') {
        template.unshift({
            label: 'Ghost',
            submenu: [
                {
                    label: 'About Ghost',
                    role: 'about'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Services',
                    role: 'services',
                    submenu: []
                },
                {
                    type: 'separator'
                },
                {
                    label: `Hide ${name}`,
                    accelerator: 'Command+H',
                    role: 'hide'
                },
                {
                    label: 'Hide Others',
                    accelerator: 'Command+Alt+H',
                    role: 'hideothers'
                },
                {
                    label: 'Show All',
                    role: 'unhide'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click() {
                        app.quit();
                    }
                }
            ]
        });
        // Window menu.
        template[3].submenu.push(
            {
                type: 'separator'
            },
            {
                label: 'Bring All to Front',
                role: 'front'
            }
        );
    }

    let builtMenu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(builtMenu);
    return builtMenu;
}
