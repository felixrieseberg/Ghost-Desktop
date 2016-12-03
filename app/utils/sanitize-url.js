const urlPattern = /http(s?):\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,3000}(\.[a-z]{0,20})?\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

/**
 * Sanitizes an input url, ensuring that it meets the requirements of Ghost Desktop
 *
 * @export
 * @param {string} [url=''] Input url
 * @returns {string} Sanitized url
 */
export function sanitizeUrl(url = '') {
    let sanitizedUrl = url;

    // Ensure that the url ends with a trailing slash
    if (sanitizedUrl.slice(-1) !== '/') {
        sanitizedUrl = `${sanitizedUrl}/`;
    }

    // If the url does not end with a /ghost/, add it
    if (sanitizedUrl.slice(-7) !== '/ghost/') {
        sanitizedUrl = `${sanitizedUrl}ghost/`;
    }

    // Does it begin with http or https? If not, let's add that
    if (sanitizedUrl.slice(0, 7) !== 'http://' && sanitizedUrl.slice(0, 8) !== 'https://') {
        sanitizedUrl = `http://${sanitizedUrl}`;
    }

    return sanitizedUrl;
}

export function isValidUrl(url = '') {
    // Chromium had a little regex bug, this shields against
    // false negatives
    return urlPattern.test(url) || !!url.match(urlPattern);
}
