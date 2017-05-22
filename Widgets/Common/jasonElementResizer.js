/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


jasonElementResizer.prototype = Object.create(jasonBaseWidget.prototype);
jasonElementResizer.prototype.constructor = jasonElementResizer;


/**
 * @event Common.jasonElementResizer#onElementResized
 * @type {object}
 * @property {Common.jasonElementResizer} sender - The jasonElementResizer instance.
 * @property {HTMLElement} value - The resized element.
 */

/**
 * jasonWidgets resize manager
 * @constructor
 * @description Auxiliary class, that manages resizing for HTMLElements.
 * @memberOf Common
 */
function jasonElementResizer(htmlElement, options, nameSpace) {
    this.defaultOptions = {
        allowResize: { top: true, left: true, bottom: true, right: true },
        minHeight: 60,
        minWidth: 40,
        margins:5
    };
    jasonBaseWidget.call(this, nameSpace, htmlElement, options, null);

    this._mousePositionInfo = {
        onTopEdge: false,
        onLeftEdge: false,
        onRightEdge: false,
        onBottomEdge: false,
        mousePixelsDifferenceLeft: null,
        mousePixelsDifferenceTop: null,
        mousePixelsDifferenceBottom: null,
        mousePixelsDifferenceRight: null,
        elementRect: null,
        canResize: false
    }

    this._onElementMouseDown = this._onElementMouseDown.bind(this);
    this._onElementMouseMove = this._onElementMouseMove.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._resizeElement = this._resizeElement.bind(this);
    this._resizing = false;
    this._redrawing = null;
    this._updatingMouseInfo = false;
    this._startX = null;
    this._startY = null;
    this._mouseMoveTimer = null;
    this._mouseMoving = true;
    this._initializeEvents();
}

/**
 * Allows resizing to happen, if mouse is over in one of the 4 sides of the htmlElement.
 */
jasonElementResizer.prototype._startResize = function () {
    this._resizing = this._mousePositionInfo.canResize;
    this.triggerEvent(jw.DOM.events.JW_EVENT_ON_ELEMENT_RESIZING, this.htmlElement);
}

/**
 * Stops resizing.
 */
jasonElementResizer.prototype._stopResize = function () {
    if (this._resizing) {
        this._resizing = false;
        this.triggerEvent(jw.DOM.events.JW_EVENT_ON_ELEMENT_RESIZED, this.htmlElement);
    }
}

/**
 * Mouse move event.
 */
jasonElementResizer.prototype._onMouseMove = function (event) {
    this._mouseMoveEvent = event;
    this._mouseMoving = true;
    clearTimeout(this._mouseMoveTimer);
    //if mouse stops moving after 50ms, then stop resizing the column
    this._mouseMoveTimer = setTimeout(function () { this._mouseMoving = false; }.bind(this), 50);
    setTimeout(function () { this._redrawing = true; }.bind(this));
}
/**
 * 
 */
jasonElementResizer.prototype._onElementMouseMove = function (event) {
    if (!this._resizing) {
        this._updateCursor(event);
    }
}
/**
 * Mouse down event.
 */
jasonElementResizer.prototype._onElementMouseDown = function (event) {
    if (this._mousePositionInfo.canResize) {
        this._startX = event.clientX;
        this._startY = event.clientY;
        this._startResize();
        this._resizeElement();
    }
}
/**
 * Mouse up event.
 */
jasonElementResizer.prototype._onMouseUp = function (event) {
    this._stopResize();
}

/**
 * Touch start event, equivalent to the mouse down.
 */
jasonElementResizer.prototype._onTouchStart = function (event) {
    this._startResize();
}

/**
 * Touch move event, equivalent to the mouse move event.
 */
jasonElementResizer.prototype._onTouchMove = function (event) {
    this._mouseMoveEvent = event.touches[0];
}

/**
 * Touch end event, equivalent to the mouse up event.
 */
jasonElementResizer.prototype._onTouchEnd = function (event) {
    if (event.touches.length == 0)
        this._stopResize();
}

/**
 * Update element dimensions for the horizontal axis, starting from right.
 */
