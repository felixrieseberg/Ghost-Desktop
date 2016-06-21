'use strict';

function handleDragDropEvent(e) {
    const className = e.target.className || '';

    if (className.includes('js-fileupload') || className.includes('fileupload')) {
        return true;
    } else {
        e.preventDefault();
        return false;
    }
}

function preventImageNavigation() {
    document.addEventListener('dragover', handleDragDropEvent, false);
    document.addEventListener('drop', handleDragDropEvent, false);
}

preventImageNavigation();
