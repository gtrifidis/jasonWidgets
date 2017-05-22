/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


jasonGridResizer.prototype = Object.create(jasonBaseWidget.prototype);
jasonGridResizer.prototype.constructor = jasonGridResizer;


/**
 * jasonGridResizer resize manager
 * @constructor
 * @description Auxiliary class, that manages resizing for jasonGrids.
 * @memberOf Grids
 */
function jasonGridResizer(gridInstance, options, nameSpace) {
    this.defaultOptions = {
        minHeight: 60,
        minWidth: 40
    };
    //this needs to be set before calling the base constructor, so the gridInstance property will be available,
    //in the functions called through it. For example "initialize"
    this._gridInstance = gridInstance;
    this._onColumnMouseMove = this._onColumnMouseMove.bind(this);
    this._onColumnMouseDown = this._onColumnMouseDown.bind(this);
    this._onDocumentMouseMove = this._onDocumentMouseMove.bind(this);
    this._onDocumentMouseUp = this._onDocumentMouseUp.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchStart = this._onTouchStart.bind(this);

    this._margins = 5;
    this._headerTableColGroup = null;
    this._dataTableColGroup = null;
    this._currentColumn = null;
    this._mouseMoveEvent = null;
    this._mouseMoving = false;
    this._mouseMoveTimer = null;
    this._resizing = false;
    this._redrawing = false;
    this._tableOriginalWidth = null;
    this._currentHeaderCol = null;
    this._currentDataCol = null;
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
    jasonBaseWidget.call(this, nameSpace, gridInstance.htmlElement, options, null);
    this._resizeColumn = this._resizeColumn.bind(this);
}

/**
 * Gets references to key HTMLElements of the grid.
 */
jasonGridResizer.prototype.initialize = function () {
    this._headerTableColGroup = this._gridInstance.ui.headerTableColGroup;
    this._dataTableColGroup = this._gridInstance.ui.dataTableColGroup
    this._initializeEvents();
}
/**
 * Initialize events.
 */
jasonGridResizer.prototype._initializeEvents = function () {
    for (var i = 0 ; i <= this._gridInstance.ui.gridHeaderTableRow.children.length - 1; i++) {
        this._gridInstance.ui.gridHeaderTableRow.children[i].addEventListener(jw.DOM.events.MOUSE_MOVE_EVENT, this._onColumnMouseMove);
        this._gridInstance.ui.gridHeaderTableRow.children[i].addEventListener(jw.DOM.events.MOUSE_DOWN_EVENT, this._onColumnMouseDown);
        this._gridInstance.ui.gridHeaderTableRow.children[i].addEventListener(jw.DOM.events.TOUCH_START_EVENT, this._onTouchStart);
    }

    jwWindowEventManager.addWindowEventListener(jw.DOM.events.MOUSE_MOVE_EVENT, this._onDocumentMouseMove);
    jwWindowEventManager.addWindowEventListener(jw.DOM.events.MOUSE_UP_EVENT, this._onDocumentMouseUp);

    jwWindowEventManager.addWindowEventListener(jw.DOM.events.TOUCH_MOVE_EVENT, this._onTouchMove);
    //jwWindowEventManager.addWindowEventListener(jw.DOM.events.TOUCH_START_EVENT, this._onTouchStart);
    jwWindowEventManager.addWindowEventListener(jw.DOM.events.TOUCH_END_EVENT, this._onTouchEnd);
}
/**
 * 
 */
jasonGridResizer.prototype.destroy = function () {
    jasonBaseWidget.prototype.destroy.call(this);
    for (var i = 0 ; i <= this._gridInstance.ui.gridHeaderTableRow.children.length - 1; i++) {
        this._gridInstance.ui.gridHeaderTableRow.children[i].removeEventListener(jw.DOM.events.MOUSE_MOVE_EVENT, this._onColumnMouseMove);
        this._gridInstance.ui.gridHeaderTableRow.children[i].removeEventListener(jw.DOM.events.MOUSE_DOWN_EVENT, this._onColumnMouseDown);
        this._gridInstance.ui.gridHeaderTableRow.children[i].removeEventListener(jw.DOM.events.TOUCH_START_EVENT, this._onTouchStart);
    }
    jwWindowEventManager.removeWindowEventListener(jw.DOM.events.MOUSE_MOVE_EVENT, this._onDocumentMouseMove);
    jwWindowEventManager.removeWindowEventListener(jw.DOM.events.MOUSE_UP_EVENT, this._onDocumentMouseUp);

    jwWindowEventManager.removeWindowEventListener(jw.DOM.events.TOUCH_MOVE_EVENT, this._onTouchMove);
    //jwWindowEventManager.removeWindowEventListener(jw.DOM.events.TOUCH_START_EVENT, this._onTouchStart);
    jwWindowEventManager.removeWindowEventListener(jw.DOM.events.TOUCH_END_EVENT, this._onTouchEnd);
}
/**
 * Allows resizing to happen, if mouse is over in one of the 4 sides of the htmlElement.
 */
jasonGridResizer.prototype._startResize = function () {
    this._resizing = this._mousePositionInfo.canResize && this.enabled;
    this.triggerEvent(jw.DOM.events.JW_EVENT_ON_ELEMENT_RESIZING, this.htmlElement);
    document.body.style.cursor = "col-resize";
}
/**
 * Stops resizing.
 */
