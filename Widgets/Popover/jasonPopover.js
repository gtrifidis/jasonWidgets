/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonPopover.prototype = Object.create(jasonBaseWidget.prototype);
jasonPopover.prototype.constructor = jasonPopover;

/**
 * @class
 * @name jasonPopoverOptions
 * @description Configuration for the Popover widget.
 * @memberOf Containers
 * @augments Common.jasonWidgetOptions
 * @property {string|HTMLElement|function} content - The content of the popover. Can be a simple string, a script tag, a function or a HTMLElement.
 * @propert  {string} [title=undefined] - Title for the popover.
 * @property {boolean} [autoPlacement=true] - Smart placement of the popover based on the available real-estate of the current view. This will override any position setting.
 * @property {boolean} [autoSize=false] - Smart resize of the popover based on the available real-estate of the current view.
 * @property {boolean} [closeButton=true] - Shows a close button on the top right corner.
 * @property {string}  [position=top] - Popover display position. Possible values [top|left|bottom|right]. Positioning works when popover mode is 'tooltip' or when targetElement is defined.
 * @property {string} [arrowPlacement=middle] - Possible values [left|middle|right]. If set to left the popover arrow will be displayed on the left of the target element.
 * @property {object} [coordinates=undefined] - Popover placement coordinates. If popover mode is 'popover' and no targetElement is defined it will try to display the popover using those coordinates.
 * @property {number} [coordinates.top=undefined] - Number value on the Y axis.
 * @property {number} [coordinates.left=undefined] - Number value on the X axis.
 * @property {HTMLElement|string} [targetElement=undefined] - Target element or id of an element for the popover to be shown.
 * @property {string} [mode=popover] - Function mode. popover | tooltip. If the widget is set to be in tooltip mode, it must have a targetElement. When the mouse cursor hovers over the targetElement the popover will be shown,just like a tooltip.
 * @property {object} [model=undefined] - Popover's model. It will be used when rendering the popover body if the content is a jwTemplate.
 */

/**
 * @event Containers.jasonPopover#onShow
 * @type {object}
 * @description Occurs when popover is shown and all animations have been completed.
 * @property {Containers.jasonPopover} sender - The popover instance.
 */

/**
 * @event Containers.jasonPopover#onHide
 * @description Occurs when popover is hidden and all animations have been completed.
 * @type {object}
 * @property {Containers.jasonPopover} sender - The popover instance.
 */

/**
 * jasonPopover
 * @constructor
 * @descrption Popover control widget.
 * @memberOf Containers
 * @augments Common.jasonBaseWidget
 * @param {Containers.jasonPopoverOptions} options - Popover control options. 
 * @fires Containers.jasonPopover#event:onShow 
 * @fires Containers.jasonPopover#event:onHide
 */
function jasonPopover(options) {
    this.defaultOptions = {
        autoPlacement: true,
        autoSize: false,
        closeButton: true,
        position: 'top',
        mode: 'popover',
        arrowPlacement:'middle'
    };
    var htmlElement = document.createElement("DIV");
    htmlElement.style.display = "none";
    this.toggle = this.toggle.bind(this);
    jasonBaseWidget.call(this, "jasonPopover", htmlElement, options, jasonPopoverUIHelper);
    if (this.options.mode.toLowerCase() == 'tooltip' && !this.options.targetElement)
        jw.common.throwError(jw.errorTypes.error, "Popover widget is set to be in tooltip mode but no target element has been defined.");
    this.arrowSize = 7;
    this._spaceInformation = {
        exceedingLeftPixels: null,
        exceedingRightPixels: null,
        exceedingTopPixels: null,
        exceedingBottomPixels: null,
        needsResize:false,
        canShowOnTop:false,
        canShowOnLeft:false,
        canShowOnRight:false,
        canShowOnBottom: false,
        leftForVertical: null,
        topForHorizontal:null
    };
}
/**
 * Shows the popover.
 */
