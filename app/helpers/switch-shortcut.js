import Ember from 'ember';

export function switchShortcut(params) {
    let index = (params && params[0]) ? params[0] + 1 : 1;
    let cmdOrCtrl = (process.platform && process.platform === 'darwin') ? '⌘' : 'Ctrl';

    // If bigger than 9, don't return anything
    return (index > 9) ? '' : `${cmdOrCtrl} ${index}`;
}

export default Ember.Helper.helper(switchShortcut);
