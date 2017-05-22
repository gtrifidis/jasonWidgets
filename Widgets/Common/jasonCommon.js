/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @namespace Common
 * @description Common or base classes for jasonWidgets.
 */

/**
 * @class
 * @name NumberFormat
 * @description Number formatting options from {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat}
 * @memberOf Common
 * @property {string} style - The formatting style to use. Possible values are "decimal" for plain number formatting, "currency" for currency formatting, and "percent" for percent formatting; the default is "decimal.
 * @property {string} currency - The currency to use in currency formatting. Possible values are the ISO 4217 currency codes, such as "USD" for the US dollar, "EUR" for the euro, or "CNY" for the Chinese RMB — see the Current currency & funds code list. There is no default value; if the style is "currency", the currency property must be provided.
 * @property {string} currencyDisplay - How to display the currency in currency formatting. Possible values are "symbol" to use a localized currency symbol such as €, "code" to use the ISO currency code, "name" to use a localized currency name such as "dollar"; the default is "symbol".
 * @property {boolean} useGrouping - Whether to use grouping separators, such as thousands separators or thousand/lakh/crore separators. Possible values are true and false; the default is true.
 */

/**
 * @class
 * @name DateTimeFormat
 * @description DateTime formatting options from {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat}
 * @memberOf Common
 * @property {string} timeZone - The time zone to use. The only value implementations must recognize is "UTC"; the default is the runtime's default time zone. Implementations may also recognize the time zone names of the IANA time zone database, such as "Asia/Shanghai", "Asia/Kolkata", "America/New_York".
 * @property {boolean} hour12 - Whether to use 12-hour time (as opposed to 24-hour time). Possible values are true and false; the default is locale dependent.
 * @property {string} formatMatcher - The format matching algorithm to use. Possible values are "basic" and "best fit"; the default is "best fit".
 * @property {string} weekday - The representation of the weekday. Possible values are "narrow", "short", "long".
 * @property {string} era - The representation of the era. Possible values are "narrow", "short", "long".
 * @property {string} year - The representation of the year. Possible values are "numeric", "2-digit".
 * @property {string} month - The representation of the month. Possible values are "numeric", "2-digit", "narrow", "short", "long".
 * @property {string} day - The representation of the day. Possible values are "numeric", "2-digit".
 * @property {string} hour - The representation of the hour. Possible values are "numeric", "2-digit".
 * @property {string} minute - The representation of the minute. Possible values are "numeric", "2-digit".
 * @property {string} second - The representation of the second. Possible values are "numeric", "2-digit".
 * @property {string} timeZoneName - The representation of the time zone name. Possible values are "short", "long".
 */


