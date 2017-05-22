/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


jasonElementDragger.prototype = Object.create(jasonBaseWidget.prototype);
jasonElementDragger.prototype.constructor = jasonElementDragger;


/**
 * jasonWidgets resize manager
 * @constructor
 * @description Auxiliary class, that manages drag and drop for HTMLElements.
 * @memberOf Common
 */
function jasonElementDragger(htmlElement, options, nameSpace) {
    this.defaultOptions = {
        changeCursor: true
    };
    jasonBaseWidget.call(this, nameSpace, htmlElement, options, null);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onWindowMouseMove = this._onWindowMouseMove.bind(this);
    this._dragElement = this._dragElement.bind(this);
    this._mouseMoveEvent = null;
    this._dragging = false;
    this._initializeEvents();
    this._startX = null;
    this._startY = null;
    this._elementRect = null;
    this._dragElement();
}
/**
 * Event initialization.
 */
jasonElementDragger.prototype._initializeEvents = function () {
    jwWindowEventManager.addWindowEventListener(jw.DOM.events.MOUSE_UP_EVENT, this._onMouseUp);
    jwWindowEventManager.addWindowEventListener(jw.DOM.events.TOUCH_END_EVENT, this._onTouchEnd);
    jwWindowEventManager.addWindowEventListener(jw.DOM.events.MOUSE_MOVE_EVENT, this._onWindowMouseMove);
    this.htmlElement.addEventListener(jw.DOM.events.MOUSE_DOWN_EVENT, this._onMouseDown);
    this.htmlElement.addEventListener(jw.DOM.events.MOUSE_MOVE_EVENT, this._onMouseMove);
}
/**
 * Keeping track of the mouse move event.
 */
jasonElementDragger.prototype._onWindowMouseMove = function (event) {
    this._mouseMoveEvent = event;
}
/**
 * Mouse move event over the htmlElement, to change cursor if needed.
 */
jasonElementDragger.prototype._onMouseMove = function (event) {
    if(this.options.changeCursor)
        this.htmlElement.style.cursor = "move";
}
/**
 * Mouse down event on the htmlElement. It initiates the dragging.
 */
jasonElementDragger.prototype._onMouseDown = function (event) {
    if (event.button == 0) {
        this._elementRect = this.htmlElement.getBoundingClientRect();
        this._dragging = true;
        this._startX = event.clientX;
        this._startY = event.clientY;
        this._mouseMoveEvent = event;
        this._dragElement();
    }
}
/**
 * On window mouse up, stop dragging
 */
jasonElementDragger.prototype._onMouseUp = function (event) {
    if (this._dragging) {
        this._dragging = false;
        event.preventDefault();
        event.stopPropagation();
        this.triggerEvent(jw.DOM.events.DRAG_OVER_EVENT, event);
    }
}
/**
 * On window touch end, stop dragging
 */
jasonElementDragger.prototype._onTouchEnd = function (event) {
    this._onMouseUp(event);
}
/**
 * On destroy, remove all event listeners.
 */
jasonElementDragger.prototype.destroy = function () {
    jwWindowEventManager.removeWindowEventListener(jw.DOM.events.MOUSE_UP_EVENT, this._onMouseUp);
    jwWindowEventManager.removeWindowEventListener(jw.DOM.events.TOUCH_END_EVENT, this._onTouchEnd);
    jwWindowEventManager.removeWindowEventListener(jw.DOM.events.MOUSE_MOVE_EVENT, this._onWindowMouseMove);
    this.htmlElement.removeEventListener(jw.DOM.events.MOUSE_DOWN_EVENT, this._onMouseDown);
    this.htmlElement.removeEventListener(jw.DOM.events.MOUSE_MOVE_EVENT, this._onMouseMove);
}
/**
 * Where actually the dragging takes place.
 */
jasonElementDragger.prototype._dragElement = function () {
    if (this._dragging && this.enabled) {
        window.requestAnimationFrame(this._dragElement);
        var newLeft = this._elementRect.left + (this._mouseMoveEvent.clientX - this._startX);
        var newTop = this._elementRect.top + (this._mouseMoveEvent.clientY - this._startY);

        this.htmlElement.style.left = newLeft + "px";
        this.htmlElement.style.top = newTop + "px";
    }
}