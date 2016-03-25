const ColorScheme = require('color-scheme');

/**
 * Generates a random set of (nicely selected!) colors and selects one to be returned.
 *
 * @export
 * @return {string}
 */
export default function getIconColor() {
    let scheme = new ColorScheme();

    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    scheme.from_hue(50)
        .scheme('triade')
        .variation('soft')
        .web_safe(true);
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

    let colors = scheme.colors();
    let index = Math.floor(Math.random() * colors.length);

    return ['#', colors[index]].join('');
};
