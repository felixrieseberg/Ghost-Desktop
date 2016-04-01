import fetchContributors from 'ghost-desktop/utils/fetch-contributors';
import {contributorsResponse, brokenContributorsResponse, nameResponse} from '../../fixtures/contributor-response';
import {
    module, test
}
from 'qunit';

module('Unit | Utility | fetch contributors');

test('it fetches contributors and composes them correctly', function(assert) {
    const qasync = assert.async();
    const oldFetch = window.fetch;
    const expectedResult = [
        {
            name: 'testname',
            url: 'https://github.com/felixrieseberg',
            api: 'https://api.github.com/users/test',
            login: 'felixrieseberg'
        },
        {
            name: 'testname',
            url: 'https://github.com/bnookala',
            api: 'https://api.github.com/users/test',
            login: 'bnookala'
        },
        {
            name: 'testname',
            url: 'https://github.com/JohnONolan',
            api: 'https://api.github.com/users/test',
            login: 'JohnONolan'
        },
    ];
    const returnContributors = function () {
        return new Promise((resolve) => {
            resolve({
                json: function () {
                    return new Promise((_resolve) => _resolve(contributorsResponse));
                }
            })
        });
    };
    const returnName = function () {
        return new Promise((resolve) => {
            resolve({
                json: function () {
                    return new Promise((_resolve) => _resolve(nameResponse));
                }
            })
        })
    }

    // Prep
    window.fetch = function (url) {
        if (url === 'https://api.github.com/repos/TryGhost/Ghost-Desktop/contributors') {
            return returnContributors();
        } else if (url === 'https://api.github.com/users/test') {
            return returnName();
        } else {
            console.log('ohoh', url);
            assert.ok(false);
        }
    };

    // Test
    fetchContributors().then((result) => {
        assert.deepEqual(result, expectedResult);
        
        // Reset
        window.fetch = oldFetch;
        
        qasync();
    });
});

test('it returns the login if an api link is not found', function(assert) {
    const qasync = assert.async();
    const oldFetch = window.fetch;
    const expectedResult = [
        {
            name: 'felixrieseberg',
            url: 'https://github.com/felixrieseberg',
            api: '',
            login: 'felixrieseberg'
        }
    ];
    const returnContributors = function () {
        return new Promise((resolve) => {
            resolve({
                json: function () {
                    return new Promise((_resolve) => _resolve(brokenContributorsResponse));
                }
            })
        });
    };
    
    // Prep
    window.fetch = function (url) {
        if (url === 'https://api.github.com/repos/TryGhost/Ghost-Desktop/contributors') {
            return returnContributors();
        }
    };

    // Test
    fetchContributors().then((result) => {
        assert.deepEqual(result, expectedResult);
        
        // Reset
        window.fetch = oldFetch;
        
        qasync();
    });
});

test('it returns the login if hitting the api link fails', function(assert) {
    const qasync = assert.async();
    const oldFetch = window.fetch;
    const expectedResult = [
        {
            name: 'felixrieseberg',
            url: 'https://github.com/felixrieseberg',
            api: 'https://api.github.com/users/test',
            login: 'felixrieseberg'
        }
    ];
    const response = brokenContributorsResponse;
    response[0].url = 'https://api.github.com/users/test';
    
    const returnContributors = function () {
        return new Promise((resolve) => {
            resolve({
                json: function () {
                    return new Promise((_resolve) => _resolve(brokenContributorsResponse));
                }
            })
        });
    };
    
    // Prep
    window.fetch = function (url) {
        if (url === 'https://api.github.com/repos/TryGhost/Ghost-Desktop/contributors') {
            return returnContributors();
        } else if (url === 'https://api.github.com/users/test') {
            return new Promise((resolve, reject) => reject({err: 'err'}));
        }
    };

    // Test
    fetchContributors().then((result) => {
        assert.deepEqual(result, expectedResult);
        
        // Reset
        window.fetch = oldFetch;
        
        qasync();
    });
});

test('it returns undefined if the first fetch fails', function(assert) {
    const qasync = assert.async();
    const oldFetch = window.fetch;

    // Prep
    window.fetch = function (url) {
        return new Promise((resolve, reject) => reject({err: 'err'}));
    };

    // Test
    fetchContributors().then((result) => {
        assert.equal(result, undefined);
        
        // Reset
        window.fetch = oldFetch;
        
        qasync();
    });
});