window.GhostDesktop = {
    addToEditor(title, content) {
        const $ = window.$ || global.$;
        const $titleElement = $('h2 > input');
        const $contentElement = $('main textarea');

        if ($titleElement) {
            $titleElement.val(`${$titleElement.val()} ${title}`).change();
        }

        if ($contentElement) {
            $contentElement.val(`${$contentElement.val()}\n${content}`).change();
        }
    }
}
