import Ember from 'ember';

export default function findVisibleWebview() {
    const $visibleWebviews = [...Ember.$('webview:visible')].filter((i) => Ember.$(i).height() > 0);
    const $webview = ($visibleWebviews.length > 0) ? $visibleWebviews[0] : undefined;

    return $webview;
}