jasonPopover.prototype.show = function () {
    if (this.readonly || !this.enabled)
        return;
    if (this.htmlElement.style.display == "none") {
        document.body.appendChild(this.htmlElement);
        this.htmlElement.style.display = "";
        if (this.htmlElement.style.zIndex == "") {
            this.htmlElement.style.zIndex = jw.common.getNextZIndex();
        } else {
            var zIndex = parseInt(this.htmlElement.style.zIndex);
            var newZIndex = jw.common.getNextZIndex();
            if (zIndex < newZIndex) {
                this.htmlElement.style.zIndex = newZIndex;
            }
        }
        this._placePopover();
        this.ui.targetElementClientRect = this.options.targetElement.getBoundingClientRect();
        this.ui.monitorTargetElement();
        this.triggerEvent(jw.DOM.events.JW_EVENT_ON_SHOW, this);
    }
}
/**
 * Hides the popover.
 */
jasonPopover.prototype.hide = function () {
    if (this.htmlElement.style.display == "") {
        this.htmlElement.style.display = "none";
        document.body.removeChild(this.htmlElement);
        this.triggerEvent(jw.DOM.events.JW_EVENT_ON_HIDE, this);
    }
}
/**
 * Toggle the visible state of the popover
 */
jasonPopover.prototype.toggle = function (event) {
    if (this.htmlElement.style.display == "")
        this.hide();
    else
        this.show();
}
/**
 * @ignore
 * Gets space information around the target element, to find out where is there more available space to display the popover.
 */
