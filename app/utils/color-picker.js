const ColorScheme = require('color-scheme');

/**
 * Generates a random set of (nicely selected!) colors and selects one to be returned.
 *
 * @export
 * @return {string}
 */
export default function getIconColor(excludedColor) {
    let scheme = new ColorScheme();

    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    scheme.from_hue(50)
        .scheme('triade')
        .variation('soft')
        .web_safe(true);
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

    let colors = scheme.colors();

    // Make sure our generated colors don't contain the color
    // that's already set.
    if (excludedColor !== null) {
        // We store colors on the model with the '#' prefixed.
        let colorName = excludedColor.substr(1);
        let excludedColorIndex = colors.indexOf(colorName);

        if (excludedColorIndex >= 0) {
            colors.removeAt(excludedColorIndex);
        }
    }

    let index = Math.floor(Math.random() * colors.length);

    return ['#', colors[index]].join('');
};
