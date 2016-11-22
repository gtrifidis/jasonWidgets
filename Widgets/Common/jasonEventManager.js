/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/**
 * jasonWidgets Event Manager
 * @constructor
 * @description Auxilary class that manages events for the widgets.
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
     * Adds an event listener on an element.
     * @param {object} element - HTMLElement. The element to set the event.
     * @param {string} eventName - Name of the event.
     * @param {function} listener - Listener function.
     * @param {boolean} stopPropagation - If true, does not propagate the event.
     */
    jasonEventManager.prototype.addEventListener = function (element, eventName, listener,useCurrentTarget,useCapture) {
        var self = this;
        if (element.nodeType == void 0)
            jw.common.throwError(jw.errorTypes.error, "Element is not a HTMLElement");
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
            //if (eventName == jw.DOM.events.MOUSE_ENTER_EVENT && !jasonWidgets.common.objectHasProperty(window,"onmouseenter")) {
            //    defaultEventListener = mouseEnterLeaveEventListener;
            //    defaultEventName = jw.DOM.events.MOUSE_OVER_EVENT;
            //}

            //if (eventName == jw.DOM.events.MOUSE_LEAVE_EVENT && !jasonWidgets.common.objectHasProperty(window, "onmouseleave")) {
            //    defaultEventListener = mouseEnterLeaveEventListener;
            //    defaultEventName = jw.DOM.events.MOUSE_OUT_EVENT;
            //}
            useCapture = useCapture === void 0 ? false : useCapture;
            element.addEventListener(defaultEventName, defaultEventListener,useCapture);
        }
        var evntListener = {
            element: element,
            eventName: eventName,
            listener: listener,
            enabled: true,
            uid:jw.common.generateUUID()
        };

        this.eventListeners.push(evntListener);
        element._jasonWidgetsEventListeners_.push(evntListener);
        return evntListener.uid;
    }
    /**
     * Triggers an event.
     * @param {string} eventName - Name of the event.
     * @param {object} sender - Event sender. The sender is always the widget that triggered the event.
     */
    jasonEventManager.prototype.triggerEvent = function (eventName, sender, event) {
        var eventListener = this.eventListeners.filter(function (evntListener) {
            return (evntListener.eventName == eventName && evntListener.element == sender && evntListener.enabled)
        })[0];
        if (eventListener) {
            if (typeof eventListener.listener == "function") {
                eventListener.listener(event, sender);
                if (this._debug)
                    console.log(eventListener);
            }
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
    this._debug = false;
}

var jwDocumentEventManager = (function () {
    //using the internal listeners array helps us add only one listener to the document element per event
    //but add as many eventlisteners as we want. 
    var eventListeners = [],
        internalListeners = [];
    return {
        addDocumentEventListener: function (eventName, listener) {
            var documentEventListenerExists = internalListeners.filter(function (eventListener) {
                return eventListener.event == eventName;
            })[0];
            var newListener = { event: eventName, listener: listener, enabled: true, uid: jw.common.generateUUID() };
            eventListeners.push(newListener);
            if (!documentEventListenerExists) {
                internalListeners.push(newListener);
                document.addEventListener(eventName, function (documentEvent) {
                    for (var i = 0; i <= eventListeners.length - 1; i++) {
                        if (eventListeners[i].event == documentEvent.type && eventListeners[i].enabled) {
                            eventListeners[i].listener(documentEvent);
                        }
                    }
                });
            }
            return eventListeners[eventListeners.length - 1].uid;
        },
        removeDocumentEventListener: function (uid) {
            for (var i = 0; i <= eventListeners.length - 1; i++) {
                if (eventListeners[i].uid.toLowerCase() == uid.toLowerCase()) {
                    document.removeEventListener(eventListeners[i].event, eventListeners[i].listener);
                    break;
                }
            }
            eventListeners.splice(i, 1);
        },
        enableEventListeners: function (enabled) {
            eventListeners.forEach(function (evnt) { evnt.enabled = enabled; });
        }
    }
}());

var jwWindowEventManager = (function () {
    //using the internal listeners array helps us add only one listener to the window object per event
    //but add as many eventlisteners as we want. 
    var eventListeners = [],
        internalListeners = [],
        running = false,
        resizeEvent = null;
    //runs all event listeners for a resize event.
    var runResizeCallbacks = function () {
        var resizeCallbacks = eventListeners.filter(function (listener) { return listener.event.toLowerCase() == "resize"});
        resizeCallbacks.forEach(function (resizeCallback) {
            resizeCallback.listener(resizeEvent);
        });
        running = false;
    }
    //runs all event listeners for a repaint event.
    var runRepaintCallbacks = function () {
        var repaintCallbacks = eventListeners.filter(function (listener) { return listener.event.toLowerCase() == "repaint" });
        repaintCallbacks.forEach(function (repaintCallback) {
            repaintCallback.listener(resizeEvent);
        });
        running = false;
    }
    //window resize event callback
    var windowResize = function (event) {
        if (!running)
            running = true;
        resizeEvent = event;
        window.requestAnimationFrame(runResizeCallbacks);
    }

    //window resize event callback
    var windowRepaint = function (event) {
        if (!running)
            running = true;
        resizeEvent = event;
        window.requestAnimationFrame(runRepaintCallbacks);
        window.requestAnimationFrame(windowRepaint);
    }

    return {
        addWindowEventListener: function (eventName, listener, useCapture) {
            var windowEventListenerExists = internalListeners.filter(function (eventListener) {
                return eventListener.event == eventName;
            })[0];
            var newListener = { event: eventName, listener: listener, enabled: true, uid: jw.common.generateUUID() };
            eventListeners.push(newListener);
            if (!windowEventListenerExists) {
                internalListeners.push(newListener);

                // if the event is a resize event, then implicitly use optimized code
                // regarding resize event with requestAnimationFrame
                if (eventName.toLowerCase() == "resize" || eventName.toLowerCase() == "repaint") {
                    if (eventName.toLowerCase() == "resize")
                        window.addEventListener(eventName, windowResize, useCapture);
                    else {
                        window.requestAnimationFrame(windowRepaint);
                    }
                        
                } else {
                    window.addEventListener(eventName, function (windowEvent) {
                        for (var i = 0; i <= eventListeners.length - 1; i++) {
                            if (eventListeners[i].event == windowEvent.type && eventListeners[i].enabled) {
                                eventListeners[i].listener(windowEvent);
                            }
                        }
                    }, useCapture);
                }
            }
            return eventListeners[eventListeners.length - 1].uid;
        },
        removeWindowEventListener: function (uid) {
            for (var i = 0; i <= eventListeners.length - 1; i++) {
                if (eventListeners[i].uid.toLowerCase() == uid.toLowerCase()) {
                    window.removeEventListener(eventListeners[i].event, eventListeners[i].listener);
                    break;
                }
            }
            eventListeners.splice(i, 1);
        },
        enableEventListeners: function (enabled) {
            eventListeners.forEach(function (evnt) { evnt.enabled = enabled; });
        }
    }
}());