jasonPopover.prototype._getSpaceInformation = function (targetElementRect,spaceInformationObject,dimensions) {
    var spaceInfoObj = spaceInformationObject ? spaceInformationObject : this._spaceInformation;
    var htmlElementRect = this.htmlElement.getBoundingClientRect();
    var popoverDimensions = dimensions ? dimensions : {height:this.htmlElement.offsetHeight, width:this.htmlElement.offsetWidth};

    //find the exceeding pixels of the popover on the current view.
    //a negative value means that there is enough space to display the popover without resizing it.
    spaceInfoObj.exceedingLeftPixels = (popoverDimensions.width + this.arrowSize) - targetElementRect.left;
    spaceInfoObj.exceedingRightPixels = (targetElementRect.right + popoverDimensions.width + this.arrowSize) - document.body.offsetWidth;
    spaceInfoObj.exceedingTopPixels = ((popoverDimensions.height + this.arrowSize) - targetElementRect.clientRect.top);
    spaceInfoObj.exceedingBottomPixels = (popoverDimensions.height + this.arrowSize) - (document.documentElement.offsetHeight - targetElementRect.clientRect.bottom);

    //left coordinate for displaying the popover either top or bottom.
    var leftForVertical = ((targetElementRect.left + targetElementRect.width / 2) - popoverDimensions.width / 2)
    //top coordinate for display the popover either left or right.
    var topForHorizontal = ((targetElementRect.top + targetElementRect.height / 2) - popoverDimensions.height / 2) - this.arrowSize;

    spaceInfoObj.leftForVertical = leftForVertical;
    spaceInfoObj.topForHorizontal = topForHorizontal;

    //when there is somewhat complicated logical calculations i prefer it to be verbose than minimal.

    //if there is enough space on the top.
    spaceInfoObj.canShowOnTop = spaceInfoObj.exceedingTopPixels <= 0;

    if (spaceInfoObj.canShowOnTop) {
        //if there is enough space to show on top/bottom, set the left position to zero.
        //this will have the effect of showing the popover aligned to the left of the targetElement
        //and set the arrow placement to left
        if (leftForVertical < 0)
            leftForVertical = 0;
        //if the calculated left position is at least zero.
        spaceInfoObj.canShowOnTop = spaceInfoObj.canShowOnTop && leftForVertical >= 0;

        if (spaceInfoObj.canShowOnTop) {
            //if the left calculated coordinate is smaller than the target element's left position.
            spaceInfoObj.canShowOnTop = spaceInfoObj.canShowOnTop && leftForVertical < targetElementRect.left;

            if (spaceInfoObj.canShowOnTop) {
                //if the calculated left position + the popover width + any scrolling pixels does not exceed the document.body width.
                spaceInfoObj.canShowOnTop = spaceInfoObj.canShowOnTop && (leftForVertical + popoverDimensions.width + targetElementRect.scrolling.left) < document.body.offsetWidth;
                if (spaceInfoObj.canShowOnTop) {
                    //if the calculated left position + any scrolling pixels + half of the popover does not exceed the targetElement's right position. This is because we want the popover
                    //to be centered based on the targetElement position.
                    if (leftForVertical > 0)
                        spaceInfoObj.canShowOnTop = spaceInfoObj.canShowOnTop && (leftForVertical + targetElementRect.scrolling.left + popoverDimensions.width / 2) < targetElementRect.right;
                }
            }
        }
    }
    
    //if there is enough space on the bottom.
    spaceInfoObj.canShowOnBottom = spaceInfoObj.exceedingBottomPixels <= 0;

    if (spaceInfoObj.canShowOnBottom) {
        //if there is enough space to show on top/bottom, set the left position to zero.
        //this will have the effect of showing the popover aligned to the left of the targetElement
        //and set the arrow placement to left
        if (leftForVertical < 0)
            leftForVertical = 0;
        //if the calculated left position is at least zero.
        spaceInfoObj.canShowOnBottom = spaceInfoObj.canShowOnBottom && leftForVertical >= 0;

        if (spaceInfoObj.canShowOnBottom) {
            //if the left calculated coordinate is smaller than the target element's left position.
            spaceInfoObj.canShowOnBottom = spaceInfoObj.canShowOnBottom && leftForVertical < targetElementRect.left;

            if (spaceInfoObj.canShowOnBottom) {
                //if the calculated left position + the popover width + any scrolling pixels does not exceed the document.body width.
                spaceInfoObj.canShowOnBottom = spaceInfoObj.canShowOnBottom && (leftForVertical + popoverDimensions.width + targetElementRect.scrolling.left) < document.body.offsetWidth;
                if (spaceInfoObj.canShowOnBottom) {
                    //if the calculated left position + any scrolling pixels + half of the popover does not exceed the targetElement's right position. This is because we want the popover
                    //to be centered based on the targetElement position.
                    if (leftForVertical > 0)
                        spaceInfoObj.canShowOnBottom = spaceInfoObj.canShowOnBottom && (leftForVertical + targetElementRect.scrolling.left + popoverDimensions.width / 2) < targetElementRect.right;
                }
            }
        }
    }

    //if can show on the left
    spaceInfoObj.canShowOnLeft = spaceInfoObj.exceedingLeftPixels <= 0

    if (spaceInfoObj.canShowOnLeft) {
        spaceInfoObj.canShowOnLeft = spaceInfoObj.canShowOnLeft && topForHorizontal >= 0;
        if (spaceInfoObj.canShowOnLeft) {
            var bottom = targetElementRect.bottom > targetElementRect.clientRect.bottom ? targetElementRect.bottom : targetElementRect.clientRect.bottom;
            //if from the top position + half the height of the popover does not exceed the height of the document.
            spaceInfoObj.canShowOnLeft = spaceInfoObj.canShowOnLeft &&
                (topForHorizontal + (popoverDimensions.height / 2)) < document.documentElement.offsetHeight;
        }
    }

    //if can show on the left
    spaceInfoObj.canShowOnRight = spaceInfoObj.exceedingRightPixels <= 0

    if (spaceInfoObj.canShowOnRight) {
        spaceInfoObj.canShowOnRight = spaceInfoObj.canShowOnRight && topForHorizontal >= 0;

        if (spaceInfoObj.canShowOnRight) {
            var bottom = targetElementRect.bottom > targetElementRect.clientRect.bottom ? targetElementRect.bottom : targetElementRect.clientRect.bottom;
            //if from the top position + half the height of the popover does not exceed the height of the document.
            spaceInfoObj.canShowOnRight = spaceInfoObj.canShowOnRight &&
                (topForHorizontal + (popoverDimensions.height / 2)) < document.documentElement.offsetHeight;
        }
    }

    spaceInfoObj.needsResize = !spaceInfoObj.canShowOnTop && !spaceInfoObj.canShowOnBottom && !spaceInfoObj.canShowOnLeft && !spaceInfoObj.canShowOnRight;
    return spaceInfoObj;
}
/**
 * @ignore
 * Popover placement.
 */
