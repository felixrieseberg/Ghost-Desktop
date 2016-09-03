import { moduleFor, test } from 'ember-qunit';

moduleFor('service:webview-shortcuts', 'Unit | Service | webview shortcuts', {
    setup: function (assert) {
        const done = assert.async();
        const path = require('path');
        const findParentDir = require('find-parent-dir');
        const dirname = findParentDir.sync(__dirname, '.git');
        const src = path.join(dirname, 'tests', 'fixtures', 'static-shortcuts', 'shortcuts.html');

        $(`<webview src="${src}" width="300" height="300" id="gh-test-webview" nodeintegration></webview>`).appendTo('body');
        setTimeout(done, 1000);
    },

    teardown: function () {
        $('#gh-test-webview').remove();
    }
});

test('it exists', function (assert) {
    let service = this.subject();
    assert.ok(service);
});

test('queryAndClick() clicks an element', function (assert) {
    const done = assert.async();
    const service = this.subject();

    $('#gh-test-webview')
        .off('console-message')
        .on('console-message', (e) => {
            assert.equal(e.originalEvent.message, 'test-a');
            done();
        });

    service.queryAndClick('a#test-a');
});

test('openNewPost() clicks the correct link', function (assert) {
    const done = assert.async();
    const service = this.subject();

    $('#gh-test-webview')
        .off('console-message')
        .on('console-message', (e) => {
            assert.equal(e.originalEvent.message, 'new-post');
            done();
        });

    service.openNewPost();
});

test('openContent() clicks the correct link', function (assert) {
    const done = assert.async();
    const service = this.subject();

    $('#gh-test-webview')
        .off('console-message')
        .on('console-message', (e) => {
            assert.equal(e.originalEvent.message, 'content');
            done();
        });

    service.openContent();
});

test('openTeam() clicks the correct link', function (assert) {
    const done = assert.async();
    const service = this.subject();

    $('#gh-test-webview')
        .off('console-message')
        .on('console-message', (e) => {
            assert.equal(e.originalEvent.message, 'team');
            done();
        });

    service.openTeam();
});

test('openSettingsGeneral() clicks the correct link', function (assert) {
    const done = assert.async();
    const service = this.subject();

    $('#gh-test-webview')
        .off('console-message')
        .on('console-message', (e) => {
            assert.equal(e.originalEvent.message, 'general');
            done();
        });

    service.openSettingsGeneral();
});

test('openSettingsNavigation() clicks the correct link', function (assert) {
    const done = assert.async();
    const service = this.subject();

    $('#gh-test-webview')
        .off('console-message')
        .on('console-message', (e) => {
            assert.equal(e.originalEvent.message, 'navigation');
            done();
        });

    service.openSettingsNavigation();
});

test('openSettingsTags() clicks the correct link', function (assert) {
    const done = assert.async();
    const service = this.subject();

    $('#gh-test-webview')
        .off('console-message')
        .on('console-message', (e) => {
            assert.equal(e.originalEvent.message, 'tags');
            done();
        });

    service.openSettingsTags();
});

test('openSettingsCodeInjection() clicks the correct link', function (assert) {
    const done = assert.async();
    const service = this.subject();

    $('#gh-test-webview')
        .off('console-message')
        .on('console-message', (e) => {
            assert.equal(e.originalEvent.message, 'injection');
            done();
        });

    service.openSettingsCodeInjection();
});

test('openSettingsApps() clicks the correct link', function (assert) {
    const done = assert.async();
    const service = this.subject();

    $('#gh-test-webview')
        .off('console-message')
        .on('console-message', (e) => {
            assert.equal(e.originalEvent.message, 'apps');
            done();
        });

    service.openSettingsApps();
});

test('openSettingsLabs() clicks the correct link', function (assert) {
    const done = assert.async();
    const service = this.subject();

    $('#gh-test-webview')
        .off('console-message')
        .on('console-message', (e) => {
            assert.equal(e.originalEvent.message, 'labs');
            done();
        });

    service.openSettingsLabs();
});

test('openPreview() clicks the correct link', function (assert) {
    const done = assert.async();
    const service = this.subject();

    $('#gh-test-webview')
        .off('console-message')
        .on('console-message', (e) => {
            assert.equal(e.originalEvent.message, 'preview');
            done();
        });

    service.openPreview();
});
