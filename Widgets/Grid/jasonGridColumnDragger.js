/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


jasonGridColumnDragger.prototype = Object.create(jasonBaseWidget.prototype);
jasonGridColumnDragger.prototype.constructor = jasonGridColumnDragger;


/**
 * jasonWidgets resize manager
 * @constructor
 * @description Auxiliary class, that manages drag and drop for HTMLElements.
 * @memberOf Common
 */
function jasonGridColumnDragger(gridInstance, options, nameSpace) {
    //this needs to be set before calling the base constructor, so the gridInstance property will be available,
    //in the functions called through it. For example "initialize"
    this.defaultOptions = {
        changeCursor: true
    };
    this._gridInstance = gridInstance;
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onWindowMouseMove = this._onWindowMouseMove.bind(this);
    this._dragColumn = this._dragColumn.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchStart = this._onTouchStart.bind(this);
    this._mouseMoveEvent = null;
    this._cloneNode = null;
    this._currentColumn = null;
    jasonBaseWidget.call(this, nameSpace, gridInstance.htmlElement, options, null);
    //this._dragColumn();
}

/**
 * Gets references to key HTMLElements of the grid.
 */
jasonGridColumnDragger.prototype.initialize = function () {
    this._headerTableColGroup = this._gridInstance.ui.headerTableColGroup;
    this._dataTableColGroup = this._gridInstance.ui.dataTableColGroup
    this._initializeEvents();
}
/**
 * Initializes events.
 */
jasonGridColumnDragger.prototype._initializeEvents = function () {

    for (var i = 0 ; i <= this._gridInstance.ui.gridHeaderTableRow.children.length - 1; i++) {
        var gridColumnCaption = this._gridInstance.ui.gridHeaderTableRow.children[i].getElementsByClassName(jw.DOM.classes.JW_GRID_HEADER_CELL_CAPTION_CONTAINER)[0];
        gridColumnCaption.addEventListener(jw.DOM.events.MOUSE_MOVE_EVENT, this._onMouseMove, true);
        gridColumnCaption.addEventListener(jw.DOM.events.MOUSE_DOWN_EVENT, this._onMouseDown, true);
        gridColumnCaption.addEventListener(jw.DOM.events.TOUCH_START_EVENT, this._onTouchStart, true);
    }

    jwWindowEventManager.addWindowEventListener(jw.DOM.events.MOUSE_UP_EVENT, this._onMouseUp);
    jwWindowEventManager.addWindowEventListener(jw.DOM.events.MOUSE_MOVE_EVENT, this._onWindowMouseMove);

    jwWindowEventManager.addWindowEventListener(jw.DOM.events.TOUCH_MOVE_EVENT, this._onTouchMove);
    //jwWindowEventManager.addWindowEventListener(jw.DOM.events.TOUCH_START_EVENT, this._onTouchStart);
    jwWindowEventManager.addWindowEventListener(jw.DOM.events.TOUCH_END_EVENT, this._onTouchEnd);
}
/**
 * Touch start event, equivalent to the mouse down.
 */
jasonGridColumnDragger.prototype._onTouchStart = function (event) {
    var touchEvent = event.touches[0];
    if(touchEvent){
        touchEvent.button = 0;
        this._onMouseDown(touchEvent);
    }
    //event.preventDefault();
    //event.stopPropagation();
}

/**
 * Touch move event, equivalent to the mouse move event.
 */
jasonGridColumnDragger.prototype._onTouchMove = function (event) {
    this._mouseMoveEvent = event.touches[0];
}

/**
 * Touch end event, equivalent to the mouse up event.
 */
jasonGridColumnDragger.prototype._onTouchEnd = function (event) {
    if (event.touches.length == 0 && this._cloneNode) {
        this._onMouseUp(event);
        event.preventDefault();
        event.stopPropagation();
    }
}
/**
 * Keeping reference to the mouse event.
 */
jasonGridColumnDragger.prototype._onWindowMouseMove = function (event) {
    this._mouseMoveEvent = event;
}
/**
 * Changes the element's cursor to indicate that a drag is possible.
 */
jasonGridColumnDragger.prototype._onMouseMove = function (event) {
    if (this.enabled && this._cloneNode == null && this.options.changeCursor) {
        event.target.style.cursor = "move";
    }
}
/**
 * Initiating the drag operation, by creating a clone node of the column to be dragged.
 */