jasonPopover.prototype._placePopover = function () {
    //removing all classes prior to showing the popover.
    var coordinates = { left: 0, top: 0 };
    this.htmlElement.classList.remove(jw.DOM.classes.JW_TOP);
    this.htmlElement.classList.remove(jw.DOM.classes.JW_BOTTOM);
    this.htmlElement.classList.remove(jw.DOM.classes.JW_LEFT);
    this.htmlElement.classList.remove(jw.DOM.classes.JW_RIGHT);

    this.htmlElement.classList.remove(jw.DOM.classes.JW_ARROW_LEFT);
    this.htmlElement.classList.remove(jw.DOM.classes.JW_ARROW_MIDDLE);
    this.htmlElement.classList.remove(jw.DOM.classes.JW_ARROW_RIGHT);
    var clientRect = null;
    //if explicit coordinates are set we just set the popover to those coordinates.
    if (this.options.coordinates) {
        coordinates.top = this.options.coordinates.top;
        coordinates.left = this.options.coordinates.left;
    } else {
        if (this.options.targetElement) {
            this.htmlElement.style.height = "";
            this.htmlElement.style.width = "";
            this.htmlElement.style.top = "0px";
            this.htmlElement.style.left = "0px";
            clientRect = jw.common.getBoundingClientRect(this.options.targetElement);
            
            //getting space information around the target element
            this._getSpaceInformation(clientRect);

            //if autoPlacement is true then reset the arrow placement to it's default.
            if (this.options.autoPlacement) {
                this.options.arrowPlacement = "middle";
                this._choosePosition();
            }

            //if auto-resize is on then resize it if needed.
            if (this.options.autoSize && this._spaceInformation.needsResize) {
                this._resizePopover(clientRect);
                this._getSpaceInformation(clientRect);
                if (this.options.autoPlacement)
                    this._choosePosition();
            }
            else {
                if (this.options.position == "none")
                    this.options.position = "top";
            }

           coordinates =  this._getCoordinates(clientRect);
        }
    }
    switch (this.options.position.toLowerCase()) {
        case jw.DOM.classes.JW_TOP: { this.htmlElement.classList.add(jw.DOM.classes.JW_TOP); break; }
        case jw.DOM.classes.JW_LEFT: { this.htmlElement.classList.add(jw.DOM.classes.JW_LEFT); break; }
        case jw.DOM.classes.JW_BOTTOM: { this.htmlElement.classList.add(jw.DOM.classes.JW_BOTTOM); break; }
        case jw.DOM.classes.JW_RIGHT: { this.htmlElement.classList.add(jw.DOM.classes.JW_RIGHT); break; }
    }

    switch (this.options.arrowPlacement.toLowerCase()) {
        case jw.DOM.classes.JW_LEFT: { this.htmlElement.classList.add(jw.DOM.classes.JW_ARROW_LEFT); break; }
        //case jw.DOM.classes.JW_MIDDLE: { this.htmlElement.classList.add(jw.DOM.classes.JW_ARROW_MIDDLE); break; }
        case jw.DOM.classes.JW_RIGHT: { this.htmlElement.classList.add(jw.DOM.classes.JW_ARROW_RIGHT); break; }
    }

    this.htmlElement.style.top = coordinates.top + "px";
    this.htmlElement.style.left =coordinates.left + "px";
}
/**
 * @ignore
 * Choose best position based on the current view real-estate.
 */
jasonPopover.prototype._choosePosition = function () {

    //try 'top' first.
    if (this._spaceInformation.canShowOnTop) {
        this.options.position = 'top';
        return;
    }
    //try 'bottom'
    if (this._spaceInformation.canShowOnBottom) {
        this.options.position = 'bottom';
        return;
    }

    //try 'left'
    if (this._spaceInformation.canShowOnLeft) {
        this.options.position = 'left';
        return;
    }

    //try 'right'
    if (this._spaceInformation.canShowOnRight) {
        this.options.position = 'right';
        return;
    }
    this.options.position = "none";
    return;
}
/**
 * @ignore
 * Automatically resizes the popover to fit the current view.
 */
