/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/**
 * Common jasonWidgets that has functionality being used across jasonWidgets.
 */
function jasonCommon() {
    this.CLEAR_FLOAT_CLASS = "jason-clear-float";
    this.HTMLCanvas = null;
    /**
     * jasonWidget flavored extend object function.
     * @param {object} sourceObject - Object to extend from
     * @param {object} targetObject - Object to extend to
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
     */
    jasonCommon.prototype.formatString = function(formatString,args){
        for (var i = 0; i < args.length; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatString = formatString.replace(regexp, args[i]);
        }
        return formatString;
    }
    /**
     * Get element parent element if it exists
     * @param {string} - classOrId - Class name or id to identify the parent
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
        if (!element.jasonWidgetsData)
            element.jasonWidgetsData = [];
        element.jasonWidgetsData.push({ dataName: name, dataValue: value });
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
     */
    jasonCommon.prototype.getData = function (element, name) {
        if (element.jasonWidgetsData) {
            var result = element.jasonWidgetsData.filter(function (elementData) {
                return elementData.dataName == name;
            })[0];
            return result.dataValue;
        }
        return null;
    }
    /**
     * Moves children nodes from an element to another element.
     * @param {object} sourceElement - HTMLElement. The element that has the child nodes.
     * @param {object} targetElement - HTMLElement. The element that will have the child nodes.
     * @param {array} elementTagsToMove - optional. If defined only nodes with tagNames included in the array will be moved.
     * @param {array} elementTagsToExclude - optional. If defined nodes with tagNames included in the array will be excluded from the move.
     * @param {array} classesToExclude - optional. If defined nodes with classNames included in the array will be excluded from the move.
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
     */
    jasonCommon.prototype.getOffsetCoordinates = function (element) {
        var result = { Left: 0, Top: 0 };
        var offSetElement = element;
        while (offSetElement) {
            result.Left += offSetElement.offsetLeft;
            result.Top += offSetElement.offsetTop;
            offSetElement = offSetElement.offsetParent;
        }
        return result;
    }
    /**
     * Returns text's width in px.
     * @param {string} text - Text to measured.
     * @param {string} font - Text's font.
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
     * Gets next tabindex value.
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
     * Returns true if the element is a child of the container.
     */
    jasonCommon.prototype.contains = function (containerElement, childElement) {
        var childElements = [].slice.call(containerElement.getElementsByTagName(childElement.tagName));
        return childElements.filter(function (elem) { return elem == childElement; }).length == 1;
    }
    /**
     * Return true if an variable is defined
     */
    jasonCommon.prototype.assigned = function (any) {
        return !(any == undefined || any == null);
    }
    /**
     * Converts a string to boolean
     */
    jasonCommon.prototype.strToBool = function (boolStr) {
        if (boolStr && (boolStr.toLowerCase() == 'true' || boolStr.toLowerCase() == 'yes'))
            return true;
        return false;
    }
    /**
     * Converts a boolean to string
     */
    jasonCommon.prototype.boolToStr = function (bool) {
        if (bool)
            return 'true';
        return 'false';
    }
    /**
     * Convert value to a specific data type.
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
     */
    jasonCommon.prototype.dateOf = function (date) {
        if (date) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
        }
        return date;
    }
    /**
     * Returns a date object with no time information
     * @property {date} Date - Date object from which date information will be removed.
     */
    jasonCommon.prototype.timeOf = function (date) {
        if (date) {
            date.setYear(0);
            date.setMonth(0);
            date.setDate(0);
        }
        return date;
    }
    /**
     * Returns day count in a month.
     */
    jasonCommon.prototype.daysInMonth = function (year,month) {
        return new Date(year, month, 0).getDate();
    }
    /**
     * Returns day count in a year
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
     * Array of element tags that are considered to be inline elements
     */
    jasonCommon.prototype.inlineElements = ["BUTTON", "SPAN", "INPUT", "LABEL", "SELECT", "A","I"];
    /**
     * Array of element tags that are considered to be block elements
     */
    jasonCommon.prototype.blockElements = ["DIV", "P", "TABLE", "THEAD", "TFOOT", "TBODY", "HR", "UL", "OL", "FIELDSET", "NAV", "H1", "H2", "H3", "H4", "H5", "H6"];
}
var jasonWidgets = {};
jasonWidgets.common = new jasonCommon();