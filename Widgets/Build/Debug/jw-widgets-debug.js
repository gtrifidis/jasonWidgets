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
     * Swap dom elements places.
     * @param {any[]} array - Array that contains items.
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
    JW_EVENT_ON_HIDE:"onHide",
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
    JW_BUTTON : "jw-button",
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
    JW_GRID_GROUPING_MESSAGE:"jw-grouping-message",
    JW_GRID_HEADER : "jw-grid-header",
    JW_GRID_HEADER_CELL_CAPTION_CONTAINER : "jw-header-cell-caption",
    JW_GRID_HEADER_CELL_ICON_CONTAINER : "jw-header-cell-icon",
    JW_GRID_HEADER_CONTAINER : "jw-grid-header-container",
    JW_GRID_HEADER_CONTAINER_NO_GROUPING : "no-grouping",
    JW_GRID_HEADER_JW_TABLE_CONTAINER : "jw-grid-header-table-container",
    JW_GRID_JW_TABLE_ALT_ROW_CLASS : "row-alt",
    JW_GRID_JW_TABLE_CELL_CLASS : "jw-grid-cell",
    JW_GRID_JW_TABLE_CELL_CONTENT_CONTAINER_CLASS : "jw-grid-cell-content",
    JW_GRID_JW_TABLE_GROUP_ROW_CLASS : "group-row",
    JW_GRID_JW_TABLE_NO_DATA_ROW_CLASS: "jw-grid-no-data-row",
    JW_GRID_JW_TABLE_ROW_CLASS : "jw-grid-row",
    JW_GRID_SELECTED_CELL_CLASS : "cell-selected",
    JW_GRID_SELECTED_ROW_CLASS: "row-selected",
    JW_GRID_REMOVE_GROUP_BUTTON: "jw-grid-remove-grouping",
    JW_HAS_ARROW: "has-arrow",
    JW_HAS_CHECKBOX: "has-checkbox",
    JW_HAS_ICON: "has-icon",
    JW_JW_GRID_FILTER_BUTTON_APPLY : "apply-filter",
    JW_JW_GRID_FILTER_BUTTON_CLEAR : "clear-filter",
    JW_LABEL: "jw-label",
    JW_INVALID :"jw-invalid",
    JW_MENU_CLASS : "jw-menu",
    JW_MENU_CONTAINER_CLASS : "jw-menu-container",
    JW_MENU_HORIZONTAL : "horizontal",
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
    JW_ICON = "jw-icon ";
/**
 * @readonly
 * @enum {string}
 * @memberOf Globals
 * @description Icon class names, used by JasonWidgets.
 */
jw.DOM.icons = {
    CALENDAR: JW_ICON + "calendar32x32",
    CHEVRON_DOWN: JW_ICON + "chevron_down32x32",
    CHEVRON_UP: JW_ICON + "chevron_up32x32",
    CHEVRON_LEFT: JW_ICON + "chevron_left32x32",
    CHEVRON_RIGHT: JW_ICON + "chevron_right32x32",
    CIRCLE_ARROW_DOWN: JW_ICON + "circle_arrow_down32x32",
    CIRCLE_ARROW_UP: JW_ICON + "circle_arrow_up32x32",
    CIRCLE_ARROW_LEFT: JW_ICON + "circle_arrow_left32x32",
    CIRCLE_ARROW_RIGHT: JW_ICON + "circle_arrow_right32x32",
    CIRCLE_CHOOSE: JW_ICON + "circle_choose32x32",
    CIRCLE_MINUS: JW_ICON + "circle_minus32x32",
    CIRCLE_PLUS: JW_ICON + "circle_plus32x32",
    CLOCK : JW_ICON + "clock32x32",
    CLOSE: JW_ICON + "close32x32",
    CLOSE_24x24:JW_ICON + "close24x24",
    FILTER: JW_ICON + "filter32x32",
    LIST: JW_ICON + "list32x32",
    MINUS: JW_ICON + "minus32x32",
    PLUS: JW_ICON + "plus32x32",
    REMOVE_SORT: JW_ICON + "remove-sorting32x32",
    REMOVE_FILTER: JW_ICON + "remove-filter32x32",
    SEARCH: JW_ICON + "search32x32",
    SETTINGS : JW_ICON + "settings32x32",
    SIGNAL: JW_ICON + "singal32x32",
    SORT_ASC: JW_ICON + "sort_asc32x32",
    SORT_DESC: JW_ICON + "sort_desc32x32",
    CHEVRON_DOWN16x16: JW_ICON + "chevron_down16x16",
    CHEVRON_UP16x16: JW_ICON + "chevron_up16x16",
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



/**
 * HTML factory, creating HTML for widgets.
 * @constructor
 * @description A common helper class that generates HTML for different jason widgets.
 * @memberOf Common
 */
function jasonHTMLFactory() {
    /**
     * Creates the HTML for a jwButton.
     * @param {string=} caption - Button caption.
     * @param {string=} iconClass - Icon class name.
     * @param {HTMLElement} buttonElement - An existing element to convert it to a jasonButton.
     */
    jasonHTMLFactory.prototype.createJWButton = function (caption, iconClass, buttonElement) {
        var result = buttonElement ? buttonElement: document.createElement("a");
        result.classList.add(jw.DOM.classes.JW_BUTTON);
        result.setAttribute("href", "javascript:void(0)");

        if (caption != void 0 && caption.trim().length > 0) {
            var captionElement = document.createElement("span");
            captionElement.classList.add(jw.DOM.classes.JW_LABEL);
            captionElement.classList.add(jw.DOM.classes.JW_TEXT_OVERFLOW);
            captionElement.appendChild(document.createTextNode(caption));
            captionElement.setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR, caption);
            result.appendChild(captionElement);
        }
        if (iconClass != void 0 && iconClass.trim().length > 0) {
            var existingIcon = result.querySelectorAll("span.jw-icon")[0];
            if (existingIcon) {
                existingIcon.className = iconClass;
            } else {
                var iconElement = document.createElement("span");
                iconElement.className = iconClass;
                result.appendChild(iconElement);
            }

        }
        return result;
    }
    /**
     * Creates the HTML for a text input styled for jasonWidgets.
     * @param {string=} inputMode - Input mode attribute value.
     * @param {string=} placeHolder - Placeholder attribute value.
     * @param {boolean=} readonly - Readonly attribute value.
     * @param {string=} inputType - Input type.
     */
    jasonHTMLFactory.prototype.createJWTextInput = function (inputMode,placeHolder,readonly,inputType) {
        var result = document.createElement("input");
        result.classList.add(jw.DOM.classes.JW_TEXT_INPUT);
        result.setAttribute(jasonWidgets.DOM.attributes.TYPE_ATTR, "text");
        if (inputType != void 0 && inputType.trim().length > 0)
            result.setAttribute(jasonWidgets.DOM.attributes.TYPE_ATTR, inputType);
        if (inputMode != void 0 && inputMode.trim().length > 0)
            result.setAttribute(jasonWidgets.DOM.attributes.INPUT_MODE_ATTR, inputMode);
        if (placeHolder != void 0 && placeHolder.trim().length > 0)
            result.setAttribute(jasonWidgets.DOM.attributes.PLACEHOLDER_ATTR, placeHolder);
        if (readonly != void 0 && readonly)
            result.setAttribute(jasonWidgets.DOM.attributes.READONLY_ATTR, readonly);

        return result;
    }
    /**
     * Creates the HTML for a checkbox input styled for jasonWidgets.
     */
    jasonHTMLFactory.prototype.createJWCheckBoxInput = function (readonly, title, id) {
        var result = document.createElement("input");
        result.classList.add(jw.DOM.classes.JW_CHECKBOX_INPUT);
        result.setAttribute(jasonWidgets.DOM.attributes.TYPE_ATTR, "checkbox");
        if (readonly != void 0 && readonly)
            result.setAttribute(jasonWidgets.DOM.attributes.READONLY_ATTR, readonly);
        if (title != void 0 && title.trim().length > 0)
            result.setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR, title);
        if (id != void 0 && id.trim().length > 0)
            result.setAttribute(jasonWidgets.DOM.attributes.ID_ATTR, id);

        return result;
    }
    /**
     * Creates the HTML for a jw link Label.
     * @param {string=} caption - Label caption.
     */
    jasonHTMLFactory.prototype.createJWLinkLabel = function (caption) {
        var result = document.createElement("a");
        result.setAttribute("href", "javascript:void(0)");
        result.classList.add(jw.DOM.classes.JW_LABEL);
        result.classList.add(jw.DOM.classes.JW_TEXT_OVERFLOW);
        if (caption != void 0 && caption.trim().length > 0) {
            var captionElement = document.createElement("span");
            captionElement.appendChild(document.createTextNode(caption));
            captionElement.setAttribute(jw.DOM.attributes.TITLE_ATTR, caption);
            result.appendChild(captionElement);
        }

        return result;
    }
    /**
     * Creates the HTML for a jwLabel.
     * @param {string=} caption - Label caption.
     */
    jasonHTMLFactory.prototype.createJWLabel = function (caption) {
        var result = document.createElement("label");
        result.classList.add(jw.DOM.classes.JW_TEXT_OVERFLOW);
        if (caption != void 0 && caption.trim().length > 0) {
            result.setAttribute(jw.DOM.attributes.TITLE_ATTR, caption);
            result.appendChild(document.createTextNode(caption));
        }
        return result;
    }
    /**
     * Creates the HTML for a jwMenuItem.
     * @param {string} [orientation = 'horizontal'] orientation - Parent menu's orientation.
     * @param {object} options - HTML factory menu item creation options.
     * @param {HTMLElement=} element - If provided instead of creating a new element, the element passed will be used.
     */
    jasonHTMLFactory.prototype.createJWMenuItem = function (orientation, options, element) {
        var result = element == void 0 ? document.createElement("li") : element;
        var menuCaption;
        result.classList.add(jw.DOM.classes.JW_MENU_ITEM);

        if (options.clickable)
            result.classList.add(jw.DOM.classes.JW_MENU_ITEM_CLICKABLE);

        if (!options.enabled)
            result.classList.add(jw.DOM.classes.JW_MENU_ITEM_DISABLED);

        result.setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR, options.title)

        if (options.caption != void 0 && options.caption.trim().length > 0) {
            menuCaption = document.createElement("div");
            menuCaption.classList.add(jw.DOM.classes.JW_MENU_ITEM_CAPTION);
            menuCaption.appendChild(jw.htmlFactory.createJWLinkLabel(options.caption));
            menuCaption.classList.add(jw.DOM.classes.JW_TEXT_OVERFLOW);
            menuCaption.classList.add(jw.DOM.classes.JW_MENU_ITEM_CAPTION_ONLY);
            result.appendChild(menuCaption);
        }

        if (options.icon != void 0 && options.icon.trim().length > 0) {
            var iconWrapper = document.createElement("div");
            var iconElement = document.createElement("span");
            iconElement.className = options.icon;
            iconWrapper.classList.add(jw.DOM.classes.JW_MENU_ITEM_ICON);
            iconWrapper.appendChild(iconElement);
            menuCaption.classList.add(jw.DOM.classes.JW_HAS_ICON);
            menuCaption.classList.remove(jw.DOM.classes.JW_MENU_ITEM_CAPTION_ONLY);
            result.appendChild(iconWrapper);

        }

        if (options.hasCheckBox != void 0 && options.hasCheckBox) {
            var checkBoxWrapper = document.createElement("div");
            var checkBox = document.createElement("input");
            checkBox.setAttribute(jasonWidgets.DOM.attributes.TYPE_ATTR, "checkbox");
            checkBox.checked = options.checked;
            checkBoxWrapper.appendChild(checkBox);
            checkBoxWrapper.classList.add(jw.DOM.classes.JW_MENU_ITEM_CHECKBOX);
            menuCaption.classList.add(jw.DOM.classes.JW_HAS_CHECKBOX);
            menuCaption.classList.remove(jw.DOM.classes.JW_MENU_ITEM_CAPTION_ONLY);
            result.appendChild(checkBoxWrapper);
        }


        if (options.caption != void 0 && options.caption.trim().length > 0) {
            result.appendChild(menuCaption);
        }

        if (options.items != void 0 && options.items.length > 0) {
            var arrowWrapper = document.createElement("div");
            //var arrowElement = document.createElement("i");
            var arrowElement = null;// jw.htmlFactory.createJWButton(null, options.level == 0 ? jw.DOM.icons.CHEVRON_RIGHT : jw.DOM.icons.CHEVRON_DOWN);
            var arrowIcon = null;

            if (options.level == 0) {
                arrowIcon = orientation == "horizontal" ? jw.DOM.icons.CHEVRON_DOWN : jw.DOM.icons.CHEVRON_RIGHT;
            } else {
                arrowIcon = orientation == "horizontal" ? jw.DOM.icons.CHEVRON_RIGHT : jw.DOM.icons.JCHEVRON_DOWN;
            }

            arrowElement = jw.htmlFactory.createJWButton(null, arrowIcon);

            jw.common.setData(arrowElement, jw.DOM.attributeValues.JW_MENU_ITEM_DATA_KEY, options);
            menuCaption.classList.add(jw.DOM.classes.JW_HAS_ARROW);
            arrowWrapper.appendChild(arrowElement);
            arrowWrapper.classList.add(jw.DOM.classes.JW_MENU_ITEM_ARROW);
            menuCaption.classList.remove(jw.DOM.classes.JW_MENU_ITEM_CAPTION_ONLY);
            result.appendChild(arrowWrapper);
        }

        return result;
    }
    /**
     * Converts an existing li element to a jwMenuItem element
     * @param {string=} orientation - Parent menu's orientation.
     * @param {HTMLElement} liElement - HTML factory menu item creation options.
     * @param {Menus.jasonMenuItem} [menuItem=undefined] - Menu item instance.
     */
    jasonHTMLFactory.prototype.convertToJWMenuItem = function (orientation, liElement,menuItem) {
        if (liElement != void 0) {
            liElement.classList.add(jw.DOM.classes.JW_MENU_ITEM);
            liElement.classList.add(jw.DOM.classes.JW_MENU_ITEM_CLICKABLE);
            var textNode = jw.common.getNodeText(liElement);
            if (textNode != void 0) {
                menuCaption = document.createElement("div");
                menuCaption.classList.add(jw.DOM.classes.JW_MENU_ITEM_CAPTION);
                menuCaption.appendChild(jw.htmlFactory.createJWLinkLabel(textNode.textContent));
                menuCaption.classList.add(jw.DOM.classes.JW_TEXT_OVERFLOW);
                menuCaption.classList.add(jw.DOM.classes.JW_MENU_ITEM_CAPTION_ONLY);
                liElement.replaceChild(menuCaption, textNode);
                menuItem.caption = textNode.textContent.trim();
                menuItem.name = "mnu_" + menuItem.caption;
            }
            var isReadOnly = liElement.getAttribute(jasonWidgets.DOM.attributes.READONLY_ATTR);
            if (isReadOnly != void 0 && isReadOnly == true) {
                liElement.classList.add(jw.DOM.classes.JW_MENU_ITEM_DISABLED);
            }

            var checkboxes = liElement.getElementsByTagName("input");
            if (checkboxes.length > 0) {
                var checkbox = null;
                for (var i = 0; i <= checkboxes.length - 1; i++) {
                    var typeAttr = checkboxes[i].getAttribute(jw.DOM.attributes.TYPE_ATTR);
                    if (typeAttr && typeAttr.toLowerCase() == "checkbox") {
                        checkbox = checkboxes[i];
                        break;
                    }
                }
                if (checkbox && checkbox.parentNode == liElement) {
                    checkbox.parentNode.removeChild(checkbox);
                    var checkBoxWrapper = document.createElement("div");
                    checkbox.setAttribute(jasonWidgets.DOM.attributes.TYPE_ATTR, "checkbox");
                    checkBoxWrapper.appendChild(checkbox);
                    checkBoxWrapper.classList.add(jw.DOM.classes.JW_MENU_ITEM_CHECKBOX);
                    menuCaption.classList.add(jw.DOM.classes.JW_HAS_CHECKBOX);
                    menuCaption.classList.remove(jw.DOM.classes.JW_MENU_ITEM_CAPTION_ONLY);
                    liElement.appendChild(checkBoxWrapper);
                    menuItem.hasCheckBox = true;
                    menuItem.checkBoxElement = checkbox;
                }
            }
            var hasSubItems = liElement.getElementsByTagName("UL").length > 0;
            if (hasSubItems) {
                var arrowElement = jw.htmlFactory.createJWButton(null, orientation == "horizontal" ? jw.DOM.icons.CHEVRON_RIGHT : jw.DOM.icons.CHEVRON_DOWN);
                var arrowWrapper = document.createElement("div");
                jw.common.setData(arrowElement, jw.DOM.attributeValues.JW_MENU_ITEM_DATA_KEY, menuItem);
                   ////var arrowElement = document.createElement("i");
                //arrowElement.className = orientation == "horizontal" ? jw.DOM.icons.JW_ICON_CHEVRON_RIGHT : jw.DOM.icons.JW_ICON_CHEVRON_DOWN;
                menuCaption.classList.add(jw.DOM.classes.JW_HAS_ARROW);
                arrowWrapper.appendChild(arrowElement);
                arrowWrapper.classList.add(jw.DOM.classes.JW_MENU_ITEM_ARROW);
                liElement.appendChild(arrowWrapper);
            }
        }
    }
    /**
     * Creates a div with a clear-float class CSS.
     */
    jasonHTMLFactory.prototype.createClearFloat = function () {
        var result = document.createElement("div");
        result.classList.add(jw.DOM.classes.JW_CLEAR_FLOAT_CLASS);
        return result;
    }
}

jw.htmlFactory = new jasonHTMLFactory();
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
 * @property {object} localization - Widget's localization configuration.
 * @property {array<Common.ValidationRule} validation - Widget's validation configuration.
  */

/**
 * @class
 * @name jasonValidationRule
 * @description jasonWidgets validation rule.
 * @memberOf Common
 * @property {string} ruleGroup - Validation rule group.
 * @property {string} message - Validation bubble message.
 * @property {string=} title - Validation bubble title.
 * @property {function} validatorFunction - Functions to validate the widget's value.
 * @property {boolean} enabled - When true validation will run.
 * @property {any=} validValue - Value to be passed into the validator function when value is validated. For example a min/max rule would need a limit.
 */

/**
 * Base class for all jasonWidgets
 * @constructor
 * @memberOf Common
 * @description The base class for all jason widgets. It has no UI logic, just the widget's logic.
 * @param {string} [nameSpace = undefined] nameSpace
 * @param {HTMLElement} htmlElement - HTMLElement that the widget will be attached to.
 * @property {boolean} enabled - Gets/sets widget's enabled state.
 * @property {boolean} visible - Gets/sets widget's visible state.
 * @property {boolean} readonly - Gets/sets widget's readonly state.
 */
function jasonBaseWidget(nameSpace, htmlElement,options,uiHelper) {
        this.htmlElement = htmlElement;
        this.nameSpace = nameSpace;
        this._emptyDefaultOptions = { events: [], customization: { dataFieldAttribute : jw.DOM.attributes.DATA_FIELD }, dataIsSimpleJS: true };
        this._enabled = true;
        this._visible = true;
        this._readonly = false;
        this._uid = jw.common.generateUUID();
        this._validationRules = [];
        jw.common._registerWidget(this);
        

        if (this.defaultOptions)
            jasonWidgets.common.extendObject(this._emptyDefaultOptions, this.defaultOptions);
        else
            this.defaultOptions =  this._emptyDefaultOptions;

        if (!options)
            options = {};



        jasonWidgets.common.extendObject(this.defaultOptions, options);

        this._eventListeners = options.events ? options.events : [];
        this._eventListeners.forEach(function (evnt) {
            if (evnt.enabled == undefined)
                evnt.enabled = true;
        });
        
        this.options = options;
        this.options.localization = this.options.localization ? this.options.localization : jasonWidgets.localizationManager.currentLanguage;

        this.eventManager = new jasonEventManager();
        this.baseClassName = "jasonWidget";
        if (this.htmlElement) {
            jasonWidgets.common.setData(this.htmlElement, this.nameSpace, this);
            this.htmlElement.classList.add(this.baseClassName);
        }

        

        this.jwProc = this.jwProc.bind(this);
        this.validate = this.validate.bind(this);
        this.ui = typeof uiHelper == "function" ? new uiHelper(this, htmlElement) : new jasonBaseWidgetUIHelper(this);
        this.ui.initialize();

        jw.common.addGlobalEventListener(this.jwProc);

        this.initialize();

        return jasonBaseWidget;
}
/**
 * Widget initialization code.
 * @abstract
 */
jasonBaseWidget.prototype.initialize = function () {
    if (this.options.validation) {
        for (var i = 0; i <= this.options.validation.length - 1; i++) {
            var ruleOptions = this.options.validation[i];
            ruleOptions.widget = this;
            var newValidationRule = new jasonValidationRule(this.options.validation[i]);
            this._validationRules.push(newValidationRule);
            var validationGroup = new jasonValidationRuleGroup(this.options.validation[i].ruleGroup);
            newValidationRule.ruleGroup = validationGroup.name;
            jw.validationManager.addValidationGroup(validationGroup);
            jw.validationManager.addValidationRule(newValidationRule)
        }
    }
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
        this._eventListeners.push({ eventName: eventName, listener: eventListener, callingContext: callingContext,enabled:true });
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
        case jw.DOM.eventCodes.JGE_REDRAW: {
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
        return eventListener.eventName == eventName && eventListener.listener && eventListener.enabled;
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
 * Enables/Disables all widget's event listeners.
 * @param {boolean} enabled - Event listeners enabled state.
 */
jasonBaseWidget.prototype.enableEventListeners = function (enabled) {
    this._eventListeners.forEach(function (evnt) { evnt.enabled = enabled; });
}

/**
 * Updates the widget options. Descendants will implement this in order for the widgets
 * to dynamically react to option changes.
 * @abstract
 * @param {object} options - Widget's options object.
 */
jasonBaseWidget.prototype.updateOptions = function (options) {

}
/**
 * Run validation if configured.
 */
jasonBaseWidget.prototype.validate = function () {
    if (this.readonly || !this.enabled)
        return;
    if (this._validationRules.length > 0) {
        var validationResult = false;
        for (var i = 0; i <= this._validationRules.length - 1; i++) {
            validationResult = this._validationRules[i].validate();
            if (!validationResult)
                break;
        }
        if (!validationResult)
            this.htmlElement.classList.add(jw.DOM.classes.JW_INVALID);
        else
            this.htmlElement.classList.remove(jw.DOM.classes.JW_INVALID);
    }
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
Object.defineProperty(jasonBaseWidget.prototype, "readonly", {
    get: function () {
        return this._readonly;
    },
    set: function (value) {
        this._readonly = value;
        this.ui._setReadOnly(this._readonly);
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
 * @abstract
 */
jasonBaseWidgetUIHelper.prototype.initialize = function () {
    this.initializeTemplates();
    this.renderUI();
    this.initializeEvents();
}
/**
 * Initialization of widget's UI events.
 * @abstract
 */
jasonBaseWidgetUIHelper.prototype.initializeEvents = function () {

}
/**
 * Initialization of widget's customization templates.
 * @abstract
 */
jasonBaseWidgetUIHelper.prototype.initializeTemplates = function () {

}
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
 * Updates UI when enable/disable state is changed.
 * @abstract
 */
jasonBaseWidgetUIHelper.prototype.updateEnabled = function (enable) {

}
/**
 * Updates UI when visible state is changed.
 * @abstract
 */
jasonBaseWidgetUIHelper.prototype.updateVisible = function (visible) {

}
/**
 * Updates UI when readonly state is changed.
 * @abstract
 */
jasonBaseWidgetUIHelper.prototype.updateReadOnly = function (readonly) {

}
/**
 * Sets the widgets enabled state.
 * @ignore
 * @param {boolean} enable - enabled value
 */
jasonBaseWidgetUIHelper.prototype._setEnable = function (enable) {
    if (this.htmlElement) {
        if (enable)
            this.htmlElement.classList.remove(jw.DOM.classes.JW_DISABLED);
        else
            this.htmlElement.classList.add(jw.DOM.classes.JW_DISABLED);
        this.updateEnabled(enable);
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
        this.updateVisible(visible);
    }
}
/**
 * Sets the widgets readonly state.
 * @ignore
 * @param {boolean} readonly - readonly value
 */
jasonBaseWidgetUIHelper.prototype._setReadOnly = function (readonly) {
    if (this.htmlElement) {
        if (readonly)
            this.htmlElement.classList.add(jw.DOM.classes.JW_READONLY);
        else
            this.htmlElement.classList.remove(jw.DOM.classes.JW_READONLY);
        this.updateReadOnly(readonly);
    }
}
/*
 * Source code in this file is part of the d3 library
 * https://github.com/mbostock/d3
 * Copyright (c) 2010-2015, Michael Bostock
 * All rights reserved.
 */
jw.data = {};

jw.data.map = function (object, f) {
    var map = new jw_Map();
    if (object instanceof jw_Map) {
        object.forEach(function (key, value) {
            map.set(key, value);
        });
    } else if (Array.isArray(object)) {
        var i = -1, n = object.length, o;
        if (arguments.length === 1) while (++i < n) map.set(i, object[i]); else while (++i < n) map.set(f.call(object, o = object[i], i), o);
    } else {
        for (var key in object) map.set(key, object[key]);
    }
    return map;
};
function jw_Map() {
    this._ = Object.create(null);
}
var jw_map_proto = "__proto__", jw_map_zero = "\x00";
jw_class(jw_Map, {
    has: jw_map_has,
    get: function (key) {
        return this._[jw_map_escape(key)];
    },
    set: function (key, value) {
        return this._[jw_map_escape(key)] = value;
    },
    remove: jw_map_remove,
    keys: jw_map_keys,
    values: function () {
        var values = [];
        for (var key in this._) values.push(this._[key]);
        return values;
    },
    entries: function () {
        var entries = [];
        for (var key in this._) entries.push({
            key: jw_map_unescape(key),
            value: this._[key]
        });
        return entries;
    },
    size: jw_map_size,
    empty: jw_map_empty,
    forEach: function (f) {
        for (var key in this._) f.call(this, jw_map_unescape(key), this._[key]);
    }
});
function jw_map_escape(key) {
    return (key += "") === jw_map_proto || key[0] === jw_map_zero ? jw_map_zero + key : key;
}
function jw_map_unescape(key) {
    return (key += "")[0] === jw_map_zero ? key.slice(1) : key;
}
function jw_map_has(key) {
    return jw_map_escape(key) in this._;
}
function jw_map_remove(key) {
    return (key = jw_map_escape(key)) in this._ && delete this._[key];
}
function jw_map_keys() {
    var keys = [];
    for (var key in this._) keys.push(jw_map_unescape(key));
    return keys;
}
function jw_map_size() {
    var size = 0;
    for (var key in this._)++size;
    return size;
}
function jw_map_empty() {
    for (var key in this._) return false;
    return true;
}

function jw_class(ctor, properties) {
    for (var key in properties) {
        Object.defineProperty(ctor.prototype, key, {
            value: properties[key],
            enumerable: false
        });
    }
}
jw.data.nest = function () {
    var nest = {}, keys = [], sortKeys = [], sortValues, rollup;
    function map(mapType, array, depth) {
        if (depth >= keys.length) return rollup ? rollup.call(nest, array) : sortValues ? array.sort(sortValues) : array;
        var i = -1, n = array.length, key = keys[depth++], keyValue, object, setter, valuesByKey = new jw_Map(), values;
        while (++i < n) {
            object = array[i];
            keyValue = key.field ? object[key.field] : key.callBack(object);
            if (values = valuesByKey.get(keyValue)) {
                values.push(object);
            } else {
                valuesByKey.set(keyValue, [object]);
            }
        }
        if (mapType) {
            object = mapType();
            setter = function (keyValue, values) {
                object.set(keyValue, map(mapType, values, depth));
            };
        } else {
            object = {};
            setter = function (keyValue, values) {
                object[keyValue] = map(mapType, values, depth);
            };
        }
        valuesByKey.forEach(setter);
        return object;
    }
    function entries(map, depth) {
        if (depth >= keys.length) return map;
        var array = [], sortKey = sortKeys[depth++];
        map.forEach(function (key, keyMap) {
            array.push({
                key: key,
                values: entries(keyMap, depth),
                level:depth - 1
            });
        });
        return sortKey ? array.sort(function (a, b) {
            return sortKey(a.key, b.key);
        }) : array;
    }
    nest.map = function (array, mapType) {
        return map(mapType, array, 0);
    };
    nest.entries = function (array) {
        return entries(map(jw.data.map, array, 0), 0);
    };
    nest.key = function (callBack,field) {
        keys.push({callBack:callBack,field:field});
        return nest;
    };
    nest.sortKeys = function (order) {
        sortKeys[keys.length - 1] = order;
        return nest;
    };
    nest.sortValues = function (order) {
        sortValues = order;
        return nest;
    };
    nest.rollup = function (f) {
        rollup = f;
        return nest;
    };
    return nest;
};
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @namespace Data
 * @description Data related classes.
 */

/**
 * @class
 * @name jasonDataSourceSorting
 * @description Datasource sorting configuration item.
 * @memberOf Data
 * @description Object representation of a datasource sorting configuration. A datasource supports multiple sorting configurations.
 * @property {string} name - field name for the sort.
 * @property {boolean} reverse - false = asc , true = desc.
 * @property {function} primer - if set, it will be used to convert the field value to another data type suitable for comparison.
 */
function jasonDataSourceSorting(name,reverse,primer) {
    this.name = name;
    this.reverse = reverse;
    this.primer = primer;
}

/**
 * @constructor
 * @description Data wrapper that provides search, filter and sorting capabilities over a data array.
 * @memberOf Data
 * @param {array} data - Any array of data,either prime type array or object array.
 */
function jasonDataSource(options) {
    this.defaultOptions = {
        data: null,
        onChange: null,
        onSort: null,
        onGroup:null
    };
    jasonWidgets.common.extendObject(this.defaultOptions, options);
    this.options = options;
    this.data = options.data;
    this.processData();
    this.currentDataView = [].concat(this.data);
    this.grouping = [];
    this.dictionaries = [];
    this.filters = [];
    this.sorting = [];
    this.datesAreEqual = this.datesAreEqual.bind(this);
    this.valuesAreEqual = this.valuesAreEqual.bind(this);
    this.valuesAreNotEqual = this.valuesAreNotEqual.bind(this);
    this.valueContains = this.valueContains.bind(this);
    this.valueEndsWith = this.valueEndsWith.bind(this);
    this.valueIsGreaterEqualThan = this.valueIsGreaterEqualThan.bind(this);
    this.valueIsGreaterThan = this.valueIsGreaterThan.bind(this);
    this.valueIsLessEqualThan = this.valueIsLessEqualThan.bind(this);
    this.valueIsLessThan = this.valueIsLessThan.bind(this);
}
/**
 * Set datasource's data.
 * @param {array} data - Array of data.
 */
jasonDataSource.prototype.setData = function (data) {
    this.data = data;
    this.processData();
    if (this.options.onChange)
        this.options.onChange();
}
/**
 * Check if two date values are equal or not.
 * @ignore
 */
jasonDataSource.prototype.datesAreEqual = function (value1, value2) {
    return jw.common.dateComparison(value1, value2) == jw.enums.comparison.equal;
}
/**
 * Check if two date values are not equal.
 * @ignore
 */
jasonDataSource.prototype.datesAreNotEqual = function (value1, value2) {
    return !this.datesAreEqual(value1, value2);
}
/**
 * Check if field value is equal to a filter value.
 * @ignore
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to compare against.
 * @returns {boolean}
 */
jasonDataSource.prototype.valuesAreEqual = function (fieldValue, filterValue) {
    return filterValue == fieldValue;
}
/**
 * Returns true if field value does not equal filter value
 * @ignore
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to compare against. 
 * @returns {boolean}
 */
jasonDataSource.prototype.valuesAreNotEqual = function (filterValue, fieldValue) {
    return !this.valuesAreEqual(filterValue, fieldValue);
}
/**
 * Returns true if field value is less than filter value.
 * @ignore
 * @param {any} filterValue - value to compare
 * @param {any} fieldValue - value to compare against 
 * @returns {boolean}
 */
jasonDataSource.prototype.valueIsLessThan = function (fieldValue, filterValue) {
    return fieldValue < filterValue;
}
/**
 * Returns true if field value is less-equal than filter value.
 * @ignore
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to compare against. 
 * @returns {boolean}
 */
jasonDataSource.prototype.valueIsLessEqualThan = function (fieldValue, filterValue) {
    return fieldValue <= filterValue;
}
/**
 * Returns true if field value is greater than filter value.
 * @ignore
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to compare against. 
 * @returns {boolean}
 */
jasonDataSource.prototype.valueIsGreaterThan = function (fieldValue, filterValue) {
    return fieldValue > filterValue;
}
/**
 * Returns true if field value is greater-equal than filter value.
 * @ignore
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to compare against.
 * @returns {boolean} 
 */
jasonDataSource.prototype.valueIsGreaterEqualThan = function (fieldValue, filterValue) {
    return fieldValue >= filterValue;
}
/**
 * Returns true if field value starts with filter value.
 * @ignore
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to search. 
 * @returns {boolean}
 */
jasonDataSource.prototype.valueStartsWith = function (fieldValue, filterValue) {
    return fieldValue.indexOf(filterValue) == 0;
}
/**
 * Returns true if field value ends with filter value.
 * @ignore
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to search.
 * @returns {boolean} 
 */
jasonDataSource.prototype.valueEndsWith = function (fieldValue, filterValue) {
    var startingIndex = fieldValue.length - filterValue.length;
    return fieldValue.indexOf(filterValue,startingIndex) == startingIndex;
}
/**
 * Returns true if value is contained in the field
 * @ignore
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to search.
 * @returns {boolean} 
 */
jasonDataSource.prototype.valueContains = function (fieldValue, filterValue) {
    return fieldValue.indexOf(filterValue) >= 0;
}
/**
 * Extends data properties if underlying data is an object array.
 * @param {array} data - Array of data.
 */
jasonDataSource.prototype.processData = function (data) {
    var dataToProcess = !data ? this.data : data;
    if (dataToProcess) {
        var dataRow = null;
        for (var i = 0; i <= dataToProcess.length - 1; i++) {
            dataRow = dataToProcess[i];
            if (typeof dataRow === "object") {
                dataRow._jwRowId = i;
            }
        }
    }
}
/**
 * Default sort comparison function.
 * @param {any} value1 - value to compare.
 * @param {any} value2 - value to compare against.
 * @returns {boolean} 
 */
jasonDataSource.prototype.defaultSortComparison = function (value1, value2) {
    if (value1 == value2) return 0;
    return value1 < value2 ? -1 : 1;
}
/**
 * Default sort comparison function with data type conversion. It will use the {@link Data.jasonDataSource#defaultSortComparison} to perform the actual comparison
 * but will convert parameter using a data conversion function if provided. Can also dictate the direction of the comparison, asc or desc.
 * 
 * @param {function} primer - function that will convert passed in value to a data type.
 * @param {boolean} [reverse=false] - if true, it will sort descending.
 * @returns {function} Returns function that does sort comparison and if applicable, data type conversion.
 */
jasonDataSource.prototype.dataTypeSortComparison = function (primer,reverse) {
    var defaultSort = this.defaultSortComparison;
    var dataTypeComparison = defaultSort;
    if (primer) {
        dataTypeComparison = function (value1, value2) {
            return defaultSort(primer(value1), primer(value2));
        };
    }
    if (reverse == true) {
        return function (value1, value2) {
            return -1 * dataTypeComparison(value1, value2);
        };
    }
    return dataTypeComparison;
}
/**
 * Adds sorting configuration to the datasource.
 * @property {Data.jasonDataSourceSorting} sortingConfiguration - sorting to add.
 * @property {boolean} [sort=false] - if true, sort now.
 * @returns {object[]|void}
 */
jasonDataSource.prototype.addSorting = function (sortingConfiguration, sortNow) {
    sortNow = sortNow != undefined ? sortNow : true;
    var existingSorting = this.sorting.filter(function (sortingField) {
        return sortingField.name == sortingConfiguration.name;
    })[0];
    if (!existingSorting) {
        this.sorting.push(sortingConfiguration);
    } else
        existingSorting.reverse = sortingConfiguration.reverse;
    if (sortNow == true)
       return this.sort(this.sorting, this.currentDataView);
}
/**
 * Removes sorting for a field.
 * @param {string} fieldName - Fieldname of which to remove sorting.
 */
jasonDataSource.prototype.removeSorting = function (fieldName) {
    var existingSorting = this.sorting.filter(function (sortingField) {
        return sortingField.name == sortingConfiguration.name;
    })[0];
    if (existingSorting) {
        var idx = this.sorting.indexOf(existingSorting);
        this.sorting.splice(idx, 1);
        if (this.sorting.length == 0) {
            this.currentDataView = [].concat(this.data);
        } else {
            this.applySort();
        }
    }
}
/**
 * Applies current sorting configuration.
 */
jasonDataSource.prototype.applySort = function () {
    this.sort();
}
/**
 * Clears all sorting.
 */
jasonDataSource.prototype.clearSorting = function () {
    this.sorting = [];
    if (this.filters.length == 0)
        this.currentDataView = [].concat(this.data);
    else
        this.applyFilters();
}
/**
 * Returns a sorted array of data based on fields to sort. Supports multiple field sorting with the possibility to apply separate sorting
 * directions per sorting field. Default field sort direction is asc.
 * @param {array} fieldsToSort - Elements can be field names or objects defining sorting direction and/or data type converting function. See {@link Data.jasonDataSource#dataTypeSortComparison}
 * @param {any[]} [data=[]] - If not provided, the underlying Data array will be used.
 * @returns {object[]}
 */
jasonDataSource.prototype.sort = function (fieldsToSort,data) {
    var dataToSort = data ? data : [].concat(this.data);
    var sortingFields = [],
        sortingField, name, reverse, comparisonFunction;
    if (fieldsToSort) {
        for (var i = 0; i <= fieldsToSort.length - 1; i++) {
            if (typeof fieldsToSort[i] == "string")
                this.addSorting(fieldsToSort[i], false);
        }
    }
    // preprocess sorting options
    for (var i = 0; i <= this.sorting.length - 1; i++) {
        sortingField = this.sorting[i];
        if (typeof sortingField === 'string') {
            name = sortingField;
            comparisonFunction = default_cmp;
        }
        else {
            name = sortingField.name;
            comparisonFunction = this.dataTypeSortComparison(sortingField.primer, sortingField.reverse);
        }
        sortingFields.push({
            name: name,
            compare: comparisonFunction
        });
    }

    var resultData = dataToSort.sort(function (priorItem, nextItem) {
        var result;
        for (var i = 0; i <= sortingFields.length - 1; i++) {
            result = 0;
            sortingField = sortingFields[i];
            name = sortingField.name;

            result = sortingField.compare(priorItem[name], nextItem[name]);
            if (result !== 0) break;
        }
        return result;
    });
    this.currentDataView = [].concat(resultData);
    return this.currentDataView;
}
/**
 * Filter values for a specific field. Retuns an array containing the data matching the filter parameters.
 * @param {array} filterValues - Array of objects containing value to filter plus logical connection operators and evaluator operators.
 * @param {string} filterField - Fieldname to filter.
 * @param {any[]} [data=[]] - If not provided, the underlying Data array will be used.
 * @param {boolean} [caseSensitive=false] - When true, search will be case sensitive.
 * @returns {object[]}
 */
jasonDataSource.prototype.filter = function (filterValues, filterField,data, caseSensitive) {
    var dataToFilter = data ? data : this.data;
    var resultData = [];
    caseSensitive = jasonWidgets.common.assigned(caseSensitive) ? caseSensitive : false;

    for (var i = 0; i <= filterValues.length - 1; i++) {
        var filterClause = filterValues[i].filterClause;
        var filterEvaluatorClause = null;
        if (filterClause) {
            switch (filterClause.symbol) {
                case "=": { filterEvaluatorClause = jw.common.getVariableType(filterValues[i].value) == jw.enums.dataType.date ? this.datesAreEqual : this.valuesAreEqual; break; }
                case ">": { filterEvaluatorClause = this.valueIsGreaterThan; break; }
                case "<": { filterEvaluatorClause = this.valueIsLessThan; break; }
                case ">=": { filterEvaluatorClause = this.valueIsGreaterEqualThan; break; }
                case "<=": { filterEvaluatorClause = this.valueIsLessEqualThan; break; }
                case "!=": { filterEvaluatorClause = jw.common.getVariableType(filterValues[i].value) == jw.enums.dataType.date ? this.datesAreNotEqual : this.valuesAreNotEqual; break; }
                case "startsWith": { filterEvaluatorClause = this.valueStartsWith; break; }
                case "endsWith": { filterEvaluatorClause = this.valueEndsWith; break; }
                case "contains": { filterEvaluatorClause = this.valueContains; break; }
            }
            filterValues[i].evaluator = filterEvaluatorClause;
        }
     }
        var valueInFilter = false;
        for (var i = 0; i <= dataToFilter.length - 1; i++) {
            var dataRow = dataToFilter[i];
            var fieldValue = dataRow[filterField];
            if(typeof fieldValue == "string")
                fieldValue = caseSensitive ? fieldValue : fieldValue.toLowerCase();
            for (var x = 0; x <= filterValues.length - 1; x++) {
                var filterValue = filterValues[x];
                var valueOfFilter = filterValue.value;
                if (typeof valueOfFilter == "string")
                    valueOfFilter = caseSensitive ? valueOfFilter : valueOfFilter.toLowerCase();
                var priorFilterValue = filterValues[x - 1];
                if (priorFilterValue) {
                    //null is an acceptable value. That's why we only check for undefined.
                    if (valueOfFilter == undefined)
                        break;
                    var chainlogicalOperator = priorFilterValue.logicalOperator ? priorFilterValue.logicalOperator.operator : 'or';
                    switch (chainlogicalOperator) {
                        case "and": {
                            valueInFilter = valueInFilter && (filterValue.evaluator(fieldValue, valueOfFilter));
                            break;
                        }
                        case "or": {
                            valueInFilter = valueInFilter || (filterValue.evaluator(fieldValue, valueOfFilter));
                            break;
                        }
                    }
                } else {
                    if (filterValue.evaluator)
                        valueInFilter = filterValue.evaluator(fieldValue, valueOfFilter);
                }
            }
            if (valueInFilter) {
                resultData.push(dataRow);
                valueInFilter = false;
            }
        }
        this.currentDataView = [].concat(resultData);
        return this.currentDataView;
}
/**
 * Add a filter.
 * @param {string} filterField - Field to filter.
 * @param {string} filterValues - Filter values.
 * @param {boolean} [filterNow=false] - If true, it will apply filter.
 * @returns {object[]|void}
 */
jasonDataSource.prototype.addFilter = function (filterField, filterValues, filterNow) {
    filterNow = filterNow == void 0 ? false : filterNow;
    var existingFilter = this.filters.filter(function (filter) { return filter.filterField == filterField; })[0];
    var dataToFilter = this.data;
    if (!existingFilter) {
        //creating filter
        existingFilter = { filterValues: filterValues, filterField: filterField };
        this.filters.push(existingFilter);
    }
    else {
        existingFilter.filterValues = filterValues;
    }
    if (filterNow)
        return this.filter(filterValues, filterField, dataToFilter);
}
/**
 * Removes applied filter for the field.
 * @param {string} filterField - Field name.
 */
jasonDataSource.prototype.removeFilter = function (filterField) {
    var filterIndexToDelete = -1;
    var filterToDelete = this.filters.filter(function (filter, filterIndex) {
        var result = filter.filterField == filterField;
        if (result) {
            filterIndexToDelete = filterIndex;
            return filter;
        }
    })[0];
    //remove the filter from the array of filters.
    if (filterToDelete) {
        this.filters.splice(filterIndexToDelete, 1);
    }
    if (this.filters.length > 0) {
        this.currentDataView = [].concat(this.data);
        for (var i = 0; i <= this.filters.length - 1; i++) {
            var filter = this.filters[i];
            this.filter(filter.filterValues, filter.filterField, this.currentDataView);
        }
    } else {
        this.currentDataView = [].concat(this.data);
    }
}
/**
 * Applies all filters.
 */
jasonDataSource.prototype.applyFilters = function () {
    var dataToFilter;
    for (var i = 0; i <= this.filters.length - 1; i++) {
        var filter = this.filters[i];
        if (i == 0) {
            dataToFilter = this.filter(filter.filterValues, filter.filterField, this.data);
        } else {
            dataToFilter = this.filter(filter.filterValues, filter.filterField, dataToFilter);
        }
    }
    return this.currentDataView;
}
/**
 * Clears all filters.
 */
jasonDataSource.prototype.clearFilters = function () {
    this.filters = [];
    if (this.sorting.length == 0)
        this.currentDataView = [].concat(this.data);
    else
        this.sort();
}
/**
 * Linear search for a search value across the data across fields.
 * @param {string} searchValue - Value to search.
 * @param {any[]} [data=[]] - If not provided, the underlying Data array will be used.
 * @param {boolean} [caseSensitive=false] - When true, search will be case sensitive.
 * @returns {object[]}
 */
jasonDataSource.prototype.search = function (searchValue, data, caseSensitive) {
    var dataToSearch = data ? data : [].concat(this.data);
    var resultData = [];
    searchValue = caseSensitive ? searchValue : searchValue.toLowerCase();
    for (var i = 0; i <= dataToSearch.length - 1; i++) {
        var dataRow = dataToSearch[i];
        for (var fld in dataRow) {
            if (typeof dataRow[fld] === "string") {
                var dataFieldValue = dataRow[fld].toLowerCase();
                if (dataFieldValue.indexOf(searchValue) >= 0) {
                    //if one field satisfies the search, there is not need to continue the search.
                    resultData.push(dataRow);
                    break;
                }
            }
        }
    }
    this.currentDataView = [].concat(resultData);
    return this.currentDataView;
}
/**
 * Linear search for a search value across the data on a specific field.
 * @param {string} searchValues - Values to search. The search values are paired with the fields, meaning that the arrays must have the same length. If the data are of "string" type then the searchValues array can only have one item.
 * @param {string[]} fields - Fields to search on. 
 * @param {any[]} [data=[]] - If not provided, the underlying Data array will be used.
 * @param {boolean} [caseSensitive=false] - When true, search will be case sensitive.
 * @param {boolean} [strict=true] - When true, search will yield results using an "and" logical clause, meaning that each search value must be found in the corresponding field. When false the "or" logical clause will be used.
 * @returns {object[]}
 */
jasonDataSource.prototype.searchByField = function (searchValues, fields, data, caseSensitive, strict) {
    if (caseSensitive == void 0 )
        caseSensitive = false;
    if (strict == void 0)
        strict = true;
    var dataToSearch = data ? data : [].concat(this.data);
    var resultData = [];
    var fieldValues = [];
    searchValues.forEach(function (searchValue,index) {
        searchValues[index] = caseSensitive ? searchValue : searchValue.toLowerCase();
    });
    for (var i = 0; i <= dataToSearch.length - 1; i++) {
        var dataRow = dataToSearch[i];
        if (typeof dataRow == "string") {
            var dataRowValue = caseSensitive ? dataRow : dataRow.toLowerCase();
            if (dataRowValue.indexOf(searchValues[0]) >= 0)
                resultData.push(dataRow);
        } else {
            if (fields === void 0)
                jw.common.throwError(jw.errorTypes.referenceError, "Search fields are not defined");
            var found = null;
            for (var x = 0; x <= fields.length - 1; x++) {
                if (typeof dataRow[fields[x]] === "string") {
                    var dataRowValue = caseSensitive ? dataRowValue : dataRow[fields[x]].toLowerCase();
                    if (strict) {
                        if (found == null) {
                            found = dataRowValue.indexOf(searchValues[x]) >= 0;
                        } else {
                            if (searchValues[x] != void 0)
                                found = found && dataRowValue.indexOf(searchValues[x]) >= 0;
                        }
                    }
                    else {
                        if (dataRowValue.indexOf(searchValues[x]) >= 0)
                            resultData.push(dataRow);
                    }
                }
            }
            if (strict && found) {
                resultData.push(dataRow);
            }
        }
    }
    this.currentDataView = [].concat(resultData);
    return this.currentDataView;
}
/**
 * Groups data based on the grouping field.
 * if there is already a grouping, an extra level will be added.
 * @property {string} field - Field to group by.
 * @property {array=} data - Data to group.
 * @property {boolean} [groupNow=false] - If true, grouping will execute immediately.
 * @retuns {object[]}
 */
jasonDataSource.prototype.groupByField = function (field, data,groupNow) {
    var dataToGroup = data ? data : [].concat(this.data);
    var groupingExists = this.groupingExists(field);
    this.groupedData = [];
    if (!groupingExists) {
        var newGrouping = { field: field, level: this.grouping.length };
        this.grouping.push(newGrouping);
    }
    if (groupNow)
        this.groupData();
}
/**
 * Groups data based on the datasource's current grouping configuration.
 * @param {array=} data - Data to group.
 * @returns {object[]}
 */
jasonDataSource.prototype.groupData = function (data) {
    var dataToGroup = data ? data : [].concat(this.data);
    if (!this.grouperDataSource)
        this.grouperDataSource = new jasonDataSource({ data: dataToGroup });
    this.grouperDataSource.clearSorting();
    for (var i = 0; i <= this.grouping.length - 1; i++) {
        var grouping = this.grouping[i];
        this.grouperDataSource.addSorting({ name: grouping.field, reverse: false }, false);
    }
    dataToGroup = this.grouperDataSource.sort();
    var self = this;
    var dataGroupper = new jw.data.nest();
    var keyFunctions = [];
    for (var i = 0; i <= this.grouping.length - 1; i++) {
        dataGroupper.key(null, self.grouping[i].field);
    }
    return dataGroupper.entries(dataToGroup);
}
/**
 * Checks for an existing grouping.
 * @param {string} field - Field name.
 * @returns {boolean}
 */
jasonDataSource.prototype.groupingExists = function (field) {
    return this.grouping.filter(function (grouping) { return grouping.field == field }).length > 0;
}
/**
 * Removes grouping.
 * @param {Data.jasonDataSourceGrouping} grouping - Grouping to remove.
 */
jasonDataSource.prototype.removeGrouping = function (grouping) {
    var indexToRemove = -1;
    this.grouping.filter(function (dataGrouping, dataGroupingIndex) {
        if (dataGrouping.field == grouping.field) {
            indexToRemove = dataGroupingIndex;
            return true;
        }
    })[0];
    this.grouping.splice(indexToRemove, 1);
    this.groupData();
}
/**
 * Returns a slice of the datasource's data and applies any grouping if applicable.
 * @property {number} start - starting index.
 * @property {number} stop - stoping index.
 * @returns {object[]} Returns array of data.
 */
jasonDataSource.prototype.range = function (start, stop) {
    var result = this.currentDataView.slice(start, stop + 1);
    if(this.grouping.length > 0)
        result = this.groupData(result);
    return result;
}
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/**
 * jasonWidgets Event Manager
 * @constructor
 * @description Auxilary class that manages events for the widgets.
 * @memberOf Common
 */
function jasonEventManager() {
    this.eventListeners = new Array();
    jasonEventManager.prototype.mouseEnterLeaveHandler = function (mouseEvent,element) {
        var relatedElement = mouseEvent.relatedTarget;
        if (!relatedElement || (relatedElement !== element && !jasonWidgets.common.contains(element, relatedElement))) {
            var eventName;
            if (mouseEvent.type == "mouseover" || mouseEvent.type == "pointerover")
                eventName = "mouseenter";
            if (mouseEvent.type == "mouseout" || mouseEvent.type == "pointerout")
                eventName = "mouseleave";
            this.triggerEvent(eventName, element, mouseEvent);
        }
    }
    /**
     * Adds an event listener on an element.
     * @param {object} element - HTMLElement. The element to set the event.
     * @param {string} eventName - Name of the event.
     * @param {function} listener - Listener function.
     * @param {boolean} stopPropagation - If true, does not propagate the event.
     */
    jasonEventManager.prototype.addEventListener = function (element, eventName, listener,useCurrentTarget,useCapture) {
        var self = this;
        if (element.nodeType == void 0)
            jw.common.throwError(jw.errorTypes.error, "Element is not a HTMLElement");
        if (!element._jasonWidgetsEventListeners_)
            element._jasonWidgetsEventListeners_ = [];

        if (element._jasonWidgetsEventListeners_.indexOf(eventName) < 0) {
            var defaultEventName = eventName;
            var defaultEventListener = function (event) {
                self.triggerEvent(eventName, useCurrentTarget ? event.currentTarget : event.target, event)
            }
            //var mouseEnterLeaveEventListener = function (event) {
            //    self.mouseEnterLeaveHandler(event, element);
            //}
            //if (eventName == jw.DOM.events.MOUSE_ENTER_EVENT && !jasonWidgets.common.objectHasProperty(window,"onmouseenter")) {
            //    defaultEventListener = mouseEnterLeaveEventListener;
            //    defaultEventName = jw.DOM.events.MOUSE_OVER_EVENT;
            //}

            //if (eventName == jw.DOM.events.MOUSE_LEAVE_EVENT && !jasonWidgets.common.objectHasProperty(window, "onmouseleave")) {
            //    defaultEventListener = mouseEnterLeaveEventListener;
            //    defaultEventName = jw.DOM.events.MOUSE_OUT_EVENT;
            //}
            useCapture = useCapture === void 0 ? false : useCapture;
            element.addEventListener(defaultEventName, defaultEventListener,useCapture);
        }
        var evntListener = {
            element: element,
            eventName: eventName,
            listener: listener,
            enabled: true,
            uid:jw.common.generateUUID()
        };

        this.eventListeners.push(evntListener);
        element._jasonWidgetsEventListeners_.push(evntListener);
        return evntListener.uid;
    }
    /**
     * Triggers an event.
     * @param {string} eventName - Name of the event.
     * @param {object} sender - Event sender. The sender is always the widget that triggered the event.
     */
    jasonEventManager.prototype.triggerEvent = function (eventName, sender, event) {
        var eventListener = this.eventListeners.filter(function (evntListener) {
            return (evntListener.eventName == eventName && evntListener.element == sender && evntListener.enabled)
        })[0];
        if (eventListener) {
            if (typeof eventListener.listener == "function") {
                eventListener.listener(event, sender);
                if (this._debug)
                    console.log(eventListener);
            }
            else
                new Error("event listener is not a function");
        }
    }
        /**
         * Clears all event manager events.
         */
    jasonEventManager.prototype.clearEvents = function () {
        this.eventListeners.forEach(function (evntListener) {
            if (evntListener.element) {
                evntListener.element.removeEventListener(evntListener.eventName, evntListener.listener);
                evntListener.element._jasonWidgetsEventListeners_ = null;
    }
        });
        this.eventListeners =[];

    }



    this.triggerEvent = this.triggerEvent.bind(this);
    this.mouseEnterLeaveHandler = this.mouseEnterLeaveHandler.bind(this);
    this._debug = false;
}

var jwDocumentEventManager = (function () {
    //using the internal listeners array helps us add only one listener to the document element per event
    //but add as many eventlisteners as we want. 
    var eventListeners = [],
        internalListeners = [];
    return {
        addDocumentEventListener: function (eventName, listener) {
            var documentEventListenerExists = internalListeners.filter(function (eventListener) {
                return eventListener.event == eventName;
            })[0];
            var newListener = { event: eventName, listener: listener, enabled: true, uid: jw.common.generateUUID() };
            eventListeners.push(newListener);
            if (!documentEventListenerExists) {
                internalListeners.push(newListener);
                document.addEventListener(eventName, function (documentEvent) {
                    for (var i = 0; i <= eventListeners.length - 1; i++) {
                        if (eventListeners[i].event == documentEvent.type && eventListeners[i].enabled) {
                            eventListeners[i].listener(documentEvent);
                        }
                    }
                });
            }
            return eventListeners[eventListeners.length - 1].uid;
        },
        removeDocumentEventListener: function (uid) {
            for (var i = 0; i <= eventListeners.length - 1; i++) {
                if (eventListeners[i].uid.toLowerCase() == uid.toLowerCase()) {
                    document.removeEventListener(eventListeners[i].event, eventListeners[i].listener);
                    break;
                }
            }
            eventListeners.splice(i, 1);
        },
        enableEventListeners: function (enabled) {
            eventListeners.forEach(function (evnt) { evnt.enabled = enabled; });
        }
    }
}());

var jwWindowEventManager = (function () {
    //using the internal listeners array helps us add only one listener to the window object per event
    //but add as many eventlisteners as we want. 
    var eventListeners = [],
        internalListeners = [],
        running = false,
        resizeEvent = null;
    //runs all event listeners for a resize event.
    var runResizeCallbacks = function () {
        var resizeCallbacks = eventListeners.filter(function (listener) { return listener.event.toLowerCase() == "resize"});
        resizeCallbacks.forEach(function (resizeCallback) {
            resizeCallback.listener(resizeEvent);
        });
        running = false;
    }
    //runs all event listeners for a repaint event.
    var runRepaintCallbacks = function () {
        var repaintCallbacks = eventListeners.filter(function (listener) { return listener.event.toLowerCase() == "repaint" });
        repaintCallbacks.forEach(function (repaintCallback) {
            repaintCallback.listener(resizeEvent);
        });
        running = false;
    }
    //window resize event callback
    var windowResize = function (event) {
        if (!running)
            running = true;
        resizeEvent = event;
        window.requestAnimationFrame(runResizeCallbacks);
    }

    //window resize event callback
    var windowRepaint = function (event) {
        if (!running)
            running = true;
        resizeEvent = event;
        window.requestAnimationFrame(runRepaintCallbacks);
        window.requestAnimationFrame(windowRepaint);
    }

    return {
        addWindowEventListener: function (eventName, listener, useCapture) {
            var windowEventListenerExists = internalListeners.filter(function (eventListener) {
                return eventListener.event == eventName;
            })[0];
            var newListener = { event: eventName, listener: listener, enabled: true, uid: jw.common.generateUUID() };
            eventListeners.push(newListener);
            if (!windowEventListenerExists) {
                internalListeners.push(newListener);

                // if the event is a resize event, then implicitly use optimized code
                // regarding resize event with requestAnimationFrame
                if (eventName.toLowerCase() == "resize" || eventName.toLowerCase() == "repaint") {
                    if (eventName.toLowerCase() == "resize")
                        window.addEventListener(eventName, windowResize, useCapture);
                    else {
                        window.requestAnimationFrame(windowRepaint);
                    }
                        
                } else {
                    window.addEventListener(eventName, function (windowEvent) {
                        for (var i = 0; i <= eventListeners.length - 1; i++) {
                            if (eventListeners[i].event == windowEvent.type && eventListeners[i].enabled) {
                                eventListeners[i].listener(windowEvent);
                            }
                        }
                    }, useCapture);
                }
            }
            return eventListeners[eventListeners.length - 1].uid;
        },
        removeWindowEventListener: function (uid) {
            for (var i = 0; i <= eventListeners.length - 1; i++) {
                if (eventListeners[i].uid.toLowerCase() == uid.toLowerCase()) {
                    window.removeEventListener(eventListeners[i].event, eventListeners[i].listener);
                    break;
                }
            }
            eventListeners.splice(i, 1);
        },
        enableEventListeners: function (enabled) {
            eventListeners.forEach(function (evnt) { evnt.enabled = enabled; });
        }
    }
}());



/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/**
 * @namespace Localization
 * @description
 * 
 * Collection of classes for localizing jasonWidgets.
 */

/**
 * jasonLocalizationManager class to manage localization needs across jasonWidgets.
 * @constructor
 * @description Localization class that manages localization for all jasonWidgets. It holds a list of all registered {@link Localization.jasonWidgetLanguage}
 * and {@link Localization.jasonWidgetCulture}.
 *
 * To register a language or culture, create a js file in which a descendant of {@link Localization.jasonWidgetLanguage} is created and
 * registered.
 *
 * @memberOf Localization
 * @property {Localization.jasonWidgetLanguage} currentLanguage - jasonWidgets current language.
 * @property {Localization.jasonWidgetCulture} currentCulture - jasonWidgets current culture.
 * @property {string} currentLanguageKey - Current language key. Set it on initialization to define the language for jasonWidgets.
 * @property {string} currentCultureKey - Current culture key. Set it on initialization to define the culture for jasonWidgets.
 */
function jasonLocalizationManager() {
    var self = this;
    Object.defineProperty(self, "currentLanguage", {
        get: function () {
            var language = this.languages[this.currentLanguageKey];
            if (!language) {
                if (this.currentLanguageKey.indexOf("-") >= 0) {
                    var splitted = this.currentLanguageKey.split("-");
                    var langKey = splitted[0] + "-" + splitted[1].toLowerCase();
                    if (!language) {
                        langKey = splitted[0] + "-" + splitted[1].toUpperCase();
                        language = this.languages[langKey]
                        if (!language)
                            language = this.languages["en-US"];
                    }
                }
                else {
                    language = this.languages["en-US"];
                }
            }
            return language;
        },
        enumerable: true
    });
    Object.defineProperty(self, "currentCulture", {
        get: function () {
            var culture = this.cultures[this.currentCultureKey];
            if (!culture) {
                if (this.currentCultureKey.indexOf("-") >= 0) {
                    var splitted = this.currentCultureKey.split("-");
                    var cultureKey = splitted[0] + "-" + splitted[1].toLowerCase();
                    if (!culture) {
                        cultureKey = splitted[0] + "-" + splitted[1].toUpperCase();
                        language = this.cultures[cultureKey]
                        if (!culture)
                            culture = this.cultures["en-US"];
                    }
                }
                else {
                    culture = this.cultures["en-US"];
                }
            }
            return culture;
        },
        set: function (newValue) {
            this.currentCultureKey = newValue;
            this.determineDateFormat();
            this.determineTimeFormat();
        },
        enumerable: true
    });
    this.currentLanguageKey = navigator.browserLanguage || navigator.language;
    this.currentCultureKey = navigator.browserLanguage || navigator.language;
    this.languages = {};
    this.cultures = {};
    this.determineDateFormat = function () {
        var result = "";
        var newDate = new Date();
        newDate.setHours(0);
        newDate.setMinutes(0);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        newDate.setYear(1999);
        newDate.setMonth(11);
        newDate.setDate(31);
       
        var dateString = newDate.toLocaleDateString().replace(/\u200E/g, "");
        var nonNumeric = dateString.match(/[^0-9]/g);
        var dateSplitter = nonNumeric[0];
        this.localeDateSeparator = dateSplitter;
        var splitted = dateString.split(dateSplitter);
        for (var i = 0 ; i<= splitted.length - 1; i++) {
            if (splitted[i].length > 2) {
                if (i > 0)
                    result = result + dateSplitter;
                result = result + "yyyy";
            }
            if (splitted[i].length == 2) {
                var numericValue = parseInt(splitted[i]);
                if (numericValue == 12) {
                    if (i > 0)
                        result = result + dateSplitter;
                    result = result + "MM";
                }
                if (numericValue == 31){
                    if (i > 0)
                        result = result + dateSplitter;
                    result = result + "dd";
                }
                if (numericValue == 99){
                    if (i > 0)
                        result = result + dateSplitter;
                    result = result + "dd";
                }
            }

        }
        return result;
    }
    this.determineTimeFormat = function () {
        var result = "";
        var timeDate = new Date();
        var timeDateString = "";
        var meridiemString = "";
       
        timeDate.setHours(11);
        timeDate.setMinutes(59);
        timeDate.setSeconds(59);
        timeDate.setMilliseconds(0);
        

        var anteMeridiemTimeString = timeDate.toLocaleTimeString(this.currentCultureKey);
        anteMeridiemTimeString = anteMeridiemTimeString.replace(/\u200E/g, "");
        for (var i = 0; i <= anteMeridiemTimeString.length - 1; i++) {
            if (anteMeridiemTimeString[i] != "") {
                var charCode = anteMeridiemTimeString.charCodeAt(i);
                if (!isNaN(charCode) && charCode > 64) {
                    meridiemString = anteMeridiemTimeString.substr(i, anteMeridiemTimeString.length - i);
                    break;
                }
            }
        }
        this.anteMeridiemString = meridiemString;

        timeDate.setHours(23);
        timeDate.setMinutes(24);
        timeDate.setSeconds(25);
        timeDate.setMilliseconds(26);

        anteMeridiemTimeString = timeDate.toLocaleTimeString(this.currentCultureKey)
        anteMeridiemTimeString = anteMeridiemTimeString.replace(/\u200E/g, "");
        //getting post meridiem string
        var postMeridiem = "";
        for (var i = 0; i <= anteMeridiemTimeString.length - 1; i++) {
            if (anteMeridiemTimeString[i] != "") {
                var charCode = anteMeridiemTimeString.charCodeAt(i);
                if (!isNaN(charCode) && charCode > 64) {
                    meridiemString = anteMeridiemTimeString.substr(i, anteMeridiemTimeString.length - i);
                    break;
                }
            }
        }
        this.postMeridiemString = meridiemString;
        

        timeDateString = timeDate.toLocaleTimeString(this.currentCultureKey);
        timeDateString = timeDateString.replace(this.postMeridiemString, "");
        timeDateString = timeDateString.replace(/\u200E/g, "");
        timeDateString = timeDateString.trim();
        var nonNumeric = timeDateString.match(/\D/g);
        var timeSplitter = nonNumeric[0];
        var splitted = timeDateString.split(timeSplitter);
        this.localeTimeSeparator = timeSplitter;
        for (var i = 0 ; i <= splitted.length - 1; i++) {
            if (splitted[i].length == 2) {
                var numericValue = parseInt(splitted[i]);
                if (numericValue == 23 || numericValue == 11) {
                    this.isTwelveHourClock = numericValue == 11;
                    if (i > 0)
                        result = result + timeSplitter;
                    result = this.isTwelveHourClock ? result + "hh" : result + "HH";
                }
                if (numericValue == 24) {
                    if (i > 0)
                        result = result + timeSplitter;
                    result = result + "mm";
                }
                if (numericValue == 25) {
                    if (i > 0)
                        result = result + timeSplitter;
                    result = result + "ss";
                }
                if (numericValue == 26) {
                    if (i > 0)
                        result = result + timeSplitter;
                    result = result + "f";
                }
            }
        }
        return result;
    }
    this.localeDateFormat = this.determineDateFormat();
    this.localeTimeFormat = this.determineTimeFormat();
    
}
/**
 * @constructor
 * @memberOf Localization
 * @description Language class contains localized information for jasonWidgets for a language.
 * @example Creating an English localization language file.
 * //file must be loaded after localization manager.
 * jasonWidgetLanguageEN.prototype = Object.create(jasonWidgetLanguage.prototype);
 * jasonWidgetLanguageEN.prototype.constructor = jasonWidgetLanguageEN;
 * 
 * function jasonWidgetLanguageEN() {
 *    this.search = {
 *       searchPlaceHolder: 'Type in a value to search'
 *   }
 * ...
 * }
 * 
 * jasonWidgets.localizationManager.languages["en-US"] = new jasonWidgetLanguageEN();
 * 
 * @property {string} key - Unique language key. For example: en-US.
 * @property {object} search - Search localization.
 * @property {object} search.searchPlaceHolder - Text for the placeholder attribute of <input placeholder='Placeholder text!'> elements.
 * @property {object} filter - Filter localization.
 * @property {string} filter.filterValueIsEqual - 
 * @property {string} filter.filterValueIsNotEqual -
 * @property {string} filter.filterValueStartsWith -
 * @property {string} filter.filterValueEndsWith - 
 * @property {string} filter.filterValueContains - 
 * @property {string} filter.filterValueGreaterThan - 
 * @property {string} filter.filterValueGreaterEqualTo - 
 * @property {string} filter.filterValueLessThan - 
 * @property {string} filter.filterValueLessEqualTo - 
 * @property {string} filter.filterHeaderCaption - Filter header caption.
 * @property {object} data - Data localization.
 * @property {string} data.noData - Text when no data is available.
 * @property {object} grid - Grid localization.
 * @property {object} grid.paging - Grid paging localization.
 * @property {string} grid.firstPageButton - Pager's first button text.
 * @property {string} grid.priorPageButton - Pager's prior button text.
 * @property {string} grid.nextPageButton - Pager's next button text.
 * @property {string} grid.lastPageButton - Pager's last button text.
 * @property {string} grid.pagerInputTooltip - Pager's input tooltip text.
 * @property {object} grid.grouping - Grid grouping localization.
 * @property {string} grid.grouping.groupingMessage -  Grouping instruction message on how to group data by column.
 * @property {object} grid.filtering - Grid filtering localization.
 * @property {string} grid.filtering.clearButtonText -  Filter's clear button text.
 * @property {string} grid.filtering.clearButtonTooplip -  Filter's clear button tooltip.
 * @property {string} grid.filtering.applyButtonText -  Filter's apply button text.
 * @property {string} grid.filtering.applyButtonTooltip -  Filter's apply button tooltip.
 */
function jasonWidgetLanguage() {
    /*
     * Unique language key. For example en-US
     */
    jasonWidgetLanguage.prototype.key = "";
    /*
     * Search related strings.
     */
    jasonWidgetLanguage.prototype.search = {
        searchPlaceHolder:''
    }
    /*
     * Filter related strings.
     */
    jasonWidgetLanguage.prototype.filter = {
        values: {
            filterValueIsEqual: '',
            filterValueIsNotEqual: '',
            filterValueStartsWith: '',
            filterValueEndsWith: '',
            filterValueContains: '',
            filterValueGreaterThan: '',
            filterValueGreaterEqualTo: '',
            filterValueLessThan: '',
            filterValueLessEqualTo: '',
            filterHeaderCaption: ''
        },
        operators: {
            and: '',
            or:''
        }
    }
    /*
     * Data related strings
     */
    jasonWidgetLanguage.prototype.data = {
        noData:''
    }
    /*
     * Grid related strings.
     */
    jasonWidgetLanguage.prototype.grid = {
        paging: {
            firstPageButton: '',
            priorPageButton: '',
            nextPageButton: '',
            lastPageButton: '',
            pagerInputTooltip: ''
        },
        grouping: {
            groupingMessage: ''
        },
        filtering: {
            clearButtonText: '',
            clearButtonTooplip: '',
            applyButtonText: '',
            applyButtonTooltip: ''
        }
    };
    /*
     * Combobox related strings.
     */
    jasonWidgetLanguage.prototype.combobox = {
    };
    return jasonWidgetLanguage;
}


/**
 * @constructor
 * @memberOf Localization
 * @description 
 * Culture class contains localized information for jasonWidgets for a culture.
 * 
 * 
 * For acceptable date/time formats look here {@link https://msdn.microsoft.com/en-us/library/8kb3ddd4%28v=vs.110%29.aspx}
 * 
 * @example Creating an English culture localization file.
 * //file must be loaded after localization manager.
 * jasonWidgetCultureEN_US.prototype = Object.create(jasonWidgetCulture.prototype);
 * jasonWidgetCultureEN_US.prototype.constructor = jasonWidgetCultureEN_US;
 * 
 * function jasonWidgetCultureEN_US() {
 *   this.dateFormat = "MM/dd/yyyy";
 *   this.shortDateFormat = "MMM dd yyyy";
 *   this.longDateFormat = "dddd MMMM dd yyyy";
 *   this.timeFormat = "hh:mm:ss"
 *   this.postMeridiem = [];
 *   this.anteMeridiem = [];
 *}
 * 
 * jasonWidgets.localizationManager.cultures["en-US"] = new jasonWidgetCultureEN_US();
 * 
 * 
 * @property {string} key - Unique culture key. For example: en-US.
 * @property {string} dateFormat - Date format string. 
 * @property {string} shortDateFormat - Short date format string.
 * @property {string} longDateFormat - Long date format string.
 * @property {string} timeFormat - Time format string.
 */
function jasonWidgetCulture() {
    /*
     * Unique culture key. For example en-US
     */
    jasonWidgetCulture.prototype.key = "";

    jasonWidgetCulture.prototype.dateFormat = "";

    jasonWidgetCulture.prototype.shortDateFormat = "";

    jasonWidgetCulture.prototype.longDateFormat = "";

    jasonWidgetCulture.prototype.timeDateFormat = "";
}
jasonWidgets.localizationManager = new jasonLocalizationManager();
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
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @class
 * @ignore 
 * @name jasonBlockUIOptions
 * @memberOf Common
 * @property {string} [opacity='0.8'] - Default opacity.
 * @property {string} [backgroundColor='white'] - Default color.
 * @property {string} [cssClass=undefined] - If defined the CSS class will be added in the block element overlay.
 * @property {boolean} [blockKeyboard=false] - If true it blocks keyboard events to any element besides the nonBlockElement.
 * @property {boolean} [active=true] - If true blocking is active.Affects only keyboard blocking if configured.
 */

/**
 * @constructor
 * @memberOf Common
 * @param {HTMLElement} nonBlockElement - DOM element that will not be blocked.
 */
function jasonBlockUI(nonBlockElement, options) {
    this.defaultOptions = {
        opacity: '0.8',
        backgroundColor: 'white',
        blockKeyboard:false,
        active:true
    };
    if (options == void 0)
        options = {};
    jw.common.extendObject(this.defaultOptions, options);
    this.options = options;
    this.nonBlockElement = nonBlockElement;
    this.blockElement = document.createElement("DIV");
    this.blockElement.style.display = "none";
    this.blockElement.style.opacity = this.options.opacity;
    this.blockElement.style.backgroundColor = this.options.backgroundColor;
    if (this.options.cssClass != void 0)
        this.blockElement.classList.add(this.options.cssClass);
    this.blockElement.classList.add(jw.DOM.classes.JW_BLOCK_ELEMENT);
    this.blockElement.style.position = "absolute";
    this.blockElement.addEventListener(jw.DOM.events.CLICK_EVENT, function (event) { event.preventDefault(); event.stopPropagation(); });
    this.blockElement.addEventListener(jw.DOM.events.MOUSE_DOWN_EVENT, function (event) { event.preventDefault(); event.stopPropagation(); });
    this.addWindowEvents = this.addWindowEvents.bind(this);
    this.removeWindowEvents = this.removeWindowEvents.bind(this);
    this.handleWindowsFocus = this.handleWindowsFocus.bind(this);
    this.handleWindowsKeyDown = this.handleWindowsKeyDown.bind(this);
}
/**
 * Blocks the UI.
 * @param {HTMLElement} [blockTarget = undefined] - If no blockTarget is defined, the HTML element will be the block target.
 */
jasonBlockUI.prototype.block = function (blockTarget) {
    if (this.blockElement.parentNode)
        this.blockElement.parentNode.removeChild(this.blockElement);
    var coordinates = { left: 0, top: 0 };
    if (blockTarget && jw.common.getComputedStyleProperty(blockTarget, "position") != "absolute") {
        coordinates = jw.common.getOffsetCoordinates(blockTarget);
    }
    var bTarget = blockTarget ? blockTarget : document.getElementsByTagName("html")[0];
    bTarget.parentNode.appendChild(this.blockElement);
    this.blockTarget = bTarget;
        
    this.blockElement.style.height = bTarget.offsetHeight + "px";
    this.blockElement.style.width = bTarget.offsetWidth + "px";
    this.blockElement.style.top = bTarget.offsetTop + "px";
    this.blockElement.style.left = bTarget.offsetLeft + "px";
    this.blockElement.style.zIndex = jw.common.getNextZIndex();
    this.blockElement.style.display = "";
    this.addWindowEvents();
}
/**
 * Unblocks the UI.
 */
jasonBlockUI.prototype.unBlock = function () {
    this.blockElement.style.display = "none";
    this.removeWindowEvents();
}
/**
 * Adding window event listeners on blocking to prevent keyboard navigation behind the block element.
 */
jasonBlockUI.prototype.addWindowEvents = function () {
    if (this.options.blockKeyboard) {
        this.keydownListenerId = jwWindowEventManager.addWindowEventListener(jw.DOM.events.KEY_DOWN_EVENT, this.handleWindowsKeyDown);
        this.focusListenerId =  jwWindowEventManager.addWindowEventListener(jw.DOM.events.FOCUS_EVENT, this.handleWindowsFocus);
    }
}
/**
 * Removes event listeners when unblocking.
 */
jasonBlockUI.prototype.removeWindowEvents = function () {
    if (this.options.blockKeyboard) {
        jwWindowEventManager.removeWindowEventListener(this.keydownListenerId);
        jwWindowEventManager.removeWindowEventListener(this.focusListenerId);
    }
}
/**
 * When a key is press on an element that does not belong to the block htmlElement, then moves focus to the first focuseable element.
 */
jasonBlockUI.prototype.handleWindowsKeyDown = function (keydownEvent) {
    if (this.options.active == false)
        return;
    var preventDefault = !jw.common.contains(this.nonBlockElement, keydownEvent.target);
    if (preventDefault) {
        var firstFocusableElement = jw.common.getFirstFocusableElement(this.nonBlockElement);
        if (firstFocusableElement)
            firstFocusableElement.focus();
        keydownEvent.preventDefault();
        keydownEvent.stopPropagation();
    }
}
/**
 * When an element that does not belong to the block htmlElement gets focus, then moves focus to the first focuseable element.
 */
jasonBlockUI.prototype.handleWindowsFocus = function (focusEvent) {
    if (this.blockElement.style.display == "") {
        var preventDefault = !jw.common.contains(this.nonBlockElement, focusEvent.target);
        if (preventDefault) {
            var firstFocusableElement = jw.common.getFirstFocusableElement(this.nonBlockElement);
            if (firstFocusableElement)
                firstFocusableElement.focus();
            focusEvent.preventDefault();
            focusEvent.stopPropagation();
        }
    }
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @namespace Validation
 * @description jasonWidgets validation framework.
 */


/**
 * @class
 * @name jasonValidationRuleOptions
 * @description Configuration of a validation rule.
 * @memberOf Validation
 * @property {string} name - Rule name.
 * @property {string|function|HTML} message - HTML string or script tag or function containing HTML to be used to render the validation message content.
 * @property {string} title - Title name for the validation popover.
 * @property {function} validatorFunction(sender,value,validValue) - Function that validates a value and returns a boolean result. True if value is valid or false if it's invalid.
 * @property {any=} validValue - Value to be passed into the validator function when a value is validated. For example a min/max rule would need a limit.
 * @property {boolean} [enabled=true] - When true rule can validate value.
 * @property {Common.jasonBaseWidget} widget - Related jasonWidget value to be validated.
 * @propery {string} bubblePosition - Position for the validation bubble. [left,right,top,bottom]. By default is set to auto placement. Leaves this undefined to allow auto placement.
  */


/**
 * @class
 * @name jasonValidationRule
 * @description jwWidget validation rule object.
 * @memberOf Validation
 * @property {Validation.jasonValidationRuleOptions} options - Validation rule configuration.
 * @property {function} validate - Validate rule.
 */
function jasonValidationRule(options) {
    var self = this;
    this.options = options;

    this._closeEventAssigned = false;

    this.validate = function () {
        if (!self.widget) {
            self.widget = self.options.widget;
            self._initializeContent();
            self._createUI();
            self.validationMessage.innerHTML = self.options.message;
            self.validationPopover = new jasonPopover({
                targetElement: self.widget.htmlElement,
                title: options.title,
                content: self.validationContainer,
                autoPlacement: self.options.bubblePosition == undefined,
                position: self.options.bubblePosition,
                mode: 'validation'
            });
            self.validationPopover.htmlElement.classList.add(jw.DOM.classes.JW_VALIDATION);
        }
        if (self.options.validatorFunction && typeof self.options.validatorFunction == "function" && self.widget) {
            var validationResult = self.options.validatorFunction(self.widget,self.widget.value, self.options.validValue);
            if (validationResult == false) {
                self.validationPopover.show();
                if (!this._closeEventAssigned) {
                    var closeButton = self.validationPopover.ui.body.getElementsByClassName(jw.DOM.classes.JW_BUTTON)[0];
                    self.validationPopover.eventManager.addEventListener(closeButton, jw.DOM.events.CLICK_EVENT, function (event) {
                        self.validationPopover.hide();
                    },true);
                    this._closeEventAssigned = true;
                }
            } else {
                self.validationPopover.hide();
            }
            return validationResult;
        }
    }
    this._initializeContent = function () {
        this.options.message = jw.common.parseTemplateContent(this.options.message);
    }

    this._createUI = function () {
        self.validationContainer = document.createElement("DIV");
        self.validationContainer.classList.add(jw.DOM.classes.JW_VALIDATION_CONTAINER);
        self.validationMessageContainer = document.createElement("DIV");
        self.validationMessageContainer.classList.add(jw.DOM.classes.JW_VALIDATION_MESSAGE_CONTAINER);
        self.validationMessage = document.createElement("SPAN");
        self.validationMessage.classList.add(jw.DOM.classes.JW_VALIDATION_MESSAGE);
        self.validationMessageContainer.appendChild(self.validationMessage);
        self.validationCloseButton = jw.htmlFactory.createJWButton(null, jw.DOM.icons.CLOSE_24x24);
        self.validationContainer.appendChild(self.validationCloseButton);
        self.validationContainer.appendChild(self.validationMessageContainer);
    }
}


/**
 * @class
 * @name jasonValidationRuleGroup
 * @memberOf Validation
 * @property {Validation.jasonValidationRule[]} rules - Validation rules that belong to the group.
 */
function jasonValidationRuleGroup(name) {
    var self = this;
    this.name = name == void 0 ? "default" : name;
    this.rules = [];
    this.validate = function () {
        self.rules.forEach(function (rule) {
            if (rule.options.widget)
                rule.options.widget.validate();
            else
                rule.validate();
        });
    }
    jw.validationManager.addValidationGroup(this);
}

/**
 * @class
 * @name jasonValidationManager
 * @description Managing all jasonWidgets validation groups.
 * @memberOf Validation
 * @property {function} validate(validationGroupName) - Validate all validation groups. If validationGroupName is not defined validation will run for all groups.
 * @property {function} addValidationGroup(validationGroup) - Adds a validation group.
 * @property {function} addValidationRule(validationRule) - Adds a validation rule to it's group.
 */

jw.validationManager = (function () {
    var _validationGroups = [];
    return {
        validationGroups: _validationGroups,
        validate: function (validationGroupName) {
            if (validationGroupName) {
                var validationGroup = _validationGroups.filter((function (valGroup) { return validationGroupName == valGroup.name }));
                if (validationGroup)
                    validationGroup.validate();
            } else {
                _validationGroups.forEach(function (valGroup) {
                    valGroup.validate();
                });
            }
        },
        addValidationGroup:function(validationGroup){
            var valGroup = _validationGroups.filter((function (valGroup) { return validationGroup.name == valGroup.name }))[0];
            if (!valGroup)
                _validationGroups.push(validationGroup);
        },
        addValidationRule: function (validationRule) {
            var valGroup = _validationGroups.filter((function (valGroup) { return validationRule.ruleGroup == valGroup.name }))[0];
            if (valGroup) {
                valGroup.rules.push(validationRule);
            }
        }
    }
}());

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonWidgetLanguageEL.prototype = Object.create(jasonWidgetLanguage.prototype);
jasonWidgetLanguageEL.prototype.constructor = jasonWidgetLanguageEL;

function jasonWidgetLanguageEL() {
    this.search = {
        searchPlaceHolder: 'Όρος αναζήτησης'
    }
    this.filter = {
        values: {
            filterValueIsEqual: 'Ίση με',
            filterValueIsNotEqual: "Δεν είναι ίσο με",
            filterValueStartsWith: "Αρχίζει με",
            filterValueEndsWith: "Τέλειώνει με",
            filterValueContains: "Περιέχει",
            filterValueGreaterThan: "Μεγαλύτερο απο",
            filterValueGreaterEqualTo: "Μεγαλύτερο ίσο απο",
            filterValueLessThan: "Μικρότερο απο",
            filterValueLessEqualTo: "Μικρότερο ίσο απο"
        },
        operators: {
            and: 'Και',
            or:'ή'
        }
    }
    this.data = {
        noData: 'Δεν υπάρχουν δεδομένα'
    }
    this.grid = {
        paging: {
            firstPageButton: 'Πρώτη',
            priorPageButton: 'Προηγούμενη',
            nextPageButton: 'Επόμενη',
            lastPageButton: 'Τελευταία',
            pagerInputTooltip: 'Πληκτρολογήστε αριθμό σελίδας',
            pagerInfoOfRecordCount: 'απο'
        },
        grouping: {
            groupingMessage: 'Σύρετε μια στήλη εδώ , για να ομαδόποιήσετε τα δεδομένα με βάση τη στήλη αυτή',
            removeGrouping: 'Αφαίρεση ομαδόποιησης για '
        },
        filtering: {
            clearButtonText: 'Καθαρισμός',
            clearButtonToollip: 'Καθαρισμός όλων των φίλτρων',
            applyButtonText: 'Εφαρμογή',
            applyButtonTooltip: 'Εφαρμογή του φίλτρου',
            iconTooltip: 'Φιλτράρισμα δεδομένων',
            filterHeaderCaption: "Προβολή τιμών όπου"
        },
        columnMenu: {
            sortAscending: 'Αύξουσα Ταξινόμηση',
            sortDescending: 'Φθίνουσα Ταξινόμηση',
            filter: 'Φίλτρο',
            columns: 'Στήλες',
            clearSorting: "Αναίρεση Ταξινόμησης",
            clearFilters:"Αναίρεση Φίλτρου"
        }
    };
    this.combobox = {
        notFound: 'Ο όρος αναζήτησης [ {0} ] δεν βρέθηκε'
    };
    this.key = "EL";
    this.calendar = {
        days: [
            { name: 'Κυριακή', shortName: 'Κυρ' },
            { name: 'Δευτέρα', shortName: 'Δευ' },
            { name: 'Tρίτη', shortName: 'Tρι' },
            { name: 'Τετάρτη', shortName: 'Τετ' },
            { name: 'Πέμπτη', shortName: 'Πεμ' },
            { name: 'Παρασκευή', shortName: 'Παρ' },
            { name: 'Σάββατο', shortName: 'Σαβ' }
        ],
        months: [
            { name: 'Ιανουάριος', shortName: 'Ιαν' },
            { name: 'Φεβρουάριος', shortName: 'Φεβ' },
            { name: 'Μάρτιος', shortName: 'Μαρ' },
            { name: 'Απρίλιος', shortName: 'Απρ' },
            { name: 'Μαϊος', shortName: 'Μαϊ' },
            { name: 'Ιουνίος', shortName: 'Ιουν' },
            { name: 'Ιούλιος', shortName: 'Ιουλ' },
            { name: 'Αύγουστος', shortName: 'Αυγ' },
            { name: 'Σεπτέμβριος', shortName: 'Σεπ' },
            { name: 'Οκτώβριος', shortName: 'Οκτ' },
            { name: 'Νοέμβριος', shortName: 'Νοε' },
            { name: 'Δεκέμβριος', shortName: 'Δεκ' }
        ]
    };
    this.dialog = {
        buttons: [
            { name: 'btnOK', caption: 'OK' },
            { name: 'btnYes', caption: 'Ναι' },
            { name: 'btnNo', caption: 'Όχι' },
            { name: 'btnCancel', caption: 'Ακύρωση' },
            { name: 'btnAbort', caption: 'Ματαιώση' },
            { name: 'btnRetry', caption: 'Επανάληψη' },
            { name: 'btnIgnore', caption: 'Παράλειψη' },
        ]
    }
    this.numericTextBox = {
        increaseValue: "Αύξηση τιμής",
        decreaseValue: "Μειώση τιμής"
    }
}

jasonWidgets.localizationManager.languages["el"] = new jasonWidgetLanguageEL();

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonWidgetLanguageEN.prototype = Object.create(jasonWidgetLanguage.prototype);
jasonWidgetLanguageEN.prototype.constructor = jasonWidgetLanguageEN;

function jasonWidgetLanguageEN() {
    this.search = {
        searchPlaceHolder: 'Type in a value to search'
    }
    this.filter = {
        values: {
            filterValueIsEqual: 'Equal to',
            filterValueIsNotEqual: "Not equal to",
            filterValueStartsWith: "Starts with",
            filterValueEndsWith: "Ends with",
            filterValueContains: "Contains",
            filterValueGreaterThan: "Greater than",
            filterValueGreaterEqualTo: "Greater equal to",
            filterValueLessThan: "Less than",
            filterValueLessEqualTo: "Less equal than"
        },
        operators: {
            and: 'And',
            or: 'Or'
        }
    }
    this.data = {
        noData: 'No data'
    }
    this.grid = {
        paging: {
            firstPageButton: 'First',
            priorPageButton: 'Prior',
            nextPageButton: 'Next',
            lastPageButton: 'Last',
            pagerInputTooltip: 'Type in a page number',
            pagerInfoOfRecordCount :'of'

        },
        grouping: {
            groupingMessage: 'Drag a column here to group the data based on that column.',
            removeGrouping: 'Remove grouping for '
        },
        filtering: {
            clearButtonText: 'Clear',
            clearButtonToollip: 'Clear all filters',
            applyButtonText: 'Apply',
            applyButtonTooltip: 'Apply filter',
            iconTooltip: 'Filtering data',
            filterHeaderCaption: "Show values where"
        },
        columnMenu: {
            sortAscending: 'Sort Ascending',
            sortDescending: 'Sort Descending',
            filter: 'Filter',
            columns: 'Columns',
            clearSorting: "Clear Sorting",
            clearFilters: "Clear Filters"
        }
    };
    this.combobox = {
        notFound:'Search term [ {0} ] not found'
    };
    this.key = "EN";
    this.calendar = {
        days: [
            { name: 'Sunday', shortName: 'Sun' },
            { name: 'Monday', shortName: 'Mon' },
            { name: 'Tuesday', shortName: 'Tue' },
            { name: 'Wednesday', shortName: 'Wed' },
            { name: 'Thursday', shortName: 'Thu' },
            { name: 'Friday', shortName: 'Fri' },
            { name: 'Saturday', shortName: 'Sat' }
        ],
        months: [
            { name: 'January', shortName: 'Jan' },
            { name: 'February', shortName: 'Feb' },
            { name: 'March', shortName: 'Mar' },
            { name: 'April', shortName: 'Apr' },
            { name: 'May', shortName: 'May' },
            { name: 'June', shortName: 'Jun' },
            { name: 'July', shortName: 'Jul' },
            { name: 'August', shortName: 'Aug' },
            { name: 'September', shortName: 'Sep' },
            { name: 'October', shortName: 'Oct' },
            { name: 'November', shortName: 'Nov' },
            { name: 'December', shortName: 'Dec' }
        ]
    };
    this.dialog = {
        buttons: [
            { name: 'btnOK', caption: 'OK' },
            { name: 'btnYes', caption: 'Yes' },
            { name: 'btnNo', caption: 'No' },
            { name: 'btnCancel', caption: 'Cancel' },
            { name: 'btnAbort', caption: 'Abort' },
            { name: 'btnRetry', caption: 'Retry' },
            { name: 'btnIgnore', caption: 'Ignore' },
        ]
    }
    this.numericTextBox = {
        increaseValue: "Increase value",
        decreaseValue: "Decrease value"
    }
}

jasonWidgets.localizationManager.languages["en-US"] = new jasonWidgetLanguageEN();

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonWidgetLanguageES.prototype = Object.create(jasonWidgetLanguage.prototype);
jasonWidgetLanguageES.prototype.constructor = jasonWidgetLanguageES;

function jasonWidgetLanguageES() {
    this.search = {
        searchPlaceHolder: 'Escriba un valor para buscar'
    }
    this.filter = {
        values: {
            filterValueIsEqual: 'Igual a',
            filterValueIsNotEqual: "No igual a",
            filterValueStartsWith: "Comienza con",
            filterValueEndsWith: "Termina con",
            filterValueContains: "Contiene",
            filterValueGreaterThan: "Mas grande que",
            filterValueGreaterEqualTo: "Mayor igual a",
            filterValueLessThan: "Menos que",
            filterValueLessEqualTo: "Menos iguales que"
        },
        operators: {
            and: 'Y',
            or: 'O'
        }
    }
    this.data = {
        noData: 'Sin datos'
    }
    this.grid = {
        paging: {
            firstPageButton: 'Primero',
            priorPageButton: 'Anterior',
            nextPageButton: 'Siguiente',
            lastPageButton: "Ultimo",
            pagerInputTooltip: 'Teclear un número de página',
            pagerInfoOfRecordCount: 'de'

        },
        grouping: {
            groupingMessage: 'Arrastre una columna aquí para agrupar los datos en función de esa columna.',
            removeGrouping: 'Eliminar la agrupación de '
        },
        filtering: {
            clearButtonText: 'Claro',
            clearButtonToollip: 'Borrar todos los filtros',
            applyButtonText: 'Applicar',
            applyButtonTooltip: 'Applicar filtro',
            iconTooltip: 'Filtrado de datos',
            filterHeaderCaption: "Mostrar valores en donde"
        },
        columnMenu: {
            sortAscending: 'Orden ascendente',
            sortDescending: 'Orden descendiente',
            filter: 'Filtrar',
            columns: 'Columnas',
            clearSorting: "Claro ordenación",
            clearFilters: "Eliminar filtros"
        }
    };
    this.combobox = {
        notFound: 'Término de búsqueda [{0}] no encontrado'
    };
    this.key = "ES";
    this.calendar = {
        days: [
            { name: 'Domenica', shortName: 'Dom' },
            { name: 'Lunedi', shortName: 'Lun' },
            { name: 'Martedi', shortName: 'Mar' },
            { name: 'Mercoledi', shortName: 'Mer' },
            { name: 'Giovedi', shortName: 'Gio' },
            { name: 'Venerdi', shortName: 'Ven' },
            { name: 'Sabato', shortName: 'Sab' }
        ],
        months: [
            { name: 'Enero', shortName: 'Genn' },
            { name: 'Febrero', shortName: 'Febbr' },
            { name: 'Marzo', shortName: 'Mar' },
            { name: 'Abril', shortName: 'Apr' },
            { name: 'Mayo', shortName: 'Magg' },
            { name: 'Junio', shortName: 'Giu' },
            { name: 'Julio', shortName: 'Lug' },
            { name: 'Agosto', shortName: 'Ago' },
            { name: 'Septiembre', shortName: 'Sett' },
            { name: 'Octubre', shortName: 'Ott' },
            { name: 'Noviembre', shortName: 'Nov' },
            { name: 'Diciembre', shortName: 'Dic' }
        ]
    };

    this.dialog = {
        buttons: [
            { name: 'btnOK', caption: 'OK' },
            { name: 'btnYes', caption: 'Sì' },
            { name: 'btnNo', caption: 'No' },
            { name: 'btnCancel', caption: 'Cancelar' },
            { name: 'btnAbort', caption: 'Abortar' },
            { name: 'btnRetry', caption: 'Rever' },
            { name: 'btnIgnore', caption: 'Ignorar' },
        ]
    }
    this.numericTextBox = {
        increaseValue: "Aumentar el valor",
        decreaseValue: "Disminuye el valor"
    }
}

jasonWidgets.localizationManager.languages["es"] = new jasonWidgetLanguageES();

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonWidgetLanguageIT.prototype = Object.create(jasonWidgetLanguage.prototype);
jasonWidgetLanguageIT.prototype.constructor = jasonWidgetLanguageIT;

function jasonWidgetLanguageIT() {
    this.search = {
        searchPlaceHolder: 'Digitare un valore per la ricerca'
    }
    this.filter = {
        values: {
            filterValueIsEqual: 'Uguale a',
            filterValueIsNotEqual: "Non uguale a",
            filterValueStartsWith: "Inizia con",
            filterValueEndsWith: "Finisce con",
            filterValueContains: "Contiene",
            filterValueGreaterThan: "Più grande di",
            filterValueGreaterEqualTo: "Maggiore pari a",
            filterValueLessThan: "Meno di",
            filterValueLessEqualTo: "Meno uguali degli"
        },
        operators: {
            and: 'e',
            or: 'O'
        }
    }
    this.data = {
        noData: 'Nessun dati'
    }
    this.grid = {
        paging: {
            firstPageButton: 'Primo',
            priorPageButton: 'Precedente',
            nextPageButton: 'Prossimo',
            lastPageButton: "Ultimo",
            pagerInputTooltip: 'Digitare un numero di pagina',
            pagerInfoOfRecordCount: 'di'

        },
        grouping: {
            groupingMessage: 'Trascinare una colonna qui, per raggruppare i dati in base a quella colonna',
            removeGrouping: 'Rimuovere raggruppamento per '
        },
        filtering: {
            clearButtonText: 'Cancella',
            clearButtonToollip: 'Cancella tutti i filtri',
            applyButtonText: 'Applica',
            applyButtonTooltip: 'Applica il filtro',
            iconTooltip: 'Filtraggio dei dati',
            filterHeaderCaption: "Mostra i valori in cui"
        },
        columnMenu: {
            sortAscending: 'Ordine crescente',
            sortDescending: 'Ordine decrescente',
            filter: 'Filtro',
            columns: 'Colonne',
            clearSorting: "Cancella ordinamento",
            clearFilters: "Cancella filtri"
        }
    };
    this.combobox = {
        notFound: 'Il termino di ricerca [ {0} ] non trovato'
    };
    this.key = "IT";
    this.calendar = {
        days: [
            { name: 'Domenica', shortName: 'Dom' },
            { name: 'Lunedi', shortName: 'Lun' },
            { name: 'Martedi', shortName: 'Mar' },
            { name: 'Mercoledi', shortName: 'Mer' },
            { name: 'Giovedi', shortName: 'Gio' },
            { name: 'Venerdi', shortName: 'Ven' },
            { name: 'Sabato', shortName: 'Sab' }
        ],
        months: [
            { name: 'Gennaio', shortName: 'Genn' },
            { name: 'Febbraio', shortName: 'Febbr' },
            { name: 'Marzo', shortName: 'Mar' },
            { name: 'Aprile', shortName: 'Apr' },
            { name: 'Maggio', shortName: 'Magg' },
            { name: 'Giugno', shortName: 'Giu' },
            { name: 'Luglio', shortName: 'Lug' },
            { name: 'Agosto', shortName: 'Ago' },
            { name: 'Settembre', shortName: 'Sett' },
            { name: 'Ottobre', shortName: 'Ott' },
            { name: 'Novembre', shortName: 'Nov' },
            { name: 'Dicembre', shortName: 'Dic' }
        ]
    };

    this.dialog = {
        buttons: [
            { name: 'btnOK', caption: 'OK' },
            { name: 'btnYes', caption: 'Sì' },
            { name: 'btnNo', caption: 'No' },
            { name: 'btnCancel', caption: 'Annulla' },
            { name: 'btnAbort', caption: 'Interrompe' },
            { name: 'btnRetry', caption: 'Riprova' },
            { name: 'btnIgnore', caption: 'Ignorare' },
        ]
    }

    this.numericTextBox = {
        increaseValue: "Aumentare il valore",
        decreaseValue: "Riduzione valore"
    }
}

jasonWidgets.localizationManager.languages["it"] = new jasonWidgetLanguageIT();

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonWidgetCultureEL.prototype = Object.create(jasonWidgetCulture.prototype);
jasonWidgetCultureEL.prototype.constructor = jasonWidgetCultureEL;

function jasonWidgetCultureEL() {
    this.dateFormat = "dd/MM/yyyy";
    this.shortDateFormat = "dd MMM YYYY";
    this.longDateFormat = "dd MMMM yyyy";
    this.timeFormat = "hh:mm:ss"
    this.postMeridiem = [];
    this.anteMeridiem = [];
    this.currencyCode = "EUR";
    this.key = "el";
}


jasonWidgets.localizationManager.cultures["el"] = new jasonWidgetCultureEL();
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonWidgetCultureEN_US.prototype = Object.create(jasonWidgetCulture.prototype);
jasonWidgetCultureEN_US.prototype.constructor = jasonWidgetCultureEN_US;

function jasonWidgetCultureEN_US() {
    this.dateFormat = "MM/dd/yyyy";
    this.shortDateFormat = "MMM dd yyyy";
    this.longDateFormat = "dddd MMMM dd yyyy";
    this.timeFormat = "hh:mm:ss"
    this.postMeridiem = [];
    this.anteMeridiem = [];
    this.currencyCode = "USD";
    this.key = "en-US";
}


jasonWidgets.localizationManager.cultures["en-US"] = new jasonWidgetCultureEN_US();
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonWidgetCultureES.prototype = Object.create(jasonWidgetCulture.prototype);
jasonWidgetCultureES.prototype.constructor = jasonWidgetCultureES;

function jasonWidgetCultureES() {
    this.dateFormat = "dd/MM/yyyy";
    this.shortDateFormat = "dd MMM YYYY";
    this.longDateFormat = "dd MMMM yyyy";
    this.timeFormat = "hh:mm:ss"
    this.postMeridiem = [];
    this.anteMeridiem = [];
    this.currencyCode = "EUR";
    this.key = "es";
}


jasonWidgets.localizationManager.cultures["es"] = new jasonWidgetCultureES();
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonWidgetCultureIT.prototype = Object.create(jasonWidgetCulture.prototype);
jasonWidgetCultureIT.prototype.constructor = jasonWidgetCultureIT;

function jasonWidgetCultureIT() {
    this.dateFormat = "dd/MM/yyyy";
    this.shortDateFormat = "dd MMM YYYY";
    this.longDateFormat = "dd MMMM yyyy";
    this.timeFormat = "hh:mm:ss"
    this.postMeridiem = [];
    this.anteMeridiem = [];
    this.currencyCode = "EUR";
    this.key = "it";
}


jasonWidgets.localizationManager.cultures["it"] = new jasonWidgetCultureIT();
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonTextbox.prototype = Object.create(jasonBaseWidget.prototype);
jasonTextbox.prototype.constructor = jasonTextbox;

/**
 * @namespace Editors
 * @description Collection of editor widgets. For example inputs, numeric textboxes, etc.
 */

/**
 * @class
 * @name jasonTextboxOptions
 * @description Configuration for the textbox widget.
 * @memberOf Editors
 * @augments Common.jasonWidgetOptions
 * @property {string} placeholder - Textbox placeholder string.
 */

/**
 * @event Editors.jasonTextbox#onChange
 * @description Occurs when text value is changed.
 * @type {object}
 * @property {Editors.jasonTextbox} sender - The text box instance.
 * @property {any} value - The new value.
 */

/**
 * jasonTextbox
 * @constructor
 * @descrption Textbox control widget.
 * @memberOf Editors
 * @augments Common.jasonBaseWidget
 * @param {HTMLElement} htmlElement - DOM element that will contain the textbox.
 * @param {Editors.jasonTextboxOptions} options - Textbox control options. 
 * @property {string} value - Value of the input control
 * @fires Editors.jasonTextbox#event:onChange
 */
function jasonTextbox(htmlElement, options, nameSpace, uiHelper) {
    if (htmlElement.tagName != "DIV")
        throw new Error("Textbox container element must be a div");
    if (!this.defaultOptions) {
        this.defaultOptions = {
        };
    }
    jasonBaseWidget.call(this, nameSpace == void 0 ? "jasonTextbox" : nameSpace, htmlElement, options, uiHelper == void 0 ? jasonTextboxUIHelper : uiHelper);
    this._value = null;
    //if (uiHelper == void 0)
    //    this.ui.renderUI();
}
/**
 * Textbox value property.
 */
Object.defineProperty(jasonTextbox.prototype, "value", {
    get: function () {
        //if (this._value == void 0)
        //    this._value = this.ui.inputControl.value;
        return this.readValue(this._value);
    },
    set: function (value) {
        if (this.compareValue(value) != jw.enums.comparison.equal) {
            this._value = this.setValue(value);
            this.ui.inputControl.value = this.formatValue(this._value);
            this.ui.inputControl.setAttribute(jw.DOM.attributes.TITLE_ATTR, this.ui.inputControl.value);
            this.validate();
            this.triggerEvent(jw.DOM.events.JW_EVENT_ON_CHANGE, this._value);
        } else {
            this.ui.inputControl.value = this.formatValue(this._value);
        }

    },
    enumerable: true,
    configurable: true
});
/**
 * Can be overridden in descendants to return a different value when the "value" property is accessed.
 */
jasonTextbox.prototype.readValue = function (value) {
    return value;
}
/**
 * Can be overridden in descendants to return a different value when the "value" property is set, to format the value that is displayed in the UI control.
 */
jasonTextbox.prototype.formatValue = function (value) {
    return value;
}
/**
 * Can be overridden in descendants to return a different value when the "value" property is set, to determine whether a value change is needed or not.
 */
jasonTextbox.prototype.compareValue = function (value) {
    return jw.common.stringComparison(this._value, value);
}
/**
 * Can be overridden in descendants to return a different value when the "value" property is set, if the underlying "_value" property needs to be of different type.
 */
jasonTextbox.prototype.setValue = function (value) {
    return value;
}
/**
 * 
 */
jasonTextbox.prototype.updateOptions = function (options) {
    var updatedOptions = options ? options : this.options;
    this.inputControl.setAttribute(jw.DOM.attributes.TITLE, updateOptions.placeholder);
}


jasonTextboxUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonTextboxUIHelper.prototype.constructor = jasonTextboxUIHelper;

/**
 * Textbox UI widget helper.
 * @constructor
 * @ignore
 */
function jasonTextboxUIHelper(widget, htmlElement) {
    this.onTextInputBlur = this.onTextInputBlur.bind(this);
    this.onTextInputFocus = this.onTextInputFocus.bind(this);
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);
}
/**
 * Renders tab control's HTML.
 */
jasonTextboxUIHelper.prototype.renderUI = function () {
    
    if (!this.htmlElement.classList.contains(jw.DOM.classes.JW_TEXT_BOX)) {
        this.htmlElement.classList.add(jw.DOM.classes.JW_TEXT_BOX);
        this.inputControl = jw.htmlFactory.createJWTextInput(null, this.widget.options.placeholder, this.widget.readonly);
        this.htmlElement.appendChild(this.inputControl);
    }
}
/**
 * Events initialization.
 */
jasonTextboxUIHelper.prototype.initializeEvents = function () {
    this.eventManager.addEventListener(this.inputControl, jw.DOM.events.BLUR_EVENT, this.onTextInputBlur, true);
    this.eventManager.addEventListener(this.inputControl, jw.DOM.events.FOCUS_EVENT, this.onTextInputFocus, true);
}
/**
 * Formats number when input looses focus.
 */
jasonTextboxUIHelper.prototype.onTextInputBlur = function (event, sender) {
    //we only want to set the value here is this is a jasonTextbox and not a descendant.
    //if it is a descendant, it should already set the value before calling this base function.
    if (this.widget.nameSpace == "jasonTextbox" || this.widget.nameSpace == "jasonButtonTextbox") {
        this.widget.value = this.inputControl.value;
    }
    this.htmlElement.classList.remove(jw.DOM.classes.JW_FOCUSED);
}
/**
 * Adds a focus class to the parent/container element.
 */
jasonTextboxUIHelper.prototype.onTextInputFocus = function (event,sender) {
    this.htmlElement.classList.add(jw.DOM.classes.JW_FOCUSED);
}
/**
 * Updates UI when enable/disable state is changed.
 * @abstract
 */
jasonTextboxUIHelper.prototype.updateEnabled = function (enable) {
    jasonBaseWidgetUIHelper.prototype.updateEnabled.call(this, enable);
    if (enable)
        this.inputControl.removeAttribute(jw.DOM.attributes.DISABLED_ATTR)
    else
        this.inputControl.setAttribute(jw.DOM.attributes.DISABLED_ATTR, true);
}
/**
 * Updates UI when visible state is changed.
 * @abstract
 */
jasonTextboxUIHelper.prototype.updateVisible = function (visible) {
    jasonBaseWidgetUIHelper.prototype.updateVisible.call(this, visible);
}
/**
 * Updates UI when readonly state is changed.
 * @abstract
 */
jasonTextboxUIHelper.prototype.updateReadOnly = function (readonly) {
    jasonBaseWidgetUIHelper.prototype.updateReadOnly.call(this, readonly);
    if (readonly)
        this.inputControl.setAttribute(jw.DOM.attributes.READONLY_ATTR, true);
    else
        this.inputControl.removeAttribute(jw.DOM.attributes.READONLY_ATTR);
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonButtonTextbox.prototype = Object.create(jasonTextbox.prototype);
jasonButtonTextbox.prototype.constructor = jasonButtonTextbox;

/**
 * @class
 * @name jasonButtonTextboxOptions
 * @description Configuration for the ButtonTextbox widget.
 * @memberOf Editors
 * @augments Common.jasonWidgetOptions
 * @property {Globals.jw.DOM.icons} [icon=undefined] - Icon class for the button.
 * @property {string} title - Button title.
 */

/**
 * @event Editors.jasonButtonTextbox#onChange
 * @description Occurs when the button text is changed.
 * @type {object}
 * @property {Editors.jasonButtonTextbox} sender - The button text box instance.
 * @property {any} value - The new value.
 */

/**
 * @event Editors.jasonButtonTextbox#onButtonClick
 * @description Occurs when the button is clicked.
 * @type {object}
 * @property {object} event - The event object.
 * @property {Editors.jasonButtonTextbox} sender - The button text box instance.
 */

/**
 * jasonButtonTextbox
 * @constructor
 * @descrption Button textbox control widget.
 * @memberOf Editors
 * @augments Editors.jasonTextbox
 * @param {HTMLElement} htmlElement - DOM element that will contain the jasonButtonTextbox.
 * @param {Editors.jasonButtonTextboxOptions} options - Button textbox control options. 
 * @property {number} value - Button value.
 * @fires Editors.jasonButtonTextbox#event:onChange
 * @fires Editors.jasonButtonTextbox#event:onButtonClick
 */
function jasonButtonTextbox(htmlElement, options, nameSpace, uiHelper) {
    if (!this.defaultOptions) {
        this.defaultOptions = {
        };
    }
    jasonTextbox.call(this, htmlElement, options, nameSpace == void 0 ? "jasonButtonTextbox" : nameSpace, uiHelper == void 0 ? jasonButtonTextboxUIHelper : uiHelper);
    //if (uiHelper == void 0)
    //    this.ui.renderUI();
}


jasonButtonTextboxUIHelper.prototype = Object.create(jasonTextboxUIHelper.prototype);
jasonButtonTextboxUIHelper.prototype.constructor = jasonButtonTextboxUIHelper;

/**
 * Textbox UI widget helper.
 * @constructor
 * @ignore
 */
function jasonButtonTextboxUIHelper(widget, htmlElement) {
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onTextInputBlur = this.onTextInputBlur.bind(this);
    this.onTextInputFocus = this.onTextInputFocus.bind(this);
    jasonTextboxUIHelper.call(this, widget, htmlElement);
}
/**
 * Renders Button text box HTML.
 */
jasonButtonTextboxUIHelper.prototype.renderUI = function () {
    jasonTextboxUIHelper.prototype.renderUI.call(this);
    if (!this.htmlElement.classList.contains(jw.DOM.classes.JW_BUTTON_TEXT_BOX)) {
        this.htmlElement.classList.add(jw.DOM.classes.JW_BUTTON_TEXT_BOX);

        this.button = jw.htmlFactory.createJWButton(null, this.options.icon);
        this.button.setAttribute(jw.DOM.attributes.TITLE_ATTR, this.options.title == void 0 ? "" : this.options.title);
        this.htmlElement.appendChild(this.button);
        /*32px is the icon and 3px are the added borders. */
        var buttonWidth = this.options.icon ? 35 : 0;
        this.inputControl.style.width = "calc(100% - " + (buttonWidth) + "px)";
        if (this.inputControl.style.width == "")
            this.inputControl.style.width = "-webkit-calc(100% - " + (buttonWidth) + "px)";
    }
}
/**
 * Initializate events.
 */
jasonButtonTextboxUIHelper.prototype.initializeEvents = function () {
    jasonTextboxUIHelper.prototype.initializeEvents.call(this);
    this.eventManager.addEventListener(this.button, jw.DOM.events.CLICK_EVENT, this.onButtonClick, true);
}
/**
 * Handles button click.
 */
jasonButtonTextboxUIHelper.prototype.onButtonClick = function (event) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_BUTTON_CLICK);
}
/**
 * 
 */
jasonButtonTextboxUIHelper.prototype.onTextInputBlur = function (event, sender) {
    jasonTextboxUIHelper.prototype.onTextInputBlur.call(this, event, sender);
}
/**
 * 
 */
jasonButtonTextboxUIHelper.prototype.onTextInputFocus = function (event, sender) {
    jasonTextboxUIHelper.prototype.onTextInputFocus.call(this, event, sender);
}
/**
 * Updates UI when enable/disable state is changed.
 * @abstract
 */
jasonButtonTextboxUIHelper.prototype.updateEnabled = function (enable) {
    jasonTextboxUIHelper.prototype.updateEnabled.call(this, enable);
    if (enable) {
        this.button.removeAttribute(jw.DOM.attributes.DISABLED_ATTR)
        this.button.classList.remove(jw.DOM.classes.JW_DISABLED);
    }
    else {
        this.button.setAttribute(jw.DOM.attributes.DISABLED_ATTR, true);
        this.button.classList.add(jw.DOM.classes.JW_DISABLED);
    }
}
/**
 * Updates UI when visible state is changed.
 * @abstract
 */
jasonButtonTextboxUIHelper.prototype.updateVisible = function (visible) {
    jasonTextboxUIHelper.prototype.updateVisible.call(this, visible);
}
/**
 * Updates UI when readonly state is changed.
 * @abstract
 */
jasonButtonTextboxUIHelper.prototype.updateReadOnly = function (readonly) {
    jasonTextboxUIHelper.prototype.updateReadOnly.call(this, readonly);
    if (readonly)
        this.button.setAttribute(jw.DOM.attributes.READONLY_ATTR, true);
    else
        this.button.removeAttribute(jw.DOM.attributes.READONLY_ATTR);
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonCombobox.prototype = Object.create(jasonButtonTextbox.prototype);
jasonCombobox.prototype.constructor = jasonCombobox;
/**
 * @namespace Dropdowns
 * @description 
 * 
 * Keyboard navigation:
 * 
 * @property DownArrow {Keyboard} - If focus is on the input element, then it drops down the list and sets focus to the first item.If focus is on an item on the list, then it moves to the next item on the list.
 * @property UpArrow {Keyboard} - If focus is on an item on the list, then it moves to the previous item on the list.If focus is on the first item on the list, it moves to the input element.
 * @property Tab {Keyboard} - If focus is on an item on the list, then it moves to the next item on the list.
 * @property Shift+Tab {Keyboard} - If focus is on an item on the list, then it moves to the previous item on the list.
 * @property Enter {Keyboard} - If focus is on an item on the list, then it selects the item and closes the list.
 * 
 */

/**
 * @class
 * @memberOf Dropdowns
 * @name jasonComboboxOptions
 * @description Configuration for the combobox widget.
 * @augments Common.jasonWidgetOptions
 * @property {any[]}    [data=[]]                - Data for the combobox to display.
 * @property {string}   [keyFieldName=""]        - The name of a key field if the data is a list of objects.
 * @property {string}   [placeholder=""]         - Input placehoder string.
 * @property {string}   [inputMode=verbatim]     - InputMode.
 * @property {boolean}  [dropDownList=false]            - If true, does not allow typing.
 * @property {boolean}  [autoFilter=false]          - If true, automatically filters results while typing.
 * @property {boolean}  [caseSentiveSearch=false]   - If true, search is case sensitive.
 * @property {string}   [displayFormat=""] - String with format parameters. For example "{0},{1}". Each format parameter will be replaced by the field value of fields defined in DisplayFields.
 * @property {string[]} [displayFields=[]]       - Array that lists the field values to be displayed on the input control.
 * @property {boolean} [multiSelect=false] - If true it allows to select/check multiple items from the drop down list. The list will not automatically close if multiSelect is true.
 * @property {boolean} [checkboxes=false] - If true it shows checkboxes next to the list items.
 * @property {string}   [multipleSelectionSeparator = |] - Character to separate values displayed in the combobox when multiSelect is enabled.
 * @property {object}   [customization={}]                   - Combobox customization.
 * @property {any}      [customization.itemTemplate=undefined]       - HTML string or script tag or function containing HTML to be used to render combobox items.
 */

/**
 * @event Dropdowns.jasonCombobox#onSelectItem
 * @description Occurs when an item is selected.
 * @type {object}
 * @property {Dropdowns.jasonComboBox} sender - The combobox instance.
 * @property {object} value - The event data.
 * @property {object} value.selectedItem - The selected item object.
 * @property {number} value.selectedItemIndex - The selected item index.
 */

/**
* @event Dropdowns.jasonCombobox#onUnSelectItem
* @description Occurs when an item is de-selected.
* @type {object}
* @property {Dropdowns.jasonComboBox} sender - The combobox instance.
* @property {object} value - The event data.
* @property {object} value.selectedItem - The unselected item object.
* @property {number} value.selectedItemIndex - The selected item index.
*/

/**
 * @event Dropdowns.jasonCombobox#onHide
 * @description Occurs when the drop down list is hidden.
 * @type {object}
 * @property {Dropdowns.jasonComboBox} sender - The combobox instance.
 */
/**
 * @event Dropdowns.jasonCombobox#onShow
 * @description Occurs when the drop down list is shown.
 * @type {object}
 * @property {Dropdowns.jasonComboBox} sender - The combobox instance.
 */


/**
 * @constructor
 * @memberOf Dropdowns
 * @augments Common.jasonBaseWidget
 * @description Combobox widget. If you want to make it behave like a drop down list, just set the readonly property to true.
 * @param {HTMLElement} htmlElement - DOM element that will contain the combobox.
 * @param {Dropdowns.jasonComboboxOptions} options - Combobox control options.
 * @property {number} selectedItemIndex - Gets or sets the currently selected item index(s).
 * @fires Dropdowns.jasonCombobox#event:onSelectItem
 * @fires Dropdowns.jasonCombobox#event:onUnSelectItem
 * @fires Dropdowns.jasonCombobox#event:onHide
 * @fires Dropdowns.jasonCombobox#event:onShow
 */
function jasonCombobox(htmlElement, options, nameSpace) {
    this.defaultOptions = {
        data: null,
        keyFieldName: undefined,
        displayFields: undefined,
        displayFormat: undefined,
        placeholder: undefined,
        inputMode: "verbatim",
        readonly: false,
        caseSentiveSearch: false,
        autoFilter: false,
        icon: jw.DOM.icons.CHEVRON_DOWN,
        multipleSelectionSeparator:"|",
        customization: {
            itemTemplate: null,
            dataFieldAttribute: "data-field"
        }
    };
    nameSpace = nameSpace === void 0 ? "jasonCombobox" : nameSpace;
    jasonButtonTextbox.call(this, htmlElement, options, nameSpace, jasonComboboxUIHelper);
    this.onDataChange = this.onDataChange.bind(this);
    this.dataSource = new jasonDataSource({ data: this.options.data,onChange:this.onDataChange});
    this.filteredData = [];
    this.search = this.search.bind(this);
    this.options.localization = jasonWidgets.localizationManager.currentLanguage ? jasonWidgets.localizationManager.currentLanguage : this.options.localization;
    this.dataChanged = true;
    //this._initializeTemplates();
    //this.ui.renderUI();
}
/**
 * Selected item index property.
 */
Object.defineProperty(jasonCombobox.prototype, "selectedItemIndex", {
    get: function () {
        var result = [];
        this.ui.dropDownListButton.selectedItems.forEach(function (itm, idx) { result.push(itm._jwRowId); });
        return result;
    },
    set: function (value) {
        var newSelectedIndexes = Array.isArray(value) ? value : [value];
        newSelectedIndexes.forEach(function (newIdx) {
            this.ui.dropDownListButton.selectItem(newIdx);
        }.bind(this));
    },
    enumerable: true,
    configurable: true
});
/**
 * Clears current selection.
 */
jasonCombobox.prototype.clearSelection = function () {
    this.ui.clearSelection();
}
/**
 * Searches in the data using as criteria any value the input control has.
 * @ignore
 */
jasonCombobox.prototype.search = function () {
    /**
     * If there is a selection just dropdown the list and set focus to the 
     * first selected item.
     */
    if (this.ui.dropDownListButton.selectedItems.length > 0) {
        this.showList();
    } else {
        //if there are more than one display field then separate values with a space to search against multiple fields.
        var searchValue = this.options.displayFields.length > 1 ? this.ui.inputControl.value.replace(/[\W_]+/g, " ") : this.ui.inputControl.value;
        this.filteredData = this.dataSource.searchByField(searchValue.split(" "),this.options.displayFields, null, this.options.caseSentiveSearch);
        if (this.filteredData.length == 0) {
            var nodataItem = { _NoData_: jasonWidgets.common.formatString(this.options.localization.combobox.notFound, [this.ui.inputControl.value]) };

            this.filteredData.push(nodataItem);
        }
        this.ui.dropDownListButton.ui.renderListItems(this.filteredData);
        this.ui.inputControl.focus();
    }
}
/**
 * Shows the drop down list.
 */
jasonCombobox.prototype.showList = function () {
    this.ui.showList();
}
/**
 * Hides the drop down list.
 */
jasonCombobox.prototype.hideList = function () {
    this.ui.hideList(true);
}
/**
 * Toggles the drop down list.
 */
jasonCombobox.prototype.toggleDropDownList = function () {
    this.ui.toggleDropdownList();
}
/**
 * Selects an item.
 * @param {number} itemIndex - Item index to select.
 */
jasonCombobox.prototype.selectItem = function (itemIndex) {
    this.ui.dropDownListButton.selectItem(itemIndex);
    //this._selectedItemIndex = itemIndex;
    //this.selectedItem = this.filteredData.length > 0 ? this.filteredData.filter(function (dataItem) { return dataItem._jwRowId == itemIndex; })[0] : this.dataSource.data[itemIndex];
    this.ui.updateInputTextFromSelection();
}
/**
 * @ignore
 */
jasonCombobox.prototype.onDataChange = function () {
    this.ui.dropDownListButton.dataSource.setData(this.dataSource.data);
}
/**
 * If currently selected value has only one item then return just the first value. Otheriwse return the whole array.
 */
jasonCombobox.prototype.readValue = function (value) {
    return Array.isArray(value) && value.length == 1 ? value[0] : value;
}
/**
 * Parses/formats the entered value.
 */
jasonCombobox.prototype.formatValue = function (value) {
    return this.ui.dropDownListButton.ui.createCaptionFromSelection();
}
/**
 * Can be overridden in descendants to return a different value when the "value" property is set, if the underlying "_value" property needs to be of different type.
 */
jasonCombobox.prototype.setValue = function (value) {
    //return !Array.isArray(value) ? [value] : value;
    return value;
}
/**
 * Compares the new value to be set, before actually setting it.
 */
jasonCombobox.prototype.compareValue = function (value) {
   if (this._value == null && value != undefined)
       return jw.enums.comparison.notEqual;

   if (Array.isArray(value) && Array.isArray(this._value)) {
       if (this._value.length == value.length) {
           var result = jw.enums.comparison.equal;
           for(var i=0;i<=this._value.length-1;i++){
               result = jw.common.simpleObjectComparison(this._value[i], value[i]);
               if (result != jw.enums.comparison.equal)
                   break;
           }
           return result;
       } else {
           return this._value.length == value.length ? jw.enums.comparison.equal : jw.enums.comparison.notEqual;
       }
   }
 
    if(typeof value == "object")
        return jw.common.simpleObjectComparison(this._value, value);
    return jw.enums.comparison.notEqual;
}

jasonComboboxUIHelper.prototype = Object.create(jasonButtonTextboxUIHelper.prototype);
jasonComboboxUIHelper.prototype.constructor = jasonComboboxUIHelper;
/**
 * @constructor
 * @ignore
 */
function jasonComboboxUIHelper(widget, htmlElement) {

    
    this.oninputControlClick = this.oninputControlClick.bind(this);
    this.oninputControlChange = this.oninputControlChange.bind(this);
    this.onTextInputBlur = this.onTextInputBlur.bind(this);
    this.onTextInputFocus = this.onTextInputFocus.bind(this);
    this.showList = this.showList.bind(this);
    this.hideList = this.hideList.bind(this);
    this.onComboboxKeyUp = this.onComboboxKeyUp.bind(this);
    this.onComboboxKeyDown = this.onComboboxKeyDown.bind(this);
    this.dropDownListButton = null;
    jasonButtonTextboxUIHelper.call(this, widget, htmlElement);
}
/**
 * Renders combobox HTML.
 */
jasonComboboxUIHelper.prototype.renderUI = function () {
    jasonButtonTextboxUIHelper.prototype.renderUI.call(this);
    if (!this.htmlElement.classList.contains(jw.DOM.classes.JW_COMBOBOX_CLASS)) {
        this.htmlElement.classList.add(jw.DOM.classes.JW_COMBOBOX_CLASS);
        var dropDownButtonOptions = {};
        jw.common.extendObject(this.options, dropDownButtonOptions);
        //any validation rules that the combobox might have, must not be passed to the dropdownlistbutton widget.
        dropDownButtonOptions.validation = [];
        dropDownButtonOptions.events = this.options.events;
        dropDownButtonOptions.tetheredElement = this.htmlElement;
        var handleSelection = function (sender) {
            if (!this.options.multiSelect)
                this.dropDownListButton.hideList();
            this.widget.value = [].concat(this.dropDownListButton.selectedItems);
            setTimeout(function () {
                this.inputControl.focus();
            }.bind(this));
        }
        dropDownButtonOptions.events.push({
            eventName: jw.DOM.events.JW_EVENT_ON_SELECT_ITEM,
            listener: handleSelection.bind(this),
            enabled:true
        });
        dropDownButtonOptions.events.push({
            eventName: jw.DOM.events.JW_EVENT_ON_UNSELECT_ITEM,
            listener: handleSelection.bind(this),
            enabled:true
        });
        this.dropDownListButton = new jasonDropDownListButton(this.button, dropDownButtonOptions);
        this.button.classList.remove(jw.DOM.classes.JW_BORDERED);
        //this.initializeEvents();
        if (this.options.dropDownList)
            this.inputControl.setAttribute(jw.DOM.attributes.READONLY_ATTR, true);
    }
}
/**
 * Shows the dropdown list.
 */
jasonComboboxUIHelper.prototype.showList = function () {
    this.dropDownListButton.ui.showList();
}
/**
 * Hides the drop down list.
 */
jasonComboboxUIHelper.prototype.hideList = function (focus) {
    this.dropDownListButton.ui.hideList();
}
/**
 * Toggles dropdown list.
 */
jasonComboboxUIHelper.prototype.toggleDropdownList = function () {
    this.dropDownListButton.ui.toggleList();
}
/**
 * Initializes event listeners.
 */
jasonComboboxUIHelper.prototype.initializeEvents = function () {
    /*we do not want when user clicks in the input control to hide the list*/
    this.eventManager.addEventListener(this.inputControl, jw.DOM.events.CLICK_EVENT, this.oninputControlClick);

    /*when user starts typing start search in the underlying datasource.*/
    /**
     *  <= IE11 versions have a bug where the input event fires on focus.
     * https://connect.microsoft.com/IE/feedback/details/810538/ie-11-fires-input-event-on-focus
     * Microsoft states that they have fixed on the new MS Edge.
     */
    //this.inputControl.addEventListener(jw.DOM.events.INPUT_EVENT, this.oninputControlChange);

    this.inputControl.addEventListener(jw.DOM.events.KEY_DOWN_EVENT, this.onComboboxKeyDown);
    this.inputControl.addEventListener(jw.DOM.events.KEY_UP_EVENT, this.onComboboxKeyUp);
}
/**
 * Sets the item index (selected item).
 * @param {number} itemIndex - Combobox item index.
 */
jasonComboboxUIHelper.prototype.updateInputTextFromSelection = function () {
    this.widget.value = [].concat(this.dropDownListButton.selectedItems);
}
/**
 * @ignore
 * Formats the combobox's item string value.
 */
jasonComboboxUIHelper.prototype.formatinputControl = function (dataItem) {
    var fieldValues = [];
    if (this.options.displayFields) {
        this.options.displayFields.forEach(function (displayField) {
            fieldValues.push(dataItem[displayField]);
        });
    }
    var displayText = dataItem._NoData_;
    if (!displayText)
        displayText = typeof dataItem == "string" ? dataItem : jasonWidgets.common.formatString(this.options.displayFormat, fieldValues);
    dataItem._jw_Searchable_value = fieldValues.join(" ");
    return displayText;
}
/**
 * Iterates through the <li> items of the dropdown list, to find an item based on its text 
 */
jasonComboboxUIHelper.prototype.findItem = function (itemText) {
    for (var i = 0; i = this.dropDownListButton.ui.dropDownList.children.length - 1; i++) {
        var childItemText = this.dropDownListButton.ui.dropDownList.children[i].innerText || this.dropDownListButton.ui.dropDownList.children[i].textContent;
        if (childItemText == itemText)
            return this.dropDownListButton.ui.dropDownList.children[i];
    }
    return null;
}
/**
 * Combobox input click event listener.
 */
jasonComboboxUIHelper.prototype.oninputControlClick = function (clickEvent) {
    if(this.widget.readonly || !this.widget.enabled)
        return;
    if (this.options.dropDownList == true) {
        this.toggleDropdownList();
    }
}
/**
 * Combobox input change event listener.
 */
jasonComboboxUIHelper.prototype.oninputControlChange = function (inputChangeEvent) {
    if(this.widget.readonly || !this.widget.enabled)
        return;
    this.clearSelection();
    inputChangeEvent.stopPropagation();
}
/**
 * Clears the currently selected item.
 */
jasonComboboxUIHelper.prototype.clearSelection = function () {
    this.dropDownListButton.ui.clearSelection();
}
/**
 * Formats number when input looses focus.
 */
jasonComboboxUIHelper.prototype.onTextInputBlur = function (event,sender) {
    jasonTextboxUIHelper.prototype.onTextInputBlur.call(this, event, sender);
}
/**
 * 
 */
jasonComboboxUIHelper.prototype.onTextInputFocus = function (event,sender) {
    jasonTextboxUIHelper.prototype.onTextInputFocus.call(this,event,sender);
}
/**
 * Keydown event listener.
 */
jasonComboboxUIHelper.prototype.onComboboxKeyDown = function (keyDownEvent) {
    if(this.widget.readonly || !this.widget.enabled)
        return;
    var keyCode = keyDownEvent.which || keyDownEvent.keyCode;
    switch (keyCode) {
        case 27: {//when ESC is clicked hide the list.
            this.hideList();
            this.inputControl.focus();
            break;
        }
    }
}
/**
 * KeyUp event listener.
 */
jasonComboboxUIHelper.prototype.onComboboxKeyUp = function (keyUpEvent) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var keyCode = keyUpEvent.which || keyUpEvent.keyCode;
    var canShowDropDown = false;
    switch (keyCode) {
        case jw.keycodes.backspace:
        case jw.keycodes.delete: {
            this.widget.clearSelection();
        }
        case jw.keycodes.downArrow:{
            canShowDropDown = true;
        }
    }
    if (this.dropDownListButton.selectedItems.length > 0) {
        var self = this;
        var clearSelection = this.dropDownListButton.selectedItems.filter(function (cmbItem) {
            return cmbItem._jw_Searchable_value == self.inputControl.value;
        }).length == 0;
        if (clearSelection)
            this.widget.clearSelection();
    }
    if (keyCode > 46 || canShowDropDown) {
        this.showList();
        if (this.options.autoFilter) {
            this.widget.search();
        }
        this.inputControl.focus();
        if (keyCode == jw.keycodes.downArrow) {
            this.dropDownListButton.ui.scrollItemIntoView(true);
        }
    }
    keyUpEvent.stopPropagation();
}
/**
 * Updates UI when enable/disable state is changed.
 * @abstract
 */
jasonComboboxUIHelper.prototype.updateEnabled = function (enable) {
    jasonButtonTextboxUIHelper.prototype.updateEnabled.call(this, enable);
    this.dropDownListButton.enabled = enable;
}
/**
 * Updates UI when visible state is changed.
 * @abstract
 */
jasonComboboxUIHelper.prototype.updateVisible = function (visible) {
    jasonButtonTextboxUIHelper.prototype.updateVisible.call(this, visible);
}
/**
 * Updates UI when readonly state is changed.
 * @abstract
 */
jasonComboboxUIHelper.prototype.updateReadOnly = function (readonly) {
    jasonButtonTextboxUIHelper.prototype.updateReadOnly.call(this, readonly);
    this.dropDownListButton.readonly = readonly;
}
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonMenu.prototype = Object.create(jasonBaseWidget.prototype);
jasonMenu.prototype.constructor = jasonMenu;

/**
 * @namespace Menus
 * @description Menu and context menu classes.
 * 
 * Keyboard navigation:
 * 
 * @property MenuItem {MenuItem} - MenuItem keyboard support.
 * @property MenuItem.Tab {Keyboard} - Moves the next menu item or to the menu item arrow element if the menu item has sub-items.
 * @property MenuItem.Shift+Tab {Keyboard} - Moves the previous menu item or to the menu item arrow element if the previous menu item has sub-items.
 * @property MenuItem.ArrowElement {MenuItem.ArrowElement} - MenuItem arrow element keyboard support.
 * @property MenuItem.ArrowElement.Enter {Keyboard} - Displays the sub-items of the menu item.
 * 
 */


/**
 * @class
 * @name jasonMenuOptions
 * @description Configuration for the menu/context menu widget.
 * @memberOf Menus
 * @augments Common.jasonWidgetOptions
 * @property {string}   [orientation=horizontal]          - Horizontal or vertical. Defines how the menu will be rendered.
 * @property {object}   [menu=undefined]                 - JSON object representation of the menu. If defined, the menu widget will use it to create the HTML menu structure.
 * @property {object}   animation            - Animation configuration. 
 * @property {number}   [animation.delay=5]      - Numeric value to define animation delay. Range is 1-10.
 * @property {number}   [width=undefined]                - Sets the width of the menu.
 * @property {number}   [height=undefined]                - Sets the height of the menu. 
 * @property {number}   [hideDelay=undefined]            - If defined, it will give the user a grace period before it hides the menu. If the user mouses over the menu container the menu will not be hidden.
 * @property {boolean}  [autoHide=false]             - If true, the menu will be hidden if the user clicks outside the menu.
 * @property {boolean}  [expandMenuOnHover=true] - If true, the menu item will be expanded on hover.
 * @property {boolean}  [invokable=false] - If true, the menu is hidden and it will be invoked when the invokable element is clicked.
 */

/**
 * @event Menus.jasonMenu#onShow
 * @type {object}
 * @description Occurs when menu is shown.
 * @property {Menus.jasonMenu} sender - The menu instance.
 */

/**
 * @event Menus.jasonMenu#onHide
 * @type {object}
 * @description Occurs when the menu is hidden.
 * @property {Menus.jasonMenu} sender - The menu instance.
 */

/**
 * @event Menus.jasonMenu#onItemClick
 * @type {object}
 * @description Occurs when item is clicked.
 * @property {Menus.jasonMenu} sender - The menu instance.
 * @property {object} eventInfo - The position information.
 * @property {event} eventInfo.event - The DOM event.
 * @property {Menus.jasonMenuItem} eventInfo.item - The jasonMenu item.
 */

/**
 * @event Menus.jasonMenu#onCheckBoxClicked
 * @type {object}
 * @description Occurs when checkbox is clicked.
 * @property {Menus.jasonMenu} sender - The menu instance.
 * @property {object} eventInfo - The position information.
 * @property {event} eventInfo.event - The DOM event.
 * @property {Menus.jasonMenuItem} eventInfo.item - The jasonMenu item.
 * @property {boolean} eventInfo.checked - The checked value of the menu item.
 */


/**
 * @constructor
 * @memberOf Menus
 * @description Menu widget. Can populate items either from HTML or .json.
 * @augments Common.jasonBaseWidget
 * @param {HTMLElement} htmlElement - DOM element that the menu will be bound to.
 * @param {Menus.jasonMenuOptions} options - jasonMenu options.
 * @fires Menus.jasonMenu#event:onShow
 * @fires Menus.jasonMenu#event:onHide
 * @fires Menus.jasonMenu#event:onItemClick
 * @fires Menus.jasonMenu#event:onCheckBoxClicked
 */
function jasonMenu(htmlElement, options, uiHelper) {
    this.items = [];
    /*Default menu options*/
    this.defaultOptions = { orientation: 'vertical', animation: { delay: 9 }, expandMenuOnHover: true, invokable: false };
    jasonBaseWidget.call(this, "jasonMenu", htmlElement, options, uiHelper);
}

function createJasonMenuDividerItem() {
    var result = new jasonMenuItem();
    result.isDivider = true;
    result.clickable = false;
    return result;
}

//#region jasonMenuItem
jasonMenuItem.prototype = Object.create(jasonBaseWidget.prototype);
jasonMenuItem.prototype.constructor = jasonMenuItem;
/**
 * @class
 * @description Object representation of a jasonMenuItem.
 * @memberOf Menus
 * @property {string} caption - Menu item caption.
 * @property {string} title - Menu item title (tooltip).
 * @property {boolean} enabled - Gets/Sets enabled state for the item.
 * @property {array} items - Item's subitems.
 * @property {jasonMenuItem}  parent - Item's parent menu item.
 * @property {HTMLElement} element - The li elmement of the item.
 * @property {HTMLElement} content - A HTMLElement that would be the content of the item.
 * @property {number} level - Item's nest level. Root items start with zero.
 * @property {string} name - Item's name.
 * @property {boolean} hasCheckbox - If true, a checkbox input element is rendered.
 * @property {boolean} checked - Gets/Sets the checked state of the item if it has a checkbox.
 * @property {boolean} clickable - If true, item accepts click events.
 * @property {HTMLElement} checkboxElement - The input element of the item if it has a checkbox.
 * @property {string} icon - Icon css class for the item.
 * @property {boolean} isDivider - If true, the item is a special menu item - a menu divider.
 */
function jasonMenuItem(htmlElement, options, uiHelper) {
    jasonBaseWidget.call(this, "jasonMenuItem", htmlElement, options, uiHelper);
    this.caption = '';
    this.title = '';
    this.enabled = true;
    this.items = [];
    this.parent = null;
    this.content = null;
    this.level = null;
    this.name = null;
    this.hasCheckBox = false;
    this.checked = false;
    this.clickable = true;
    this.checkBoxElement = null;
    this.icon = null;
    this.isDivider = false;
    this.assign = this.assign.bind(this);
}
jasonMenuItem.prototype.assign = function (sourceMenuItem) {
    this.caption = sourceMenuItem.caption;
    this.title = sourceMenuItem.title;
    this.enabled = sourceMenuItem.enabled;
    this.items = sourceMenuItem.items;
    //this.parent = sourceMenuItem.parent;
    //this.element = sourceMenuItem.element;
    this.content = sourceMenuItem.content;
    this.level = sourceMenuItem.level;
    this.name = sourceMenuItem.name;
    this.hasCheckBox = sourceMenuItem.hasCheckBox;
    this.checked = sourceMenuItem.checked;
    this.clickable = sourceMenuItem.clickable;
    //this.checkBoxElement = sourceMenuItem.;
    this.icon = sourceMenuItem.icon;
    this.isDivider = sourceMenuItem.isDivider;
}








/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonMenuWidgetParser.prototype.constructor = jasonMenuWidgetParser;

jasonMenuWidgetDOMParser.prototype = Object.create(jasonMenuWidgetParser.prototype);
jasonMenuWidgetDOMParser.prototype.constructor = jasonMenuWidgetDOMParser;

jasonMenuWidgetJSONParser.prototype = Object.create(jasonMenuWidgetParser.prototype);
jasonMenuWidgetJSONParser.prototype.constructor = jasonMenuWidgetJSONParser;
/**
 * Base class for menu parsers. Menu parser are responsible for taking JSON or HTML and create the menu.
 * If the input is JSON it will create HTML structure of the JSON representation.
 * In other words if you provide the json representation of the menu, the parser will create the HTML for you.
 * @constructor
 * @ignore
 */
function jasonMenuWidgetParser(menuUI) {
    this.menuUI = menuUI;
    return jasonMenuWidgetParser;
}
/**
* Creates sub menu items container.
* @param {object} menuElement - HTMLElement.
*/
jasonMenuWidgetParser.prototype.createSubItemsContainer = function () {
    var menuItemsContainer = this.menuUI.createElement("div");
    menuItemsContainer.classList.add(jw.DOM.classes.JW_MENU_ITEMS_CONTAINER_CLASS);
    menuItemsContainer.style.display = "none";
    return menuItemsContainer;
}
/**
 * Creates menu item caption container.
 * @param {object} liElement - HTMLElement.
 * @param {object} menuItem  - jasonMenuItem.
 */
jasonMenuWidgetParser.prototype.createMenuItemCaption = function (liElement, menuItem) {
    var textNode = jasonWidgets.common.getNodeText(liElement);
    //if the first child node is a textnode get set its text as the caption.
    if (textNode) {
        menuItem.caption = textNode.textContent.trim();
        jasonWidgets.common.removeNodeText(liElement);
    }
    var menuItemCaptionContainer = this.menuUI.createElement("div");
    menuItemCaptionContainer.classList.add(jw.DOM.classes.JW_MENU_ITEM_CAPTION);
    if (menuItem.isDivider) {
        menuItemCaptionContainer.appendChild(this.menuUI.createElement("hr"));
        liElement.classList.add(jw.DOM.classes.JW_MENU_ITEM_DIVIDER);
        liElement.setAttribute(jw.DOM.classes.JW_MENU_ITEM_NO_HIGHLIGHT_ATTR, "true");
    }else{
        var menuCaption = this.menuUI.createElement("div");
        menuCaption.classList.add(jw.DOM.classes.JW_MENU_ITEM_CAPTION);

        
        menuCaption.appendChild(this.menuUI.createTextNode(menuItem.caption));
        menuItemCaptionContainer.appendChild(menuCaption);
    }


    liElement._jasonMenuItemCaptionContainer = menuItemCaptionContainer;
    liElement.appendChild(menuItemCaptionContainer);
}
/**
 * Creates menu item arrow icon container.
 * @param {object} liElement - HTMLElement.
 */
jasonMenuWidgetParser.prototype.createMenuItemArrowIcon = function (liElement) {
    if (liElement._jasonMenuItemCaptionContainer) {
        var arrowElement = jw.htmlFactory.createJWButton(null, this.menuUI.options.orientation == "horizontal" && menuLevel == 0 ? jw.DOM.icons.CHEVRON_DOWN : jw.DOM.icons.CHEVRON_RIGHT);
        //var iconContainer = this.menuUI.createElement("div");
        //iconContainer.classList.add(jw.DOM.classes.JW_MENU_ITEM_ARROW);
        //var iconElement = this.menuUI.createElement("i");
        //var menuLevel = liElement.getAttribute(jw.DOM.attributes.JW_MENU_ITEM_LEVEL_ATTRIBUTE);
        //iconElement.className = this.menuUI.options.orientation == "horizontal" && menuLevel == 0 ? jw.DOM.icons.JW_ICON_CHEVRON_DOWN : jw.DOM.icons.JW_ICON_CHEVRON_RIGHT;
        //iconContainer.appendChild(iconElement);
        liElement._jasonMenuItemCaptionContainer.appendChild(arrowElement);
    }
}
/**
 * Creates menu item icon container.
 * @param {object} liElement - HTMLElement.
 * @param {string} iconClass - icon css class.
 */
jasonMenuWidgetParser.prototype.createMenuItemIcon = function (liElement,iconClass) {
    if (liElement._jasonMenuItemCaptionContainer) {
        var iconContainer = this.menuUI.createElement("div");
        iconContainer.classList.add(jw.DOM.classes.JW_MENU_ICON);
        var iconElement = this.menuUI.createElement("i");
        iconElement.className = (iconClass);
        var menuLevel = liElement.getAttribute(jw.DOM.attributes.JW_MENU_ITEM_LEVEL_ATTRIBUTE);
        iconContainer.appendChild(iconElement);
        liElement._jasonMenuItemCaptionContainer.insertBefore(iconContainer, liElement._jasonMenuItemCaptionContainer.firstChild);
    }
}
/**
 * Determines if an arrow is needed for a menu element
 * @param {object} liElement - HTMLElement.
 */
jasonMenuWidgetParser.prototype.mustAddArrowIcon = function (liElement) {
    var result = false;
    result = liElement.children.length > 0;
    if(liElement.children.length == 1 && liElement.children[0].className == JW_MENU_ITEM_CAPTION)
        result = false;
    return result;
}



//#region DOM Parser
/**
 * DOM parser is parsing HTML and creates menu items.
 * @constructor
 * @ignore
 */
function jasonMenuWidgetDOMParser(menuUI) {
    jasonMenuWidgetParser.call(this, menuUI);
}
/**
 * Creates menu item from UI element 
 * @param {object} liElement - HTMLElement.
 */
jasonMenuWidgetDOMParser.prototype.createMenuItem = function (liElement) {
    var result = new jasonMenuItem(liElement,null,null);
    var menuItemLevel = liElement.getAttribute(jw.DOM.attributes.JW_MENU_ITEM_LEVEL_ATTRIBUTEJW_MENU_ITEM_LEVEL_ATTRIBUTE);
    if (menuItemLevel)
        result.level = parseInt(menuItemLevel);


    jasonWidgets.common.setData(liElement, jw.DOM.attributeValues.JW_MENU_ITEM_DATA_KEY, result);
    return result;
}
/**
 * Sets event handlers for the newly created menu item.
 * @param {object} liElement - HTMLElement.
 */
jasonMenuWidgetDOMParser.prototype.setMenuItemEvents = function (liElement,menuItem) {
    this.menuUI.eventManager.addEventListener(liElement, jw.DOM.events.CLICK_EVENT, this.menuUI.onItemClick, true);
    this.menuUI.eventManager.addEventListener(liElement, jw.DOM.events.TOUCH_START_EVENT, this.menuUI.onItemTouch, true);
    this.menuUI.eventManager.addEventListener(liElement, jw.DOM.events.MOUSE_ENTER_EVENT, this.menuUI.onItemMouseEnter, true);
    this.menuUI.eventManager.addEventListener(liElement, jw.DOM.events.MOUSE_LEAVE_EVENT, this.menuUI.onItemMouseLeave, true);
    this.menuUI.eventManager.addEventListener(liElement, jw.DOM.events.KEY_DOWN_EVENT, this.menuUI.onItemKeyDown, true);
    var arrowElement = liElement.querySelectorAll(".jw-menu-item-arrow .jw-button")[0];
    if (arrowElement) {
        this.menuUI.eventManager.addEventListener(arrowElement, jw.DOM.events.CLICK_EVENT, this.menuUI.onItemArrowClick, true);
    }
    if (menuItem.hasCheckBox) {
        this.menuUI.eventManager.addEventListener(menuItem.checkBoxElement, jw.DOM.events.CLICK_EVENT, this.menuUI.onCheckboxClick);
    }
}
/**
 * Creates json representation of the UL element structure.
 * @param {object} ulElementMenu - HTMLElement.
 */
jasonMenuWidgetDOMParser.prototype.populateMenu = function (ulElementMenu) {
    var self = this;
    var menu = this.menuUI.widget;
    //recursive function that creates menu item containers for elements that need them.
    //and constructs the jasonMenu representation of the menu DOM.
    var populateItems = function (parentMenuItem, menuItemElement) {
        //we iterate through the child items and create a menu item for each child LI element.
        for (var i = 0 ; i <= menuItemElement.children.length - 1; i++) {
            var childElement = menuItemElement.children[i];
            
            if (childElement.tagName == "UL") {
                var subItemsMenuContainer = self.createSubItemsContainer();
                var subItemsUL = self.menuUI.createElement("ul");
                subItemsMenuContainer.appendChild(subItemsUL);
                menuItemElement.appendChild(subItemsMenuContainer);
                menuItemElement._jasonMenuItemsContainer = subItemsMenuContainer;
                jw.common.moveChildrenTo(childElement, subItemsUL);
                childElement.setAttribute("fordelete", true);
                for (var x = 0; x <= subItemsUL.children.length - 1; x++) {
                    var subMenuItemElement = subItemsUL.children[x];
                    var subMenuItem = self.createMenuItem(subMenuItemElement);
                    jw.htmlFactory.convertToJWMenuItem(self.menuUI.options.orientation, subMenuItemElement, subMenuItem);
                    self.setMenuItemEvents(subMenuItemElement,subMenuItem);
                    parentMenuItem.items.push(subMenuItem);
                    subMenuItem.parent = parentMenuItem;
                    subMenuItem.level = parentMenuItem.level + 1;
                    populateItems(subMenuItem, subMenuItemElement);
                }
            } else {
                if (childElement.tagName == "LI") {
                    jw.htmlFactory.convertToJWMenuItem(self.menuUI.options.orientation, childElement);
                }
            }
        }
        var itemsToDelete = jw.common.getElementsByAttribute(menuItemElement, "fordelete", "true");
        for (var i = 0 ; i <= itemsToDelete.length - 1; i++) {
            menuItemElement.removeChild(itemsToDelete[i]);
        }
    }
    //iterating through the root items of the UL element
    for (var i = 0; i <= ulElementMenu.children.length - 1; i++) {
        var rootMenuElement = ulElementMenu.children[i];
        rootMenuElement.setAttribute(jw.DOM.attributes.JW_MENU_ITEM_LEVEL_ATTRIBUTE, 0);
        var rootMenuItem = this.createMenuItem(rootMenuElement);
        jw.htmlFactory.convertToJWMenuItem(this.menuUI.options.orientation == "horizontal" ? "vertical" : "horizontal", rootMenuElement, rootMenuItem);
        this.setMenuItemEvents(rootMenuElement, rootMenuItem);
        rootMenuItem.level = 0;
        menu.items.push(rootMenuItem);
        populateItems(rootMenuItem, rootMenuElement);
    }
    return menu;
}
//#endregion


//#region JSON Parser
/**
 * JSON parser is parsing a json representation of the menu and creates HTML.
 * @constructor
 * @ignore
 */
function jasonMenuWidgetJSONParser(menuUI) {
    jasonMenuWidgetParser.call(this, menuUI);
    this.createMenuElementFromItem = this.createMenuElementFromItem.bind(this);
}
/**
 * Create HTML structure from the menu json representation.
 * @param {object} jasonMenu - jasonMenu.
 */
jasonMenuWidgetJSONParser.prototype.populateMenu = function (jasonMenu) {
    var self = this;
    var populateItems = function (parentMenuItem, menuItemUL) {
        var subMenuItemsUL;
        var subItemsContainer;
        //if the parent item has child items
        //then we create a UL element to place the child items.
        if (parentMenuItem.items.length > 0) {
            subItemsContainer = self.createSubItemsContainer();
            subMenuItemsUL = self.menuUI.createElement("ul");
            subItemsContainer.appendChild(subMenuItemsUL);
            parentMenuItem.htmlElement.appendChild(subItemsContainer);
            parentMenuItem.htmlElement._jasonMenuItemsContainer = subItemsContainer;
        }
        var menuULToUse = subMenuItemsUL != void 0 ? subMenuItemsUL : menuUL;
        //iterating through the child items to create LI elements.
        for (var i = 0 ; i <= parentMenuItem.items.length - 1; i++) {
            var newMenuItem = jw.common.isJWWidget(parentMenuItem.items[i]) ? parentMenuItem.items[i] : null;
            var newMenuElement;
            if (newMenuItem == null) {
                newMenuElement = self.menuUI.createElement("li");
                newMenuItem = new jasonMenuItem(newMenuElement, null, null);
                newMenuItem.assign(parentMenuItem.items[i]);
                newMenuItem.clickable = newMenuItem.clickable == void 0 ? true : newMenuItem.clickable;
                newMenuItem.parent = parentMenuItem;
                newMenuItem.level = parentMenuItem.level + 1;
                self.createMenuElementFromItem(newMenuItem, newMenuElement);
            } else {
                newMenuElement = self.createMenuElementFromItem(newMenuItem, newMenuItem.htmlElement);
            }
            menuULToUse.appendChild(newMenuElement);
            parentMenuItem.items[i] = newMenuItem;
            if (newMenuItem.items.length > 0) {
                populateItems(newMenuItem, menuULToUse);
            }
        }
    }
    var menuUL = this.menuUI.ulMenuElement;
    //iterating through the root items of the UL element
    for (var i = 0; i <= jasonMenu.items.length - 1; i++) {
        var newMenuItem = jw.common.isJWWidget(jasonMenu.items[i]) ? jasonMenu.items[i] : null;
        var newMenuElement;
        if (newMenuItem == null) {
            newMenuElement = self.menuUI.createElement("li");
            newMenuItem = new jasonMenuItem(newMenuElement, null, null);
            newMenuItem.assign(jasonMenu.items[i]);
            newMenuItem.clickable = newMenuItem.clickable == void 0 ? true : newMenuItem.clickable;
            newMenuItem.level = 0;
            self.createMenuElementFromItem(newMenuItem, newMenuElement);
        }
        else{
            newMenuElement = self.createMenuElementFromItem(newMenuItem, newMenuItem.htmlElement);
        }
        newMenuElement.setAttribute(jw.DOM.attributes.JW_MENU_ITEM_LEVEL_ATTRIBUTE, newMenuItem.level);
        menuUL.appendChild(newMenuElement);

        jasonMenu.items[i] = newMenuItem;
        populateItems(newMenuItem, menuUL);
    }
    return menuUL;
}
/**
 * Creates menu UI element from menu item 
 * @param {object} menuItem - jasonMenuItem.
 */
jasonMenuWidgetJSONParser.prototype.createMenuElementFromItem = function (menuItem,menuElement) {
    var self = this;
    //the newly created element.
    var menuItemElement;

    if (menuItem.content) {
        menuItemElement = menuElement === void 0 ? this.menuUI.createElement("li") : menuElement;
        if (!menuItem.content.tagName) {
            var menuContent = this.menuUI.createElement("div");
            menuContent.innerHTML = menuItem.content;
            menuItemElement.appendChild(menuContent);
        } else {
            menuItemElement.appendChild(menuItem.content);
        }
        menuItemElement.classList.add(jw.DOM.classes.JW_MENU_ITEM_CONTENT);
        menuItem.content.classList.add(jw.DOM.classes.JW_MENU_ITEM_CONTENT_CLASS);
    } else {
        if (menuElement === void 0)
            menuItemElement = jw.htmlFactory.createJWMenuItem(this.menuUI.options.orientation, menuItem);
        else {
            menuItemElement = menuElement
            jw.htmlFactory.createJWMenuItem(this.menuUI.options.orientation, menuItem, menuItemElement);
        }
        menuItem.htmlElement = menuItemElement;
        if (menuItem.isDivider) {
            menuItemElement.appendChild(this.menuUI.createElement("hr"));
            menuItemElement.classList.add(jw.DOM.classes.JW_MENU_ITEM_DIVIDER);
            menuItemElement.setAttribute(jw.DOM.attributeValues.JW_MENU_ITEM_NO_HIGHLIGHT_ATTR, "true");
        }
        if (menuItem.hasCheckBox) {
            var checkBoxElement = jw.common.getElementsByAttribute(menuItemElement, "type", "checkbox")[0];
            if (checkBoxElement != void 0) {
                menuItem.checkBoxElement = checkBoxElement;
                this.menuUI.eventManager.addEventListener(checkBoxElement, jw.DOM.events.CLICK_EVENT, this.menuUI.onCheckboxClick);
            }
        }
        if (!menuItem.isDivider) {
            this.menuUI.eventManager.addEventListener(menuItemElement, jw.DOM.events.CLICK_EVENT, this.menuUI.onItemClick, true);
            this.menuUI.eventManager.addEventListener(menuItemElement, jw.DOM.events.MOUSE_ENTER_EVENT, this.menuUI.onItemMouseEnter);
            this.menuUI.eventManager.addEventListener(menuItemElement, jw.DOM.events.MOUSE_LEAVE_EVENT, this.menuUI.onItemMouseLeave);
            this.menuUI.eventManager.addEventListener(menuItemElement, jw.DOM.events.KEY_DOWN_EVENT, this.menuUI.onItemKeyDown,true);
            var arrowElement = menuItemElement.querySelectorAll(".jw-menu-item-arrow .jw-button")[0];
            if (arrowElement) {
                this.menuUI.eventManager.addEventListener(arrowElement, jw.DOM.events.CLICK_EVENT, this.menuUI.onItemArrowClick, true);
            }
        }
    }
    if (menuElement == void 0)
        jasonWidgets.common.setData(menuItemElement, jw.DOM.attributeValues.JW_MENU_ITEM_DATA_KEY, menuItem);
    return menuItemElement;
}
//#endregion
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonMenuUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonMenuUIHelper.prototype.constructor = jasonMenuUIHelper;
/**
 * @constructor
 * @ignore
 * @param {HTMLElement} htmlElement - DOM element that the menu will be bound to.
 * @param {any} options - jasonMenu options. {@link jasonMenuWidgetDefaultOptions}
 */
function jasonMenuUIHelper(widget, htmlElement) {
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);

    if (this.htmlElement == void 0) {
        this.htmlElement = this.createElement("span");
    }
    /*If the htmlElement is a UL list then use it otherwise create it*/
    this.ulMenuElement = this.htmlElement.tagName == "UL" ? this.htmlElement : this.createElement("ul");
    if (!this.ulMenuElement.classList.contains(this.baseClassName))
        this.widget.addBaseClassName(this.ulMenuElement);

    /*The htmlElment for this widget would be a div container for the UL element*/
    this.menuContainer = this.createElement("div");
    this.menuContainer.classList.add(jw.DOM.classes.JW_MENU_CONTAINER_CLASS);


    this.ulMenuElement.classList.add(jw.DOM.classes.JW_MENU_CLASS);

    this.invokableElement = null;

    /*If there is an explicit width value then set it.*/
    if (this.widget.options.width)
        this.ulMenuElement.style.width = this.options.width + "px";

    if (this.widget.options.height)
        this.ulMenuElement.style.height = this.options.height + "px";

    /*Adding orientation CSS class*/
    if (this.widget.options.orientation.toLowerCase() == "horizontal")
        this.htmlElement.classList.add(jw.DOM.classes.JW_MENU_HORIZONTAL);

    this.checkBoxElements = [];

    /*Setting functions calling context*/
    this.showMenu = this.showMenu.bind(this);
    this.hideMenu = this.hideMenu.bind(this);

    /*Menu events*/
    this.onCheckboxClick = this.onCheckboxClick.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
    this.onItemTouch = this.onItemTouch.bind(this);
    this.onItemMouseEnter = this.onItemMouseEnter.bind(this);
    this.onItemMouseLeave = this.onItemMouseLeave.bind(this);
    this.onItemKeyDown = this.onItemKeyDown.bind(this);
    this.toggleCheckBox = this.toggleCheckBox.bind(this);
    this.onItemArrowClick = this.onItemArrowClick.bind(this);
    var self = this;
    if (this.options.autoHide) {
        jwDocumentEventManager.addDocumentEventListener(jw.DOM.events.MOUSE_DOWN_EVENT, function (mouseDownEvent) {
            if (self.menuContainer.style.display != "none") {
                var isOutOfContainer = jasonWidgets.common.isMouseEventOutOfContainerAndNotAChild(self.menuContainer, mouseDownEvent)
                if (isOutOfContainer && self.canHideMenu)
                    self.hideMenu();
            }
        });
    }

    jwDocumentEventManager.addDocumentEventListener(jw.DOM.events.TOUCH_END_EVENT, function (touchEndEvent) {
        if (self.menuContainer.style.display != "none") {
            var isOutOfContainer = jasonWidgets.common.isMouseEventOutOfContainerAndNotAChild(self.menuContainer, touchEndEvent.changedTouches[0]);
            if (isOutOfContainer && self.previousShowMenuItem) {
                var parent = self.previousShowMenuItem;
                while (parent) {
                    self.hideMenuItemContents(parent);
                    parent = parent.parent;
                }
            }
        }
    });

    /*Finally creating the menu*/
    this.menu = this.createMenu();
    this.canHideMenu = true;
    this.canHideSubMenu = true;
    this.disableMouseEvents = false;
    this.previousShowMenuItem = null;
    this.lastMenuItemVisibleContents = null;
}
//#region Placement and UI
/**
 * Calculates the absolute coordinates of the invokable element and displays the menu 
 */
jasonMenuUIHelper.prototype.showMenu = function (invokableElement,left,top) {
    if (invokableElement) {
        this.invokableElement = invokableElement;
        var coordinates = invokableElement.getBoundingClientRect();// jasonWidgets.common.getOffsetCoordinates(invokableElement);
        this.menuContainer.style.display = "";
        this.ulMenuElement.style.width = this.getWiderElementWidthOfUL(this.ulMenuElement) + "px";
        this.menuContainer.style.top = top ? top + "px" : (coordinates.top + invokableElement.offsetHeight + 1) + "px";
        var width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
        //coordinates.Left = coordinates.Left > width ? width : coordinates.Left;
        this.menuContainer.style.left = left ? left + "px" : coordinates.left + this.menuContainer.offsetWidth >= width ? coordinates.left - (this.menuContainer.offsetWidth) + "px" : coordinates.left + "px";
        this.menuContainer.style.zIndex = jw.common.getNextAttributeValue("z-index") + 1;
        this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_SHOW);
        var firstFocusable = jw.common.getFirstFocusableElement(this.menuContainer);
        if (firstFocusable)
            firstFocusable.focus();
    }
}
/**
 * Hides the menu.
 */
jasonMenuUIHelper.prototype.hideMenu = function () {
    //hide all menu item content that possibly were visible.
    var menuItemContents = this.menuContainer.getElementsByClassName(jw.DOM.classes.JW_MENU_ITEMS_CONTAINER_CLASS);
    for (var i = 0; i <= menuItemContents.length - 1 ; i++) {
        menuItemContents[i].style.display = "none";
    }
    //de-activate all active menu items.
    var menuItems = this.menuContainer.getElementsByClassName(jw.DOM.classes.JW_MENU_ITEM_CLASS_ACTIVE);
    for (var i = 0; i <= menuItems.length - 1 ; i++) {
        menuItems[i].classList.remove(jw.DOM.classes.JW_MENU_ITEM_CLASS_ACTIVE);
    }
    this.menuContainer.style.display = "none";
    this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_HIDE);
}
/**
 * Returns the wider menu caption of a jasonMenuWidget menu item list.
 * @param {object} ulElement - HTMLElement.
 */
jasonMenuUIHelper.prototype.getWiderElementWidthOfUL = function (ulElement) {
    var result = 0;
    if (ulElement) {
        if (ulElement._jasonMenuWidgetWiderElementWidth)
            return ulElement._jasonMenuWidgetWiderElementWidth;
        var menuItemContent = ulElement.getElementsByClassName(jw.DOM.classes.JW_MENU_ITEM_CONTENT_CLASS);
        if (menuItemContent.length > 0) {
            ulElement._jasonMenuWidgetWiderElementWidth = menuItemContent[0].offsetWidth;
        }
        for (var i = 0; i <= ulElement.children.length - 1; i++) {
            //var menuCaptionContainer = ulElement.children[i].getElementsByClassName(JW_MENU_ITEM_CONTAINER)[0];
            var menuCaptionContainer = ulElement.children[i].getElementsByClassName(jw.DOM.classes.JW_MENU_ITEM_CAPTION)[0];
            var menuCaption = null;
            var iconWidth = ulElement.children[i].getElementsByClassName(jw.DOM.classes.JW_MENU_ITEM_ICON)[0];
            var arrowWidth = ulElement.children[i].getElementsByClassName(jw.DOM.classes.JW_MENU_ITEM_ARROW)[0];
            var checkboxWidth = ulElement.children[i].getElementsByClassName(jw.DOM.classes.JW_MENU_ITEM_CHECKBOX)[0];
            iconWidth = iconWidth ? iconWidth.offsetWidth : 0;
            arrowWidth = arrowWidth ? arrowWidth.offsetWidth : 0;
            checkboxWidth = checkboxWidth ? checkboxWidth.offsetWidth : 0;
            //if the li element has no menuCaption element it means that it did not have any sub-items but just text.
            //that is why the li element itself is the menu caption.
            //if (!menuCaptionContainer) {
            menuCaption = ulElement.children[i].getElementsByClassName(jw.DOM.classes.JW_MENU_ITEM_CAPTION)[0];
            //}
            var textWidth = 0;
            if (menuCaption) {
                //calculating text width of the lengthiest menu item , so we can grow the container of the menu items as needed
                //so the items can be displayed normally.
                //This value is stored for future usage so we do not have to caclulate it again.
                //This is more of a quick and dirty solution to the menu width issues. When there is more time a more elegant solution must be investigated.
                var temp = jasonWidgets.common.getComputedStyleProperty(menuCaption, "font-weight");
                temp = temp + " " + jasonWidgets.common.getComputedStyleProperty(menuCaption, "font-size");
                temp = temp + " " + jasonWidgets.common.getComputedStyleProperty(menuCaption, "font-family");
                temp = temp.replace("'", "");
                textWidth = jasonWidgets.common.getTextWidth(menuCaption.textContent.trim(), temp);
                //placing a limit on how wide a text can be to be shown without ellipsis
                if (textWidth > 300)
                    textWidth = 300;
            }
            //30 is the total padding applied from the parent nodes
            var calcWidth = textWidth > ulElement.children[i].offsetWidth ? ulElement.children[i].offsetWidth + textWidth
                : ulElement.children[i].offsetWidth + 5;
            //var calcWidth = textWidth > menuCaption.offsetWidth ? menuCaption.offsetWidth + (menuCaption.offsetWidth - textWidth)
            //    : menuCaption.offsetWidth + 15;
            if (calcWidth > result)
                result = calcWidth + iconWidth + arrowWidth + checkboxWidth;
        }
        if (ulElement._jasonMenuWidgetWiderElementWidth)
            ulElement._jasonMenuWidgetWiderElementWidth = result > ulElement._jasonMenuWidgetWiderElementWidth ? result : ulElement._jasonMenuWidgetWiderElementWidth;// + (result / 4);
        else
            ulElement._jasonMenuWidgetWiderElementWidth = result;
        return ulElement._jasonMenuWidgetWiderElementWidth;
    }
    return result;
}
//#endregion

//#region Events
/**
 * On Checkbox element click.
 */
jasonMenuUIHelper.prototype.getMenuItemFromEvent = function (event) {
    var menuElement =  event.target.tagName == "LI" ? event.target: jasonWidgets.common.getParentElement("LI", event.target);
    return jasonWidgets.common.getData(menuElement, jw.DOM.attributeValues.JW_MENU_ITEM_DATA_KEY);
}

jasonMenuUIHelper.prototype.onCheckboxClick = function (clickEvent) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    this.toggleCheckBox(clickEvent);
    clickEvent.stopPropagation();
}
/**
 * Toggle checkbox checked state
 */
jasonMenuUIHelper.prototype.toggleCheckBox = function (event) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var menuItem = this.getMenuItemFromEvent(event);
    if(menuItem){
        if (menuItem.checkBoxElement && menuItem.enabled) {
            var eventData = { event: event, item: menuItem, checked: menuItem.checkBoxElement.checked, cancel: false };
            this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_JW_MENU_CHECKBOX_CLICKED, eventData);
            //if the listener cancels the event, revert the checkbox state.
            if (eventData.cancel) {
                menuItem.checkBoxElement.checked = !menuItem.checkBoxElement.checked;
            }
          }
    }
}
/**
 * Triggered when a menu item is clicked.
 * @param {object} itemClickEvent - HTMLEvent.
 */
jasonMenuUIHelper.prototype.onItemClick = function (clickEvent) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var menuItem = this.getMenuItemFromEvent(clickEvent);
    if (menuItem) {
        if (menuItem.clickable && menuItem.enabled) {
            this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_JW_MENU_ITEM_CLICKED, { event: clickEvent, item: menuItem, uiHelper: this });
            //if disableMouseEvents = true, it means that the user clicked outside the main UL menu element, but inside the contents of a menu item
            //which means we should not hide the menu.
            if (this.widget.options.autoHide && !this.disableMouseEvents)
                this.hideMenu();
        }
    }
    clickEvent.stopPropagation();
}
/**
 * 
 */
jasonMenuUIHelper.prototype.onItemArrowClick = function (clickEvent) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var menuItem = this.getMenuItemFromEvent(clickEvent);
    if (menuItem) {
        if (this.previousShowMenuItem) {
            //hide all previously shown items, up to the level of the currently touched item.
            if (menuItem.level <= this.previousShowMenuItem.level) {
                var parent = this.previousShowMenuItem;
                while (parent && parent.level >= menuItem.level) {
                    this.hideMenuItemContents(parent);
                    parent = parent.parent;
                }
            }
        }
        this.showMenuItemContents(menuItem);
        if (menuItem.htmlElement._jasonMenuItemsContainer) {
            focusable = jw.common.getFirstFocusableElement(menuItem.htmlElement._jasonMenuItemsContainer);
            if (focusable)
                focusable.focus();
        }
    }
}
/**
 * Triggered when a menu item is touched.
 * @param {HTMLEvent} itemClickEvent - HTMLEvent.
 */
jasonMenuUIHelper.prototype.onItemTouch = function (touchEvent) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    touchEvent.preventDefault();
    touchEvent.stopPropagation();
    var menuItem = this.getMenuItemFromEvent(touchEvent);
    if (this.previousShowMenuItem) {
        //hide all previously shown items, up to the level of the currently touched item.
        if (menuItem.level <= this.previousShowMenuItem.level) {
            var parent = this.previousShowMenuItem;
            while (parent && parent.level >= menuItem.level) {
                this.hideMenuItemContents(parent);
                parent = parent.parent;
            }
        }
    }
    this.previousShowMenuItem = menuItem;
    this.showMenuItemContents(menuItem);
}
/**
 * 
 */
jasonMenuUIHelper.prototype.onItemKeyDown = function (keyDownEvent) {
    var key = keyDownEvent.keyCode || keyDownEvent.which;
    switch (key) {
        //ESC
        case 27: {
            var focusable = null;
            var menuItem = this.getMenuItemFromEvent(keyDownEvent);
            if (menuItem.level == 0 && this.options.invokable) {
                this.hideMenu();
                focusable = jw.common.getFirstFocusableElement(this.invokableElement);
                if (focusable)
                    focusable.focus();
            } else {
                menuItem = menuItem.parent ? menuItem.parent : menuItem;
                this.hideMenuItemContents(menuItem, true);
                focusable = jw.common.getFirstFocusableElement(menuItem.htmlElement);
                if (focusable)
                    focusable.focus();
            }

            break;
        }
    }
}
/**
 * Show menu item contents
 * @param {Menus.jasonMenuItem} menuItem
 */
jasonMenuUIHelper.prototype.showMenuItemContents = function (menuItem) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    if (menuItem) {
        var menuElement = menuItem.htmlElement;
        if (!menuElement.getAttribute(jw.DOM.attributes.JW_MENU_ITEM_NO_HIGHLIGHT_ATTR) && menuItem.enabled)
            menuElement.classList.add(jw.DOM.classes.JW_MENU_ITEM_CLASS_ACTIVE);

        //only try to place the sub-menu container if its enabled and not visible.
        var renderSubMenuContainer = (!menuElement._jasonMenuItemsContainer && menuItem.enabled) || (menuItem.enabled && menuElement._jasonMenuItemsContainer.style.display == "none");
        if (renderSubMenuContainer) {
            var orientantion = menuElement.parentNode == this.ulMenuElement ? this.options.orientation.toLowerCase() : null;
            this.placeMenuItemsContainer(menuElement._jasonMenuItemsContainer, menuElement, orientantion);
            menuItem.triggerEvent(jw.DOM.events.JW_EVENT_ON_JW_MENU_ITEM_CONTENT_SHOW);
            this.previousShowMenuItem = menuItem;
        }
    }
}
/**
 * Hides menu item contents
 * @param {Menus.jasonMenuItem} menuItem
 */
jasonMenuUIHelper.prototype.hideMenuItemContents = function (menuItem,forceHide) {
    if (menuItem) {
        var menuElement = menuItem.htmlElement;
        if (!this.options._debug && (!this.disableMouseEvents || forceHide)) {
            if (menuElement._jasonMenuItemsContainer && this.canHideSubMenu) {
                menuElement._jasonMenuItemsContainer.style.display = "none";
                this.previousShowMenuItem = null;
            }
        }
        if (menuItem.enabled)
            menuElement.classList.remove(jw.DOM.classes.JW_MENU_ITEM_CLASS_ACTIVE);
    }
}
/**
 * Triggered when mouse enters a menu item.
 * @param {object} itemMouseEnterEvent - HTMLEvent.
 */
jasonMenuUIHelper.prototype.onItemMouseEnter = function (itemMouseEnterEvent) {
    this.showMenuItemContents(this.getMenuItemFromEvent(itemMouseEnterEvent))
}
/**
 * Triggered when mouse leaves a menu item.
 * @param {object} itemMouseLeaveEvent - HTMLEvent.
 */
jasonMenuUIHelper.prototype.onItemMouseLeave = function (itemMouseLeaveEvent) {
    this.hideMenuItemContents(this.getMenuItemFromEvent(itemMouseLeaveEvent));
}
//#endregion
/**
 * Places the menu container on the page 
 * @param {object} menuItemsContainer - HTMLElement.
 * @param {object} menuElement - HTMLElement.
 * @param {object} mouseEvent - HTMLEvent.
 * @param {object} orientantion - HTMLEvent. {@link jasonMenuWidgetDefaultOptions}
 */
jasonMenuUIHelper.prototype.placeMenuItemsContainer = function (menuItemsContainer, menuElement, orientantion) {
    if (menuItemsContainer) {
        menuItemsContainer.style.position = "absolute";
        var containerTop = orientantion == "horizontal" ? (menuElement.offsetTop + menuElement.offsetHeight) + "px" : (menuElement.offsetTop - (menuElement.offsetHeight / 5.5)) + "px";
        menuItemsContainer.style.top = containerTop;
        var animSpeed = 350 - (this.options.animation.delay * 35);
        jasonWidgets.common.fadeIn(menuItemsContainer, animSpeed);
        var subItemULContainer = menuItemsContainer.getElementsByTagName("UL")[0];
        menuItemsContainer.style.display = "";
        var menuItemContent = subItemULContainer.querySelectorAll(".jw-menu-item-content")[0];
        if (menuItemContent) {
            var menuContent = subItemULContainer.querySelectorAll(".menu-content")[0];
            if (menuContent)
                menuContent.style.height = menuItemContent.offsetHeight + "px";
        }
        var menuItemsContainerWidth = this.getWiderElementWidthOfUL(subItemULContainer);
        var paddingPixels = 10;
        if (menuItemsContainerWidth > 0) {
            menuItemsContainer.style.width = menuItemsContainerWidth + "px";
            paddingPixels = 0;
        }
        //calculating left position
        var coordinates = jasonWidgets.common.getOffsetCoordinates(menuElement);
        var width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
        var leftPosition = menuItemsContainer.offsetWidth + coordinates.left + menuElement.offsetWidth  >= width ? menuElement.offsetLeft - (menuItemsContainer.offsetWidth) : orientantion == "horizontal" ? menuElement.offsetLeft : menuElement.offsetWidth;
        menuItemsContainer.style.left = leftPosition + "px";
        if (menuItemsContainer.style.zIndex == "") {
            menuItemsContainer.style.zIndex = jw.common.getNextZIndex();
        } else {
            var zIndex = parseInt(menuItemsContainer.style.zIndex);
            var newZIndex = jw.common.getNextZIndex();
            if (zIndex < newZIndex) {
                menuItemsContainer.style.zIndex = newZIndex;
            }
        }
    }
}
//#endregion

/**
 * Parses the html or json to create the menu 
 */
jasonMenuUIHelper.prototype.createMenu = function () {
    var self = this;
    /*if the htmlElement is a UL element, then create jasonMenu structure by parsing the UL DOM structure.*/
    if (this.htmlElement.tagName == "UL") {
        var domParser = new jasonMenuWidgetDOMParser(this);
        //if the menu is configured to be invokable, meaning that the menu is initialy hidden and the user
        //has to click to display it, we hide the menu container and append the original UL element to it.
        if (this.options.invokable) {
            this.menuContainer.style.display = "none";
            this.menuContainer.style.position = "absolute";
            this.menuContainer.appendChild(this.ulMenuElement);
            document.body.appendChild(this.menuContainer);
        } else {
            this.htmlElement.parentNode.replaceChild(this.menuContainer, this.htmlElement);
            this.menuContainer.appendChild(this.htmlElement);
        }
        return domParser.populateMenu(this.ulMenuElement);
    } else {
        if (!this.options.menu)
            return;
        var jsonParser = new jasonMenuWidgetJSONParser(this);
        this.ulMenuElement = jsonParser.populateMenu(this.options.menu);
        /*Adding orientation CSS class*/
        if (this.widget.options.orientation.toLowerCase() == "horizontal")
            this.ulMenuElement.classList.add(jw.DOM.classes.JW_MENU_HORIZONTAL);
        this.menuContainer.appendChild(this.ulMenuElement);
        /*If the menu is invokable hide it when the mouse is not over the client of the menu container.*/
        if (this.options.invokable) {
            this.menuContainer.style.display = "none";
            this.menuContainer.style.position = "absolute";
            this.eventManager.addEventListener(this.menuContainer, jw.DOM.events.MOUSE_LEAVE_EVENT, function (mouseLeaveEvent) {
                if (self.disableMouseEvents)
                    return;
                if (!self.options._debug) {
                    if (self.options.hideDelay) {
                        self.canHideMenu = true;
                        setTimeout(function () {
                            if (self.canHideMenu)
                                self.hideMenu();
                        }, self.options.hideDelay);
                    }
                    else
                        self.hideMenu();
                }
            });
            this.eventManager.addEventListener(this.menuContainer, jw.DOM.events.MOUSE_ENTER_EVENT, function (mouseLeaveEvent) {
                if (!self.options._debug) {
                    if (self.canHideMenu)
                        self.canHideMenu = false;
                    //when entering again the container we do not want to disable events any more.
                    if (self.disableMouseEvents)
                        self.disableMouseEvents = false;
                }
            });
            document.body.appendChild(this.menuContainer);
        } else {
            this.htmlElement.appendChild(this.menuContainer);
        }
        this.eventManager.addEventListener(this.ulMenuElement, jw.DOM.events.MOUSE_ENTER_EVENT, function (mouseEnterEvent) {
            self.disableMouseEvents = false;
        });

        this.eventManager.addEventListener(this.ulMenuElement, jw.DOM.events.MOUSE_DOWN_EVENT, function (mouseDownEvent) {
            var menuElement = jasonWidgets.common.getParentElement("LI", mouseDownEvent.target);
            var menuItem = jasonWidgets.common.getData(menuElement, jw.DOM.attributeValues.JW_MENU_ITEM_DATA_KEY);
            if (menuItem && menuItem.content) {
                if (jw.common.isMouseEventOutOfContainer(self.ulMenuElement, mouseDownEvent)) {
                    self.disableMouseEvents = true;
                }
            }
        },true);
    }
}
/**
 * Updates UI when enable/disable state is changed.
 * @abstract
 */
jasonMenuUIHelper.prototype.updateEnabled = function (enable) {
    jasonBaseWidgetUIHelper.prototype.updateEnabled.call(this, enable);
    var buttons = this.htmlElement.getElementsByTagName("a");
    for (var i = 0; i <= buttons.length - 1; i++) {
        if (enable) {
            buttons[i].removeAttribute(jw.DOM.attributes.DISABLED_ATTR)
            buttons[i].classList.remove(jw.DOM.classes.JW_DISABLED);
        }
        else {
            buttons[i].setAttribute(jw.DOM.attributes.DISABLED_ATTR, true);
            buttons[i].classList.add(jw.DOM.classes.JW_DISABLED);
        }
    }
    var inputs = this.htmlElement.getElementsByTagName("input");
    for (var i = 0; i <= inputs.length - 1; i++) {
        if (enable) {
            inputs[i].removeAttribute(jw.DOM.attributes.DISABLED_ATTR)
            inputs[i].classList.remove(jw.DOM.classes.JW_DISABLED);
        }
        else {
            inputs[i].setAttribute(jw.DOM.attributes.DISABLED_ATTR, true);
            inputs[i].classList.add(jw.DOM.classes.JW_DISABLED);
        }
    }
}
/**
 * Updates UI when visible state is changed.
 * @abstract
 */
jasonMenuUIHelper.prototype.updateVisible = function (visible) {
    jasonBaseWidgetUIHelper.prototype.updateVisible.call(this, visible);
}
/**
 * Updates UI when readonly state is changed.
 * @abstract
 */
jasonMenuUIHelper.prototype.updateReadOnly = function (readonly) {
    jasonBaseWidgetUIHelper.prototype.updateReadOnly.call(this, readonly);
    var buttons = this.htmlElement.getElementsByTagName("a");
    for (var i = 0; i <= buttons.length - 1; i++) {
        if (readonly) {
            buttons[i].removeAttribute(jw.DOM.attributes.READONLY_ATTR)
            buttons[i].classList.remove(jw.DOM.classes.JW_READONLY);
        }
        else {
            buttons[i].setAttribute(jw.DOM.attributes.READONLY_ATTR, true);
            buttons[i].classList.add(jw.DOM.classes.JW_READONLY);
        }
    }
    var inputs = this.htmlElement.getElementsByTagName("input");
    for (var i = 0; i <= inputs.length - 1; i++) {
        if (readonly) {
            inputs[i].removeAttribute(jw.DOM.attributes.READONLY_ATTR)
            inputs[i].classList.remove(jw.DOM.classes.JW_READONLY);
        }
        else {
            inputs[i].setAttribute(jw.DOM.attributes.READONLY_ATTR, true);
            inputs[i].classList.add(jw.DOM.classes.JW_READONLY);
        }
    }
}
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonContextMenuUIHelper.prototype = Object.create(jasonMenuUIHelper.prototype);
jasonContextMenuUIHelper.prototype.constructor = jasonContextMenuUIHelper;

/**
 * @class
 * @name jasonMenuContextOptions
 * @augments Menus.jasonMenuOptions
 * @description Context jasonMenu options.
 * @property {HTMLElement}  [target=undefined] - Target HTML Element for the context menu.
 * @memberOf Menus
 */


/**
 * @constructor
 * @ignore
 */
function jasonContextMenuUIHelper(widget, htmlElement) {
    jasonWidgets.common.extendObject({ invokable: true,orientation:'vertical', autoHide:true }, widget.options);
    this.showContextMenu = this.showContextMenu.bind(this);
    widget.options.invokable = true;
    jasonMenuUIHelper.call(this, widget, htmlElement);
    this.menuContainer.style.display = "none";
    this.menuContainer.parentElement.removeChild(this.menuContainer);
    document.body.appendChild(this.menuContainer);
    this.menuContainer.style.width = widget.options.width + "px";
    this.menuContainer.style.position = "absolute";
}


/**
 * Initializes context menu events.
 */
jasonContextMenuUIHelper.prototype.initializeEvents = function () {
    this.eventManager.addEventListener(this.options.target, jw.DOM.events.CONTEXT_MENU_EVENT, this.showContextMenu);
}
/**
 * Shows the context menu on the mouse coordinates.
 */
jasonContextMenuUIHelper.prototype.showContextMenu = function (mouseEvent) {
    if (mouseEvent.button == 2) {
        mouseEvent.preventDefault();
        mouseEvent.stopPropagation();
        this.showMenu(mouseEvent.target, mouseEvent.pageX, mouseEvent.pageY);
    }
}
/**
 * Calls the options.OnContextItemClick if defined.
 */
jasonContextMenuUIHelper.prototype.onContextItemClick = function (clickEvent, menuItem) {
    var eventData = { event: event, item: menuItem, checked: menuItem.checkBoxElement.checked, cancel: false };
    this.widget.triggerEvent(JW_EVENT_ON_JW_MENU_CHECKBOX_CLICKED, eventData);
    this.hideMenu();
    this.options.target.focus();

    clickEvent.stopPropagation();
    clickEvent.preventDefault();
}
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


jasonCalendar.prototype = Object.create(jasonBaseWidget.prototype);
jasonCalendar.prototype.constructor = jasonCalendar;

/**
 * @class
 * @name jasonCalendarOptions
 * @augments Common.jasonWidgetOptions
 * @memberOf Date/Time
 * @description Configuration for the jasonCalendar widget.
 * @property {boolean}  [invokable=true]        - If true the calendar is shown when it's invoked.
 * @property {object=}   invokableElement - The element which will display the calendar upon click.
 * @property {boolean}  [autoHide=false]         - If true, the calendar is hidden if there is a mouse click outside the calendar and the calendar is invokable.
 * @property {array}    [specialDates=[]]     - List of special dates. Default is empty.
 * @property {number}   [firstDayOfWeek=1]   - Set the first day of the week. Default is Monday. Index is zero based.
 * @property {boolean}  [multiSelect=false]      - Allows date multi selection.
 * @property {boolean}  [rangeSelect=false]      - Allows date range selection. Similar to multi but the dates must be consecutive. 
 * @property {number}   [width=300]            - Set the width of the calendar control in pixels.
 * @property {number}   [height=220]           - Set the height of the calendar control in pixels.
 * @property {string}   [mode=days]     - Sets the mode of the calendar. Possible values [days,months,years,decades,centuries].
 * @property {Date/Time.jasonCalendarSpecialDate[]}    [selectedDates=[]]    - List of selected dates. Default is empty.
 */

/**
 * @class
 * @name jasonCalendarSpecialDate
 * @memberOf Date/Time
 * @description A special date, is a date that will render a calendar item with a specific tooltip and/or cssClass.
 * @property {date} date            - Can be a date object or valid date string.
 * @property {string} tooltip       - Tooltip to be shown over the calendar item.
 * @property {string} cssClass      - Css class to be added to the calendar item.
 * @property {boolean} recurring    - If set to true then the year is not taken into account. Default is false.
 */

/**
 * jasonCalendarItem
 * @constructor
 * @description  Object representation of calendar contents.
 * @memberOf Date/Time
 * @property {string} dayName - Day name.
 * @property {string} dayShortName - Day short name.
 * @property {date} date - Item's date value.
 * @property {number} month - Item's month value.
 * @property {string} monthName - Month name.
 * @property {string} monthShortName - Month short name.
 * @property {number} year - Item's year value.
 * @property {number} decadeStart - Item's decade start value.
 * @property {number} decadeStop - Item's decade stop value.
 * @property {number} centuryStart - Item's century start value.
 * @property {number} centuryStop - Item's century stop value.
 * @property {string} toolTip - Item's tooltip.
 * @property {string[]} classList - CSS classes to be added to the item.
 */
function jasonCalendarItem() {
    this.dayName = null;
    this.dayShortName = null;
    this.date = null;
    this.day = null;
    this.month = null;
    this.monthName = null;
    this.monthShortName = null;
    this.year = null;
    this.weekNumber = null;
    this.decadeStart = null;
    this.decadeStop = null;
    this.centuryStart = null;
    this.centuryStop = null;
    this.mileniumStart = null;
    this.mileniumStop = null;
    this.toolTip = null;
    this.classList = [];
    this.displayValue = null;
}

/**
 * @event Date/Time.jasonCalendar#onChange
 * @descrpition Occurs when the date value is changed.
 * @type {object}
 * @property {Date/Time.jasonCalendar} sender - The calendar instance.
 * @property {date} value - The new date.
 */
/**
 * @event Date/Time.jasonCalendar#onModeChange
 * @descrpition Occurs when the calendar mode is changed.
 * @type {object}
 * @property {Date/Time.jasonCalendar} sender - The calendar instance.
 * @property {string} value - The new mode. 
 */
/**
 * @event Date/Time.jasonCalendar#onNavigate
 * @descrpition Occurs on calendar navigation.
 * @type {object}
 * @property {Date/Time.jasonCalendar} sender - The calendar instance.
 * @property {object} value - The event data.
 * @property {string} value.navDirection - The navigation direction.
 * @property {date} value.selectedItemIndex - The selected date after the navigation.
 */


/**
 * @constructor
 * @description Calendar widget.
 * @augments Common.jasonBaseWidget
 * @memberOf Date/Time
 * @param {HTMLElement} htmlElement - DOM element that will contain the calendar.
 * @param {Date/Time.jasonCalendarOptions} options - jasonCalendar options.  
 * @property {date} date - Date value of the widget.
 * @property {Date/Time.jasonCalendarSpecialDate[]} specialDates - Array of special dates.
 * @property {string} mode - Calendar mode. days | months | years | decades
 * @fires Date/Time.jasonCalendar#event:onChange
 * @fires Date/Time.jasonCalendar#event:onModeChange
 * @fires Date/Time.jasonCalendar#event:onNavigate
 */
function jasonCalendar(htmlElement, options) {
    this.defaultOptions = {
        invokable: false,
        autoHide: false,
        invokableElement: null,
        firstDayOfWeek: 1,
        width: 300,
        height:220,
        mode: "days",
        specialDates: [],
        selectedDates: [],
        multiSelect: false,
        rangeSelect:false,
        localization: jasonWidgets.localizationManager.currentLanguage ? jasonWidgets.localizationManager.currentLanguage.calendar : options.localization
    };
    this._date = jasonWidgets.common.dateOf(new Date());
    this._navigationDate = jasonWidgets.common.dateOf(new Date());
    this._specialDates = [];
    this._mode = options.mode ? options.mode : "days";
    this.currentCalendarItems = [];
    this.parseSpecialDates(options);

    jasonBaseWidget.call(this, "jasonCalendar", htmlElement,options, jasonCalendarUIHelper);
    //this._date = this.options.invokable ? null : jasonWidgets.common.dateOf(new Date());


    //this.ui.renderUI();
}
/**
 * Date read-only property.
 */
Object.defineProperty(jasonCalendar.prototype, "date", {
    get: function () {
        return this._date;
    },
    set:function(value){
        this._setDate(value);
    },
    enumerable: true,
    configurable: true
});
/**
 * SpecialDates read-only property.
 */
Object.defineProperty(jasonCalendar.prototype, "specialDates", {
    get: function () {
        return this._specialDates;
    },
    enumerable: true,
    configurable: true
});
/**
 * Calendar mode read-only property.
 */
Object.defineProperty(jasonCalendar.prototype, "mode", {
    get: function () {
        return this._mode;
    },
    set:function(value){
        this._setMode(value);
    },
    enumerable: false,
    configurable: false
});
/**
 * Sets the date value of the calendar
 * @ignore
 */
jasonCalendar.prototype._setDate = function (date) {
    if (date && jw.common.dateComparison(this._date,date) != 0) {
        this._date = date;
        this.triggerEvent(jw.DOM.events.JW_EVENT_ON_CHANGE, this._date);
    }
}
/**
 * Sets the calendar mode
 * @ignore
 */
jasonCalendar.prototype._setMode = function (mode) {
    if (mode && this._mode != mode) {
        this._mode = mode;
        this.ui.renderCalendarItems(this.navigate(null));
        this.triggerEvent(jw.DOM.events.JW_EVENT_JW_CALENDAR_MODE_CHANGE, this._mode);
    }
}
/**
 * Add special date.
 * @ignore
 */
jasonCalendar.prototype.addSpecialDate = function (date,cssClass,toolTip) {
    this.specialDates.push({date:date,css:cssClass,toolTip:toolTip});
}
/**
 * Parse special dates.
 * @ignore
 */
jasonCalendar.prototype.parseSpecialDates = function (options) {
    if (options.specialDates) {
        for (var i = 0; i <= options.specialDates.length - 1; i++) {
            var specialDate = options.specialDates[i];
            if (specialDate.date) {
                var sdateTime = typeof specialDate.date == "date" ? specialDate.date : Date.parse(specialDate.date);
                if (!isNaN(sdateTime)) {
                    var sDate = new Date();
                    sDate.setTime(sdateTime);
                    this.specialDates.push({ date: sDate, tooltip: specialDate.tooltip, cssClass: specialDate.cssClass, recurring: specialDate.recurring || false });
                }
            }
        }
    }
}

/**
 * Create calendar item
 * @ignore
 */
jasonCalendar.prototype.createCalendarItem = function (date,month,year) {
    var result = new jasonCalendarItem();
    result.year = year;
    result.month = month;
    result.day = date.getDate();
    result.date = date;
    var weekDay = date.getDay();
    weekDay = this.options.localization.days[weekDay];
    result.dayName = weekDay.name;
    result.dayShortName = weekDay.shortName;
    var monthDescr = this.options.localization.months[month - 1 < 0 ? 0 : month - 1];
    result.monthName = monthDescr.name;
    result.monthShortName = monthDescr.shortName;
    result.displayValue = result.day;
    return result;
}

/**
 * Generates days
 * @ignore
 */
jasonCalendar.prototype.generateDays = function (year,month) {
    var result = [];
    var daysInMonth = jasonWidgets.common.daysInMonth(year, month);
    var firstDateOfMonth = new Date(year, month - 1, 1);
    var weekDayFirstDayOfMonth = firstDateOfMonth.getDay();
    var milliSecondsInaDay = 86400000;
    if (this.options.firstDayOfWeek > 6)
        this.options.firstDayOfWeek = 0;

    var daysToAddBefore = 0;
    if (this.options.firstDayOfWeek != weekDayFirstDayOfMonth) {
        if (weekDayFirstDayOfMonth < this.options.firstDayOfWeek)
            daysToAddBefore = 7 - Math.abs(this.options.firstDayOfWeek - weekDayFirstDayOfMonth);
        else
            daysToAddBefore =  Math.abs(this.options.firstDayOfWeek - weekDayFirstDayOfMonth);
    }
    for (var x = daysToAddBefore; x >= 1; x--) {
        var dayBefore = firstDateOfMonth.getTime() - (x * milliSecondsInaDay);
        var dateBefore = new Date();
        dateBefore.setTime(dayBefore);
        var calendarItem = this.createCalendarItem(dateBefore, month == 12 ? 1 : month - 1, month == 12 ? year - 1 : year);
        calendarItem.classList.push(jw.DOM.classes.JW_CALENDAR_ITEM_OUT_CURRENT_SCOPE);
        result.push(calendarItem);
    }

    for (var i = 1 ; i <= daysInMonth; i++) {
        result.push(this.createCalendarItem(new Date(year,month -1,i),month,year));
    }
    var daysToAddAfter = 42 - result.length;
    var lastDayOfMonth = new Date(year, month - 1, daysInMonth);
    for (var j = 1; j <= daysToAddAfter; j++) {
        var dayAfter = lastDayOfMonth.getTime() + (j * milliSecondsInaDay);
        var dateAfter = new Date();
        dateAfter.setTime(dayAfter);
        var calendarItem = this.createCalendarItem(dateAfter, month == 12 ? 1 : month + 1, month == 12 ? year + 1 : year);
        calendarItem.classList.push(jw.DOM.classes.JW_CALENDAR_ITEM_OUT_CURRENT_SCOPE);
        result.push(calendarItem);
    }

    this.currentCalendarItems = result;

    return result;
}


/**
 * Generates months
 * @ignore
 */
jasonCalendar.prototype.generateMonths = function (date) {
    date = date ? date : this.date;
    var result = [];
    for (var i = 0 ; i <= 11; i++) {
        var calendarItem = new jasonCalendarItem();
        calendarItem.month = i + 1;
        var month = this.options.localization.months[i];
        calendarItem.monthName = month.name;
        calendarItem.monthShortName = month.shortName;
        calendarItem.displayValue = month.shortName;
        calendarItem.day = 1;
        calendarItem.year = date.getFullYear();
        result.push(calendarItem);
    }

    this.currentCalendarItems = result;

    return result;
}

/**
 * Generates years
 * @ignore
 */
jasonCalendar.prototype.generateYears = function (decadeStart,decadeStop) {
    var result = [];
    var yearBefore = new jasonCalendarItem();
    yearBefore.year = decadeStart - 1;
    yearBefore.displayValue = yearBefore.year;
    yearBefore.classList.push(jw.DOM.classes.JW_CALENDAR_ITEM_OUT_CURRENT_SCOPE);
    result.push(yearBefore);
    for (var i = decadeStart ; i <= decadeStop; i++) {
        var calendarItem = new jasonCalendarItem();
        calendarItem.year = i;
        calendarItem.decadeStart = decadeStart;
        calendarItem.decadeStop = decadeStop;
        calendarItem.displayValue = calendarItem.year;
        result.push(calendarItem);
    }
    var yearAfter = new jasonCalendarItem();
    yearAfter.year = decadeStop + 1;
    yearAfter.displayValue = yearAfter.year;
    yearAfter.classList.push(jw.DOM.classes.JW_CALENDAR_ITEM_OUT_CURRENT_SCOPE);
    result.push(yearAfter);

    this.currentCalendarItems = result;

    return result;
}


/**
 * Generates decades
 * @ignore
 */
jasonCalendar.prototype.generateDecades = function (centuryStart, centuryStop) {
    var result = [];

    //var decadeBefore = new jasonCalendarItem();
    //decadeBefore.decadeStart = centuryStart - 10;
    //decadeBefore.decadeStop = decadeBefore.decadeStart + 9;
    //decadeBefore.classList.push(JW_CALENDAR_ITEM_OUT_CURRENT_SCOPE);
    //decadeBefore.displayValue = decadeBefore.decadeStart + " - \r\n" + decadeBefore.decadeStop;
    //result.push(decadeBefore);

    for (var i = 0 ; i <= 9; i++) {
        var calendarItem = new jasonCalendarItem();
        var previousItem = result[i-1];
        calendarItem.decadeStart = i == 0 ? centuryStart : previousItem.decadeStop + 1;
        calendarItem.decadeStop = i == 0 ? centuryStart + 9 : calendarItem.decadeStart + 9;
        calendarItem.centuryStart = centuryStart;
        calendarItem.centuryStop = centuryStop;
        calendarItem.displayValue = calendarItem.decadeStart + " - \r\n" + calendarItem.decadeStop;
        result.push(calendarItem);
    }

    //var decadeAfter = new jasonCalendarItem();
    //decadeAfter.decadeStart = centuryStop + 1;
    //decadeAfter.decadeStop = decadeAfter.decadeStart + 9;
    //decadeAfter.classList.push(JW_CALENDAR_ITEM_OUT_CURRENT_SCOPE);
    //decadeAfter.displayValue = decadeAfter.decadeStart + " - \r\n" + decadeAfter.decadeStop;

    //result.push(decadeAfter);

    this.currentCalendarItems = result;

    return result;
}

/**
 * Generates centuries
 * @ignore
 */
jasonCalendar.prototype.generateCenturies = function (mileniumStart, mileniumStop) {
    var result = [];

    var centuryBefore = new jasonCalendarItem();
    centuryBefore.centuryStart = mileniumStart - 100;
    centuryBefore.centuryStop = centuryBefore.centuryStart + 99;
    centuryBefore.classList.push(jw.DOM.classes.JW_CALENDAR_ITEM_OUT_CURRENT_SCOPE);
    centuryBefore.displayValue = centuryBefore.centuryStart + " - \r\n" + centuryBefore.centuryStop;
    result.push(centuryBefore);

    for (var i = 0 ; i <= 9; i++) {
        var calendarItem = new jasonCalendarItem();
        var previousItem = result[i - 1];
        calendarItem.centuryStart = i == 0 ? mileniumStart : previousItem.centuryStop + 1;
        calendarItem.centuryStop = i == 0 ? mileniumStart + 99 : calendarItem.centuryStart + 99;
        calendarItem.mileniumStart = mileniumStart;
        calendarItem.mileniumStop = mileniumStop;
        calendarItem.displayValue = calendarItem.centuryStart + " - \r\n" + calendarItem.centuryStop;
        result.push(calendarItem);
    }

    var centuryAfter = new jasonCalendarItem();
    centuryAfter.centuryStart = mileniumStop + 1;
    centuryAfter.centuryStop = centuryAfter.centuryStart + 99;
    centuryAfter.classList.push(jw.DOM.classes.JW_CALENDAR_ITEM_OUT_CURRENT_SCOPE);
    centuryAfter.displayValue = centuryAftercCenturyStart + " - \r\n" + centuryAfter.centuryStop;
    result.push(centuryAfter);

    this.currentCalendarItems = result;

    return result;
}
/**
 * Generates calendar items based the passed date.
 * @ignore
 */
jasonCalendar.prototype.generateCalendarItems = function (date) {
    var today = date ? date : this.date;
    var fullYear = today.getFullYear();
    var result = [];
    switch(this._mode){
        case "days":{
            result = this.generateDays(today.getFullYear(), today.getMonth() + 1);
            break;
        }
        case "months":{
            result = this.generateMonths(date);
            break;
        }
        case "years": {
            var decadeStart = parseInt(fullYear.toString().substring(0, 3) + "0");
            var decadeStop = decadeStart + 9;
            result = this.generateYears(decadeStart, decadeStop);
            break;
        }
        case "decades": {
            var centuryStart = parseInt(fullYear.toString().substring(0, 2) + "00");
            var centuryStop = centuryStart + 99;
            result = this.generateDecades(centuryStart, centuryStop);
            break;
        }
        default: result = this.generateDays(today.getYear(), today.getMonth());
    }
    this.currentCalendarItems = result;
    return { calendarItems: this.currentCalendarItems, navDate: date };
}
/**
 * Defines how many items per row are displayed for each calendar mode.
 * @ignore
 */
jasonCalendar.prototype.getRowDivisionCount = function () {
    switch (this._mode) {
        case "days": {
            return 7
        }
        case "months": {
            return 3;
        }
        case "years": {
            return 4;
        }
        case "decades": {
            return 3;
        }
        default: return 7;
    }
}
/**
 * Navigates the calendar back.
 */
jasonCalendar.prototype.navigateBack = function () {
    this.ui.renderCalendarItems(this.navigate("back"));
}
/**
 * Navigates the calendar forward.
 */
jasonCalendar.prototype.navigateForward = function () {
    this.ui.renderCalendarItems(this.navigate("forward"));
}
/**
 * Calendar navigate. Navigates based on the current calendar mode.
 * @ignore
 */
jasonCalendar.prototype.navigate = function (direction) {
    var navidationDate = null;
    var month = this._navigationDate.getMonth();
    var year = this._navigationDate.getFullYear();
    var firstCalendarItem = this.currentCalendarItems[0];
    var lastCalendarItem = this.currentCalendarItems[this.currentCalendarItems.length - 1];
    switch (this._mode) {
        case "days": {
            if (direction == "back") {
                year = month == 0 ? year - 1 : year;
                month = month == 0 ? 11 : month - 1;
            }
            if (direction == "forward") {
                year = month == 11 ? year + 1 : year;
                month = month == 11 ? 0 : month + 1;
            }
            navidationDate = new Date(year, month, 1);
            break;
        }
        case "months": {
            if (direction)
                year = direction == "back" ? year - 1 : year + 1;
            navidationDate = new Date(year, month, 1);
            break;
        }
        case "years": {
            if (direction)
                year = direction == "back" ? firstCalendarItem.year : lastCalendarItem.year;
            navidationDate = new Date(year, 0, 1);
            break;
        }
        case "decades": {
            if (direction)
                year = direction == "back" ? firstCalendarItem.decadeStart - 100 : lastCalendarItem.decadeStop + 1;
            navidationDate = new Date(year, 0, 1);
            break;
        }
        default: date = null;
    }
    this._navigationDate = navidationDate;
    this.triggerEvent(jw.DOM.events.JW_EVENT_JW_CALENDAR_NAVIGATE, { navDirection: direction, navDate: this._navigationDate });
    return this.generateCalendarItems(navidationDate);
}




jasonCalendarUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonCalendarUIHelper.prototype.constructor = jasonCalendarUIHelper;
/**
 * jasonCalendar UI helper class. Manages HTML and UI events
 * @constructor
 * @ignore
 */
function jasonCalendarUIHelper(widget, htmlElement) {
    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
    this.calendarDisplayClick = this.calendarDisplayClick.bind(this);
    this.calendarItemClick = this.calendarItemClick.bind(this);
    this.calendarNavigateToday = this.calendarNavigateToday.bind(this);
    this.renderedCalendarItems = [];
    var self = this;
    jwDocumentEventManager.addDocumentEventListener(jw.DOM.events.SCROLL_EVENT, function (scrollEvent) {
        if (self.options.invokable)
            self.hideCalendar();
    });
    //jwWindowEventManager.addWindowEventListener(jw.DOM.events.SCROLL_EVENT, function (scrollEvent) {
    //    self.hideCalendar();
    //});
    //jwWindowEventManager.addWindowEventListener(jw.DOM.events.TOUCH_MOVE_EVENT, function (scrollEvent) {
    //    self.hideCalendar();
    //});

    jwDocumentEventManager.addDocumentEventListener(jw.DOM.events.TOUCH_MOVE_EVENT, function (scrollEvent) {
        if (self.options.invokable)
            self.hideCalendar();
    });
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);
}
/**
 * Renders the calendar UI.
 */
jasonCalendarUIHelper.prototype.renderUI = function () {
    var self = this;
    if (!this.htmlElement.classList.contains(jw.DOM.classes.JW_CALENDAR)) {
        this.htmlElement.style.width = this.widget.options.width + "px";
        this.htmlElement.style.height = this.widget.options.height + "px";
        this.htmlElement.classList.add(jw.DOM.classes.JW_CALENDAR);
        this.renderHeader();
        this.renderBody();
        this.renderFooter();
        if (this.options.invokable) {
            this.hideCalendar();
            this.htmlElement.style.position = "absolute";
            jwDocumentEventManager.addDocumentEventListener(jw.DOM.events.MOUSE_DOWN_EVENT, function (mouseDownEvent) {
                if (jasonWidgets.common.isMouseEventOutOfContainer(self.htmlElement, mouseDownEvent) && self.htmlElement.style.display == "")
                    self.hideCalendar();
            });
            this.eventManager.addEventListener(this.htmlElement, jw.DOM.events.KEY_DOWN_EVENT, function (keyDownEvent) {
                var keyCode = keyDownEvent.which || keyDownEvent.keyCode;
                if (keyCode == 27)
                    self.hideCalendar();
            }, true);
        }
    }
}
/**
 * Renders calendar header
 */
jasonCalendarUIHelper.prototype.renderHeader = function () {
    this.calendarHeader = this.createElement("div");
    this.calendarHeader.classList.add(jw.DOM.classes.JW_CALENDAR_HEADER);

    this.calendarGoBackButton = jw.htmlFactory.createJWButton(null, jw.DOM.icons.CIRCLE_ARROW_LEFT);
    this.calendarGoBackButton.classList.add(jw.DOM.classes.JW_CALENDAR_GO_BACK);
    this.eventManager.addEventListener(this.calendarGoBackButton, jw.DOM.events.CLICK_EVENT, this.goBack,true);



    this.calendarDisplayTitle = jw.htmlFactory.createJWLinkLabel();
    this.calendarDisplayTitle.classList.add(jw.DOM.classes.JW_CALENDAR_DISPLAY);
    this.eventManager.addEventListener(this.calendarDisplayTitle, jw.DOM.events.CLICK_EVENT, this.calendarDisplayClick);

    this.calendarGoForwardButton = jw.htmlFactory.createJWButton(null, jw.DOM.icons.CIRCLE_ARROW_RIGHT);
    this.calendarGoForwardButton.classList.add(jw.DOM.classes.JW_CALENDAR_GO_FORWARD);
    this.eventManager.addEventListener(this.calendarGoForwardButton, jw.DOM.events.CLICK_EVENT, this.goForward,true);

    this.calendarHeader.appendChild(this.calendarGoBackButton);
    this.calendarHeader.appendChild(this.calendarDisplayTitle);
    this.calendarHeader.appendChild(this.calendarGoForwardButton);

    this.htmlElement.appendChild(this.calendarHeader);
}
/**
 * Renders calendar body
 */
jasonCalendarUIHelper.prototype.renderBody = function () {
    this.calendarBody = this.createElement("div");
    this.calendarBody.classList.add(jw.DOM.classes.JW_CALENDAR_BODY);
    this.calendarTable = this.createElement("table");
    this.calendarBody.appendChild(this.calendarTable);
    this.renderCalendarItems();
    this.htmlElement.appendChild(this.calendarBody);
}
/**
 * Renders calendars items to the calendar body
 */
jasonCalendarUIHelper.prototype.renderCalendarItems = function (navigationResult) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var calendarItemsToRender;
    navigationResult = navigationResult ? navigationResult : this.widget.generateCalendarItems();

    calendarItemsToRender = navigationResult.calendarItems ;
    this.calendarTable.innerHTML = "";

    for (var i = this.calendarTable.classList.length - 1; i >= 0; i--) {
        this.calendarTable.classList.remove(this.calendarTable.classList[i]);
    }
    if (this.widget.mode == "months")
        this.calendarTable.classList.add(jw.DOM.classes.JW_CALENDAR_JW_TABLE_MONTHS);
    if (this.widget.mode == "years")
        this.calendarTable.classList.add(jw.DOM.classes.JW_CALENDAR_JW_TABLE_YEARS);
    if (this.widget.mode == "decades")
        this.calendarTable.classList.add(jw.DOM.classes.JW_CALENDAR_JW_TABLE_DECADES);

    var calendarTableBody = this.createElement("tbody");

    var rowDivisionCount = this.widget.getRowDivisionCount();
    if (this.widget.mode == "days") {
        var calendarTableHeader = this.createElement("thead");
        var calendarHeaderRow = this.createElement("tr");
        calendarTableHeader.appendChild(calendarHeaderRow);
        for (var i = 0; i <= 6; i++) {
            var calendarTableHeaderCell = this.createElement("th");
            var headerCellCaption = this.createElement("span");
            headerCellCaption.appendChild(this.createTextNode(calendarItemsToRender[i].dayShortName));
            headerCellCaption.setAttribute(jw.DOM.attributes.TITLE_ATTR, calendarItemsToRender[i].dayName);
            calendarTableHeaderCell.appendChild(headerCellCaption);
            calendarHeaderRow.appendChild(calendarTableHeaderCell);
        }
        this.calendarTable.appendChild(calendarTableHeader);
    }
    this.calendarTable.appendChild(calendarTableBody);
    for (var x = 0; x <= calendarItemsToRender.length - 1; x++) {
        var tableRow;
        var calendarItem = calendarItemsToRender[x];
        var specialDate = null;
        if (this.widget.mode == "days") {
            specialDate = this.widget.specialDates.filter(function (sDate) {
                if (sDate.recurring)
                    return (sDate.date.getMonth() == calendarItem.date.getMonth()) && (sDate.date.getDate() == calendarItem.date.getDate());
                return jasonWidgets.common.dateComparison(sDate.date, calendarItem.date) == 0;
            })[0];
        }
        if (x == 0 || x % rowDivisionCount == 0) {
            tableRow = this.createElement("tr");
            calendarTableBody.appendChild(tableRow);
        }
        var tableCell = this.createElement("td");
        var calendaItemCaption = jw.htmlFactory.createJWLinkLabel(calendarItem.displayValue.toString()) ;//this.createElement("a");
        //calendaItemCaption.appendChild(this.createTextNode(calendarItem.displayValue));
        //calendaItemCaption.setAttribute("href", "javascript:void(0)");
        tableCell.appendChild(calendaItemCaption);
        if (specialDate) {
            tableCell.setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR, specialDate.tooltip);
            if (specialDate.cssClass)
                tableCell.classList.add(specialDate.cssClass);
        }
        jasonWidgets.common.setData(tableCell, "jwCalendarItem", calendarItem);
        if (this.widget.mode == "days") {
            if (jw.common.dateComparison(navigationResult.navDate, calendarItem.date) == jw.enums.comparison.equal)
                tableCell.classList.add(jw.DOM.classes.JW_CALENDAR_ITEM_SELECTED_DATE);
        }
        this.eventManager.addEventListener(tableCell, jw.DOM.events.CLICK_EVENT, this.calendarItemClick,true);
        for (var k = 0; k <= calendarItem.classList.length - 1; k++) {
            tableCell.classList.add(calendarItem.classList[k]);
        }
        tableRow.appendChild(tableCell);
    }
    this.updateCalendarDisplay(navigationResult ? navigationResult.navDate : undefined);
}
/**
 * Renders calendar footer.
 */
jasonCalendarUIHelper.prototype.renderFooter = function () {
    this.calendarFooter = this.createElement("div");
    this.calendarFooter.classList.add(jw.DOM.classes.JW_CALENDAR_FOOTER);
    this.calendarFooterToday = jw.htmlFactory.createJWLinkLabel(jw.common.formatDateTime(new Date(), jw.localizationManager.currentCulture.longDateFormat));
    this.calendarFooter.appendChild(this.calendarFooterToday);

    this.htmlElement.appendChild(this.calendarFooter);
    this.eventManager.addEventListener(this.calendarFooterToday, jw.DOM.events.CLICK_EVENT, this.calendarNavigateToday,true);
}
/**
 * Shows the calendar.
 */
jasonCalendarUIHelper.prototype.showCalendar = function (date) {
    if (this.options.invokableElement) {
        this.calendarNavigateToday(date ? date : this.widget.date);
        var coordinates = this.options.invokableElement.getBoundingClientRect();//jw.common.getOffsetCoordinates(this.options.invokableElement);
        this.htmlElement.style.left = coordinates.left + "px";
        this.htmlElement.style.top = (coordinates.top + this.options.invokableElement.offsetHeight) + "px";
        this.htmlElement.style.zIndex = jw.common.getNextAttributeValue("z-index") + 1;
        this.htmlElement.style.display = "";
    }
}
/**
 * Hides the calendar.
 */
jasonCalendarUIHelper.prototype.hideCalendar = function () {
    this.htmlElement.style.display = "none";
}
/**
 * Navigate to today. Today is the current system day.
 */
jasonCalendarUIHelper.prototype.calendarNavigateToday = function (navigationDate) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var navDate = jw.common.getVariableType(navigationDate) == jw.enums.dataType.date ? navigationDate : new Date();
    this.widget.mode = "days";
    var navigationResult = { calendarItems: this.widget.generateDays(navDate.getFullYear(), navDate.getMonth() + 1), navDate: navDate };
    this.renderCalendarItems(navigationResult);

}
/**
 * Updates the text on the calendar header.
 */
jasonCalendarUIHelper.prototype.updateCalendarDisplay = function (navigationDate) {
    navigationDate = navigationDate ? navigationDate : this.widget.date;
    var calendarDisplayText = "";
    var month = navigationDate.getMonth();
    var year = navigationDate.getFullYear();
    switch (this.widget.mode) {
        case "days": {
            month = this.widget.options.localization.months[month];
            calendarDisplayText = jasonWidgets.common.formatString("{0} {1}", [month.name,year]);
            break;
        }
        case "months": {
            calendarDisplayText = jasonWidgets.common.formatString("{0}", [year]);
            break;
        }
        case "years": {
            calendarDisplayText = jasonWidgets.common.formatString("{0} - {1}", [this.widget.currentCalendarItems[1].decadeStart, this.widget.currentCalendarItems[1].decadeStop]);
            break;
        }
        case "decades": {
            calendarDisplayText = jasonWidgets.common.formatString("{0} - {1}", [this.widget.currentCalendarItems[1].centuryStart, this.widget.currentCalendarItems[1].centuryStop]);
            break;
        }
        default: date = null;
    }
    jw.common.setData(this.calendarDisplayTitle,"navigationDate", navigationDate);
    jasonWidgets.common.replaceNodeText(this.calendarDisplayTitle, calendarDisplayText,true);
}

/**
 * Go back. Navigates back based on the current calendar mode.
 */
jasonCalendarUIHelper.prototype.goBack = function (clickEvent) {
    this.renderCalendarItems(this.widget.navigate("back"));
}
/**
 * Go forward. Navigates forward based on the current calendar mode.
 */
jasonCalendarUIHelper.prototype.goForward = function (clickEvent) {
    this.renderCalendarItems(this.widget.navigate("forward"));
}
/**
 * Calendar header click event handler. Based on the current calendar mode, it goes "up" or "down"
 * and renders calendar items.
 */
jasonCalendarUIHelper.prototype.calendarDisplayClick = function (clickEvent) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var navigationDate = jw.common.getData(this.calendarDisplayTitle, "navigationDate");
    if (this.widget.mode == "years")
        this.widget.mode = "decades";

    if (this.widget.mode == "months")
        this.widget.mode = "years";

    if (this.widget.mode == "days")
        this.widget.mode = "months";
}
/**
 * Calendar item click event handler. It drills in if needed.
 * If calendar mode is years and you click on to a year, it
 * will render the months. And if you click a month it render the days of that
 * month for that year.
 */
jasonCalendarUIHelper.prototype.calendarItemClick = function (clickEvent) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var milliSecondsInaDay = 86400000;
    var calendarItem = jasonWidgets.common.getData(clickEvent.currentTarget, "jwCalendarItem");
    if (calendarItem) {
        //if the current item is out of the calendar's current scope
        //set the widget's date to that date and navigate to that date.
        if (this.widget.mode == "days" && clickEvent.currentTarget.classList.contains(jw.DOM.classes.JW_CALENDAR_ITEM_OUT_CURRENT_SCOPE)) {
            this.widget.date = calendarItem.date;
            this.widget._navigationDate = calendarItem.date;
            this.calendarNavigateToday(calendarItem.date);
            return;
        }
        var calendarItemDate = null;

        if (this.widget.mode == "days") {
            var newDate = new Date(calendarItem.year, calendarItem.month - 1, calendarItem.day);
            this.widget.date = newDate;
            var clearPrior = true;
            if (clickEvent.ctrlKey && (this.options.multiSelect || this.options.rangeSelect)) {
                clearPrior = false;
                var dateIsSelected = this.options.selectedDates.filter(function (selDate) { return selDate.getTime() == newDate.getTime(); })[0];
                if (!dateIsSelected) {
                    var addToTheList = true;
                    if (this.options.rangeSelect) {
                        var lastSelectedDate = this.options.selectedDates[this.options.selectedDates.length - 1];
                        var firstSelectedDate = this.options.selectedDates[0];
                        var lastSelectedDateTime = lastSelectedDate.getTime();
                        var firstSelectedDateTime = firstSelectedDate.getTime();
                        var newDateTime = newDate.getTime();
                        addToTheList = (newDateTime) == (firstSelectedDateTime - milliSecondsInaDay) ||
                            (newDateTime) == (lastSelectedDateTime + milliSecondsInaDay);
                        if (!addToTheList)
                            return;
                    }
                    if (addToTheList) {
                        this.widget.options.selectedDates.push(this.widget.date);
                        this.widget.options.selectedDates.sort(function (date1, date2) { return date1.getTime() - date2.getTime(); });
                    }
                }
            }
            else {
                this.options.selectedDates = [];
                this.widget.options.selectedDates.push(this.widget.date);
            }
            
            this.setActiveCalendarItem(clickEvent.currentTarget, clearPrior);
        }

        if (this.widget.mode == "months") {
            calendarItemDate = new Date(calendarItem.year, calendarItem.month - 1, 1);
            this.widget.mode = "days";
            this.renderCalendarItems(this.widget.generateCalendarItems(calendarItemDate));
            this.widget._navigationDate = calendarItemDate;
        }
        if (this.widget.mode == "years") {
            calendarItemDate = new Date(calendarItem.year, 0, 1);
            this.widget.mode = "months";
            this.renderCalendarItems(this.widget.generateCalendarItems(calendarItemDate));
            this.widget._navigationDate = calendarItemDate;
        }
        if (this.widget.mode == "decades") {
            calendarItemDate = new Date(calendarItem.decadeStart, 0, 1);
            this.widget.mode = "years";
            this.renderCalendarItems(this.widget.generateCalendarItems(calendarItemDate));
            this.widget._navigationDate = calendarItemDate;
        }
        
    }
}
/**
 * Set a calendar item to be active.
 */
jasonCalendarUIHelper.prototype.setActiveCalendarItem = function (tdElement,clearPriorActive) {
    var calendarTableItems = this.calendarTable.querySelectorAll("td");
    if (clearPriorActive)
        for (var i = 0; i <= calendarTableItems.length - 1; i++) {
            calendarTableItems[i].classList.remove(jw.DOM.classes.JW_CALENDAR_ITEM_SELECTED_DATE);
        }
    tdElement.classList.add(jw.DOM.classes.JW_CALENDAR_ITEM_SELECTED_DATE);
}
/**
 * Updates UI when enable/disable state is changed.
 * @abstract
 */
jasonCalendarUIHelper.prototype.updateEnabled = function (enable) {
    jasonBaseWidgetUIHelper.prototype.updateEnabled.call(this, enable);
    var buttons = this.htmlElement.getElementsByTagName("a");
    for (var i = 0; i <= buttons.length - 1; i++) {
        if (enable) {
            buttons[i].removeAttribute(jw.DOM.attributes.DISABLED_ATTR)
            buttons[i].classList.remove(jw.DOM.classes.JW_DISABLED);
        }
        else {
            buttons[i].setAttribute(jw.DOM.attributes.DISABLED_ATTR, true);
            buttons[i].classList.add(jw.DOM.classes.JW_DISABLED);
        }
    }
    var inputs = this.htmlElement.getElementsByTagName("input");
    for (var i = 0; i <= inputs.length - 1; i++) {
        if (enable) {
            inputs[i].removeAttribute(jw.DOM.attributes.DISABLED_ATTR)
            inputs[i].classList.remove(jw.DOM.classes.JW_DISABLED);
        }
        else {
            inputs[i].setAttribute(jw.DOM.attributes.DISABLED_ATTR, true);
            inputs[i].classList.add(jw.DOM.classes.JW_DISABLED);
        }
    }
}
/**
 * Updates UI when visible state is changed.
 * @abstract
 */
jasonCalendarUIHelper.prototype.updateVisible = function (visible) {
    jasonBaseWidgetUIHelper.prototype.updateVisible.call(this, visible);
}
/**
 * Updates UI when readonly state is changed.
 * @abstract
 */
jasonCalendarUIHelper.prototype.updateReadOnly = function (readonly) {
    jasonBaseWidgetUIHelper.prototype.updateReadOnly.call(this, readonly);
    var buttons = this.htmlElement.getElementsByTagName("a");
    for (var i = 0; i <= buttons.length - 1; i++) {
        if (readonly) {
            buttons[i].removeAttribute(jw.DOM.attributes.READONLY_ATTR)
            buttons[i].classList.remove(jw.DOM.classes.JW_READONLY);
        }
        else {
            buttons[i].setAttribute(jw.DOM.attributes.READONLY_ATTR, true);
            buttons[i].classList.add(jw.DOM.classes.JW_READONLY);
        }
    }
    var inputs = this.htmlElement.getElementsByTagName("input");
    for (var i = 0; i <= inputs.length - 1; i++) {
        if (readonly) {
            inputs[i].removeAttribute(jw.DOM.attributes.READONLY_ATTR)
            inputs[i].classList.remove(jw.DOM.classes.JW_READONLY);
        }
        else {
            inputs[i].setAttribute(jw.DOM.attributes.READONLY_ATTR, true);
            inputs[i].classList.add(jw.DOM.classes.JW_READONLY);
        }
    }
}
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonTabControl.prototype = Object.create(jasonBaseWidget.prototype);
jasonTabControl.prototype.constructor = jasonTabControl;

/**
 * @namespace Containers
 * @description Collection of container widgets. For example tab controls, groupbox, etc.
 */
/**
 * @class
 * @name jasonTabControlOptions
 * @description Configuration for the tab control widget.
 * @memberOf Containers
 * @augments Common.jasonWidgetOptions
 * @property {number}   pageHeight - Tab page height. No default.
 */

/**
 * @event Containers.jasonTabControl#onTabEnter
 * @description Occurs when tab is visible and active.
 * @type {object}
 * @property {Containers.jasonTabControl} sender - The tabcontrol instance.
 * @property {number} tabIndex - The tabindex of the entered tab.
 */

/**
 * jasonTabControl
 * @constructor
 * @descrption Tab control widget.
 * @memberOf Containers
 * @augments Common.jasonBaseWidget
 * @param {HTMLElement} htmlElement - DOM element that will contain the tabcontrol.
 * @param {jasonTabControlOptions} options - Tab control options. 
 * @property {number} tabIndex - Current tab index.
 * @fires Containers.jasonTabControl#event:onTabEnter
 */
function jasonTabControl(htmlElement, options) {
    if ((htmlElement.tagName != "DIV") && (htmlElement.children[0] && htmlElement.children[0].tagName != "UL")) {
        throw new Error("Tabcontrol container must a DIV containing a UL element as first child");
    }

    jasonBaseWidget.call(this, "jasonTabControl", htmlElement,options,jasonTabControlUIHelper);
    this._tabIndex = -1;
    //this.ui.renderUI();
    this.htmlElement.style.display = "";
    this.tabIndex = 0;
}

Object.defineProperty(jasonTabControl.prototype, "tabIndex", {
    get: function () {
        return this._tabIndex;
    },
    set: function (value) {
        if (this._tabIndex != value) {
            this._tabIndex = value;
            this.ui.setActiveTab(this.ui.tabContents[this._tabIndex]);
            this.triggerEvent(jw.DOM.events.JW_EVENT_ON_JW_TAB_ENTER, this._tabIndex);
        }
    },
    enumerable: true,
    configurable: true
});
/**
 * Showing/hiding tabs.
 * @param {number} tabindex - Tabindex of tab to hide/show.
 * @param {boolean} visible - Tab's new visible state.
 */
jasonTabControl.prototype.tabVisible = function (tabIndex, visible) {
    this.ui.tabVisible(tabIndex, visible);
}

jasonTabControlUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonTabControlUIHelper.prototype.constructor = jasonTabControlUIHelper;

/**
 * Tabcontrol UI widget helper.
 * @constructor
 * @ignore
 */
function jasonTabControlUIHelper(widget, htmlElement) {
    this.tabContents = [];
    this.setActiveTab = this.setActiveTab.bind(this);
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);
}
/**
 * Renders tab control's HTML.
 */
jasonTabControlUIHelper.prototype.renderUI = function () {
    var self = this;
    if (!this.tabsList) {
        this.htmlElement.classList.add(jw.DOM.classes.JW_TAB_CONTAINER);
        this.tabsList = this.htmlElement.tagName == "DIV" ? this.htmlElement.children[0] : this.htmlElement;
        this.tabsList.classList.add(jw.DOM.classes.JW_TAB_UL_CLASS);
        for (var i = 0 ; i <= this.tabsList.children.length - 1 ; i++) {
            var liItem = this.tabsList.children[i];
            liItem.classList.add(jw.DOM.classes.JW_TAB_PAGE_CLASS);
            liItem.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_JW_ITEM_INDEX_ATTR, i);
            liItem.setAttribute(jasonWidgets.DOM.attributes.TABINDEX_ATTR, jasonWidgets.common.getNextTabIndex());
            this.eventManager.addEventListener(liItem, jw.DOM.events.CLICK_EVENT, function (clickEvent) {
                if (self.widget.readonly || !self.widget.enabled)
                    return;
                var parentNode = clickEvent.target;
                while (parentNode.tagName != "LI") {
                    parentNode = parentNode.parentNode;
                }
                self.widget.tabIndex = parseInt(parentNode.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_JW_ITEM_INDEX_ATTR));// setActiveTab(parentNode);
            }, true);
        }
        var divElements = [];
        for (var i = 0 ; i <= this.htmlElement.children.length - 1  ; i++) {
            if (this.htmlElement.children[i].tagName == "DIV")
                divElements.push(this.htmlElement.children[i]);
        }


        for (var i = 0 ; i <= divElements.length - 1  ; i++) {
            var childItem = divElements[i];
            if (childItem.tagName == "DIV") {
                var childContainer = this.createElement("div");
                this.htmlElement.removeChild(childItem);
                childContainer.appendChild(childItem);
                childContainer.classList.add(jw.DOM.classes.JW_TAB_PAGE_CONTAINER);
                if (this.widget.options.pageHeight)
                    childContainer.style.height = this.widget.options.pageHeight + "px";
                childContainer.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_JW_ITEM_INDEX_ATTR, i);
                this.tabContents.push(childContainer);
            }
        }

        for (var i = 0 ; i <= this.tabContents.length - 1 ; i++) {
            this.htmlElement.appendChild(this.tabContents[i]);
        }
    }
}


/**
 * Sets the active tab.
 * @param {object} tabElement - HTMLElement
 */
jasonTabControlUIHelper.prototype.setActiveTab = function (tabElement) {
    for (var i = 0 ; i <= this.tabsList.children.length - 1 ; i++) {
        var liItem = this.tabsList.children[i];
        var tabContainer = this.tabContents[i];
        liItem.classList.remove(jw.DOM.classes.JW_TAB_PAGE_ACTIVE);
        if(tabContainer)
            tabContainer.classList.remove(jw.DOM.classes.JW_TAB_PAGE_ACTIVE);
    }
    var tabIndex = parseInt(tabElement.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_JW_ITEM_INDEX_ATTR));
    if (!isNaN(tabIndex)) {
        tabElement.classList.add(jw.DOM.classes.JW_TAB_PAGE_ACTIVE);
        this.tabsList.children[tabIndex].classList.add(jw.DOM.classes.JW_TAB_PAGE_ACTIVE);
        this.tabContents.forEach(function (tabContent, tabContentIndex) {
            tabContent.style.display = "none";
        });
        this.tabContents[tabIndex].style.display = "";
    }
}
/**
 * Updates UI when enable/disable state is changed.
 * @abstract
 */
jasonTabControlUIHelper.prototype.updateEnabled = function (enable) {
    jasonBaseWidgetUIHelper.prototype.updateEnabled.call(this, enable);
    for (var i = 0; i <= this.tabsList.children.length - 1; i++) {
        if (enable)
            this.tabsList.children[i].classList.remove(jw.DOM.classes.JW_DISABLED);
        else
            this.tabsList.children[i].classList.add(jw.DOM.classes.JW_DISABLED);
    }
}
/**
 * Updates UI when visible state is changed.
 * @abstract
 */
jasonTabControlUIHelper.prototype.updateVisible = function (visible) {
    jasonBaseWidgetUIHelper.prototype.updateVisible.call(this, visible);
}
/**
 * Updates UI when readonly state is changed.
 * @abstract
 */
jasonTabControlUIHelper.prototype.updateReadOnly = function (readonly) {
    jasonBaseWidgetUIHelper.prototype.updateReadOnly.call(this, readonly);
}

/**
 * Makes a tab visible or not.
 */
jasonTabControlUIHelper.prototype.tabVisible = function (tabIndex, visible) {
    var tab = this.tabsList.children[tabIndex];
    if (tab) {
        tab.style.display = visible ? "" : "none";
    }
}
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonNumericTextbox.prototype = Object.create(jasonTextbox.prototype);
jasonNumericTextbox.prototype.constructor = jasonNumericTextbox;

/**
 * @class
 * @name jasonNumericTextboxOptions
 * @description Configuration for the NumericTextbox widget.
 * @memberOf Editors
 * @augments Common.jasonWidgetOptions
 * @property {number=} min - Minimum allowed value.
 * @property {number=} max - Maximum allowed value.
 * @property {number=1} step - Increment/decrement step.
 * @property {number=2} precision - Digit precision.If no precision is defined, then no rounding occurs to the numeric value.
 * @property {string} [style=decimal] - The formatting style to use. Possible values are "decimal" for plain number formatting, "currency" for currency formatting and "percent" for percent formatting; the default is "decimal.
 * @property {boolean} [useGrouping=true] - If true then the number will be formated using grouping separators, such as thousands separators.
 * @property {string=} prefix - Prefix to the numeric value.
 * @property {string=} suffix - Suffix to the numeric value.
 * @property {string} [placeholder=""] - Input placeholder string.
 */

/**
 * @event Editors.jasonNumericTextbox#onChange
 * @description Occurs when value is changed.
 * @type {object}
 * @property {Editors.jasonNumericTextbox} sender - The numeric text box instance.
 * @property {number} value - The new number.
 */

/**
 * jasonNumericTextbox
 * @constructor
 * @descrption NumericTextbox control widget.
 * @memberOf Editors
 * @augments Editors.jasonTextbox
 * @param {HTMLElement} htmlElement - DOM element that will contain the numeric textbox.
 * @param {Editors.jasonNumericTextboxOptions} options - NumericTextbox options. 
 * @property {number} value - Numeric value.
 * @fires Editors.jasonNumericTextbox#event:onChange
 */
function jasonNumericTextbox(htmlElement, options) {
    this.defaultOptions = {
        minimumFractionDigits: 2,
        step: 1,
        style:'decimal'
    };
    jasonTextbox.call(this, htmlElement, options, "jasonNumericTextbox", jasonNumericTextboxUIHelper);
    //this.ui.renderUI();
}
/**
 * Returns the widget's value.
 */
jasonNumericTextbox.prototype.readValue = function (value) {
    return value;
}
/**
 * Sets the widget's value.
 * @param {number|string}  value - New value.
 */
jasonNumericTextbox.prototype.setValue = function (value) {
    var valueType = jw.common.getVariableType(value);
    var typeError = false;
    switch (valueType) {
        case jw.enums.dataType.string: {
            var result = parseFloat(value);
            if (isNaN(result)) {
                typeError = true;
                break;
            }
            else
                return result;
        }
        case jw.enums.dataType.number: {
            return value;
        }
        default: {
            typeError = true;
            break;
        }
    }
    if(typeError)
        jw.common.throwError(jw.errorTypes.typeError, "Invalid value type for jasonNumericTextBox.");
}
/**
 * Can be overridden in descendants to return a different formatted result.
 * @param {number} value - Number value.
 */
jasonNumericTextbox.prototype.formatValue = function (value) {
    if (this.options.min && this._value < this.options.min)
        this._value = this.options.min;
    if (this.options.max && this._value > this.options.max)
        this._value = this.options.max;
    var formattedValue = jw.common.formatNumber(this.options.style.toLowerCase() == "percent" ? this._value / 100 : this._value, this.options);
    return (this.options.prefix ? this.options.prefix : "") + formattedValue + (this.options.suffix ? this.options.suffix : "");
}
/**
 * Can be overridden in descendants to return a different value when the "value" property is set, to determine whether a value change is needed or not.
 * @param {number} value - Number value.
 */
jasonNumericTextbox.prototype.compareValue = function (value) {
    return this._value == value ? jw.enums.comparison.equal : jw.enums.comparison.notEqual;
}

jasonNumericTextboxUIHelper.prototype = Object.create(jasonTextboxUIHelper.prototype);
jasonNumericTextboxUIHelper.prototype.constructor = jasonNumericTextboxUIHelper;

/**
 * Textbox UI widget helper.
 * @constructor
 * @ignore
 */
function jasonNumericTextboxUIHelper(widget, htmlElement) {
    this.onNumericButtonClick = this.onNumericButtonClick.bind(this);
    this.onNumericInputKeyDown = this.onNumericInputKeyDown.bind(this);
    this.onTextInputBlur = this.onTextInputBlur.bind(this);
    this.onTextInputFocus = this.onTextInputFocus.bind(this);
    this._acceptableKeyCodes = [
        jw.keycodes.backspace,
        jw.keycodes.tab,
        jw.keycodes.shift,
        jw.keycodes.ctrl,
        jw.keycodes.alt,
        jw.keycodes.home,
        jw.keycodes.end,
        44,
        jw.keycodes.delete,
        jw.keycodes.zero,
        jw.keycodes.one,
        jw.keycodes.two,
        jw.keycodes.three,
        jw.keycodes.four,
        jw.keycodes.five,
        jw.keycodes.six,
        jw.keycodes.seven,
        jw.keycodes.eight,
        jw.keycodes.nine,
        jw.keycodes.numpad0,
        jw.keycodes.numpad1,
        jw.keycodes.numpad2,
        jw.keycodes.numpad3,
        jw.keycodes.numpad3,
        jw.keycodes.numpad4,
        jw.keycodes.numpad5,
        jw.keycodes.numpad6,
        jw.keycodes.numpad7,
        jw.keycodes.numpad8,
        jw.keycodes.numpad9,
        jw.keycodes.dash,
        jw.keycodes.subtract,
        jw.keycodes.decimalPoint];
    jasonTextboxUIHelper.call(this, widget, htmlElement);
}
/**
 * Renders numeric text box HTML.
 */
jasonNumericTextboxUIHelper.prototype.renderUI = function () {
    jasonTextboxUIHelper.prototype.renderUI.call(this);
    if (!this.htmlElement.classList.contains(jw.DOM.classes.JW_NUMERIC_TEXT_BOX)) {
        this.htmlElement.classList.add(jw.DOM.classes.JW_NUMERIC_TEXT_BOX);

        this.numericUpButton = jw.htmlFactory.createJWButton(null, jw.DOM.icons.CHEVRON_UP);
        this.numericUpButton.setAttribute(jw.DOM.attributes.TITLE_ATTR, this.options.localization.numericTextBox.increaseValue);
        this.numericDownButton = jw.htmlFactory.createJWButton(null, jw.DOM.icons.CHEVRON_DOWN);
        this.numericDownButton.setAttribute(jw.DOM.attributes.TITLE_ATTR, this.options.localization.numericTextBox.decreaseValue);
        this.numericUpButton.setAttribute(jw.DOM.attributes.JW_DIRECTION_ATTR, jw.DOM.attributeValues.JW_COMBOBOX_LIST_STATE_UP);
        this.numericDownButton.setAttribute(jw.DOM.attributes.JW_DIRECTION_ATTR, jw.DOM.attributeValues.JW_COMBOBOX_LIST_STATE_DOWN);

        this.htmlElement.appendChild(this.numericUpButton);
        this.htmlElement.appendChild(this.numericDownButton);
    }
}
/**
 * Initializate events.
 */
jasonNumericTextboxUIHelper.prototype.initializeEvents = function () {
    jasonTextboxUIHelper.prototype.initializeEvents.call(this);
    this.eventManager.addEventListener(this.numericUpButton, jw.DOM.events.CLICK_EVENT, this.onNumericButtonClick, true);
    this.eventManager.addEventListener(this.numericDownButton, jw.DOM.events.CLICK_EVENT, this.onNumericButtonClick, true);
    this.eventManager.addEventListener(this.inputControl, jw.DOM.events.KEY_DOWN_EVENT, this.onNumericInputKeyDown, true);
}
/**
 * Handles numeric buttons click.
 */
jasonNumericTextboxUIHelper.prototype.onNumericButtonClick = function (event) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var direction = event.currentTarget.getAttribute(jw.DOM.attributes.JW_DIRECTION_ATTR);
    if (direction != void 0 && direction.trim().length > 0) {
        if (this.widget.value == void 0 || (this.widget.value != void 0 && this.widget.value.length == 0)) {
            this.widget.value = direction == jw.DOM.attributeValues.JW_COMBOBOX_LIST_STATE_DOWN ? -1 : 0;
        }
        else {
            var newValue = direction == jw.DOM.attributeValues.JW_COMBOBOX_LIST_STATE_DOWN ? this.widget.value - this.options.step : this.widget.value + this.options.step;
            this.widget.value = newValue;
        }
    }
}
/**
 * Makes sure it accepts only valid number values.
 */
jasonNumericTextboxUIHelper.prototype.onNumericInputKeyDown = function (event) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var keyCode = event.which || event.keyCode;
    var preventDefault = this._acceptableKeyCodes.indexOf(keyCode) < 0;

    //allowing select,copy,paste functionality.
    if ((keyCode == jw.keycodes.A && event.ctrlKey) ||
        (keyCode == jw.keycodes.C && event.ctrlKey) ||
        (keyCode == jw.keycodes.V && event.ctrlKey))
        preventDefault = false;

    if (keyCode == jw.keycodes.enter) {
        var numericValue = parseFloat(this.inputControl.value);
        if (!isNaN(numericValue)) {
            this.widget.value = numericValue;
        }
    }

    if (preventDefault)
        event.preventDefault();
}
/**
 * Formats number when input looses focus.
 */
jasonNumericTextboxUIHelper.prototype.onTextInputBlur = function (event, sender) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var numericValue = parseFloat(this.inputControl.value);
    this.widget.value = isNaN(numericValue) ? null : numericValue;
    jasonTextboxUIHelper.prototype.onTextInputBlur.call(this, event, sender);
}
/**
 * When input gets focus we set the numeric value,without any formatting.
 */
jasonNumericTextboxUIHelper.prototype.onTextInputFocus = function (event, sender) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    jasonTextboxUIHelper.prototype.onTextInputFocus.call(this, event, sender);
    if (this.widget.value)
        this.inputControl.value = this.widget.value;
}
/**
 * Updates UI when enable/disable state is changed.
 * @abstract
 */
jasonNumericTextboxUIHelper.prototype.updateEnabled = function (enable) {
    jasonTextboxUIHelper.prototype.updateEnabled.call(this, enable);
    if (enable) {
        this.numericUpButton.removeAttribute(jw.DOM.attributes.DISABLED_ATTR)
        this.numericUpButton.classList.remove(jw.DOM.classes.JW_DISABLED);
        this.numericDownButton.removeAttribute(jw.DOM.attributes.DISABLED_ATTR)
        this.numericDownButton.classList.remove(jw.DOM.classes.JW_DISABLED);
    }
    else {
        this.numericUpButton.setAttribute(jw.DOM.attributes.DISABLED_ATTR, true);
        this.numericUpButton.classList.add(jw.DOM.classes.JW_DISABLED);
        this.numericDownButton.setAttribute(jw.DOM.attributes.DISABLED_ATTR, true);
        this.numericDownButton.classList.add(jw.DOM.classes.JW_DISABLED);
    }
}
/**
 * Updates UI when visible state is changed.
 * @abstract
 */
jasonNumericTextboxUIHelper.prototype.updateVisible = function (visible) {
    jasonTextboxUIHelper.prototype.updateVisible.call(this, visible);
}
/**
 * Updates UI when readonly state is changed.
 * @abstract
 */
jasonNumericTextboxUIHelper.prototype.updateReadOnly = function (readonly) {
    jasonTextboxUIHelper.prototype.updateReadOnly.call(this, readonly);
    if (readonly) {
        this.numericUpButton.setAttribute(jw.DOM.attributes.READONLY_ATTR, true);
        this.numericDownButton.setAttribute(jw.DOM.attributes.READONLY_ATTR, true);
    }
    else {
        this.numericUpButton.removeAttribute(jw.DOM.attributes.READONLY_ATTR);
        this.numericDownButton.removeAttribute(jw.DOM.attributes.READONLY_ATTR);
    }
}
jasonGridUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonGridUIHelper.prototype.constructor = jasonGridUIHelper;
    
/**
 * @constructor
 * @ignore
 */
function jasonGridUIHelper(widget, htmlElement) {
    this.resizeTimeout = null;
    this._onColumnMenuItemChecked = this._onColumnMenuItemChecked.bind(this);
    this._onColumnMenuItemClicked = this._onColumnMenuItemClicked.bind(this);
    this._onColumnMenuHidden = this._onColumnMenuHidden.bind(this);
    this._onGridFilterButtonClick = this._onGridFilterButtonClick.bind(this);
    this._onGridColumnMenuIconClick = this._onGridColumnMenuIconClick.bind(this);
    this._onGridColumnCaptionClick = this._onGridColumnCaptionClick.bind(this);
    this._onGridColumnKeyDown = this._onGridColumnKeyDown.bind(this);
    this._onGridColumnFocus = this._onGridColumnFocus.bind(this);
    this._onGridCellKeyDown = this._onGridCellKeyDown.bind(this);
    this._onGridFocus = this._onGridFocus.bind(this);
    this._onGridFooterKeyDown = this._onGridFooterKeyDown.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onDataContainerScroll = this._onDataContainerScroll.bind(this);
    this._onGroupCollapseExpandIconClick = this._onGroupCollapseExpandIconClick.bind(this);
    this._onGroupColumnRemoveClick = this._onGroupColumnRemoveClick.bind(this);
    this._onColumnDrop = this._onColumnDrop.bind(this);
    this._onMoveResizeStart = this._onMoveResizeStart.bind(this);
    this._onColumnResizeEnd = this._onColumnResizeEnd.bind(this);
    this._onSelectionChange = this._onSelectionChange.bind(this);
    this.gridSelectedRows = new Array();
    this.gridSelectedCells = new Array();
    this._currentPage = 1;
    this._currentFilterField = null;
    this._currentFilterColumn = null;
    this._currentTHElement = null;
    this._firstRun = true;

    //initializing grid columns.
    //this.widget._initializeColumns();


    this.isReRendering = false;
    this.isColumnMoveResize = false;
    this.monitorChanges = this.monitorChanges.bind(this);
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);
    //jwWindowEventManager.addWindowEventListener(jw.DOM.events.RESIZE_EVENT, this.monitorChanges);
}
/**
 * Customization template initialization.
 * @ignore
 */
jasonGridUIHelper.prototype.initializeTemplates = function () {
    /*initializing row and column templates*/
    var rowTemplate = (typeof this.options.customization.rowTemplate == "function") ? this.options.customization.rowTemplate() : this.options.customization.rowTemplate;
    var isElement = document.getElementById(rowTemplate);
    if (isElement) {
        rowTemplate = isElement.tagName == "SCRIPT" ? isElement.innerHTML : isElement.outerHTML;
    }
    else {
        rowTemplate = typeof rowTemplate == "string" && rowTemplate.trim().length > 0 ? rowTemplate : null;
    }
    this.options.customization.rowTemplate = rowTemplate;
    if (this.options.columns) {
        for (var i = 0; i <= this.options.columns.length - 1; i++) {
            var column = this.options.columns[i];
            var headerTemplate = typeof column.headerTemplate == "function" ? column.headerTemplate() : column.headerTemplate;
            var isElement = document.getElementById(headerTemplate);
            if (isElement) {
                headerTemplate = isElement.tagName == "SCRIPT" ? isElement.innerHTML : isElement.outerHTML;
            } else {
                headerTemplate = typeof headerTemplate == "string" && headerTemplate.trim().length > 0 ? headerTemplate : null;
            }
            column.headerTemplate = headerTemplate;

            var cellTemplate = typeof column.cellTemplate == "function" ? column.cellTemplate() : column.cellTemplate;
            isElement = document.getElementById(cellTemplate);
            if (isElement) {
                cellTemplate = isElement.tagName == "SCRIPT" ? isElement.innerHTML : isElement.outerHTML;
            } else {
                cellTemplate = typeof cellTemplate == "string" && cellTemplate.trim().length > 0 ? cellTemplate : null;
            }
            column.cellTemplate = cellTemplate;
        }
    }
}
/**
 * UI initialization.
 */
jasonGridUIHelper.prototype.initialize = function () {
    //rendering grid container elements
    this._renderGridContainers();
    /*render the grid thead and sticky headers*/
    this._renderHeader();

    //setting column reordering, resize and grouping functionality.
    this._enableColumnDragResize();
    jasonBaseWidgetUIHelper.prototype.initialize.call(this);
}

jasonGridUIHelper.prototype.monitorChanges = function () {
    window.requestAnimationFrame(this.monitorChanges);
    if (this.isColumnMoveResize || this.isReRendering)
        return;
    if (this.gridHeaderTable.clientWidth != this.gridDataTable.clientWidth) {
        this.isReRendering = true;
        this._sizeColumns();
        this.isReRendering = false;
    }
}

//#region Object properties

//#endregion

//#region Column menu.
/**
 * Creates default column menu.
 */
jasonGridUIHelper.prototype._createColumnMenu = function () {
    this.columnMenu = new jasonMenu(this.gridHeaderTableContainer, {
        _debug: this.options._debug,
        menu: this.widget.defaultGridColumnMenu,
        invokable: true,
        hideDelay: 350,
        orientation: 'vertical',
        autoHide:true,
        events: [
            { eventName: jw.DOM.events.JW_EVENT_ON_JW_MENU_CHECKBOX_CLICKED, listener: this._onColumnMenuItemChecked, callingContext: this },
            { eventName: jw.DOM.events.JW_EVENT_ON_JW_MENU_ITEM_CLICKED, listener: this._onColumnMenuItemClicked, callingContext: this },
            { eventName: jw.DOM.events.JW_EVENT_ON_HIDE, listener: this._onColumnMenuHidden, callingContext: this }
        ],
    }, jasonMenuUIHelper);
}
//#endregion

//#region Events
/**
 * Initializes event handlers.
 */
jasonGridUIHelper.prototype._initializeEvents = function () {
    this.eventManager.addEventListener(this.gridDataTable, jw.DOM.events.MOUSE_DOWN_EVENT, this._onSelectionChange,true);
    this.eventManager.addEventListener(this.gridDataContainer, jw.DOM.events.SCROLL_EVENT, this._onDataContainerScroll);
    jwWindowEventManager.addWindowEventListener("resize", this._onResize);
    //window.addEventListener(jw.DOM.events.RESIZE_EVENT, this._onResize);
    var self = this;
    this.eventManager.addEventListener(this.pagerButtonFirst, jw.DOM.events.CLICK_EVENT, function (event) {
        self._goToPage(1, event);
        event.stopPropagation();
    });

    this.eventManager.addEventListener(this.pagerButtonPrior, jw.DOM.events.CLICK_EVENT, function (event) {
        self._goToPage(self._currentPage - 1, event);
        event.stopPropagation();
    });

    this.eventManager.addEventListener(this.pagerButtonNext, jw.DOM.events.CLICK_EVENT, function (event) {
        self._goToPage(self._currentPage + 1, event);
        event.stopPropagation();
    });

    this.eventManager.addEventListener(this.pagerButtonLast, jw.DOM.events.CLICK_EVENT, function (event) {
        self._goToPage(self._pageCount, event);
        event.stopPropagation();
    });

    this.eventManager.addEventListener(this.pagerInput, jw.DOM.events.BLUR_EVENT, function (event) {
        self._goToPage(self.pagerInput.value, event);
        event.stopPropagation();
    });

    this.eventManager.addEventListener(this.pagerInput, jw.DOM.events.INPUT_EVENT, function (event) {
        self._goToPage(self.pagerInput.value, event);
        event.stopPropagation();
    });
}
/**
 * Disposing events, so GC can reclaim memory.
 */
jasonGridUIHelper.prototype._clearHeaderEvents = function () {
    for (var i = 0; i <= this.gridHeaderTableRow.children.length - 1; i++) {
        var headerElement = this.gridHeaderTableRow.children[i];
        var columnResizer = jw.common.getData(headerElement, "jwColumnResizer");
        if (columnResizer)
            columnResizer.destroy();
        var columnReorder = jw.common.getData(headerElement, "jwColumnReOrdering");
        if (columnReorder)
            columnReorder.destroy();
        jw.common.removeJWEvents(headerElement, true);
    }
}
/**
 * Executed when a jasonMenuItem checkbox is clicked. The value of the checked determines the visibility of the column.
 * @param {object} clickEvent - HTMLEvent.
 * @param {object} menuItem - jasonMenuItem that was clicked.
 * @param {boolean} checked - If false the column will be hidden.
 */
jasonGridUIHelper.prototype._onColumnMenuItemChecked = function (sender,eventData) {
    /*first try to find the corresponding column*/
    var column = this.options.columns.filter(function (col) {
        return col.fieldName == eventData.item.name;
    })[0];
    var actionResult;
    if (eventData.checked)
        actionResult = this.widget.showColumn(column);
    else
        actionResult = this.widget.hideColumn(column);
    //if column was not shown or hidden cancel the event
    //so it will revert the checkbox to its previous state before it was clicked.
    if(!actionResult)
        eventData.cancel = true;
    //return this._columnVisible(column, eventData.checked);
}
/**
 * Executed when a jasonMenuItem checkbox is clicked. The value of the checked determines the visibility of the column.
 * @param {object} clickEvent - HTMLEvent.
 * @param {object} menuItem - jasonMenuItem that was clicked.
 */
jasonGridUIHelper.prototype._onColumnMenuItemClicked = function (sender, eventData) {
    /*first try to find the corresponding column*/
    //var columnIndex = eventData.uiHelper.invokableElement.getAttribute(JW_GRID_COLUMN_ID_ATTR);
    //if (!columnIndex)
    //    columnIndex = jw.common.getElementsByAttribute(eventData.uiHelper.invokableElement, JW_GRID_COLUMN_ID_ATTR, "*")[0];
    //if (columnIndex)
    //    columnIndex = parseInt(columnIndex);
    //var column = this.options.columns[columnIndex];
    var column = this._currentFilterColumn;
    switch (eventData.item.name) {
        case "mnuSortAsc": {
            this.widget.sortBy(column.fieldName, "asc");
            this.columnMenu.ui.hideMenu();
            break;
        }
        case "mnuSortDesc": {
            this.widget.sortBy(column.fieldName, "desc");
            this.columnMenu.ui.hideMenu();
            break;
        }
        case "mnuClearSorting": {
            this.widget.dataSource.clearSorting();
            this._goToPage(this._currentPage, true);
            this.columnMenu.ui.hideMenu();
            break;
        }
        case "mnuClearFiltering": {
            this.widget.dataSource.clearFilters();
            var columnHeaders = this.gridHeaderTableRow.getElementsByTagName("th");
            for (var i = 0; i <= columnHeaders.length - 1; i++) {
                columnHeaders[i].classList.remove(jw.DOM.classes.JW_GRID_FIELD_HAS_FILTER);
            }
            this._clearFilterControls();
            this._goToPage(this._currentPage, true);
            this._sizeColumns();
            this.columnMenu.ui.hideMenu();
        }
    }
}
/**
 * Executed when the grid column menu is hidden
 */
jasonGridUIHelper.prototype._onColumnMenuHidden = function () {
    this._clearFilterControls();
}
/**
 * @ignore
 * Removes a cell element from the selection array and UI class.
 */
jasonGridUIHelper.prototype._manageCellSelection = function (cellElement,ctrlKey) {
    var selectedCell = this.gridSelectedCells[this.gridSelectedCells.indexOf(cellElement)];

    // if cell multi select is on and ctrl key is NOT pressed OR if the cell multi select is off, clear all previous selections.
    if ((this.options.cellMultiSelect == true && ctrlKey == false) || !this.options.cellMultiSelect) {
        this.gridSelectedCells.forEach(function (cellSelected) {
            cellSelected.children[0].classList.remove(jw.DOM.classes.JW_GRID_SELECTED_CELL_CLASS);
            });
        this.gridSelectedCells = new Array();
    }
    if ((selectedCell && this.options.cellMultiSelect == false) || (selectedCell && this.options.cellMultiSelect == true && selectedCell.children[0].classList.contains(jw.DOM.classes.JW_GRID_SELECTED_CELL_CLASS))) {
        selectedCell.children[0].classList.remove(jw.DOM.classes.JW_GRID_SELECTED_CELL_CLASS);
    }
    else
        cellElement.children[0].classList.add(jw.DOM.classes.JW_GRID_SELECTED_CELL_CLASS);
    //if (!this.options.cellMultiSelect) {
    //    this.gridSelectedCells = new Array();
    //}
    this.gridSelectedCells.push(cellElement);
}
/**
 * @ignore
 * Removes a cell element from the selection array and UI class.
 */
jasonGridUIHelper.prototype._manageCellFocused = function (cellElement) {
    if (this._focusedCell) {
        this._focusedCell.children[0].classList.remove(jw.DOM.classes.JW_GRID_FOCUSED_CELL_CLASS);
    }
    cellElement.children[0].classList.add(jw.DOM.classes.JW_GRID_FOCUSED_CELL_CLASS);
    this._focusedCell = cellElement;
}
/**
 * @ignore
 * Adds a cell element to the grid selection array and UI class.
 */
jasonGridUIHelper.prototype._manageRowSelection = function (rowElement, ctrlKey) {
    var selectedRow = this.gridSelectedRows[this.gridSelectedRows.indexOf(rowElement)];

    if (this.options.multiSelect == true && ctrlKey == false) {
        this.gridSelectedRows.forEach(function (rowSelected) {
            rowSelected.classList.remove(jw.DOM.classes.JW_GRID_SELECTED_ROW_CLASS);
        });
        this.gridSelectedRows = new Array();
        this.widget.selectedRows = new Array();
    }

    if (selectedRow && this.options.multiSelect == false || (selectedRow && this.options.multiSelect == true && selectedRow.classList.contains(jw.DOM.classes.JW_GRID_SELECTED_ROW_CLASS))) {
        selectedRow.classList.remove(jw.DOM.classes.JW_GRID_SELECTED_ROW_CLASS);
    }
    else
        rowElement.classList.add(jw.DOM.classes.JW_GRID_SELECTED_ROW_CLASS);
    var rowId = rowElement.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_ROW_ID_ATTR);
    if (!this.options.multiSelect) {
        this.gridSelectedRows = new Array();
        this.widget.selectedRows = new Array();
    }
    this.widget.selectedRows.push(this.widget.dataSource.data[rowId]);
    this.gridSelectedRows.push(rowElement);
}
/**
 * Mananing selected row(s) based on the configuration of the grid.
 * @ignore
 * @param {event} event - DOM event
 */
jasonGridUIHelper.prototype._onSelectionChange = function (event) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var cellTarget = event.target;
    var targetParent = event.target;
    if (targetParent.tagName == "TABLE") return;

    while (targetParent && targetParent.tagName != "TR") {
        targetParent = targetParent.parentNode;
    }

    while (cellTarget.tagName != "TD") {
        cellTarget = cellTarget.parentNode;
    }
    if (targetParent.className.indexOf(jw.DOM.classes.JW_GRID_JW_TABLE_GROUP_ROW_CLASS) >= 0)
        return;
    
    this._manageRowSelection(targetParent, event.ctrlKey);
    this._manageCellSelection(cellTarget, event.ctrlKey);
    this._manageCellFocused(cellTarget);
    this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_SELECTION_CHANGE, this.widget.selectedRows);
}
/**
 * Grid filter click
 */
jasonGridUIHelper.prototype._onGridFilterButtonClick = function (clickEvent) {
    //this.gridFilter.ui.showFilter(filterIconElement, clickEvent);
    //clickEvent.stopPropagation();
}
/**
 * Handling keyboard navigation in the data table.
 */
jasonGridUIHelper.prototype._keyboardNavigateToCell = function (direction,ctrlKey) {
    var lastFocusedCell = this._focusedCell;
    var selectedCellRow = jw.common.getParentElement("tr", lastFocusedCell);
    var newCellToBeSelected = null;
    direction = direction.toLowerCase();
    switch (direction) {
        case "left": {
            newCellToBeSelected = lastFocusedCell.previousSibling;
            if (!newCellToBeSelected) {
                var previousRow = selectedCellRow.previousSibling;
                newCellToBeSelected = previousRow.childNodes[previousRow.childNodes.length - 1];
            }
            this._manageCellFocused(newCellToBeSelected);
            break;
        }
        case "up": {
            var cellIndex = lastFocusedCell.cellIndex;
            var previousRow = selectedCellRow.previousSibling;
            if (previousRow) {
                if (previousRow.classList.contains(jw.DOM.classes.JW_GRID_JW_TABLE_GROUP_ROW_CLASS)) {
                    if (previousRow.getElementsByClassName(jw.DOM.classes.JW_BUTTON)[0]) {
                        previousRow.getElementsByClassName(jw.DOM.classes.JW_BUTTON)[0].focus();
                    }
                } else {
                    newCellToBeSelected =  previousRow.children[cellIndex];
                    this._manageCellFocused(newCellToBeSelected);
                }
                
                
            }
            else {
                var headerElement = this.gridHeaderTableRow.children[cellIndex];
                if (headerElement) {
                    var captionContainer = headerElement.getElementsByClassName("jw-header-cell-caption")[0];
                    if (captionContainer) {
                        var firstAnchor = captionContainer.getElementsByTagName("a")[0];
                        if (firstAnchor)
                            firstAnchor.focus();
                    }
                }
            }
            break;
        }
        case "right": {
            var newCellToBeSelected = lastFocusedCell.nextSibling;
            if (!newCellToBeSelected) {
                var nextRow = selectedCellRow.nextSibling;
                newCellToBeSelected = nextRow.childNodes[0];
            }
            this._manageCellFocused(newCellToBeSelected);
            break;
        }
        case "down": {
            var cellIndex = lastFocusedCell.cellIndex;
            var nextRow = selectedCellRow.nextSibling;
            if (nextRow) {
                newCellToBeSelected = nextRow.classList.contains(jw.DOM.classes.JW_GRID_JW_TABLE_GROUP_ROW_CLASS) ? nextRow.getElementsByClassName(jw.DOM.classes.JW_BUTTON)[0] : nextRow.children[cellIndex];
                this._manageCellFocused(newCellToBeSelected);
            }
            break;
        }
    }
    if (newCellToBeSelected) {
        var currentVerticalScroll = this.gridDataContainer.offsetHeight + this.gridDataContainer.scrollTop;
        var currentHorizontalScroll = this.gridDataContainer.offsetWidth + this.gridDataContainer.scrollLeft;
        var cellVerticalOffsetValue = newCellToBeSelected.offsetTop + newCellToBeSelected.offsetHeight;
        var cellHorizontalOffsetValue = newCellToBeSelected.offsetLeft + newCellToBeSelected.offsetWidth;
        //if the new cell offset position is bigger than the current scroll position or the difference between them is less than the new cell height
        //then it means we need to scroll downwards.
        var needsToScrollDown = (cellVerticalOffsetValue >= currentVerticalScroll) || (Math.abs(currentVerticalScroll - cellVerticalOffsetValue) <= newCellToBeSelected.offsetHeight);

        //if the current scroll position minus the new cell offset value is more than the grid container height, 
        //OR
        //if the difference of the grid container height minus the difference between the new cell offset position and the current scroll position is less than the cell height,
        //it means that the new cell is not within the visible  are of the grid container and we need to scoll upwards 
        var needsToScrollUp = Math.abs(currentVerticalScroll - cellVerticalOffsetValue) >= this.gridDataContainer.offsetHeight ||
            (this.gridDataContainer.offsetHeight - (Math.abs(cellVerticalOffsetValue - currentVerticalScroll)) <= newCellToBeSelected.offsetHeight);

        //if the new cell offset value is larger than the current horizontal scroll or the difference between them is less than the new cell width, then
        //we need to scroll to the right.
        var needsToScrollRight = (cellHorizontalOffsetValue >= currentHorizontalScroll) || ((Math.abs(currentHorizontalScroll - cellHorizontalOffsetValue) <= newCellToBeSelected.offsetWidth));

        //if the current scroll position minus the new cell offset value is more than the grid container width, 
        //OR
        //if the difference of the grid container width minus the difference between the new cell offset position and the current scroll position is less than the cell width,
        //it means that the new cell is not within the visible  are of the grid container and we need to scoll upwards 
        var needsToScrollLeft = Math.abs(currentHorizontalScroll - cellHorizontalOffsetValue) >= this.gridDataContainer.offsetWidth ||
            (this.gridDataContainer.offsetWidth - (Math.abs(cellHorizontalOffsetValue - currentHorizontalScroll)) <= newCellToBeSelected.offsetWidth);

        if (needsToScrollDown || needsToScrollUp || needsToScrollRight || needsToScrollLeft) {

            var scrollValue;
            if (needsToScrollDown) {
                scrollValue = this.gridDataContainer.scrollTop + newCellToBeSelected.offsetHeight;
                if (Math.abs((this.gridDataContainer.offsetHeight + scrollValue) - newCellToBeSelected.offsetTop) <= newCellToBeSelected.offsetHeight)
                    scrollValue = scrollValue + newCellToBeSelected.offsetHeight;
                this.gridDataContainer.scrollTop = scrollValue;
            }
            if (needsToScrollUp) {
                scrollValue = this.gridDataContainer.scrollTop - newCellToBeSelected.offsetHeight;
                if (Math.abs((this.gridDataContainer.offsetHeight - scrollValue) - newCellToBeSelected.offsetTop) >= newCellToBeSelected.offsetHeight)
                    scrollValue = scrollValue - newCellToBeSelected.offsetHeight;
                this.gridDataContainer.scrollTop = scrollValue;
            }
            if(needsToScrollRight){
                scrollValue = this.gridDataContainer.scrollLeft + newCellToBeSelected.offsetWidth;
                if (Math.abs((this.gridDataContainer.offsetWidth - scrollValue) - newCellToBeSelected.offsetLeft) >= newCellToBeSelected.offsetWidth)
                    scrollValue = scrollValue + newCellToBeSelected.offsetWidth;
                this.gridDataContainer.scrollLeft = scrollValue;
            }

            if (needsToScrollLeft) {
                scrollValue = this.gridDataContainer.scrollLeft - newCellToBeSelected.offsetWidth;
                if (Math.abs((this.gridDataContainer.offsetWidth - scrollValue) - newCellToBeSelected.offsetLeft) >= newCellToBeSelected.offsetWidth)
                    scrollValue = scrollValue - newCellToBeSelected.offsetWidth;
                this.gridDataContainer.scrollLeft = scrollValue;
            }
            
        }
    }
}
/**
 * @ignore
 * Occurs when a key is pressed on the grid datatable element.
 */
jasonGridUIHelper.prototype._onGridCellKeyDown = function (keyDownEvent) {
    var key = keyDownEvent.keyCode || keyDownEvent.which;
    var preventDefault = true;
    switch (key) {
        case 9: { preventDefault = false; break;}
        case 37: { this._keyboardNavigateToCell("left", keyDownEvent.ctrlKey); break; }
        case 38: { this._keyboardNavigateToCell("up", keyDownEvent.ctrlKey); break; }
        case 39: { this._keyboardNavigateToCell("right", keyDownEvent.ctrlKey); break; }
        case 40: { this._keyboardNavigateToCell("down", keyDownEvent.ctrlKey); break; }
        case 32: { this._manageCellSelection(this._focusedCell, keyDownEvent.ctrlKey); break; }
        case 13: {
            if (keyDownEvent.ctrlKey)
                this._manageRowSelection(this._focusedCell.parentNode, keyDownEvent.ctrlKey);
            break;
        }
    }
    keyDownEvent.stopPropagation();
    if (preventDefault)
        keyDownEvent.preventDefault();
}
/**
 * When grid receives focus , if does not have a focused cell it sets focus to the 1st cell.
 */
jasonGridUIHelper.prototype._onGridFocus = function (focusEvent) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    if (!this._focusedCell) {
        var cellTarget = this.gridDataTableBody.children[0];
        if (cellTarget) {
            cellTarget = cellTarget.children[0];
            if (cellTarget) {
                this._manageCellSelection(cellTarget, false);
                this._manageCellFocused(cellTarget);
            }
        }
    }
}
/**
 * Grid column menu click
 */
jasonGridUIHelper.prototype._onGridColumnMenuIconClick = function (clickEvent) {
    clickEvent.stopPropagation();
    if (this.widget.readonly || !this.widget.enabled)
        return;
    if (clickEvent.button == 0) {
        this._currentTHElement = jasonWidgets.common.getParentElement("TH", clickEvent.currentTarget);
        if (this._currentTHElement) {
            this._currentFilterColumn = this.widget._columnByField(this._currentTHElement.getAttribute(jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR));
            this._currentFilterField = this._currentFilterColumn.fieldName;
            this.columnMenu.ui.hideMenu();
            //passing the icon container instead of the icon it self
            this.columnMenu.ui.showMenu(clickEvent.currentTarget.parentElement);
            this._updateFilterInputTypes();
        }
    }
}
/*
 * more performant way to handle resize event cals , taken from https://developer.mozilla.org/en-US/docs/Web/Events/resize
 * upon a window resize we want to resize the sticky headers, so they always align with the data table.
 */
jasonGridUIHelper.prototype._onResize = function (resizeEvent) {
    this._sizeColumns();
    //var self = this;
    //if (!this.resizeTimeout) {
    //    this.resizeTimeout = setTimeout(function () {
    //        self.resizeTimeout = null;
    //        self._sizeColumns();
    //        // The actualResizeHandler will execute at a rate of 15fps
    //    }, 66);
    //}
}
/**
 * Keeping in sync the data and header table scroll position.
 */
jasonGridUIHelper.prototype._onDataContainerScroll = function (scrollEvent) {
    this.gridHeaderTableContainer.scrollLeft = this.gridDataContainer.scrollLeft;
}
/**
 * Event handler on column title click, to sort grid data based on the field column
 */
jasonGridUIHelper.prototype._onGridColumnCaptionClick = function (event) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var gridColumnHeader = jw.common.getParentElement("TH", event.target);
    if (gridColumnHeader) {
        var key = event.keyCode || event.which;
        if((event.type == "mousedown" && event.button == 0) || (key == 32 || key == 13)){
            var gridColumnIndex = parseInt(gridColumnHeader.getAttribute(jw.DOM.attributes.JW_GRID_COLUMN_ID_ATTR));
            var sortDirection = gridColumnHeader.getAttribute(jw.DOM.attributes.JW_GRID_COLUMN_SORT_ATTR);
            sortDirection = !sortDirection ? "asc" : sortDirection == "asc" ? "desc" : "asc";
            gridColumnHeader.setAttribute(jw.DOM.attributes.JW_GRID_COLUMN_SORT_ATTR, sortDirection);
            this.widget.sortBy(this.options.columns[gridColumnIndex].fieldName, sortDirection);
            event.stopPropagation();
        }
    }
}
/**
 * Keyevents for grid columns.
 * If the down arrow is pressed it gives focus to the cell below the current column in the first row.
 * If the tab button is pressed and its the last element of the last column then set focus to the data table.
 */
jasonGridUIHelper.prototype._onGridColumnKeyDown = function (keyDownEvent) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var key = keyDownEvent.keyCode || keyDownEvent.which;
    switch (key) {
        case 40: {
            keyDownEvent.preventDefault();
            var gridColumnIndex = parseInt(keyDownEvent.currentTarget.getAttribute(jw.DOM.attributes.JW_GRID_COLUMN_ID_ATTR));
            if (this.gridDataTableBody.children[0] && this.gridDataTableBody.children[0].children[gridColumnIndex]) {
                this._manageCellFocused(this.gridDataTableBody.children[0].children[gridColumnIndex]);
            }
            this.gridDataTable.focus();
            break;
        }
        case 9: {
            var self = this;
            var lastColumn = keyDownEvent.currentTarget.parentNode.lastChild;
            //if its a forward tab and its the last element of the last column then we should set focus to the grid table.
            var isLastColumn = (!keyDownEvent.shiftKey) && (keyDownEvent.currentTarget == lastColumn) && (keyDownEvent.target.parentNode == lastColumn.lastChild);
            setTimeout(function () {
                self.gridDataContainer.scrollLeft = self.gridHeaderTableContainer.scrollLeft;
                if (isLastColumn)
                    self.gridDataTable.focus();
            });
            
            break;
        }
    }
}
/**
 * When the grid footer receives a keydown event, managing the focus flow between the data table and the rest elements that are focusable or have tabindex attributes.
 */
jasonGridUIHelper.prototype._onGridFooterKeyDown = function (keyDownEvent) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var key = keyDownEvent.keyCode || keyDownEvent.which;
    switch (key) {
        case 9: {
            var self = this;
            var isFirstElement = self.pagerContainer.firstChild == keyDownEvent.target;
            setTimeout(function () {
                if (isFirstElement && keyDownEvent.shiftKey)
                    self.gridDataTable.focus();
            });
            break;
        }
    }
}
/**
 * When a grid column (TH) receives focus, make sure the scrolling position of the header and data table are in synch.
 */
jasonGridUIHelper.prototype._onGridColumnFocus = function (focusEvent) {
    this.gridDataContainer.scrollLeft = this.gridHeaderTableContainer.scrollLeft;
}
/**
 * Occurs when the data grouping button is clicked.
 */
jasonGridUIHelper.prototype._onGroupCollapseExpandIconClick = function (event) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var iconNode = event.target.tagName == "I" ? event.target : event.target.children[0];
    this._collapseExpandGroup(null, null, iconNode);
}
/**
 * Collapses, expands a data grouping by either providing the groupLevel and groupKey or directly the icon element of the data grouping button.
 */
jasonGridUIHelper.prototype._collapseExpandGroup = function (groupLevel, groupKey, groupButtonElement) {
    var groupRow = groupButtonElement == void 0 ? jw.common.getElementsByAttributes(this.gridDataTableBody, [jasonWidgets.DOM.attributes.JW_DATA_GROUPING_LEVEL_ATTR, jasonWidgets.DOM.attributes.JW_DATA_GROUPING_KEY_ATTR], [groupLevel, groupKey],"tr." + JW_GRID_JW_TABLE_GROUP_ROW_CLASS)[0] :
                                        jw.common.getParentElement("TR", groupButtonElement);
    groupButtonElement = groupButtonElement == void 0 ? groupRow.getElementsByTagName("i")[0] : groupButtonElement.tagName == "I" ?  groupButtonElement : groupButtonElement.getElementsByTagName("i")[0];
    if (groupButtonElement.className.indexOf(jw.DOM.icons.CIRCLE_ARROW_UP) >= 0) {
        groupButtonElement.className = jw.DOM.icons.CIRCLE_ARROW_DOWN;
        groupRow.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUP_EXPANDED_ATTR, "false");
        this._collapseGroup(groupRow);

        this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_GROUP_COLLAPSE, groupRow.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_KEY_ATTR))
    }
    else {
        groupButtonElement.className = jw.DOM.icons.CIRCLE_ARROW_UP;
        groupRow.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUP_EXPANDED_ATTR, "true");
        this._expandGroup(groupRow);
        this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_GROUP_EXPAND, groupRow.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_KEY_ATTR))
    }
}
/**
 * Returns true the data grouping is expanded.
 */
jasonGridUIHelper.prototype._isGroupExpanded = function(groupLevel,groupKey,groupButtonElement){
    var result;
    var groupRow = groupButtonElement == void 0 ? jw.common.getElementsByAttributse(this.gridDataTableBody, [jasonWidgets.DOM.attributes.JW_DATA_GROUPING_LEVEL_ATTR, jasonWidgets.DOM.attributes.JW_DATA_GROUPING_KEY_ATTR], [groupLevel, groupKey])[0] :
                                        jw.common.getParentElement("TR", groupButtonElement);

    result = groupRow.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUP_EXPANDED_ATTR);

    return result == void 0 ? false : jw.common.strToBool(result);
}
/**
 * Called when a column gets dropped on the grouping container.
 */
jasonGridUIHelper.prototype._onColumnDrop = function (event, htmlElement) {
    if (this.widget.readonly || !this.widget.enabled)
        return;

    if (event.preventDefault)
        event.preventDefault();
    
    var elementFromPoint = document.elementFromPoint(event.clientX, event.clientY);

    if (elementFromPoint) {
        var droppedColumnField = htmlElement.getAttribute(jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR);
        var droppedColumn = this.widget._columnByField(droppedColumnField);

        if (elementFromPoint == this.gridGroupingContainer || jw.common.contains(this.gridGroupingContainer, elementFromPoint)) {
            if (droppedColumn && this.options.grouping) {
                if (droppedColumn.fieldName) {
                    var groupingExists = this.widget.dataSource.groupingExists(droppedColumn.fieldName);
                    if (droppedColumn && !groupingExists) {
                        this.widget.groupByField(droppedColumn.fieldName);
                    }
                }
            }
        }
        var parentElementFromPoint = jw.common.getParentElement("TH", elementFromPoint);
        if (parentElementFromPoint.tagName == "TH") {
            var columnFieldFromPoint = parentElementFromPoint.getAttribute(jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR);
            var columnFromPoint = this.widget._columnByField(columnFieldFromPoint);
            if (columnFromPoint.index != droppedColumn.index) {
                //jw.common.swapItemsInArray(this.options.columns, droppedColumn.index, columnFromPoint.index);
                //jw.common.swapDomElements(this.gridHeaderTableRow, droppedColumn.index, columnFromPoint.index);
                //jw.common.swapDomElements(this.headerTableColGroup, droppedColumn.index, columnFromPoint.index);
                //jw.common.swapDomElements(this.dataTableColGroup, droppedColumn.index, columnFromPoint.index);

                //var droppedIndex = droppedColumn.index;
                //droppedColumn.index = columnFromPoint.index;
                //columnFromPoint.index = droppedIndex;



                //this.renderUI();
                //this.widget.triggerEvent(JW_EVENT_ON_COLUMN_POSITION_CHANGE, { column: droppedColumn, fromIndex: columnFromPoint.index, toIndex: droppedColumn.index });
                this.moveColumn(droppedColumn, columnFromPoint.index);
            }
        }
    }
    this.isColumnMoveResize = false;
}
/***
 * Called when a column starts moving or resizes.
 */
jasonGridUIHelper.prototype._onMoveResizeStart = function (event, htmlElement) {
    this.isColumnMoveResize = true;
}
/**
 * Moves column to a new position.
 */
jasonGridUIHelper.prototype.moveColumn = function (column, newIndex) {
    jw.common.swapItemsInArray(this.options.columns, column.index, newIndex);
    jw.common.swapDomElements(this.gridHeaderTableRow, column.index, newIndex);
    jw.common.swapDomElements(this.headerTableColGroup, column.index, newIndex);
    jw.common.swapDomElements(this.dataTableColGroup, column.index, newIndex);

    var droppedIndex = column.index;
    //swapping index values between column that is moved and column that was there.
    this.options.columns[newIndex].index = newIndex;
    this.options.columns[droppedIndex].index = droppedIndex;

    this.renderUI();
    this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_COLUMN_POSITION_CHANGE, { column: column, fromIndex: column.index, toIndex: newIndex });
}
/**
 * Called when a column resize is ends.
 */
jasonGridUIHelper.prototype._onColumnResizeEnd = function (event, htmlElement) {
    var fieldName = htmlElement.getAttribute(jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR);
    var column = this.widget._columnByField(fieldName);
    if (column) {
        column.width = htmlElement.offsetWidth;
    }
    this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_COLUMN_RESIZED, { column: column, newWidth: column.width });
    this.isColumnMoveResize = false;
}
/**
 * Removes grouping.
 */
jasonGridUIHelper.prototype._onGroupColumnRemoveClick = function (event) {
    var groupingContainer = jw.common.getParentElement("DIV", event.target);
    var fieldNameToRemove = groupingContainer.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_FIELD_ATTR);
    this.widget.removeGrouping(fieldNameToRemove);
}
//#endregion


//#region RenderUI
/**
 * Renders grid UI. Header,body,footer,pager,filter.
 */
jasonGridUIHelper.prototype.renderUI = function (recordStart,recordStop) {
    //rendering all grid container elements. Header,data,footer and grouping container
    //this._renderGridContainers();
    //this.widget._initializeColumns();
    this._calculatePageCount(this.widget.dataSource.data);

    /*render the grid thead and sticky headers*/
//    this._renderHeader();

    var fromRecord = recordStart ? recordStart : 0;
    var toRecord = recordStop ? recordStop : 0;
    if (toRecord == 0) {
        toRecord = this.widget.dataSource.data ? this.widget.dataSource.data.length : 0;
        toRecord = this.widget.options.paging && this.widget.options.paging.pagesize && toRecord > this.widget.options.paging.pagesize ? this.widget.options.paging.pagesize : toRecord;
    }

    /*actual rendering of the table body*/
    this._renderRows(fromRecord, toRecord - 1);

    this._sizeColumns();

    /*last but not least the footer*/
    this._renderFooter(toRecord);

    var calcHeightDiff = 35;
    if (this.options.grouping)
        calcHeightDiff = calcHeightDiff + 35;
    if(this.options.paging)
        calcHeightDiff = calcHeightDiff + 35;
    this.gridDataContainer.style.height = jw.common.formatString("calc(100% - {0}px", [calcHeightDiff]);
    if (this.gridDataContainer.style.height == "")
        this.gridDataContainer.style.height = jw.common.formatString("calc(100% - {0}px", [calcHeightDiff]);
}
/**
 * Creates header,data and footer containers for the grid
 */
jasonGridUIHelper.prototype._renderGridContainers = function () {
    if (!this.gridHeaderContainer) {
        this.htmlElement.classList.add(jw.DOM.classes.JW_GRID_CLASS);

        this.gridHeaderContainer = this.createElement("div");
        this.gridHeaderContainer.classList.add(jw.DOM.classes.JW_GRID_HEADER_CONTAINER);
        this.gridHeaderTableContainer = this.createElement("div");
        this.gridHeaderTableContainer.classList.add(jw.DOM.classes.JW_GRID_HEADER_JW_TABLE_CONTAINER);
        this.gridHeaderContainer.appendChild(this.gridHeaderTableContainer);
        if (!this.widget.options.grouping) {
            this.gridHeaderContainer.classList.add(jw.DOM.classes.JW_GRID_HEADER_CONTAINER_NO_GROUPING);
        }
        this.gridDataContainer = this.createElement("div");
        this.gridDataContainer.classList.add(jw.DOM.classes.JW_GRID_DATA_CONTAINER);
        this.gridFooterContainer = this.createElement("div");
        this.gridFooterContainer.classList.add(jw.DOM.classes.JW_GRID_FOOTER_CONTAINER);
        this.eventManager.addEventListener(this.gridFooterContainer, jw.DOM.events.KEY_DOWN_EVENT, this._onGridFooterKeyDown, true);

        //Grouping container
        if (this.options.grouping == true && !this.gridGroupingContainer) {
            this.gridGroupingContainer = this.htmlElement.appendChild(this.createElement("div"));
            this.gridGroupingContainer.classList.add(jw.DOM.classes.JW_GRID_GROUPING_CONTAINER_CLASS);
            var groupingMessage = this.createElement("span");
            groupingMessage.classList.add(jw.DOM.classes.JW_GRID_GROUPING_MESSAGE);
            this.gridGroupingContainer.appendChild(groupingMessage);
        }

        this.htmlElement.appendChild(this.gridHeaderContainer);
        this.htmlElement.appendChild(this.gridDataContainer);
        this.htmlElement.appendChild(this.gridFooterContainer);
    }
}
/**
 * Enables move/resize on grid columns based on the configuration options.
 */
jasonGridUIHelper.prototype._enableColumnDragResize = function () {
    if (this.options.reordering || this.options.grouping || this.options.resizing) {
        for (var i = 0; i <= this.gridHeaderTableRow.children.length - 1; i++) {
            var headerElement = this.gridHeaderTableRow.children[i];
            var columnDragResize = jw.common.getData(headerElement, "jwColumnDragResize");
            if (headerElement.tagName == "TH" & !columnDragResize && !headerElement.getAttribute(jw.DOM.attributes.JW_GRID_GROUP_FIELD)) {
                columnDragResize = new jasonDragResize(headerElement, {
                    minWidth: 50,
                    useGhostPanel:true,
                    allowResize: { top: false, left: false, bottom:false, right:true },
                    allowDrag:this.options.reordering,
                    dependantElements: [this.headerTableColGroup.children[i], this.dataTableColGroup.children[i]],
                    onMoveStart:this._onMoveResizeStart,
                    onMoveEnd: this._onColumnDrop,
                    onResizeStart:this._onMoveResizeStart,
                    onResizeEnd:this._onColumnResizeEnd,
                    ghostPanelCSS: jw.DOM.classes.JW_DRAG_IMAGE,
                    ghostPanelContents: headerElement.querySelectorAll("." + jw.DOM.classes.JW_GRID_HEADER_CELL_CAPTION_CONTAINER)[0].innerHTML,
                    gridMode:true
                },this.options.columns[i].fieldName);
                //columnReorder = new jasonGridColumnReorder(this, headerElement);
                jw.common.setData(headerElement, "jwColumnDragResize", columnDragResize);
            } else {
                if (columnDragResize) {
                    columnDragResize.options.allowDrag.draggable = this.options.reordering;
                    columnDragResize.options.allowResize = this.options.resizing ? { top: false, left: false, bottom: false, right: true } : { top: false, left: false, bottom: false, right: false };
                }
            }
        }
    } else {
        for (var i = 0; i <= this.gridHeaderTableRow.children.length - 1; i++) {
            var headerElement = this.gridHeaderTableRow.children[i];
            var columnDragResize = jw.common.getData(headerElement, "jwColumnDragResize");
            if (columnDragResize)
                columnDragResize.destroy();
        }
    }
}
/**
 * Sizing grid headers so the sticky headers and grid data headers align properly 
 */
jasonGridUIHelper.prototype._sizeColumns = function () {
    this.hasScrollBars = this.gridDataContainer.scrollHeight > this.gridHeaderContainer.parentNode.clientHeight;
    if (!this.scrollBarWidth)
        this.scrollBarWidth = jasonWidgets.common.scrollBarWidth();
    var fixedWidthColumnsTotal = this._fixedWidthColumnsSum();


    this.gridHeaderTableContainer.style.width = this.hasScrollBars ? "calc(100% - " + (this.scrollBarWidth) + "px)" : "";
    if (this.gridHeaderTableContainer.style.width == "")
        this.gridHeaderTableContainer.style.width = this.hasScrollBars ? "-webkit-calc(100% - " + (this.scrollBarWidth) + "px)" : "";

    //sync widths between the two table elements.
    if (this.gridHeaderTable.clientWidth != this.gridDataTable.clientWidth) {
        var newWidth = this.gridHeaderTableContainer.clientWidth;// > this.gridDataTable.clientWidth ? this.gridHeaderTable.clientWidth : this.gridDataTable.clientWidth;
        this.gridHeaderTable.style.width = newWidth + "px";
        this.gridDataTable.style.width = newWidth + "px";
    }

    var oneColumnWidth = (((this.gridHeaderTableContainer.clientWidth - fixedWidthColumnsTotal) - 1) / this._columnCountWithNoFixedWidth()) - this._groupColumnsWidth();
    var headerColGroup = this.gridHeaderTable.getElementsByTagName("colgroup")[0];
    var dataTableColGroup = this.gridDataTable.getElementsByTagName("colgroup")[0];
    /*Iterating through the rendered header and adjust their widths*/
    for (var i = 0; i<= headerColGroup.children.length - 1;  i++) {
        var gridColumn = this.options.columns[i];
        var headerTableColElement = headerColGroup.children[i];
        var dataTableColElement = dataTableColGroup.children[i];
        var newWidth = "0px";
        if (gridColumn.visible) {
            if (gridColumn.width && isNaN(gridColumn.width) && gridColumn.width.indexOf("%") >= 0) {
                var widthNum = parseFloat(gridColumn.width.replace("%",""));
                gridColumn.width = (this.gridHeaderTableContainer.clientWidth * widthNum) / 100;
            }
            //setting the col group elements widths for sticky and data table columns.
            newWidth = gridColumn.width ? isNaN(gridColumn.width) ? gridColumn.width : gridColumn.width + "px" : oneColumnWidth + "px";
            headerTableColElement.style.width = newWidth;
            dataTableColElement.style.width = newWidth;
        }
    }
    /*
     * Specific Safari issue. TODO: Investigate a solution that does not require this workaround.
     * Safari has some issues rendering the grid columns/data initially.
     * The header and the data table appear to home much smaller width and the UI is broken.
     * If the htmlElement is hidden and shown then Safari renders correctly the HTML.
     */
    if (window.navigator.vendor.indexOf("Apple")>=0) {
        this._firstRun = false;
        var self = this;
        this.htmlElement.style.display = "none";
        setTimeout(function () {
            self.htmlElement.style.display = "";
        });
    }
}
/**
 * Calculating the width sum of all columns with fixed(or better put assigned) width
 */
jasonGridUIHelper.prototype._fixedWidthColumnsSum = function () {
    var result = 0;
    var onlyNumbers = new RegExp("/[^0-9.,]/g");
    var self = this;
    this.options.columns.forEach(function (gridColumn) {
        if (gridColumn.width && !gridColumn.groupColumn && gridColumn.visible) {
            var numericWidth = 0;
            if (gridColumn.width && isNaN(gridColumn.width) && gridColumn.width.indexOf("%") >= 0) {
                var widthNum = parseFloat(gridColumn.width.replace("%", ""));
                numericWidth = (self.gridHeaderTableContainer.clientWidth * widthNum) / 100;
            }
            else
                numericWidth = isNaN(gridColumn.width) ? parseFloat(gridColumn.width.replace(/\D/g, '')) : gridColumn.width;
            result = result + numericWidth;
        }
    });
    return result;
}
/**
 * Returns the columnCount with no specified width.
 */
jasonGridUIHelper.prototype._columnCountWithNoFixedWidth = function () {
    return this.options.columns.filter(function (col) { return col.width ? false : true; }).length;
}
/**
 * Returns the width sum of the group columns.
 */
jasonGridUIHelper.prototype._groupColumnsWidth = function () {
    return this.options.columns.filter(function (col) { return col.groupColumn ? true : false; }).length * 25;
}
/**
 * Renders different filter editors based on the column data type.
 */
jasonGridUIHelper.prototype._updateFilterInputTypes = function () {
    if (this._currentFilterColumn) {
        this._prepareFilterValues(this._currentFilterColumn.dataType);
        this.firstFilterCombobox.dataSource.setData(this.filterValues);
        this.secondFilterCombobox.dataSource.setData(this.filterValues);
        jw.common.removeChildren(this.firstFilterInputContainer);
        jw.common.removeChildren(this.secondFilterInputContainer);
        this.firstFilterInputContainer.className = jw.DOM.classes.JW_GRID_FILTER_INPUT;
        this.secondFilterInputContainer.className = jw.DOM.classes.JW_GRID_FILTER_INPUT;
        switch (this._currentFilterColumn.dataType) {
            case jw.enums.dataType.string: {
                this.firstFilterInput  = new jasonTextbox(this.firstFilterInputContainer, { placeholder: this.options.localization.search.searchPlaceHolder });
                this.secondFilterInput = new jasonTextbox(this.secondFilterInputContainer, { placeholder: this.options.localization.search.searchPlaceHolder });
                break;
            }
            case jw.enums.dataType.number: {
                this.firstFilterInput = new jasonNumericTextbox(this.firstFilterInputContainer, { placeholder: this.options.localization.search.searchPlaceHolder });
                this.secondFilterInput = new jasonNumericTextbox(this.secondFilterInputContainer, { placeholder: this.options.localization.search.searchPlaceHolder });
                break;
            }
            case jw.enums.dataType.integer: {
                this.firstFilterInput = new jasonNumericTextbox(this.firstFilterInputContainer, { placeholder: this.options.localization.search.searchPlaceHolder, minimumFractionDigits: 0 });
                this.secondFilterInput = new jasonNumericTextbox(this.secondFilterInputContainer, { placeholder: this.options.localization.search.searchPlaceHolder, minimumFractionDigits: 0 });
                break;
            }
            case jw.enums.dataType.currency: {
                this.firstFilterInput = new jasonNumericTextbox(this.firstFilterInputContainer, { placeholder: this.options.localization.search.searchPlaceHolder, style: 'currency' });
                this.secondFilterInput = new jasonNumericTextbox(this.secondFilterInputContainer, { placeholder: this.options.localization.search.searchPlaceHolder, style: 'currency' });
                break;
            }
            case jw.enums.dataType.date: {
                this.firstFilterInput = new jasonDatePicker(this.firstFilterInputContainer, { placeholder: this.options.localization.search.searchPlaceHolder });
                this.secondFilterInput = new jasonDatePicker(this.secondFilterInputContainer, { placeholder: this.options.localization.search.searchPlaceHolder });
                break;
            }
        }
    }
}
/**
 * Renders filter UI for grid columns.
 */
jasonGridUIHelper.prototype._renderFilterUI = function () {
    var self = this;
    if (!this.filterContainer) {
        this._prepareFilterValues(jw.enums.dataType.string);
        this.filterContainer = this.createElement("div");
        this.filterContainer.className = jw.DOM.classes.JW_GRID_FILTER_CONTAINER_CLASS;
        this.filterContainer.style.display = "none";
        /*filter header*/
        this.filterHeader = this.createElement("div");
        this.filterHeader.className = jw.DOM.classes.JW_GRID_FILTER_HEADER_CLASS;
        this.filterHeaderTitle = this.createElement("span");
        this.filterHeaderTitle.appendChild(this.createTextNode(self.options.localization.grid.filtering.filterHeaderCaption));
        this.filterHeader.appendChild(this.filterHeaderTitle);

        /*filter body*/
        this.filterBody = this.createElement("div");
        this.filterBody.className = jw.DOM.classes.JW_GRID_FILTER_BODY_CLASS;
        /*creating filter combobox containers*/
        this.firstFilterOperatorContainer = this.createElement("div");

        this.filterLogicalOperator = this.createElement("div");

        this.secondFilterOperatorContainer = this.createElement("div");

        /*creating jwComboboxes*/
        this.firstFilterCombobox = new jasonCombobox(this.firstFilterOperatorContainer, {
            data: this.filterValues,
            displayFields: ['title'],
            displayFormat: '{0}',
            keyFieldName: 'key',
            readonly: true,
            dropDownList:true,
            placeholder: this.options.localization.search.searchPlaceHolder
        });
        this.secondFilterCombobox = new jasonCombobox(this.secondFilterOperatorContainer, {
            data: this.filterValues,
            displayFields: ['title'],
            displayFormat: '{0}',
            keyFieldName: 'key',
            readonly: true,
            dropDownList: true,
            placeholder: this.options.localization.search.searchPlaceHolder
        });
        this.logicalOperatorCombobox = new jasonCombobox(this.filterLogicalOperator, { data: this.filterLogicalOperators, displayFields: ['title'], displayFormat: '{0}', keyFieldName: 'Key', readonly: true, placeHolder: this.options.localization.search.searchPlaceHolder });

        /*creating input elements*/
        this.firstFilterInputContainer = this.createElement("div");
        this.firstFilterInputContainer.className = jw.DOM.classes.JW_GRID_FILTER_INPUT;
        //this.firstFilterInput = jw.htmlFactory.createJWTextInput(null, this.options.localization.search.searchPlaceHolder);
        //this.firstFilterInputContainer.appendChild(this.firstFilterInput);
        //var inputKeyDownEvent = function (keyDownEvent) {
        //    var key = keyDownEvent.keyCode || keyDownEvent.which;
        //    switch (key) {
        //        case 13: {
        //            self.filterBtnApply.click();
        //            break;
        //        }
        //    }
        //}
        //this.eventManager.addEventListener(this.firstFilterInput, jw.DOM.events.KEY_DOWN_EVENT, inputKeyDownEvent);

        //this.secondFilterInput = jw.htmlFactory.createJWTextInput(null, this.options.localization.search.searchPlaceHolder);
        this.secondFilterInputContainer = this.createElement("div");
        this.secondFilterInputContainer.className = jw.DOM.classes.JW_GRID_FILTER_INPUT;
        //this.secondFilterInputContainer.appendChild(this.secondFilterInput);

        //this.eventManager.addEventListener(this.secondFilterInput, jw.DOM.events.KEY_DOWN_EVENT, inputKeyDownEvent);

        /*adding them to the dom*/
        this.filterBody.appendChild(this.firstFilterOperatorContainer);
        this.filterBody.appendChild(this.firstFilterInputContainer);
        this.filterBody.appendChild(this.filterLogicalOperator);
        this.filterBody.appendChild(this.secondFilterOperatorContainer);
        this.filterBody.appendChild(this.secondFilterInputContainer);



        /*filter footer*/
        this.filterFooter = this.createElement("div");
        this.filterFooter.className = jw.DOM.classes.JW_GRID_FILTER_FOOTER_CLASS;


        this.filterBtnApply = jw.htmlFactory.createJWButton(this.options.localization.grid.filtering.applyButtonText, jw.DOM.icons.CIRCLE_CHOOSE);//this.createElement("a");
        this.filterBtnApply.classList.add(jw.DOM.classes.JW_JW_GRID_FILTER_BUTTON_APPLY);

        this.eventManager.addEventListener(this.filterBtnApply, jw.DOM.events.CLICK_EVENT, function (clickEvent) {
            self._applyFilter();
        },true);


        this.filterBtnClear = jw.htmlFactory.createJWButton(this.options.localization.grid.filtering.clearButtonText, jw.DOM.icons.CLOSE);//this.createElement("a");
        this.filterBtnClear.classList.add(jw.DOM.classes.JW_JW_GRID_FILTER_BUTTON_CLEAR);

        this.eventManager.addEventListener(this.filterBtnClear, jw.DOM.events.CLICK_EVENT, function (clickEvent) {
            self._clearFilterControls();
            self.widget.clearFilter(self._currentFilterField);
        },true);

        jwDocumentEventManager.addDocumentEventListener(jw.DOM.events.MOUSE_DOWN_EVENT, function (mouseDownEvent) {
            var containerRect = self.filterContainer.getBoundingClientRect();
            var isClickOutOfContainerHorizontal = (mouseDownEvent.x > containerRect.right) || (mouseDownEvent.x < containerRect.left);
            var isClickOutOfContainerVertical = (mouseDownEvent.y > containerRect.bottom) || (mouseDownEvent.y < containerRect.top);
            var shouldHideFilter = (isClickOutOfContainerHorizontal || isClickOutOfContainerVertical) && self.filterContainer.style.display == "";
        });

        var clearFilter = this.createElement("div");
        clearFilter.classList.add(jw.DOM.classes.JW_CLEAR_FLOAT_CLASS);
        this.filterFooter.appendChild(this.filterBtnClear);
        this.filterFooter.appendChild(this.filterBtnApply);
        this.filterFooter.appendChild(clearFilter);

        this.filterContainer.appendChild(this.filterHeader);
        this.filterContainer.appendChild(this.filterBody);
        this.filterContainer.appendChild(this.filterFooter);

        this._clearFilterControls();
        this.widget.htmlElement.appendChild(this.filterContainer);
    }
}
/**
 * Applies filter to grid data, based on the values of the filter UI elements.
 */
jasonGridUIHelper.prototype._applyFilter = function () {
    var filterValues = [];
    var firstFilterValue = this.firstFilterInput.value;

    if (firstFilterValue) {
        if(typeof firstFilterValue == "string")
            firstFilterValue = firstFilterValue.trim().length == 0 ? undefined : firstFilterValue;
        if (this._currentFilterColumn.dataType)
            firstFilterValue = jasonWidgets.common.convertValue(firstFilterValue, this._currentFilterColumn.dataType);

        filterValues.push({
            value: firstFilterValue,
            filterClause: this.firstFilterCombobox.value,
            logicalOperator: this.logicalOperatorCombobox.value
        });
    }

    secondFilterValue = this.secondFilterInput.value;

    if (secondFilterValue) {
        if (typeof secondFilterValue == "string")
            secondFilterValue = secondFilterValue.trim().length == 0 ? undefined : secondFilterValue;

        if (this._currentFilterColumn.dataType)
            secondFilterValue = jasonWidgets.common.convertValue(secondFilterValue, this._currentFilterColumn.dataType);
        filterValues.push({
            value: secondFilterValue,
            filterClause: secondFilterValue == void 0 ? null : this.secondFilterCombobox.value,
            logicalOperator: this.secondFilterInput.value ? this.secondFilterCombobox.value : null
        });
    }
    if (filterValues.length > 0)
        this.widget.filterBy(this._currentFilterField, filterValues);
    else
        this.widget.clearFilter(this._currentFilterField);
}
/**
 * Clears any applied filters.
 */
jasonGridUIHelper.prototype._clearFilterControls = function () {
    this.firstFilterCombobox.ui.hideList();
    this.secondFilterCombobox.ui.hideList();
    this.logicalOperatorCombobox.ui.hideList();
    this.firstFilterCombobox.selectItem(0);
    this.secondFilterCombobox.selectItem(0);
    this.logicalOperatorCombobox.selectItem(0);
    //this.firstFilterInput.value = "";
    //this.secondFilterInput.value = "";
}
/**
 * Loads filter values to filter elements
 */
jasonGridUIHelper.prototype._loadFilterValues = function (filter) {
    if (filter) {
        var fistFilterValue = filter.filterValues[0];
        if (fistFilterValue) {
            this.firstFilterCombobox.selectItem(fistFilterValue.filterClause.key);
            this.firstFilterInput.value = fistFilterValue.value;
            this.logicalOperatorCombobox.selectItem(fistFilterValue.logicalOperator.key);
        }
        var secondFilterValue = filter.filterValues[1];
        if (secondFilterValue && secondFilterValue.filterClause) {
            this.secondFilterCombobox.selectItem(secondFilterValue.filterClause.key);
            this.secondFilterInput.value = secondFilterValue.value;
        }
    }
}
/**
 * Prepares localized filter values.
 * @ignore
 */
jasonGridUIHelper.prototype._prepareFilterValues = function (fieldDataType) {
    var self = this;
    this.filterValues = [];
    this.filterValues.push({
        title: self.options.localization.filter.values.filterValueIsEqual,
        visible: true,
        symbol: '='
    });
    this.filterValues.push({
        title: self.options.localization.filter.values.filterValueIsNotEqual,
        visible: true,
        symbol: '!='
    });
    if (fieldDataType == jw.enums.dataType.string) {
        this.filterValues.push({
            title: self.options.localization.filter.values.filterValueStartsWith,
            visible: true,
            symbol: 'startsWith'
        });

        this.filterValues.push({
            title: self.options.localization.filter.values.filterValueEndsWith,
            visible: true,
            symbol: 'endsWith'
        });
        this.filterValues.push({
            title: self.options.localization.filter.values.filterValueContains,
            visible: true,
            symbol: 'contains'
        });
    }
    if (fieldDataType != jw.enums.dataType.string) {
        this.filterValues.push({
            title: self.options.localization.filter.values.filterValueGreaterThan,
            visible: true,
            symbol: '>'
        });
        this.filterValues.push({
            title: self.options.localization.filter.values.filterValueGreaterEqualTo,
            visible: true,
            symbol: '>='
        });
        this.filterValues.push({
            title: self.options.localization.filter.values.filterValueLessThan,
            visible: true,
            symbol: '<'
        });
        this.filterValues.push({
            title: self.options.localization.filter.values.filterValueLessEqualTo,
            visible: true,
            symbol: '<='
        });
    }
    this.filterValues.forEach(function (filterValue, filterValueIndex) { filterValue.key = filterValueIndex; });
    this.filterLogicalOperators = [];
    this.filterLogicalOperators.push({
        title: self.options.localization.filter.operators.and,
        visible: true,
        operator: 'and'
    });
    this.filterLogicalOperators.push({
        title: self.options.localization.filter.operators.or,
        visible: true,
        operator: 'or'
    });
    this.filterLogicalOperators.forEach(function (filterOperator, filterOperatorIndex) { filterOperator.key = filterOperatorIndex; });
}
/**
 * Sets visible true or
 */
jasonGridUIHelper.prototype._columnVisible = function (column, visible) {
    /*get an array of currently visible columns.*/
    var columnVisibleCount = this.options.columns.filter(function (col) { return col.visible == true; });

    /*If the visible count of the columns is > 1, then go ahead and show/hide the column.
     * However if there is only one visible column left, it cannot be hidden.
     * So the hide/show will if visible count > 1 or user is not trying to hide the last visible column.
     */
    if (column && (columnVisibleCount.length > 1 || columnVisibleCount[0].fieldName != column.fieldName)) {
        column.visible = visible;
        var displayStyle = visible ? "" : "none";

        var selectorString = 'th[' + jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR + "='" + column.fieldName + "']";

        var headerTH = this.gridHeaderTableRow.querySelectorAll(selectorString)[0];
        if (headerTH)
            headerTH.style.display = displayStyle;

        selectorString = "col[" + jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR + "='" + column.fieldName + "']";

        var headerCol = this.headerTableColGroup.querySelectorAll(selectorString)[0];
        if (headerCol)
            headerCol.style.display = displayStyle;

        var dataCol = this.dataTableColGroup.querySelectorAll("col[" + jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR + "='" + column.fieldName + "']")[0];
        if (dataCol)
            dataCol.style.display = displayStyle;
        
        var cellsToHide = document.querySelectorAll("td[" + jw.DOM.attributes.JW_DATA_CELL_ID_ATTR + "='" + column.index + "']");
        for (var i = 0; i <= cellsToHide.length - 1; i++) {
            cellsToHide[i].style.display = displayStyle;
        }
        var groupCells = this.gridDataTableBody.querySelectorAll(".group-row td");
        var colSpanValue = this.options.columns.filter(function (col) { return col.visible == true; }).length;
        for (var i = 0; i <= groupCells.length - 1; i++) {
            groupCells[i].setAttribute(jasonWidgets.DOM.attributes.COLSPAN_ATTR, colSpanValue);
        }
        //this._renderHeader();
        //this.renderUI(this._currentPage, this._pageCount);
        return true;
    }
    else
        return false;
}
//#endregion

//#region rendering - HEADER - start*/
/**
 * Renders grid header and/or grouping container , depending on configuration. 
 */
jasonGridUIHelper.prototype._renderHeader = function () {

    if (!this.gridHeaderTable) {
        //Header table
        this.gridHeaderTable = this.gridHeaderTableContainer.appendChild(this.createElement("table"));
        this.headerTableColGroup = this.gridHeaderTable.appendChild(this.createElement("colgroup"));
        var headerTHead = this.gridHeaderTable.appendChild(this.createElement("thead"));
        //Data table
        this.gridDataTable = this.gridDataContainer.appendChild(this.createElement("table"));
        this.dataTableColGroup = this.gridDataTable.appendChild(this.createElement("colgroup"));
        this.gridDataTableBody = this.gridDataTable.appendChild(this.createElement("tbody"));
        this.gridHeaderTableRow = headerTHead.appendChild(this.createElement("tr"));
        //this.gridHeaderTable.setAttribute(jasonWidgets.DOM.attributes.TABINDEX_ATTR, jw.common.getNextTabIndex());
        //by setting the tabindex attribute, the table element can receive keyboard events.
        this.gridDataTable.setAttribute(jasonWidgets.DOM.attributes.TABINDEX_ATTR, -1);
        this.eventManager.addEventListener(this.gridDataTable, jw.DOM.events.KEY_DOWN_EVENT, this._onGridCellKeyDown, true);
        this.eventManager.addEventListener(this.gridDataTable, jw.DOM.events.FOCUS_EVENT, this._onGridFocus, true);
    }

    if (!this.headerTableColGroup)
        this.headerTableColGroup = this.gridHeaderTable.getElementsByTagName("colgroup")[0];
    if(!this.dataTableColGroup)
        this.dataTableColGroup = this.gridDataTable.getElementsByTagName("colgroup")[0];

    this._renderHeaderColumns(this.headerTableColGroup, this.dataTableColGroup);
}
/**
 * Renders header columns.
 * @param {object} headerTableColGroup - HTMLELement
 * @param {object} dataTableColGroup   - HTMLELement
 */
jasonGridUIHelper.prototype._renderHeaderColumns = function (headerTableColGroup, dataTableColGroup) {
    this._clearHeaderEvents();
    jw.common.removeChildren(this.gridHeaderTableRow);
    jw.common.removeChildren(this.headerTableColGroup);
    jw.common.removeChildren(this.dataTableColGroup);
    var self = this;
    //this.gridHeaderTableRow.innerHTML = "";
    //headerTableColGroup.innerHTML = "";
    //dataTableColGroup.innerHTML = "";

    for (var i = 0; i <= this.options.columns.length - 1; i++) {
        gridColumn = this.options.columns[i];
        columnIndex = i
        if (gridColumn.visible) {
            //creating the col elements for the header and data table.
            var headerTableColElement = headerTableColGroup.appendChild(this.createElement("col"));
            var dataTableColElement = dataTableColGroup.appendChild(this.createElement("col"));


            //header element and caption container.
            var headerElement = this.gridHeaderTableRow.appendChild(this.createElement("th"));
            var headerCellCaptionContainer = headerElement.appendChild(this.createElement("div"));
            headerCellCaptionContainer.classList.add(jw.DOM.classes.JW_GRID_HEADER_CELL_CAPTION_CONTAINER);

            var headerCellIconContainer = headerElement.appendChild(this.createElement("div"));
            headerCellIconContainer.classList.add(jw.DOM.classes.JW_GRID_HEADER_CELL_ICON_CONTAINER);

            this.eventManager.addEventListener(headerElement, jw.DOM.events.KEY_DOWN_EVENT, this._onGridColumnKeyDown, true);
            this.eventManager.addEventListener(headerElement, jw.DOM.events.FOCUS_EVENT, this._onGridColumnFocus, true, true);
            //var headerCellClearFloat = headerElement.appendChild(this.createElement("div"));
            //headerCellClearFloat.classList.add(JW_CLEAR_FLOAT_CLASS);

            var tooltip = gridColumn.Tooltip ? gridColumn.Tooltip : gridColumn.caption;

            /*if the column is a group column then set explicit width.We do not want the grouping placeholder column to be too big*/
            if (gridColumn.groupColumn) {
                headerTableColElement.style.width = "25px";
                dataTableColElement.style.width = "25px";
            }
            else {
                headerTableColElement.setAttribute(jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR, gridColumn.fieldName);
                dataTableColElement.setAttribute(jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR, gridColumn.fieldName);
            }
            /*if the column is associated with a field.*/
            if (gridColumn.fieldName) {
                headerElement.setAttribute(jw.DOM.attributes.JW_GRID_COLUMN_ID_ATTR, columnIndex);
                headerElement.setAttribute(jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR, gridColumn.fieldName);
                headerElement.setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR, tooltip);
                var captionElement = headerCellCaptionContainer.appendChild(jw.htmlFactory.createJWLinkLabel(gridColumn.caption));
                captionElement.setAttribute(jw.DOM.attributes.HREF_ATTR, "javascript:void(0)");
                if (gridColumn.headerTemplate)
                    captionElement.innerHTML = gridColumn.headerTemplate;
                
                this.eventManager.addEventListener(captionElement, jw.DOM.events.MOUSE_DOWN_EVENT, this._onGridColumnCaptionClick, true);
                this.eventManager.addEventListener(captionElement, jw.DOM.events.KEY_DOWN_EVENT, this._onGridColumnCaptionClick, true);
                this.eventManager.addEventListener(captionElement, jw.DOM.events.TOUCH_START_EVENT, function (touchEvent) {
                    //prevent default behavior and stop propagation.
                    touchEvent.preventDefault();
                    touchEvent.stopPropagation();
                    //simulating a mouse event by setting the button property to 0, which corresponds to the left mouse button.
                    touchEvent.button = 0;
                    self._onGridColumnCaptionClick(touchEvent);
                }, true);
            }
            /*Creating grid colum menu*/
            if (this.options.columnMenu == true && !gridColumn.groupColumn) {
                var gridColumnMenuIconAnchor = jw.htmlFactory.createJWButton(null, jw.DOM.icons.LIST);
                gridColumnMenuIconAnchor.setAttribute(jw.DOM.attributes.JW_GRID_COLUMN_ID_ATTR, columnIndex);
                this.eventManager.addEventListener(gridColumnMenuIconAnchor, jw.DOM.events.CLICK_EVENT, this._onGridColumnMenuIconClick,true);
                this.eventManager.addEventListener(gridColumnMenuIconAnchor, jw.DOM.events.TOUCH_START_EVENT, function (touchEvent) {
                    //prevent default behavior and stop propagation.
                    touchEvent.preventDefault();
                    touchEvent.stopPropagation();
                    //simulating a mouse event by setting the button property to 0, which corresponds to the left mouse button.
                    touchEvent.button = 0;
                    self._onGridColumnMenuIconClick(touchEvent);
                },true);
                this.eventManager.addEventListener(gridColumnMenuIconAnchor, jw.DOM.events.MOUSE_DOWN_EVENT, function (mouseEvent) { mouseEvent.stopPropagation(); }, true);
                headerCellIconContainer.appendChild(gridColumnMenuIconAnchor);
                //headerCellIconContainer.setAttribute(JW_GRID_COLUMN_ID_ATTR, columnIndex);
            }
            if (this.options.filtering == true && this.options.columnMenu == false) {
                var filterIconElement = this.createElement("i");
                filterIconElement.className = jw.DOM.icons.SEARCH;
                filterIconElement.style.cssFloat = "right";
                filterIconElement.style.cursor = "pointer";
                this.eventManager.addEventListener(filterIconElement, jw.DOM.events.CLICK_EVENT, this._onGridFilterButtonClick);
                headerCellIconContainer.appendChild(filterIconElement);
            }
        };
    }
}
/**
 * Updates UI when enable/disable state is changed.
 * @abstract
 */
jasonGridUIHelper.prototype.updateEnabled = function (enable) {
    jasonBaseWidgetUIHelper.prototype.updateEnabled.call(this, enable);
    var buttons = this.htmlElement.getElementsByTagName("a");
    for (var i = 0; i <= buttons.length - 1; i++) {
        if (enable) {
            buttons[i].removeAttribute(jw.DOM.attributes.DISABLED_ATTR)
            buttons[i].classList.remove(jw.DOM.classes.JW_DISABLED);
        }
        else {
            buttons[i].setAttribute(jw.DOM.attributes.DISABLED_ATTR, true);
            buttons[i].classList.add(jw.DOM.classes.JW_DISABLED);
        }
    }
    var inputs = this.htmlElement.getElementsByTagName("input");
    for (var i = 0; i <= inputs.length - 1; i++) {
        if (enable) {
            inputs[i].removeAttribute(jw.DOM.attributes.DISABLED_ATTR)
            inputs[i].classList.remove(jw.DOM.classes.JW_DISABLED);
        }
        else {
            inputs[i].setAttribute(jw.DOM.attributes.DISABLED_ATTR, true);
            inputs[i].classList.add(jw.DOM.classes.JW_DISABLED);
        }
    }
}
/**
 * Updates UI when visible state is changed.
 * @abstract
 */
jasonGridUIHelper.prototype.updateVisible = function (visible) {
    jasonBaseWidgetUIHelper.prototype.updateVisible.call(this, visible);
}
/**
 * Updates UI when readonly state is changed.
 * @abstract
 */
jasonGridUIHelper.prototype.updateReadOnly = function (readonly) {
    jasonBaseWidgetUIHelper.prototype.updateReadOnly.call(this, readonly);
    var buttons = this.htmlElement.getElementsByTagName("a");
    for (var i = 0; i <= buttons.length - 1; i++) {
        if (readonly) {
            buttons[i].removeAttribute(jw.DOM.attributes.READONLY_ATTR)
            buttons[i].classList.remove(jw.DOM.classes.JW_READONLY);
        }
        else {
            buttons[i].setAttribute(jw.DOM.attributes.READONLY_ATTR, true);
            buttons[i].classList.add(jw.DOM.classes.JW_READONLY);
        }
    }
    var inputs = this.htmlElement.getElementsByTagName("input");
    for (var i = 0; i <= inputs.length - 1; i++) {
        if (readonly) {
            inputs[i].removeAttribute(jw.DOM.attributes.READONLY_ATTR)
            inputs[i].classList.remove(jw.DOM.classes.JW_READONLY);
        }
        else {
            inputs[i].setAttribute(jw.DOM.attributes.READONLY_ATTR, true);
            inputs[i].classList.add(jw.DOM.classes.JW_READONLY);
        }
    }
}
//#endregion


//#region rendering - BODY - start*/

/**
 * Rendering rows to the grid body
 * @param {number} fromRecord 
 * @param {number} toRecord
 * @param {object} source - optional. If a source is specified then it will be used as the source of data. By default the grid's original source will be used.
 */
jasonGridUIHelper.prototype._renderRows = function (fromRecord, toRecord, source) {
    if (source === void 0) { source = null; }
    this.focusedCell = null;
    jw.common.removeChildren(this.gridDataTableBody);
    //this.gridDataTableBody.innerHTML = "";
    this.gridSelectedCells = new Array();
    this.gridSelectedRows = new Array();
    this._focusedCell = null;

    if (this.widget.dataSource.grouping.length > 0) {
        this._renderGroupedData(source);
    } else {
        var newRow = null;
        var newCell = null;
        var textNode = null;
        var sourceData = source ? source : this.widget.dataSource.data;
        var sourceRow = null;
        this.currentView = new Array();
        if (sourceData.length > 0) {
            for (var i = fromRecord; i <= toRecord; i++) {
                sourceRow = sourceData[i];
                sourceRow.RowIndex = i;
                this.currentView.push(sourceRow);
                newRow = this._createRowElementWithContentFromData(sourceRow);
                if (i % 2 == 0)
                    newRow.classList.add(jw.DOM.classes.JW_GRID_JW_TABLE_ALT_ROW_CLASS);
                this.gridDataTableBody.appendChild(newRow);
            }
        } else {
            this.gridDataTableBody.appendChild(this._renderNoDataRow());
        }
    }
}
/**
 * Renders an empty <TR> element when the grid has no data.
 */
jasonGridUIHelper.prototype._renderNoDataRow = function () {
    var newRow = this.createElement("tr");
    var newCell = this.createElement("td");
    newCell.setAttribute(jasonWidgets.DOM.attributes.COLSPAN_ATTR, this.options.columns.filter(function (col) { return col.visible == true;}).length);
    newCell.appendChild(this.createTextNode(this.options.localization.data.noData));
    newRow.appendChild(newCell);
    newRow.classList.add(jw.DOM.classes.JW_GRID_JW_TABLE_NO_DATA_ROW_CLASS);
    return newRow;
}
/**
 * Creates a TR element and associates it with a dataRow from the source data
 * @param {object} dataRow - Grid data row.
 */
jasonGridUIHelper.prototype._createRowElementFromData = function (dataRow) {
    var newRow = this.createElement("tr");
    newRow.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_ROW_ID_ATTR, dataRow.RowIndex);
    newRow.className = jw.DOM.classes.JW_GRID_JW_TABLE_ROW_CLASS;
    return newRow;
}
/**
 * Creates a TR element and associates it with a dataRow from the source data, and creates cells for the newly created containing data from the dataRow 
 * @param {object} dataRow - Grid data row.* 
 */
jasonGridUIHelper.prototype._createRowElementWithContentFromData = function (dataRow) {
    var newRow = this._createRowElementFromData(dataRow);
    if (this.options.customization.rowTemplate) {
        jw.common.applyTemplate(newRow, this.options.customization.rowTemplate, this.options.customization.dataFieldAttribute, dataRow);
        jw.common.removeNodeText(newRow);
        for (var i = 0; i <= newRow.children.length - 1; i++) {
            var tdChild = newRow.children[i];
            if (tdChild && tdChild.tagName == "TD") {
                tdChild.setAttribute(jw.DOM.attributes.JW_DATA_CELL_ID_ATTR, i);
                var newCellContainer = this.createElement("div");
                newCellContainer.classList.add(jw.DOM.classes.JW_GRID_JW_TABLE_CELL_CONTENT_CONTAINER_CLASS);
                newCellContainer.innerHTML = tdChild.innerHTML;
                tdChild.innerHTML = "";
                jw.common.removeNodeText(tdChild);
                tdChild.appendChild(newCellContainer);
            }
        }
    } else {
        for (var x = 0; x <= this.options.columns.length - 1; x++) {
            var column = this.options.columns[x];
            newCell = this._createCellElementFromColumn(column, dataRow);
            if (!column.visible) {
                newCell.style.display = "none";
            }
            newRow.appendChild(newCell);

        }
    }
    
    return newRow;
}
/**
 * Create a TD element from a dataRow 
 * @param {object} dataColumn - Grid column.
 * @param {object} dataRow - Grid data row. {@link jasonGridColumn} 
 */
jasonGridUIHelper.prototype._createCellElementFromColumn = function (dataColumn, dataRow) {
    var newCell = this.createElement("td");
    var newCellContentContainer = this.createElement("div");
    newCellContentContainer.classList.add(jw.DOM.classes.JW_GRID_JW_TABLE_CELL_CONTENT_CONTAINER_CLASS);
    newCell.appendChild(newCellContentContainer);
    if (dataColumn.groupColumn != true) {
        newCell.className = jw.DOM.classes.JW_GRID_JW_TABLE_CELL_CLASS;
        newCell.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_CELL_ID_ATTR, dataColumn.index);
        if (dataColumn.cellTemplate) {
            newCellContentContainer.innerHTML = dataColumn.cellTemplate;
            var dataAwareElements = newCell.querySelectorAll("*[" + this.options.customization.dataFieldAttribute + "]");
            for (var i = 0; i <= dataAwareElements.length - 1; i++) {
                var dataElement = dataAwareElements[i];
                jw.common.replaceNodeText(dataElement, dataRow[dataElement.getAttribute(this.options.customization.dataFieldAttribute)], true);
            }
        } else {
            textNode = this.createTextNode(dataRow[dataColumn.fieldName]);
            newCellContentContainer.appendChild(textNode);
        }
    }
    else {
        newCell.className = jw.DOM.classes.JW_GRID_GROUP_CELL;
        newCellContentContainer.innerHTML = "&nbsp";
    }
    return newCell;
}
/**
 * Create a TR grouping row element, with needed elements to provide expand/collapse functionality
 * @param {object} groupNode - HTMLElement
 */
jasonGridUIHelper.prototype._createGrouppingRow = function (groupNode) {
    var newRow = this.createElement("tr");
    var newCollapseExpandCell = this.createElement("td");

    var anchorNode = jw.htmlFactory.createJWButton(null, jw.DOM.icons.CIRCLE_ARROW_UP);
    var groupKeyCaption = this.createElement("span");
    groupKeyCaption.appendChild(this.createTextNode(groupNode.key));
    var self = this;
    this.eventManager.addEventListener(anchorNode, jw.DOM.events.CLICK_EVENT, this._onGroupCollapseExpandIconClick, true);
    this.eventManager.addEventListener(anchorNode, jw.DOM.events.KEY_DOWN_EVENT, function (keyDownEvent) {
        var key = keyDownEvent.keyCode || keyDownEvent.which;
        switch (key) {
            case jw.keycodes.enter: {
                self._onGroupCollapseExpandIconClick(keyDownEvent);
                break;
            }
            case jw.keycodes.downArrow:{
                if(!self._isGroupExpanded(null,null,keyDownEvent.target)){
                    self._collapseExpandGroup(null,null,keyDownEvent.target);
                }
                var groupRow = jw.common.getParentElement("TR",keyDownEvent.target);
                if (groupRow && groupRow.nextSibling) {
                    self.gridDataTable.focus();
                    self._manageCellFocused(groupRow.nextSibling.children[0]);
                }
                keyDownEvent.preventDefault();
                keyDownEvent.stopPropagation();
                break;
            }
            case jw.keycodes.upArrow: {
                var groupRow = jw.common.getParentElement("TR", keyDownEvent.target);
                if (groupRow.previousSibling == void 0) {
                    var cellIndex = self.widget.dataSource.grouping[self.widget.dataSource.grouping.length - 1].level + 1;
                    var headerElement = self.gridHeaderTableRow.children[cellIndex];
                    if (headerElement) {
                        var captionContainer = headerElement.getElementsByClassName("jw-header-cell-caption")[0];
                        if (captionContainer) {
                            var firstAnchor = captionContainer.getElementsByTagName("a")[0];
                            if (firstAnchor)
                                firstAnchor.focus();
                        }
                    }
                    keyDownEvent.preventDefault();
                    keyDownEvent.stopPropagation();
                } else {
                    if (groupRow.previousSibling.getElementsByClassName(jw.DOM.classes.JW_BUTTON)[0]) {
                        groupRow.previousSibling.getElementsByClassName(jw.DOM.classes.JW_BUTTON)[0].focus();
                        keyDownEvent.preventDefault();
                        keyDownEvent.stopPropagation();
                    }
                }
                break;
            }
        }
    }, true);

    newRow.classList.add(jw.DOM.classes.JW_GRID_JW_TABLE_ROW_CLASS);
    newRow.classList.add(jw.DOM.classes.JW_GRID_JW_TABLE_GROUP_ROW_CLASS);
    newRow.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_LEVEL_ATTR, groupNode.level);
    newRow.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_KEY_ATTR, groupNode.key);
    newCollapseExpandCell.setAttribute(jasonWidgets.DOM.attributes.COLSPAN_ATTR, this.options.columns.filter(function (col) { return col.visible == true; }).length);
    newCollapseExpandCell.appendChild(anchorNode);
    newCollapseExpandCell.style.paddingLeft = groupNode.level * 25 + "px";

    newCollapseExpandCell.appendChild(groupKeyCaption);

    newRow.appendChild(newCollapseExpandCell);
    return newRow;
}

//#endregion rendering - BODY - end*/


//#region rendering - FOOTER - start*/
/**
 * Renders grid footer. Which includes Pager and record information.
 */
jasonGridUIHelper.prototype._renderFooter = function (toRecord) {
    if (this.pagerContainer)
        return;
    var textNode = null;
    this.pagerContainer = this.createElement("div");
    this.pagerContainer.classList.add(jw.DOM.classes.JW_PAGER_CONTAINER_CLASS);
    this.pagerInfoContainer = this.createElement("div");
    this.pagerInfoContainer.classList.add(jw.DOM.classes.JW_PAGER_CONTAINER_PAGE_INFO_CLASS);
    this.pagerInfo = this.createElement("span");
    this.pagerInfoContainer.appendChild(this.pagerInfo);
    
    this.pagerButtonFirst = jw.htmlFactory.createJWButton(this.options.localization.grid.paging.firstPageButton);
    this.pagerButtonPrior = jw.htmlFactory.createJWButton(this.options.localization.grid.paging.priorPageButton);
    this.pagerButtonLast = jw.htmlFactory.createJWButton(this.options.localization.grid.paging.nextPageButton);
    this.pagerButtonNext = jw.htmlFactory.createJWButton(this.options.localization.grid.paging.lastPageButton);
    this.pagerInput = jw.htmlFactory.createJWTextInput(null,null,null,"number");

    //this.pagerInput.style.width = "50px";
    //this.pagerInput.style.textAlign = "center";
    //this.pagerInput.setAttribute("type", "number");
    this.pagerInput.setAttribute("value", "1");
    this.pagerInput.setAttribute("min", "1");

    this.pagerContainer.appendChild(this.pagerButtonFirst);
    this.pagerContainer.appendChild(this.pagerButtonPrior);
    this.pagerContainer.appendChild(this.pagerInput);
    this.pagerContainer.appendChild(this.pagerButtonNext);
    this.pagerContainer.appendChild(this.pagerButtonLast);
    this.gridFooterContainer.appendChild(this.pagerContainer);
    this.gridFooterContainer.appendChild(this.pagerInfoContainer);
    if (this.options.paging)
        this._updatePagerInfo(0, toRecord, this.widget.dataSource.data.length);
}
/**
 * Updates current page information. e.g [1-200 of 5000]
 * @param {number} recordStart
 * @param {number} recordStop
 * @param {number} recordCount
 */
jasonGridUIHelper.prototype._updatePagerInfo = function (recordStart, recordStop, recordCount) {
    if (this.pagerInfo.childNodes.length > 0)
        this.pagerInfo.removeChild(this.pagerInfo.childNodes[0]);
    var pagerInfoText = jw.common.formatString("{0} - {1} {2} {3}", [recordStart + 1, recordStop, this.options.localization.grid.paging.pagerInfoOfRecordCount, recordCount]);
    this.pagerInfo.appendChild(this.createTextNode(pagerInfoText));
    this.pagerInfo.setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR,pagerInfoText);
}
/**
 * Calculates page count.
 * @param {array} data - grid data.
 * @ignore
 */
jasonGridUIHelper.prototype._calculatePageCount = function (data) {
    if (this.options.paging)
        this._pageCount = data.length <= this.options.paging.pagesize ? 0 : Math.ceil(data.length / this.options.paging.pagesize);
    this._pageCount = this._pageCount <= 0 ? 1 : this._pageCount;
}
/**
 * Navigates to a page.
 * @param {number} pageNumber - Page number to navigate to.
 * @param {boolean} forceAction - If true navigates to the specified page, even if it is the current page.
 * @param {HTMLEvent} event - optional.
 */
jasonGridUIHelper.prototype._goToPage = function (pageNumber, forceAction, event) {
    if (jw.common.getVariableType(pageNumber) != jw.enums.dataType.number) {
        pageNumber = parseInt(pageNumber);
        if (isNaN(pageNumber))
            return;
    }

    if (pageNumber < 1 || pageNumber > this._pageCount)
        return;
        
    if ((pageNumber != this._currentPage) || (forceAction == true)) {
        if (pageNumber < 0)
            pageNumber = 0;
        if (pageNumber > this._pageCount)
            pageNumber = this._pageCount;
        var dataToRender = this.widget.dataSource.currentDataView;
        this._calculatePageCount(this.widget.dataSource.currentDataView);
        var pageSize = this.options.paging ? this.options.paging.pagesize : dataToRender.length;
        var recordStart = (pageNumber - 1) * pageSize;
        var recordStop = recordStart + pageSize - 1;
        if (recordStop > dataToRender.length)
            recordStop = dataToRender.length - 1;
        dataToRender = this.widget.dataSource.range(recordStart, recordStop);

        this._renderRows(0, dataToRender.length - 1, dataToRender);
        if (this.options.paging) {
            this._updatePagerInfo(recordStart, recordStop + 1, this.widget.dataSource.currentDataView.length);
            this._currentPage = pageNumber;
            this.pagerInput.value = this._currentPage;
            this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_PAGE_CHANGE, pageNumber);
        }
    }
}
/**
 * 
 */
jasonGridUIHelper.prototype._refreshCurrentPage = function () {
    this._goToPage(this._currentPage, true);
}
//#endregion rendering - FOOTER - end*/

//#region Grouping data - start*/
/**
 * Collapses a group row
 * @param {HTMLElement} groupRow - tr element
 */
jasonGridUIHelper.prototype._collapseGroup = function (groupRow) {
    var self = this;
    //getting the group level from which we want to start collapsing.
    var collapseGroupLevel = parseInt(groupRow.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_LEVEL_ATTR));
    //iterating through the next row in the table body until the last child of under this group level.
    for (var i = groupRow.sectionRowIndex + 1; i <= this.gridDataTableBody.childNodes.length - 1; i++) {
        var currentRow = this.gridDataTableBody.childNodes[i];
        //if the row is a group row.
        if (currentRow.className.indexOf(jw.DOM.classes.JW_GRID_JW_TABLE_GROUP_ROW_CLASS) >= 0) {
            var currentRowGroupLevel = parseInt(currentRow.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_LEVEL_ATTR));
            //if the group is a sub group of the group we want to collapse then we hide it as well.
            if (currentRowGroupLevel > collapseGroupLevel) {
                currentRow.style.display = "none";
            }
            else//if we reach a group row that has the same level as our collapse we stop the iteration.
                return;
        } else {
            //hiding any rows under the group we want to collapse.
            currentRow.style.display = "none";
        }
    }
}
/**
 * Expands a group row
 * @param {HTMLElement} groupRow - tr element
 */
jasonGridUIHelper.prototype._expandGroup = function (groupRow) {
    var self = this;
    //getting the group level for the row we want to expand.
    var expandGroupLevel = parseInt(groupRow.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_LEVEL_ATTR));
    //iterating through the next row in the table body until the last child of under this group level.
    for (var i = groupRow.sectionRowIndex + 1; i <= this.gridDataTableBody.childNodes.length - 1; i++) {
        var currentRow = this.gridDataTableBody.childNodes[i];
        //if the row is a group row.
        if (currentRow.className.indexOf(jw.DOM.classes.JW_GRID_JW_TABLE_GROUP_ROW_CLASS) >= 0) {
            //the current group row expand state. Meaning if it was expanded or collapsed. 
            //this is useful when we are expanding a parent group, we want to restore the sub-groups
            //to their prior state before the parent group collapsing and hiding everything.
            var currentRowGroupExpandState = currentRow.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUP_EXPANDED_ATTR);
            //current level of the group row.
            var currentRowGroupLevel = parseInt(currentRow.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_LEVEL_ATTR));
            if (currentRowGroupLevel > expandGroupLevel) {
                //restore visibility for the sub-group row.
                currentRow.style.display = "";
                //if the sub-group was expanded when the parent group collapsed then expand this sub-group as well.
                if (currentRowGroupExpandState == "true")
                    this._expandGroup(currentRow);
            }
            else//if we reach a group row that has the same level as our collapse we stop the iteration.
                return;
        } else {
            //the current row group level that data row belongs to.
            var currentRowGroupLevel = currentRow.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_LEVEL_ATTR);

            if (currentRowGroupLevel == expandGroupLevel)
                currentRow.style.display = "";
        }
    }
}
/**
 * Creates a grouping tree based on the grouping configuration the user made through the UI
 */
jasonGridUIHelper.prototype._initiliazeRenderingGroupedData = function () {
    //this._renderHeader();
    var recordStart = this.options.paging ? this._currentPage: 0;
    var recordStop = this.options.paging ? this.options.paging.pagesize : this.widget.dataSource.data.length;
    this._renderGroupedData(this.widget.dataSource.range(recordStart, recordStop));
}
/**
 * Renders group row.
 */
jasonGridUIHelper.prototype._renderGroupRow = function (groupNode) {
    var grouppingRow = this._createGrouppingRow(groupNode);
    grouppingRow.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUP_EXPANDED_ATTR, "true");
    this.gridDataTableBody.appendChild(grouppingRow);
}
/**
 * Renders grouped data
 */
jasonGridUIHelper.prototype._renderGroupData = function (groupNode) {
    /*adding the groupping row*/
    this._renderGroupRow(groupNode);

    //if we are at the last grouping node render the actual data.
    for (var i = 0; i <= groupNode.values.length - 1 ; i++) {
        if (groupNode.values[i].values)
            this._renderGroupData(groupNode.values[i]);
        else {
            var newRow = this._createRowElementWithContentFromData(groupNode.values[i]);
            newRow.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_LEVEL_ATTR, groupNode.level);
            this.gridDataTableBody.appendChild(newRow);
        }
    }
}
/**
 * Renders grouped data requires special handling
 */
jasonGridUIHelper.prototype._renderGroupedData = function (groupedData) {
    jw.common.removeChildren(this.gridDataTableBody);
    this.gridSelectedCells = new Array();
    this.gridSelectedRows = new Array();
    this._focusedCell = null;
    //this.gridDataTableBody.innerHTML = "";
    var rowCounter = { count: 0 };
    for (var x = 0; x <= groupedData.length - 1; x++) {
        this._renderGroupData(groupedData[x]);
    }
}

/**
 * adds grouping UI in the group container, for a field.
 */
jasonGridUIHelper.prototype._groupByField = function (column) {
    if (column) {
        /*creating grouping elements*/
        var groupingFieldContainer = this.createElement("div");
        var groupingFieldContainerRemove = jw.htmlFactory.createJWButton(null,jw.DOM.icons.CLOSE);//this.createElement("a");
        var groupingFieldText = jw.htmlFactory.createJWLinkLabel(column.caption);//this.createElement("span");
        /*setting text of the grouping container*/
        //groupingFieldText.appendChild(this.createTextNode(column.caption));
        groupingFieldContainer.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_FIELD_ATTR, column.fieldName);
        groupingFieldContainerRemove.classList.add(jw.DOM.classes.JW_GRID_REMOVE_GROUP_BUTTON);

        /*setting text and tooltip to the remove grouping field anchor*/
        //var iconNode = this.createElement("i");
        //iconNode.className = jw.DOM.icons.CLOSE;
        //groupingFieldContainerRemove.appendChild(iconNode);
        groupingFieldContainerRemove.setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR, this.options.localization.grid.grouping.removeGrouping + column.caption);

        /*constructing the DOM*/
        groupingFieldContainer.appendChild(groupingFieldText);
        groupingFieldContainer.appendChild(groupingFieldContainerRemove);
        this.gridGroupingContainer.appendChild(groupingFieldContainer);
        this.gridGroupingContainer.setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR, column.caption);

        /*setting on click event for the remove anchor*/
        this.eventManager.addEventListener(groupingFieldContainerRemove, jw.DOM.events.CLICK_EVENT, this._onGroupColumnRemoveClick, true);
       
        this.gridGroupingContainer.childNodes[0].style.display = "none";
        var newGrouping = this.widget.dataSource.grouping[this.widget.dataSource.grouping.length - 1];
        this.options.columns.splice(newGrouping.level, 0, { width: "25px", groupColumn: true, visible: true, groupField: column.fieldName });
        var headerCol = this.createElement("col");
        var dataCol = this.createElement("col");
        var headerTH = this.createElement("th");
        headerCol.style.width = "25px";
        dataCol.style.width = "25px";
        headerTH.setAttribute(jasonWidgets.DOM.attributes.JW_GRID_GROUP_FIELD, column.fieldName);
        headerCol.setAttribute(jasonWidgets.DOM.attributes.JW_GRID_GROUP_FIELD, column.fieldName);
        dataCol.setAttribute(jasonWidgets.DOM.attributes.JW_GRID_GROUP_FIELD, column.fieldName);
        this.headerTableColGroup.insertBefore(headerCol, this.headerTableColGroup.firstChild);
        this.dataTableColGroup.insertBefore(dataCol, this.dataTableColGroup.firstChild);
        this.gridHeaderTableRow.insertBefore(headerTH, this.gridHeaderTableRow.firstChild);

        this._initiliazeRenderingGroupedData();
        this._enableColumnDragResize();
        this._sizeColumns();
    }
}
/**
 * Get field grouping container element by field name.
 */
jasonGridUIHelper.prototype._getGroupingContainerByFieldName = function (fieldName) {
    return jw.common.getElementsByAttribute(this.gridGroupingContainer, jasonWidgets.DOM.attributes.JW_DATA_GROUPING_FIELD_ATTR, fieldName)[0];
}

/**
 * removes grouping UI in the group container, for a field.
 * @param {string} fieldName - field name to remove grouping for.
 */
jasonGridUIHelper.prototype._removeGroupByField = function (fieldName) {
    var groupingContainerToRemove = this._getGroupingContainerByFieldName(fieldName);
    if (groupingContainerToRemove)
        this.gridGroupingContainer.removeChild(groupingContainerToRemove);
    var headerTHToRemove = this.gridHeaderTableRow.querySelectorAll("th[" + jw.DOM.attributes.JW_GRID_GROUP_FIELD + "='" + fieldName + "']")[0];
    if (headerTHToRemove) {
        this.gridHeaderTableRow.removeChild(headerTHToRemove);
        var colHeaderToRemove = this.headerTableColGroup.querySelectorAll("col[" + jw.DOM.attributes.JW_GRID_GROUP_FIELD + "='" + fieldName + "']")[0];
        if (colHeaderToRemove)
            this.headerTableColGroup.removeChild(colHeaderToRemove);
        colHeaderToRemove = this.dataTableColGroup.querySelectorAll("col[" + jw.DOM.attributes.JW_GRID_GROUP_FIELD + "='" + fieldName + "']")[0];
        if (colHeaderToRemove)
            this.dataTableColGroup.removeChild(colHeaderToRemove);
    }
    if (this.widget.dataSource.grouping.length == 0) {
        this._goToPage(this._currentPage, true);
        this.gridGroupingContainer.childNodes[0].style.display = "";
        //this._renderHeader();
    } else {
        this._initiliazeRenderingGroupedData();
    }
    this._enableColumnDragResize();
    this._sizeColumns();
}
//#endregion grouping data - end*/

//#region JW_GRID JW_MENU


jasonGridUIHelper.prototype.updateColumnSortIcon = function (sortDirection, column) {
}
jasonGridUIHelper.prototype._sortByField = function (sortDirection, fieldName) {
    var primerFunction = null;
    if (column.dataType) {
        var lowerCaseString = column.dataType.toLower();
        switch (lowerCaseString) {
            case "string": { primerFunction = null; break; }
            case "int": { primerFunction = parseInt; break; }
            case "float": { primerFunction = parseFloat; break; }
            case "datetime": { primerFunction = Date.parse; break; }
        }
    }
    var currentSorting = new jasonDataSourceSorting(column.fieldName, sortDirection != "asc", primerFunction);
    if (!this.options.sorting.multiple) {
        this.widget.dataSource.clearSorting();
    }
    this.widget.dataSource.addSorting(currentSorting);
    this.gridPager.goToPage(this.gridPager._currentPage, true);
}

//#endregion


// #region JASON JW_GRID STRING LOCALIZATION - start*/
/**
 * Initializes localization
 * @param {object} localizationObject - Object that has localized values for various grid UI elements. Filter, grouping, column menu, etc.
 */
jasonGridUIHelper.prototype.localizeStrings = function (localizationObject) {
    if (!localizationObject)
        localizationObject = this.options.localization;
    if (this.options.grouping == true && this.gridGroupingContainer)
        this.gridGroupingContainer.childNodes[0].innerText = localizationObject.grid.grouping.groupingMessage;
    if (this.options.filtering == true) {
        for (var i = 0; i <= this.gridHeaderTableRow.childNodes.length - 1; i++) {
            var thElement = this.gridHeaderTableRow.childNodes[i];
            for (var x = 0; x <= thElement.childNodes.length - 1; x++) {
                if (thElement.childNodes[x].tagName == "I") {
                    thElement.childNodes[x].setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR, localizationObject.grid.filtering.iconTooltip);
                }
            }
        }
        if (this.filterContainer) {
            //this.filterBtnApply.replaceChild(this.createTextNode(localizationObject.grid.filtering.applyButtonText), this.filterBtnApply.childNodes[1]);
            //this.filterBtnApply.setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR, localizationObject.grid.filtering.applyButtonTooltip);

            //this.filterBtnClear.replaceChild(this.createTextNode(localizationObject.grid.filtering.clearButtonText), this.filterBtnClear.childNodes[1]);
            //this.filterBtnClear.setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR, localizationObject.grid.filtering.clearButtonToollip);
        }
    }
    if (this.options.paging) {
        this.pagerButtonFirst.innerText = localizationObject.grid.paging.firstPageButton;
        this.pagerButtonPrior.innerText = localizationObject.grid.paging.priorPageButton;
        this.pagerButtonLast.innerText = localizationObject.grid.paging.lastPageButton;
        this.pagerButtonNext.innerText = localizationObject.grid.paging.nextPageButton;
        this.pagerInput.setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR, localizationObject.grid.paging.pagerInputTooltip);
    }

    if (this.options.columnMenu) {
        this.widget.defaultGridColumnMenu.items[0].caption = localizationObject.grid.columnMenu.sortAscending;
        this.widget.defaultGridColumnMenu.items[1].caption = localizationObject.grid.columnMenu.sortDescending;
        this.widget.defaultGridColumnMenu.items[2].caption = localizationObject.grid.columnMenu.columns;
        this.widget.defaultGridColumnMenu.items[3].caption = localizationObject.grid.columnMenu.filter;
        this.widget.defaultGridColumnMenu.items.forEach(function (item) {
            item.title = item.caption;
        });
    }
}
// #endregion JASON JW_GRID STRING LOCALIZATION - end*/

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonGrid.prototype = Object.create(jasonBaseWidget.prototype);
jasonGrid.prototype.constructor = jasonGrid;
/**
 * @namespace Grids
 * @description
 * 
 * Collection of data grids.
 * 
 * Keyboard navigation:
 * 
 * @property Column {GridColumn} - Grid column keyboard support.
 * @property Column.Enter/Space {Keyboard} - If the grid has sorting enabled it will toggle sorting asc/desc for the column.
 * @property Column.DownArrow {Keyboard} - It will move focus to the first cell of the grid.
 * @property GridCell {GridCell} - Grid cell keyboard support.
 * @property GridCell.DownArrow {Keyboard} - Moves to the cell below the focused cell.
 * @property GridCell.UpArrow {Keyboard} - Moves to the cell above the focused cell. If the cell is in the first row, it will move focus to the column header above. If the cell is in the first row of a grouping, it will move focus to the group collapse/expand row button.
 * @property GridCell.RightArrow {Keyboard} - Moves to the cell to the right of the focused cell.
 * @property GridCell.LeftArrow {Keyboard} - Moves to the cell to the left of the focused cell.
 * @property GridCell.Tab {Keyboard} - Moves focus to the pager controls, if the grid has paging enabled.
 * @property GridCell.Ctrl+Space {Keyboard} - Toggles cell selection.
 * @property GridCell.Ctrl+Enter {Keyboard} - Toggles row selection.
 * @property ColumnMenu {GridColumnMenu} - Grid column menu keyboard support.
 * @property ColumnMenu.Enter {Keyboard} - It displays the grid column menu.
 * @property GroupRowButton {GroupRowButton} - Group row collapse/expand button keyboard support.
 * @property GroupRowButton.DownArrow {Keyboard} - If the group is collapsed it expands it and sets the focus to the first cell of the first row of the group.
 * @property GroupRowButton.Tab {Keyboard} - Sets focus to the next group row button.
 * @property GroupRowButton.Enter {Keyboard} - Toggles collapse state of the group.
 * 
 */

/**
 * @class
 * @name jasonGridOptions
 * @augments Common.jasonWidgetOptions
 * @description Configuration for the grid widget.
 * @memberOf Grids
 * @property {boolean}  [multiSelect=false]                     - Set to true to enable multi-select.
 * @property {any[]}    [data=[]]                            - Data for the grid to display.
 * @property {jasonGridColumn[]} [columns=[]]                - Grid columns.
 * @property {object}   paging                          - Paging configuration.  
 * @property {number}   [paging.PageSize=200]                 - Pagesize.
 * @property {boolean}  [grouping=true]                        - Set to true to enable grouping.
 * @property {boolean}  [filtering=true]                       - Set to true to enable filtering.
 * @property {object|boolean}   [sorting=true]                         - Set to true to enable sorting.
 * @property {object}   [sorting.multiple=false]                - Multiple - Set to true to enable multiple sorting 
 * @property {boolean}  [columnMenu=true]                      - Set to true to enable column menu.
 * @property {boolean}  [resizing=true]                        - Set to true to enable column resizing.
 * @property {boolean}  [reordering=true]                      - Set to true to enable column reordering.
 * @property {object}   [customization={}]                   - Grid customization.
 * @property {any}      [customization.rowTemplate=undefined]       - HTML string or script tag containing HTML to be used to render grid rows.
 * @property {string}   [customization.dataFieldAttribute=undefined]- String that defines the attribute in a template HTML for a data field. Default is 'data-field'.
 */

/**
 * @class
 * @name jasonGridColumn
 * @description A grid column.
 * @memberOf Grids
 * @property {string} caption       - Column caption.
 * @property {string} fieldName     - FieldName of the underlying datasource.
 * @property {number} index         - Column index on the column list.
 * @property {string} tooltip       - Column tooltip.
 * @property {number} width         - If not specified, a width value will be calculated for the column. Use it only when you want a specific width for a column.
 * @property {boolean} visible      - If false, column is not rendered.
 * @property {Common.enums.dataType}  dataType     - Can be one of four data types. String, Date, Number and Boolean.
 * @property {boolean} isInMenu     - If false, column is not displayed on the list of columns to be hidden/shown.
 * @property {boolean} columnMenu   - If false, column does not show a column menu icon.
 * @property {any} headerTemplate   - HTML string or script tag containing HTML to be used to render a column header.
 * @property {any} cellTemplate     - HTML string or script tag containing HTML to be used to render a column cell.
 */

/**
 * @class
 * @name jasonGridFilterValue
 * @description A grid filter value.
 * @memberOf Grids
 * @property {any} value - Filter value.
 * @property {object} filterClause - Filter clause.
 * @property {string} filterClause.symbol - Filter clause symbol ['=','>','<','>=','<=','!=','startsWith','endsWith','contains']
 * @property {object} logicalOperator - Filter logical operator.
 * @property {string} logicalOperator.operator - operator ['and','or']
 */

/**
 * Occurs when the underlying datasource data changes.
 * @event Grids.jasonGrid#onDataChange
 * @type {object}
 * @property {Grids.jasonGrid} sender - The grid instance.
 */

/**
 * @event Grids.jasonGrid#onGroupByField
 * @type {object}
 * @description Occurs when grouping is applied to a field.
 * @property {Grids.jasonGrid} sender - The grid instance.
 * @property {string} fieldName - The field that the grouping was applied to.
 */

/**
 * @event Grids.jasonGrid#onUnGroupField
 * @type {object}
 * @description Occurs when grouping is removed from a field.
 * @property {Grids.jasonGrid} sender - The grid instance.
 * @property {string} fieldName - The field of which the grouping was removed.
 */

/**
 * @event Grids.jasonGrid#onSelectionChange
 * @type {object}
 * @description Occurs when the selected rows are changed.
 * @property {Grids.jasonGrid} sender - The grid instance.
 * @property {object[]} selectedRows - The currently selected rows.
 */

/**
 * @event Grids.jasonGrid#onGroupCollapse
 * @type {object}
 * @description Occurs when grouping collapses.
 * @property {Grids.jasonGrid} sender - The grid instance.
 * @property {string} groupKey - The grouping key of the group being collapsed.
 */

/**
 * @event Grids.jasonGrid#onGroupExpand
 * @type {object}
 * @description Occurs when grouping expands.
 * @property {Grids.jasonGrid} sender - The grid instance.
 * @property {string} groupKey - The grouping key of the group being exapanded.
 */

/**
 * @event Grids.jasonGrid#onPageChange
 * @type {object}
 * @description Occurs when the page changes.
 * @property {Grids.jasonGrid} sender - The grid instance.
 * @property {number} pageNumber - The page number.
 */

/**
 * @event Grids.jasonGrid#onColumnPositionChange
 * @description Occurs when the column position changes.
 * @type {object}
 * @property {Grids.jasonGrid} sender - The grid instance.
 * @property {object} positionInfo - The position information.
 * @property {Grids.jasonGridColumn} positionInfo.column - The grid column.
 * @property {number} positionInfo.fromIndex - The grid column previous index.
 * @property {number} positionInfo.toIndex - The grid column new index.
 */

/**
 * @event Grids.jasonGrid#onColumnResize
 * @description Occurs when the column resizes.
 * @type {object}
 * @property {Grids.jasonGrid} sender - The grid instance.
 * @property {object} resizeInfo - The position information.
 * @property {Grids.jasonGridColumn} resizeInfo.column - The grid column.
 * @property {number} resizeInfo.newWidth - The grid column new width.
 */



/**
 * @constructor
 * @memberOf Grids
 * @augments Common.jasonBaseWidget
 * @description A multi-purpose data grid that supports grouping, multiple sorting, filtering and more.
 * @param {HTMLElement} htmlElement - DOM element that will contain the grid.
 * @param {Grids.jasonGridOptions} options - jasonGrid options. 
 * @property {Data.jasonDataSource} dataSource - Grid's underlying datasource.
 * @property {array} selectedRows - Currently selected rows.
 * @fires Grids.jasonGrid#event:onDataChange
 * @fires Grids.jasonGrid#event:onGroupByField
 * @fires Grids.jasonGrid#event:onUnGroupField
 * @fires Grids.jasonGrid#event:onSelectionChange
 * @fires Grids.jasonGrid#event:onGroupCollapse
 * @fires Grids.jasonGrid#event:onGroupExpand
 * @fires Grids.jasonGrid#event:onPageChange
 * @fires Grids.jasonGrid#event:onColumnPositionChange
 * @fires Grids.jasonGrid#event:onColumnResize
 */
function jasonGrid(htmlElement, options) {
    if (htmlElement.tagName != "DIV")
        throw new Error("Grid container element must be a div");
    this.defaultOptions = {
        multiSelect: false,
        cellMultiSelect: false,
        data: null,
        columns: null,
        selectedRows: null,
        paging: {
            pagesize: 200,
        },
        grouping: true,
        filtering: true,
        columnMenu: true,
        resizing: true,
        sorting: true,
        reordering: true,
        customization: {
            rowTemplate: null,
            dataFieldAttribute: "data-field"
        }
    };
    //creating the datasource first before constructing the UI helper, so we can create columns if no columns are defined, to be available to the helper.
    this.dataSource = new jasonDataSource({ data: typeof options.data == 'function' ? options.data() : options.data, onChange: this._onDataChanged.bind(this) });
    this._initializeColumns(options);
    jasonBaseWidget.call(this, "jasonGrid", htmlElement, options, jasonGridUIHelper);
    this.initialize();
    //this.ui.renderUI();
    this.ui._createColumnMenu();
    this.ui._initializeEvents();
    this.ui.localizeStrings(this.options.localization);
    this.ui.monitorChanges();
}

//#region  private members*/

/**
 * Initializes the grid columns
 * @ignore
 */
jasonGrid.prototype._initializeColumns = function (options) {
    options = options == void 0 ? this.options : options;
    if (!options.columns || options.columns.length == 0) {
        options.columns = [];
        var firstItem = this.dataSource.data ? this.dataSource.data[0] : null;
        if (firstItem) {
            var i = 0;
            for (var prop in firstItem) {
                if (prop != "_jwRowId")
                    options.columns.push({
                        caption: prop,
                        fieldName: prop,
                        index: i++,
                        tooltip: prop,
                        width: null,
                        visible: true,
                        dataType: jw.enums.dataType.unknown
                    });
            }
        }
    }
    else {
        for (var i = 0; i <= options.columns.length - 1; i++) {
            var col = options.columns[i];
            if (col.visible == null || col.visible == undefined)
                col.visible = true;
            col.index = i;
        }
    }
}
/**
    * Initializes the grid default column menu.
    * @ignore
    */
jasonGrid.prototype._initializeDefaultColumnMenu = function () {
    this.defaultGridColumnMenu = { items: [] };
    if (this.options.sorting) {
        var menuItemSortAsc = new jasonMenuItem(this.ui.createElement("li"),null,null);
        menuItemSortAsc.name = "mnuSortAsc";
        menuItemSortAsc.caption = this.options.localization.grid.columnMenu.sortAscending;
        menuItemSortAsc.title = menuItemSortAsc.caption;
        menuItemSortAsc.clickable = true;
        menuItemSortAsc.enabled = jasonWidgets.common.assigned(this.options.sorting);
        menuItemSortAsc.icon = jw.DOM.icons.SORT_ASC;
        menuItemSortAsc.level = 0;
        this.defaultGridColumnMenu.items.push(menuItemSortAsc);

        var menuItemSortDesc = new jasonMenuItem(this.ui.createElement("li"), null, null);
        menuItemSortDesc.name = "mnuSortDesc";
        menuItemSortDesc.caption = this.options.localization.grid.columnMenu.sortDescending;
        menuItemSortDesc.title = menuItemSortDesc.caption;
        menuItemSortDesc.enabled = jasonWidgets.common.assigned(this.options.sorting);
        menuItemSortDesc.clickable = true;
        menuItemSortDesc.icon = jw.DOM.icons.SORT_DESC;
        menuItemSortDesc.level = 0;
        this.defaultGridColumnMenu.items.push(menuItemSortDesc);
    }

    var menuItemColumns = new jasonMenuItem(this.ui.createElement("li"), null, null);
    menuItemColumns.name = "mnuColumns";
    menuItemColumns.caption = this.options.localization.grid.columnMenu.columns;
    menuItemColumns.title = menuItemColumns.caption;
    menuItemColumns.icon = jw.DOM.icons.LIST;
    menuItemColumns.level = 0;
    this.defaultGridColumnMenu.items.push(menuItemColumns);

    if (this.options.filtering) {
        var menuItemFilter = new jasonMenuItem(this.ui.createElement("li"), null, null);
        menuItemFilter.name = "mnuFilter";
        menuItemFilter.caption = this.options.localization.grid.columnMenu.filter;
        menuItemFilter.title = menuItemFilter.caption;
        menuItemFilter.icon = jw.DOM.icons.SEARCH;
        menuItemFilter.level = 0;
        menuItemFilter.addEventListener(jw.DOM.events.JW_EVENT_ON_JW_MENU_ITEM_CONTENT_SHOW, this._onFilterShown, this);
        //menuItemFilter.onItemContentShown = this._onFilterShown;
        this.defaultGridColumnMenu.items.push(menuItemFilter);
    }

    var isDividerAdded = false;

    if (this.options.sorting) {
        this.defaultGridColumnMenu.items.push(createJasonMenuDividerItem());
        isDividerAdded = true;

        var menuItemClearSorting = new jasonMenuItem(this.ui.createElement("li"), null, null);
        menuItemClearSorting.name = "mnuClearSorting";
        menuItemClearSorting.caption = this.options.localization.grid.columnMenu.clearSorting;
        menuItemClearSorting.title = menuItemClearSorting.caption;
        menuItemClearSorting.enabled = jasonWidgets.common.assigned(this.options.sorting);
        menuItemClearSorting.clickable = true;
        menuItemClearSorting.icon = jw.DOM.icons.REMOVE_SORT;
        menuItemClearSorting.level = 0;
        this.defaultGridColumnMenu.items.push(menuItemClearSorting);
    }

    if (this.options.filtering) {
        var menuItemClearFiltering = new jasonMenuItem(this.ui.createElement("li"), null, null);
        menuItemClearFiltering.name = "mnuClearFiltering";
        menuItemClearFiltering.caption = this.options.localization.grid.columnMenu.clearFilters;
        menuItemClearFiltering.title = menuItemClearFiltering.caption;
        menuItemClearFiltering.enabled = jasonWidgets.common.assigned(this.options.sorting);
        menuItemClearFiltering.clickable = true;
        menuItemClearFiltering.icon = jw.DOM.icons.REMOVE_FILTER;
        menuItemClearFiltering.level = 0;
        this.defaultGridColumnMenu.items.push(menuItemClearFiltering);
        if (!isDividerAdded)
            this.defaultGridColumnMenu.items.push(createJasonMenuDividerItem());
    }


    this._addColumnsToMenu();
    if (this.options.filtering)
        this._addFilterToMenu();
}
/**
    * Adds the list of grid columns in the columns menu list.
    * @ignore
    */
jasonGrid.prototype._addColumnsToMenu = function () {
    var columnsMenuItem = this.defaultGridColumnMenu.items.filter(function (item) {
        return item.name == "mnuColumns";
    })[0];
    for (var i = 0 ; i <= this.options.columns.length - 1; i++) {
        var column = this.options.columns[i];
        var menuItem = new jasonMenuItem();
        menuItem.name = column.fieldName;
        menuItem.caption = column.caption;
        menuItem.title = column.title ? column.title : column.caption;
        menuItem.hasCheckBox = true;
        menuItem.checked = true;
        menuItem.clickable = true;
        menuItem.level = columnsMenuItem.level + 1;
        menuItem.parent = columnsMenuItem;
        columnsMenuItem.items.push(menuItem);
    }
}
/**
    * Adds filter to the column menu.
    * @ignore
    */
jasonGrid.prototype._addFilterToMenu = function () {
    var filterMenuItem = this.defaultGridColumnMenu.items.filter(function (item) {
        return item.name == "mnuFilter";
    })[0];
    this.ui._renderFilterUI();
    this.ui.filterContainer.style.display = "";
    var filterMenuItemContent = new jasonMenuItem();
    filterMenuItemContent.name = "";
    filterMenuItemContent.caption = "";
    filterMenuItemContent.content = this.ui.filterContainer;
    filterMenuItemContent.parent = filterMenuItem;
    filterMenuItem.items.push(filterMenuItemContent);
}
/**
 * @ignore
 */
jasonGrid.prototype._onDataChanged = function () {
    this._initializeColumns();
    this.ui.renderUI();
    this.triggerEvent(jw.DOM.events.JW_EVENT_ON_DATA_CHANGE);
}
/**
 * @ignore
 */
jasonGrid.prototype._onFilterShown = function () {
    var self = this;
    var appliedFilter = this.dataSource.filters.filter(function (gridFilter) { return gridFilter.filterField == self.ui._currentFilterField; })[0];
    if (appliedFilter)
        this.ui._loadFilterValues(appliedFilter);
}
/**
 * Returns the column object for a  field.
 * @ignore
 */
jasonGrid.prototype._columnByField = function (fieldName) {
    return this.options.columns.filter(function (column) { return column.fieldName == fieldName; })[0];
}
//#endregion

//#region public members

/**
 * Initializing customization templates.
 * @ignore
 */
jasonGrid.prototype.initialize = function () {
    jasonBaseWidget.prototype.initialize.call(this);
    //this._initializeColumns();
    this.selectedRows = new Array();
    this.currentView = new Array();
    this.groupping = new Array();
    this.filters = new Array();
    this.sorting = new Array();

    if (typeof this.options.sorting != "object") {
        var sortValue = this.options.sorting;
        if (typeof this.options.sorting == "string")
            sortValue = jasonWidgets.common.strToBool(sortValue);
        this.options.sorting = sortValue ? { multiple: false } : null;
    }
    if (typeof this.options.paging != "object") {
        var pagingValue = this.options.paging;
        if (typeof this.options.paging == "string")
            pagingValue = jasonWidgets.common.strToBool(pagingValue);
        this.options.paging = pagingValue ? { Pagesize: 200 } : null;
    }
    this._initializeDefaultColumnMenu();

    if (this.options.data && this.options.data.length > 0) {
        var model = this.options.data[0];
        if (typeof model === "object") {
            for (var prop in model) {
                var column = this._columnByField(prop.toString());
                if (column && (column.dataType == void 0 || column.dataType == jw.enums.dataType.unknown)) {
                    if (column) {
                        column.dataType = jw.common.getVariableType(model[prop]);
                    }
                }
            }
        }
    }
}
/**
 * Groups data by a field.
 * @param {string} fieldName - Field name to group by.
 */
jasonGrid.prototype.groupByField = function (fieldName) {
    if (fieldName && !this.dataSource.groupingExists(fieldName)) {
        this.dataSource.groupByField(fieldName);
        this.ui._groupByField(this._columnByField(fieldName));
        this.triggerEvent(jw.DOM.events.JW_EVENT_ON_GROUP_BY_FIELD, fieldName);
    }
}
/**
 * Removes grouping by a field.
 * @param {string} fieldName - Field name of which the grouping will be removed.
 */
jasonGrid.prototype.removeGrouping = function (fieldName) {
    if (fieldName) {
        var indexToRemove = -1;
        var groupingToRemove = this.dataSource.grouping.filter(function (grouppingField, grouppingFieldIndex) {
            if (grouppingField.field == fieldName) {
                indexToRemove = grouppingFieldIndex;
                return true;
            }
        })[0];
        if (indexToRemove >= 0) {
            var groupingToRemove = this.dataSource.grouping[indexToRemove];
            this.dataSource.removeGrouping(groupingToRemove);
            var columnIndexToRemove = -1;
            for (var i = 0; i <= this.options.columns.length - 1; i++) {
                if (this.options.columns[i].groupField == groupingToRemove.field) {
                    columnIndexToRemove = i;
                }
            }
            if (columnIndexToRemove >= 0)
                this.options.columns.splice(columnIndexToRemove, 1);

            this.ui._removeGroupByField(fieldName);
            this.triggerEvent(jw.DOM.events.JW_EVENT_ON_UNGROUP_FIELD, fieldName);
        }

    }
}
/**
 * Sorts data by a field.
 * @param {string} fieldName - Field name to sort by.
 * @param {string} direction - Sort direction is 'asc' or 'desc'. Default is 'asc'.
 */
jasonGrid.prototype.sortBy = function (fieldName,direction) {
    if (fieldName) {
        direction = direction == void 0 ? 'asc' : direction;
        var column = this._columnByField(fieldName);
        var primerFunction = null;
        if (column.dataType) {
            switch (column.dataType) {
                case jw.enums.dataType.string: { primerFunction = null; break; }
                case jw.enums.dataType.number: { primerFunction = parseFloat; break; }
                case jw.enums.dataType.date: { primerFunction = Date.parse; break; }
            }
        }
        var newSorting = new jasonDataSourceSorting(column.fieldName, direction != "asc", primerFunction);
        if (!this.options.sorting.multiple) {
            this.dataSource.clearSorting();
        }
        this.dataSource.addSorting(newSorting);
        this.ui._refreshCurrentPage();
    }
}
/**
 * Removes sorting by a field.
 * @param {string} fieldName - Field name of which the sorting will be removed.
 */
jasonGrid.prototype.removeSorting = function (fieldName) {
    if (fieldName) {
        this.dataSource.removeSorting(fieldName);
        this.ui._refreshCurrentPage();
    }
}
/**
 * Filters by a field.
 * @param {string} fieldName - Field name to filter on.
 * @param {jasonGridFilterValue[]} filterValues - Filter values.
 */
jasonGrid.prototype.filterBy = function (fieldName, filterValues) {
    if (fieldName && filterValues) {
        this.dataSource.addFilter(fieldName, filterValues);
        this.dataSource.applyFilters();
        this.ui._goToPage(1, true);
        this.ui._sizeColumns();
        this.ui.columnMenu.ui.hideMenu();
        if (this.ui._currentTHElement == null)
            this.ui._currentTHElement = jw.common.getElementsByAttribute(this.ui.gridHeaderTable, jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR, fieldName, "th")[0];
        this.ui._currentTHElement.classList.add(jw.DOM.classes.JW_GRID_FIELD_HAS_FILTER);
    }
}
/**
 * Clears filters by a field. If no field is defined, it clears all filters.
 * @param {string} fieldName - Field name to filter on.
 */
jasonGrid.prototype.clearFilter = function (fieldName) {
    if (fieldName) {
        this.dataSource.removeFilter(fieldName);
        this.ui._goToPage(1, true);
        this.ui._sizeColumns();
        this.ui.columnMenu.ui.hideMenu();
        this.ui._currentTHElement.classList.remove(jw.DOM.classes.JW_GRID_FIELD_HAS_FILTER);
    }
}
/**
 * Navigates to a grid page if paging is configured.
 * @param {number} pageNumber - Page number to navigate to.
 */
jasonGrid.prototype.goToPage = function (pageNumber) {
    if (pageNumber && this.options.paging) {
        this.ui._goToPage(pageNumber, true);
    }
}
/**
 * Shows a column if the column is hidden.
 * @param {jasonGridColumn} column - Column to show.
 */
jasonGrid.prototype.showColumn = function (column) {
    if (column && !column.visible) {
        return this.ui._columnVisible(column, true);
    }
    return true;
}
/**
 * Hides a column if the column is visible. Cannot hide if there is only one column in the grid.
 * @param {jasonGridColumn} column - Column to hide.
 */
jasonGrid.prototype.hideColumn = function (column) {
    if (column && column.visible) {
        return this.ui._columnVisible(column, false);
    }
    return false;
}
/**
 * Moves a column if the column is visible.
 * @param {jasonGridColumn} column - Column to move.
 * @param {number} newIndex - New index for the column.
 */
jasonGrid.prototype.moveColumnTo = function (column, newIndex) {
    this.ui.moveColumn(column, newIndex);
}
/**
 * Selects a data row and adds it to the selectedRows array if multiple select is on.
 * @param {jasonGridColumn} column - Column to hide.
 */
jasonGrid.prototype.selectRow = function (rowIndex) {
    var row = this.dataSource.currentDataView[rowIndex];
    if (this.options.multiSelect) {
        this.selectedRows.push(row);
    } else {
        this.selectedRows = [row];
    }
}
/**
 * Toggles the collapse state of a data grouping.
 * @param {string|number} groupLevel - Level of the grouping to toggle.
 * @param {string} groupKey - Key of the grouping to toggle.
 */
jasonGrid.prototype.toggleCollapseDatagroup = function (groupLevel, groupKey) {
    this.ui._collapseExpandGroup(groupLevel, groupKey);
}
/**
 * Exports grid to CSV.
 * @ignore
 */
jasonGrid.prototype.exportToCSV = function (fileName) {
    throw new Error("Not implemented yet.");
}
/**
 * Exports grid to PDF.
 * @ignore
 */
jasonGrid.prototype.exportToPDF = function (fileName) {
    throw new Error("Not implemented yet.");
}
/**
 * Exports grid to EXCEL.
 * @ignore
 */
jasonGrid.prototype.exportToExcel = function (fileName) {
    throw new Error("Not implemented yet.");
}
//#endregion






/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


jasonDatePicker.prototype = Object.create(jasonButtonTextbox.prototype);
jasonDatePicker.prototype.constructor = jasonDatePicker;

/**
 * @namespace Date/Time
 * @description
 * 
 * Collection of date/time widgets.
 */

/**
 * @class
 * @name jasonDatePickerOptions
 * @description Configuration for the date picker widget.
 * @memberOf Date/Time
 * @augments Common.jasonWidgetOptions
 * @property {string}   [displayFormat=browser locale format] - Defines the display format of the widget.
 * @property {string}   [placeholder=""]   - Defines the placeholder text value.
 * @property {boolean}  [readonly=false]      - If true, does not allow typing. Default is false.
 * @property {date}     [value=now]          - Date value.
 * @property {string}   [mode=date]   - Date or DateTime mode.
 */

/**
 * @event Date/Time.jasonDatePicker#onChange
 * @type {object}
 * @property {Date/Time.jasonDatePicker} sender - The date picker instance.
 * @property {date} value - The new date.
 */

/**
 * @constructor
 * @description Datepicker widget.
 * @memberOf Date/Time
 * @augments Common.jasonBaseWidget
 * @param {HTMLElement} htmlElement - DOM element that will contain the date picker.
 * @param {Date/Time.jasonDatePickerOptions} options - jasonDatePicker options. 
 * @property {date} date - Date value of the widget.
 * @fires Date/Time.jasonDatePicker#event:onChange
 */
function jasonDatePicker(htmlElement, options) {
    this.defaultOptions = {
        displayFormat: jasonWidgets.localizationManager.localeDateFormat,
        mode: 'date',
        icon:jw.DOM.icons.CALENDAR
    };
    //this._date = jasonWidgets.common.dateOf(this.options.date ? this.options.date : new Date());
    jasonButtonTextbox.call(this, htmlElement, options, "jasonDatePicker", jasonDatePickerUIHelper);
    this.readonly = this.options.readonly ? this.options.readonly : false;
}
/**
 * Can be overridden in descendants to return a different formatted result.
 * @param {date} value - Date value.
 */
jasonDatePicker.prototype.formatValue = function (value) {
    return jw.common.formatDateTime(value, this.options.displayFormat);
}
/**
 * Can be overridden in descendants to return a different value when the "value" property is set, to determine whether a value change is needed or not.
 * @param {date} value - Date value.
 */
jasonDatePicker.prototype.compareValue = function (value) {
    var valueType = jw.common.getVariableType(value);
    switch (valueType) {
        case jw.enums.dataType.string: {
            return jw.common.dateComparison(this._value, jw.common.parseDateValue(value));
        }
        case jw.enums.dataType.date: {
            return jw.common.dateComparison(this._value, value);
        }
        default: {
            jw.common.throwError(jw.errorTypes.typeError, "Invalid value type for jasonDatePicker.");
            break;
        }
    }
}
/**
 * Returns the widget's value.
 */
jasonDatePicker.prototype.readValue = function (value) {
    return value;
}
/**
 * Sets the widget's value.
 * @param {date|string}  value - New value.
 */
jasonDatePicker.prototype.setValue = function (value) {
    var valueType = jw.common.getVariableType(value);
    switch (valueType) {
        case jw.enums.dataType.string: {
            return jw.common.parseDateValue(value,this.options.displayFormat);
        }
        case jw.enums.dataType.date: {
            return value;
        }
        default: {
            jw.common.throwError(jw.errorTypes.typeError, "Invalid value type for jasonDatePicker.");
            break;
        }
    }
}


jasonDatePickerUIHelper.prototype = Object.create(jasonButtonTextboxUIHelper.prototype);
jasonDatePickerUIHelper.prototype.constructor = jasonDatePickerUIHelper;

/**
 * @constructor
 * @ignore
 */
function jasonDatePickerUIHelper(widget, htmlElement) {
    this.onTextInputBlur = this.onTextInputBlur.bind(this);
    this.onTextInputFocus = this.onTextInputFocus.bind(this);
    this.inputKeyDown = this.inputKeyDown.bind(this);
    this.buttonClick = this.buttonClick.bind(this);
    this.onCalendarDateChange = this.onCalendarDateChange.bind(this);
    this.datePickerSetDateFlag = false;
    jasonButtonTextboxUIHelper.call(this, widget, htmlElement);
}


/**
 * Renders the datepicker UI.
 */
jasonDatePickerUIHelper.prototype.renderUI = function () {
    jasonButtonTextboxUIHelper.prototype.renderUI.call(this);
    if (!this.htmlElement.classList.contains(jw.DOM.classes.JW_DATE_PICKER_CLASS)) {
        this.htmlElement.classList.add(jw.DOM.classes.JW_DATE_PICKER_CLASS);

        if (this.widget.options.placeholder)
            this.inputControl.setAttribute(jasonWidgets.DOM.attributes.PLACEHOLDER_ATTR, this.widget.options.placeholder);
        if (this.widget.readonly == true)
            this.inputControl.setAttribute(jasonWidgets.DOM.attributes.READONLY_ATTR, this.widget.readonly);

        this.htmlElement.appendChild(this.inputControl);
        this.htmlElement.appendChild(this.button);
        if (this.widget.value)
            this.inputControl.value = jasonWidgets.common.formatDateTime(this.widget.value, this.options.displayFormat);
        this.calendarContainer = this.createElement("div");
        document.body.appendChild(this.calendarContainer);
        //this.htmlElement.appendChild(this.calendarContainer);
        this.jasonCalendar = new jasonCalendar(this.calendarContainer, { invokable: true, autoHide: true, invokableElement: this.htmlElement, width:this.options.width });
        this.jasonCalendar.addEventListener(jw.DOM.events.JW_EVENT_ON_CHANGE, this.onCalendarDateChange);
    }
}
/**
 * 
 */
jasonDatePickerUIHelper.prototype.initializeEvents = function () {
    this.eventManager.addEventListener(this.button, jw.DOM.events.CLICK_EVENT, this.buttonClick,true);
    this.eventManager.addEventListener(this.inputControl, jw.DOM.events.BLUR_EVENT, this.onTextInputBlur);
    this.eventManager.addEventListener(this.inputControl, jw.DOM.events.KEY_DOWN_EVENT, this.inputKeyDown);
}
/**
 * 
 */
jasonDatePickerUIHelper.prototype.onTextInputBlur = function (blurEvent, sender) {
    jasonTextboxUIHelper.prototype.onTextInputBlur.call(this, blurEvent, sender);
    if (this.inputControl.value.length > 0 && this.changed) {
        this.widget.value = this.inputControl.value;
    }
}
/**
 * 
 */
jasonDatePickerUIHelper.prototype.onTextInputFocus = function (event, sender) {
    jasonTextboxUIHelper.prototype.onTextInputFocus.call(this, event, sender);
}
/**
 * 
 */
jasonDatePickerUIHelper.prototype.inputKeyDown = function (keydownEvent) {
    var keyCode = keydownEvent.which || keydownEvent.keyCode;
    this.changed = true;
    if (keyCode == 13 && this.inputControl.value.length > 0) {
        this.widget.value = this.inputControl.value;
    }
}
/**
 * 
 */
jasonDatePickerUIHelper.prototype.onCalendarDateChange = function (sender,newDate) {
    this.widget.value = newDate;
    if (this.jasonCalendar)
        this.jasonCalendar.ui.hideCalendar();
    this.inputControl.focus();
}
/**
 * 
 */
jasonDatePickerUIHelper.prototype.buttonClick = function (clickEvent) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    this.jasonCalendar.ui.showCalendar(this.widget.value);
    //clickEvent.stopPropagation();
}
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


jasonTimePicker.prototype = Object.create(jasonCombobox.prototype);
jasonTimePicker.prototype.constructor = jasonTimePicker;


/**
 * @class
 * @name jasonTimePickerOptions
 * @memberOf Date/Time
 * @description Configuration the time picker widget.
 * @augments Common.jasonWidgetOptions
 * @property {string}   [timeFormat=browser locale format] - Defines the display format of the widget.
 * @property {string}   [placeholder=""]   - Defines the placeholder text value.
 * @property {boolean}  [readonly=false]      - If true, does not allow typing.
 * @property {date}     [value=now]          - Time value.
 * @property {number}   [interval=15]      - Minute interval of which the time picker will display the items.
 */

/**
 * @event Date/Time.jasonTimePicker#onChange
 * @description Occurs when time value is changed.
 * @type {object}
 * @property {Date/Time.jasonTimePicker} sender - The time picker instance.
 * @property {date} value - The new time.
 */

/**
 * @constructor
 * @description Time picker widget.
 * @memberOf Date/Time
 * @augments Common.jasonBaseWidget
 * @param {HTMLElement} htmlElement - DOM element that will contain the time picker.
 * @param {Date/Time.jasonTimePickerOptions} options - jasonTimePicker options.
 * @property {date} time - Time value of the widget.
 * @fires Date/Time.jasonTimePicker#event:onChange
 */
function jasonTimePicker(htmlElement, options) {
    this.defaultOptions = {
        timeFormat: jasonWidgets.localizationManager.localeTimeFormat,
        interval: 15,
        keyFieldName: 'key',
        displayFields: ['formattedTime'],
        displayFormat:"{0}",
        icon: jw.DOM.icons.CLOCK,
        autoFilter:true,
        events: [{
            eventName: jw.DOM.events.JW_EVENT_ON_SHOW,
            listener: function (sender) {
                this._hasKeyStroke = false;
            }.bind(this)
        }]
    };
    jasonWidgets.common.extendObject(this.defaultOptions, options);
    this.prepareData(options);
    jasonCombobox.call(this, htmlElement, options, "jasonTimePicker");

    this._hasKeyStroke = false;
    this._time = jasonWidgets.common.timeOf(this.options.time ? this.options.time : new Date());
    this.onTextInputBlur = this.onTextInputBlur.bind(this);
    this.cmbInputKeyDown = this.cmbInputKeyDown.bind(this);
    this.onTimePickerSelectItem = this.onTimePickerSelectItem.bind(this);
    this.eventManager.addEventListener(this.ui.inputControl, jw.DOM.events.BLUR_EVENT, this.onTextInputBlur);
    this.eventManager.addEventListener(this.ui.inputControl, jw.DOM.events.KEY_DOWN_EVENT, this.cmbInputKeyDown);
    //this.addEventListener(jw.DOM.events.JW_EVENT_ON_SELECT_ITEM, this.onTimePickerSelectItem);
}
/**
 * Can be overridden in descendants to return a different value when the "value" property is set, to determine whether a value change is needed or not.
 * @param {date} value - Date value.
 */
jasonTimePicker.prototype.compareValue = function (value) {
    var valueType = jw.common.getVariableType(value);
    switch (valueType) {
        case jw.enums.dataType.string: {
            return jw.common.timeComparison(jw.common.parseTimeValue(value), this.value);
            break;
        }
        case jw.enums.dataType.date: {
            return jw.common.timeComparison(value, this.value);
            break;
        }
        case jw.enums.dataType.array: {
            return jw.common.timeComparison(Array.isArray(value) ? value[0].time : value, this.value);
            break;
        }
        default: {
            jw.common.throwError(jw.errorTypes.typeError, "Invalid value type for jasonTimePicker.");
            break;
        }
    }
    
}
/**
 * Timepicker is a combobox descendant. Combobox does everyting in arrays, hence the check for the value to be an array or not
 * to get the time value out of the selected object.
 */
jasonTimePicker.prototype.readValue = function (value) {
    return value;
}
/**
 * Can be overridden in descendants to return a different formatted result.
 * @param {date} value - Date value.
 */
jasonTimePicker.prototype.formatValue = function (value) {
    return jw.common.formatDateTime(value, this.options.timeFormat);
}
/**
 * Timepicker is a combobox descendant. Combobox does everyting in arrays, hence the check for the value to be an array or not
 * in order to set the time value of the selected object as the value of the widget.
 * But when the user is typing to set a value then it's just a date value.
 */
jasonTimePicker.prototype.setValue = function (value) {
    var newValue = Array.isArray(value) ? value[0].time : value;
    var valueType = jw.common.getVariableType(newValue);
    var result = null;
    switch (valueType) {
        case jw.enums.dataType.string: {
            result = jw.common.parseDateTimeValue(newValue,this.options.timeFormat);
            break;
        }
        case jw.enums.dataType.date: {
            result = newValue;
            break;
        }
        default: {
            jw.common.throwError(jw.errorTypes.typeError, "Invalid value type for jasonTimePicker.");
            break;
        }
    }

    if (result)
        this._selectItemFromTime(result);
    this._hasKeyStroke = false;
    return result;
}
/**
 * preparing drop down data for the time picker
 * @ignore
 */
jasonTimePicker.prototype.prepareData = function (options) {
    var timeData = [];
    var timeDataLength = Math.round((1440 / options.interval));
    if (options.interval < 1)
        jw.common.throwError(jw.errorTypes.rangeError, "Timepicker interval cannot be less than a minute.");
    for (var i = 0; i <= timeDataLength - 1; i++) {
        var timeItem = {key:i,time:null,formattedTime:null};
        timeItem.time = new Date();
        var hours = null;
        var minutes = null;
        var lastItem = timeData[timeData.length - 1];
        if ((lastItem && lastItem.time.getMinutes() + options.interval) >= 60) {
            hours = lastItem.time.getHours() + 1;
            minutes = 0;
        } else {
            hours = i == 0 ? 0 : lastItem.time.getHours();
            minutes = i == 0 ? 0 : lastItem.time.getMinutes() + options.interval;
        }
        timeItem.time.setHours(hours);
        timeItem.time.setMinutes(minutes);
        timeItem.time.setSeconds(0);
        timeItem.time.setMilliseconds(0);
        timeItem.formattedTime = jasonWidgets.common.formatDateTime(timeItem.time, options.timeFormat);
        timeData.push(timeItem);
    }
    options.data = timeData;
}
///**
// * sets time
// * @ignore
// * @property {date} newTime - the new time value.
// */
//jasonTimePicker.prototype._setTime = function (newTime) {
//    if (newTime) {
//        var currentTime = this._time;
//        var newTime = newTime;
//        if (jw.common.timeComparison(currentTime,newTime) != jw.enums.comparison.equal) {
//            this._time = newTime;
//            this._selectItemFromTime(this._time);
//            this.triggerEvent(jw.DOM.events.JW_EVENT_ON_CHANGE, this._time);
//        }
//        this.ui.inputControl.value = jw.common.formatDateTime(this._time, this.options.displayFormat);
//    }
//}
/**
 * @ignore
 */
jasonTimePicker.prototype.onTimePickerSelectItem = function (sender,value) {
    if (value.selectedItem) {
        this.value = value.selectedItem.time;
    }
}
/**
 * Sets the selected and selecteditemindex from a time value if found.
 * @ignore
 */
jasonTimePicker.prototype._selectItemFromTime = function (newTime) {
    var timeItem = null;
    for (var i = 0; i <= this.dataSource.data.length - 1; i++) {
        var itm = this.dataSource.data[i];
        if (jw.common.timeComparison(itm.time, newTime) == jw.enums.comparison.equal) {
            timeItem = itm;
            break;
        }
    }
    if (timeItem) {
        this.clearSelection();
        this.ui.dropDownListButton.selectedItems.push(timeItem);
    }
}
/**
 * onblur event handler
 * @ignore
 */
jasonTimePicker.prototype.onTextInputBlur = function (blurEvent) {
    if (this.ui.inputControl.value.length > 0 && this._hasKeyStroke) {
        this.value = this.ui.inputControl.value;
        //this.ui.hideList();
    }
}
/**
 * keydown event handler
 * @ignore
 */
jasonTimePicker.prototype.cmbInputKeyDown = function (keyDownEvent) {
    var keyCode = keyDownEvent.which || keyDownEvent.keyCode;
    switch (keyCode) {
        case jw.keycodes.enter : {//enter key
            if (this.ui.inputControl.value.length > 0) {
                this.value = this.ui.inputControl.value;
                this.ui.hideList();
            }
            break;
        }
        case jw.keycodes.downArrow: {
            this._hasKeyStroke = false;
            break;
        }
        default: {
            this._hasKeyStroke = true;
            break;
        }
    }
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


jasonDateTimePicker.prototype = Object.create(jasonButtonTextbox.prototype);
jasonDateTimePicker.prototype.constructor = jasonDateTimePicker;

/**
 * @class
 * @name jasonDateTimePickerOptions
 * @description Configuration for the DateTimePicker widget.
 * @memberOf Date/Time
 * @augments Common.jasonWidgetOptions
 * @property {string}   [dateFormat=browser locale format] - Defines the date display format of the widget.
 * @property {string}   [timeFormat=browser locale format] - Defines the time display format of the widget.
 * @property {string}   [placeholder=""]  - Defines the placeholder text value.
 * @property {boolean}  [readonly=false]  - If true, does not allow typing. Default is false.
 * @property {date}     [value=undefined] - DateTime value.
 * @property {string}   [mode=date|time|datetime] - Date or Time or DateTime mode.
 * @property {number}   [interval=15]      - Minute interval of which the time picker will display the items.
 */

/**
 * @event Date/Time.jasonDateTimePicker#onChange
 * @description Occurs when date value is changed.
 * @type {object}
 * @property {Date/Time.jasonDateTimePicker} sender - The datetime picker instance.
 * @property {date} value - The new datetime value.
 */

/**
 * @constructor
 * @description DateTimePicker widget.
 * @memberOf Date/Time
 * @augments Common.jasonBaseWidget
 * @param {HTMLElement} htmlElement - DOM element that will contain the datetime picker.
 * @param {Date/Time.jasonDateTimePickerOptions} options - jasonDateTimePicker options. 
 * @property {date} date - Date value of the widget.
 * @fires Date/Time.jasonDateTimePicker#event:onChange
 */
function jasonDateTimePicker(htmlElement, options) {
    this.defaultOptions = {
        dateFormat: jasonWidgets.localizationManager.localeDateFormat,
        timeFormat:jasonWidgets.localizationManager.localeTimeFormat,
        mode: 'datetime',
        icon: jw.DOM.icons.CALENDAR,
        interval: 15,
        keyFieldName: 'key',
        displayFields: ['formattedTime'],
        displayFormat: "{0}"
    };
    this.prepareData(options);
    jasonButtonTextbox.call(this, htmlElement, options, "jasonDateTimePicker", jasonDateTimePickerUIHelper);
    
 //   this.ui.renderUI();
}
/**
 * Can be overridden in descendants to return a different formatted result.
 * @param {date} value - Date value.
 */
jasonDateTimePicker.prototype.formatValue = function (value) {
    switch (this.options.mode) {
        case "date": {
            return jw.common.formatDateTime(value, this.options.dateFormat);
            break;
        }
        case "time": {
            return jw.common.formatDateTime(value, this.options.timeFormat);
            break;
        }
        case "datetime":
        default:{
            return jw.common.formatDateTime(value, this.options.dateFormat + " " + this.options.timeFormat);
        }
    }
}
/**
 * Returns the widget's value.
 */
jasonDateTimePicker.prototype.readValue = function (value) {
    return value;
}
/**
 * Can be overridden in descendants to return a different value when the "value" property is set, to determine whether a value change is needed or not.
 * @param {date} value - Date value.
 */
jasonDateTimePicker.prototype.compareValue = function (value) {

    var valueType = jw.common.getVariableType(value);
    //if variable is not an acceptable type then throw an error.
    switch (valueType) {
        case jw.enums.dataType.string: {
            break;
        }
        case jw.enums.dataType.date: {
            break;
        }
        default: {
            jw.common.throwError(jw.errorTypes.typeError, "Invalid value type for jasonDateTimePicker.");
            break;
        }
    }
    var parsedValue = valueType == jw.enums.dataType.string ? this.parseValue(value) : value;
    switch (this.options.mode) {
        case "date": {
            return jw.common.dateComparison(this._value, parsedValue);
            break;
        }
        case "time": {
            return jw.common.timeComparison(this._value, parsedValue);
            break;
        }
        case "datetime": {
            if (jw.common.dateComparison(this._value, parsedValue) == jw.enums.comparison.equal && jw.common.timeComparison(this._value, parsedValue) == jw.enums.comparison.equal)
                return jw.enums.equal;
            else
                return jw.enums.notEqual;
            break;
        }
        default: { return jw.enums.notEqual; }
    }
}
/**
 * Sets the widget's value.
 * @param {date|string}  value - New value.
 */
jasonDateTimePicker.prototype.setValue = function (value) {
    var valueType = jw.common.getVariableType(value);
    switch (valueType) {
        case jw.enums.dataType.string: {
            return this.parseValue(value);
        }
        case jw.enums.dataType.date: { 
            return value;
        }
        default: {
            jw.common.throwError(jw.errorTypes.typeError, "Invalid value type for jasonDateTimePicker.");
            break;
        }
    }
}
/**
 * preparing drop down data for the time picker
 * @ignore
 */
jasonDateTimePicker.prototype.prepareData = function (options) {
    var timeData = [];
    options.interval = options.interval ? options.interval : this.defaultOptions.interval;
    options.dateFormat = options.dateFormat ? options.dateFormat : this.defaultOptions.dateFormat;
    options.timeFormat = options.timeFormat ? options.timeFormat : this.defaultOptions.timeFormat;
    var timeDataLength = Math.round((1440 / options.interval));
    for (var i = 0; i <= timeDataLength - 1; i++) {
        var timeItem = { key: i, time: null, formattedTime: null };
        timeItem.time = new Date();
        var hours = null;
        var minutes = null;
        var lastItem = timeData[timeData.length - 1];
        if ((lastItem && lastItem.time.getMinutes() + options.interval) >= 60) {
            hours = lastItem.time.getHours() + 1;
            minutes = 0;
        } else {
            hours = i == 0 ? 0 : lastItem.time.getHours();
            minutes = i == 0 ? 0 : lastItem.time.getMinutes() + options.interval;
        }
        timeItem.time.setHours(hours);
        timeItem.time.setMinutes(minutes);
        timeItem.time.setSeconds(0);
        timeItem.time.setMilliseconds(0);
        timeItem.formattedTime = jasonWidgets.common.formatDateTime(timeItem.time, options.timeFormat)
        timeData.push(timeItem);
    }
    options.data = timeData;
}
/**
 * @ignore.
 * Parsing input's string value.
 */
jasonDateTimePicker.prototype.parseValue = function (value) {
    var newValue = null;
    switch (this.options.mode) {
        case "date": {
            newValue = jw.common.parseDateValue(value,this.options.dateFormat);
            break;
        }
        case "time": {
            newValue = jw.common.parseTimeValue(value,this.options.timeFormat);
            break;
        }
        case "datetime": {
             newValue = jw.common.parseDateTimeValue(value,this.options.dateFormat,this.options.timeFormat);
            break;
        }
    }
    return newValue;
}

jasonDateTimePickerUIHelper.prototype = Object.create(jasonButtonTextboxUIHelper.prototype);
jasonDateTimePickerUIHelper.prototype.constructor = jasonDateTimePickerUIHelper;

/**
 * @constructor
 * @ignore
 */
function jasonDateTimePickerUIHelper(widget, htmlElement) {
    this.onTextInputBlur = this.onTextInputBlur.bind(this);
    this.onTextInputFocus = this.onTextInputFocus.bind(this);
    this.inputKeyDown = this.inputKeyDown.bind(this);
    this.buttonClick = this.buttonClick.bind(this);
    this.timeButtonClick = this.timeButtonClick.bind(this);
    this.onCalendarDateChange = this.onCalendarDateChange.bind(this);
    this.datePickerSetDateFlag = false;
    this.timeButton = null;
    jasonButtonTextboxUIHelper.call(this, widget, htmlElement);
}


/**
 * Renders the datepicker UI.
 */
jasonDateTimePickerUIHelper.prototype.renderUI = function () {
    var self = this;
    jasonButtonTextboxUIHelper.prototype.renderUI.call(this);
    if (!this.htmlElement.classList.contains(jw.DOM.classes.JW_DATE_PICKER_CLASS)) {
        this.htmlElement.classList.add(jw.DOM.classes.JW_DATE_PICKER_CLASS);

        if (this.widget.options.placeholder)
            this.inputControl.setAttribute(jasonWidgets.DOM.attributes.PLACEHOLDER_ATTR, this.widget.options.placeholder);
        if (this.widget.readonly == true)
            this.inputControl.setAttribute(jasonWidgets.DOM.attributes.READONLY_ATTR, this.widget.readonly);

        var timeOptions = {};
        jw.common.extendObject(this.options, timeOptions);
        timeOptions.icon = jw.DOM.icons.CLOCK;
        timeOptions.tetheredElement = this.htmlElement;
        timeOptions.events.push({
            eventName: jw.DOM.events.JW_EVENT_ON_SELECT_ITEM,
            listener: function (sender,timeItem) {
                self.timeButton.hideList();
                var currentValue = self.widget.value;
                var newValue = null;
                if (!currentValue) {
                    newValue = timeItem.selectedItem.time;
                } else {
                    newValue = new Date(currentValue.getFullYear(),
                        currentValue.getMonth(),
                        currentValue.getDate(),
                        timeItem.selectedItem.time.getHours(),
                        timeItem.selectedItem.time.getMinutes(),
                        timeItem.selectedItem.time.getSeconds());

                }
                self.widget.value = newValue;
                setTimeout(function () {
                    self.inputControl.focus();
                });
                
            }
        });

        this.timeButton = new jasonDropDownListButton(jw.htmlFactory.createJWButton(null, jw.DOM.icons.CLOCK), timeOptions);
        this.timeButton.htmlElement.classList.remove(jw.DOM.classes.JW_BORDERED);

        this.timeButton.visible = this.options.mode == "date" ? false : true;
        this.button.style.display = this.options.mode == "time" ? "none" : "";
        
        this.htmlElement.appendChild(this.inputControl);
        this.htmlElement.appendChild(this.button);
        this.htmlElement.appendChild(this.timeButton.htmlElement);
        var buttonWidth = this.options.mode == "datetime" ? 70 : 34;
        this.inputControl.style.width = "calc(100% - " + (buttonWidth) + "px)";
        if (this.inputControl.style.width == "")
            this.inputControl.style.width = "-webkit-calc(100% - " + (buttonWidth) + "px)";

        if (this.widget.value)
            this.inputControl.value = jasonWidgets.common.formatDateTime(this.widget.value, this.options.dateFormat + " " + this.options.timeFormat);
        this.calendarContainer = this.createElement("div");
        document.body.appendChild(this.calendarContainer);
        this.jasonCalendar = new jasonCalendar(this.calendarContainer, { invokable: true, autoHide: true, invokableElement: this.htmlElement, width: this.options.width });
        this.jasonCalendar.addEventListener(jw.DOM.events.JW_EVENT_ON_CHANGE, this.onCalendarDateChange);
        this.widget.readonly = this.options.readonly ? this.options.readonly: false;
    }
}
/**
 * 
 */
jasonDateTimePickerUIHelper.prototype.initializeEvents = function () {
    this.eventManager.addEventListener(this.button, jw.DOM.events.CLICK_EVENT, this.buttonClick, true);
    this.eventManager.addEventListener(this.timeButton.htmlElement, jw.DOM.events.CLICK_EVENT, this.timeButtonClick, true);
    this.eventManager.addEventListener(this.inputControl, jw.DOM.events.BLUR_EVENT, this.onTextInputBlur);
    this.eventManager.addEventListener(this.inputControl, jw.DOM.events.KEY_DOWN_EVENT, this.inputKeyDown);
}
/**
 * 
 */
jasonDateTimePickerUIHelper.prototype.onTextInputBlur = function (blurEvent, sender) {
    jasonTextboxUIHelper.prototype.onTextInputBlur.call(this, blurEvent, sender);
    if (this.inputControl.value.length > 0 && this.changed) {
        this.widget.value = this.inputControl.value;
    }
}
/**
 * 
 */
jasonDateTimePickerUIHelper.prototype.onTextInputFocus = function (event, sender) {
    jasonTextboxUIHelper.prototype.onTextInputFocus.call(this, event, sender);
}
/**
 * 
 */
jasonDateTimePickerUIHelper.prototype.inputKeyDown = function (keydownEvent) {
    var keyCode = keydownEvent.which || keydownEvent.keyCode;
    this.changed = true;
    if (keyCode == 13 && this.inputControl.value.length > 0) {
        this.widget.value = this.inputControl.value;
    }
}
/**
 * 
 */
jasonDateTimePickerUIHelper.prototype.onCalendarDateChange = function (sender, newDate) {
    var newValue = newDate;
    if(this.widget.value){
        newValue = new Date(newValue.getFullYear(),
            newValue.getMonth(),
            newValue.getDate(),
            this.widget.value.getHours(),
            this.widget.value.getMinutes(),
            this.widget.value.getSeconds());
    }
    this.widget.value = newValue;
    if (this.jasonCalendar)
        this.jasonCalendar.ui.hideCalendar();
    this.inputControl.focus();
}

/**
 * 
 */
jasonDateTimePickerUIHelper.prototype.buttonClick = function (clickEvent) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    this.jasonCalendar.ui.showCalendar(this.widget.value);
    this.timeButton.hideList();
    //clickEvent.stopPropagation();
}
/**
 * 
 */
jasonDateTimePickerUIHelper.prototype.timeButtonClick = function (clickEvent) {
    if(this.widget.readonly || !this.widget.enabled)
        return;
    this.jasonCalendar.ui.hideCalendar();
}
/**
 * 
 */
jasonDateTimePickerUIHelper.prototype.updateEnabled = function (enable) {
    jasonButtonTextboxUIHelper.prototype.updateEnabled.call(this, enable);
    if (enable) {
        this.inputControl.removeAttribute(jw.DOM.attributes.DISABLED_ATTR);
        this.button.removeAttribute(jw.DOM.attributes.DISABLED_ATTR);
    }
    else {
        this.inputControl.setAttribute(jw.DOM.attributes.DISABLED_ATTR,true);
        this.button.setAttribute(jw.DOM.attributes.DISABLED_ATTR,true);
    }
    this.timeButton.enabled = enable;
}
/**
 * Updates UI when readonly state is changed.
 * @abstract
 */
jasonDateTimePickerUIHelper.prototype.updateReadOnly = function (readonly) {
    jasonButtonTextboxUIHelper.prototype.updateReadOnly.call(this, readonly);
    this.timeButton.readonly = readonly;
}
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonDialog.prototype = Object.create(jasonBaseWidget.prototype);
jasonDialog.prototype.constructor = jasonDialog;

/**
 * @class
 * @name jasonDialogOptions
 * @memberOf Containers
 * @augments Common.jasonWidgetOptions
 * @property {boolean} [modal=false] - If true the dialog will be shown in a modal mode.
 * @property {string} [title=undefined] - Dialog's title.
 * @property {Containers.jasonDialogButton[]} [buttons = undefined] - Dialog buttons configuration.
 * @property {boolean} [resizeable = false] - If true the user can resize the window.
 * @property {object}   animation            - Animation configuration. 
 * @property {number}   [animation.delay=5]      - Numeric value to define animation delay. Range is 1-10.
 * @property {boolean} [draggable = false] - If true the user can move the window.
 * @property {boolean} [closeButton = true] - If true a close button will appear on the dialog header.
 * @property {number|string} [top = undefined] - Set the top coordinates for the dialog.
 * @property {number|string} [left = undefined] - Set the left coordinates for the dialog.
 * @property {number|string} [height = undefined] - Set the height for the dialog.
 * @property {number|string} [width = undefined] - Set the width for the dialog.
 * @property {number|string} [minWidth = 140] - Set the minimum width for the dialog.
 * @property {number|string} [minHeight = 170] - Set the minimum height for the dialog.
 * @property {HTMLElement} [blockTarget = window] - If set and the dialog is modal it will block the contents behind the dialog.
 * @property {object} model - Dialog's model. It will be used when rendering header and body templates.
 * @property {object} customization - Widget's customization configuration.
 * @property {string|function} customization.headerTemplate - HTML string or script tag or function containing HTML to be used to render the dialog header.
 * @property {string|function} customization.bodyTemplate - HTML string or script tag or function containing HTML to be used to render the dialog header.
 */

/**
 * @readonly
 * @enum {number}
 * @memberOf Containers
 * @description Result of a jason dialog button.
 */
var jasonDialogButtonResult = {
    OK: 1,
    CANCEL: 2,
    NO: 3,
    YES: 4,
    ABORT: 5,
    RETRY: 6,
    IGNORE: 7
}

/**
 * @class
 * @name jasonDialogButton
 * @memberOf Containers
 * @description JasonDialog button.
 * 
 * @property {Containers.jasonDialogButtonResult} result - Result of the button when clicked.
 * @property {string} caption - Caption of the button.
 * @property {string} title - Title of the button.
 * @property {boolean} [controlsDialogClose=false] - If set to true the dialog will not close automatically.It will be determined on the click event listener of that button.
 */

/**
 * @event Containers.jasonDialog#onDialogButtonClick
 * @type {object}
 * @description Occurs when a dialog button is clicked.
 * @property {Containers.jasonDialog} sender - The dialog instance.
 * @property {Containers.jasonDialogButton} value - The button that was clicked.
 */
/**
 * @event Containers.jasonDialog#onShow
 * @description Occurs when dialog is shown and all animations have been completed.
 * @type {object}
 * @property {Containers.jasonDialog} sender - The dialog instance.
 */
/**
 * @event Containers.jasonDialog#onHide
 * @description Occurs when dialog is hidden and all animations have been completed. 
 * @type {object}
  * @property {Containers.jasonDialog} sender - The dialog instance.
 */

/**
 * @constructor
 * @memberOf Containers
 * @augments Common.jasonBaseWidget
 * @param {HTMLElement} htmlElement - DOM element that will contain the Dialog.
 * @param {Containers.jasonDialogOptions} options - Dialog control options. 
 * @fires Containers.jasonDialog#event:onDialogButtonClick
 * @fires Containers.jasonDialog#event:onShow
 * @fires Containers.jasonDialog#event:onHide
 */
function jasonDialog(htmlElement, options) {
    this.defaultOptions = {
        height: 300,
        width: 400,
        closeButton: true,
        resizeable: false,
        draggable: false,
        modal:false,
        buttons: [],
        model: null,
        minWidth: 140,
        minHeight:170,
        customization: {
            headerTemplate: null,
            bodyTemplate: null,
            dataFieldAttribute: "data-field"
        }
    };
    this._initializeTemplates(options);
    jasonBaseWidget.call(this, "jasonDialog", htmlElement, options, jasonDialogUIHelper);
 }

/**
 * Shows the dialog.
 */
jasonDialog.prototype.show = function () {
    this.ui.renderUI();
    this.ui.show();
}
/**
 * Hides the dialog.
 */
jasonDialog.prototype.hide = function () {
    this.ui.hide();
}
/**
 * Initializing customization templates.
 * @ignore
 */
jasonDialog.prototype._initializeTemplates = function (options) {
    /*initializing header and body templates*/
    var template = (typeof options.customization.headerTemplate == "function") ? options.customization.headerTemplate() : options.customization.headerTemplate;
    var isElement = document.getElementById(template);
    if (isElement) {
        template = isElement.tagName == "SCRIPT" ? isElement.innerHTML : isElement.outerHTML;
    }
    else {
        template = typeof template == "string" && template.trim().length > 0 ? template : null;
    }
    options.customization.headerTemplate = template;

    template = (typeof options.customization.bodyTemplate == "function") ? options.customization.bodyTemplate() : options.customization.bodyTemplate;
    isElement = document.getElementById(template);
    if (isElement) {
        template = isElement.tagName == "SCRIPT" ? isElement.innerHTML : isElement.outerHTML;
    }
    else {
        template = typeof template == "string" && template.trim().length > 0 ? template : null;
    }
    options.customization.bodyTemplate = template;

}

jasonDialogUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonDialogUIHelper.prototype.constructor = jasonDialogUIHelper;

/**
 * jasonDialog UI widget helper.
 * @constructor
 * @ignore
 */
function jasonDialogUIHelper(widget, htmlElement) {

    this._onDialogButtonClick = this._onDialogButtonClick.bind(this);
    this._dialogInCenter = this._dialogInCenter.bind(this);
    this.resizeEventListenerId = null;
    this.existingBlockedDialogInstance = null;
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);
}
/**
 * Renders dialog's controls. HTML.
 */
jasonDialogUIHelper.prototype.renderUI = function () {
    if (!this.dialogContainer) {
        this.dialogContainer = this.createElement("DIV");
        this.dialogContainer.style.display = "none";
        this.dialogContainer.classList.add(jw.DOM.classes.JW_DIALOG_CONTAINER);
        this.dialogContainer.jasonWidgetsData = [].concat(this.htmlElement.jasonWidgetsData);
        this.htmlElement.parentNode.removeChild(this.htmlElement);
        this.blockUI = new jasonBlockUI(this.dialogContainer,{opacity:'0.5'});

        this.dialogHeader = this.createElement("DIV");
        this.dialogHeader.classList.add(jw.DOM.classes.JW_DIALOG_HEADER);
        this.dialogTitleContainer = this.createElement("DIV");
        this.dialogTitleContainer.classList.add(jw.DOM.classes.JW_DIALOG_TITLE_CONTAINER);
        this.dialogHeaderButtonContainer = this.createElement("DIV");
        this.dialogHeaderButtonContainer.classList.add(jw.DOM.classes.JW_DIALOG_HEADER_BUTTON_CONTAINER);

        this.dialogHeader.appendChild(this.dialogTitleContainer);
        this.dialogHeader.appendChild(this.dialogHeaderButtonContainer);
        if (this.options.customization.headerTemplate == void 0) {
            this.dialogTitle = jw.htmlFactory.createJWLinkLabel(this.options.title);
            this.dialogTitleContainer.appendChild(this.dialogTitle);

            if (this.options.closeButton) {
                this.dialogHeaderButton = jw.htmlFactory.createJWButton(null, jw.DOM.icons.CLOSE)
                jw.common.setData(this.dialogHeaderButton, jw.DOM.attributeValues.JW_DIALOG_BUTTON_DATA_KEY, { name: 'closeBtn', result: jasonDialogButtonResult.CANCEL });
                //this.options.buttons.push({ name: 'closeBtn', result: jasonDialogButtonResult.CANCEL });
                this.eventManager.addEventListener(this.dialogHeaderButton, jw.DOM.events.CLICK_EVENT, this._onDialogButtonClick, true);
                this.dialogHeaderButtonContainer.appendChild(this.dialogHeaderButton);
            }
        }
        else {
            jw.common.applyTemplate(this.dialogHeader, this.options.customization.headerTemplate, this.options.customization.dataFieldAttribute,this.options.model);
        }

        this.dialogBody = this.createElement("DIV");
        if (this.options.customization.bodyTemplate == void 0) {
            this.dialogBody.appendChild(this.htmlElement);
        }
        else {
            jw.common.applyTemplate(this.dialogBody, this.options.customization.bodyTemplate, this.options.customization.dataFieldAttribute,this.options.model);
        }
        this.dialogBody.classList.add(jw.DOM.classes.JW_DIALOG_BODY);

        this.dialogFooter = this.createElement("DIV");
        this.dialogFooter.classList.add(jw.DOM.classes.JW_DIALOG_FOOTER);
        this.buttonsContainer = this.createElement("div");
        this.buttonsContainer.classList.add(jw.DOM.classes.JW_DIALOG_BUTTONS_CONTAINER);
        this.dialogFooter.appendChild(this.buttonsContainer);
        this._renderButtons();

        this.dialogContainer.appendChild(this.dialogHeader);
        this.dialogContainer.appendChild(this.dialogBody);
        this.dialogContainer.appendChild(this.dialogFooter);
        this.dialogContainer.appendChild(jw.htmlFactory.createClearFloat());
        this.dragResize = new jasonDragResize(this.dialogContainer, {
            allowResize: this.options.resizeable ? { top: true, left: true, bottom: true, right: true } : false,
            allowDrag: {draggable:this.options.draggable,element:this.dialogHeader},
            minHeight: this.options.minHeight,
            minWidth: this.options.minWidth,
            changeDragCursor: false,
            
        },"jasonDialogDragResize");
    }
}
/**
 * Renders dialog's buttons.
 */
jasonDialogUIHelper.prototype._renderButtons = function (tabIndex) {
    if (this.options.buttons.length == 0) {
        var btnOK = this.options.localization.dialog.buttons.filter(function(btn){ return btn.name == "btnOK";})[0];
        this.options.buttons.push({ caption: btnOK.caption, result: jasonDialogButtonResult.OK });
    }

    for (var i = 0; i <= this.options.buttons.length - 1; i++) {
        var btn = jw.htmlFactory.createJWButton(this.options.buttons[i].caption);
        this.options.buttons[i].element = btn;
        this.eventManager.addEventListener(btn, jw.DOM.events.CLICK_EVENT, this._onDialogButtonClick, true);
        jw.common.setData(btn, jw.DOM.attributeValues.JW_DIALOG_BUTTON_DATA_KEY, this.options.buttons[i]);
        this.buttonsContainer.appendChild(btn);
    }

    //getting the next tab index but increasing it manually
    //since the elements are not yet part of the DOM.
    //The loop is going dowwards because the buttons are stacked on the right.
    //So in order to be able to navigate properly using the keyboard, the last button has the lowest tabindex hence it will get focus first.
    //for (var i = this.options.buttons.length - 1; i >=0 ; i--) {
    //    var btn = this.options.buttons[i].element;
    //    btn.setAttribute(jasonWidgets.DOM.attributes.TABINDEX_ATTR, tabIndex);
    //    tabIndex++;
    //}
}
/**
 * Button click event.
 */
jasonDialogUIHelper.prototype._onDialogButtonClick = function (event) {
    var buttonClicked = jw.common.getData(event.currentTarget, jw.DOM.attributeValues.JW_DIALOG_BUTTON_DATA_KEY);
    this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_JW_DIALOG_BUTTON_CLICK, buttonClicked);
    if (buttonClicked.controlsDialogClose == false || buttonClicked.controlsDialogClose == void 0)
        this.hide();
}
/**
 * Shows the dialog.
 */
jasonDialogUIHelper.prototype.show = function () {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    this.resizeEventListenerId = jwWindowEventManager.addWindowEventListener(jw.DOM.events.RESIZE_EVENT, function (resizeEvent) {
        this._dialogInCenter();
    }.bind(this));
    if (this.options.modal) {
        var dialogs = document.querySelectorAll(".jw-dialog-container");
        var existingDialog = null;
        for (var i = dialogs.length - 1; i >= 0 ; i--) {
            if (dialogs[i].style.display == "") {
                existingDialog = dialogs[i];
                break;
            }
        }
        if (existingDialog) {
            this.existingBlockedDialogInstance = jw.common.getData(existingDialog, "jasonDialog");
            if (this.existingBlockedDialogInstance)
                this.existingBlockedDialogInstance.ui.blockUI.options.active = false;
        }
        this.blockUI.options.blockKeyboard = true;
        this.blockUI.block(existingDialog == null ? this.options.blockTarget : existingDialog);
    }
    if (this.options.width)
        this.dialogContainer.style.width = parseFloat(this.options.width) + "px";
    if (this.options.height)
        this.dialogContainer.style.height = parseFloat(this.options.height) + "px";
    if (this.options.top) 
        this.dialogContainer.style.top = parseFloat(this.options.top) + "px";
    if (this.options.left)
        this.dialogContainer.style.left = parseFloat(this.options.left); + "px";

    document.body.appendChild(this.dialogContainer);

    this.dialogContainer.style.display = "";

    if (this.dialogContainer.style.zIndex == "") {
        this.dialogContainer.style.zIndex = jw.common.getNextZIndex();
    } else {
        var zIndex = parseInt(this.dialogContainer.style.zIndex);
        var newZIndex = jw.common.getNextZIndex();
        if (zIndex < newZIndex) {
            this.dialogContainer.style.zIndex = newZIndex;
        }
    }

    this._dialogInCenter();

    if (this.dialogTitle != void 0)
        this.dialogTitle.focus();
    if (this.options.animation) {
        var animDelay = !this.options.animation.delay || this.options.animation.delay > 10 ? 25 : this.options.animation.delay * 5;
        var self = this;
        jw.common.fadeIn(this.dialogContainer, animDelay, function () {
            self.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_SHOW);
        });
    } else {
        this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_SHOW);
    }
}
/**
 * Hides the dialog.
 */
jasonDialogUIHelper.prototype.hide = function () {
    if (this.existingBlockedDialogInstance) {
        this.existingBlockedDialogInstance.ui.blockUI.options.active = true;
        this.existingBlockedDialogInstance = null;
    }
    if (this.options.animation) {
        var animDelay = !this.options.animation.delay || this.options.animation.delay > 10 ? 25 : this.options.animation.delay * 5;
        jw.common.fadeOut(this.dialogContainer, animDelay, function () {
            this.blockUI.unBlock();
            jwWindowEventManager.removeWindowEventListener(this.resizeEventListenerId);
            //self.dialogContainer.style.display = "none";
            document.body.removeChild(this.dialogContainer);
            this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_HIDE);
        }.bind(this));
    } else {
        this.blockUI.unBlock();
        document.body.removeChild(this.dialogContainer);
        //this.dialogContainer.style.display = "none";
        this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_HIDE);
    }
}
/**
 * Place the dialog in the center of the window if no explicit top and left were defined.
 */
jasonDialogUIHelper.prototype._dialogInCenter = function () {
    if (this.options.left == void 0) {
        var centerLeft = (window.innerWidth / 2) - (this.dialogContainer.offsetWidth / 2);
        this.dialogContainer.style.left = centerLeft + "px";
    }

    if (this.options.top == void 0) {
        var centerTop = (window.innerHeight / 2) - (this.dialogContainer.offsetHeight / 2);
        this.dialogContainer.style.top = centerTop + "px";
    }
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonButton.prototype = Object.create(jasonBaseWidget.prototype);
jasonButton.prototype.constructor = jasonButton;

/**
 * @namespace Buttons
 * @description Collection of button widgets.
 */

/**
 * @class
 * @name jasonButtonOptions
 * @description Configuration for the jasonButton widget.
 * @memberOf Buttons
 * @augments Common.jasonWidgetOptions
 * @property {string} [caption=undefined] - Button caption.
 * @property {Globals.jw.DOM.icons}  [icon=undefined] - Button icon class.
 */

/**
 * @event Buttons.jasonButton#click
 * @type {object}
 * @property {object} event - The event object.
 * @property {Buttons.jasonButton} sender - The button instance.
 */

/**
 * jasonButtonWidget
 * @constructor
 * @descrption Button control widget.
 * @memberOf Buttons
 * @augments Common.jasonBaseWidget
 * @param {HTMLElement} htmlElement - DOM element that will contain the button.
 * @param {Buttons.jasonButtonOptions} options - jasonButton options.
 * @fires Buttons.jasonButton#event:click
 */
function jasonButton(htmlElement, options, nameSpace, uiHelper) {
    jasonBaseWidget.call(this, nameSpace == void 0 ? "jasonButton" : nameSpace, htmlElement, options, uiHelper == void 0 ? jasonButtonUIHelper : uiHelper);
    //if (uiHelper == void 0)
    //    this.ui.renderUI();
}

jasonButtonUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonButtonUIHelper.prototype.constructor = jasonButtonUIHelper;

/**
 * Button UI widget helper.
 * @constructor
 * @ignore
 */
function jasonButtonUIHelper(widget, htmlElement) {
    this.buttonClick = this.buttonClick.bind(this);
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);
}
/**
 * Renders buttons control's HTML.
 */
jasonButtonUIHelper.prototype.renderUI = function () {
    jw.htmlFactory.createJWButton(this.options.caption, this.options.icon, this.htmlElement);
    this.htmlElement.classList.add(jw.DOM.classes.JW_BORDERED);
}
/**
 * Initialize Events
 */
jasonButtonUIHelper.prototype.initializeEvents = function () {
    this.eventManager.addEventListener(this.htmlElement, jw.DOM.events.CLICK_EVENT, this.buttonClick, true);
}
/**
 * Renders buttons control's HTML.
 */
jasonButtonUIHelper.prototype.buttonClick = function () {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    this.widget.triggerEvent(jw.DOM.events.CLICK_EVENT);
}
/**
 * Updates UI when enable/disable state is changed.
 * @abstract
 */
jasonButtonUIHelper.prototype.updateEnabled = function (enable) {
    jasonBaseWidgetUIHelper.prototype.updateEnabled.call(this, enable);
    if (enable)
        this.htmlElement.removeAttribute(jw.DOM.attributes.DISABLED_ATTR)
    else
        this.htmlElement.setAttribute(jw.DOM.attributes.DISABLED_ATTR, true);
}
/**
 * Updates UI when visible state is changed.
 * @abstract
 */
jasonButtonUIHelper.prototype.updateVisible = function (visible) {
    jasonBaseWidgetUIHelper.prototype.updateVisible.call(this, visible);
}
/**
 * Updates UI when read only state is changed.
 * @abstract
 */
jasonButtonUIHelper.prototype.updateReadOnly = function (readonly) {
    jasonBaseWidgetUIHelper.prototype.updateReadOnly.call(this, readonly);
    if (readonly)
        this.htmlElement.removeAttribute(jw.DOM.attributes.READONLY_ATTR)
    else
        this.htmlElement.setAttribute(jw.DOM.attributes.READONLY_ATTR, true);
}


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonDropDownListButton.prototype = Object.create(jasonBaseWidget.prototype);
jasonDropDownListButton.prototype.constructor = jasonDropDownListButton;


/**
 * @class
 * @name jasonDropDownListButtonOptions
 * @description Configuration for the jasonDropDownListButton widget.
 * @memberOf Buttons
 * @augments Common.jasonWidgetOptions
 * @property {string} [caption=undefined] - Button caption.
 * @property {Globals.jw.DOM.icons}  [icon=undefined] - Button icon class.
 * @property {any[]} [data=[]] - Drop down list data.
 * @property {boolean} [multiSelect=false] - If true it allows to select/check multiple items from the drop down list.
 * @property {boolean} [checkboxes=false] - If true it shows check-boxes next to the list items.
 * @property {string}   [multipleSelectionSeparator = |] - Character to separate values displayed in the button when multiSelect is enabled.
 * @property {object}   [customization={}]       - Drop down list button customization.
 * @property {any}      [customization.itemTemplate=undefined]       - HTML string or script tag or function containing HTML to be used to render drop down list items. 
 * @property {HTMLElement} [tetheredElement=undefined] - If defined the drop down list will be shown at the coordinates of the tethered element.
 */

/**
 * @event Buttons.jasonDropDownListButton#onSelectItem
 * @type {object}
 * @property {Buttons.jasonDropDownListButton} sender - The button instance.
 * @property {object} value - The event data.
 * @property {object} value.selectedItem - The selected item object.
 * @property {number} value.selectedItemIndex - The selected item index.
 */

/**
 * @event Buttons.jasonDropDownListButton#onUnSelectItem
 * @type {object}
 * @property {Buttons.jasonDropDownListButton} sender - The button instance.
 * @property {object} value - The event data.
 * @property {object} value.selectedItem - The unselected item object.
 * @property {number} value.selectedItemIndex - The selected item index.
 */

/**
 * @event Buttons.jasonDropDownListButton#onHide
 * @type {object}
 * @property {Buttons.jasonDropDownListButton} sender - The button instance.
 */

/**
 * @event Buttons.jasonDropDownListButton#onShow
 * @type {object}
 * @property {Buttons.jasonDropDownListButton} sender - The button instance.
 */

/**
 * jasonDropDownListButton
 * @constructor
 * @descrption Button control widget.
 * @memberOf Buttons
 * @augments Common.jasonBaseWidget
 * @param {HTMLElement} htmlElement - DOM element that will contain the button.
 * @param {Buttons.jasonDropDownListButtonOptions} options - jasonDropDownListButton options. 
 * @property {any[]} selectedItems - Selected items.
 * @fires Buttons.jasonDropDownListButton#event:onSelectItem
 * @fires Buttons.jasonDropDownListButton#event:onUnSelectItem
 * @fires Buttons.jasonDropDownListButton#event:onHide
 * @fires Buttons.jasonDropDownListButton#event:onShow
 */
function jasonDropDownListButton(htmlElement, options) {
    this.defaultOptions = {
        multiSelect: false,
        checkboxes: false,
        multipleSelectionSeparator :"|"
    }
    this.onDataChange = this.onDataChange.bind(this);
    this.dataSource = new jasonDataSource({ data: options.data, onChange: this.onDataChange });
    jasonButton.call(this, htmlElement, options, "jasonDropDownListButton", jasonDropDownListButtonUIHelper);
    this.selectedItems = [];
}
/**
 * @ignore
 */
jasonDropDownListButton.prototype.onDataChange = function () {
    this.ui.renderListItems();
}
/**
 * Shows the drop down list.
 */
jasonDropDownListButton.prototype.showList = function () {
    this.ui.showList();
}
/**
 * Hides the drop down list.
 */
jasonDropDownListButton.prototype.hideList = function () {
    this.ui.hideList();
}
/**
 * Selects an item by item index.
 * @param {number} itemIndex - Index of the item to select.
 */
jasonDropDownListButton.prototype.selectItem = function (itemIndex) {
    if (typeof itemIndex == "number") {
        if (!this.options.multiSelect)
            this.selectedItems = [];
        var itemToAdd = this.dataSource.data[itemIndex];
        if (itemToAdd) {
            this.selectedItems.push(itemToAdd);
            this.selectedItemIndex = itemIndex;
            this.ui.updateCaption();
            this.triggerEvent(jw.DOM.events.JW_EVENT_ON_SELECT_ITEM, { selectedItem: itemToAdd, selectedItemIndex: itemIndex });
            this.validate();
        }
    }
}
/**
 * Deselects an item by item index.
 * @param {number} itemIndex - Index of the item to deselect.
 */
jasonDropDownListButton.prototype.deSelectItem = function (itemIndex) {
    var itemToRemove = this.dataSource.data[itemIndex];
    if (itemToRemove) {
        var indexToRemove = -1;
        this.selectedItems.filter(function (item, index) {
            var result = item._jwRowId == itemToRemove._jwRowId;
            if (result) {
                indexToRemove = index;
                return;
            }
        });
        if (indexToRemove >= 0) {
            this.selectedItems.splice(indexToRemove, 1);
            this.ui.updateCaption();
            this.triggerEvent(jw.DOM.events.JW_EVENT_ON_UNSELECT_ITEM, { selectedItem: itemToRemove, selectedItemIndex: itemIndex });
        }
    }
}

jasonDropDownListButtonUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonDropDownListButtonUIHelper.prototype.constructor = jasonDropDownListButtonUIHelper;

/**
 * Button UI widget helper.
 * @constructor
 * @ignore
 */
function jasonDropDownListButtonUIHelper(widget, htmlElement) {
    this.dropDownListContainer = null;
    this.dropDownList = null;
    this.onListItemClick = this.onListItemClick.bind(this);
    this.onListItemKeyDown = this.onListItemKeyDown.bind(this);
    /*if a click occurs outside the input or drop down list, hide the list.*/
    jwDocumentEventManager.addDocumentEventListener(jw.DOM.events.MOUSE_DOWN_EVENT, this.monitorForDocumentClick.bind(this));
    var self = this;
    jwDocumentEventManager.addDocumentEventListener(jw.DOM.events.TOUCH_MOVE_EVENT, function (scrollEvent) {
        self.hideList();
    });
    jasonButtonUIHelper.call(this, widget, htmlElement);
}
/**
 * Monitors for mouse down events on the document level, in order to hide the drop-down list.
 */
jasonDropDownListButtonUIHelper.prototype.monitorForDocumentClick = function (mouseDownEvent) {
    if (this.dropDownListContainer && this.dropDownListContainer.style.display == "") {
        if (jw.common.contains(this.htmlElement, mouseDownEvent.target))
            return;
        if (jw.common.isMouseEventOutOfContainer(this.dropDownListContainer, mouseDownEvent))
            this.hideList();
    }
}
/**
 * Renders buttons control's HTML.
 */
jasonDropDownListButtonUIHelper.prototype.renderUI = function () {
    jasonButtonUIHelper.prototype.renderUI.call(this);
    this.dropDownListContainer = this.createElement("DIV");
    this.dropDownList = this.createElement("UL");
    this.renderListItems();
    this.dropDownListContainer.appendChild(this.dropDownList);
    this.dropDownListContainer.style.display = "none";
    this.dropDownListContainer.style.position = "absolute";
    this.dropDownListContainer.classList.add(jw.DOM.classes.JW_DROP_DOWN_LIST);
    if (this.options.multiSelect)
        this.htmlElement.classList.add(jw.DOM.classes.JW_DROP_DOWN_BUTTON_MULTI_SELECT);
}
/**
 * Creates a caption from the current selection.
 */
jasonDropDownListButtonUIHelper.prototype.createCaptionFromSelection = function(){
    var self = this;
    var captionValue = "";
    var fieldValues = [];
    this.widget.selectedItems.forEach(function (selectedItem,index) {
        self.options.displayFields.forEach(function (displayField) {
            fieldValues.push(selectedItem[displayField]);
        });
        captionValue = captionValue + jasonWidgets.common.formatString(self.options.displayFormat, fieldValues);
        if (self.widget.selectedItems.length > 1 && index < self.widget.selectedItems.length -1)
            captionValue = captionValue + " " + self.options.multipleSelectionSeparator + " ";
        fieldValues = [];
    });
    return captionValue;
}
/**
 * Updates the button caption and title.
 */
jasonDropDownListButtonUIHelper.prototype.updateCaption = function () {
    var caption = this.createCaptionFromSelection();
    jw.common.replaceNodeText(this.htmlElement.children[0], caption);
    this.htmlElement.children[0].setAttribute(jw.DOM.attributes.TITLE_ATTR, caption);
}
/**
 * Render list items.
 */
jasonDropDownListButtonUIHelper.prototype.renderListItems = function (data) {
    var dataToRender = data ? data : this.widget.dataSource.data;
    jw.common.removeChildren(this.dropDownList);
    var nextTabIndex = jasonWidgets.common.getNextTabIndex();
    for (var i = 0; i <= dataToRender.length - 1; i++) {
        var listItem = this.createElement("li");
        var dataItem = dataToRender[i];
        var itemCaption = null;
        if (this.options.customization.itemTemplate) {
            jw.common.applyTemplate(listItem, this.options.customization.itemTemplate, this.options.customization.dataFieldAttribute, dataItem);
        } else {
            var displayText = this.formatDataItem(dataItem);
            itemCaption = jw.htmlFactory.createJWLabel(displayText)
            var checkboxElement = null;
            if (this.options.checkboxes) {
                //var uniqueId = jw.common.generateUUID();
                checkboxElement = jw.htmlFactory.createJWCheckBoxInput(false, null);
                listItem.appendChild(checkboxElement);
                //itemCaption.setAttribute(jw.DOM.attributes.FOR_ATTR, uniqueId);
            }
            listItem.appendChild(itemCaption);
        }
        listItem.className = jw.DOM.classes.JW_DROP_DOWN_LIST_ITEM;
        listItem.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_JW_ITEM_INDEX_ATTR, dataItem._jwRowId);
        listItem.setAttribute(jasonWidgets.DOM.attributes.JW_ITEM_INDEX_ATTR, i);
        listItem.setAttribute(jasonWidgets.DOM.attributes.TABINDEX_ATTR, nextTabIndex);
        jasonWidgets.common.setData(listItem, "jDropDownListDataItem", dataItem);
        //if (itemCaption)
        //    this.eventManager.addEventListener(itemCaption, jw.DOM.events.MOUSE_DOWN_EVENT, this.onListItemClick);
        //if (this.options.checkboxes)
        //    this.eventManager.addEventListener(listItem.getElementsByTagName("input")[0], jw.DOM.events.INPUT_EVENT, this.onListItemClick,true);
        this.eventManager.addEventListener(listItem, jw.DOM.events.KEY_DOWN_EVENT, this.onListItemKeyDown,true);
        this.eventManager.addEventListener(listItem, jw.DOM.events.MOUSE_DOWN_EVENT, this.onListItemClick,true);
        nextTabIndex++;
        this.dropDownList.appendChild(listItem);
    }
}
/**
 * @ignore
 * Formats the drop down list's item string value.
 */
jasonDropDownListButtonUIHelper.prototype.formatDataItem = function (dataItem) {
    var fieldValues = [];
    if (this.options.displayFields) {
        this.options.displayFields.forEach(function (displayField) {
            fieldValues.push(dataItem[displayField]);
        });
    }
    var displayText = dataItem._NoData_;
    if (!displayText)
        displayText = typeof dataItem == "string" ? dataItem : jasonWidgets.common.formatString(this.options.displayFormat, fieldValues);
    dataItem._jw_Searchable_value = fieldValues.join(" ");
    return displayText;
}
/**
 * Initializing customization templates.
 * @ignore
 */
jasonDropDownListButtonUIHelper.prototype.initializeTemplates = function () {
    /*initializing row and column templates*/
    var itemTemplate = (typeof this.options.customization.itemTemplate == "function") ? this.options.customization.itemTemplate() : this.options.customization.itemTemplate;
    var isElement = document.getElementById(itemTemplate);
    if (isElement) {
        itemTemplate = isElement.tagName == "SCRIPT" ? isElement.innerHTML : isElement.outerHTML;
    }
    else {
        itemTemplate = typeof itemTemplate == "string" && itemTemplate.trim().length > 0 ? itemTemplate : null;
    }
    this.options.customization.itemTemplate = itemTemplate;
}
/**
 * Initialize Events
 */
jasonDropDownListButtonUIHelper.prototype.initializeEvents = function () {
    this.eventManager.addEventListener(this.htmlElement, jw.DOM.events.CLICK_EVENT, this.buttonClick, true);
}
/**
 * Renders buttons control's HTML.
 */
jasonDropDownListButtonUIHelper.prototype.buttonClick = function () {
    this.toggleList();
    jasonButtonUIHelper.prototype.buttonClick.call(this);
}
/**
 * Toggle list visibility.
 */
jasonDropDownListButtonUIHelper.prototype.toggleList = function () {
    if (this.dropDownListContainer.style.display == "none")
        this.showList();
    else
        this.hideList();
}
/*
 * Shows the list. 
 */
jasonDropDownListButtonUIHelper.prototype.showList = function () {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    if (this.dropDownListContainer.style.display = "none") {
        //var bRect = this.options.tetheredElement ? this.options.tetheredElement.getBoundingClientRect() : this.htmlElement.getBoundingClientRect();
        var bRect = this.options.tetheredElement ? jw.common.getBoundingClientRect(this.options.tetheredElement) : jw.common.getBoundingClientRect(this.htmlElement);
        document.body.appendChild(this.dropDownListContainer);
        
        var width = this.options.tetheredElement ? this.options.tetheredElement.offsetWidth : this.htmlElement.offsetWidth;
        var height = this.options.tetheredElement ? this.options.tetheredElement.offsetHeight : this.htmlElement.offsetHeight;
        var top = bRect.top + height;
        var left = bRect.left ;



        if (width)
            this.dropDownListContainer.style.width = width + "px";

        this.dropDownListContainer.style.top = top + "px";
        this.dropDownListContainer.style.left = left + "px";
        this.dropDownListContainer.style.zIndex = jw.common.getNextAttributeValue("z-index") + 1;
        this.dropDownListContainer.style.display = "";
        jw.common.getFirstFocusableElement(this.dropDownList);
        this.scrollItemIntoView();
        this.widget.selectedItems.forEach(function (itm, idx) {
            var liElement = this.dropDownList.children[itm._jwRowId];
            if (liElement) {
                if (!liElement.classList.contains(jw.DOM.classes.JW_SELECTED))
                    this.toggleLIElementSelection(liElement);
            }
        }.bind(this));
        //this.htmlElement.classList.add(jw.DOM.classes.JW_SELECTED);
        this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_SHOW);
    }
}
/**
 * Hides the list.
 */
jasonDropDownListButtonUIHelper.prototype.hideList = function () {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    if (this.dropDownListContainer.style.display == "") {
        this.dropDownListContainer.style.display = "none";
        //this.htmlElement.classList.remove(jw.DOM.classes.JW_SELECTED);
        document.body.removeChild(this.dropDownListContainer);
        this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_HIDE);
    }
}
/**
 * Removes the selected class from the selected items.
 */
jasonDropDownListButtonUIHelper.prototype.clearSelection = function (except) {
    var selectedElements = this.dropDownList.getElementsByClassName(jw.DOM.classes.JW_SELECTED);
    for (var i = 0; i <= selectedElements.length - 1; i++) {
        if (selectedElements[i] != except)
            selectedElements[i].classList.remove(jw.DOM.classes.JW_SELECTED);
    }
    this.widget.selectedItemIndex = -1;
    this.widget.selectedItems = [];
}
/**
 * List item click event listener.
 */
jasonDropDownListButtonUIHelper.prototype.onListItemClick = function (event) {
    if (event.button != 0)
        return;
    var setCheckboxValues = event.target.tagName != "INPUT";
    var listElement = event.target.tagName == "LI" ? event.target : jw.common.getParentElement("LI", event.target);
    var currentCheckbox = listElement.getElementsByTagName("input")[0];
    //if multi select is not enabled and check boxes are visible, uncheck all check boxes
    //except the one that it was clicked.
    if (!this.options.multiSelect && this.options.checkboxes) {
        var checkBoxes = this.dropDownList.getElementsByTagName("input");

        for (var i = 0; i <= checkBoxes.length - 1; i++) {
            if (checkBoxes[i] != currentCheckbox)
                checkBoxes[i].checked = false;
        }
    }
    if (!this.options.multiSelect)
        this.clearSelection(listElement);

    if (listElement.classList.contains(jw.DOM.classes.JW_SELECTED))
        this.widget.deSelectItem(parseInt(listElement.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_JW_ITEM_INDEX_ATTR)));
    else
        this.widget.selectItem(parseInt(listElement.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_JW_ITEM_INDEX_ATTR)));
    this.toggleLIElementSelection(listElement,event);

    if (!this.options.multiSelect)
        this.hideList();
}
/**
 * Handles the UI part of an LI element and what it means to be selected and what not.
 */
jasonDropDownListButtonUIHelper.prototype.toggleLIElementSelection = function (listElement,event) {
    var currentCheckbox = listElement.getElementsByTagName("input")[0];
    //if the current target is the checkbox itself then DO NOT set a checked value
    //because this code is executed within the MOUSEDOWN event scope, which is prior to the CLICK event.
    //If a value is set at this point, it will be reverted from the browsers default functionality when
    //the checkbox will process the click event.
    if (event && currentCheckbox == event.target)
        currentCheckbox = null;
    if (listElement.classList.contains(jw.DOM.classes.JW_SELECTED)) {
        listElement.classList.remove(jw.DOM.classes.JW_SELECTED);
        if (currentCheckbox)
            currentCheckbox.checked = false;
    }
    else {
        listElement.classList.add(jw.DOM.classes.JW_SELECTED);
        if (currentCheckbox)
            currentCheckbox.checked = true;
    }
}
/**
 * List item key down event listener.
 */
jasonDropDownListButtonUIHelper.prototype.onListItemKeyDown = function (keyDownEvent) {
    var keyCode = keyDownEvent.which || keyDownEvent.keyCode;
    switch (keyCode) {
        case 9: {//tab key
            this.setFocusToListItem(keyDownEvent.currentTarget, keyDownEvent.shiftKey ? jw.DOM.attributeValues.JW_COMBOBOX_LIST_STATE_UP : jw.DOM.attributeValues.JW_COMBOBOX_LIST_STATE_DOWN);
            //if (keyDownEvent.shiftKey)
            keyDownEvent.preventDefault();
            break;
        }
        case jw.keycodes.enter: {//enter key
            var liItemIndex = parseInt(keyDownEvent.currentTarget.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_JW_ITEM_INDEX_ATTR));
            this.widget.selectItem(liItemIndex);
            this.hideList(true);
            this.htmlElement.focus();
            break;
        }
        case jw.keycodes.escape: {//when ESC is clicked hide the list.
            this.hideList();
            break;
        }
        case jw.keycodes.upArrow: {//KeyUp
            this.setFocusToListItem(keyDownEvent.currentTarget, jw.DOM.attributeValues.JW_COMBOBOX_LIST_STATE_UP);
            keyDownEvent.preventDefault();
            break;
        }
        case jw.keycodes.downArrow: {//KeyDown
            this.setFocusToListItem(keyDownEvent.currentTarget, jw.DOM.attributeValues.JW_COMBOBOX_LIST_STATE_DOWN);
            keyDownEvent.preventDefault();
            break;
        }
    }
    //keyDownEvent.stopPropagation();
}
/**
 * Sets focus to a list item.
 */
jasonDropDownListButtonUIHelper.prototype.setFocusToListItem = function (listItem, direction) {
    var liItemIndex = parseInt(listItem.getAttribute(jasonWidgets.DOM.attributes.JW_ITEM_INDEX_ATTR));
    if (direction == "up") {
        if ((liItemIndex - 1) < 0)
            this.htmlElement.focus();
        else
            this.dropDownList.children[liItemIndex - 1].focus();
    } else {
        if (this.dropDownList.children.length != liItemIndex + 1) {
            this.dropDownList.children[liItemIndex + 1].focus();
        }
    }
}
/**
 * Scroll into view selected item.
 */
jasonDropDownListButtonUIHelper.prototype.scrollSelectedIntoView = function (focus) {
    if (this.dropDownListContainer.style.display == "") {
        if (this.widget.selectedItemIndex >= 0) {
            var listItemElement = jw.common.getElementsByAttribute(this.dropDownList, jasonWidgets.DOM.attributes.JW_DATA_JW_ITEM_INDEX_ATTR, this.widget.selectedItemIndex)[0];
            if (listItemElement != void 0) {
                this.dropDownListContainer.scrollTop = listItemElement.offsetTop;
                if(focus)
                    listItemElement.focus();
            }
        }
    }
}
/**
 * Scroll into view the first item.
 */
jasonDropDownListButtonUIHelper.prototype.scrollFirstItemIntoView = function (focus) {
    if (this.dropDownListContainer.style.display == "" && this.dropDownList.children.length > 0) {
        this.dropDownListContainer.scrollTop = this.dropDownList.children[0].offsetTop;
        if(focus)
            this.dropDownList.children[0].focus();
    }
}
/**
 * Scroll into view selected item.
 */
jasonDropDownListButtonUIHelper.prototype.scrollItemIntoView = function (focus) {
    if (this.widget.selectedItems.length > 0)
        this.scrollSelectedIntoView(focus);
    else
        this.scrollFirstItemIntoView(focus);
}
/**
 * Updates UI when enable/disable state is changed.
 * @abstract
 */
jasonDropDownListButtonUIHelper.prototype.updateEnabled = function (enable) {
    jasonButtonUIHelper.prototype.updateEnabled.call(this, enable);
}
/**
 * Updates UI when visible state is changed.
 * @abstract
 */
jasonDropDownListButtonUIHelper.prototype.updateVisible = function (visible) {
    jasonButtonUIHelper.prototype.updateVisible.call(this, visible);
}
/**
 * Updates UI when read only state is changed.
 * @abstract
 */
jasonDropDownListButtonUIHelper.prototype.updateReadOnly = function (readonly) {
    jasonButtonUIHelper.prototype.updateReadOnly.call(this, readonly);
}
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

