export function initialize(application) {
    application.inject('service:window-menu', 'webviewShortcuts', 'service:webview-shortcuts');
}

export default {
    name: 'services',
    initialize
};
