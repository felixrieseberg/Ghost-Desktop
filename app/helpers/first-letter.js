import Ember from 'ember';

export function firstLetter(params) {
    return params[0].slice(0, 1);
}

export default Ember.Helper.helper(firstLetter);
