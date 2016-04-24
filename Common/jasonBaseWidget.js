/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @class
 * @name jasonWidgetEvent
 * @memberOf Common
 * @description The jasonWidgetEvent is a construct that jasonWidgets consumers can use to register event listeners to a widget.
 * @property {string} eventName - Name of the event.
 * @property {function} listener - Callback function that will be called when the event is triggered. List of params will differ based on the event.
 * @property {object=} callingContext - If defined, calls the listener using its value as the calling context.
 */

/**
 * @class
 * @name jasonWidgetOptions
 * @description Configuration for a jason widget.
 * @memberOf Common
 * @property {Common.jasonWidgetEvent[]} events - Widget's events.
 * @property {object} customization - Widget's customization configuration.
 */

/**
 * Base class for all jasonWidgets
 * @constructor
 * @memberOf Common
 * @description The base class for all jason widgets. It has no UI logic, simply the widget's logic.
 * @param {string} [nameSpace = undefined] nameSpace
 * @param {HTMLElement} htmlElement - HTMLElement that the widget will be attached to.
 * @property {boolean} enabled - Gets/sets widget's enabled state.
 * @property {boolean} visible - Gets/sets widget's visible state.
 * @property {boolean} readonly - Gets/sets widget's readonly state.
 */
function jasonBaseWidget(nameSpace, htmlElement,options,uiHelper) {
        this.htmlElement = htmlElement;
        this.nameSpace = nameSpace;
        this._emptyDefaultOptions = { events: [], customization: {}, dataIsSimpleJS:true };
        this._enabled = true;
        this._visible = true;
        this._readOnly = false;
        this._uid = jw.common.generateUUID();
        jw.common._registerWidget(this);
        

        if (this.defaultOptions)
            jasonWidgets.common.extendObject(this._emptyDefaultOptions, this.defaultOptions);
        else
            this.defaultOptions =  this._emptyDefaultOptions;

        if (!options)
            options = {};



        jasonWidgets.common.extendObject(this.defaultOptions, options);

        this._eventListeners = options.events ? options.events : [];
        
        this.options = options;
        this.options.localization = this.options.localization ? this.options.localization : jasonWidgets.localizationManager.currentLanguage;

        this.eventManager = new jasonEventManager();
        this.baseClassName = "jasonWidget";
        if (this.htmlElement) {
            jasonWidgets.common.setData(this.htmlElement, this.nameSpace, this);
            this.htmlElement.classList.add(this.baseClassName);
        }

        

        this.jwProc = this.jwProc.bind(this);
        this.ui = typeof uiHelper == "function" ? new uiHelper(this, htmlElement) : new jasonBaseWidgetUIHelper(this);

        jw.common.addGlobalEventListener(this.jwProc);

        return jasonBaseWidget;
}
/**
 * Widget initialization code.
 * @abstract
 */
jasonBaseWidget.prototype.initialize = function () {

}
/**
 * @ignore
 */
jasonBaseWidget.prototype.createEventNameSpace = function (eventName) {
    return eventName + "." + this.nameSpace;
}
/**
 * @ignore
 */
jasonBaseWidget.prototype.addBaseClassName = function (element) {
    element.classList.add(this.baseClassName);
}
/**
 * Add an event listener for the widget's event.
 * @param {string} eventName - Name of the event.
 * @param {function} listener - Event listener.
 */
jasonBaseWidget.prototype.addEventListener = function (eventName, eventListener,callingContext) {
    if (typeof eventListener == "function")
        this._eventListeners.push({ eventName: eventName, listener: eventListener, callingContext: callingContext });
}
/**
 * Clean up code, both for UI and widget.
 */
jasonBaseWidget.prototype.destroy = function () {
    this.ui.clearUI();
}
/**
 * Backwards compatibility function.
 * @ignore
 */
jasonBaseWidget.prototype.createElement = function (elementTagName, addItToList) {
    return this.ui.createElement(elementTagName, addItToList);
}
/**
 * JasonWidgets global event listener.
 * @param {number} eventCode - event code.
 * @param {any} eventData - event data.
 */
jasonBaseWidget.prototype.jwProc = function (eventCode, eventData) {
    switch (eventCode) {
        case JGE_REDRAW: {
            this.ui.renderUI();
            break;
        }
    }
}
/**
 * Triggers a widget's event.
 * @param {string} eventName - Name of the event.
 * @param {object} eventData - Event's data.
 * @param {function} eventTriggeredCallback - Callback to be executed when all listeners are notified.
 */
jasonBaseWidget.prototype.triggerEvent = function (eventName,eventData,eventTriggeredCallback) {
    var listeners = this._eventListeners.filter(function (eventListener) {
        return eventListener.eventName == eventName && eventListener.listener;
    });
    for (var i = 0; i <= listeners.length - 1; i++) {
        var listenerObject = listeners[i];
        if (listenerObject.callingContext)
            listenerObject.listener.call(listenerObject.callingContext, this, eventData);
        else
            listenerObject.listener(this, eventData);
    }
    if (eventTriggeredCallback != void 0)
        eventTriggeredCallback();
}
/**
 * Updates the widget options. Descendants will implement this in order for the widgets
 * to dynamically react to option changes.
 * @abstract
 * @param {object} options - Widget's options object.
 */
