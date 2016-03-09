
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

    return sanitizedUrl;
}