/**
 * Common jasonWidgets that have functionality being used across jasonWidgets.
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
     * Returns the count of a char in a string.
     * @param {string} char - Char to search for.
     * @param {array} args - String that contains the char.
     * @returns {number} count.
     */
    jasonCommon.prototype.charCountInString = function (char, containerString) {
       
        return containerString.split(char).length - 1;
    }
    /**
     * Date format function.
     * @param {date} date - Date value to be formated.
     * @param {string | Common.DateTimeFormat} format - Date string format or format options. {@link https://msdn.microsoft.com/en-us/library/8kb3ddd4%28v=vs.110%29.aspx} or {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat}
     * @returns {string}
     */
    jasonCommon.prototype.formatDateTime = function (date, format) {
        var result = "";
        try{
            if (Intl.DateTimeFormat && typeof format == "object") {
                result = new Intl.DateTimeFormat(jw.localizationManager.currentCulture.key, format);
                return result.format(date);
            }
        }
        catch (error) {
            console.log(error);
        }

        if (!format)
            format = jasonWidgets.localizationManager.currentCulture.dateFormat;
        
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
                                    result = hours > 9 ? result + hours : result + "0" + hours;
                                }
                                    
                                else
                                    result = hours > 9 ? result + hours : result + "0" + hours;
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
                result = date.getHours() >= 12 ? result + " " + jasonWidgets.localizationManager.postMeridiemString : result + " " + jasonWidgets.localizationManager.anteMeridiemString
            }
        }
        
        return result;
    }
    /**
     * Number format function. If browser supports Intl.NumberFormat it will be utilized. Otherwise a simple number.toFixed() will be used, ignoring any culture.
     * @param {number} number - Number value to be formatted.
     * @param {Common.NumberFormat} options - Format options. 
     */
    jasonCommon.prototype.formatNumber = function (number, options) {
        var result = "";
        var defaultOptions = { useGrouping: true, minimumFractionDigits: 2};
        if (number == void 0)
            return result;
        options = options == void 0 ? {} : options;
        jasonWidgets.common.extendObject(defaultOptions, options);
        if (Intl.NumberFormat) {
            if (options.style && options.style.toLowerCase() == "currency") {
                options.style = "currency";
                options.currency = jw.localizationManager.currentCulture.currencyCode;
            }
            numberFormat = new Intl.NumberFormat(jw.localizationManager.currentCulture.key, options);
            result = numberFormat.format(number);
            numberFormat = null;
        } else {
            if (!options.minimumFractionDigits)
                result = number.toString();
            else
                result += number.toFixed(options.minimumFractionDigits ? options.minimumFractionDigits : 0);
        }

        return result;
    }
    /**
     * Get parent element if it exists.
     * @param {string}  classOrId - Class name or id or tagName to identify the parent.
     * @param {HTMLElement}  childElement - Child element to start the search from.
     * @returns {HTMLElement} parentNode.
     */
    jasonCommon.prototype.getParentElement = function (identifier, childElement) {
        var parentNode = childElement.parentNode;
        identifier = identifier.toUpperCase();
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
     * @param {object} element - HTMLElement. The element to be associated with.
     * @param {string} name - Identifier for the data to be stored.
     * @param {object} value - Any value to be stored.
     */
    jasonCommon.prototype.setData = function (element, name, value) {
        if (element) {
            if (!element.jasonWidgetsData)
                element.jasonWidgetsData = [];
            element.jasonWidgetsData.push({ dataName: name, dataValue: value });
        }
    }
    /**
     * Removes data that was associated to an element.
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
     * Retrieves data that was associated to an element.
     * @param {object} element - HTMLElement. The element to be associated with.
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
     * Swap item places.
     * @param {any[]} array - Array that contains items.
     * @param {number} indexToMove - Current index of the item to move.
     * @param {number} newIndex - New index to move the item to.
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
     * Moves items in an array from one position to another.
     * @param {any[]} array - Array that contains items.
     * @param {number} indexToMove - Current index of the item to move.
     * @param {number} newIndex - New index to move the item to.
     */
    jasonCommon.prototype.moveItemsInArray = function (array, indexToMove, newIndex) {
        array.splice(newIndex, 0, array.splice(indexToMove, 1)[0]);
    }
    /**
     * Moves DOM elements in an HTMLCollection from one position to another.
     * @param {HTMLElement} container - Element that has children.
     * @param {number} indexToMove - Current index of the item to move.
     * @param {number} newIndex - New index to move the item to.
     */
    jasonCommon.prototype.moveDomElements = function (container, indexToMove, newIndex) {
        var tempArray = Array.prototype.slice.call(container.children);
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        jw.common.moveItemsInArray(tempArray, indexToMove, newIndex);
        tempArray.forEach(function (element, index) {
            container.appendChild(element);
        });
    }
    /**
     * Swap dom elements places.
     * @param {HTMLElement} container - Element that has children.
     * @param {number} indexToMove - Current index of the item to move.
     * @param {number} newIndex - New index to move the item to.
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
     * @param {object} targetElement - HTMLElement. The element that will recieve the child nodes.
     * @param {array=} elementTagsToMove If defined, only nodes with tagNames included in the array will be moved.
     * @param {array=} elementTagsToExclude - If defined, nodes with tagNames included in the array will be excluded from the move.
     * @param {array=} classesToExclude - If defined, nodes with classNames included in the array will be excluded from the move.
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
     * Applies style property value to child elements of an element.
     * @param {object} element - HTMLElement. The element to apply the style to.
     * @param {string} propertyName - Style property to be applied.
     * @param {any} value - Style property value to be applied.
     * @param {string} elementIdentifier - If defined, it will apply style only to elements that match the identifier. Identifier can be the ID, a class or a tagName. 
     * @param {boolean} recursive - If true it will be applied to all child nodes regardless of nesting level.
     */
    jasonCommon.prototype.applyStyleProperty = function (element, propertyName, value, elementIdentifier, recursive) {
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
     * Adds or removes class names from childs of an element.
     * @param {HTMLElement} element - Element to add or remove classes from.
     * @param {string} className - Class name to add/remove.
     * @param {boolean} add - If true, it will add the class. The default is false.
     * @param {string=} elementIdentifier - If defined, it will apply the action only to elements that match the identifier. The identifier can be the ID attribute | class name | tagName.
     * @param {boolean}  recursive - If true, it will apply the action to children's children also. The default is false.
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
     * Fade in effect.
     * @param {object} element - HTMLElement. The element to apply the fade in to.
     * @param {number} interval - Fade in duration.
     */
    jasonCommon.prototype.fadeIn = function (element, interval,finishCallback) {
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
                    if (finishCallback)
                        finishCallback();
                } else {
                    opacityValue = opacityValue + 0.1;
                }
            }, interval);
        }
    }
    /**
     * Fade out effect.
     * @param {object} element - HTMLElement. The element to apply the fade out to.
     * @param {number} interval - Fade out duration.
     */
    jasonCommon.prototype.fadeOut = function (element, interval, finishCallback) {
        if (!element._jasonWidgetsFadeOut) {
            element._jasonWidgetsFadeOut = true;
            var opacityValue = 1;
            element.style.opacity = "1";
            var fadeTimer = setInterval(function () {
                element.style.opacity = opacityValue;
                if (opacityValue <= 0) {
                    element.style.opacity = "";
                    clearInterval(fadeTimer);
                    element._jasonWidgetsFadeOut = undefined;
                    if (finishCallback)
                        finishCallback();
                } else {
                    opacityValue = opacityValue - 0.1;
                }
            }, interval);
        }
    }
    /**
     * Returns true if the element is an inline element.
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
     * Returns true if the element is a block element.
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
     * Returns true if number is within the specified range.
     * @param {number} value - Number to be tested.
     * @param {number} rangeStart - Range start.
     * @param {number} rangeEnd - Range end.
     */
    jasonCommon.prototype.isNumberInRange = function (value, rangeStart, rangeEnd) {
        return value >= rangeStart && value <= rangeEnd;
    }
    /**
     * Returns absolute coordinates of an element on a page.
     * @param {object} element - HTMLElement.
     * @returns {object}
     */
    jasonCommon.prototype.getOffsetCoordinates = function (element) {
        var result = { left: 0, top: 0 , scrollTop :0 ,scrollLeft:0 };
        var offSetElement = element;
        while (offSetElement) {
            result.left += offSetElement.offsetLeft;
            result.scrollLeft += offSetElement.scrollLeft;
            result.top += offSetElement.offsetTop;
            result.scrollTop += offSetElement.scrollTop;

            offSetElement = offSetElement.offsetParent;
        }
        return result;
    }
    /**
     * Returns scrolling left/top for the element including parent scrolling.
     * @param {object} element - HTMLElement.
     * @returns {object}
     */
    jasonCommon.prototype.getElementScrolling = function (element) {
        var result = {top: 0, left: 0 };
        var offSetElement = element;
        while (offSetElement) {
            result.left += offSetElement.scrollLeft;
            result.top += offSetElement.scrollTop;
            offSetElement = offSetElement.parentElement;
        }
        return result;
    }
    /**
     * Returns absolute coordinates of an element on a page.
     * @param {object} element - HTMLElement.
     * @param {boolean} countScrolling - If true it will account any scrolling into the top/left value.
     * @returns {object}
     */
    jasonCommon.prototype.getBoundingClientRect = function (element) {
        // (1)
        var rect = element.getBoundingClientRect();
        var result = { left: 0, right: 0, bottom: 0, height: 0, top: 0, width: 0,offSet:null,clientRect:null, scrolling:null };

        // (2)
        var scrollTop = window.pageYOffset || document.scrollTop || document.body.scrollTop;
        var scrollLeft = window.pageXOffset || document.scrollLeft || document.body.scrollLeft;

        // (3)
        var clientTop = document.clientTop || document.body.clientTop || 0;
        var clientLeft = document.clientLeft || document.body.clientLeft || 0;


        // (4)
        var top = rect.top + scrollTop - clientTop;
        var left = rect.left + scrollLeft - clientLeft;

        result.top = Math.round(top);
        result.left = Math.round(left);
        result.right = rect.right;
        result.height = rect.height;
        result.width = rect.width;
        result.clientRect = rect;

        //result.offSet = jw.common.getOffsetCoordinates(element);
        result.scrolling = jw.common.getElementScrolling(element);
        return result;
    }
    /**
     * Returns text's width in px.
     * @param {string} text - Text to be measured.
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
     * Returns the computed style property value of an element.
     * @param {object} element - HTMLElement.
     * @param {string} property - Property name.
     * @returns {string}
     */
    jasonCommon.prototype.getComputedStyleProperty = function (element, property) {
        return window.getComputedStyle(element, null).getPropertyValue(property);
    }
    /**
     * Replaces an element's text value.
     * @param {object} element - HTMLElement.
     * @param {string} newText - New text value.
     * @param {boolean} [createIfDoesNotExist=false] - Creates the text node if set to true.
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
     * Removes an element's text value.
     * @param {object} element - HTMLElement.
     */
    jasonCommon.prototype.removeNodeText = function (element) {
        var textNodes = [];
        for (var i = 0; i <= element.childNodes.length - 1; i++) {
            if (element.childNodes[i].nodeType == 3) {
                textNodes.push(element.childNodes[i]);
            }
        }
        textNodes.forEach(function (textNode) {
            element.removeChild(textNode);
        });
    }
    /**
     * Returns the first textnode of the element.
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
     * Returns all elements that match the search criteria.
     * @param {HTMLElement=} element - If not set, search scope will be the document.
     * @param {string} attributeName - Name of the attribute.
     * @param {string} attributeValue - Value of the attribute.
     * @param {string} elementIdentifier - Tag or class identifier to narrow the search even more.
     * @returns {array}
     */
    jasonCommon.prototype.getElementsByAttribute = function (containerElement,attributeName,attributeValue,elementIdentifier) {
        var container = containerElement ? containerElement : document;
        var queryString = elementIdentifier === void 0 ? "*[{0}='{1}']" : elementIdentifier + "[{0}='{1}']";
        return container.querySelectorAll(jw.common.formatString(queryString,[attributeName,attributeValue]));
    }
    /**
     * Returns all elements that match the search criteria.
     * @param {HTMLElement=} element - If not set, search scope will be the document.
     * @param {string[]} attributesName - names of the attributes.
     * @param {string[]} attributesValue - values of the attributes.
     * @param {string} elementIdentifier - Tag or class identifier to narrow the search even more.
     * @returns {array}
     */
    jasonCommon.prototype.getElementsByAttributes = function (containerElement, attributesName, attributesValue, elementIdentifier) {
        var queryString = "";
        for (var i = 0; i <= attributesName.length - 1; i++) {
            queryString = queryString + jw.common.formatString("[{0}='{1}']", [attributesName[i], attributesValue[i]]);
        }
        queryString = elementIdentifier == void 0 ? "*" + queryString : elementIdentifier + queryString;
        return containerElement.querySelectorAll(queryString);
    }
    /**
     * Gets next tabIndex value.
     * @returns {HTMLElement[]} The next tabIndex value.
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
     * Gets the next zIndex value
     */
    jasonCommon.prototype.getNextZIndex = function () {
        var result = Number.MIN_VALUE;
        var elements = document.getElementsByTagName("*");
        for (var i = 0; i <= elements.length - 1; i++) {
            var zIndex;
            if (elements[i].style.zIndex.length > 0)
                zIndex = parseInt(elements[i].style.zIndex);
            else
                zIndex = parseInt(jw.common.getComputedStyleProperty(elements[i], "z-index"));
            if (!isNaN(zIndex) && zIndex > result)
                result = zIndex;
        }
        return result + 1;
    }
    /**
     * Returns true if the element is a child of the container.
     * @param {HTMLElement} containerElement - Container element to search in.
     * @param {HTMLElement} childElement - Child element to search for.
     * @returns {boolean}
     */
    jasonCommon.prototype.contains = function (containerElement, childElement) {
        var childElements = [].slice.call(containerElement.getElementsByTagName(childElement.tagName));
        return childElements.filter(function (elem) { return elem == childElement; }).length == 1;
    }
    /**
     * Retuns an array of focusable elements.
     * @param {HTMLElement} [containerElement = undefined] - If no element is defined, search is performed on the whole document.
     */
    jasonCommon.prototype.getFocusableElements = function (containerElement) {
        containerElement = containerElement == void 0 ? document : containerElement;
        return containerElement.querySelectorAll(jw.common.focusableElements);
    }
    /**
     * Returns the first focusable HTMLElement.
     * @param {HTMLElement} [containerElement = undefined] - If no element is defined, search is performed on the whole document.
     * @param {boolean} [setFocus=false] - If true it also sets focus to the element.
     */
    jasonCommon.prototype.getFirstFocusableElement = function (containerElement, setFocus) {
        containerElement = containerElement == void 0 ? document : containerElement;
        if (jw.common.focusableElements.indexOf(containerElement.tagName) >= 0 || containerElement.getAttribute(jw.DOM.attributes.TABINDEX_ATTR)) {
            return containerElement;
        }
        var result = null;
        var recursion = function (containerElement) {
            if (result) {
                return;
            }
            for (var i = 0 ; i <= containerElement.children.length - 1; i++) {
                if (jw.common.focusableElements.indexOf(containerElement.children[i].tagName) >= 0 || containerElement.children[i].getAttribute(jw.DOM.attributes.TABINDEX_ATTR)) {
                    result = containerElement.children[i];
                    if (setFocus)
                        result.focus();
                    break;
                }
                if (containerElement.children[i].children.length > 0) {
                    recursion(containerElement.children[i]);
                }
            }
        }
        recursion(containerElement);
        return result;
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
     * Converts a string to boolean.
     * @param {string} boolStr - String to be converted to boolean.
     * @returns {boolean}
     */
    jasonCommon.prototype.strToBool = function (boolStr) {
        if (boolStr && (boolStr.toLowerCase() == 'true' || boolStr.toLowerCase() == 'yes'))
            return true;
        return false;
    }
    /**
     * Converts a boolean to string.
     * @param {boolean} bool - Boolean value to be converted to string.
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
        if (typeof valueToConvert == "string") {
            switch (returnDataType) {
                case jw.enums.dataType.number: {
                    return parseFloat(valueToConvert);
                    break;
                }
                case jw.enums.dataType.boolean: {
                    return jasonWidgets.common.strToBool(valueToConvert);
                    break;
                }
                case jw.enums.dataType.date: {
                    return new Date(valueToConvert);
                    break;
                }
                case jw.enums.dataType.string: {
                    return valueToConvert;
                    break;
                }
            }
        }
        if (typeof valueToConvert == "number") {
            switch (returnDataType) {
                case jw.enums.dataType.string: {
                    return valueToConvert.toString();
                    break;
                }
                case jw.enums.dataType.boolean: {
                    return valueToConvert == 0 ? false : true;
                    break;
                }
                case jw.enums.dataType.date: {
                    var result =  new Date();
                    result.setTime(valueToConvert);
                    break;
                }
            }
        }
        if (typeof valueToConvert == "date") {
            switch (returnDataType) {
                case jw.enums.dataType.string: {
                    return valueToConvert.toString();
                    break;
                }
                case jw.enums.dataType.boolean: {
                    jw.common.throwError(jw.errorTypes.error, "Cannot convert a date to a boolean value");
                    break;
                }
                case jw.enums.dataType.number: {
                    return valueToConvert.getTime();
                    break;
                }
            }
        }
        if (typeof valueToConvert == "boolean") {
            switch (returnDataType) {
                case jw.enums.dataType.string: {
                    return jasonWidgets.common.boolToStr(valueToConvert);
                    break;
                }
                case jw.enums.dataType.date: {
                    jw.common.throwError(jw.errorTypes.error, "Cannot convert a boolean to a date value");
                    break;
                }
                case jw.enums.dataType.number: {
                    return valueToConvert ? 1 : 0;
                    break;
                }
            }
        }
        return valueToConvert;
    }
    /**
     * Returns a date object with no time information.
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
     * Returns a date object with no date information.
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
     * @property {date} date1 - Date object.
     * @property {date} date2 - Date object.
     * @returns {Globals.jasonWidgets.enums.comparison}
     */
    jasonCommon.prototype.dateComparison = function (date1, date2) {
        var result = jw.enums.comparison.equal;
        if ((date1 == undefined && date2 != undefined) || (date2 == undefined && date1 != undefined))
            return jw.enums.comparison.notEqual;
        var time1 = jasonWidgets.common.dateOf(date1).getTime();
        var time2 = jasonWidgets.common.dateOf(date2).getTime();
        if (time1 > time2)
            result = jw.enums.comparison.firstIsGreater;
        if (time1 < time2)
            result = jw.enums.comparison.secondIsGreater;
        return result;
    }
    /**
     * @property {date} date1 - Date object.
     * @property {date} date2 - Date object.
     * @returns {Globals.jasonWidgets.enums.comparison}
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
     * @param {string} string1 - String object.
     * @param {string} string2 - String object.
     * @param {boolean} [caseSensitive=false] - If true, performs a case sensitive comparison.
     * @returns {Globals.jasonWidgets.enums.comparison}
     */
    jasonCommon.prototype.stringComparison = function (string1, string2,caseSensitive) {
        if (string1 == undefined && string2 == undefined)
            return jw.enums.comparison.equal;

        if (string1 == undefined && string2 != undefined)
            return jw.enums.comparison.notEqual;

        if (string2 == undefined && string1 != undefined)
            return jw.enums.comparison.notEqual;

        if (caseSensitive)
            return string1 == string2;
        return string1.toLocaleLowerCase() == string2.toLocaleLowerCase() ? jw.enums.comparison.equal : jw.enums.comparison.notEqual;
    }
    /**
     * @param {object} object1 - Object.
     * @param {object} object2 - Object.
     * @returns {Globals.jasonWidgets.enums.comparison}
     */
    jasonCommon.prototype.simpleObjectComparison = function (object1, object2) {
        var result = jw.enums.comparison.equal;
        if (object1 === object2)
            return jw.enums.comparison.equal;

        if (object1 == undefined && object2 != undefined)
            return jw.enums.comparison.notEqual;

        if (object2 == undefined && object1 != undefined)
            return jw.enums.comparison.notEqual;

        for (var prop in object1) {
            if (object1[prop] !== object2[prop]) {
                result = jw.enums.comparison.notEqual;
                break;
            }
        }
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
     * Returns day count in a year.
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
     * Parses a string value and returns a date object.
     * @param {string} value - String value to be parsed.
     * @param {string} dateFormat - Date format to be used when parsing the value.
     */
    jasonCommon.prototype.parseDateValue = function (value, dateFormat) {
        var dateFormat = dateFormat ? dateFormat : jw.localizationManager.localeDateFormat;
        var isDateWithWords = value.match(/\D\W/g);
        var newDate = null;
        var currentDate = new Date();
        if (isDateWithWords) {
            newDate = new Date(value);

            if (value.indexOf(currentDate.getFullYear()) < 0) {
                newDate.setYear(currentDate.getFullYear());
            }
            newDate = jasonWidgets.common.dateOf(newDate);
        }
        else {
            var nonNumeric = value.match(/[^0-9]/g);
            var splittedValue = nonNumeric ? value.split(nonNumeric[0]) : [value];
            var splittedFormat = nonNumeric ? dateFormat.split(nonNumeric[0]) : dateFormat.split(jw.localizationManager.localeDateSeparator);
            var day = null;
            var month = null;
            var year = null;
            for (var i = 0; i <= splittedFormat.length - 1; i++) {
                var splitValue = splittedValue[i];
                if (splitValue) {
                    splitValue = parseInt(splitValue);
                }

                if (splittedFormat[i].indexOf("y") >= 0)
                    year = splitValue;

                if (splittedFormat[i].indexOf("M") >= 0 && splitValue <= 12)
                    month = splitValue;

                if (splittedFormat[i].indexOf("d") >= 0 && splitValue <= 31)
                    day = splitValue;
            }
            if (!year)
                year = currentDate.getFullYear();
            if (!day)
                day = currentDate.getDate();
            if (!month)
                month = currentDate.getMonth() + 1;
            if (day && month && year) {
                newDate = new Date();
                newDate.setHours(0);
                newDate.setMinutes(0);
                newDate.setSeconds(0);
                newDate.setMilliseconds(0);
                newDate.setDate(day);
                newDate.setMonth(month - 1);
                newDate.setYear(year);
                newDate = jasonWidgets.common.dateOf(newDate);
            }
        }
        return newDate;
    }
    /**
     * Parses a string value and returns a date object.
     * @param {string} value - String value to be parsed.
     * @param {string} timeFormat - Time format to be used when parsing the value.
     */
    jasonCommon.prototype.parseTimeValue = function (value, timeFormat) {
        var timeFormat = timeFormat ? timeFormat : jw.localizationManager.localeTimeFormat;
        var isAM = false;
        var isPM = false;
        if (jw.localizationManager.isTwelveHourClock) {
            isAM = value.indexOf(jw.localizationManager.anteMeridiemString) >= 0;
            isPM = value.indexOf(jw.localizationManager.postMeridiemString) >= 0;
            value = isAM ? value.replace(jw.localizationManager.anteMeridiemString, "") : value.replace(jw.localizationManager.postMeridiemString, "");
        }
        var nonNumeric = value.match(/[^0-9]/g);
        var timeSplitter = nonNumeric ? nonNumeric[0] : jw.localizationManager.localeTimeSeparator;
        var splittedValue = value.split(timeSplitter);
        var splittedFormat = timeFormat.split(timeSplitter);
        var hours = null;
        var mins = null;
        var seconds = null;
        var newTime = null;
        for (var i = 0; i <= splittedFormat.length - 1; i++) {
            if (splittedFormat[i].indexOf("h") >= 0 || splittedFormat[i].indexOf("H") >= 0) {
                hours = parseInt(splittedValue[i]);
                if (jw.localizationManager.isTwelveHourClock && isAM)
                    hours = hours > 12 ? hours - 12 : hours;
                if (jw.localizationManager.isTwelveHourClock && isPM)
                    hours = hours > 12 ? hours : hours + 12;
            }
            if (splittedFormat[i].indexOf("m") >= 0)
                mins = parseInt(splittedValue[i]);

            if (splittedFormat[i].indexOf("s") >= 0)
                seconds = parseInt(splittedValue[i]);
        }
        if (!seconds || isNaN(seconds) || seconds > 60)
            seconds = 0;
        if (!mins || isNaN(mins) || mins > 60)
            mins = 0;
        if (hours >= 24)
            hours = 0;
        if (hours != null && mins != null && seconds != null) {
            newTime = new Date();
            newTime.setHours(hours);
            newTime.setMinutes(mins);
            newTime.setSeconds(seconds);
            newTime.setMilliseconds(0);
            newTime = newTime;
        }
        return newTime;
    }
    /**
     * Parses a string value and returns a date object.
     * @param {string} value - String value to be parsed.
     * @param {string} dateFormat - Date format to be used when parsing the value.
     * @param {string} timeFormat - Time format to be used when parsing the value.
     */
    jasonCommon.prototype.parseDateTimeValue = function (value, dateFormat, timeFormat) {
        var result = null;
        var parsedDate = null;
        var parsedTime = null;
        var timeFormat = timeFormat ? timeFormat : jw.localizationManager.localeTimeFormat;
        var dateFormat = dateFormat ? dateFormat : jw.localizationManager.localeDateFormat;

        //First try to get the date part based on the passed format.
        var dateSeparator = dateFormat.match(/[^a-z]/gi);
        var datePartRegExpFullDate = new RegExp(jw.common.formatString("\\d+[\{0}\+]\\d+[\{0}\+]\\d+", dateSeparator[0]), "gi");
        var datePartRegExpShortDate = new RegExp(jw.common.formatString("\\d+[\{0}\+]\\d+", dateSeparator[0]), "gi");
        var datePart = value.match(datePartRegExpFullDate);
        if (!datePart)
            datePart = value.match(datePartRegExpShortDate)
        if (datePart) {
            parsedDate = jw.common.parseDateValue(datePart[0]);
        }

        //then try to get the time part based on the passed format.
        var timeSeparator = timeFormat.match(/[^a-z]/gi);
        var timePartRegExpWithSeconds = new RegExp(jw.common.formatString("\\d*[{0}]\\d*[{0}]\\d*", timeSeparator[0]), "gi");
        var timePartRegExpWithMinutes = new RegExp(jw.common.formatString("\\d*[{0}]\\d*", timeSeparator[0]), "gi");

        //try to find first time with seconds. If it fails to find any, try to find hours and minutes.
        var timePart = value.match(timePartRegExpWithSeconds);
        if (!timePart)
            timePart = value.match(timePartRegExpWithMinutes);
        if (timePart) {
            if (value.indexOf(jw.localizationManager.anteMeridiemString) >= 0)
                timePart[0] = timePart[0] + " " + jw.localizationManager.anteMeridiemString;
            else {
                if (value.indexOf(jw.localizationManager.postMeridiemString) >= 0)
                    timePart[0] = timePart[0] + " " + jw.localizationManager.postMeridiemString;
            }
            parsedTime = jw.common.parseTimeValue(timePart[0]);
        }
        //if there is no date found 
        //remove the time part (if it exists) and try parse again the string
        if (!datePart) {
            var dateOnly = timePart ? value.replace(timePart[0], "") : value;
            var dateOnlyParts = dateOnly.match(/\w+/gi);
            if (dateOnlyParts) {
                var year = null;
                var month = null;
                var day = null;
                var currentLang = jw.localizationManager.currentLanguage;
                dateOnlyParts.forEach(function (dateOnlyPart) {
                    var idx;
                    //is the string a day? Always based on current jw locale
                    var isItADay = currentLang.calendar.days.filter(function (day,index) {
                        var result = day.name.toLowerCase() == dateOnlyPart.toLowerCase() || day.shortName.toLowerCase() == dateOnlyPart.toLowerCase();
                        if (result)
                            idx = index;
                        return result;
                    }).length > 0;
                    //is the string a month? Always based on current jw locale
                    var isItAMonth = currentLang.calendar.months.filter(function (month,index) {
                        var result = month.name.toLowerCase() == dateOnlyPart.toLowerCase() || month.shortName.toLowerCase() == dateOnlyPart.toLowerCase();
                        if (result)
                            idx = index;
                        return result;
                    }).length > 0;
                    if (isItADay) {
                        day = idx;
                        //remove the month part from the original dateOnly string. It will help determining the date part.
                        dateOnly = dateOnly.replace(dateOnlyPart, "");
                    }
                    if (isItAMonth) {
                        month = idx;
                        //remove the month part from the original dateOnly string. It will help determining the date part.
                        dateOnly = dateOnly.replace(dateOnlyPart, "");
                    }
                    var numericValue = parseInt(dateOnlyPart);
                    if (!isNaN(numericValue)) {
                        if(numericValue > 31){
                            year = numericValue;
                            //remove the year part from the original dateOnly string. It will help determining the date part.
                            dateOnly = dateOnly.replace(dateOnlyPart, "");
                        }
                    }
                });
            }
            if (day == undefined) {
                var numericValue = parseInt(dateOnly);
                if (!isNaN(numericValue))
                    day = numericValue;
            }
            if (year || month || day) {
                parsedDate = new Date();
                if (year != undefined)
                    parsedDate.setYear(year);
                if (month != undefined)
                    parsedDate.setMonth(month);
                if (day != undefined)
                    parsedDate.setDate(day);
            }
        }
        //if there is at least one string that matches a date or a time string based on the format then, set current date/time to the part missing
        //and return the parsed date/time.
        if (parsedDate || parsedTime) {
            if (!parsedDate)
                parsedDate = new Date();
            if (!parsedTime)
                parsedTime = new Date();
            return new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), parsedTime.getHours(), parsedTime.getMinutes(), parsedTime.getSeconds());
        }
        else {
            //if there is no match for a date/time string, let the browser give it a try.
            try {
                return new Date(value);
            }
            catch (error) {

            }
        }
    }
    /**
     * Returns true if the property exists on the object.
     * @param {object} object - Object to search for the property in.
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
     * Returns true if the value passed is a date string, based on the format.
     * @param {string} value - String value to be tested.
     * @param {string} [timeFormat= Default browser format] - Time format to be tested against.
     */
    jasonCommon.prototype.isTimeString = function (value, timeFormat) {
        var format = timeFormat ? timeFormat : jw.localizationManager.localeTimeFormat;
        var timeSeparator = format.match(/[^a-z]/ig) ? format.match(/[^a-z]/ig)[0] : null;
        //get all number characters.
        var valueNumbers = value.match(/[0-9]/g);
        //if value is only numbers check if there is the separator present or if there is no separator check if value has only numbers.
        return value.indexOf(timeSeparator) > 0 || (valueNumbers != undefined && valueNumbers.length == value.length);
    }
    /**
     * Returns true if the value passed is a date string, based on the format and the current language.
     * @param {string} value - String value to be tested.
     * @param {string} [dateFormat= Default browser format] - Date format to be tested against.
     */
    jasonCommon.prototype.isDateString = function (value, dateFormat) {
        var result = true;
        var format = dateFormat ? dateFormat : jw.localizationManager.localeDateFormat;
        //get the date separator
        var dateSeparator = format.match(/[^a-z]/ig) ? format.match(/[^a-z]/ig)[0] : null;
        //get all number characters.
        var valueNumbers = value.match(/[0-9]/g);

        //get all non number characters/words in the value string and try to find if
        //the word is a day or a month based on the current language.
        //for example 02/Jan or 02/January.
        var nonNumberCharacters = value.match(/[a-z]\w+/ig);
        if (nonNumberCharacters) {
            var currentLang = jw.localizationManager.currentLanguage;
            for (var i = 0; i <= nonNumberCharacters.length - 1; i++) {
                var nonNumberValue = nonNumberCharacters[i];
                var isItADay = currentLang.calendar.days.filter(function (day) {
                    return day.name.toLowerCase() == nonNumberValue.toLowerCase() || day.shortName.toLowerCase() == nonNumberValue.toLowerCase();
                }).length > 0;
                var isItAMonth = currentLang.calendar.months.filter(function (month) {
                    return month.name.toLowerCase() == nonNumberValue.toLowerCase() || month.shortName.toLowerCase() == nonNumberValue.toLowerCase();
                }).length > 0;
                if (!isItADay && !isItAMonth) {
                    result = false;
                    break;
                }
            }
        }
        //if value is only numbers check if there is the separator present or if there is no separator check if value has only numbers.
        return result && value.indexOf(dateSeparator) > 0 || (valueNumbers != undefined && valueNumbers.length == value.length);
    }
    /**
     * Removes any events added to the element and its children by jasonWidgets. 
     * @param {HTMLElement} element - Element from which to remove jasonWidget events.
     * @param {boolean} recursive - If true, it will be applied to the children of the element. The default is true.
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
     * @param {HTMLElement} element - Element to remove child elements from.
     */
    jasonCommon.prototype.removeChildren = function (element) {
        while (element.firstChild) {
            jw.common.removeJWEvents(element.firstChild);
            jw.common.removeChildren(element.firstChild);
            element.removeChild(element.firstChild);
        }
    }
    /**
     * Add a global event listener.
     * @param {function} listener - Listener function.
     */
    jasonCommon.prototype.addGlobalEventListener = function (listener) {
        this.globalEventListeners.push(listener);
    }
    /**
     * Returns the type of a variable.
     * @param {any} variable - A variable to determine its type.
     * @returns {Globals.jasonWidgets.enums.dataType}
     */
    jasonCommon.prototype.getVariableType = function (variable) {
        var result = jw.enums.dataType.unknown;
        if (variable == void 0)
            return result;
        
        if (typeof variable == "object") {
            result = jw.enums.dataType.object;
            var constructorString = variable.constructor ? variable.constructor.toString() : "";
            if (constructorString.indexOf("Date()") > 0 && constructorString.indexOf("native code") > 0) {
                result = jw.enums.dataType.date;
            }
            if (Array.isArray(variable))
                result = jw.enums.dataType.array;
        } else {
            if (typeof variable == "number")
                result = jw.enums.dataType.number;
            if (typeof variable == "boolean")
                result = jw.enums.dataType.boolean;
            if (typeof variable == "function")
                result = jw.enums.dataType.method;
            if (typeof variable == "string")
                result = jw.enums.dataType.string;
        }
        return result;
    }
    /**
     * Retuns true if variable is an integer number.
     * @param {number} value - Value to test if it is an integer number or not.
     */
    jasonCommon.prototype.isInteger = function (value) {
        return typeof value === "number" &&
          isFinite(value) &&
          Math.floor(value) === value;
    }
    /**
     * Trigger global event.
     * @param {number} eventCode - Code event to trigger.
     * @param {object=} eventData - Event data.
     */
    jasonCommon.prototype.triggerGlobalEvent = function (eventCode,eventData) {
        for (var i = 0; i <= this.globalEventListeners.length - 1; i++) {
            this.globalEventListeners[i](eventCode, eventData);
        }
    }
    /**
     * @param {any} variable - Variable to be checked.
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
    jasonCommon.prototype.blockElements = ["DIV", "P", "JW_TABLE", "THEAD", "TFOOT", "TBODY", "HR", "UL", "OL", "FIELDSET", "NAV", "H1", "H2", "H3", "H4", "H5", "H6"];
    /**
     * Array of element tags that are focusable by definition.
     */
    jasonCommon.prototype.focusableElements = ["BUTTON","INPUT","A","SELECT","TEXTAREA"];
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
    /**
     * Applies a template to an element and parses the data attributes to set text values to the nodes that are bound to a field.
     */
    jasonCommon.prototype.applyTemplate = function (htmlElement,template,dataFieldAttribute,dataItem) {
        htmlElement.innerHTML = template;
        if (dataFieldAttribute != void 0 && dataItem != void 0) {
            var dataAwareElements = htmlElement.querySelectorAll("*[" + dataFieldAttribute + "]");
            for (var i = 0; i <= dataAwareElements.length - 1; i++) {
                var dataElement = dataAwareElements[i];
                jw.common.replaceNodeText(dataElement, dataItem[dataElement.getAttribute(dataFieldAttribute)], true);
            }
        }
    }
    /**
     * Parses template content, either its a function or a script tag or a HTMLElement.
     * @param {string|function|HTMLElement} templateContent - The template content.
     */
    jasonCommon.prototype.parseTemplateContent = function (templateContent) {
        var result = null;
        var templateElement = document.getElementById(templateContent);
        var isElement = templateElement != null || templateContent instanceof HTMLElement;
        if (isElement) {
            var element = templateElement || templateContent;
            result = element.tagName == "SCRIPT" ? element.innerHTML : element.outerHTML;
        }
        else {
            result = (typeof templateContent == "function") ? templateContent() : templateContent;
            if (typeof templateContent == "string" && templateContent.trim().length > 0)
                result = templateContent;
            else
                result = null;
        }
        return result;
    }
}
var jasonWidgets = {};
jw = jasonWidgets;
jasonWidgets.common = new jasonCommon();
jasonWidgets.enums = {};

