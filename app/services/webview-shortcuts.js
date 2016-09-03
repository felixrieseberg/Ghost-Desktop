import Ember from 'ember';
import findVisibleWebview from '../utils/find-visible-webview';

export default Ember.Service.extend({

    /**
     * Returns a JavaScript command (as string) that selects
     * all elements from a given query selector - and clicks
     * the first one, if it exists
     *
     * @param {string} [selector='']
     * @param {string} [innerText='']
     * @param {Object} [$webview=findVisibleWebview()]
     * @returns {string} command
     */
    queryAndClick(selector = '', innerText = '', $webview = findVisibleWebview()) {
        const cmd = [];

        if ($webview) {
            cmd.push(`[].slice.call(document.querySelectorAll("${selector}"))`);
            cmd.push(innerText ? `.filter(el => el.innerText === "${innerText}")` : '');
            cmd.push(`.slice(0,1)`);
            cmd.push(`.every(el => el.click())`);

            $webview.executeJavaScript(cmd.join(''));
        }
    },

    /**
     * Programmatically clicks the "preview" link
     * in either a given or the currently visible
     * webview. Does nothing if such a link does
     * not exist.
     */
    openPreview() {
        this.queryAndClick(`a[href*='/p/']`, 'Preview');
    },

    /**
     * Programmatically clicks the "New Post" link
     * in either a given or the currently visible
     * webview. Does nothing if such a link does
     * not exist.
     */
    openNewPost() {
        this.queryAndClick(`a[href*='/ghost/editor/']`, 'New Post');
    },

    /**
     * Programmatically clicks the "Content" link
     * in either a given or the currently visible
     * webview. Does nothing if such a link does
     * not exist.
     */
    openContent() {
        this.queryAndClick(`a[href='/ghost/']`, 'Content');
    },

    /**
     * Programmatically clicks the "Team" link
     * in either a given or the currently visible
     * webview. Does nothing if such a link does
     * not exist.
     */
    openTeam() {
        this.queryAndClick(`a[href*='/ghost/team/']`, 'Team');
    },

    /**
     * Programmatically clicks the "General" link
     * in either a given or the currently visible
     * webview. Does nothing if such a link does
     * not exist.
     */
    openSettingsGeneral() {
        this.queryAndClick(`a[href*='/ghost/settings/general/']`, 'General');
    },

    /**
     * Programmatically clicks the "Navigation" link
     * in either a given or the currently visible
     * webview. Does nothing if such a link does
     * not exist.
     */
    openSettingsNavigation() {
        this.queryAndClick(`a[href*='/ghost/settings/navigation/']`, 'Navigation');
    },

    /**
     * Programmatically clicks the "Tags" link
     * in either a given or the currently visible
     * webview. Does nothing if such a link does
     * not exist.
     */
    openSettingsTags() {
        this.queryAndClick(`a[href*='/ghost/settings/tags/']`, 'Tags');
    },

    /**
     * Programmatically clicks the "Code Injection" link
     * in either a given or the currently visible
     * webview. Does nothing if such a link does
     * not exist.
     */
    openSettingsCodeInjection() {
        this.queryAndClick(`a[href*='/ghost/settings/code-injection/']`, 'Code Injection');
    },

    /**
     * Programmatically clicks the "Apps" link
     * in either a given or the currently visible
     * webview. Does nothing if such a link does
     * not exist.
     */
    openSettingsApps() {
        this.queryAndClick(`a[href*='/ghost/settings/apps/']`, 'Apps');
    },

    /**
     * Programmatically clicks the "Labs" link
     * in either a given or the currently visible
     * webview. Does nothing if such a link does
     * not exist.
     */
    openSettingsLabs() {
        this.queryAndClick(`a[href*='/ghost/settings/labs/']`, 'Labs');
    }
});
