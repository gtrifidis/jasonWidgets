/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/**
 * jasonWidgets Event Manager
 */
function jasonEventManager() {
    jasonEventManager.eventListeners = new Array();

    /**
     * Adds an event listener on an element
     * @param {object} element - HTMLElement. The element to set the event.
     * @param {string} eventName - Name of the event.
     * @param {object} listener - 
     * @param {boolean} stopPropagation - If false does not propagate the event. 
     */
    jasonEventManager.AddEventListener = function (element, eventName, listener, stopPropagation) {
        var self = this;
        if (!element._jasonWidgetsEventListeners_)
            element._jasonWidgetsEventListeners_ = [];

        if (element._jasonWidgetsEventListeners_.indexOf(eventName) < 0) {
            element.addEventListener(eventName, function (event) {
                self.TriggerEvent(event.name,event.target,event)
            });
        }
        this.eventListeners.push({
            element:element,
            eventName: eventName,
            listener:listener
        });
    }
    /**
     * Triggers an event.
     * @param {string} eventName - Name of the event.
     * @param {object} sender - Event sender.
     */
    jasonEventManager.TriggerEvent = function (eventName, sender, event) {
        this.eventListeners.forEach(function (eventListener) {
            if (eventListener.eventName == eventName && eventListener.element == sender) {
                eventListener.listener(event,sender);
            }
        });
    }
    /**
     * Clears all event manager events.
     */
    jasonEventManager.ClearEvents = function () { this.eventListeners = []; }
    return jasonEventManager;
}