/**
 * @namespace Globals
 * @description Common or base classes for jasonWidgets.
 */

/**
 * @readonly
 * @memberOf Globals
 * @description jwWidgets AngularJS module name.
 */
jasonWidgets.jwAngularJSModuleName = "jwWidgets";

/**
 * @readonly
 * @enum {number}
 * @memberOf Globals
 * @description Result of a variable type.
 */
jasonWidgets.enums.dataType = {
    unknown:0,
    number: 1,
    integer:2,
    date: 3,
    dateTime:4,
    boolean: 5,
    object: 6,
    string: 7,
    currency:8,
    method: 9,
    array:10
}

/**
 * @readonly
 * @enum {number}
 * @memberOf Globals
 * @description Result of a comparison operation.
 */
jasonWidgets.enums.comparison = {
    equal: 0,
    firstIsGreater: 1,
    secondIsGreater: 2,
    notEqual:3
}
/**
 * @readonly
 * @enum {number}
 * @memberOf Globals
 * @description Error type.
 */
jasonWidgets.errorTypes = {
    error: 0,
    evalError: 1,
    rangeError: 2,
    referenceError: 3,
    syntaxError: 4,
    typeError: 5,
    uriError: 6
}

jasonWidgets.DOM = {}
/**
 * @readonly
 * @enum {string}
 * @memberOf Globals
 * @description Attribute names, used by JasonWidgets.
 */
