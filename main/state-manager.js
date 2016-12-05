const EventEmitter = require('events');
const debug = require('debug-electron')('ghost-desktop:main:state');

let instance;

/**
 * A state manager capable of emitting events every time
 * a new value is set. It is also able to replay events
 * where it makes sense.
 *
 * @event set-${property}
 * @type {Object}
 * @property {any} previousValue - The previous value prior to the change
 * @property {any} newValue - The value that will be set
 *
 * @class StateManager
 * @fires set-${property}
 * @extends {EventEmitter}
 */
class StateManager extends EventEmitter {
    /**
     * Returns a singleton instance of StateManager
     */
    constructor() {
        if (instance) return instance;

        super();

        /**
         * A Proxy handler that intercepts set operations,
         * emitting them to any listeners.
         */
        const stateHandler = {
            set(target, property, newValue /* receiver */) {
                debug(`Called "set" on state: Property: ${property}; Value ${newValue}`);

                instance.emit(`set-${property}`, {
                    previousValue: target[property],
                    newValue
                });

                target[property] = newValue;

                return true;
            }
        }

        this.state = new Proxy({}, stateHandler);
        this.on('newListener', this.handleNewListener);

        instance = this;
    }

    /**
     * Will be passed the event name and a reference to the listener being added.
     * This is useful because it allows us to replay the last value for certain
     * events.
     *
     * @param {String|Symbol} eventName
     * @param {Function} listener
     */
    handleNewListener(eventName, listener) {
        // If someone asked for the 'main-window' listener and the window
        // is already ready, let's just respond right away
        if (eventName === 'set-main-window-ready' && this.state['main-window-ready']) {
            listener(true);
        }
    }
}

module.exports = new StateManager();