jasonPopover.prototype._resizePopover = function (clientRect) {
    var originalHeight = this.htmlElement.offsetHeight;
    var originalWidth = this.htmlElement.offsetWidth;
    var candidatePosition = "none";
    var coordinates;
    if (this.options.autoPlacement) {
        //try to find in which direction there is more space
        var positionInfo = {
            left: clientRect.left,
            top: document.documentElement.offsetHeight - clientRect.top,
            right: document.body.offsetWidth - clientRect.right,
            bottom: document.documentElement.offsetHeight - (clientRect.clientRect.bottom + clientRect.scrolling.top)
        };

        if ((positionInfo.top > positionInfo.right) && (positionInfo.top > positionInfo.left) && (positionInfo.top > positionInfo.bottom)) {
            candidatePosition = "top";
        }

        if ((positionInfo.left > positionInfo.top) && (positionInfo.left > positionInfo.right) && (positionInfo.left > positionInfo.bottom)) {
            candidatePosition = "left";
        }

        if ((positionInfo.right > positionInfo.top) && (positionInfo.right > positionInfo.left) && (positionInfo.right > positionInfo.bottom)) {
            candidatePosition = "right";
        }

        if ((positionInfo.bottom > positionInfo.top) && (positionInfo.bottom > positionInfo.left) && (positionInfo.bottom > positionInfo.right)) {
            candidatePosition = "bottom";
        }
    }
    else
        candidatePosition = this.options.position.toLowerCase();
    var spaceInfo = {};
    var calculatedWidth = originalWidth;
    var calculatedHeight = originalHeight;
    //once we found our candidate position, we are going to simulate resizing and placement till we reach the point
    //that no resizing is needed for that position.
    switch (candidatePosition) {
        case "top": {
            spaceInfo = this._getSpaceInformation(clientRect, spaceInfo);
            while (!spaceInfo.canShowOnTop) {
                if ((spaceInfo.leftForVertical + calculatedWidth > document.body.offsetWidth) || spaceInfo.leftForVertical < 0) {
                    calculatedWidth = calculatedWidth - (Math.abs(spaceInfo.leftForVertical));
                }
                if (spaceInfo.exceedingTopPixels > 0) {
                    calculatedHeight = calculatedHeight - (spaceInfo.exceedingTopPixels + this.arrowSize);
                }
                //i do not really like this, it is a hack. But when height is below zero set it to the minimum height of 50.
                if (calculatedHeight < 0)
                    calculatedHeight = 50;
                spaceInfo = this._getSpaceInformation(clientRect, spaceInfo, { height: Math.round(calculatedHeight), width: Math.round(calculatedWidth) });
                //another safety hack, if there is no more need to resize break the loop.
                //i need to revisit this whole function and clean it up by removing the hacks.
                if (!spaceInfo.needsResize)
                    break;
            }
            break;
        }
        case "left": {
            spaceInfo = this._getSpaceInformation(clientRect, spaceInfo);
            while (!spaceInfo.canShowOnLeft) {
                if (spaceInfo.exceedingLeftPixels > 0) {
                    calculatedWidth = calculatedWidth - (spaceInfo.exceedingLeftPixels + this.arrowSize);
                }
                if ((spaceInfo.topForHorizontal + calculatedHeight > document.documentElement.offsetHeight) || spaceInfo.topForHorizontal < 0) {
                    calculatedHeight = calculatedHeight - (Math.abs(spaceInfo.topForHorizontal));
                }
                if (calculatedHeight < 0)
                    calculatedHeight = 50;
                spaceInfo = this._getSpaceInformation(clientRect, spaceInfo, { height: Math.round(calculatedHeight), width: Math.round(calculatedWidth) });
                if (!spaceInfo.needsResize)
                    break;
            }
            break;
        }
        case "bottom": {
            spaceInfo = this._getSpaceInformation(clientRect, spaceInfo);
            while (!spaceInfo.canShowOnBottom) {
                if ((spaceInfo.leftForVertical + calculatedWidth > document.body.offsetWidth) || spaceInfo.leftForVertical < 0) {
                    calculatedWidth = calculatedWidth - (Math.abs(spaceInfo.leftForVertical));
                }
                if (spaceInfo.exceedingBottomPixels > 0) {
                    calculatedHeight = calculatedHeight - (spaceInfo.exceedingBottomPixels + this.arrowSize);
                }
                if (calculatedHeight < 0)
                    calculatedHeight = 50;
                spaceInfo = this._getSpaceInformation(clientRect, spaceInfo, { height: Math.round(calculatedHeight), width: Math.round(calculatedWidth) });
                if (!spaceInfo.needsResize)
                    break;
            }
            break;
        }
        case "right": {
            spaceInfo = this._getSpaceInformation(clientRect, spaceInfo);
            while (!spaceInfo.canShowOnRight) {
                if (spaceInfo.exceedingRightPixels > 0) {
                    calculatedWidth = calculatedWidth - (spaceInfo.exceedingRightPixels + this.arrowSize);
                }
                if ((spaceInfo.topForHorizontal + calculatedHeight > document.documentElement.offsetHeight) || spaceInfo.topForHorizontal < 0) {
                    calculatedHeight = calculatedHeight - (Math.abs(spaceInfo.topForHorizontal));
                }
                if (calculatedHeight < 0)
                    calculatedHeight = 50;
                spaceInfo = this._getSpaceInformation(clientRect, spaceInfo, { height: Math.round(calculatedHeight), width: Math.round(calculatedWidth) });
                if (!spaceInfo.needsResize)
                    break;
            }
            break;
        }
    }
    this.htmlElement.style.width = calculatedWidth + "px";
    this.htmlElement.style.height = calculatedHeight + "px";
}
/**
 * @ignore
 */