jasonWidgets.DOM.attributes = {
    COLSPAN_ATTR: "colspan",
    DRAGGABLE_ATTR: "draggable",
    HREF_ATTR: "href",
    INPUT_MODE_ATTR: "inputmode",
    ID_ATTR: "id",
    FOR_ATTR: "for",
    DISABLED_ATTR: "disabled",
    DATA_FIELD:"data-field",
    JW_COMBOBOX_LIST_STATE_ATTR: "jw-drop-down-list-state",
    JW_DATA_CELL_ID_ATTR: "jw-data-cell-id",
    JW_DATA_GROUPING_FIELD_ATTR: "jw-data-grouping-field",
    JW_DATA_GROUPING_KEY_ATTR: "jw-data-group-key",
    JW_DATA_GROUPING_LEVEL_ATTR: "jw-data-grouping-level",
    JW_DATA_GROUP_COLLAPSED_ATTR: "jw-data-group-collpsed",
    JW_DATA_GROUP_EXPANDED_ATTR: "jw-data-group-expanded",
    JW_DATA_JW_ITEM_INDEX_ATTR: "jw-data-item-index",
    JW_DATA_ROW_ID_ATTR: "jw-data-row-id",
    JW_DIRECTION_ATTR: "jw-direction",
    JW_GRID_GROUP_FIELD: "jw-group-field",
    JW_GRID_COLUMN_ID_ATTR: "jw-column-id",
    JW_GRID_COLUMN_FIELD_ATTR: "jw-column-field",
    JW_GRID_COLUMN_SORT_ATTR: "jw-column-sort",
    JW_ITEM_INDEX_ATTR: "jw-item-index",
    JW_MENU_ITEM_LEVEL_ATTRIBUTE: "data-jason-menu-item-level",
    JW_MENU_ITEM_NO_HIGHLIGHT_ATTR: "no-highlight",
    PATTERN_ATTR : "pattern",
    PLACEHOLDER_ATTR: "placeholder",
    READONLY_ATTR: "readonly",
    TABINDEX_ATTR: "tabindex",
    TITLE_ATTR: "title",
    TYPE_ATTR: "type"
}
/**
 * @readonly
 * @enum {string}
 * @memberOf Globals
 * @description Event names, used by JasonWidgets.
 */
