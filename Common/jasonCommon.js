/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var
    //attritbutes
    TABINDEX_ATTR = "tabindex",
    TYPE_ATTR = "type",
    PLACEHOLDER_ATTR = "placeholder",
    READONLY_ATTR = "readonly",
    INPUT_MODE_ATTR = "inputmode",
    TITLE_ATTR = "title",
    DRAGGABLE_ATTR = "draggable",
    COLSPAN_ATTR = "colspan",
    //jw-widgets specific
    DATA_ITEM_INDEX_ATTR = "jw-data-item-index",
    DATA_ROW_ID_ATTR = "jw-data-row-id",
    DATA_CELL_ID_ATTR = "jw-data-cell-id",
    DATA_GROUPING_LEVEL_ATTR = "jw-data-grouping-level",
    DATA_GROUPING_FIELD_ATTR = "jw-data-grouping-field",
    DATA_GROUP_EXPANDED_ATTR = "jw-data-group-expanded",
    DATA_GROUP_COLLAPSED_ATTR = "jw-data-group-collpsed",
    ITEM_INDEX_ATTR = "jw-item-index",
    CLEAR_FLOAT_CLASS = "jw-clear-float",
    JW_DISABLED = "jw-disabled",
    JW_READONLY = "jw-readonly",
    JW_UNSELECTABLE = "jw-unselectable",
    JW_DRAG_IMAGE = "jw-drag-image-container",
    //DOM events
    CLICK_EVENT = "click",
    MOUSE_DOWN_EVENT = "mousedown",
    MOUSE_LEAVE_EVENT = "mouseleave",
    MOUSE_ENTER_EVENT = "mouseenter"
    MOUSE_OVER_EVENT = "mouseover",
    MOUSE_OUT_EVENT = "mouseout",
    MOUSE_MOVE_EVENT = "mousemove",
    MOUSE_UP_EVENT = "mouseup",
    INPUT_EVENT = "input",
    RESIZE_EVENT = "resize",
    KEY_DOWN_EVENT = "keydown",
    KEY_PRESS_EVENT = "keypress",
    KEY_UP_EVENT = "keyup",
    FOCUS_EVENT = "focus",
    CHANGE_EVENT = "change",
    SCROLL_EVENT = "scroll",
    CONTEXT_MENU_EVENT = "contextmenu",
    DRAG_START_EVENT = "dragstart",
    DRAG_OVER_EVENT = "dragover",
    DRAG_ENTER_EVENT = "dragenter",
    DRAG_EXIT_EVENT = "dragexit",
    DRAG_END_EVENT = "dragend",
    DRAG_EVENT = "drag",
    DROP_EVENT = "drop",
    BLUR_EVENT = "blur",
    TOUCH_START_EVENT = "touchstart",
    TOUCH_MOVE_EVENT = "touchmove",
    TOUCH_END_EVENT = "touchend",
    TOUCH_CANCEL_EVENT = "touchcancel",
    TOUCH_EVENT = "touch";

//jasonWidgets Events
    var
        JW_EVENT_ON_CHANGE = "onChange";

    var
        //global events
        JGE_REDRAW = 1000;
/**
 * @namespace Common
 * @description Common or base classes for jasonWidgets.
 */

/**
 * Common jasonWidgets that has functionality being used across jasonWidgets.
 * @constructor
 * @memberOf Common
 */
