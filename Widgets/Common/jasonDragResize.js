/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonDragResize.prototype = Object.create(jasonBaseWidget.prototype);
jasonDragResize.prototype.constructor = jasonDragResize;

/**
 * @class
 * @ignore
 * @name jasonDragResizeOptions
 * @description Configuration options for the drag resize manager.
 * @memberOf Common
 * @property {boolean}  allowDrag - Allows element to be dragged. Default is true.
 * @property {boolean}  allowResize - Allows element to be resized. Default is true.
 * @property {boolean}  allowResize.vertical - Allows element to be resized on the horizontal axis. Default is true.
 * @property {boolean}  allowResize.horizontal - Allows element to be resized on the vertical axis. Default is true.
 */

/**
 * jasonWidgets Drag Resize Manager
 * @ignore
 * @constructor
 * @description Auxilary class, that manages drag/resize for HTMLElements.
 * @memberOf Common
 */
function jasonDragResize(htmlElement, options, nameSpace) {
    this.defaultOptions = {
        allowDrag: true,
        allowResize: { top: true, left: true, bottom: true, right: true },
        minHeight: 60,
        minWidth: 40,
        dependantElements: [],
        onMoveStart: null,
        onMoveEnd: null,
        onResizeEnd: null,
        onResizeStart:null,
        ghostPanelCSS: null,
        ghostPanelContents: null,
        changeDragCursor: true,
        gridMode:false
    };

    jasonBaseWidget.call(this, nameSpace, htmlElement, options, null);

    var self = this;
    this.eventManager = new jasonEventManager();
    this.htmlElement = htmlElement;
    this.margins = 4;
    this.fullScreenMargins = -10;
    this.redraw = false;

    this.boundingClientRect = null;
    this.left = null;
    this.top = null;
    this.onTopEdge = null;
    this.onLeftEdge = null;
    this.onRightEdge = null;
    this.onBottomEdge = null;
    this.rightScreenEdge = null;
    this.bottomScreenEdge = null;
    this.clickActionInfo = null;
    this.mouseMoveEvent = null;
    this.preSnapped = null;
    this.ghostPanel = document.createElement("div");
    this.ghostPanel.style.display = "none";
    if (typeof this.options.allowDrag == "boolean")
        this.options.allowDrag = { draggable: this.options.allowDrag, element: htmlElement };
    document.body.appendChild(self.ghostPanel);
    if (this.options.ghostPanelCSS)
        this.ghostPanel.classList.add(this.options.ghostPanelCSS);
    if (this.options.ghostPanelContents)
        this.ghostPanel.innerHTML = this.options.ghostPanelContents;

    this.setBounds = function (element, left, top, width, height) {
        element.style.left = left + 'px';
        element.style.top = top + 'px';
        element.style.width = width + 'px';
        element.style.height = height + 'px';
    }

    this.hideGhostPanel = function () {
        self.setBounds(self.ghostPanel, self.boundingClientRect.left, self.boundingClientRect.top, self.boundingClientRect.width, self.boundingClientRect.height);
        self.ghostPanel.style.display = "none";
    }


    this.calculateAction = function (event) {
        self.boundingClientRect = self.htmlElement.getBoundingClientRect();
        self.dragBoundingClientRect = self.options.allowDrag.element.getBoundingClientRect();
        self.left = event.clientX - self.boundingClientRect.left;
        self.top = event.clientY - self.boundingClientRect.top;
        self.onTopEdge = self.top < self.margins;
        self.onBottomEdge = self.top >= self.boundingClientRect.height - self.margins;
        self.onLeftEdge = self.left < self.margins;
        self.onRightEdge = self.left >= self.boundingClientRect.width - self.margins;
        self.rightScreenEdge = window.innerWidth - self.margins;
        self.bottomScreenEdge = window.innerHeight - self.margins;
    }

    this.onDown = function (event) {
        self.calculateAction(event);
        var isResizing = !self.options.allowResize ? false : (self.onRightEdge || self.onLeftEdge || self.onTopEdge || self.onBottomEdge);
        self.clickActionInfo = {
            left: self.left,
            top: self.top,
            clientX: event.clientX,
            clientY: event.clientY,
            width: self.boundingClientRect.width,
            height: self.boundingClientRect.height,
            isResizing: isResizing,
            isMoving: !isResizing && self.canMove(),
            onTopEdge: self.onTopEdge,
            onLeftEdge: self.onLeftEdge,
            onRightEdge: self.onRightEdge,
            onBottomEdge: self.onBottomEdge
        };
    }

    this.canMove = function () {
        if (self.options.allowDrag.draggable) {
            return self.left > 0 && self.left < self.dragBoundingClientRect.width &&
                self.top > 0 && self.top < self.dragBoundingClientRect.height;
        }
        return false;
    }

    this.onTouchStart = function (touchEvent) {
        //if(self.htmlElement == touchEvent.target)
        self.onDown(touchEvent.touches[0]);
        touchEvent.preventDefault();
        touchEvent.stopPropagation();
    }

    this.onTouchMove = function (touchEvent) {
        self.onMouseMove(touchEvent.touches[0])
        self.redraw = true;
        self.animateMove();
    }

    this.onTouchEnd = function (touchEvent) {
        if (touchEvent.touches.length == 0)
            self.onMouseUp(touchEvent.changedTouches[0]);
    }

    this.onMouseDown = function (mouseEvent) {
        self.onDown(mouseEvent);
        mouseEvent.preventDefault();
        mouseEvent.stopPropagation();
        if (self.clickActionInfo && self.clickActionInfo.isMoving) {
            self.hideGhostPanel();
            if (self.options.onMoveStart)
                self.options.onMoveStart(mouseEvent, self.htmlElement);
        }
        if (self.clickActionInfo && self.clickActionInfo.isResizing) {
            if (self.options.onResizeStart)
                self.options.onResizeStart(mouseEvent, self.htmlElement);
        }
    }

    this.onMouseMove = function (mouseEvent) {
        self.calculateAction(mouseEvent);
        self.mouseMoveEvent = mouseEvent;
        self.redraw = true;
    }

    this.onMouseUp = function (mouseEvent) {
        //if (self.ghostPanel.parentElement)
        //    self.ghostPanel.parentElement.remove(self.ghostPanel);
        self.calculateAction(mouseEvent);
        if (self.clickActionInfo && self.clickActionInfo.isMoving) {
            self.hideGhostPanel();
            if (self.options.onMoveEnd)
                self.options.onMoveEnd(mouseEvent, self.htmlElement);
        }
        if (self.clickActionInfo && self.clickActionInfo.isResizing) {
            if (self.options.onResizeEnd)
                self.options.onResizeEnd(mouseEvent, self.htmlElement);
        }
        self.clickActionInfo = null;
    }

    this.animateMove = function () {
        window.requestAnimationFrame(self.animateMove);
        var exit = false;
        //if the mouse move event does not have a button property it's a touchevent.
        //if it is a mouse event only accept first button.
        if (self.mouseMoveEvent && self.mouseMoveEvent.button != void 0)
            exit = self.mouseMoveEvent.button != 0;
        //if it is a right click then exit.
        if (exit === true)
            return;
        //if we are already in a redraw cycle, exit.
        if (self.redraw === false)
            return;
        self.redraw = false;

        if (self.clickActionInfo && self.clickActionInfo.isResizing) {
            if (self.clickActionInfo.onRightEdge && self.options.allowResize.right) {
                if (!self.options.gridMode) {
                    var currentWidth = Math.max(self.clickActionInfo.width + (self.mouseMoveEvent.clientX - self.clickActionInfo.clientX), self.options.minWidth);
                    if (currentWidth > self.options.minWidth) {
                        self.htmlElement.style.width = currentWidth + "px";
                    }
                }
                if (self.options.dependantElements) {
                    for (var i = 0; i <= self.options.dependantElements.length - 1; i++) {
                        self.options.dependantElements[i].style.width = Math.max(self.left, self.options.minWidth) + "px";
                    }
                }
            }


            if (self.clickActionInfo.onBottomEdge && self.options.allowResize.bottom) {
                if (!self.options.gridMode) {
                    var currentHeight = Math.max(self.clickActionInfo.height + (self.mouseMoveEvent.clientY - self.clickActionInfo.clientY), self.options.minHeight);
                    if (currentHeight > self.options.minHeight) {
                        self.htmlElement.style.height = currentHeight + "px";
                    }
                }
                if (self.options.dependantElements) {
                    for (var i = 0; i <= self.options.dependantElements.length - 1; i++) {
                        self.options.dependantElements[i].style.height = Math.max(self.top, self.options.minHeight) + "px";
                    }
                }
            }

            if (self.clickActionInfo.onLeftEdge && self.options.allowResize.left) {

                if (!self.options.gridMode) {
                    var currentWidth = Math.max(self.clickActionInfo.clientX - self.mouseMoveEvent.clientX + self.clickActionInfo.width, self.options.minWidth);
                    if (currentWidth > self.options.minWidth) {
                        self.htmlElement.style.width = currentWidth + "px";
                        self.htmlElement.style.left = self.mouseMoveEvent.clientX + "px";
                    }
                }
                if (self.options.dependantElements) {
                    for (var i = 0; i <= self.options.dependantElements.length - 1; i++) {
                        self.options.dependantElements[i].style.width = currentWidth;
                    }
                }
            }

            if (self.clickActionInfo.onTopEdge && self.options.allowResize.top) {
                if (!self.options.gridMode) {
                    var currentHeight = Math.max(self.clickActionInfo.clientY - self.mouseMoveEvent.clientY + self.clickActionInfo.height, self.options.minHeight);
                    if (currentHeight > self.options.minHeight) {
                        self.htmlElement.style.height = currentHeight + "px";
                        self.htmlElement.style.top = self.mouseMoveEvent.clientY + "px";
                    }
                }
                if (self.options.dependantElements) {
                    for (var i = 0; i <= self.options.dependantElements.length - 1; i++) {
                        self.options.dependantElements[i].style.height = currentHeight;
                    }
                }
            }

            return;
        }

        if (self.clickActionInfo && self.clickActionInfo.isMoving) {
            var opacity = 0.2;
            var hide = true;
            self.ghostPanel.style.display = "";
            if (self.boundingClientRect.top < self.fullScreenMargins || self.boundingClientRect.left < self.fullScreenMargins ||
                self.boundingClientRect.right > window.innerWidth - self.fullScreenMargins ||
                self.boundingClientRect.bottom > window.innerHeight - self.fullScreenMargins) {

                self.setBounds(self.ghostPanel, 0, 0, window.innerWidth, window.innerHeight);
                hide = false;
            }

            if (self.boundingClientRect.top < self.margins) {
                self.setBounds(self.ghostPanel, 0, 0, window.innerWidth, window.innerHeight / 2);
                hide = false;
            }

            if (self.boundingClientRect.left < self.margins) {
                self.setBounds(self.ghostPanel, 0, 0, window.innerWidth / 2, window.innerHeight);
                hide = false;
            }

            if (self.boundingClientRect.right > self.rightScreenEdge) {
                self.setBounds(self.ghostPanel, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
                hide = false;
            }

            if (self.boundingClientRect.bottom > self.bottomScreenEdge) {
                self.setBounds(self.ghostPanel, 0, window.innerHeight / 2, window.innerWidth, window.innerWidth / 2);
                hide = false;
            }
            if (!hide)
                self.ghostPanel.style.opacity = opacity;
            if (hide)
                self.hideGhostPanel();
            if (self.options.gridMode) {
                self.ghostPanel.style.display = "";
                self.ghostPanel.style.top = (self.mouseMoveEvent.clientY - self.clickActionInfo.top) + 'px';
                self.ghostPanel.style.left = (self.mouseMoveEvent.clientX - self.clickActionInfo.left) + 'px';
            } else {
                self.htmlElement.style.top = (self.mouseMoveEvent.clientY - self.clickActionInfo.top) + 'px';
                self.htmlElement.style.left = (self.mouseMoveEvent.clientX - self.clickActionInfo.left) + 'px';
            }
            if (self.options.dependantElements) {
                for (var i = 0; i <= self.options.dependantElements.length - 1; i++) {
                    self.options.dependantElements[i].style.top = (self.mouseMoveEvent.clientY - self.clickActionInfo.top) + 'px';
                    self.options.dependantElements[i].style.left = (self.mouseMoveEvent.clientX - self.clickActionInfo.left) + 'px';
                }
            }
            return;
        }


        var cursor = "default";
        if (self.canMove() && self.options.changeDragCursor)
            cursor = "move";
        if (self.options.allowResize.left && self.onLeftEdge)
            cursor = "ew-resize";
        if (self.options.allowResize.right && self.onRightEdge)
            cursor = "ew-resize";
        if (self.options.allowResize.top && self.onTopEdge)
            cursor = "ns-resize";
        if (self.options.allowResize.bottom && self.onBottomEdge)
            cursor = "ns-resize";

        self.htmlElement.style.cursor = cursor;
    }

    this.destroy = function () {
        self.thElement.removeEventListener(jw.DOM.events.MOUSE_DOWN_EVENT, this.onMouseDown);
        self.thElement.removeEventListener(jw.DOM.events.TOUCH_START_EVENT, this.onTouchStart);

        jwDocumentEventManager.removeDocumentEventListener(jw.DOM.events.MOUSE_MOVE_EVENT, this.onMouseMove);
        jwDocumentEventManager.removeDocumentEventListener(jw.DOM.events.MOUSE_UP_EVENT, this.onMouseUp);

        jwDocumentEventManager.removeDocumentEventListener(jw.DOM.events.TOUCH_MOVE_EVENT, this.onTouchMove);
        jwDocumentEventManager.removeDocumentEventListener(Tjw.DOM.events.OUCH_END_EVENT, this.onTouchEnd);
    }

    this.htmlElement.addEventListener(jw.DOM.events.MOUSE_DOWN_EVENT, this.onMouseDown);
    this.htmlElement.addEventListener(jw.DOM.events.TOUCH_START_EVENT, this.onTouchStart);

    jwDocumentEventManager.addDocumentEventListener(jw.DOM.events.MOUSE_MOVE_EVENT, this.onMouseMove);
    jwDocumentEventManager.addDocumentEventListener(jw.DOM.events.MOUSE_UP_EVENT, this.onMouseUp);

    jwDocumentEventManager.addDocumentEventListener(jw.DOM.events.TOUCH_MOVE_EVENT, this.onTouchMove);
    jwDocumentEventManager.addDocumentEventListener(jw.DOM.events.TOUCH_END_EVENT, this.onTouchEnd);

    this.animateMove();

}