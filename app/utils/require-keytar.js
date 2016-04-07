
/**
 * Attempts to require keytar, returns false if it fails
 *
 */
export default function requireKeytar() {
    let keytar = null;

    try {
        keytar = requireNode('keytar');
    } catch (e) {
        keytar = false;
    }

    return keytar;
}
