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
     * @param {boolean} [waitForWebview] Should we wait for the webview to load?
     * @param {Object} [$webview=findVisibleWebview()]
     * @returns {Promise} command
     */
    queryAndClick(selector = '', innerText = '', waitForWebview = false, $webview = findVisibleWebview()) {
        const cmd = [];

        if (!$webview) return Promise.reject();;

        cmd.push(`[].slice.call(document.querySelectorAll("${selector}"))`);
        cmd.push(innerText ? `.filter(el => el.innerText === "${innerText}")` : '');
        cmd.push(`.slice(0,1)`);
        cmd.push(`.every(el => el.click())`);

        return new Promise((resolve) => {
            const run = () => $webview.executeJavaScript(cmd.join(''), () => resolve());

            if (waitForWebview && $webview.isLoading()) {
                // This is a bit ghetto, but it should work
                // until we have the time to give this some
                // polish ✨
                let intervalCount = 0;

                const checker = setInterval(() => {
                    if (!$webview.isLoading() || intervalCount > 400) {
                        setTimeout(() => run(), 1100);
                        clearInterval(checker);
                    }

                    intervalCount = intervalCount + 1;
                }, 300);
            } else {
                run();
            }
        });
    },

    /**
     * Programmatically clicks the "preview" link in either a given or the
     * currently visible webview. Does nothing if such a link does not exist.
     *
     * @param {boolean} [waitForWebview] Should we wait for the webview to load?
     */
    openPreview(waitForWebview) {
        this.queryAndClick(`a[href*='/p/']`, 'Preview', waitForWebview);
    },

    /**
     * Programmatically clicks the "New Post" link in either a given or the
     * currently visible webview. Does nothing if such a link does not exist.
     *
     * @param {boolean} [waitForWebview] Should we wait for the webview to load?
     */
    openNewPost(waitForWebview, {title, content} = {title: '', content: ''}) {
        window.openNewPost = this.openNewPost.bind(this);

        this.queryAndClick(`a[href*='/ghost/editor/']`, 'New Post', waitForWebview)
            .then(() => {
                if (title || content) {
                    const escape = require('js-string-escape');
                    const $wv = findVisibleWebview();

                    if ($wv) {
                        $wv.executeJavaScript(`GhostDesktop.addToEditor('${escape(title)}', '${escape(content)}')`);
                    }
                }
            })
    },

    /**
     * Programmatically clicks the "Content" link in either a given or the currently visible
     * webview. Does nothing if such a link does not exist.
     *
     * @param {boolean} [waitForWebview] Should we wait for the webview to load?
     */
    openContent(waitForWebview) {
        this.queryAndClick(`a[href='/ghost/']`, 'Content', waitForWebview);
    },

    /**
     * Programmatically clicks the "Team" link in either a given or the currently visible
     * webview. Does nothing if such a link does not exist.
     *
     * @param {boolean} [waitForWebview] Should we wait for the webview to load?
     */
    openTeam(waitForWebview) {
        this.queryAndClick(`a[href*='/ghost/team/']`, 'Team', waitForWebview);
    },

    /**
     * Programmatically clicks the "General" link in either a given or the currently visible
     * webview. Does nothing if such a link does not exist.
     *
     * @param {boolean} [waitForWebview] Should we wait for the webview to load?
     */
    openSettingsGeneral(waitForWebview) {
        this.queryAndClick(`a[href*='/ghost/settings/general/']`, 'General', waitForWebview);
    },

    /**
     * Programmatically clicks the "Navigation" link in either a given or the currently visible
     * webview. Does nothing if such a link does not exist.
     *
     * @param {boolean} [waitForWebview] Should we wait for the webview to load?
     */
    openSettingsNavigation(waitForWebview) {
        this.queryAndClick(`a[href*='/ghost/settings/navigation/']`, 'Navigation', waitForWebview);
    },

    /**
     * Programmatically clicks the "Tags" link in either a given or the currently visible
     * webview. Does nothing if such a link does not exist.
     *
     * @param {boolean} [waitForWebview] Should we wait for the webview to load?
     */
    openSettingsTags(waitForWebview) {
        this.queryAndClick(`a[href*='/ghost/settings/tags/']`, 'Tags', waitForWebview);
    },

    /**
     * Programmatically clicks the "Code Injection" link in either a given or the currently visible
     * webview. Does nothing if such a link does not exist.
     *
     * @param {boolean} [waitForWebview] Should we wait for the webview to load?
     */
    openSettingsCodeInjection(waitForWebview) {
        this.queryAndClick(`a[href*='/ghost/settings/code-injection/']`, 'Code Injection', waitForWebview);
    },

    /**
     * Programmatically clicks the "Apps" link in either a given or the currently visible
     * webview. Does nothing if such a link does not exist.
     *
     * @param {boolean} [waitForWebview] Should we wait for the webview to load?
     */
    openSettingsApps(waitForWebview) {
        this.queryAndClick(`a[href*='/ghost/settings/apps/']`, 'Apps', waitForWebview);
    },

    /**
     * Programmatically clicks the "Labs" link in either a given or the currently visible
     * webview. Does nothing if such a link does not exist.
     *
     * @param {boolean} [waitForWebview] Should we wait for the webview to load?
     */
    openSettingsLabs(waitForWebview) {
        this.queryAndClick(`a[href*='/ghost/settings/labs/']`, 'Labs', waitForWebview);
    }
});