jasonPopover.prototype._getCoordinates = function (clientRect, position, dimensions) {
    var popoverPosition = position ? position.toLowerCase() : this.options.position.toLowerCase();
    var popoverDimensions = dimensions ? dimensions : {height:this.htmlElement.offsetHeight,width:this.htmlElement.offsetWidth};
    var coordinates = { left: 0, top: 0 };
    switch (popoverPosition) {
        case jw.DOM.classes.JW_TOP: {
            coordinates.top = ((clientRect.top) - popoverDimensions.height) - this.arrowSize;
            coordinates.left = ((clientRect.left + clientRect.width / 2) - popoverDimensions.width / 2);
            if (coordinates.left < 0 && this.options.autoPlacement)
                this.options.arrowPlacement = jw.DOM.classes.JW_LEFT;
            switch (this.options.arrowPlacement.toLowerCase()) {
                case jw.DOM.classes.JW_LEFT: {
                    coordinates.left = clientRect.left;
                    break;
                }
                case jw.DOM.classes.JW_RIGHT: {
                    coordinates.left = Math.abs(clientRect.right - popoverDimensions.width);
                    break;
                }
                default: {
                    break;
                }
            }
            break;
        }
        case jw.DOM.classes.JW_LEFT: {
            coordinates.left = clientRect.left - popoverDimensions.width;
            switch (this.options.arrowPlacement.toLowerCase()) {
                case jw.DOM.classes.JW_LEFT: {
                    coordinates.top = clientRect.top;
                    break;
                }
                case jw.DOM.classes.JW_RIGHT: {
                    coordinates.top = clientRect.bottom;
                    break;
                }
                default: {
                    coordinates.top = ((clientRect.top + clientRect.height / 2) - popoverDimensions.height / 2);
                    break;
                }
            }
            break;
        }
        case jw.DOM.classes.JW_BOTTOM: {
            coordinates.top = clientRect.top + clientRect.height + this.arrowSize;
            coordinates.left = ((clientRect.left + clientRect.width / 2) - popoverDimensions.width / 2);
            if (coordinates.left < 0 && this.options.autoPlacement)
                this.options.arrowPlacement = jw.DOM.classes.JW_LEFT;
            switch (this.options.arrowPlacement.toLowerCase()) {
                case jw.DOM.classes.JW_LEFT: {
                    coordinates.left = clientRect.left;
                    break;
                }
                case jw.DOM.classes.JW_RIGHT: {
                    coordinates.left = (clientRect.right - popoverDimensions.width);
                    break;
                }
                default: {
                    break;
                }
            }
            break;
        }
        case jw.DOM.classes.JW_RIGHT: {
            coordinates.left = clientRect.right + this.arrowSize;
            switch (this.options.arrowPlacement.toLowerCase()) {
                case jw.DOM.classes.JW_LEFT: {
                    coordinates.top = clientRect.top;
                    break;
                }
                case jw.DOM.classes.JW_RIGHT: {
                    coordinates.top = clientRect.bottom;
                    break;
                }
                default: {
                    coordinates.top = ((clientRect.top + clientRect.height / 2) - popoverDimensions.height / 2);
                    break;
                }
            }
            break;
        }
    }
    return coordinates;
}

jasonPopoverUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonPopoverUIHelper.prototype.constructor = jasonPopoverUIHelper;

/**
    * Textbox UI widget helper.
    * @constructor
    * @ignore
    */