jasonWidgets.DOM.events = {
    BLUR_EVENT: "blur",
    CHANGE_EVENT: "change",
    CLICK_EVENT: "click",
    CONTEXT_MENU_EVENT: "contextmenu",
    DRAG_END_EVENT: "dragend",
    DRAG_ENTER_EVENT: "dragenter",
    DRAG_EVENT: "drag",
    DRAG_EXIT_EVENT: "dragexit",
    DRAG_OVER_EVENT: "dragover",
    DRAG_START_EVENT: "dragstart",
    DROP_EVENT: "drop",
    FOCUS_EVENT: "focus",
    INPUT_EVENT: "input",
    JW_EVENT_JW_CALENDAR_MODE_CHANGE: "onModeChange",
    JW_EVENT_JW_CALENDAR_NAVIGATE: "onNavigate",
    JW_EVENT_ON_CHANGE: "onChange",
    JW_EVENT_ON_BUTTON_CLICK:"onButtonClick",
    JW_EVENT_ON_COLUMN_POSITION_CHANGE: 'onColumnPositionChange',
    JW_EVENT_ON_COLUMN_RESIZED: 'onColumnResize',
    JW_EVENT_ON_DATA_CHANGE: 'onDataChange',
    JW_EVENT_ON_JW_DIALOG_BUTTON_CLICK: "onDialogButtonClick",
    JW_EVENT_ON_JW_DIALOG_HIDE: "onDialogHide",
    JW_EVENT_ON_JW_DIALOG_SHOW: "onDialogShow",
    JW_EVENT_ON_GROUP_BY_FIELD: 'onGroupByField',
    JW_EVENT_ON_GROUP_COLLAPSE: 'onGroupCollapse',
    JW_EVENT_ON_GROUP_EXPAND: 'onGroupExpand',
    JW_EVENT_ON_JW_MENU_CHECKBOX_CLICKED: "onCheckboxClicked",
    JW_EVENT_ON_JW_MENU_ITEM_CLICKED: "onItemClick",
    JW_EVENT_ON_JW_MENU_ITEM_CONTENT_SHOW: "onItemContentShown",
    JW_EVENT_ON_PAGE_CHANGE: 'onPageChange',
    JW_EVENT_ON_SELECTION_CHANGE: 'onSelectionChange',
    JW_EVENT_ON_SELECT_ITEM: "onSelectItem",
    JW_EVENT_ON_UNSELECT_ITEM: "onUnSelectItem",
    JW_EVENT_ON_JW_TAB_ENTER: "onTabEnter",
    JW_EVENT_ON_UNGROUP_FIELD: 'onUnGroupField',
    JW_EVENT_ON_SHOW: "onShow",
    JW_EVENT_ON_HIDE: "onHide",
    JW_EVENT_ON_ELEMENT_RESIZING:"onElementResizing",
    JW_EVENT_ON_ELEMENT_RESIZED: "onElementResized",
    KEY_DOWN_EVENT: "keydown",
    KEY_PRESS_EVENT: "keypress",
    KEY_UP_EVENT: "keyup",
    MOUSE_DOWN_EVENT: "mousedown",
    MOUSE_ENTER_EVENT: "mouseenter",
    MOUSE_LEAVE_EVENT: "mouseleave",
    MOUSE_MOVE_EVENT: "mousemove",
    MOUSE_OUT_EVENT: "mouseout",
    MOUSE_OVER_EVENT: "mouseover",
    MOUSE_UP_EVENT: "mouseup",
    REPAINT_EVENT:"repaint",
    RESIZE_EVENT: "resize",
    SCROLL_EVENT: "scroll",
    TOUCH_CANCEL_EVENT: "touchcancel",
    TOUCH_END_EVENT: "touchend",
    TOUCH_EVENT: "touch",
    TOUCH_MOVE_EVENT: "touchmove",
    TOUCH_START_EVENT: "touchstart"
}

