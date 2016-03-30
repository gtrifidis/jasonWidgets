/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/**
 * jasonWidgets Event Manager
 * @constructor
 * @description Auxilary class, that manages events for the widgets.
 * @memberOf Common
 */
function jasonEventManager() {
    this.eventListeners = new Array();
    jasonEventManager.prototype.mouseEnterLeaveHandler = function (mouseEvent,element) {
        var relatedElement = mouseEvent.relatedTarget;
        if (!relatedElement || (relatedElement !== element && !jasonWidgets.common.contains(element, relatedElement))) {
            var eventName;
            if (mouseEvent.type == "mouseover" || mouseEvent.type == "pointerover")
                eventName = "mouseenter";
            if (mouseEvent.type == "mouseout" || mouseEvent.type == "pointerout")
                eventName = "mouseleave";
            this.triggerEvent(eventName, element, mouseEvent);
        }
    }
    /**
     * Adds an event listener on an element
     * @param {object} element - HTMLElement. The element to set the event.
     * @param {string} eventName - Name of the event.
     * @param {function} listener - Listener function.
     * @param {boolean} stopPropagation - If false does not propagate the event. 
     */
    jasonEventManager.prototype.addEventListener = function (element, eventName, listener,useCurrentTarget) {
        var self = this;
        if (!element._jasonWidgetsEventListeners_)
            element._jasonWidgetsEventListeners_ = [];

        if (element._jasonWidgetsEventListeners_.indexOf(eventName) < 0) {
            var defaultEventName = eventName;
            var defaultEventListener = function (event) {
                self.triggerEvent(eventName, useCurrentTarget ? event.currentTarget : event.target, event)
            }
            //var mouseEnterLeaveEventListener = function (event) {
            //    self.mouseEnterLeaveHandler(event, element);
            //}
            //if (eventName == MOUSE_ENTER_EVENT && !jasonWidgets.common.objectHasProperty(window,"onmouseenter")) {
            //    defaultEventListener = mouseEnterLeaveEventListener;
            //    defaultEventName = MOUSE_OVER_EVENT;
            //}

            //if (eventName == MOUSE_LEAVE_EVENT && !jasonWidgets.common.objectHasProperty(window, "onmouseleave")) {
            //    defaultEventListener = mouseEnterLeaveEventListener;
            //    defaultEventName = MOUSE_OUT_EVENT;
            //}
            
            element.addEventListener(defaultEventName, defaultEventListener);
        }
        var evntListener = {
            element: element,
            eventName: eventName,
            listener: listener
        };

        this.eventListeners.push(evntListener);
        element._jasonWidgetsEventListeners_.push(evntListener);
    }
    /**
     * Triggers an event.
     * @param {string} eventName - Name of the event.
     * @param {object} sender - Event sender. The sender is always the widget that triggered the event.
     */
    jasonEventManager.prototype.triggerEvent = function (eventName, sender, event) {
        var eventListener = this.eventListeners.filter(function (evntListener) {
            return (evntListener.eventName == eventName && evntListener.element == sender)
        })[0];
        if (eventListener) {
            if (typeof eventListener.listener == "function")
                eventListener.listener(event, sender);
            else
                new Error("event listener is not a function");
        }
    }
        /**
         * Clears all event manager events.
         */
    jasonEventManager.prototype.clearEvents = function () {
        this.eventListeners.forEach(function (evntListener) {
            if (evntListener.element) {
                evntListener.element.removeEventListener(evntListener.eventName, evntListener.listener);
                evntListener.element._jasonWidgetsEventListeners_ = null;
    }
        });
        this.eventListeners =[];

    }



    this.triggerEvent = this.triggerEvent.bind(this);
    this.mouseEnterLeaveHandler = this.mouseEnterLeaveHandler.bind(this);
}

var jwDocumentEventManager = { eventListeners: [], _internalListeners_: [] };
var jwWindowEventManager = { eventListeners: [], _internalListeners_: [] };

jwDocumentEventManager.addDocumentEventListener = function (eventName, listener) {
    var documentEventListenerExists = jwDocumentEventManager._internalListeners_.filter(function (eventListener) {
        return eventListener.event == eventName;
    })[0];
    if (!documentEventListenerExists) {
        jwDocumentEventManager.eventListeners.push({ event: eventName, listener: listener });
        document.addEventListener(eventName, function (documentEvent) {
            for (var i = 0; i <= jwDocumentEventManager.eventListeners.length - 1; i++) {
                if (jwDocumentEventManager.eventListeners[i].event == documentEvent.type) {
                    jwDocumentEventManager.eventListeners[i].listener(documentEvent);
                }
            }
        });
    }
}

jwDocumentEventManager.removeDocumentEventListener = function (eventName, listener) {
    var documentEventListenerExists = jwDocumentEventManager._internalListeners_.filter(function (eventListener) {
        return eventListener.event == eventName;
    })[0];
    if (documentEventListenerExists) {
        var indexToRemove = -1;
        for (var i = 0; i <= jwDocumentEventManager.eventListeners.length - 1; i++) {
            if (documentEventListenerExists.event == eventName && documentEventListenerExists.listener == listener) {
                indexToRemove = i;
                break;
            }
        }
        if (indexToRemove >= 0) {
            jwDocumentEventManager.eventListeners.splice(i, 1);
        }
    }
}

jwWindowEventManager.addWindowEventListener = function (eventName, listener) {
    var windowEventListenerExists = jwWindowEventManager._internalListeners_.filter(function (eventListener) {
        return eventListener.event == eventName;
    })[0];
    if (!windowEventListenerExists) {
        jwWindowEventManager.eventListeners.push({ event: eventName, listener: listener });
        window.addEventListener(eventName, function (windowEvent) {
            for (var i = 0; i <= jwWindowEventManager.eventListeners.length - 1; i++) {
                if (jwWindowEventManager.eventListeners[i].event == windowEvent.type) {
                    jwWindowEventManager.eventListeners[i].listener(windowEvent);
                }
            }
        });
    }
}

jwWindowEventManager.removeDocumentEventListener = function (eventName, listener) {
    var windowEventListenerExists = jwWindowEventManager._internalListeners_.filter(function (eventListener) {
        return eventListener.event == eventName;
    })[0];
    if (windowEventListenerExists) {
        var indexToRemove = -1;
        for (var i = 0; i <= jwWindowEventManager.eventListeners.length - 1; i++) {
            if (windowEventListenerExists.event == eventName && windowEventListenerExists.listener == listener) {
                indexToRemove = i;
                break;
            }
        }
        if (indexToRemove >= 0) {
            jwWindowEventManager.eventListeners.splice(i, 1);
        }
    }
}