jasonElementResizer.prototype._updateElementRight = function (newWidth, widthDifference) {
    this.htmlElement.style.width = newWidth + "px";
}

/**
 * Update element dimensions for the vertical axis, starting from bottom.
 */
jasonElementResizer.prototype._updateElementHeight = function (newHeight) {
    this.htmlElement.style.height = newHeight + "px";
}

/**
 * Update element dimensions for the horizontal axis, starting from left.
 */
jasonElementResizer.prototype._updateElementLeft = function (newLeft, newWidth) {
    this.htmlElement.style.width = newWidth + "px";
    this.htmlElement.style.left = newLeft + "px";
}

/**
 * Update element dimensions for the vertical axis, starting from top.
 */
jasonElementResizer.prototype._updateElementTop = function (newTop, newHeight) {
    this.htmlElement.style.height = newHeight + "px";
    this.htmlElement.style.top = newTop + "px";
}

/**
 * Function running within a requestAnimationFrame, to improve performance and reduce flickering while resizing.
 */
jasonElementResizer.prototype._resizeElement = function (timeStamp) {
    if (this._resizing)
        window.requestAnimationFrame(this._resizeElement);
    //if the resizer is disabled, do nothing.
    if (!this.enabled)
        return;
    if (this._resizing && this._mouseMoving) {
        var newWidthDifference = 0;
        var newHeightDifference = 0;
        var newWidth = 0;
        var newLeft = 0;
        var newTop = 0;
        var newHeight = 0;
        if (this._mousePositionInfo.onRightEdge && this.options.allowResize.right) {
            //clientX is where the mouse is at the moment and _startX is where the resizing started.
            newWidthDifference = (this._mouseMoveEvent.clientX - this._startX);
            newWidth = this._mousePositionInfo.elementRect.width + newWidthDifference;
            if (newWidth >= this.options.minWidth) {
                this._updateElementRight(newWidth, newWidthDifference);
            }
        }
        if (this._mousePositionInfo.onLeftEdge && this.options.allowResize.left) {
            //clientX is where the mouse is at the moment and _startX is where the resizing started.
            newWidthDifference = (this._mouseMoveEvent.clientX - this._startX);
            newWidth = this._mousePositionInfo.elementRect.width - newWidthDifference;
            newLeft = this._mousePositionInfo.elementRect.left + newWidthDifference;
            if (newWidth >= this.options.minWidth) {
                this._updateElementLeft(newLeft, newWidth);
            }
        }

        if (this._mousePositionInfo.onTopEdge && this.options.allowResize.top) {
            //clientY is where the mouse is at the moment and _startY is where the resizing started.
            newHeightDifference = (this._mouseMoveEvent.clientY - this._startY);
            //if (Math.abs(newHeightDifference) > this.options.margins) {
                newHeight = this._mousePositionInfo.elementRect.height - newHeightDifference;
                newTop = this._mousePositionInfo.elementRect.top + newHeightDifference;
                if (newHeight >= this.options.minHeight) {
                    this._updateElementTop(newTop, newHeight);
                }
            //}
        }

        if (this._mousePositionInfo.onBottomEdge && this.options.allowResize.bottom) {
            //clientY is where the mouse is at the moment and _startY is where the resizing started.
            newHeightDifference = (this._mouseMoveEvent.clientY - this._startY);
            //if (Math.abs(newHeightDifference) > this.options.margins) {
                newHeight = this._mousePositionInfo.elementRect.height + newHeightDifference;
                if (newHeight >= this.options.minHeight) {
                    this._updateElementHeight(newHeight);
                }
            //}
        }
    }
}

/**
 * Updates the mouse cursor, when mouse touches one of the 4 sides of the element.
 */
jasonElementResizer.prototype._updateCursor = function (event) {
    if (event) {
        this.update_mousePositionInfo(event);
        var cursor = "default";
        if (this._mousePositionInfo.onLeftEdge || this._mousePositionInfo.onRightEdge) {
            cursor = "ew-resize";
        }
        if (this._mousePositionInfo.onTopEdge || this._mousePositionInfo.onBottomEdge) {
            cursor = "ns-resize";
        }
        this.htmlElement.style.cursor = cursor;
    }
}