jw.DOM.eventCodes = {
    JGE_REDRAW:1000
}
/**
 * @readonly
 * @enum {string}
 * @memberOf Globals
 * @description CSS class names, used by JasonWidgets.
 */
jw.DOM.classes = {
    grids:{
        GRID: "jw-grid-non-tabular",
        GRID_HEADER: "jw-grid-header",
        GRID_BODY: "jw-grid-body",
        GRID_FOOTER:"jw-grid-footer",
        GRID_COLUMN: "jw-grid-column",
        GRID_COLUMN_CAPTION: "jw-grid-column-caption",
        GRID_COLUMN_BUTTON: "jw-grid-column-button",
        GRID_FILTER:"jw-grid-filter",
        GRID_GROUPING_CONTAINER: "jw-grid-grouping",
        GRID_GROUPING_MESSAGE: "jw-grouping-message"
    },
    JW_BUTTON: "jw-button",
    JW_BUTTON_STANDALONE:"standalone",
    JW_BUTTON_ELEMENT: "jw-button-element",
    JW_BLOCK_ELEMENT: "jw-block-element",
    JW_CALENDAR : "jw-calendar",
    JW_CALENDAR_BODY : "jw-calendar-body",
    JW_CALENDAR_DISPLAY : "jw-calendar-display",
    JW_CALENDAR_FOOTER : "jw-calendar-footer",
    JW_CALENDAR_GO_BACK : "jw-calendar-back",
    JW_CALENDAR_GO_FORWARD : "jw-calendar-forward",
    JW_CALENDAR_HEADER : "jw-calendar-header",
    JW_CALENDAR_ITEM_OUT_CURRENT_SCOPE: "jw-calendar-item-outofscope",
    JW_CALENDAR_ITEM_SELECTED_DATE : "selected-date",
    JW_CALENDAR_JW_TABLE_CENTURIES : "centuries-view",
    JW_CALENDAR_JW_TABLE_DECADES : "decades-view",
    JW_CALENDAR_JW_TABLE_MONTHS : "month-view",
    JW_CALENDAR_JW_TABLE_YEARS: "years-view",
    JW_CHECKBOX_INPUT : "jw-checkbox",
    JW_CLEAR_FLOAT_CLASS: "jw-clear-float",
    JW_BORDERED : "jw-bordered",
    JW_BUTTON_TEXT_BOX : "jw-button-textbox",
    JW_COMBOBOX_CLASS : "jw-combobox",
    JW_DATE_PICKER_CLASS: "jw-date-picker",
    JW_DIALOG_BODY   : "jw-dialog-body",
    JW_DIALOG_BUTTONS_CONTAINER: "jw-dialog-buttons",
    JW_DIALOG_CONTAINER : "jw-dialog-container",
    JW_DIALOG_FOOTER : "jw-dialog-footer",
    JW_DIALOG_HEADER: "jw-dialog-header",
    JW_DIALOG_TITLE_CONTAINER: "title-container",
    JW_DIALOG_HEADER_BUTTON_CONTAINER:"header-button-container",
    JW_DISABLED : "jw-disabled",
    JW_DRAG_IMAGE: "jw-drag-image-container",
    JW_DROP_DOWN_LIST: "jw-drop-down-list",
    JW_DROP_DOWN_LIST_ITEM: "drop-down-list-item",
    JW_DROP_DOWN_BUTTON_MULTI_SELECT:"jw-drop-down-button-multi-select",
    JW_FOCUSED:"jw-focused",
    JW_GRID_CLASS : "jw-grid",
    JW_GRID_COLUMN_DRAG_IMAGE : "jw-grid-column-drag-image",
    JW_GRID_COLUMN_RESIZE_HANDLE : "jw-column-resize",
    JW_GRID_DATA : "jw-grid-data",
    JW_GRID_DATA_CONTAINER : "jw-grid-data-container",
    JW_GRID_FIELD_HAS_FILTER : "jw-grid-column-has-filter",
    JW_GRID_FILTER_ACTION_BUTTON_CLASS: "jw-grid-filter-action-button",
    JW_GRID_FILTER_BODY_CLASS : "jw-grid-filter-body",
    JW_GRID_FILTER_CONTAINER_CLASS : "jw-grid-filter-container",
    JW_GRID_FILTER_FOOTER_CLASS : "jw-grid-filter-footer",
    JW_GRID_FILTER_HEADER_CLASS : "jw-grid-filter-header",
    JW_GRID_FILTER_INPUT : "jw-filter-input",
    JW_GRID_FOCUSED_CELL_CLASS : "cell-focused",
    JW_GRID_FOOTER : "jw-grid-footer",
    JW_GRID_FOOTER_CONTAINER : "jw-grid-footer-container",
    JW_GRID_GROUPING_CONTAINER_CLASS : "jw-grid-group-container",
    JW_GRID_GROUP_CELL: "group-cell",
    JW_GRID_GROUP_KEY_CAPTION:"group-key-caption",
    JW_GRID_GROUPING_MESSAGE:"jw-grouping-message",
    JW_GRID_HEADER : "jw-grid-header",
    JW_GRID_HEADER_CELL_CAPTION_CONTAINER : "jw-header-cell-caption",
    JW_GRID_HEADER_CELL_ICON_CONTAINER : "jw-header-cell-icon",
    JW_GRID_HEADER_CONTAINER : "jw-grid-header-container",
    JW_GRID_HEADER_CONTAINER_NO_GROUPING : "no-grouping",
    JW_GRID_HEADER_JW_TABLE_CONTAINER: "jw-grid-header-table-container",
    JW_GRID_JW_TABLE_ALT_ROW_CLASS : "row-alt",
    JW_GRID_JW_TABLE_CELL_CLASS : "jw-grid-cell",
    JW_GRID_JW_TABLE_CELL_CONTENT_CONTAINER_CLASS : "jw-grid-cell-content",
    JW_GRID_JW_TABLE_GROUP_ROW_CLASS : "group-row",
    JW_GRID_JW_TABLE_NO_DATA_ROW_CLASS: "jw-grid-no-data-row",
    JW_GRID_JW_TABLE_ROW_CLASS : "jw-grid-row",
    JW_GRID_SELECTED_CELL_CLASS : "cell-selected",
    JW_GRID_SELECTED_ROW_CLASS: "row-selected",
    JW_GRID_REMOVE_GROUP_BUTTON: "jw-grid-remove-grouping",
    JW_GRID_UNSELECTABLE:"unselectable",
    JW_HAS_ARROW: "has-arrow",
    JW_HAS_CHECKBOX: "has-checkbox",
    JW_HAS_ICON: "has-icon",
    JW_JW_GRID_FILTER_BUTTON_APPLY : "apply-filter",
    JW_JW_GRID_FILTER_BUTTON_CLEAR : "clear-filter",
    JW_LABEL: "jw-label",
    JW_INVALID :"jw-invalid",
    JW_MENU_CLASS : "jw-menu",
    JW_MENU_CONTAINER_CLASS : "jw-menu-container",
    JW_MENU_HORIZONTAL: "horizontal",
    JW_MENU_VERTICAL: "vertical",
    JW_MENU_ITEM : "jw-menu-item",
    JW_MENU_ITEMS_CONTAINER_CLASS : "jw-menu-items-container",
    JW_MENU_ITEM_ARROW : "jw-menu-item-arrow",
    JW_MENU_ITEM_CAPTION : "jw-menu-item-caption",
    JW_MENU_ITEM_CAPTION_ONLY : "just-caption",
    JW_MENU_ITEM_CHECKBOX : "jw-menu-item-checkbox",
    JW_MENU_ITEM_CHECKBOX_CLASS : "jw-menu-item-checkbox",
    JW_MENU_ITEM_CLASS : "jw-menu-item",
    JW_MENU_ITEM_CLASS_ACTIVE: "jw-menu-item-active",
    JW_MENU_ITEM_CLICKABLE : "clickable",
    JW_MENU_ITEM_CONTENT : "menu-content",
    JW_MENU_ITEM_CONTENT_CLASS : "jw-menu-item-content",
    JW_MENU_ITEM_DISABLED : "disabled",
    JW_MENU_ITEM_DIVIDER : "divider",
    JW_MENU_ITEM_ICON: "jw-menu-item-icon",
    JW_NUMERIC_TEXT_BOX: "jw-numeric-textbox",
    JW_PAGER_CONTAINER_CLASS : "jw-grid-pager",
    JW_PAGER_CONTAINER_PAGE_INFO_CLASS: "jw-grid-pager-info",
    JW_POPOVER: "jw-popover",
    JW_POPOVER_HEADER: "jw-popover-header",
    JW_POPOVER_BODY: "jw-popover-body",
    JW_READONLY: "jw-readonly",
    JW_SELECTED: "jw-selected",
    JW_TAB_CONTAINER : "jw-tabcontrol-container",
    JW_TAB_PAGE_ACTIVE: 'jw-tab-active',
    JW_TAB_PAGE_CLASS : "jw-tabcontrol-page",
    JW_TAB_PAGE_CONTAINER : "jw-tabcontrol-page-container",
    JW_TAB_PAGE_CONTENT_CONTAINER_CLASS : "jw-tabcontrol-page-container",
    JW_TAB_UL_CLASS: "jw-tabcontrol-list",
    JW_TEXT_BOX: "jw-textbox",
    JW_TEXT_INPUT : "jw-text-input",
    JW_TEXT_OVERFLOW: "jw-text-overflow",
    JW_TOP: "top",
    JW_BOTTOM: "bottom",
    JW_LEFT: "left",
    JW_RIGHT: "right",
    JW_MIDDLE: "middle",
    JW_ARROW_LEFT: "arrow-left",
    JW_ARROW_RIGHT: "arrow-right",
    JW_ARROW_MIDDLE: "arrow-middle",
    JW_UNSELECTABLE_TABLE: "jw-unselectable",
    JW_VALIDATION: "jw-validation-bubble",
    JW_VALIDATION_CONTAINER: "jw-validation-container",
    JW_VALIDATION_MESSAGE_CONTAINER: "jw-validation-message-container",
    JW_VALIDATION_MESSAGE: "jw-validation-message",
}
/**
 * @readonly
 * @enum {string}
 * @memberOf Globals
 * @description Attribute values, used by JasonWidgets.
 */