function jasonPopoverUIHelper(widget, htmlElement) {
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);
    this.header = null;
    this.body = null;
    this.closeButton = null;
    this.title = null;
    if (typeof this.options.targetElement == "string")
        this.options.targetElement = document.getElementById(this.options.targetElement);
    this.initializeContent();
    this.targetElementClientRect = null;
    this.monitorTargetElement = this.monitorTargetElement.bind(this);
}
/**
 * Initialize popover UI events.
 */
jasonPopoverUIHelper.prototype.initializeEvents = function () {
    if (this.options.targetElement && this.options.mode.toLowerCase() == "popover") {
        this.eventManager.addEventListener(this.options.targetElement, jw.DOM.events.CLICK_EVENT, this.widget.toggle);
    }
    var self = this;
    if (this.options.mode.toLowerCase() != "validation") {
        jwDocumentEventManager.addDocumentEventListener(jw.DOM.events.MOUSE_DOWN_EVENT, function (event) {
            if (jw.common.isMouseEventOutOfContainer(self.widget.htmlElement, event))
                self.widget.hide();
        });
    }
}
/**
 * 
 */
jasonPopoverUIHelper.prototype.initializeContent = function () {
    this.options.content = jw.common.parseTemplateContent(this.options.content);
}
/**
    * Renders popover control's HTML.
    */
jasonPopoverUIHelper.prototype.renderUI = function () {
    var self = this;
    if (!this.htmlElement.classList.contains(jw.DOM.classes.JW_POPOVER)) {
        this.htmlElement.classList.add(jw.DOM.classes.JW_POPOVER);
        this.header = this.createElement("DIV");
        this.header.classList.add(jw.DOM.classes.JW_POPOVER_HEADER);
        this.title = jw.htmlFactory.createJWLinkLabel(this.options.title);
        this.header.appendChild(this.title);
        if (this.options.closeButton) {
            this.closeButton = jw.htmlFactory.createJWButton(null, jw.DOM.icons.CLOSE);
            this.header.appendChild(this.closeButton);
            this.title.classList.add(jw.DOM.classes.JW_HAS_ICON);
            this.eventManager.addEventListener(this.closeButton, jw.DOM.events.CLICK_EVENT, function (event) {
                self.widget.hide();
            },true);
        }

        jwWindowEventManager.addWindowEventListener(jw.DOM.events.RESIZE_EVENT, function (event) {
            if (self.widget.options.mode.toLowerCase() == "validation") {
                setTimeout(function () {
                    self.widget._placePopover();
                });
            }
            else
                self.widget.hide();
        });

        if (this.options.mode.toLowerCase() == "tooltip") {
            var showToolTip = true;
            this.eventManager.addEventListener(this.options.targetElement, jw.DOM.events.MOUSE_ENTER_EVENT, function (event) {
                showToolTip = true;
                setTimeout(function () {
                    if (showToolTip)
                        self.widget.show();
                }, 500);

            });
            this.eventManager.addEventListener(this.options.targetElement, jw.DOM.events.MOUSE_LEAVE_EVENT, function (event) {
                showToolTip = false;
                setTimeout(function () {
                    self.widget.hide();
                },750);
                
            });
        }

        this.body = this.createElement("DIV");
        this.body.classList.add(jw.DOM.classes.JW_POPOVER_BODY);
        if (this.options.content) {
            jw.common.applyTemplate(this.body, this.options.content, this.options.customization.dataFieldAttribute, this.options.model);
        }
        this.htmlElement.appendChild(this.header);
        this.htmlElement.appendChild(this.body);
    }
}
/**
 * Monitors the target element while the popover is visible, to reposition itself
 * if there is a scrolling or resize event.
 */
jasonPopoverUIHelper.prototype.monitorTargetElement = function () {
    if (this.htmlElement.style.display == "") {
        var targetClientRect = this.options.targetElement.getBoundingClientRect();
        if (jw.common.simpleObjectComparison(this.targetElementClientRect, targetClientRect) != jw.enums.comparison.equal) {
            this.widget._placePopover();
            this.targetElementClientRect = targetClientRect;
        }
        //   if (this.htmlElement.style.display == "")
        window.requestAnimationFrame(this.monitorTargetElement);
    }
    else
        return;
}