/**
 * Calculates mouse position information, relative to the htmlElement.
 */
jasonElementResizer.prototype.update_mousePositionInfo = function (event) {
    var elementRect = this.htmlElement.getBoundingClientRect();
    this._mousePositionInfo.elementRect = elementRect;
    this._mousePositionInfo.mousePixelsDifferenceLeft = Math.abs(event.clientX - elementRect.left);
    this._mousePositionInfo.mousePixelsDifferenceTop = Math.abs(event.clientY - elementRect.top);
    this._mousePositionInfo.mousePixelsDifferenceBottom = Math.abs(event.clientY - elementRect.bottom);
    this._mousePositionInfo.mousePixelsDifferenceRight = Math.abs(event.clientX - elementRect.right);

    this._mousePositionInfo.onTopEdge = (this._mousePositionInfo.mousePixelsDifferenceTop <= this.options.margins) && this.options.allowResize.top;
    this._mousePositionInfo.onLeftEdge = (this._mousePositionInfo.mousePixelsDifferenceLeft <= this.options.margins) && this.options.allowResize.left;

    this._mousePositionInfo.onBottomEdge = (this._mousePositionInfo.mousePixelsDifferenceBottom <= this.options.margins) && this.options.allowResize.bottom;
    this._mousePositionInfo.onRightEdge = (this._mousePositionInfo.mousePixelsDifferenceRight <= this.options.margins) && this.options.allowResize.right;
    this._mousePositionInfo.canResize = this._mousePositionInfo.onTopEdge || this._mousePositionInfo.onLeftEdge || this._mousePositionInfo.onBottomEdge || this._mousePositionInfo.onRightEdge;
}

/**
 * Initializes mouse and touch events.
 */
jasonElementResizer.prototype._initializeEvents = function () {
    this.htmlElement.addEventListener(jw.DOM.events.MOUSE_MOVE_EVENT, this._onElementMouseMove);
    this.htmlElement.addEventListener(jw.DOM.events.MOUSE_DOWN_EVENT, this._onElementMouseDown);
    jwWindowEventManager.addWindowEventListener(jw.DOM.events.MOUSE_UP_EVENT, this._onMouseUp);
    jwWindowEventManager.addWindowEventListener(jw.DOM.events.MOUSE_MOVE_EVENT, this._onMouseMove);

    //this.htmlElement.addEventListener(jw.DOM.events.TOUCH_MOVE_EVENT, this._onTouchMove);
    //this.htmlElement.addEventListener(jw.DOM.events.TOUCH_START_EVENT, this._onTouchStart);
    jwWindowEventManager.addWindowEventListener(jw.DOM.events.TOUCH_END_EVENT, this._onTouchEnd);
}

/**
 * Removes all event listeners.
 */
jasonElementResizer.prototype.destroy = function () {
    
    this.htmlElement.removeEventListener(jw.DOM.events.MOUSE_MOVE_EVENT, this._onElementMouseMove);
    this.htmlElement.removeEventListener(jw.DOM.events.MOUSE_DOWN_EVENT, this._onElementMouseDown);
    jwWindowEventManager.removeWindowEventListener(jw.DOM.events.MOUSE_UP_EVENT, this._onMouseUp);
    jwWindowEventManager.removeWindowEventListener(jw.DOM.events.MOUSE_MOVE_EVENT, this._onMouseMove);

    //this.htmlElement.removeEventListener(jw.DOM.events.TOUCH_MOVE_EVENT, this._onTouchMove);
    //this.htmlElement.removeEventListener(jw.DOM.events.TOUCH_START_EVENT, this._onTouchStart);
    //jwWindowEventManager.removeWindowEventListener(jw.DOM.events.TOUCH_MOVE_EVENT, this._onTouchMove);
    //jwWindowEventManager.removeWindowEventListener(jw.DOM.events.TOUCH_START_EVENT, this._onTouchStart);
    jwWindowEventManager.removeWindowEventListener(jw.DOM.events.TOUCH_END_EVENT, this._onTouchEnd);
}