jw.DOM.attributeValues = {
    JW_COMBOBOX_LIST_STATE_DOWN: "down",
    JW_COMBOBOX_LIST_STATE_UP: "up",
    JW_DIALOG_BUTTON_DATA_KEY: "jasonDialogButton",
    JW_MENU_ITEM_DATA_KEY: "jasonMenuItem"
}
var
    JW_ICON = "jw-icon fa fa-fw ";
/**
 * @readonly
 * @enum {string}
 * @memberOf Globals
 * @description Icon class names, used by JasonWidgets.
 */
jw.DOM.icons = {
    CALENDAR: JW_ICON + "fa-calendar",
    CHEVRON_DOWN: JW_ICON + "fa-chevron-down",
    CHEVRON_UP: JW_ICON + "fa-chevron-up",
    CHEVRON_LEFT: JW_ICON + "fa-chevron-left",
    CHEVRON_RIGHT: JW_ICON + "fa-chevron-right",
    CIRCLE_ARROW_DOWN: JW_ICON + "fa-chevron-circle-down",
    CIRCLE_ARROW_UP: JW_ICON + "fa-chevron-circle-up",
    CIRCLE_ARROW_LEFT: JW_ICON + "fa-chevron-circle-left",
    CIRCLE_ARROW_RIGHT: JW_ICON + "fa-chevron-circle-right",
    CIRCLE_CHOOSE: JW_ICON + "fa-check-circle",
    CIRCLE_MINUS: JW_ICON + "fa-minus-circle",
    CIRCLE_PLUS: JW_ICON + "fa-plus-circle",
    CLOCK : JW_ICON + "fa-clock-o",
    CLOSE: JW_ICON + "fa-close",
    CLOSE_24x24: JW_ICON + "fa-close",
    FILTER: JW_ICON + "fa-filter",
    LIST: JW_ICON + "fa-list",
    MINUS: JW_ICON + "fa-minus",
    PLUS: JW_ICON + "fa-plus",
    REMOVE_SORT: JW_ICON + "fa-trash",
    REMOVE_FILTER: JW_ICON + "fa-trash",
    SEARCH: JW_ICON + "fa-search",
    SETTINGS : JW_ICON + "fa-cog",
    SIGNAL: JW_ICON + "fa-signal",
    SORT_ASC: JW_ICON + "fa-sort-amount-asc",
    SORT_DESC: JW_ICON + "fa-sort-amount-desc",
    CHEVRON_DOWN16x16: JW_ICON + "fa-chevron-down",
    CHEVRON_UP16x16: JW_ICON + "fa-chevron-up",
}