function jasonCommon() {
    this.HTMLCanvas = null;
    this._benchmark = false;
    this._jwWidgetsCatalog = [];
    this.globalEventListeners = [];
    var self = this;
    this._registerWidget = function (jwWidget) {
        self._jwWidgetsCatalog.push({uid:jwWidget._uid,widget:jwWidget});
    }
    /**
     * jasonWidget flavored extend object function.
     * @param {object} sourceObject - Object to extend from
     * @param {object} targetObject - Object to extend to
     * @returns {object} targetObject.
     */
    jasonCommon.prototype.extendObject = function (sourceObject, targetObject) {
        if (!targetObject)
            targetObject = {};
        for (var prop in sourceObject) {
            if (targetObject[prop] == undefined || targetObject[prop] == null) {
                targetObject[prop] = sourceObject[prop];
            }
            if ((targetObject[prop]) && (typeof targetObject[prop] == "object" && typeof sourceObject[prop] == "object")) {
                this.extendObject(sourceObject[prop], targetObject[prop]);
            }
        }
    }
    /**
     * String format function.
     * @param {string} formatString - String with format tokens, eg "jasonWidgets are the {0}"
     * @param {array} args - Array of arguments.
     * @returns {string}
     */
    jasonCommon.prototype.formatString = function(formatString,args){
        for (var i = 0; i < args.length; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatString = formatString.replace(regexp, args[i]);
        }
        return formatString;
    }
    /**
     * Returns the count of a char in a string .
     * @param {string} char - Char to search for."
     * @param {array} args - String that contains the char.
     * @returns {number} count.
     */
    jasonCommon.prototype.charCountInString = function (char, containerString) {
       
        return containerString.split(char).length - 1;
    }
    /**
     * Date format function.
     * @param {date} date - Date value to be formated.
     * @param {string} format - Date string format. {@link https://msdn.microsoft.com/en-us/library/8kb3ddd4%28v=vs.110%29.aspx}
     * @returns {string}
     */
    jasonCommon.prototype.formatDateTime = function (date, format) {
        if (!format)
            format = jasonWidgets.localizationManager.currentCulture.dateFormat;
        var result = "";
        
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDay();
        var caldate = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var miliseconds = date.getMilliseconds();
        var formatTokens = ["d","M","m","y","H","h","s","m","f","t"];
        var isCharAToken = function (char) {
            return formatTokens.indexOf(char) >= 0;
        }
        if (date) {
            var tempToken = null;
            var tempTokenIndex = null;
            if (format.indexOf(jasonWidgets.localizationManager.postMeridiemString) >= 0)
                format.replace(jasonWidgets.localizationManager.postMeridiemString, "");

            if (format.indexOf(jasonWidgets.localizationManager.anteMeridiemString) >= 0)
                format.replace(jasonWidgets.localizationManager.anteMeridiemString, "");

            for (var i = 0; i <= format.length - 1; i++) {
                var token = format[i];
                var tokenCount = 0;
                switch (token) {
                    case "y": {
                        tokenCount = 0;
                        tempTokenIndex = i;
                        tempToken = token;
                        while (isCharAToken(tempToken)) {
                            tempTokenIndex++;
                            tokenCount++;
                            tempToken = format[tempTokenIndex];
                        }
                        i = tempTokenIndex-1;
                        result = tokenCount > 2 ? result + year : year.toString().substr(2, 2);
                        break;
                    }
                    case "d": {
                        tokenCount = 0;
                        tempTokenIndex = i;
                        tempToken = token;
                        while (isCharAToken(tempToken)) {
                            tempTokenIndex++;
                            tokenCount++;
                            tempToken = format[tempTokenIndex];
                        }
                        i = tempTokenIndex-1;
                        switch (tokenCount) {
                            case 1: {
                                result = result + caldate;
                                break;
                            }
                            case 2: {
                                result = caldate > 9 ? result + caldate : result + "0" + caldate;
                                break;
                            }
                            case 3: {
                                result = result + jasonWidgets.localizationManager.currentLanguage.calendar.days[day].shortname;
                                break;
                            }
                            case 4: {
                                result = result + jasonWidgets.localizationManager.currentLanguage.calendar.days[day].name;
                                break;
                            }
                        }
                            
                        break;
                    }
                    case "M": {
                        tokenCount = 0;
                        tempTokenIndex = i;
                        tempToken = token;
                        while (isCharAToken(tempToken)) {
                            tempTokenIndex++;
                            tokenCount++;
                            tempToken = format[tempTokenIndex];
                        }
                        i = tempTokenIndex-1;
                        switch (tokenCount) {
                            case 1: {
                                result = result + month;
                                break;
                            }
                            case 2: {
                                result = month > 9 ? result + month : result + "0" + month;
                                break;
                            }
                            case 3: {
                                result = result + jasonWidgets.localizationManager.currentLanguage.calendar.months[month - 1].shortname;
                                break;
                            }
                            case 4: {
                                result = result + jasonWidgets.localizationManager.currentLanguage.calendar.months[month - 1].name;
                                break;
                            }
                        }
                        break;
                    }
                    case "h": {
                        tokenCount = 0;
                        tempTokenIndex = i;
                        tempToken = token;
                        while (isCharAToken(tempToken)) {
                            tempTokenIndex++;
                            tokenCount++;
                            tempToken = format[tempTokenIndex];
                        }
                        i = tempTokenIndex-1;
                        switch (tokenCount) {
                            case 1: {
                                result = result + (hours - 12);
                                break;
                            }
                            case 2: {
                                if (jasonWidgets.localizationManager.isTwelveHourClock) {
                                    if (hours > 12 || hours == 0)
                                        hours = Math.abs(hours - 12);
                                    result = hours > 9 ? hours : "0" + hours;
                                }
                                    
                                else
                                    result = hours > 9 ? hours : result + "0" + hours;
                                break;
                            }
                        }
                        break;
                    }
                    case "H": {
                        tokenCount = 0;
                        tempTokenIndex = i;
                        tempToken = token;
                        while (isCharAToken(tempToken)) {
                            tempTokenIndex++;
                            tokenCount++;
                            tempToken = format[tempTokenIndex];
                        }
                        i = tempTokenIndex-1;
                        switch (tokenCount) {
                            case 1: {
                                result = result + hours;
                                break;
                            }
                            case 2: {
                                result = hours > 9 ? result + hours : result + "0" + hours;
                                break;
                            }
                        }

                        break;
                    }
                    case "m": {
                        tokenCount = 0;
                        tempTokenIndex = i;
                        tempToken = token;
                        while (isCharAToken(tempToken)) {
                            tempTokenIndex++;
                            tokenCount++;
                            tempToken = format[tempTokenIndex];
                        }
                        i = tempTokenIndex-1;
                        switch (tokenCount) {
                            case 1: {
                                result = result + minutes;
                                break;
                            }
                            case 2: {
                                result = minutes > 9 ? result + minutes : result + "0" + minutes;
                                break;
                            }
                        }

                        break;
                    }
                    case "s": {
                        tokenCount = 0;
                        tempTokenIndex = i;
                        tempToken = token;
                        while (isCharAToken(tempToken)) {
                            tempTokenIndex++;
                            tokenCount++;
                            tempToken = format[tempTokenIndex];
                        }
                        i = tempTokenIndex-1;
                        switch (tokenCount) {
                            case 1: {
                                result = result + seconds;
                                break;
                            }
                            case 2: {
                                result = seconds > 9 ? result + seconds : result + "0" + seconds;
                                break;
                            }
                        }

                        break;
                    }
                    case "f": {
                        tokenCount = 0;
                        tempTokenIndex = i;
                        tempToken = token;
                        while (isCharAToken(tempToken)) {
                            tempTokenIndex++;
                            tokenCount++;
                            tempToken = format[tempTokenIndex];
                        }
                        i = tempTokenIndex-1;
                        switch (tokenCount) {
                            case 1: {
                                result = result + miliseconds;
                                break;
                            }
                            case 2: {
                                result = miliseconds > 9 ? miliseconds < 99 ? result + "00" + miliseconds : result + miliseconds : result + "0" + miliseconds;
                                break;
                            }
                        }

                        break;
                    }
                    case "t": {
                        break;
                    }
                    default: {
                        result = result + token;
                        break;
                    }

                }
            }
        }
        if (format.indexOf("h") >= 0) {
            if (jasonWidgets.localizationManager.isTwelveHourClock) {
                result = date.getHours() > 12 ? result + " " + jasonWidgets.localizationManager.postMeridiemString : result + " " + jasonWidgets.localizationManager.anteMeridiemString
            }
        }
        
        return result;
    }
    /**
     * Get element parent element if it exists
     * @param {string}  classOrId - Class name or id or tagName to identify the parent.
     * @param {HTMLElement}  childElement - Child element to start the search from.
     * @returns {HTMLElement} parentNode.
     */
    jasonCommon.prototype.getParentElement = function (identifier, childElement) {
        var parentNode = childElement.parentNode;
        var stopSearch = false;
        while ((!stopSearch && jasonWidgets.common.assigned(parentNode)) && parentNode != document ) {
            stopSearch = parentNode.getAttribute("id") == identifier || parentNode.classList.contains(identifier) || parentNode.tagName == identifier;
            if (!stopSearch)
                parentNode = parentNode.parentNode;
        }
        return parentNode;
    }
    /**
     * Returns true if element contains at least one of the class provided.
     * @param {object} HTMLElement - String with format tokens, eg "jasonWidgets are the {0}"
     * @param {array} classes - Array of classes (string).
     * @returns {boolean}
     */
    jasonCommon.prototype.containsClasses = function (element, classes) {
        var result = false;
        for (var i = 0; i <= classes.length - 1; i++) {
            result = element.classList.contains(classes[i]);
            if (result)
                break;
        }
        return result;
    }
    /**
     * Calculates the width of a browser's scrollbar.
     * @returns {number}
     */
    jasonCommon.prototype.scrollBarWidth = function () {
        var divElement = document.createElement("div");
        divElement.style.width = "50px";
        divElement.style.height = "50px";
        divElement.style.overflowY = "scroll";
        divElement.style.position = "absolute";
        divElement.style.top = "-200px";
        var divInnerElement = document.createElement("div");
        divInnerElement.style.height = "100%";
        divInnerElement.style.width = "100%";
        divElement.appendChild(divInnerElement);
        document.body.appendChild(divElement);
        var w1 = divElement.offsetWidth;
        var w2 = divInnerElement.clientWidth;
        document.body.removeChild(divElement);
        return w1 - w2;
    }
    /**
     * Stores arbitrary data associated with an element.
     * @param {object} element - HTMLElement. The element be associated with.
     * @param {string} name - Identifier for the data to be stored.
     * @param {object} value - Any value to stored.
     */
    jasonCommon.prototype.setData = function (element, name, value) {
        if (element) {
            if (!element.jasonWidgetsData)
                element.jasonWidgetsData = [];
            element.jasonWidgetsData.push({ dataName: name, dataValue: value });
        }
    }
    /**
     * Removes data that were associated to an element.
     * @param {object} element - HTMLElement. The element be associated with.
     * @param {string} name - Identifier for the data to be removed.
     */
    jasonCommon.prototype.removeData = function (element, name) {
        if (element.jasonWidgetsData) {
            var dataItemIndexToRemove = -1;
            element.jasonWidgetsData.filter(function (elementData,elementDataIndex) {
                if (elementData.dataName == name) {
                    dataItemIndexToRemove = elementDataIndex;
                    return;
                }
            });
            if (dataItemIndexToRemove >= 0)
                element.jasonWidgetsData.splice(dataItemIndexToRemove, 1);
        }
    }
    /**
     * Retrieves data that were associated to an element.
     * @param {object} element - HTMLElement. The element be associated with.
     * @param {string} name - Identifier for the data to be retrieved.
     * @returns {object}
     */
    jasonCommon.prototype.getData = function (element, name) {
        if (element.jasonWidgetsData) {
            var result = element.jasonWidgetsData.filter(function (elementData) {
                return elementData.dataName == name;
            })[0];
            return result ? result.dataValue : null;
        }
        return null;
    }
    /**
     * Swap child places
     * @param {any[]} array - Array that contains items.
     * @param {number} indexToMove - Current index of the item to move.
     * @param {number} newIndex - New index to move item to.
     */
    jasonCommon.prototype.swapItemsInArray = function (array, indexToMove, newIndex) {
        var itemToMove = array[indexToMove];
        var itemToMoveBack = array[newIndex];
        if (itemToMove && itemToMoveBack) {
            array[indexToMove] = itemToMoveBack;
            array[newIndex] = itemToMove;
        }
    }
    /**
     * Swap dom elements places
     * @param {any[]} array - Array that contains items.
     * @param {number} indexToMove - Current index of the item to move.
     * @param {number} newIndex - New index to move item to.
     */
    jasonCommon.prototype.swapDomElements = function (container, indexToMove, newIndex) {
        if (container != void 0 && indexToMove != void 0 && newIndex != void 0) {
            domElementToMove = container.children[indexToMove];
            domElementNew = container.children[newIndex];

            var elementAfterFirstNode = domElementToMove.nextSibling;
            var elementAfterSecondNode = domElementNew.nextSibling;

            container.insertBefore(domElementToMove, elementAfterSecondNode);
            container.insertBefore(domElementNew, elementAfterFirstNode);
        }
    }
    /**
     * Moves children nodes from an element to another element.
     * @param {object} sourceElement - HTMLElement. The element that has the child nodes.
     * @param {object} targetElement - HTMLElement. The element that will have the child nodes.
     * @param {array=} elementTagsToMove If defined only nodes with tagNames included in the array will be moved.
     * @param {array=} elementTagsToExclude - If defined nodes with tagNames included in the array will be excluded from the move.
     * @param {array=} classesToExclude - If defined nodes with classNames included in the array will be excluded from the move.
     */
    jasonCommon.prototype.moveChildrenTo = function (sourceElement, targetElement,elementTagsToMove,elementTagsToExclude,classesToExclude) {
        var OldChildren = [];
        elementTagsToMove = elementTagsToMove ? elementTagsToMove : [];
        elementTagsToExclude = elementTagsToExclude ? elementTagsToExclude : [];
        classesToExclude = classesToExclude ? classesToExclude : [];
        var canElementBeExcluded = function (element, tagExcludeList, classExcludeList) {
            if (tagExcludeList.length > 0 && classExcludeList.length > 0) {
                return tagExcludeList.indexOf(element.tagName) >= 0 || classExcludeList.indexOf(element.className) >= 0;
            }

            if (tagExcludeList.length > 0 && classExcludeList.length <= 0) {
                return tagExcludeList.indexOf(element.tagName) >= 0;
            }

            if (tagExcludeList.length <= 0 && classExcludeList.length > 0) {
                return classExcludeList.indexOf(element.className) >= 0;
            }
            return false;
        }
        for (var i = sourceElement.children.length - 1; i >= 0; i--) {
            if (elementTagsToExclude.length == 0 && elementTagsToMove.length == 0) {
                OldChildren.push(sourceElement.removeChild(sourceElement.children[i]));
            }
            else{
                if (elementTagsToMove.length > 0) {
                    if (elementTagsToMove.indexOf(sourceElement.children[i].tagName) >= 0)
                        OldChildren.push(sourceElement.removeChild(sourceElement.children[i]));
                }
                if (!canElementBeExcluded(sourceElement.children[i], elementTagsToExclude, classesToExclude)) {
                    OldChildren.push(sourceElement.removeChild(sourceElement.children[i]));
                }
            }
        }
        for (var i = OldChildren.length - 1 ; i >=0; i--) {
            targetElement.appendChild(OldChildren[i]);
        }
    }
    /**
     * Applies style property value to an child elements of an element.
     * @param {object} element - HTMLElement. The element to apply the style to.
     * @param {string} propertyName - Style property to be applied.
     * @param {any} propertyName - Style property value to be applied.
     * @param {string} elementIdentifier - if defined it will apply style only to elements that match the identifier.Identifier can be the ID, a class or a tagName. 
     * @param {boolean} recursive - If true it will be applied to all child nodes regardless of nesting level.
     */
    jasonCommon.prototype.applyStyleProperty = function (element, propertyName, value,elementIdentifier,recursive) {
        for (var i = 0; i <= element.children.length - 1; i++) {
            var child = element.children[i];
            if (elementIdentifier) {
                if (child.getAttribute("id") == elementIdentifier || child.classList.contains(elementIdentifier) || child.tagName == elementIdentifier)
                    child.style[propertyName] = value;
            }
            else
                child.style[propertyName] = value;
            if(recursive == true){
                this.applyStyleProperty(child, propertyName, value, elementIdentifier,recursive);
            }
        }
    }
    /**
     * Adds or removes class names from childs of an element
     * @param {HTMLElement} element - Element to add or remove classes to.
     * @param {string} className - Class name to add/remove.
     * @param {boolean} add - If true it will add the class. Default false.
     * @param {string=} elementIdentifier - If defined it apply the action only to elements that match the identifier. Identifier can be the ID attribute | class name | tagName.
     * @param {boolean}  recursive - If true it will apply the action to children's children also. Default is false.
     */
    jasonCommon.prototype.cssClass = function (element, className, add, elementIdentifier, recursive) {
        for (var i = 0; i <= element.children.length - 1; i++) {
            var child = element.children[i];
            if (elementIdentifier) {
                if (child.getAttribute("id") == elementIdentifier || child.classList.contains(elementIdentifier) || child.tagName == elementIdentifier) {
                    if (add)
                        child.classList.add(className);
                    else
                        child.classList.remove(className);
                }
                    
            }
            else
                if (add)
                    child.classList.add(className);
                else
                    child.classList.remove(className);
            if (recursive == true) {
                this.applyStyleProperty(child, className, add, elementIdentifier, recursive);
            }
        }
    }
    /**
     * Fade out effect.
     * @param {object} element - HTMLElement. The element to apply the fade out to.
     * @param {number} interval - Fade out duration
     */
    jasonCommon.prototype.fadeOut = function (element, interval) {
        if (!element._jasonWidgetsFadeOut) {
            element._jasonWidgetsFadeOut = true;
            var opacityValue = 0;
            element.style.opacity = "0";
            var fadeTimer = setInterval(function () {
                element.style.opacity = opacityValue;
                if (opacityValue >= 1) {
                    element.style.opacity = "";
                    clearInterval(fadeTimer);
                    element._jasonWidgetsFadeOut = undefined;
                } else {
                    opacityValue = opacityValue + 0.1;
                }
            }, interval);
        }
    }
    /**
     * Returns true the element is an inline element
     * @param {object} element - HTMLElement.
     * @returns {boolean}
     */
    jasonCommon.prototype.isInlineElement = function (element) {
        var tagIndex = this.inlineElements.indexOf(element.tagName);
        if (tagIndex >= 0) {
            return true;
        }
        return false;
    }
    /**
     * Returns true the element is an block element
     * @param {object} element - HTMLElement.
     * @returns {boolean}
     */
    jasonCommon.prototype.isBlockElement = function (element) {
        var tagIndex = this.blockElements.indexOf(element.tagName);
        if (tagIndex >= 0) {
            return true;
        }
        return false;
    }
    /**
     * Returns absolute coordinates of an element on a page.
     * @param {object} element - HTMLElement.
     * @returns {object}
     */
    jasonCommon.prototype.getOffsetCoordinates = function (element) {
        var result = { left: 0, top: 0 };
        var offSetElement = element;
        while (offSetElement) {
            result.left += offSetElement.offsetLeft;
            result.top += offSetElement.offsetTop;
            offSetElement = offSetElement.offsetParent;
        }
        return result;
    }
    /**
     * Returns text's width in px.
     * @param {string} text - Text to measured.
     * @param {string} font - Text's font.
     * @returns {number}
     */
    jasonCommon.prototype.getTextWidth = function (text, font) {
        // re-use canvas object for better performance
        var canvas = this.HTMLCanvas || (this.HTMLCanvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    }
    /**
     * Returns the computed style property value of an element
     * @param {object} element - HTMLElement.
     * @param {string} property - Property name.
     * @returns {string}
     */
    jasonCommon.prototype.getComputedStyleProperty = function (element, property) {
        return window.getComputedStyle(element, null).getPropertyValue(property);
    }
    /**
     * Replaces an element's text value
     * @param {object} element - HTMLElement.
     * @param {string} newText - New text value.
     */
    jasonCommon.prototype.replaceNodeText = function (element, newText,createIfDoesNotExist) {
        var textNode = null;
        for (var i = 0; i <= element.childNodes.length - 1; i++) {
            if (element.childNodes[i].nodeType == 3) {
                textNode = element.childNodes[i];
                break;
            }
        }
        if (textNode) {
            element.replaceChild(document.createTextNode(newText), textNode);
        } else {
            if(createIfDoesNotExist)
                element.appendChild(document.createTextNode(newText));
        }
    }
    /**
     * Removes an element's text value
     * @param {object} element - HTMLElement.
     * @param {string} newText - New text value.
     */
    jasonCommon.prototype.removeNodeText = function (element) {
        var textNode = null;
        for (var i = 0; i <= element.childNodes.length - 1; i++) {
            if (element.childNodes[i].nodeType == 3) {
                textNode = element.childNodes[i];
                break;
            }
        }
        if (textNode) {
            element.removeChild(textNode);
        }
    }
    /**
     * Returns the first textnode of the element
     * @param {object} element - HTMLElement.
     * @returns {HTMLElement}
     */
    jasonCommon.prototype.getNodeText = function (element) {
        var textNode = null;
        for (var i = 0; i <= element.childNodes.length - 1; i++) {
            if (element.childNodes[i].nodeType == 3) {
                textNode = element.childNodes[i];
                break;
            }
        }
        return textNode;
    }
    /**
     * Returns all elements that match the search criteria
     * @param {HTMLElement=} element - If not set search scope will be the document.
     * @param {string} attributeName - name of the attribute.
     * @param {string} attributeValue - value of the attribute.
     * @returns {array}
     */
    jasonCommon.prototype.getElementsByAttribute = function (containerElement,attributeName,attributeValue) {
        var container = containerElement ? containerElement : document;
        var queryString = "*[{0}='{1}']";
        return container.querySelectorAll(jw.common.formatString(queryString,[attributeName,attributeValue]));
    }
    /**
     * Gets next tabindex value.
     * @returns {HTMLElement[]} The next tabindex value.
     */
    jasonCommon.prototype.getNextTabIndex = function () {
        var elementsWithTabIndex = document.querySelectorAll("*[tabindex]");
        var nextTabIndex = 0;
        for (var i = 0; i <= elementsWithTabIndex.length - 1; i++) {
            var elementTabIndex = elementsWithTabIndex[i].getAttribute("tabindex");
            if (elementTabIndex) {
                elementTabIndex = parseInt(elementTabIndex);
                if (elementTabIndex > nextTabIndex)
                    nextTabIndex = elementTabIndex;
            }
        }
        return nextTabIndex + 1;
    }
    /**
     * Gets next attribute value .
     * @param {string} attributeName - The attribute name.
     * @returns {number} The next attribute value.
     */
    jasonCommon.prototype.getNextAttributeValue = function (attributeName) {
        var elementsWithTabIndex = document.querySelectorAll("*["+attributeName+"]");
        var nextAttributeValue = 0;
        for (var i = 0; i <= elementsWithTabIndex.length - 1; i++) {
            var elementAttributeValue = elementsWithTabIndex[i].getAttribute(attributeName);
            if (elementAttributeValue) {
                elementAttributeValue = parseInt(elementAttributeValue);
                if (elementAttributeValue > nextAttributeValue)
                    nextAttributeValue = elementAttributeValue;
            }
        }
        return nextAttributeValue + 1;
    }
    /**
     * Returns true if the element is a child of the container.
     * @param {HTMLElement} containerElement - Container element to search in.
     * @param {HTMLElement} childElement - Child element to look for.
     * @returns {boolean}
     */
    jasonCommon.prototype.contains = function (containerElement, childElement) {
        var childElements = [].slice.call(containerElement.getElementsByTagName(childElement.tagName));
        return childElements.filter(function (elem) { return elem == childElement; }).length == 1;
    }
    /**
     * Check if a variable is defined.
     * @param {any} variable - Any type of variable.
     * @returns {boolean}
     */
    jasonCommon.prototype.assigned = function (variable) {
        return !(variable == void 0);
//        return !(any == undefined || any == null);
    }
    /**
     * Converts a string to boolean
     * @param {string} boolStr - String to convert to boolean.
     * @returns {boolean}
     */
    jasonCommon.prototype.strToBool = function (boolStr) {
        if (boolStr && (boolStr.toLowerCase() == 'true' || boolStr.toLowerCase() == 'yes'))
            return true;
        return false;
    }
    /**
     * Converts a boolean to string
     * @param {boolean} bool - Boolean value to convert to string.
     * @returns {string}
     */
    jasonCommon.prototype.boolToStr = function (bool) {
        if (bool)
            return 'true';
        return 'false';
    }
    /**
     * Convert value to a specific data type.
     * @param {string|number|boolean|date} valueToConvert - Value to convert.
     * @param {string} returnDataType - "number" | "boolean" | "string" | "date".
     * @returns {number|boolean|string|date}
     */
    jasonCommon.prototype.convertValue = function (valueToConvert, returnDataType) {
        if (typeof valueToConvert == "string" && valueToConvert.trim().length > 0) {
            switch (returnDataType) {
                case "number": {
                    return parseFloat(valueToConvert);
                    break;
                }
                case "boolean": {
                    return jasonWidgets.common.strToBool(valueToConvert);
                    break;
                }
                case "date": {
                    return new Date(valueToConvert);
                    break;
                }
            }
        }
        if (typeof valueToConvert == "number") {
            switch (returnDataType) {
                case "string": {
                    return valueToConvert.toString();
                    break;
                }
                case "boolean": {
                    return valueToConvert == 0 ? false : true;
                    break;
                }
                case "date": {
                    var result =  new Date();
                    result.setTime(valueToConvert);
                    break;
                }
            }
        }
        if (typeof valueToConvert == "date") {
            switch (returnDataType) {
                case "string": {
                    return valueToConvert.toString();
                    break;
                }
                case "boolean": {
                    throw new Error("Cannot convert a date to a boolean value");
                    break;
                }
                case "number": {
                    return valueToConvert.getTime();
                    break;
                }
            }
        }
        if (typeof valueToConvert == "boolean") {
            switch (returnDataType) {
                case "string": {
                    return jasonWidgets.common.boolToStr(valueToConvert);
                    break;
                }
                case "date": {
                    throw new Error("Cannot convert a boolean to a date value");
                    break;
                }
                case "number": {
                    return valueToConvert ? 1 : 0;
                    break;
                }
            }
        }
        return valueToConvert;
    }
    /**
     * Returns a date object with no time information
     * @property {date} Date - Date object from which time information will be removed.
     * @returns {date}
     */
    jasonCommon.prototype.dateOf = function (date) {
        var result = null;
        date = date ? date : new Date();
        if (date) {
            result = new Date();
            result.setHours(0, 0, 0, 0);
            result.setYear(date.getFullYear());
            result.setMonth(date.getMonth());
            result.setDate(date.getDate());
        }
        return result;
    }
    /**
     * Returns a date object with no date information
     * @property {date} Date - Date object from which date information will be removed.
     * @returns {date}
     */
    jasonCommon.prototype.timeOf = function (date) {
        var result = null;
        date = date ? date : new Date();
        if (date) {
            result = new Date();
            result.setHours(date.getHours());
            result.setMinutes(date.getMinutes());
            result.setSeconds(date.getSeconds());
            result.setMilliseconds(date.getMilliseconds());
        }
        return result;
    }
    /**
     * Returns 0 if the date part of the date objects is equal. Returns 1 if the 1st date is bigger and 2 if the second date.
     * @property {date} date1 - Date object.
     * @property {date} date2 - Date object.
     * @returns {number}
     */
    jasonCommon.prototype.dateComparison = function (date1, date2) {
        var result = jw.enums.comparison.equal;
        var time1 = jasonWidgets.common.dateOf(date1).getTime();
        var time2 = jasonWidgets.common.dateOf(date2).getTime();
        if (time1 > time2)
            result = jw.enums.comparison.firstIsGreater;
        if (time1 < time2)
            result = jw.enums.comparison.secondIsGreater;
        return result;
    }
    /**
     * Returns 0 if the date part of the date objects is equal. Returns 1 if the 1st date is bigger and 2 if the second date.
     * @property {date} date1 - Date object.
     * @property {date} date2 - Date object.
     * @returns {number}
     */
    jasonCommon.prototype.timeComparison = function (date1, date2) {
        var result = jw.enums.comparison.equal;
        var time1 = jasonWidgets.common.timeOf(date1).getTime();
        var time2 = jasonWidgets.common.timeOf(date2).getTime();
        if (time1 > time2)
            result = jw.enums.comparison.firstIsGreater;
        if (time1 < time2)
            result = jw.enums.comparison.secondIsGreater;
        return result;
    }
    /**
     * Returns day count in a month.
     * @param {number} year - Year.
     * @param {number} month - Month.
     * @returns {date}
     */
    jasonCommon.prototype.daysInMonth = function (year,month) {
        return new Date(year, month, 0).getDate();
    }
    /**
     * Returns day count in a year
     * @param {number} year - Year.
     * @returns {number}
     */
    jasonCommon.prototype.daysInYear = function (year) {
        if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
            // Leap year
            return 366;
        } else {
            // Not a leap year
            return 365;
        }
    }
    /**
     * Returns true the property exists on the object.
     * @param {object} object - Object to search property in.
     * @param {string} propertyName - Name of the property to search for.
     * @returns {boolean}
     */
    jasonCommon.prototype.objectHasProperty = function (object, propertyName) {
        var result = false;
        for (var prop in object) {
            if (prop === propertyName) {
                result = true;
                break;
            }
        }
        return result;
    }
    /**
     * Returns true if the mouse event occured outside the elements bound rect.
     * @param {HTMLElement} element - Element to determine mouse event.
     * @param {Event} mouseEvent - Event.
     * @returns {boolean}
     */
    jasonCommon.prototype.isMouseEventOutOfContainer = function (element, mouseEvent) {
        var containerRect = element.getBoundingClientRect();
        var coordX = mouseEvent.x || mouseEvent.pageX;
        var coordY = mouseEvent.y || mouseEvent.pageY;
        var isClickOutOfContainerHorizontal = (coordX > containerRect.right) || (coordX < containerRect.left);
        var isClickOutOfContainerVertical = (coordY > containerRect.bottom) || (coordY < containerRect.top);
        return (isClickOutOfContainerHorizontal || isClickOutOfContainerVertical);
    }
    /**
     * Returns true if the mouse event occured outside the elements bound rect and the event target is not a child.
     * @param {HTMLElement} element - Element to determine mouse event.
     * @param {Event} mouseEvent - Event.
     * @returns {boolean}
     */
    jasonCommon.prototype.isMouseEventOutOfContainerAndNotAChild = function (element, mouseEvent) {
        var result = jw.common.isMouseEventOutOfContainer(element, mouseEvent);
        return result && !jw.common.contains(element, mouseEvent.target);
    }
    /**
     * Removes any events added to the element and its children by JW. 
     * @param {HTMLElement} element - Element to remove jasonWidget events.
     * @param {boolean} recursive - If true it will be applied to the children of the element. Default is true.
     */
    jasonCommon.prototype.removeJWEvents = function (element,recursive) {
        var events = element._jasonWidgetsEventListeners_;
        if (events) {
            for (var i = events.length - 1; i >=0; i--) {
                element.removeEventListener(events[i].eventName, events[i].listener);
                events.splice(i, 1);
            }
            if (recursive && element.children.length > 0) {
                for (var i = 0; i <= element.children.length - 1; i++) {
                    jw.common.removeJWEvents(element.children[i],recursive);
                }
            }
        }
        else {
            if (element.children) {
                for (var i = 0; i <= element.children.length - 1; i++) {
                    jw.common.removeJWEvents(element.children[i], recursive);
                }
            }
        }
    }
    /**
     * Removes all child elements of an element and clears all jasonWidgets events.
     * @param {HTMLElement} element - Element to remove child elements.
     */
    jasonCommon.prototype.removeChildren = function (element) {
        while (element.firstChild) {
            jw.common.removeJWEvents(element.firstChild);
            jw.common.removeChildren(element.firstChild);
            element.removeChild(element.firstChild);
        }
    }
    /**
     * Add a global event listener
     * @param {function} listener - Listener function.
     */
    jasonCommon.prototype.addGlobalEventListener = function (listener) {
        this.globalEventListeners.push(listener);
    }
    /**
     * Returns the type of a variable.
     * @returns {number} Enum value for the type of the variable.
     * @returns {number}
     */
    jasonCommon.prototype.getVariableType = function (variable) {
        var result = jw.enums.variableType.unknown;
        if (typeof variable == "object") {
            result = jw.enums.variableType.object;
            var constructorString = variable.constructor ? variable.constructor.toString() : "";
            if (constructorString.indexOf("Date()") > 0 && constructorString.indexOf("native code") > 0) {
                result = jw.enums.variableType.date;
            }
        } else {
            if (typeof variable == "number")
                result = jw.enums.variableType.number;
            if (typeof variable == "boolean")
                result = jw.enums.variableType.boolean;
            if (typeof variable == "function")
                result = jw.enums.variableType.function;
        }
        return result;
    }
    /**
     * Trigger global event
     * @param {number} eventCode - Code event to trigger.
     * @param {object=} eventData - Event data.
     */
    jasonCommon.prototype.triggerGlobalEvent = function (eventCode,eventData) {
        for (var i = 0; i <= this.globalEventListeners.length - 1; i++) {
            this.globalEventListeners[i](eventCode, eventData);
        }
    }
    /**
     * Returns 
     * @param {number} eventCode - Code event to trigger.
     * @param {object=} eventData - Event data.
     * @returns {boolean} True if the variable is a jwWidget.
     */
    jasonCommon.prototype.isJWWidget = function (variable) {
        return this._jwWidgetsCatalog.filter(function (widgetEntry) {
            return widgetEntry.uid === variable._uid;
        }).length > 0;
    }
    /**
     * Generates a V4 unique identifier. Taken from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
     * @returns {string}
     */
    jasonCommon.prototype.generateUUID =  function() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };
    /**
     * Array of element tags that are considered to be inline elements
     * @ignore
     */
    jasonCommon.prototype.inlineElements = ["BUTTON", "SPAN", "INPUT", "LABEL", "SELECT", "A","I"];
    /**
     * Array of element tags that are considered to be block elements
     * @ignore
     */
    jasonCommon.prototype.blockElements = ["DIV", "P", "TABLE", "THEAD", "TFOOT", "TBODY", "HR", "UL", "OL", "FIELDSET", "NAV", "H1", "H2", "H3", "H4", "H5", "H6"];
    /**
     * Throws an error.
     * @param {string} message - The error message.
     */
    jasonCommon.prototype.throwError = function (errorType, message) {
        switch (errorType) {
            case jw.errorTypes.error: {
                throw new Error(message);
                break;
            }
            case jw.errorTypes.evalError: {
                throw new EvalError(message);
                break;
            }
            case jw.errorTypes.rangeError: {
                throw new RangeError(message);
                break;
            }
            case jw.errorTypes.referenceError: {
                throw new ReferenceError(message);
                break;
            }
            case jw.errorTypes.syntaxError: {
                throw new SyntaxError(message);
                break;
            }
            case jw.errorTypes.typeError: {
                throw new TypeError(message);
                break;
            }
            case jw.errorTypes.uriError: {
                throw new URIError(message);
                break;
            }
            default: {
                throw new Error(message);
                break;
            }
        }
        
    }
}
var jasonWidgets = {};
jw = jasonWidgets;
jasonWidgets.common = new jasonCommon();
jasonWidgets.enums = {};
jasonWidgets.enums.variableType = {
    unknown:0,
    number: 1,
    date: 2,
    boolean: 3,
    object: 4,
    function:5,
}

jasonWidgets.enums.comparison = { equal: 0, firstIsGreater: 1, secondIsGreater: 2 }

jasonWidgets.errorTypes = {
    error: 0,
    evalError: 1,
    rangeError: 2,
    referenceError: 3,
    syntaxError: 4,
    typeError: 5,
    uriError: 6
}