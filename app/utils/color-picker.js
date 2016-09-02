const randomColor = require('randomcolor');
const colorSettings = {luminosity: 'light'};

/**
 * Generates a random set of (nicely selected!) colors and selects one to be returned.
 *
 * @export
 * @return {string}
 */
export default function getIconColor(excludedColor) {
    let color = randomColor(colorSettings);

    // Make sure our generated colors don't contain the color
    // that's already set.
    while (excludedColor === color) {
        color = randomColor(colorSettings);
    }

    return color;
};