jasonGridColumnDragger.prototype._onMouseDown = function (event) {
    //dragging will initiate only if the element is the actual column caption container.
    if (event.button == 0 && event.target.classList.contains(jw.DOM.classes.JW_GRID_HEADER_CELL_CAPTION_CONTAINER)) {
        this._currentColumn = event.target.tagName == "TH" ? event.target : jw.common.getParentElement("TH", event.target);
        var elementRect = this._currentColumn.getBoundingClientRect();
        if (!this._cloneNode) {
            this._cloneNode = this._currentColumn.getElementsByClassName(jw.DOM.classes.JW_GRID_HEADER_CELL_CAPTION_CONTAINER)[0].cloneNode(true);
            this._cloneNode.style.left = elementRect.left + "px";
            this._cloneNode.style.top = elementRect.top + "px";
            this._cloneNode.style.height = elementRect.height + "px";
            this._cloneNode.style.width = elementRect.width + "px";
            this._cloneNode.removeAttribute(jw.DOM.attributes.ID_ATTR);
            this._cloneNode.classList.add(jw.DOM.classes.JW_GRID_COLUMN_DRAG_IMAGE);
            this._cloneNode.style.display = "none";
            document.body.appendChild(this._cloneNode);
        }
        if (!this._mouseMoveEvent)
            this._mouseMoveEvent = event;
        this._dragColumn();
        this.triggerEvent(jw.DOM.events.DRAG_START_EVENT, event);
        //making sure that this is a mouse and not a touch event.
        if (event.stopPropagation) {
            event.stopPropagation();
            event.preventDefault();
        }
    }
}
/**
 * When mouse-up is triggered the drag operation has been completed.
 */
jasonGridColumnDragger.prototype._onMouseUp = function (event) {
    if (this._cloneNode && this._cloneNode.parentElement) {
        document.body.removeChild(this._cloneNode);
        this._cloneNode = null;
        //making sure that this is a mouse and not a touch event.
        if (event.stopPropagation) {
            event.stopPropagation();
            event.preventDefault();
        }
        //if the event is a touch event, it has no coordinates information,
        //so we are using the coordinates of the last mouse/touch move event.
        event.clientX = event.clientX ? event.clientX : this._mouseMoveEvent.clientX;
        event.clientY = event.clientY ? event.clientY : this._mouseMoveEvent.clientY;
        this.triggerEvent(jw.DOM.events.DRAG_OVER_EVENT, {event:event,column:this._currentColumn});
    }
}
/**
 * Removes event listeners.
 */
jasonGridColumnDragger.prototype.destroy = function () {
    jasonBaseWidget.prototype.destroy.call(this);
    for (var i = 0 ; i <= this._gridInstance.ui.gridHeaderTableRow.children.length - 1; i++) {
        var gridColumnCaption = this._gridInstance.ui.gridHeaderTableRow.children[i].getElementsByClassName(jw.DOM.classes.JW_GRID_HEADER_CELL_CAPTION_CONTAINER)[0];
        gridColumnCaption.removeEventListener(jw.DOM.events.MOUSE_MOVE_EVENT, this._onMouseMove);
        gridColumnCaption.removeEventListener(jw.DOM.events.MOUSE_DOWN_EVENT, this._onMouseDown);
        gridColumnCaption.removeEventListener(jw.DOM.events.TOUCH_START_EVENT, this._onTouchStart);
    }
    jwWindowEventManager.removeWindowEventListener(jw.DOM.events.MOUSE_UP_EVENT, this._onMouseUp);
    jwWindowEventManager.removeWindowEventListener(jw.DOM.events.MOUSE_MOVE_EVENT, this._onWindowMouseMove);

    jwWindowEventManager.removeWindowEventListener(jw.DOM.events.TOUCH_MOVE_EVENT, this._onTouchMove);
    jwWindowEventManager.removeWindowEventListener(jw.DOM.events.TOUCH_START_EVENT, this._onTouchStart);
    jwWindowEventManager.removeWindowEventListener(jw.DOM.events.TOUCH_END_EVENT, this._onTouchEnd);
}
/**
 * This is being executed within an animation frame request. Browsers perform better when animation/move operations
 * are being executed in the animationFrame callback.
 */
jasonGridColumnDragger.prototype._dragColumn = function () {
    if (this._cloneNode) {
        window.requestAnimationFrame(this._dragColumn);
        this._cloneNode.style.display = "";
        this._cloneNode.style.left = this._mouseMoveEvent.clientX - this._cloneNode.offsetWidth / 2 + "px";
        this._cloneNode.style.top = this._mouseMoveEvent.clientY - this._cloneNode.offsetHeight / 2 + "px";
    }
}