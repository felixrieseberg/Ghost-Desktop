import DS from 'ember-data';
import getIconColor from '../utils/color-picker';
import requireKeytar from '../utils/require-keytar';
import getBlogName from '../utils/get-blog-name';

/*eslint-disable no-unused-vars*/
const {Model, attr, hasMany} = DS;
/*eslint-enable no-unused-vars*/

export default DS.Model.extend({
    name: attr('string'),
    url: attr('string'),
    identification: attr('string'),
    isSelected: attr('boolean'),
    iconColor: attr('string', {
        defaultValue: () => getIconColor(null)
    }),

    /**
     * Convenience method, marking the blog as selected (and saving)
     */
    select() {
        if (this.isDestroying || this.isDestroyed || this.get('isDeleted')) {
            return;
        }

        this.set('isSelected', true);
        this.save();
    },

    /**
     * Convenience method, marking the blog as unselected (and saving)
     */
    unselect() {
        if (this.isDestroying || this.isDestroyed || this.get('isDeleted')) {
            return;
        }

        this.set('isSelected', false);
        this.save();
    },

    /**
     * Convenience method, generates a nice icon color for this blog.
     */
    randomIconColor(excluding=null) {
        let newColor = getIconColor(excluding);

        if (newColor === this.get('iconColor')) {
            return this.randomIconColor(excluding);
        } else {
            this.set('iconColor', newColor);
        }
    },

    /**
     * Uses the operating system's native credential store to set the password
     * for this blog.
     * @param {string} value - Password to set
     */
    setPassword(value) {
        let keytar = requireKeytar();
        return (keytar ? keytar.replacePassword(this.get('url'), this.get('identification'), value) : false);
    },

    /**
     * Uses the operating system's native credential store to get the password
     * for this blog.
     * @return {string} Password for this blog
     */
    getPassword() {
        if (!this.get('url') || !this.get('identification')) {
            return null;
        }

        let keytar = requireKeytar();
        return (keytar ? keytar.getPassword(this.get('url'), this.get('identification')) : null);
    },

    /**
     * Updates this blog's name by attempting to fetch the blog homepage
     * and extracting the name
     */
    updateName() {
        let url = this.get('url');

        if (url) {
            return getBlogName(url)
                .then((name) => this.set('name', name))
                .catch((e) => console.log(e));
        }
    },

    /**
     * Delete the password while deleting the blog.
     * Todo: DeleteRecord isn't persisted, meaning that if we ever
     * call this and then pretend that we never meant to delete stuff,
     * the password will still be gone.
     */
    deleteRecord() {
        this._super();

        let keytar = requireKeytar();
        return (keytar ? keytar.deletePassword(this.get('url'), this.get('identification')) : null);
    }
});