jasonWidgets.keycodes = {
    backspace: 8,
    tab: 9,
    enter: 13,
    shift: 16,
    ctrl: 17,
    alt: 18,
    pause_break: 19,
    caps_lock: 20,
    escape: 27,
    pageUp: 33,
    pageDown: 34,
    end:35,
    home: 36,
    leftArrow: 37,
    upArrow: 38,
    rightArrow: 39,
    downArrow: 40,
    insert: 45,
    delete: 46,
    zero: 48,
    one: 49,
    two: 50,
    three: 51,
    four: 52,
    five: 53,
    six: 54,
    seven: 55,
    eight: 56,
    nine: 57,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    leftWindowKey: 91,
    righWindowKey: 92,
    selectKey: 93,
    numpad0: 96,
    numpad1: 97,
    numpad2: 98,
    numpad3: 99,
    numpad4: 100,
    numpad5: 101,
    numpad6: 102,
    numpad7: 103,
    numpad8: 104,
    numpad9: 105,
    multiply: 106,
    add: 107,
    subtract: 109,
    decimalPoint: 110,
    divide: 11,
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123,
    num_lock: 144,
    scroll_lock: 145,
    semi_colon: 186,
    equal_sign: 187,
    comma: 188,
    dash: 189,
    period: 190,
    forward_slash: 191,
    grave_accent: 192,
    open_bracket:219,
    back_slash: 220,
    close_bracket: 221,
    single_quote:222
}