jasonGridResizer.prototype._stopResize = function (event) {
    if (this._resizing) {
        this._resizing = false;
        this.triggerEvent(jw.DOM.events.JW_EVENT_ON_ELEMENT_RESIZED, this.htmlElement);
    }
    document.body.style.cursor = "default";
}
/**
 * Updates the cursor for a column that can be resized.
 */
jasonGridResizer.prototype._updateCursor = function (targetElement) {
    var cursor = "default";
    if (this._mousePositionInfo.onLeftEdge || this._mousePositionInfo.onRightEdge) {
        cursor = "col-resize";
    }
    targetElement.style.cursor = cursor;
}
/**
 * 
 */
jasonGridResizer.prototype._onColumnMouseMove = function (event) {
    if (!this._resizing) {
        var targetElement = event.target.tagName == "TH" ? event.target : jw.common.getParentElement("TH", event.target);
        this.update_mousePositionInfo(event, targetElement);
        this._updateCursor(targetElement);
    }
}
/**
 * Document mouse down event.
 */
jasonGridResizer.prototype._onColumnMouseDown = function (event) {
    if (this._mousePositionInfo.canResize) {
        var targetElement = event.target.tagName == "TH" ? event.target : jw.common.getParentElement("TH", event.target);
        this._startX = event.clientX;
        this._startY = event.clientY;
        var currentTableWidth = this._gridInstance.ui.gridHeaderTable.style.width.match(/[0-9]+/g);
        if (currentTableWidth)
            this._tableOriginalWidth = currentTableWidth = parseInt(currentTableWidth[0]);
        this._currentColumn = targetElement;
        this._currentHeaderCol = this._headerTableColGroup.children[this._currentColumn.cellIndex];
        this._currentDataCol = this._dataTableColGroup.children[this._currentColumn.cellIndex];
        this._startResize();
        this._resizeColumn();
    }
}
/**
 * Document mouse move
 */
jasonGridResizer.prototype._onDocumentMouseMove = function (event) {
    if (this._resizing) {
        this._mouseMoveEvent = event;
        this._mouseMoving = true;
        clearTimeout(this._mouseMoveTimer);
        //if mouse stops moving after 50ms, then stop resizing the column
        this._mouseMoveTimer = setTimeout(function () { this._mouseMoving = false; }.bind(this), 50);
    }
}
/**
 * Document mouse up event.
 */
jasonGridResizer.prototype._onDocumentMouseUp = function (event) {
    this._stopResize(event);
}
/**
 * Touch start event, equivalent to the mouse down.
 */
jasonGridResizer.prototype._onTouchStart = function (event) {
    this._startResize();
}
/**
 * Touch move event, equivalent to the mouse move event.
 */
jasonGridResizer.prototype._onTouchMove = function (event) {
    this._mouseMoveEvent = event.touches[0];
}
/**
 * Touch end event, equivalent to the mouse up event.
 */
jasonGridResizer.prototype._onTouchEnd = function (event) {
    if (event.touches.length == 0)
        this._stopResize();
}
/**
 * Calculates mouse position information, relative to the htmlElement.
 */
jasonGridResizer.prototype.update_mousePositionInfo = function (event, htmlElement) {
    var elementRect = htmlElement.getBoundingClientRect();
    this._mousePositionInfo.elementRect = elementRect;
    this._mousePositionInfo.mousePixelsDifferenceLeft = Math.abs(event.clientX - elementRect.left);
    this._mousePositionInfo.mousePixelsDifferenceTop = Math.abs(event.clientY - elementRect.top);
    this._mousePositionInfo.mousePixelsDifferenceBottom = Math.abs(event.clientY - elementRect.bottom);
    this._mousePositionInfo.mousePixelsDifferenceRight = Math.abs(event.clientX - elementRect.right);
    this._mousePositionInfo.onRightEdge = (this._mousePositionInfo.mousePixelsDifferenceRight <= this._margins) && this.enabled;

    this._mousePositionInfo.canResize = this._mousePositionInfo.onRightEdge;
}
/**
 * Function running within a requestAnimationFrame, to improve performance and reduce flickering while resizing.
 */
jasonGridResizer.prototype._resizeColumn = function (timeStamp) {
    //while resizing keep requesting the next animation frame.
    //we need to do this only while a resize is happening for performance issues.
    //calling .requestAnimationFrame has a rather high CPU impact.
    if(this._resizing)
        window.requestAnimationFrame(this._resizeColumn);
    if (this._resizing && this._mouseMoving && this._currentColumn != null) {
        var newWidthDifference = 0;
        var newWidth = 0;
        try{
            if (this._mousePositionInfo.onRightEdge && this.enabled) {
                //clientX is where the mouse is at the moment and _startX is where the resizing started.
                newWidthDifference = (this._mouseMoveEvent.clientX - this._startX);
                newWidth = this._mousePositionInfo.elementRect.width + newWidthDifference;
                if (newWidth >= this.options.minWidth && newWidth != this._mousePositionInfo.elementRect.width) {
                    this._currentHeaderCol.style.width = newWidth + "px";
                    this._currentDataCol.style.width = newWidth + "px";
                    this._gridInstance.ui.gridHeaderTable.style.width = (this._tableOriginalWidth + newWidthDifference) + "px";
                    this._gridInstance.ui.gridDataTable.style.width = (this._tableOriginalWidth + newWidthDifference) + "px";
                }
            }
        }
        catch(error){
            this.enabled = false;
            jw.common.throwError(jw.errorTypes.referenceError, error.message);
        }
    }
}