jasonBaseWidget.prototype.updateOptions = function (options) {

}
//
Object.defineProperty(jasonBaseWidget.prototype, "enabled", {
    get: function () {
        return this._enabled;
    },
    set:function(value){
        this._enabled = value;
        this.ui._setEnable(this._enabled);
    },
    enumerable: true,
    configurable: false
});
//
Object.defineProperty(jasonBaseWidget.prototype, "visible", {
    get: function () {
        return this._visible;
    },
    set: function (value) {
        this._visible = value;
        this.ui._setVisible(this._visible);
    },
    enumerable: true,
    configurable: false
});
//
Object.defineProperty(jasonBaseWidget.prototype, "readOnly", {
    get: function () {
        return this._readOnly;
    },
    set: function (value) {
        this._readOnly = value;
        this.ui._setReadOnly(this._readOnly);
    },
    enumerable: true,
    configurable: false
});

/**
 * Base class for all jasonWidget UI helpers.
 * @constructor
 * @name jasonBaseWidgetUIHelper
 * @memberOf Common
 * @description The base class for all jasonWidgets UI helpers. It has all the UI logic that widgets need.Events, DOM creation, etc.
 * @param {Common.jasonWidgetBase} widget - jasonWidget.
 * @param {HTMLElement} htmlElement - HTMLElement that the widget will be attached to.
 * @property {Common.jasonWidgetOptions} options - widgets options.
 * @property {Common.jasonEventManager} eventManager - event manager.
 */
function jasonBaseWidgetUIHelper(widget,htmlElement) {
    this.widget = widget;
    this.htmlElement = htmlElement;
    this.createdElements = new Array();
}

Object.defineProperty(jasonBaseWidgetUIHelper.prototype, "options", {
    get: function () {
        return this.widget.options;
    },
    enumerable: false,
    configurable: false
});

Object.defineProperty(jasonBaseWidgetUIHelper.prototype, "eventManager", {
    get: function () {
        return this.widget.eventManager;
    },
    enumerable: false,
    configurable: false
});
/**
 * Creates a DOM element.
 * @param {string} elementTagName - element tag name. For example "DIV"
 * @param {boolean} addItToList - if true it adds the element to a list it has created.
 */
jasonBaseWidgetUIHelper.prototype.createElement = function (elementTagName, addItToList) {
    var result = document.createElement(elementTagName);
    if (addItToList == true)
        this.createdElements.push(result);
    return result;
}
/**
 * Creates a text node DOM element.
 * @param {string} text - element text.
 * @param {boolean} addItToList - if true it adds the element to a list it has created.
 */
jasonBaseWidgetUIHelper.prototype.createTextNode = function (text, addItToList) {
    var result = document.createTextNode(text);
    if (addItToList == true)
        this.createdElements.push(result);
    return result;
}
/**
 * Creates the jasonWidgets element container.
 */
jasonBaseWidgetUIHelper.prototype.createWidgetContainer = function (elementTagName) {
    elementTagName = elementTagName ? elementTagName : "div";
    var result = this.createElement(elementTagName);
    result.classList.add(this.widget.baseClassName);
    return result;
}
/**
 * Renders the widget's UI.
 * @abstract
 */
jasonBaseWidgetUIHelper.prototype.renderUI = function () {
}
/**
 * Removes all UI elements from the DOM
 */
jasonBaseWidgetUIHelper.prototype.clearUI = function () {
    if (this.htmlElement) {
        var parent = this.htmlElement.parent;
        parent.removeChild(this.htmlElement);
        this.createdElements = [];
    }
}
/**
 * Localizes the widget's UI.
 * @abstract
 */
jasonBaseWidgetUIHelper.prototype.localizeStrings = function (localizationObject) {

}
/**
 * Sets the widgets enabled state.
 * @ignore
 * @param {boolean} enable - enabled value
 */
jasonBaseWidgetUIHelper.prototype._setEnable = function (enable) {
    if (this.htmlElement) {
        if (enable)
            this.htmlElement.classList.remove(JW_DISABLED);
        else
            this.htmlElement.classList.add(JW_DISABLED);
    }
}
/**
 * Sets the widgets visible state.
 * @ignore
 * @param {boolean} visible - visible value
 */
jasonBaseWidgetUIHelper.prototype._setVisible = function (visible) {
    if (this.htmlElement) {
        if (visible)
            this.htmlElement.style.display = "";
        else
            this.htmlElement.style.display = "none";
    }
}
/**
 * Sets the widgets readOnly state.
 * @ignore
 * @param {boolean} readOnly - readOnly value
 */
jasonBaseWidgetUIHelper.prototype._setReadOnly = function (readOnly) {
    if (this.htmlElement) {
        if (readOnly)
            this.htmlElement.classList.remove(JW_READONLY);
        else
            this.htmlElement.classList.add(JW_READONLY);
    }
}