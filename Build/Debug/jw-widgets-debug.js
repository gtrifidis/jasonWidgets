/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @interface
 * @name jQuery
 * @property {function} jasonGrid - Example @sample $("#jasonGridDemo").jasonGrid({
            data: gridData, columns: [
                {
                    caption: 'Id', fieldName: 'Id', dataType: 'number', width: 150
                }, {
                    caption: 'First Name', fieldName: 'FirstName', width: 700
                }, {
                    caption: 'Last Name', fieldName: 'LastName', width: 350
                },
                {
                    caption: 'City', fieldName: 'City', width: 550
                },
                {
                    caption: 'Title', fieldName: 'Title'
                }
            ],
            paging: { pagesize: 500 }, multiSelect: true, grouping: true, filtering: true, resizing: true, sorting: { multiple: true },
            customization: { rowTemplate: '' }
        });
 * @property {function} jasonCombobox - Example @sample $("#jasonComboBox").jasonCombobox({ data: self.data.slice(0, 99), keyFieldName: 'id', displayFields: ['first_name', 'last_name'], displayFormatString: '{0},{1}', placeholder: "Search", autoFilter: true });
 * @property {function} jasonTabControl - Example @sample $("#jasonTabControlDemo").jasonTabControl({ pageHeight: 750 });
 * @property {function} jasonMenu - Example @sample $("#jasonMenuWidgetDemo").jasonMenu({ animation: { speed: 9 }, orientation: 'horizontal'});
 * @property {function} jasonContextMenu - Example @sample $("#contextMenuDemo").jasonContextMenu({ target: $("#contextMenuDemoTarget")[0] });
 * @property {function} jasonCalendar - Example @sample  $("#jasonCalendarWidget").jasonCalendar({
            firstDayOfWeek: 5,
            multiSelect: true,
            rangeSelect: false,
            specialDates: [
                { date: '1978/11/09', tooltip: 'My birthday', cssClass: 'test' },
                { date: '2000/12/25', tooltip: 'Christmas', recurring: true }
            ]
        });
 * @property {function} jasonDatePicker - Example @sample $("#datePicker").jasonDatePicker({ placeholder: 'Type in a date', displayFormat: 'dd/MM/yyyy' });
 * @property {function} jasonTimePicker - Example @sample $("#timePicker").jasonTimePicker({ placeholder: 'Type in a time' });
 */
(function ($) {
    //if jQuery exists.
    if ($) {
        $.fn.jasonGrid = function (options) {
            var self = this;
            var jGrid = self.data("jasonGrid");
            if (jGrid) {
                self.removeData(jGrid);
            }
            jGrid = new jasonGrid(self[0], options);
            self.data("jasonGrid", jGrid);
        }
        $.fn.jasonCombobox = function (options) {
            var self = this;
            var jCombobox = self.data("jasonCombobox");
            if (jCombobox) {
                self.removeData(jCombobox);
            }
            jCombobox = new jasonCombobox(self[0], options);
            self.data("jasonCombobox", jCombobox);
        }
        $.fn.jasonTabControl = function (options) {
            var self = this;
            var jTabControl = self.data("jasonTabControl");
            if (jTabControl) {
                self.removeData(jTabControl);
            }
            jTabControl = new jasonTabControl(self[0], options);
            self.data("jasonTabControl", jTabControl);
        }
        $.fn.jasonMenu = function (options) {
            var self = this;
            var jMenuWidget = self.data("jasonMenuWidget");
            if (jMenuWidget) {
                self.removeData(jMenuWidget);
            }
            jMenuWidget = new jasonMenu(self[0], options,jasonMenuUIHelper);
            self.data("jasonMenuWidget", jMenuWidget);
        }
        $.fn.jasonContextMenu = function (options) {
            var self = this;
            var jContextMenuWidget = self.data("jasonContextMenu");
            if (jContextMenuWidget) {
                self.removeData(jContextMenuWidget);
            }
            jContextMenuWidget = new jasonMenu(self[0], options, jasonContextMenuUIHelper);
            self.data("jasonContextMenu", jContextMenuWidget);
        }
        $.fn.jasonCalendar = function (options) {
            var self = this;
            var jCalendarWidget = self.data("jasonCalendar");
            if (jCalendarWidget) {
                self.removeData(jCalendarWidget);
            }
            jCalendarWidget = new jasonCalendar(self[0], options);
            self.data("jasonCalendar", jCalendarWidget);
        }
        $.fn.jasonDatePicker = function (options) {
            var self = this;
            var jDatePikcerWidget = self.data("jasonDatePicker");
            if (jDatePikcerWidget) {
                self.removeData(jDatePikcerWidget);
            }
            jDatePikcerWidget = new jasonDatePicker(self[0], options);
            self.data("jasonDatePicker", jDatePikcerWidget);
        }
        $.fn.jasonTimePicker = function (options) {
            var self = this;
            var jTimePikcerWidget = self.data("jasonTimePicker");
            if (jTimePikcerWidget) {
                self.removeData(jTimePikcerWidget);
            }
            jTimePikcerWidget = new jasonTimePicker(self[0], options);
            self.data("jasonTimePicker", jTimePikcerWidget);
        }
    }
})(window.jQuery ? window.jQuery : null);
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
var
    JW_MENU_ITEM = "jw-menu-item",
    JW_MENU_ITEM_CLICKABLE = "clickable",
    JW_MENU_ITEM_DISABLED = "disabled",
    JW_MENU_ITEM_CAPTION = "jw-menu-item-caption",
    JW_MENU_ITEM_CAPTION_ONLY = "just-caption",
    JW_MENU_ITEM_ICON = "jw-menu-item-icon",
    JW_MENU_ITEM_ARROW = "jw-menu-item-arrow",
    JW_MENU_ITEM_CHECKBOX = "jw-menu-item-checkbox",
    JW_TEXT_OVERFLOW = "jw-text-overflow",
    JW_LABEL = "jw-label",
    JW_TEXT_INPUT = "jw-text-input",
    JW_BUTTON = "jw-button",
    JW_BUTTON_ELEMENT = "jw-button-element";
var
    JW_ICON = "jw-icon ",
    JW_ICON_ARROW_DOWN = JW_ICON + "arrow-down",
    JW_ICON_ARROW_UP = JW_ICON + "arrow-up",
    JW_ICON_ARROW_LEFT = JW_ICON + "arrow-left",
    JW_ICON_ARROW_RIGHT = JW_ICON + "arrow-right",
    JW_ICON_CALENDAR = JW_ICON + "calendar",
    JW_ICON_CHEVRON_DOWN = JW_ICON + "chevron-down",
    JW_ICON_CHEVRON_UP = JW_ICON + "chevron-up",
    JW_ICON_CHEVRON_LEFT = JW_ICON + "chevron-left",
    JW_ICON_CHEVRON_RIGHT = JW_ICON + "chevron-right",
    JW_ICON_CIRCLE_CHECK = JW_ICON + "circle-check",
    JW_ICON_CIRCLE_X = JW_ICON + "circle-x",
    JW_ICON_CLOCK = JW_ICON + "clock",
    JW_ICON_COLUMNS = JW_ICON + "columns",
    JW_ICON_MENU = JW_ICON + "menu",
    JW_ICON_SEARCH = JW_ICON + "search",
    JW_ICON_SORT_ASC = JW_ICON + "sort-asc",
    JW_ICON_SORT_DESC = JW_ICON + "sort-desc";


/**
 * HTML factory, creating HTML for widgets.
 * @constructor
 * @description A common helper class that generates HTML for different jason widgets.
 * @memberOf Common
 */
function jasonHTMLFactory() {
    /**
     * Creates the HTML for a jwButton
     * @param {string=} caption - Button caption.
     * @param {string=} iconClass - Icon class name.
     */
    jasonHTMLFactory.prototype.createJWButton = function (caption, iconClass) {
        var result = document.createElement("a");
        result.classList.add(JW_BUTTON);
        result.setAttribute("href", "javascript:void(0)");

        if (caption != void 0 && caption.trim().length > 0) {
            var captionElement = document.createElement("span");
            captionElement.classList.add(JW_LABEL);
            captionElement.classList.add(JW_TEXT_OVERFLOW);
            captionElement.appendChild(document.createTextNode(caption));
            captionElement.setAttribute(TITLE_ATTR, caption);
            result.appendChild(captionElement);
        }

        if (iconClass != void 0 && iconClass.trim().length > 0) {
            var iconElement = document.createElement("i");
            iconElement.className = iconClass;
            result.appendChild(iconElement);
        }
        return result;
    }
    /**
     * Creates the HTML for a text input styled for JW.
     * @param {string=} inputMode - Input mode attribute value.
     * @param {string=} placeHolder - Placeholder attribute value.
     * @param {boolean=} readOnly - Readonly attribute value.
     */
    jasonHTMLFactory.prototype.createJWTextInput = function (inputMode,placeHolder,readOnly,inputType) {
        var result = document.createElement("input");
        result.classList.add(JW_TEXT_INPUT);
        result.setAttribute(TYPE_ATTR, "text");
        if (inputType != void 0 && inputType.trim().length > 0)
            result.setAttribute(TYPE_ATTR, inputType);
        if (inputMode != void 0 && inputMode.trim().length > 0)
            result.setAttribute(INPUT_MODE_ATTR, inputMode);
        if (placeHolder != void 0 && placeHolder.trim().length > 0)
            result.setAttribute(PLACEHOLDER_ATTR, placeHolder);
        if (readOnly != void 0 && readOnly)
            result.setAttribute(READONLY_ATTR, readOnly);

        return result;
    }
    /**
     * Creates the HTML for a jwLabel
     * @param {string=} caption - Label caption.
     */
    jasonHTMLFactory.prototype.createJWLinkLabel = function (caption) {
        var result = document.createElement("a");
        result.setAttribute("href", "javascript:void(0)");
        result.classList.add(JW_LABEL);
        result.classList.add(JW_TEXT_OVERFLOW);
        if (caption != void 0 && caption.trim().length > 0) {
            var captionElement = document.createElement("span");
            captionElement.appendChild(document.createTextNode(caption));
            result.appendChild(captionElement);
        }

        return result;
    }
    /**
     * Creates the HTML for a jwMenuItem.
     * @param {string} [orientation = 'horizontal'] orientation - Parent menu's orientation.
     * @param {object} options - HTML factory menu item creation options.
     */
    jasonHTMLFactory.prototype.createJWMenuItem = function (orientation,options) {
        var result = document.createElement("li");
        var menuCaption;
        result.classList.add(JW_MENU_ITEM);

        if (options.clickable)
            result.classList.add(JW_MENU_ITEM_CLICKABLE);

        if (!options.enabled)
            result.classList.add(JW_MENU_ITEM_DISABLED);

        result.setAttribute(TITLE_ATTR, options.title)

        if (options.caption != void 0 && options.caption.trim().length > 0) {
            menuCaption = document.createElement("div");
            menuCaption.classList.add(JW_MENU_ITEM_CAPTION);
            menuCaption.appendChild(jw.htmlFactory.createJWLinkLabel(options.caption));
            menuCaption.classList.add(JW_TEXT_OVERFLOW);
            menuCaption.classList.add(JW_MENU_ITEM_CAPTION_ONLY);
            result.appendChild(menuCaption);
        }

        if (options.icon != void 0 && options.icon.trim().length > 0) {
            var iconWrapper = document.createElement("div");
            var iconElement = document.createElement("i");
            iconElement.className = options.icon;
            iconWrapper.classList.add(JW_MENU_ITEM_ICON);
            iconWrapper.appendChild(iconElement);
            menuCaption.classList.add("has-icon");
            menuCaption.classList.remove(JW_MENU_ITEM_CAPTION_ONLY);
            result.appendChild(iconWrapper);

        }

        if (options.hasCheckBox != void 0 && options.hasCheckBox) {
            var checkBoxWrapper = document.createElement("div");
            var checkBox = document.createElement("input");
            checkBox.setAttribute(TYPE_ATTR, "checkbox");
            checkBox.checked = options.checked;
            checkBoxWrapper.appendChild(checkBox);
            checkBoxWrapper.classList.add(JW_MENU_ITEM_CHECKBOX);
            menuCaption.classList.add("has-checkbox");
            menuCaption.classList.remove(JW_MENU_ITEM_CAPTION_ONLY);
            result.appendChild(checkBoxWrapper);
        }


        if (options.caption != void 0 && options.caption.trim().length > 0) {
            result.appendChild(menuCaption);
        }

        if (options.items != void 0 && options.items.length > 0) {
            var arrowWrapper = document.createElement("div");
            var arrowElement = document.createElement("i");
            arrowElement.className = orientation == "horizontal" ? JW_ICON_CHEVRON_DOWN : JW_ICON_CHEVRON_RIGHT;
            menuCaption.classList.add("has-arrow");
            arrowWrapper.appendChild(arrowElement);
            arrowWrapper.classList.add(JW_MENU_ITEM_ARROW);
            menuCaption.classList.remove(JW_MENU_ITEM_CAPTION_ONLY);
            result.appendChild(arrowWrapper);
        }

        return result;
    }
    /**
     * Converts an existin li element to a jwMenuItem element
     * @param {string=} orientation - Parent menu's orientation.
     * @param {HTMLElement} liElement - HTML factory menu item creation options.
     */
    jasonHTMLFactory.prototype.convertToJWMenuItem = function (orientation, liElement) {
        if (liElement != void 0) {
            liElement.classList.add(JW_MENU_ITEM);
            liElement.classList.add(JW_MENU_ITEM_CLICKABLE);
            var textNode = jw.common.getNodeText(liElement);
            if (textNode != void 0) {
                menuCaption = document.createElement("div");
                menuCaption.classList.add(JW_MENU_ITEM_CAPTION);
                menuCaption.appendChild(jw.htmlFactory.createJWLinkLabel(textNode.textContent));
                menuCaption.classList.add(JW_TEXT_OVERFLOW);
                menuCaption.classList.add(JW_MENU_ITEM_CAPTION_ONLY);
                liElement.replaceChild(menuCaption, textNode);
            }
            var isReadOnly = liElement.getAttribute(READONLY_ATTR);
            if (isReadOnly != void 0 && isReadOnly == true) {
                liElement.classList.add(JW_MENU_ITEM_DISABLED);
            }
            var hasSubItems = liElement.getElementsByTagName("UL").length > 0;
            if (hasSubItems) {
                var arrowWrapper = document.createElement("div");
                var arrowElement = document.createElement("i");
                arrowElement.className = orientation == "horizontal" ? JW_ICON_CHEVRON_RIGHT : JW_ICON_CHEVRON_DOWN;
                menuCaption.classList.add("has-arrow");
                arrowWrapper.appendChild(arrowElement);
                arrowWrapper.classList.add(JW_MENU_ITEM_ARROW);
                liElement.appendChild(arrowWrapper);
            }
        }
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
 * @description The jasonWidgetEvent is a construct where jasonWidgets consumers can use to register event listeners to a widget.
 * @property {string} eventName - Name of the event to a listener for.
 * @property {function} listener - Callback function that will be called when the event is triggered. List of params will differ based on the event.
 * @property {object=} callingContext - If defined calls the listener using its value as the calling context.
 */

/**
 * @class
 * @name jasonWidgetOptions
 * @description Configuration for a jason widget.
 * @memberOf Common
 * @property {Common.jasonWidgetEvent[]} events - Widget's events.
 * @property {object} customization - Widget's customization configuration.
 */

/**
 * Base class for all jasonWidgets
 * @constructor
 * @memberOf Common
 * @description The base class for all jason widgets. It has no UI logic, simply the widget's logic.
 * @param {string} [nameSpace = undefined] nameSpace
 * @param {HTMLElement} htmlElement - HTMLElement that the widget will be attached to.
 * @property {boolean} enabled - Gets/sets widget's enabled state.
 * @property {boolean} visible - Gets/sets widget's visible state.
 * @property {boolean} readonly - Gets/sets widget's readonly state.
 */
function jasonBaseWidget(nameSpace, htmlElement,options,uiHelper) {
        this.htmlElement = htmlElement;
        this.nameSpace = nameSpace;
        this._emptyDefaultOptions = { events: [], customization: {}, dataIsSimpleJS:true };
        this._enabled = true;
        this._visible = true;
        this._readOnly = false;
        this._uid = jw.common.generateUUID();
        jw.common._registerWidget(this);
        

        if (this.defaultOptions)
            jasonWidgets.common.extendObject(this._emptyDefaultOptions, this.defaultOptions);
        else
            this.defaultOptions =  this._emptyDefaultOptions;

        if (!options)
            options = {};



        jasonWidgets.common.extendObject(this.defaultOptions, options);

        this._eventListeners = options.events ? options.events : [];
        
        this.options = options;
        this.options.localization = this.options.localization ? this.options.localization : jasonWidgets.localizationManager.currentLanguage;

        this.eventManager = new jasonEventManager();
        this.baseClassName = "jasonWidget";
        if (this.htmlElement) {
            jasonWidgets.common.setData(this.htmlElement, this.nameSpace, this);
            this.htmlElement.classList.add(this.baseClassName);
        }

        

        this.jwProc = this.jwProc.bind(this);
        this.ui = typeof uiHelper == "function" ? new uiHelper(this, htmlElement) : new jasonBaseWidgetUIHelper(this);

        jw.common.addGlobalEventListener(this.jwProc);

        return jasonBaseWidget;
}
/**
 * Widget initialization code.
 * @abstract
 */
jasonBaseWidget.prototype.initialize = function () {

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
        this._eventListeners.push({ event: eventName, listener: eventListener, callingContext: callingContext });
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
 * JW global event listener.
 * @param {number} eventCode - event code.
 * @param {any} eventData - event data.
 */
jasonBaseWidget.prototype.jwProc = function (eventCode, eventData) {
    switch (eventCode) {
        case JGE_REDRAW: {
            this.ui.renderUI();
            break;
        }
    }
}
/**
 * Trigger a widget's event.
 * @param {string} eventName - Name of the event.
 * @param {object} eventData - Event's data.
 */
jasonBaseWidget.prototype.triggerEvent = function (eventName,eventData) {
    var listeners = this._eventListeners.filter(function (eventListener) {
        return eventListener.event == eventName && eventListener.listener;
    });
    for (var i = 0; i <= listeners.length - 1; i++) {
        var listenerObject = listeners[i];
        if (listenerObject.callingContext)
            listenerObject.listener.call(listenerObject.callingContext, this, eventData);
        else
            listenerObject.listener(this, eventData);
    }
}
/**
 * Updates widget's options. Descendants will to implement this,in order for the widgets
 * to dynamically react to option changes.
 * @abstract
 * @param {object} options - Widget's options object.
 */
jasonBaseWidget.prototype.updateOptions = function (options) {

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
Object.defineProperty(jasonBaseWidget.prototype, "readOnly", {
    get: function () {
        return this._readOnly;
    },
    set: function (value) {
        this._readOnly = value;
        this.ui._setReadOnly(this._readOnly);
    },
    enumerable: true,
    configurable: false
});

/**
 * Base class for all jasonWidget UI helpers.
 * @constructor
 * @name jasonBaseWidgetUIHelper
 * @memberOf Common
 * @description The base class for all jason widgets UI helpers. It has all the UI logic, that widgets needs.Events,DOM creation,etc.
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
 * Sets the widgets enabled state.
 * @ignore
 * @param {boolean} enable - enabled value
 */
jasonBaseWidgetUIHelper.prototype._setEnable = function (enable) {
    if (this.htmlElement) {
        if (enable)
            this.htmlElement.classList.remove(JW_DISABLED);
        else
            this.htmlElement.classList.add(JW_DISABLED);
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
    }
}
/**
 * Sets the widgets readOnly state.
 * @ignore
 * @param {boolean} readOnly - readOnly value
 */
jasonBaseWidgetUIHelper.prototype._setReadOnly = function (readOnly) {
    if (this.htmlElement) {
        if (readOnly)
            this.htmlElement.classList.remove(JW_READONLY);
        else
            this.htmlElement.classList.add(JW_READONLY);
    }
}
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
 * @description Object representation of a datasource sorting configuration. A datasource supports have multiple sorting configurations.
 * @property {string} name - field name for the sort
 * @property {boolean} reverse - false = asc , true = desc
 * @property {function} primer - if set, it will be used to convert the field value to another data type, suitable for comparison.
 */
function jasonDataSourceSorting(name,reverse,primer) {
    this.name = name;
    this.reverse = reverse;
    this.primer = primer;
}

/**
 * @constructor
 * @description Data wrapper that provides search,filter and sorting capabilities over a data array.
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
 * Extending data properties if underlying data is an object array
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
 * Default sort comparison function
 * @param {any} value1 - value to compare.
 * @param {any} value2 - value to compare against.
 * @returns {boolean} 
 */
jasonDataSource.prototype.defaultSortComparison = function (value1, value2) {
    if (value1 == value2) return 0;
    return value1 < value2 ? -1 : 1;
}
/**
 * Default sort comparison function with data type conversion. It will use the {@link jasonDataSource#defaultSortComparison} to perform the actual comparison
 * but will convert parameter using a data conversion function if provided. Can also dictate the direction of the comparison, asc or desc.
 * 
 * @param {function} primer - function that will convert passed in value to a data type.
 * @param {boolean} [reverse=false] - if true it will sort descending.
 * @returns {function} Returns function that does sort comparison and if applicable data type conversion.
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
 * @property {Data.jasonDataSourceSorting} sortingConfiguration - sorting to add
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
 * @param {string} fieldName - Fieldname to remove sorting for.
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
 * Clears all sorting
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
 * @param {array} fieldsToSort - Elements can be field names or objects defining sorting direction and/or data type converting function. See {@link jasonDataSource#dataTypeSortComparison}
 * @param {any[]} [data=[]] - If not provided the underlying Data array will be used.
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
 * Filter values for a specific field. Retuns an array containing the data matching the filter parameters
 * @param {array} filterValues - Array of objects containing value to filter plus logical connection operators and evaluator operators.
 * @param {string} filterField - Fieldname to filter.
 * @param {any[]} [data=[]] - If not provided the underlying Data array will be used.
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
                case "=": { filterEvaluatorClause = this.valuesAreEqual; break; }
                case ">": { filterEvaluatorClause = this.valueIsGreaterThan; break; }
                case "<": { filterEvaluatorClause = this.valueIsLessThan; break; }
                case ">=": { filterEvaluatorClause = this.valueIsGreaterEqualThan; break; }
                case "<=": { filterEvaluatorClause = this.valueIsLessEqualThan; break; }
                case "!=": { filterEvaluatorClause = this.valueStartsWith; break; }
                case "startsWith": { filterEvaluatorClause = this.valueStartsWith; break; }
                case "endsWith": { filterEvaluatorClause = this.valueEndsWith; break; }
                case "contains": { filterEvaluatorClause = this.valueContains; break; }
            }
            filterValues[i].evaluator = filterEvaluatorClause;
        }
     }

        for (var i = 0; i <= dataToFilter.length - 1; i++) {
            var dataRow = dataToFilter[i];
            var fieldValue = dataRow[filterField];
            if(typeof fieldValue == "string")
                fieldValue = caseSensitive ? fieldValue : fieldValue.toLowerCase();
            var valueInFilter = false;
            for (var x = 0; x <= filterValues.length - 1; x++) {
                var filterValue = filterValues[x];
                var valueOfFilter = filterValue.value;
                if (typeof valueOfFilter == "string")
                    valueOfFilter = caseSensitive ? valueOfFilter : valueOfFilter.toLowerCase();
                var priorFilterValue = filterValues[x - 1];
                if (priorFilterValue && filterValue.evaluator) {
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
                if (valueInFilter)
                    resultData.push(dataRow);
           } 
        }
        this.currentDataView = [].concat(resultData);
        return this.currentDataView;
}
/**
 * Add a filter
 * @param {string} filterField - Field to filter.
 * @param {string} filterValues - Filter values.
 * @param {boolean} [filterNow=false] - If true, it will apply filter.
 * @returns {object[]|void}
 */
jasonDataSource.prototype.addFilter = function (filterField, filterValues, filterNow) {
    filterNow = filterNow == void 0 ? true : filterNow;
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
 * Removes filter.
 * @param {string} filterField - field to remove filtering for.
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
 * Clears all fitlers
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
 * @param {any[]} [data=[]] - If not provided the underlying Data array will be used.
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
 * @param {string} searchValue - Value to search.
 * @param {string[]} field - Fields to search on. 
 * @param {any[]} [data=[]] - If not provided the underlying Data array will be used.
 * @param {boolean} [caseSensitive=false] - When true, search will be case sensitive.
 * @returns {object[]}
 */
jasonDataSource.prototype.searchByField = function (searchValue, fields, data, caseSensitive) {
    if (!caseSensitive)
        caseSensitive = false;
    var dataToSearch = data ? data : [].concat(this.data);
    var resultData = [];
    searchValue = caseSensitive ? searchValue : searchValue.toLowerCase();
    for (var i = 0; i <= dataToSearch.length - 1; i++) {
        var dataRow = dataToSearch[i];
        if (typeof dataRow == "string") {
            var dataRowValue = caseSensitive ? dataRow : dataRow.toLowerCase();
            if (dataRowValue.indexOf(searchValue) >= 0)
                resultData.push(dataRow);
        } else {
            if (fields === void 0)
                jw.common.throwError(jw.errorTypes.referenceError, "Search fields are not defined");
            for (var x = 0; x <= fields.length - 1; x++) {
                if (typeof dataRow[fields[x]] === "string") {
                    var dataRowValue = caseSensitive ? dataRowValue : dataRow[fields[x]].toLowerCase();
                    if (dataRowValue.indexOf(searchValue) >= 0)
                        resultData.push(dataRow);
                }
            }
        }
    }
    this.currentDataView = [].concat(resultData);
    return this.currentDataView;
}
/**
 * Grouping data by field,creating a create a treeview of data
 * nested based on the grouping field.
 * if there is already a grouping an extra level will be added.
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
 * Groups data , based on the datasource's current grouping configuration.
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
 * Check for an existing grouping.
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
 * Returns a slice of the datasource's data, and applies any grouping if applicable.
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
 * @description Auxilary class, that manages events for the widgets.
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
     * Adds an event listener on an element
     * @param {object} element - HTMLElement. The element to set the event.
     * @param {string} eventName - Name of the event.
     * @param {function} listener - Listener function.
     * @param {boolean} stopPropagation - If false does not propagate the event. 
     */
    jasonEventManager.prototype.addEventListener = function (element, eventName, listener,useCurrentTarget) {
        var self = this;
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
            //if (eventName == MOUSE_ENTER_EVENT && !jasonWidgets.common.objectHasProperty(window,"onmouseenter")) {
            //    defaultEventListener = mouseEnterLeaveEventListener;
            //    defaultEventName = MOUSE_OVER_EVENT;
            //}

            //if (eventName == MOUSE_LEAVE_EVENT && !jasonWidgets.common.objectHasProperty(window, "onmouseleave")) {
            //    defaultEventListener = mouseEnterLeaveEventListener;
            //    defaultEventName = MOUSE_OUT_EVENT;
            //}
            
            element.addEventListener(defaultEventName, defaultEventListener);
        }
        var evntListener = {
            element: element,
            eventName: eventName,
            listener: listener
        };

        this.eventListeners.push(evntListener);
        element._jasonWidgetsEventListeners_.push(evntListener);
    }
    /**
     * Triggers an event.
     * @param {string} eventName - Name of the event.
     * @param {object} sender - Event sender. The sender is always the widget that triggered the event.
     */
    jasonEventManager.prototype.triggerEvent = function (eventName, sender, event) {
        var eventListener = this.eventListeners.filter(function (evntListener) {
            return (evntListener.eventName == eventName && evntListener.element == sender)
        })[0];
        if (eventListener) {
            if (typeof eventListener.listener == "function")
                eventListener.listener(event, sender);
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
}

var jwDocumentEventManager = { eventListeners: [], _internalListeners_: [] };
var jwWindowEventManager = { eventListeners: [], _internalListeners_: [] };

jwDocumentEventManager.addDocumentEventListener = function (eventName, listener) {
    var documentEventListenerExists = jwDocumentEventManager._internalListeners_.filter(function (eventListener) {
        return eventListener.event == eventName;
    })[0];
    if (!documentEventListenerExists) {
        jwDocumentEventManager.eventListeners.push({ event: eventName, listener: listener });
        document.addEventListener(eventName, function (documentEvent) {
            for (var i = 0; i <= jwDocumentEventManager.eventListeners.length - 1; i++) {
                if (jwDocumentEventManager.eventListeners[i].event == documentEvent.type) {
                    jwDocumentEventManager.eventListeners[i].listener(documentEvent);
                }
            }
        });
    }
}

jwDocumentEventManager.removeDocumentEventListener = function (eventName, listener) {
    var documentEventListenerExists = jwDocumentEventManager._internalListeners_.filter(function (eventListener) {
        return eventListener.event == eventName;
    })[0];
    if (documentEventListenerExists) {
        var indexToRemove = -1;
        for (var i = 0; i <= jwDocumentEventManager.eventListeners.length - 1; i++) {
            if (documentEventListenerExists.event == eventName && documentEventListenerExists.listener == listener) {
                indexToRemove = i;
                break;
            }
        }
        if (indexToRemove >= 0) {
            jwDocumentEventManager.eventListeners.splice(i, 1);
        }
    }
}

jwWindowEventManager.addWindowEventListener = function (eventName, listener) {
    var windowEventListenerExists = jwWindowEventManager._internalListeners_.filter(function (eventListener) {
        return eventListener.event == eventName;
    })[0];
    if (!windowEventListenerExists) {
        jwWindowEventManager.eventListeners.push({ event: eventName, listener: listener });
        window.addEventListener(eventName, function (windowEvent) {
            for (var i = 0; i <= jwWindowEventManager.eventListeners.length - 1; i++) {
                if (jwWindowEventManager.eventListeners[i].event == windowEvent.type) {
                    jwWindowEventManager.eventListeners[i].listener(windowEvent);
                }
            }
        });
    }
}

jwWindowEventManager.removeDocumentEventListener = function (eventName, listener) {
    var windowEventListenerExists = jwWindowEventManager._internalListeners_.filter(function (eventListener) {
        return eventListener.event == eventName;
    })[0];
    if (windowEventListenerExists) {
        var indexToRemove = -1;
        for (var i = 0; i <= jwWindowEventManager.eventListeners.length - 1; i++) {
            if (windowEventListenerExists.event == eventName && windowEventListenerExists.listener == listener) {
                indexToRemove = i;
                break;
            }
        }
        if (indexToRemove >= 0) {
            jwWindowEventManager.eventListeners.splice(i, 1);
        }
    }
}


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
 * To register a lagnuage or culture, create a js file in which a descendant of {@link Localization.jasonWidgetLanguage} is created and
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
       
        var dateString = newDate.toLocaleDateString();
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
 * @property {string} key - Unique language key. For example en-US.
 * @property {object} search - Search localization.
 * @property {object} search.searchPlaceHolder - Text for the placeholder attribute of <input placeholder='Placeholder text!'> elements.
 * @property {object} filter - Filter localization.
 * @property {string} filter.filterValueIsEqual - 
 * @property {string} filter.filterValueIsNotEqual -
 * @property {string} filter.filterValueStartsWith -
 * @property {string} filter.filterValueEndsWith - 
 * @property {string} filter.filterValueContains - 
 * @property {string} filter.filterValueGreaterThan - 
 * @property {string} filter.filterValueGreaterThan - 
 * @property {string} filter.filterValueGreaterEqualTo - 
 * @property {string} filter.filterValueLessThan - 
 * @property {string} filter.filterValueLessEqualTo - 
 * @property {string} filter.filterHeaderCaption - Filter header caption.
 * @property {object} data - Data localization.
 * @property {string} data.noData - Text when no data are available.
 * @property {object} grid - Grid localization.
 * @property {object} grid.paging - Grid paging localization.
 * @property {string} grid.firstPageButton - Pager's first button text.
 * @property {string} grid.priorPageButton - Pager's prior button text..
 * @property {string} grid.nextPageButton - Pager's next button text..
 * @property {string} grid.lastPageButton - Pager's last button text..
 * @property {string} grid.pagerInputTooltip - Pager's input tooltip text..
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
 * For acceptable date/time formats go here {@link https://msdn.microsoft.com/en-us/library/8kb3ddd4%28v=vs.110%29.aspx}
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
 * @property {string} key - Unique language key. For example en-US.
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
function jasonDragResize(htmlElement, options) {
    this._defaultOptions = {
        allowDrag: true,
        allowResize: { top: true, left: true,bottom:true,right:true },
        minHeight: 60,
        minWidth: 40,
        dependantElements: [],
        onMoveStart: null,
        onMoveEnd: null,
        onResizeEnd:null,
        ghostPanelCSS: null,
        ghostPanelContents:null
    };

    jasonBaseWidget.call(this, "jasonGrid", htmlElement, options, null);

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
        if (self.options.allowDrag) {
            return self.left > 0 && self.left < self.boundingClientRect.width &&
                self.top > 0 && self.top < self.boundingClientRect.height;
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
                //self.htmlElement.style.width = Math.max(self.left, self.options.minWidth);
                for (var i = 0; i <= self.options.dependantElements.length - 1; i++) {
                    self.options.dependantElements[i].style.width = Math.max(self.left, self.options.minWidth) + "px";
                }
            }


            if (self.clickActionInfo.onBottomEdge && self.options.allowResize.bottom) {
                //self.htmlElement.style.height = Math.max(self.top, self.options.minHeight);
                for (var i = 0; i <= self.options.dependantElements.length - 1; i++) {
                    self.options.dependantElements[i].style.height = Math.max(self.top, self.options.minHeight) + "px";
                }
            }

            if (self.clickActionInfo.onLeftEdge && self.options.allowResize.left) {
                var currentWidth = Math.max(self.clickActionInfo.clientX - self.mouseMoveEvent.clientX + self.clickActionInfo.width, self.options.minWidth) + "px";
                if (currentWidth > self.options.minWidth) {
                    //self.htmlElement.style.width = currentWidth + "px";
                    //self.htmlElement.style.left = self.mouseMoveEvent.clientX + "px";
                    for (var i = 0; i <= self.options.dependantElements.length - 1; i++) {
                        self.options.dependantElements[i].style.width = currentWidth;
                    }
                }
            }

            if (self.clickActionInfo.onTopEdge && self.options.allowResize.top) {
                var currentHeight = Math.max(self.clickActionInfo.clientY - self.mouseMoveEvent.clientY + self.clickActionInfo.height, self.options.minHeight) + "px";
                if (currentHeight > self.options.minHeight) {
                    //self.htmlElement.style.height = currentHeight + "px";
                    //self.htmlElement.style.top = self.mouseMoveEvent.clientY + "px";
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
             if(!hide)
                 self.ghostPanel.style.opacity = opacity;
             if (hide)
                 self.hideGhostPanel();

            self.ghostPanel.style.display = "";
            self.ghostPanel.style.top = (self.mouseMoveEvent.clientY - self.clickActionInfo.top) + 'px';
            self.ghostPanel.style.left = (self.mouseMoveEvent.clientX - self.clickActionInfo.left) + 'px';
            for (var i = 0; i <= self.options.dependantElements.length - 1; i++) {
                self.options.dependantElements[i].style.top = (self.mouseMoveEvent.clientY - self.clickActionInfo.top) + 'px';
                self.options.dependantElements[i].style.left = (self.mouseMoveEvent.clientX - self.clickActionInfo.left) + 'px';
            }

            return;
        }

        var cursor = "default";
        if (self.canMove())
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
        self.thElement.removeEventListener(MOUSE_DOWN_EVENT, this.onMouseDown);
        self.thElement.removeEventListener(TOUCH_START_EVENT, this.onTouchStart);

        jwDocumentEventManager.removeDocumentEventListener(MOUSE_MOVE_EVENT, this.onMouseMove);
        jwDocumentEventManager.removeDocumentEventListener(MOUSE_UP_EVENT, this.onMouseUp);

        jwDocumentEventManager.removeDocumentEventListener(TOUCH_MOVE_EVENT, this.onTouchMove);
        jwDocumentEventManager.removeDocumentEventListener(TOUCH_END_EVENT, this.onTouchEnd);
    }

    this.htmlElement.addEventListener(MOUSE_DOWN_EVENT, this.onMouseDown);
    this.htmlElement.addEventListener(TOUCH_START_EVENT, this.onTouchStart);

    jwDocumentEventManager.addDocumentEventListener(MOUSE_MOVE_EVENT, this.onMouseMove);
    jwDocumentEventManager.addDocumentEventListener(MOUSE_UP_EVENT, this.onMouseUp);

    jwDocumentEventManager.addDocumentEventListener(TOUCH_MOVE_EVENT, this.onTouchMove);
    jwDocumentEventManager.addDocumentEventListener(TOUCH_END_EVENT, this.onTouchEnd);

    this.animateMove();

}
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
}


jasonWidgets.localizationManager.cultures["IT"] = new jasonWidgetCultureES();
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
}


jasonWidgets.localizationManager.cultures["IT"] = new jasonWidgetCultureIT();
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonCombobox.prototype = Object.create(jasonBaseWidget.prototype);
jasonCombobox.prototype.constructor = jasonCombobox;
/**
 * @namespace Dropdowns
 * @description 
 * 
 * 
 * 
 * Keyboard navigation: (applicable to all drop down widgets).
 * 
 * Down arrow : If focus is on the input element, then it drops down the list and sets focus to the first item.
 *              If focus is on an item on the list, then it moves to the next item on the list.
 * 
 * Up arrow   : If focus is on an item on the list, then it moves to the previous item on the list.
 *              If focus is on the first item on the list, it moves to the input element.
 * 
 * Tab        : If focus is on an item on the list, then it moves to the next item on the list.
 * Shift+Tab  : If focus is on an item on the list, then it moves to the previous item on the list.
 * 
 * Enter      : If focus is on an item on the list, then it selects the item and closes the list.
 */
/**
 * @class
 * @memberOf Dropdowns
 * @name jasonComboboxOptions
 * @description Configuration for the combobox widget.
 * @augments Common.jasonWidgetOptions
 * @property {any[]}    [data=[]]                - Data for the combobox to display.
 * @property {string}   [keyFieldName=""]        - The name of a key field ,if the data is a list of objects.
 * @property {string}   [placeholder=""]         - Input placehoder string.
 * @property {string}   [inputMode=verbatim]     - InputMode.
 * @property {boolean}  [readOnly=false]            - If true does not allow typing.
 * @property {boolean}  [autoFilter=false]          - If true automatically filters results while typing.
 * @property {boolean}  [caseSentiveSearch=false]   - If true search is case sensitive.
 * @property {string}   [displayFormatString=""] - String with format parameters.For example "{0},{1}". Each format parameter will be replaced by the field value of fields defined in DisplayFields.
 * @property {string[]} [displayFields=[]]       - Array that lists the field values to be displayed on the input control.
 */

/**
 * @class
 * @name jasonComboboxEvents
 * @memberOf Dropdowns
 * @description List of jasonCombobox events
 * @property {function} onSelectItem - function(selectedItem : any,selectedItemIndex:number)
 * @property {function} onRollUp - function()
 * @property {function} onRollDown - function()
 */

var
    EVENT_ON_ROLL_DOWN = "onRollDown",
    EVENT_ON_ROLL_UP = "onRollUp",
    EVENT_ON_SELECT_ITEM = "onSelectItem";
/**
 * @constructor
 * @memberOf Dropdowns
 * @augments Common.jasonBaseWidget
 * @description Combobox widget. If you want to make it behave like a drop down list, just set the readOnly property to true.
 * @param {HTMLElement} htmlElement - DOM element that will contain the combobox.
 * @param {Dropdowns.jasonComboboxOptions} options - Combobox control options.
 */
function jasonCombobox(htmlElement, options) {
    if (htmlElement.tagName != "DIV")
        throw new Error("Combobox container element must be a div");
    this.defaultOptions = {
        data: null,
        keyFieldName: undefined,
        displayFields: undefined,
        displayFormatString: undefined,
        placeholder: undefined,
        inputMode: "verbatim",
        readOnly: false,
        caseSentiveSearch: false,
        autoFilter:false
    };

    jasonBaseWidget.call(this, "jasonCombobox", htmlElement, options, jasonComboboxUIHelper);
    this.dataSource = new jasonDataSource({ data: this.options.data,onChange:this.onDataSourceChange });
    this.selectedItem = null;
    this.selectedItemIndex = -1;
    this.filteredData = [];
    this.search = this.search.bind(this);
    this.onDataSourceChange = this.onDataSourceChange.bind(this);
    this.options.localization = jasonWidgets.localizationManager.currentLanguage ? jasonWidgets.localizationManager.currentLanguage : this.options.localization;
    this.readOnly = this.options.readOnly;
    this.dataChanged = true;
    this.ui.renderUI();
 }


/**
 * @ignore
 */
jasonCombobox.prototype.onDataSourceChange = function () {
    this.dataChanged = true;
}
/**
 * Clears current selection.
 */
jasonCombobox.prototype.clearSelection = function () {
    this.ui.clearSelection();
    this.selectedItem = null;
    this.selectedItemIndex = -1;
}
/**
 * Check if the combobox has a selection.
 * @returns {boolean}
 */
jasonCombobox.prototype.hasSelection = function () {
    return this.selectedItem != void 0 && this.selectedItemIndex >= 0;
}
/**
 * Selects an item
 * @param {number} itemIndex - Item index to select.
 */
jasonCombobox.prototype.selectItem = function (itemIndex) {
    this.selectedItem = this.filteredData.length > 0 ? this.filteredData.filter(function (dataItem) { return dataItem._jwRowId == itemIndex; })[0] : this.dataSource.data[itemIndex];
    this.selectedItemIndex = this.selectedItem._jwRowId;
    this.ui.selectItem(itemIndex);
    this.triggerEvent(EVENT_ON_SELECT_ITEM, {selectedItem : this.selectedItem, selectedItem :this.selectedItemIndex});
}


/**
 * Searches in the data using as criteria any value the input control has.
 * @ignore
 */
jasonCombobox.prototype.search = function () {
    this.filteredData = this.selectedItem ? [this.selectedItem] : this.dataSource.searchByField(this.ui.comboboxInput.value, this.options.displayFields, null, this.options.caseSentiveSearch);
    if (this.filteredData.length == 0) {
        var nodataItem = { _NoData_: jasonWidgets.common.formatString(this.options.localization.combobox.notFound, [this.ui.comboboxInput.value]) };
        
        this.filteredData.push(nodataItem);
    }
    this.ui.renderDropdownListItems(this.filteredData);
}
var
    COMBOBOX_CLASS = "jw-combobox",
    COMBOBOX_DROP_DOWN_LIST_CLASS = "drop-down-list",
    COMBOBOX_DROP_DOWN_LIST_ITEM_CLASS = "drop-down-list-item";
    COMBOBOX_LIST_STATE_ATTR = "jw-drop-down-list-state";
    COMBOBOX_LIST_STATE_UP = "up";
    COMBOBOX_LIST_STATE_DOWN = "down";
    COMBOBOX_LIST_ITEM_SELECTED = "selected";


jasonComboboxUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonComboboxUIHelper.prototype.constructor = jasonComboboxUIHelper;
/**
 * @constructor
 * @ignore
 */
function jasonComboboxUIHelper(widget, htmlElement) {
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);
    this.dropDownListState = COMBOBOX_LIST_STATE_UP;
    this.showDropDownList = this.showDropDownList.bind(this);

    this.onComboboxKeyDown = this.onComboboxKeyDown.bind(this);
    this.onComboboxKeyUp = this.onComboboxKeyUp.bind(this);
    this.onComboboxButtonClick = this.onComboboxButtonClick.bind(this);
    this.onComboboxInputClick = this.onComboboxInputClick.bind(this);
    this.onComboboxItemClick = this.onComboboxItemClick.bind(this);
    this.onComboboxInputChange = this.onComboboxInputChange.bind(this);

    /*if a click occurs outside the input or drop down list, hide the list.*/
    jwDocumentEventManager.addDocumentEventListener(CLICK_EVENT, this.monitorForDocumentClick.bind(this));
}
/**
 * Renders combobox HTML.
 */
jasonComboboxUIHelper.prototype.renderUI = function () {
    var self = this;
    if (!this.htmlElement.classList.contains(COMBOBOX_CLASS)) {
        this.htmlElement.classList.add(COMBOBOX_CLASS);

        this.comboboxInput = jw.htmlFactory.createJWTextInput(this.widget.options.inputMode, this.widget.options.placeholder,this.widget.readOnly);
        this.comboboxButton = jw.htmlFactory.createJWButton(null, JW_ICON_CHEVRON_DOWN);

        this.htmlElement.appendChild(this.comboboxInput);
        this.htmlElement.appendChild(this.comboboxButton);
        this.initializeEvents();
    }
}

/**
 * Toggles dropdown list.
 */
jasonComboboxUIHelper.prototype.toggleDropdownList = function () {
    if (this.dropDownListState == COMBOBOX_LIST_STATE_UP) {
        this.comboboxButton.setAttribute(COMBOBOX_LIST_STATE_ATTR, COMBOBOX_LIST_STATE_DOWN);
        this.showDropDownList();
        this.scrollItemIntoView();
    } else {
        this.hideDropDownList(true);
    }
}

/**
 * Scroll into view selected item.
 */
jasonComboboxUIHelper.prototype.scrollSelectedIntoView = function () {
    if (this.dropDownListState == COMBOBOX_LIST_STATE_DOWN) {
        if (this.widget.selectedItemIndex >= 0) {
            var listItemElement = jw.common.getElementsByAttribute(this.dropDownList, DATA_ITEM_INDEX_ATTR, this.widget.selectedItemIndex)[0];
            if (listItemElement != void 0) {
                this.dropDownListContainer.scrollTop = listItemElement.offsetTop;
                listItemElement.focus();
            }
        }
    }
}
/**
 * Scroll into view the first item.
 */
jasonComboboxUIHelper.prototype.scrollFirstItemIntoView = function () {
    if (this.dropDownListState == COMBOBOX_LIST_STATE_DOWN) {
        //this.dropDownList.children[0].classList.add(COMBOBOX_LIST_ITEM_SELECTED);
        this.dropDownListContainer.scrollTop = this.dropDownList.children[0].offsetTop;
        this.dropDownList.children[0].focus();
    }
}
/**
 * Scroll into view selected item.
 */
jasonComboboxUIHelper.prototype.scrollItemIntoView = function () {
    if (this.widget.hasSelection() == true)
        this.scrollSelectedIntoView();
    else
        this.scrollFirstItemIntoView();
}
/**
 * Shows the dropdown list.
 */
jasonComboboxUIHelper.prototype.showDropDownList = function () {
    if (this.dropDownListState != COMBOBOX_LIST_STATE_DOWN) {
        this.renderDropdownListContainer();
        this.dropDownListState = COMBOBOX_LIST_STATE_DOWN;
        this.comboboxButton.setAttribute(COMBOBOX_LIST_STATE_ATTR, this.dropDownListState);
        this.widget.triggerEvent(EVENT_ON_ROLL_DOWN);
    }
}
/**
 * Hides the drop down list.
 */
jasonComboboxUIHelper.prototype.hideDropDownList = function (focus) {
    if (this.dropDownListState != COMBOBOX_LIST_STATE_UP) {
        if (this.dropDownListContainer)
            this.dropDownListContainer.style.display = "none";
        this.dropDownListState = COMBOBOX_LIST_STATE_UP;
        this.comboboxButton.setAttribute(COMBOBOX_LIST_STATE_ATTR, this.dropDownListState);
        if (focus == true && !this.widget.readOnly)
            this.comboboxInput.focus();
        this.widget.triggerEvent(EVENT_ON_ROLL_UP);
    }
}

/**
 * Initializes event listeners.
 */
jasonComboboxUIHelper.prototype.initializeEvents = function () {
    var self = this;
    /*toggling visibility of the list*/
    this.eventManager.addEventListener(this.comboboxButton, CLICK_EVENT, this.onComboboxButtonClick, true);
    this.eventManager.addEventListener(this.comboboxButton, KEY_DOWN_EVENT, this.onComboboxKeyDown, true);

    /*we do not want when user clicks in the input control to hide the list*/
    this.eventManager.addEventListener(this.comboboxInput, CLICK_EVENT, this.onComboboxInputClick);

    /*when user starts typing start search in the underlying datasource.*/
    /**
     *  <= IE11 versions have a bug where the input event fires on focus.
     * https://connect.microsoft.com/IE/feedback/details/810538/ie-11-fires-input-event-on-focus
     * Microsoft states that they have fixed on the new MS Edge.
     */
    //this.comboboxInput.addEventListener(INPUT_EVENT, this.onComboboxInputChange);

    this.comboboxInput.addEventListener(KEY_DOWN_EVENT, this.onComboboxKeyDown);
    this.comboboxInput.addEventListener(KEY_UP_EVENT, this.onComboboxKeyUp);
}
/**
 * Sets the item index (selected item).
 * @param {number} itemIndex - Combobox item index.
 */
jasonComboboxUIHelper.prototype.selectItem = function (itemIndex) {
    var self = this;
    var inputValue = "";
    if (this.widget.options.displayFields) {
        var fieldValues = [];
        this.widget.options.displayFields.forEach(function (displayField) {
            fieldValues.push(self.widget.selectedItem[displayField]);
        });
        inputValue = jasonWidgets.common.formatString(this.widget.options.displayFormatString, fieldValues);
    }
    this.comboboxInput.value = inputValue;
}

/**
 * Renders dropdown list HTML.
 */
jasonComboboxUIHelper.prototype.renderDropdownListContainer = function () {
    var self = this;
    if (this.widget.options.data) {
        if (!this.dropDownListContainer) {
            this.dropDownListContainer = this.createElement("div");
            this.dropDownList = this.createElement("ul");
            this.dropDownListContainer.appendChild(this.dropDownList);
            this.dropDownListContainer.classList.add(COMBOBOX_DROP_DOWN_LIST_CLASS);
            this.dropDownListContainer.classList.add(COMBOBOX_CLASS);
            this.dropDownListContainer.style.display = "none";
            document.body.appendChild(this.dropDownListContainer);
        }
        if (this.widget.dataChanged)
            this.renderDropdownListItems();
        this.dropDownListContainer.style.position = "absolute";
        var bRect = jw.common.getOffsetCoordinates(this.htmlElement);
        this.hasScrollBars = this.dropDownList.scrollHeight > this.dropDownListContainer.clientHeight;
        if (!this.scrollBarWidth)
            this.scrollBarWidth = jasonWidgets.common.scrollBarWidth();

        this.dropDownListContainer.style.width = ((this.comboboxInput.offsetWidth + this.comboboxButton.offsetWidth)) + "px";
        this.dropDownListContainer.style.top = bRect.top + this.htmlElement.offsetHeight + "px";
        this.dropDownListContainer.style.left = bRect.left + "px";
        this.dropDownListContainer.style.display = "";
    }
}

/**
 * Renders dropdown list contents HTML.
 */
jasonComboboxUIHelper.prototype.renderDropdownListItems = function (data) {
    var self = this;
    var dataToRender = data ? data : this.widget.dataSource.data;
    jw.common.removeChildren(this.dropDownList);
    //this.dropDownList.innerHTML = "";
    var nextTabIndex = jasonWidgets.common.getNextTabIndex();
    for (var i = 0; i <= dataToRender.length - 1; i++) {
        var listItem = this.createElement("li");
        var dataItem = dataToRender[i];
        var fieldValues = [];
        if (this.widget.options.displayFields) {
            this.widget.options.displayFields.forEach(function (displayField) {
                fieldValues.push(dataToRender[i][displayField]);
            });
        }
        var displayText = dataItem._NoData_;
        if (!displayText)
            displayText = typeof dataItem == "string" ? dataItem : jasonWidgets.common.formatString(this.widget.options.displayFormatString, fieldValues);
        dataItem._jw_Searchable_value = fieldValues.join(" ");
        //var listItemText = this.createElement("span");
        //listItemText.appendChild(this.createTextNode(displayText))
        listItem.appendChild(this.createTextNode(displayText));
        listItem.className = COMBOBOX_DROP_DOWN_LIST_ITEM_CLASS;
        listItem.setAttribute(DATA_ITEM_INDEX_ATTR, dataItem._jwRowId);
        listItem.setAttribute(ITEM_INDEX_ATTR, i);
        listItem.setAttribute(TABINDEX_ATTR, nextTabIndex);
        jasonWidgets.common.setData(listItem, "jComboboxDataItem", dataItem);
        this.eventManager.addEventListener(listItem, CLICK_EVENT, this.onComboboxItemClick);
        this.eventManager.addEventListener(listItem, KEY_DOWN_EVENT, this.onComboboxKeyDown);
        //listItem.addEventListener(CLICK_EVENT, this.eventsHelper.cmbListItemClick); EVNT
        //listItem.addEventListener(KEY_DOWN_EVENT, this.eventsHelper.cmbListItemKeyDown);
        nextTabIndex++;
        this.dropDownList.appendChild(listItem);
    }
    this.widget.dataChanged = false;
}

/**
 * Iterates through the <li> items of the dropdown list, to find an item based on its text 
 */
jasonComboboxUIHelper.prototype.findItem = function (itemText) {
    for (var i = 0; i = this.dropDownList.children.length - 1; i++) {
        var childItemText = this.dropDownList.children[i].innerText || this.dropDownList.children[i].textContent;
        if (childItemText == itemText)
            return this.dropDownList.children[i];
    }
    return null;
}

/**
 * Monitors for mouse down events on the document level, in order to hide the dropdown list.
 */
jasonComboboxUIHelper.prototype.monitorForDocumentClick = function (mouseDownEvent) {
    if (this.dropDownList && this.dropDownListState == "down") {
        if (jw.common.contains(this.htmlElement, mouseDownEvent.target))
            return;
        if (jw.common.isMouseEventOutOfContainer(this.dropDownListContainer, mouseDownEvent))
            this.hideDropDownList();
    }
}
/**
 * Combobox button click event listener.
 */
jasonComboboxUIHelper.prototype.onComboboxButtonClick = function (clickEvent) {
    this.dropDownListState = this.comboboxButton.getAttribute(COMBOBOX_LIST_STATE_ATTR);
    this.dropDownListState = this.dropDownListState ? this.dropDownListState : COMBOBOX_LIST_STATE_UP;
    this.toggleDropdownList();
}
/**
 * Combobox input click event listener.
 */
jasonComboboxUIHelper.prototype.onComboboxInputClick = function (clickEvent) {
    if (this.widget.readOnly == true) {
        this.toggleDropdownList();
    }
}
/**
 * Combobox list item click event listener.
 */
jasonComboboxUIHelper.prototype.onComboboxItemClick = function (clickEvent) {
    this.comboboxInput.value = clickEvent.target.textContent || clickEvent.target.innerText;
    this.clearSelection();
    this.widget.selectedItem = jasonWidgets.common.getData(clickEvent.target, "jComboboxDataItem");
    this.widget.selectedItemIndex = parseInt(clickEvent.target.getAttribute(DATA_ITEM_INDEX_ATTR));
    this.hideDropDownList(true);
    clickEvent.stopPropagation();
}
/**
 * Keydown event listener.
 */
jasonComboboxUIHelper.prototype.onComboboxKeyDown = function (keyDownEvent) {
    var keyCode = keyDownEvent.which || keyDownEvent.keyCode;
    switch (keyCode) {
        case 9: {//tab key
            if (keyDownEvent.target.tagName == "LI") {
                this.setFocusToListItem(keyDownEvent.target, keyDownEvent.shiftKey ? COMBOBOX_LIST_STATE_UP : COMBOBOX_LIST_STATE_DOWN);
                if (keyDownEvent.shiftKey)
                    keyDownEvent.preventDefault();
            }
            else
                this.hideDropDownList();
            break;
        }
        case 13: {//enter key
            if (keyDownEvent.target.tagName == "LI") {
                var liItemIndex = parseInt(keyDownEvent.target.getAttribute(DATA_ITEM_INDEX_ATTR));
                this.widget.selectItem(liItemIndex);
                this.hideDropDownList(true);
                this.comboboxInput.focus();
            } else {

            }
            break;
        }
        case 27: {//when ESC is clicked hide the list.
            this.hideDropDownList();
            break;
        }
        case 38: {//Keyup
            if (keyDownEvent.target.tagName == "LI") {
                this.setFocusToListItem(keyDownEvent.target, COMBOBOX_LIST_STATE_UP);
            }
            keyDownEvent.preventDefault();
            break;
        }
        case 40: {//KeyDown
            if (keyDownEvent.target.tagName == "LI") {
                this.setFocusToListItem(keyDownEvent.target, COMBOBOX_LIST_STATE_DOWN);
            } else {
                this.showDropDownList();
                this.scrollItemIntoView();
            }
            keyDownEvent.preventDefault();
            break;
        }
    }
    keyDownEvent.stopPropagation();
}
/**
 * KeyUp event listener.
 */
jasonComboboxUIHelper.prototype.onComboboxKeyUp = function (keyUpEvent) {
    var keyCode = keyUpEvent.which || keyUpEvent.keyCode;
    var canShowDropDown = false;
    switch (keyCode) {
        case 8:
        case 46: {
            canShowDropDown = true;
        }
    }
    if (keyCode > 46 || canShowDropDown) {
        this.widget.clearSelection();
        this.showDropDownList();
        if (this.options.autoFilter) {
            this.widget.search();
        }

    }
    keyUpEvent.stopPropagation();
}
/**
 * Combobox input change event listener.
 */
jasonComboboxUIHelper.prototype.onComboboxInputChange = function (inputChangeEvent) {
    this.widget.clearSelection();
    inputChangeEvent.stopPropagation();
}
/**
 * Sets focus to a list item.
 */
jasonComboboxUIHelper.prototype.setFocusToListItem = function (listItem,direction) {
    var liItemIndex = parseInt(listItem.getAttribute(ITEM_INDEX_ATTR));
    if (direction == "up") {
        if ((liItemIndex - 1) <= 0)
            this.comboboxInput.focus();
        else
            this.dropDownList.children[liItemIndex - 1].focus();
    } else {
        if (this.dropDownList.children.length != liItemIndex + 1) {
            this.dropDownList.children[liItemIndex + 1].focus();
        }
    }
}


/**
 * Clears the currently selected item.
 */
jasonComboboxUIHelper.prototype.clearSelection = function () {
    var listItemElement = jw.common.getElementsByAttribute(this.dropDownList, DATA_ITEM_INDEX_ATTR, this.widget.selectedItemIndex)[0];
    if (listItemElement != void 0) {
        listItemElement.classList.remove(COMBOBOX_LIST_ITEM_SELECTED);
    }
}
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonMenu.prototype = Object.create(jasonBaseWidget.prototype);
jasonMenu.prototype.constructor = jasonMenu;

var
     JW_EVENT_ON_MENU_SHOWN = "onMenuShown",
     JW_EVENT_ON_MENU_HIDDEN = "onMenuHidden",
     JW_EVENT_ON_MENU_ITEM_CLICKED = "onItemClicked",
     JW_EVENT_ON_MENU_CHECKBOX_CLICKED = "onCheckboxClicked",
     JW_EVENT_ON_MENU_ITEM_CONTENT_SHOW = "onItemContentShown";

/**
 * @namespace Menus
 * @description Menu and context menu classes.
 */

/**
 * @class
 * @name jasonMenuOptions
 * @description Configuration for the menu/context menu widget.
 * @memberOf Menus
 * @augments Common.jasonWidgetOptions
 * @property {string}   [orientation=horizontal]          - horizontal or vertical. Defines how the menu would be rendered
 * @property {object}   [menu=undefined]                 - JSON object representation of the menu. If defined the menu widget will use that to create the HTML menu structure.
 * @property {object}   animation            - Animation configuration. 
 * @property {number}   [animation.speed=9]      - Numeric value to define animation speed. Range is 1-10.
 * @property {number}   [width=undefined]                - Sets the width of the menu.
 * @property {number}   [height=undefined]                - Sets the height of the menu. 
 * @property {number}   [hideDelay=undefined]            - If defined it will give the user a grace period before it hides the menu.If the user mouse's over the menu container the menu will not be hidden.
 * @property {boolean}  [autoHide=false]             - If true the menu will be hidden if user clicks outside the menu.
 * @property {boolean}  [expandMenuOnHover=true] - If true expands menu item contents on hover.
 * @property {boolean}  [invokable=false] - If true menu is hidden and it will be invoked when the invokable element is clicked.
 */

/**
 * @class
 * @name jasonMenuEvents
 * @memberOf Menus
 * @description List of jasonMenu events
 * @property {function} onMenuShow - function onMenuShow(sender:jasonMenu)
 * @property {function} onMenuHide - function onMenuHide(sender:jasonMenu)
 * @property {function} onItemClick -function onItemClick(eventInfo:{ event, item, uiHelper })
 * @property {function} onCheckBoxClicked - function onCheckBoxClicked(eventInfo:{ event, item, checked })
 */


/**
 * @constructor
 * @memberOf Menus
 * @description Menu widget. Can populate items either from HTML or .json.
 * @augments Common.jasonBaseWidget
 * @param {HTMLElement} htmlElement - DOM element that the menu will be bound to.
 * @param {Menus.jasonMenuOptions} options - jasonMenu options.
 */
function jasonMenu(htmlElement, options, uiHelper) {
    this.items = [];
    /*Default menu options*/
    this.defaultOptions = { orientation: 'Vertical', animation: { speed: 9 }, expandMenuOnHover: true, invokable: false };
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
 * @property {string} title - Menu item title(tooltip).
 * @property {boolean} enabled - Gets/Sets enabled state for the item.
 * @property {array} items - Item's subitems.
 * @property {jasonMenuItem}  parent - Item's parent menu item.
 * @property {HTMLElement} element - The li elmement of the item.
 * @property {HTMLElement} content - A HTMLElement that would be the content of the item.
 * @property {number} level - Item's nest level. Root items start with zero.
 * @property {string} name - Item's name.
 * @property {boolean} hasCheckbox - If true, a checkbox input element is rendered.
 * @property {boolean} checked - Gets/Sets the checked state of the item, if it has a checkbox.
 * @property {boolean} clickable - If true, item accepts click events.
 * @property {HTMLElement} checkboxElement - The input element of the item,if it has a checkbox.
 * @property {string} icon - Icon css class for the item.
 * @property {boolean} isDivider - If true the item is a special menu item, a menu divider.
 */
function jasonMenuItem(htmlElement, options, uiHelper) {
    jasonBaseWidget.call(this, "jasonMenuItem", htmlElement, options, uiHelper);
    this.caption = '';
    this.title = '';
    this.enabled = true;
    this.items = [];
    this.parent = null;
    this.element = htmlElement;
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
    //var subMenuItemsUL = this.menuUI.createElement("UL");
    

    var menuItemsContainer = this.menuUI.createElement("div");
    menuItemsContainer.classList.add(MENU_ITEMS_CONTAINER_CLASS);
    //menuItemsContainer.appendChild(subMenuItemsUL);
    menuItemsContainer.style.display = "none";
    //jasonWidgets.common.moveChildrenTo(menuElement, menuItemsContainer, null, jasonWidgets.common.inlineElements, [JW_MENU_ITEM_CAPTION]);
    //menuElement.appendChild(menuItemsContainer);
    //menuElement._jasonMenuItemsContainer = menuItemsContainer;
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
    menuItemCaptionContainer.classList.add(JW_MENU_ITEM_CAPTION);
    if (menuItem.isDivider) {
        menuItemCaptionContainer.appendChild(this.menuUI.createElement("hr"));
        liElement.classList.add(MENU_ITEM_DIVIDER);
        liElement.setAttribute(MENU_ITEM_NO_HIGHLIGHT_ATTR, "true");
    }else{
        var menuCaption = this.menuUI.createElement("div");
        menuCaption.classList.add(JW_MENU_ITEM_CAPTION);

        
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
        var iconContainer = this.menuUI.createElement("div");
        iconContainer.classList.add(JW_MENU_ITEM_ARROW);
        var iconElement = this.menuUI.createElement("i");
        var menuLevel = liElement.getAttribute(MENU_ITEM_LEVEL_ATTRIBUTE);
        iconElement.className = this.menuUI.options.orientation == "horizontal" && menuLevel == 0 ? JW_ICON_CHEVRON_DOWN : JW_ICON_CHEVRON_RIGHT;
        iconContainer.appendChild(iconElement);
        liElement._jasonMenuItemCaptionContainer.appendChild(iconContainer);
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
        iconContainer.classList.add(MENU_ICON);
        var iconElement = this.menuUI.createElement("i");
        iconElement.className = (iconClass);
        var menuLevel = liElement.getAttribute(MENU_ITEM_LEVEL_ATTRIBUTE);
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
    var result = new jasonMenuItem();
    var menuItemLevel = liElement.getAttribute(MENU_ITEM_LEVEL_ATTRIBUTE);
    if (menuItemLevel)
        result.level = parseInt(menuItemLevel);

    result.element = liElement;
    this.menuUI.eventManager.addEventListener(liElement, CLICK_EVENT, this.menuUI.onItemClick, true);
    this.menuUI.eventManager.addEventListener(liElement, TOUCH_START_EVENT, this.menuUI.onItemTouch, true);
    this.menuUI.eventManager.addEventListener(liElement, MOUSE_ENTER_EVENT, this.menuUI.onItemMouseEnter,true);
    this.menuUI.eventManager.addEventListener(liElement, MOUSE_LEAVE_EVENT, this.menuUI.onItemMouseLeave,true);
    jasonWidgets.common.setData(liElement, MENU_ITEM_DATA_KEY, result);
    return result;
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
                    jw.htmlFactory.convertToJWMenuItem(self.menuUI.options.orientation,subMenuItemElement);
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
        rootMenuElement.setAttribute(MENU_ITEM_LEVEL_ATTRIBUTE, 0);
        var rootMenuItem = this.createMenuItem(rootMenuElement);
        jw.htmlFactory.convertToJWMenuItem( this.menuUI.options.orientation == "horizontal" ? "vertical" : "horizontal", rootMenuElement);
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
            parentMenuItem.element.appendChild(subItemsContainer);
            parentMenuItem.element._jasonMenuItemsContainer = subItemsContainer;
        }
        var menuULToUse = subMenuItemsUL != void 0 ? subMenuItemsUL : menuUL;
        //iterating through the child items to create LI elements.
        for (var i = 0 ; i <= parentMenuItem.items.length - 1; i++) {
            var menuItem = parentMenuItem.items[i];
            if (!jw.common.isJWWidget(menuItem)) {
                var jwMenuItem = new jasonMenuItem(rootMenuElement, null, null);
                jwMenuItem.assign(menuItem);
                menuItem = jwMenuItem;
            }
            menuItem.parent = parentMenuItem;
            menuItem.level = parentMenuItem.level + 1;
            var menuElement = self.createMenuElementFromItem(menuItem);
            menuULToUse.appendChild(menuElement);
            parentMenuItem.items[i] = menuItem;
            if (menuItem.items.length > 0) {
                populateItems(menuItem, menuULToUse);
            }
        }
    }
    var menuUL = this.menuUI.ulMenuElement;
    //iterating through the root items of the UL element
    for (var i = 0; i <= jasonMenu.items.length - 1; i++) {
        var rootMenuItem = jasonMenu.items[i];
        if (!jw.common.isJWWidget(rootMenuItem)) {
            var jwMenuItem = new jasonMenuItem(rootMenuElement, null, null);
            jwMenuItem.assign(rootMenuItem);
            jwMenuItem.clickable = true;
            rootMenuItem = jwMenuItem;
        }
        var rootMenuElement = this.createMenuElementFromItem(rootMenuItem);
        rootMenuItem.level = 0;
        rootMenuElement.setAttribute(MENU_ITEM_LEVEL_ATTRIBUTE, rootMenuItem.level);
        menuUL.appendChild(rootMenuElement);

        jasonMenu.items[i] = rootMenuItem;
        populateItems(rootMenuItem, menuUL);
    }
    return menuUL;
}
/**
 * Creates menu UI element from menu item 
 * @param {object} menuItem - jasonMenuItem.
 */
jasonMenuWidgetJSONParser.prototype.createMenuElementFromItem = function (menuItem) {
    var self = this;
    //the newly created element.
    var menuItemElement;

    if (menuItem.content) {
        menuItemElement = this.menuUI.createElement("li");
        if (!menuItem.content.tagName) {
            var menuContent = this.menuUI.createElement("div");
            menuContent.innerHTML = menuItem.content;
            menuItemElement.appendChild(menuContent);
        } else {
            menuItemElement.appendChild(menuItem.content);
        }
        menuItemElement.classList.add(MENU_ITEM_CONTENT);
        menuItem.content.classList.add(MENU_ITEM_CONTENT_CLASS);
    } else {
        menuItemElement = jw.htmlFactory.createJWMenuItem(this.menuUI.options.orientation, menuItem);
        menuItem.element = menuItemElement;

        if (menuItem.isDivider) {
            menuItemElement.appendChild(this.menuUI.createElement("hr"));
            menuItemElement.classList.add(MENU_ITEM_DIVIDER);
            menuItemElement.setAttribute(MENU_ITEM_NO_HIGHLIGHT_ATTR, "true");
        }
        if (menuItem.hasCheckBox) {
            var checkBoxElement = jw.common.getElementsByAttribute(menuItemElement, "type", "checkbox")[0];
            if (checkBoxElement != void 0) {
                menuItem.checkBoxElement = checkBoxElement;
                this.menuUI.eventManager.addEventListener(checkBoxElement, CLICK_EVENT, this.menuUI.onCheckboxClick);
            }
        }
        this.menuUI.eventManager.addEventListener(menuItemElement, CLICK_EVENT, this.menuUI.onItemClick, true);
        this.menuUI.eventManager.addEventListener(menuItemElement, MOUSE_ENTER_EVENT, this.menuUI.onItemMouseEnter);
        this.menuUI.eventManager.addEventListener(menuItemElement, MOUSE_LEAVE_EVENT, this.menuUI.onItemMouseLeave);
    }
    jasonWidgets.common.setData(menuItemElement, MENU_ITEM_DATA_KEY, menuItem);
    return menuItemElement;
}
//#endregion
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonMenuUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonMenuUIHelper.prototype.constructor = jasonMenuUIHelper;

var
    /*CSS Classes*/
    MENU_CLASS = "jw-menu",
    MENU_HORIZONTAL = "horizontal",
    MENU_ITEM_CLASS = "jw-menu-item",
    MENU_ITEM_CLASS_ACTIVE = MENU_ITEM_CLASS + "-active",
    MENU_ITEMS_CONTAINER_CLASS = "jw-menu-items-container",
    MENU_ITEM_LEVEL_ATTRIBUTE = "data-jason-menu-item-level",
    MENU_CONTAINER_CLASS = "jw-menu-container",
    MENU_ITEM_CHECKBOX_CLASS = "jw-menu-item-checkbox",
    MENU_ITEM_CONTENT_CLASS = "jw-menu-item-content",
    MENU_ITEM_CONTENT = "menu-content";
    MENU_ITEM_DATA_KEY = "jasonMenuItem";
    MENU_ITEM_DIVIDER = "divider";
    MENU_ITEM_NO_HIGHLIGHT_ATTR = "no-highlight";
    //MENU_ITEM_WITH_ICON = "with-icon";
    //MENU_ITEM_WITH_CHECKBOX = "with-checkbox";
    //MENU_ITEM_WITH_SUB_ITEMS = "with-sub-items";

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
    this.menuContainer.classList.add(MENU_CONTAINER_CLASS);


    this.ulMenuElement.classList.add(MENU_CLASS);


    this.invokableElement = null;

    /*If there is an explicit width value then set it.*/
    if (this.widget.options.width)
        this.ulMenuElement.style.width = this.options.width + "px";

    if (this.widget.options.height)
        this.ulMenuElement.style.height = this.options.height + "px";

    /*Adding orientation CSS class*/
    if (this.widget.options.orientation.toLowerCase() == "horizontal")
        this.htmlElement.classList.add(MENU_HORIZONTAL);

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
    this.toggleCheckBox = this.toggleCheckBox.bind(this);
    var self = this;
    if (this.options.autoHide) {
        jwDocumentEventManager.addDocumentEventListener(MOUSE_DOWN_EVENT, function (mouseDownEvent) {
            if (self.menuContainer.style.display != "none") {
                var isOutOfContainer = jasonWidgets.common.isMouseEventOutOfContainerAndNotAChild(self.menuContainer, mouseDownEvent)
                if (isOutOfContainer && self.canHideMenu)
                    self.hideMenu();
            }
        });
    }

    jwDocumentEventManager.addDocumentEventListener(TOUCH_END_EVENT, function (touchEndEvent) {
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
        this.widget.triggerEvent(JW_EVENT_ON_MENU_SHOWN);
    }
}
/**
 * Hides the menu.
 */
jasonMenuUIHelper.prototype.hideMenu = function () {
    //hide all menu item content that possibly were visible.
    var menuItemContents = this.menuContainer.getElementsByClassName(MENU_ITEMS_CONTAINER_CLASS);
    for (var i = 0; i <= menuItemContents.length - 1 ; i++) {
        menuItemContents[i].style.display = "none";
    }
    //de-activate all active menu items.
    var menuItems = this.menuContainer.getElementsByClassName(MENU_ITEM_CLASS_ACTIVE);
    for (var i = 0; i <= menuItems.length - 1 ; i++) {
        menuItems[i].classList.remove(MENU_ITEM_CLASS_ACTIVE);
    }
    this.menuContainer.style.display = "none";
    this.widget.triggerEvent(JW_EVENT_ON_MENU_HIDDEN);
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
        var menuItemContent = ulElement.getElementsByClassName(MENU_ITEM_CONTENT_CLASS);
        if (menuItemContent.length > 0) {
            ulElement._jasonMenuWidgetWiderElementWidth = menuItemContent[0].offsetWidth;
        }
        for (var i = 0; i <= ulElement.children.length - 1; i++) {
            //var menuCaptionContainer = ulElement.children[i].getElementsByClassName(MENU_ITEM_CONTAINER)[0];
            var menuCaptionContainer = ulElement.children[i].getElementsByClassName(JW_MENU_ITEM_CAPTION)[0];
            var menuCaption = null;
            var iconWidth = ulElement.children[i].getElementsByClassName(JW_MENU_ITEM_ICON)[0];
            var arrowWidth = ulElement.children[i].getElementsByClassName(JW_MENU_ITEM_ARROW)[0];
            var checkboxWidth = ulElement.children[i].getElementsByClassName(JW_MENU_ITEM_CHECKBOX)[0];
            iconWidth = iconWidth ? iconWidth.offsetWidth : 0;
            arrowWidth = arrowWidth ? arrowWidth.offsetWidth : 0;
            checkboxWidth = checkboxWidth ? checkboxWidth.offsetWidth : 0;
            //if the li element has no menuCaption element it means that it did not have any sub-items but just text.
            //that is why the li element itself is the menu caption.
            //if (!menuCaptionContainer) {
                menuCaption = ulElement.children[i].getElementsByClassName(JW_MENU_ITEM_CAPTION)[0];
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
    return jasonWidgets.common.getData(menuElement, MENU_ITEM_DATA_KEY);
}

jasonMenuUIHelper.prototype.onCheckboxClick = function (clickEvent) {
    this.toggleCheckBox(clickEvent);
}
/**
 * Toggle checkbox checked state
 */
jasonMenuUIHelper.prototype.toggleCheckBox = function (event) {
    var menuItem = this.getMenuItemFromEvent(event);
    if(menuItem){
        if (menuItem.checkBoxElement && menuItem.enabled) {
            var eventData = { event: event, item: menuItem, checked: menuItem.checkBoxElement.checked, cancel: false };
            this.widget.triggerEvent(JW_EVENT_ON_MENU_CHECKBOX_CLICKED, eventData);
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
    var menuItem = this.getMenuItemFromEvent(clickEvent);
    if (menuItem) {
        if (menuItem.clickable && menuItem.enabled) {
            this.widget.triggerEvent(JW_EVENT_ON_MENU_ITEM_CLICKED, { event: clickEvent, item: menuItem, uiHelper: this });
        }
    }
}
/**
 * Triggered when a menu item is touched.
 * @param {HTMLEvent} itemClickEvent - HTMLEvent.
 */
jasonMenuUIHelper.prototype.onItemTouch = function (touchEvent) {
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
 * Show menu item contents
 * @param {Menus.jasonMenuItem} menuItem
 */
jasonMenuUIHelper.prototype.showMenuItemContents = function (menuItem) {
    if (menuItem) {
        var menuElement = menuItem.element;
        if (!menuElement.getAttribute(MENU_ITEM_NO_HIGHLIGHT_ATTR) && menuItem.enabled)
            menuElement.classList.add(MENU_ITEM_CLASS_ACTIVE);

        //only try to place the sub-menu container if its enabled and not visible.
        var renderSubMenuContainer = (!menuElement._jasonMenuItemsContainer && menuItem.enabled) || (menuItem.enabled && menuElement._jasonMenuItemsContainer.style.display == "none");
        if (renderSubMenuContainer) {
            var orientantion = menuElement.parentNode == this.ulMenuElement ? this.options.orientation.toLowerCase() : null;
            this.placeMenuItemsContainer(menuElement._jasonMenuItemsContainer, menuElement, orientantion);
            menuItem.triggerEvent(JW_EVENT_ON_MENU_ITEM_CONTENT_SHOW)
        }
    }
}
/**
 * Hides menu item contents
 * @param {Menus.jasonMenuItem} menuItem
 */
jasonMenuUIHelper.prototype.hideMenuItemContents = function (menuItem) {
    if (menuItem) {
        var menuElement = menuItem.element;
        if (!this.options._debug && !this.disableMouseEvents) {
            if (menuElement._jasonMenuItemsContainer && this.canHideSubMenu) {
                menuElement._jasonMenuItemsContainer.style.display = "none";
            }
        }
        if (menuItem.enabled)
            menuElement.classList.remove(MENU_ITEM_CLASS_ACTIVE);
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
        var animSpeed = 350 - (this.options.animation.Speed * 35);
        jasonWidgets.common.fadeOut(menuItemsContainer, animSpeed);
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
        var leftPosition = menuItemsContainer.offsetWidth + coordinates.left  >= width ? menuElement.offsetLeft - (menuItemsContainer.offsetWidth) : orientantion == "horizontal" ? menuElement.offsetLeft : menuElement.offsetWidth;
        menuItemsContainer.style.left = leftPosition + "px";
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
            this.ulMenuElement.classList.add(MENU_HORIZONTAL);
        this.menuContainer.appendChild(this.ulMenuElement);
        /*If the menu is invokable hide it when the mouse is not over the client of the menu container.*/
        if (this.options.invokable) {
            this.menuContainer.style.display = "none";
            this.menuContainer.style.position = "absolute";
            this.eventManager.addEventListener(this.menuContainer, MOUSE_LEAVE_EVENT, function (mouseLeaveEvent) {
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
            this.eventManager.addEventListener(this.menuContainer, MOUSE_ENTER_EVENT, function (mouseLeaveEvent) {
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
        this.eventManager.addEventListener(this.ulMenuElement, MOUSE_ENTER_EVENT, function (mouseEnterEvent) {
            self.disableMouseEvents = false;
        });

        this.eventManager.addEventListener(this.ulMenuElement, MOUSE_DOWN_EVENT, function (mouseDownEvent) {
            var menuElement = jasonWidgets.common.getParentElement("LI", mouseDownEvent.target);
            var menuItem = jasonWidgets.common.getData(menuElement, MENU_ITEM_DATA_KEY);
            if (menuItem && menuItem.content) {
                if (jw.common.isMouseEventOutOfContainer(self.ulMenuElement, mouseDownEvent)) {
                    self.disableMouseEvents = true;
                }
            }
        },true);
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
 * @augments jasonMenuOptions
 * @description Context jasonMenu options.Extends {@linkcode jasonMenuOptions}
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
    jasonMenuUIHelper.call(this, widget, htmlElement);
    this.menuContainer.style.display = "none";
    this.menuContainer.parentElement.removeChild(this.menuContainer);
    document.body.appendChild(this.menuContainer);
    this.menuContainer.style.width = widget.options.width + "px";
    this.menuContainer.style.position = "absolute";
    this.initializeEvents();
}


/**
 * Initializes context menu events.
 */
jasonContextMenuUIHelper.prototype.initializeEvents = function () {
    this.eventManager.addEventListener(this.options.target, CONTEXT_MENU_EVENT, this.showContextMenu);
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
    this.widget.triggerEvent(JW_EVENT_ON_MENU_CHECKBOX_CLICKED, eventData);
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
 * @property {object=}   invokableElement - Element which upon clicked it will display the calendar.
 * @property {boolean}  [autoHide=false]         - If true the calendar is hidden if there is a mouse click outside the calendar and the calendar is invokable.
 * @property {array}    [specialDates=[]]     - List of special dates. Default is empty.
 * @property {number}   [firstDayOfWeek=1]   - Set the first day of the week. Default is Monday.Index is zero based.
 * @property {boolean}  [multiSelect=false]      - Allows date multi selection.
 * @property {boolean}  [rangeSelect=false]      - Allows date range selection. Similar to multi but the dates must consecutive. 
 * @property {number}   [width=300]            - Set the width of the calendar control in pixels.
 * @property {number}   [height=220]           - Set the height of the calendar control in pixels.
 * @property {string}   [calendarMode=days]     - Sets the mode of the calendar. Possible values [days,months,years,decades,centuries].
 * @property {Date/Time.jasonCalendarSpecialDate[]}    [selectedDates=[]]    - List of selected dates. Default is empty.
 */

/**
 * @class
 * @name jasonCalendarSpecialDate
 * @memberOf Date/Time
 * @description A special date; is date that will render a calendar item, with specific tooltip and/or cssClass
 * @property {date} date            - Can be a date object or valid date string.
 * @property {string} tooltip       - Tooltip to be shown over the calendar item.
 * @property {string} cssClass      - Css class to be added to the calendar item.
 * @property {boolean} recurring    - If set to true then year is not taken into account.Default is false
 */

/**
 * jasonCalendarItem
 * @constructor
 * @description  Object representation of calendar contents.
 * @memberOf Date/Time
 * @property {string} dayName - Day name.
 * @property {string} dayShortName - Day short name.
 * @property {date} date - Item's date value.
 * @property {number} month - Item's month.
 * @property {string} monthName - Month name.
 * @property {string} monthShortName - Month short name.
 * @property {number} year - Item's year value.
 * @property {number} decadeStart - Item's decade start value.
 * @property {number} decadeStop - Item's decade stop value.
 * @property {number} centuryStart - Item's decade century value.
 * @property {number} centuryStop - Item's decade century value.
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

var
    JW_EVENT_CALENDAR_MODE_CHANGE = "onModeChange",
    JW_EVENT_CALENDAR_NAVIGATE = "onNavigate";
/**
 * @class
 * @name jasonCalendarEvents
 * @memberOf Date/Time
 * @description List of jasonCalendar events
 * @property {function} onChange - function(value : date)
 * @property {function} onModeChange - function(value : string)
 * @property {function} onNavigate - function(value : { navDirection:string, navDate:date})
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
 */
function jasonCalendar(htmlElement, options) {
    this.defaultOptions = {
        invokable: false,
        autoHide: false,
        invokableElement: null,
        firstDayOfWeek: 1,
        width: 300,
        height:220,
        calendarMode: "days",
        specialDates: [],
        selectedDates: [],
        multiSelect: false,
        rangeSelect:false,
        localization: jasonWidgets.localizationManager.currentLanguage ? jasonWidgets.localizationManager.currentLanguage.calendar : options.localization
        };
    jasonBaseWidget.call(this, "jasonCalendar", htmlElement,options, jasonCalendarUIHelper);
    //this._date = this.options.invokable ? null : jasonWidgets.common.dateOf(new Date());
    this._date = jasonWidgets.common.dateOf(new Date());
    this._navigationDate = jasonWidgets.common.dateOf(new Date());
    this._specialDates = [];
    this._calendarMode = this.options.calendarMode ? this.options.calendarMode : "days";
    this.currentCalendarItems = [];
    this.parseSpecialDates();
    this.ui.renderUI();
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
        return this._calendarMode;
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
        this.triggerEvent(JW_EVENT_ON_CHANGE, this._date);
    }
}
/**
 * Sets the calendar mode
 * @ignore
 */
jasonCalendar.prototype._setMode = function (mode) {
    if (mode && this._calendarMode != mode) {
        this._calendarMode = mode;
        this.triggerEvent(JW_EVENT_CALENDAR_MODE_CHANGE, this._calendarMode);
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
jasonCalendar.prototype.parseSpecialDates = function () {
    for (var i = 0; i <= this.options.specialDates.length - 1; i++) {
        var specialDate = this.options.specialDates[i];
        if (specialDate.date) {
            var sdateTime = typeof specialDate.date == "date" ? specialDate.date : Date.parse(specialDate.date);
            if (!isNaN(sdateTime)) {
                var sDate = new Date();
                sDate.setTime(sdateTime);
                this.specialDates.push({ date: sDate, tooltip: specialDate.tooltip, cssClass: specialDate.cssClass,recurring:specialDate.recurring || false });
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
        calendarItem.classList.push(CALENDAR_ITEM_OUT_CURRENT_SCOPE);
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
        calendarItem.classList.push(CALENDAR_ITEM_OUT_CURRENT_SCOPE);
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
    yearBefore.classList.push(CALENDAR_ITEM_OUT_CURRENT_SCOPE);
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
    yearAfter.classList.push(CALENDAR_ITEM_OUT_CURRENT_SCOPE);
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
    //decadeBefore.classList.push(CALENDAR_ITEM_OUT_CURRENT_SCOPE);
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
    //decadeAfter.classList.push(CALENDAR_ITEM_OUT_CURRENT_SCOPE);
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
    centuryBefore.classList.push(CALENDAR_ITEM_OUT_CURRENT_SCOPE);
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
    centuryAfter.classList.push(CALENDAR_ITEM_OUT_CURRENT_SCOPE);
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
    switch(this._calendarMode){
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
    switch (this._calendarMode) {
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
            return 4;
        }
        default: return 7;
    }
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
    switch (this._calendarMode) {
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
    this.triggerEvent(JW_EVENT_CALENDAR_NAVIGATE, { navDirection: direction, navDate: this._navigationDate });
    return this.generateCalendarItems(navidationDate);
}

var
    CALENDAR = "jw-calendar",
    CALENDAR_HEADER = "jw-calendar-header",
    CALENDAR_BODY = "jw-calendar-body",
    CALENDAR_FOOTER = "jw-calendar-footer",
    CALENDAR_GO_BACK = "jw-calendar-back",
    CALENDAR_GO_FORWARD = "jw-calendar-forward",
    CALENDAR_DISPLAY = "jw-calendar-display",
    CALENDAR_TABLE_MONTHS = "month-view",
    CALENDAR_TABLE_YEARS = "years-view",
    CALENDAR_TABLE_DECADES = "decades-view",
    CALENDAR_TABLE_CENTURIES = "centuries-view",
    CALENDAR_ITEM_SELECTED_DATE = "selected-date",
    CALENDAR_ITEM_OUT_CURRENT_SCOPE ="jw-calendar-item-outofscope";


jasonCalendarUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonCalendarUIHelper.prototype.constructor = jasonCalendarUIHelper;
/**
 * jasonCalendar UI helper class. Manages HTML and UI events
 * @constructor
 * @ignore
 */
function jasonCalendarUIHelper(widget, htmlElement) {
    jasonBaseWidgetUIHelper.call(this, widget,htmlElement);
    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
    this.calendarDisplayClick = this.calendarDisplayClick.bind(this);
    this.calendarItemClick = this.calendarItemClick.bind(this);
    this.calendarNavigateToday = this.calendarNavigateToday.bind(this);
    this.renderedCalendarItems = [];
    var self = this;
    jwDocumentEventManager.addDocumentEventListener(SCROLL_EVENT, function (scrollEvent) {
        if (self.options.invokable)
            self.hideCalendar();
    });
    //jwWindowEventManager.addWindowEventListener(SCROLL_EVENT, function (scrollEvent) {
    //    self.hideCalendar();
    //});
    //jwWindowEventManager.addWindowEventListener(TOUCH_MOVE_EVENT, function (scrollEvent) {
    //    self.hideCalendar();
    //});

    jwDocumentEventManager.addDocumentEventListener(TOUCH_MOVE_EVENT, function (scrollEvent) {
        if (self.options.invokable)
            self.hideCalendar();
    });
}
/**
 * Renders the calendar UI.
 */
jasonCalendarUIHelper.prototype.renderUI = function () {
    var self = this;
    if (!this.htmlElement.classList.contains(CALENDAR)) {
        this.htmlElement.style.width = this.widget.options.width + "px";
        this.htmlElement.style.height = this.widget.options.height + "px";
        this.htmlElement.classList.add(CALENDAR);
        this.renderHeader();
        this.renderBody();
        this.renderFooter();
        if (this.options.invokable) {
            this.hideCalendar();
            this.htmlElement.style.position = "absolute";
            jwDocumentEventManager.addDocumentEventListener(MOUSE_DOWN_EVENT, function (mouseDownEvent) {
                if (jasonWidgets.common.isMouseEventOutOfContainer(self.htmlElement, mouseDownEvent) && self.htmlElement.style.display == "")
                    self.hideCalendar();
            });
            this.eventManager.addEventListener(this.htmlElement, KEY_DOWN_EVENT, function (keyDownEvent) {
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
    this.calendarHeader.classList.add(CALENDAR_HEADER);

    this.calendarGoBackButton = jw.htmlFactory.createJWButton(null, JW_ICON_ARROW_LEFT);
    this.calendarGoBackButton.classList.add(CALENDAR_GO_BACK);
    this.eventManager.addEventListener(this.calendarGoBackButton, CLICK_EVENT, this.goBack,true);



    this.calendarDisplayTitle = jw.htmlFactory.createJWLinkLabel();
    this.calendarDisplayTitle.classList.add(CALENDAR_DISPLAY);
    this.eventManager.addEventListener(this.calendarDisplayTitle, CLICK_EVENT, this.calendarDisplayClick);

    this.calendarGoForwardButton = jw.htmlFactory.createJWButton(null, JW_ICON_ARROW_RIGHT);
    this.calendarGoForwardButton.classList.add(CALENDAR_GO_FORWARD);
    this.eventManager.addEventListener(this.calendarGoForwardButton, CLICK_EVENT, this.goForward,true);

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
    this.calendarBody.classList.add(CALENDAR_BODY);
    this.calendarTable = this.createElement("table");
    this.calendarBody.appendChild(this.calendarTable);
    this.renderCalendarItems();
    this.htmlElement.appendChild(this.calendarBody);
}
/**
 * Renders calendars items to the calendar body
 */
jasonCalendarUIHelper.prototype.renderCalendarItems = function (navigationResult) {
    var calendarItemsToRender;
    navigationResult = navigationResult ? navigationResult : this.widget.generateCalendarItems();

    calendarItemsToRender = navigationResult.calendarItems ;
    this.calendarTable.innerHTML = "";

    for (var i = this.calendarTable.classList.length - 1; i >= 0; i--) {
        this.calendarTable.classList.remove(this.calendarTable.classList[i]);
    }
    if (this.widget.mode == "months")
        this.calendarTable.classList.add(CALENDAR_TABLE_MONTHS);
    if (this.widget.mode == "years")
        this.calendarTable.classList.add(CALENDAR_TABLE_YEARS);
    if (this.widget.mode == "decades")
        this.calendarTable.classList.add(CALENDAR_TABLE_DECADES);

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
        var calendaItemCaption = this.createElement("a");
        calendaItemCaption.appendChild(this.createTextNode(calendarItem.displayValue));
        calendaItemCaption.setAttribute("href", "javascript:void(0)");
        tableCell.appendChild(calendaItemCaption);
        if (specialDate) {
            tableCell.setAttribute(TITLE_ATTR, specialDate.tooltip);
            if (specialDate.cssClass)
                tableCell.classList.add(specialDate.cssClass);
        }
        jasonWidgets.common.setData(tableCell, "jwCalendarItem", calendarItem);
        if (this.widget.mode == "days") {
            if (jw.common.dateComparison(navigationResult.navDate, calendarItem.date) == jw.enums.comparison.equal)
                tableCell.classList.add(CALENDAR_ITEM_SELECTED_DATE);
        }
        this.eventManager.addEventListener(tableCell, CLICK_EVENT, this.calendarItemClick,true);
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
    this.calendarFooter.classList.add(CALENDAR_FOOTER);
    this.calendarFooterToday = jw.htmlFactory.createJWLinkLabel(jw.common.formatDateTime(new Date(), jw.localizationManager.currentCulture.longDateFormat));
    this.calendarFooter.appendChild(this.calendarFooterToday);

    this.htmlElement.appendChild(this.calendarFooter);
    this.eventManager.addEventListener(this.calendarFooterToday, CLICK_EVENT, this.calendarNavigateToday,true);
}
/**
 * Shows the calendar.
 */
jasonCalendarUIHelper.prototype.showCalendar = function (date) {
    if (this.options.invokableElement) {
        this.calendarNavigateToday(date ? date : this.widget.date);
        var coordinates = jw.common.getOffsetCoordinates(this.options.invokableElement);
        this.htmlElement.style.left = coordinates.left + "px";
        this.htmlElement.style.top = (coordinates.top + this.options.invokableElement.offsetHeight) + "px";
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
    var navDate =  jw.common.getVariableType(navigationDate) == jw.enums.variableType.date ? navigationDate : new Date();
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
    var navigationDate = jw.common.getData(this.calendarDisplayTitle, "navigationDate");
    if (this.widget.mode == "years")
        this.widget.mode = "decades";

    if (this.widget.mode == "months")
        this.widget.mode = "years";

    if (this.widget.mode == "days")
        this.widget.mode = "months";

    this.renderCalendarItems(this.widget.navigate(null));
}
/**
 * Calendar item click event handler. It drills in if needed.
 * If calendar mode is years and you click on to a year, it
 * will render the months. And if you click a month it render the days of that
 * month for that year.
 */
jasonCalendarUIHelper.prototype.calendarItemClick = function (clickEvent) {
    var milliSecondsInaDay = 86400000;
    var calendarItem = jasonWidgets.common.getData(clickEvent.currentTarget, "jwCalendarItem");
    if (calendarItem) {
        //if the current item is out of the calendar's current scope
        //set the widget's date to that date and navigate to that date.
        if (this.widget.mode == "days" && clickEvent.currentTarget.classList.contains(CALENDAR_ITEM_OUT_CURRENT_SCOPE)) {
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
            calendarTableItems[i].classList.remove(CALENDAR_ITEM_SELECTED_DATE);
        }
    tdElement.classList.add(CALENDAR_ITEM_SELECTED_DATE);
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonTabControl.prototype = Object.create(jasonBaseWidget.prototype);
jasonTabControl.prototype.constructor = jasonTabControl;

var
    JW_EVENT_ON_TAB_ENTER = "onTabEnter";

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
 * @property {number}   pageHeight - Tab page height.No default.
 */

/**
 * jasonTabControlWidget
 * @constructor
 * @descrption Tab control widget.
 * @memberOf Containers
 * @augments Common.jasonBaseWidget
 * @param {HTMLElement} htmlElement - DOM element that will contain the tabcontrol.
 * @param {jasonTabControlOptions} options - Tab control options. 
 * @property {number} tabIndex - Current tab index.
 */
function jasonTabControl(htmlElement, options) {
    if ((htmlElement.tagName != "DIV") && (htmlElement.children[0] && htmlElement.children[0].tagName != "UL")) {
        throw new Error("Tabcontrol container must a DIV containing a UL element as first child");
    }

    jasonBaseWidget.call(this, "jasonTabControl", htmlElement,options,jasonTabControlWidgetUIHelper);
    this._tabIndex = -1;
    this.ui.renderUI();
    this.htmlElement.style.display = "";
}

Object.defineProperty(jasonTabControl.prototype, "tabIndex", {
    get: function () {
        return this._tabIndex;
    },
    set: function (value) {
        if (this._tabIndex != value) {
            this._tabIndex = value;
            this.ui.setActiveTab(this.ui.tabContents[this._tabIndex]);
            this.triggerEvent(JW_EVENT_ON_TAB_ENTER, this._tabIndex);
        }
    },
    enumerable: true,
    configurable: true
});


jasonTabControlWidgetUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonTabControlWidgetUIHelper.prototype.constructor = jasonTabControlWidgetUIHelper;

var
    TAB_CONTAINER = "jw-tabcontrol-container",
    TAB_UL_CLASS = "jw-tabcontrol-list",
    TAB_PAGE_CLASS = "jw-tabcontrol-page",
    TAB_PAGE_CONTENT_CONTAINER_CLASS = "jw-tabcontrol-page-container",
    TAB_PAGE_CONTAINER = "jw-tabcontrol-page-container",
    TAB_PAGE_ACTIVE = 'jw-tab-active';

/**
 * Tabcontrol UI widget helper.
 * @constructor
 * @ignore
 */
function jasonTabControlWidgetUIHelper(widget, htmlElement) {
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);

    this.tabContents = [];
    this.setActiveTab = this.setActiveTab.bind(this);
}
/**
 * Renders tab control's HTML.
 */
jasonTabControlWidgetUIHelper.prototype.renderUI = function () {
    var self = this;
    if (!this.tabsList) {
        this.htmlElement.classList.add(TAB_CONTAINER);
        this.tabsList = this.htmlElement.tagName == "DIV" ? this.htmlElement.children[0] : this.htmlElement;
        this.tabsList.classList.add(TAB_UL_CLASS);
        for (var i = 0 ; i <= this.tabsList.children.length - 1 ; i++) {
            var liItem = this.tabsList.children[i];
            liItem.classList.add(TAB_PAGE_CLASS);
            liItem.setAttribute(DATA_ITEM_INDEX_ATTR, i);
            liItem.setAttribute(TABINDEX_ATTR, jasonWidgets.common.getNextTabIndex());
            this.eventManager.addEventListener(liItem, CLICK_EVENT, function (clickEvent) {
                var parentNode = clickEvent.target;
                while (parentNode.tagName != "LI") {
                    parentNode = parentNode.parentNode;
                }
                self.widget.tabIndex = parseInt(parentNode.getAttribute(DATA_ITEM_INDEX_ATTR));// setActiveTab(parentNode);
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
                childContainer.classList.add(TAB_PAGE_CONTAINER);
                if (this.widget.options.pageHeight)
                    childContainer.style.height = this.widget.options.pageHeight + "px";
                childContainer.setAttribute(DATA_ITEM_INDEX_ATTR, i);
                this.tabContents.push(childContainer);
            }
        }

        for (var i = 0 ; i <= this.tabContents.length - 1 ; i++) {
            this.htmlElement.appendChild(this.tabContents[i]);
        }
        this.widget.tabIndex = 0;
    }
}


/**
 * Sets the active tab.
 * @param {object} tabElement - HTMLElement
 */
jasonTabControlWidgetUIHelper.prototype.setActiveTab = function (tabElement) {
    for (var i = 0 ; i <= this.tabsList.children.length - 1 ; i++) {
        var liItem = this.tabsList.children[i];
        liItem.classList.remove(TAB_PAGE_ACTIVE)
    }
    var tabIndex = parseInt(tabElement.getAttribute(DATA_ITEM_INDEX_ATTR));
    if (!isNaN(tabIndex)) {
        tabElement.classList.add(TAB_PAGE_ACTIVE);
        this.tabsList.children[this.widget.tabIndex].classList.add(TAB_PAGE_ACTIVE);
        this.tabContents.forEach(function (tabContent, tabContentIndex) {
            tabContent.style.display = "none";
        });
        this.tabContents[tabIndex].style.display = "";
    }
}
jasonGridUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonGridUIHelper.prototype.constructor = jasonGridUIHelper;
var
    GRID_CLASS = "jw-grid",
    GRID_HEADER_CONTAINER = "jw-grid-header-container",
    GRID_HEADER_TABLE_CONTAINER = "jw-grid-header-table-container",
    GRID_HEADER_CONTAINER_NO_GROUPING = "no-grouping",
    GRID_HEADER_CELL_CAPTION_CONTAINER = "jw-header-cell-caption",
    GRID_HEADER_CELL_ICON_CONTAINER = "jw-header-cell-icon",
    GRID_HEADER = "jw-grid-header",
    GRID_DATA_CONTAINER = "jw-grid-data-container",
    GRID_DATA = "jw-grid-data",
    GRID_FOOTER_CONTAINER = "jw-grid-footer-container",
    GRID_FOOTER = "jw-grid-footer",

    GRID_TABLE_ROW_CLASS = "jw-grid-row",
    GRID_TABLE_ALT_ROW_CLASS = "row-alt",
    GRID_TABLE_GROUP_ROW_CLASS = "group-row",
    GRID_TABLE_CELL_CLASS = "jw-grid-cell",

    GRID_COLUMN_DRAG_IMAGE = "jw-grid-column-drag-image",

    GRID_COLUMN_ID_ATTR = "jw-column-id",
    GRID_COLUMN_FIELD_ATTR = "jw-column-field",
    GRID_COLUMN_RESIZE_HANDLE = "jw-column-resize",
    GRID_COLUMN_SORT_ATTR = "jw-column-sort";

    GRID_SELECTED_ROW_CLASS = "row-selected",
    GRID_SELECTED_CELL_CLASS = "cell-selected";
    GRID_GROUPING_CONTAINER_CLASS = "jw-grid-group-container",
    GRID_GROUP_FIELD = "jw-group-field",
    GRID_TABLE_NO_DATA_ROW_CLASS = "jw-grid-no-data-row";




    
/**
 * @constructor
 * @ignore
 */
function jasonGridUIHelper(widget, htmlElement) {
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);
    this.resizeTimeout = null;
    this._onColumnMenuItemChecked = this._onColumnMenuItemChecked.bind(this);
    this._onColumnMenuItemClicked = this._onColumnMenuItemClicked.bind(this);
    this._onColumnMenuHidden = this._onColumnMenuHidden.bind(this);
    this._onGridFilterButtonClick = this._onGridFilterButtonClick.bind(this);
    this._onGridColumnMenuIconClick = this._onGridColumnMenuIconClick.bind(this);
    this._onGridColumnCaptionClick = this._onGridColumnCaptionClick.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onDataContainerScroll = this._onDataContainerScroll.bind(this);
    this._onGroupCollapseExpandIconClick = this._onGroupCollapseExpandIconClick.bind(this);
    this._onGroupColumnRemoveClick = this._onGroupColumnRemoveClick.bind(this);
    this._onColumnDrop = this._onColumnDrop.bind(this);
    this._onColumnResizeEnd = this._onColumnResizeEnd.bind(this);
    this._onSelectionChange = this._onSelectionChange.bind(this);
    this.gridSelectedRows = new Array();
    this.gridSelectedCells = new Array();
    this._currentPage = 1;
    this._currentFilterField = null;
    this._currentFilterColumn = null;
    this._currentTHElement = null;
    this.dragImage = this.createElement("div");
    this.dragImage.classList.add(JW_DRAG_IMAGE);
    this.dragImage.style.display = "none";
    this.dummyDragImage = this.createElement("div");
    this._firstRun = true;
    document.body.appendChild(this.dragImage);
    //rendering grid container elements
    this._renderGridContainers();
    //initializing grid columns.
    //this.widget._initializeColumns();
    /*render the grid thead and sticky headers*/
    this._renderHeader();
    //setting column reordering, resize and grouping functionality.
    this._enableColumnDragResize();
}

//#region Object properties

//#endregion

//#region Column menu.
/**
 * Creates default column menu.
 */
jasonGridUIHelper.prototype._createColumnMenu = function () {
    this.columnMenu = new jasonMenu(this.gridHeaderTableContainer, {
        _debug: false,
        menu: this.widget.defaultGridColumnMenu,
        invokable: true,
        hideDelay: 350,
        orientation: 'vertical',
        autoHide:true,
        events: [
            { event: JW_EVENT_ON_MENU_CHECKBOX_CLICKED, listener: this._onColumnMenuItemChecked, callingContext: this },
            { event: JW_EVENT_ON_MENU_ITEM_CLICKED, listener: this._onColumnMenuItemClicked, callingContext: this },
            { event: JW_EVENT_ON_MENU_HIDDEN, listener: this._onColumnMenuHidden, callingContext: this }
        ],
    }, jasonMenuUIHelper);
    //this.columnMenu.addEventListener(JW_EVENT_ON_MENU_CHECKBOX_CLICKED, this._onColumnMenuItemChecked, this);
    //this.columnMenu.addEventListener(JW_EVENT_ON_MENU_ITEM_CLICKED, this._onColumnMenuItemClicked, this);
    //this.columnMenu.addEventListener(JW_EVENT_ON_MENU_HIDDEN, this._onColumnMenuHidden, this);
}
//#endregion

//#region Events
/**
 * Initializes event handlers.
 */
jasonGridUIHelper.prototype._initializeEvents = function () {
    this.eventManager.addEventListener(this.gridDataTable, MOUSE_DOWN_EVENT, this._onSelectionChange,true);
    this.eventManager.addEventListener(this.gridDataContainer, SCROLL_EVENT, this._onDataContainerScroll);
    window.addEventListener(RESIZE_EVENT, this._onResize);
    var self = this;
    this.eventManager.addEventListener(this.pagerButtonFirst, CLICK_EVENT, function (event) {
        self._goToPage(1, event);
        event.stopPropagation();
    });

    this.eventManager.addEventListener(this.pagerButtonPrior, CLICK_EVENT, function (event) {
        self._goToPage(self._currentPage - 1, event);
        event.stopPropagation();
    });

    this.eventManager.addEventListener(this.pagerButtonNext, CLICK_EVENT, function (event) {
        self._goToPage(self._currentPage + 1, event);
        event.stopPropagation();
    });

    this.eventManager.addEventListener(this.pagerButtonLast, CLICK_EVENT, function (event) {
        self._goToPage(self._pageCount, event);
        event.stopPropagation();
    });

    this.eventManager.addEventListener(this.pagerInput, BLUR_EVENT, function (event) {
        self._goToPage(self.pagerInput.value, event);
        event.stopPropagation();
    });

    this.eventManager.addEventListener(this.pagerInput, INPUT_EVENT, function (event) {
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
    var cancel = eventData.cancel;
    if (eventData.checked)
        cancel = this.widget.showColumn(column);
    else
        cancel = this.widget.hideColumn(column);
    eventData.cancel = cancel;
    //return this._columnVisible(column, eventData.checked);
}
/**
 * Executed when a jasonMenuItem checkbox is clicked. The value of the checked determines the visibility of the column.
 * @param {object} clickEvent - HTMLEvent.
 * @param {object} menuItem - jasonMenuItem that was clicked.
 */
jasonGridUIHelper.prototype._onColumnMenuItemClicked = function (sender, eventData) {
    /*first try to find the corresponding column*/
    var columnIndex = eventData.uiHelper.invokableElement.getAttribute(GRID_COLUMN_ID_ATTR);
    if (columnIndex)
        columnIndex = parseInt(columnIndex);
    var column = this.options.columns[columnIndex];
    switch (eventData.item.name) {
        case "mnuSortAsc": {
            this.widget.sortBy(column.fieldName, "asc");
            break;
        }
        case "mnuSortDesc": {
            this.widget.sortBy(column.fieldName, "desc");
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
                columnHeaders[i].classList.remove(GRID_FIELD_HAS_FILTER);
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
 * Mananing selected row(s) based on the configuration of the grid.
 * @ignore
 * @param {event} event - DOM event
 */
jasonGridUIHelper.prototype._onSelectionChange = function (event) {
    var cellTarget = event.target;
    var targetParent = event.target;
    if (targetParent.tagName == "TABLE") return;

    while (targetParent && targetParent.tagName != "TR") {
        targetParent = targetParent.parentNode;
    }



    while (cellTarget.tagName != "TD") {
        cellTarget = cellTarget.parentNode;
    }
    if (targetParent.className.indexOf(GRID_TABLE_GROUP_ROW_CLASS) >= 0)
        return;
    var selectedRow = this.gridSelectedRows[0];
    var selectedCell = this.gridSelectedCells[0];

    if (selectedRow && this.options.multiSelect == false) {
        selectedRow.classList.remove(GRID_SELECTED_ROW_CLASS);
    }

    if (selectedCell && this.options.cellMultiSelect == false) {
        selectedCell.classList.remove(GRID_SELECTED_CELL_CLASS);
    }

    if (this.options.multiSelect == true && !event.ctrlKey) {
        this.gridSelectedRows.forEach(function (rowSelected) {
            rowSelected.classList.remove(GRID_SELECTED_ROW_CLASS);
        });
        this.gridSelectedRows = new Array();
        this.widget.selectedRows = new Array();
    }

    if (this.options.cellMultiSelect == true && !event.ctrlKey) {
        this.gridSelectedCells.forEach(function (cellSelected) {
            cellSelected.classList.remove(GRID_SELECTED_CELL_CLASS);
        });
        this.gridSelectedCells = new Array();
    }


    targetParent.classList.add(GRID_SELECTED_ROW_CLASS);
    cellTarget.classList.add(GRID_SELECTED_CELL_CLASS);
    var rowId = targetParent.getAttribute(DATA_ROW_ID_ATTR);
    if (!this.options.multiSelect) {
        this.gridSelectedRows = new Array();
        this.widget.selectedRows = new Array();
    }
    if (!this.options.cellMultiSelect) {
        this.gridSelectedCells = new Array();
    }
    this.widget.selectedRows.push(this.widget.dataSource.data[rowId]);
    this.gridSelectedRows.push(targetParent);
    this.gridSelectedCells.push(cellTarget);
    this.widget.triggerEvent(JW_EVENT_ON_SELECTION_CHANGE, this.widget.selectedRows);
}
/**
 * Grid filter click
 */
jasonGridUIHelper.prototype._onGridFilterButtonClick = function (clickEvent) {
    //this.gridFilter.ui.showFilter(filterIconElement, clickEvent);
    //clickEvent.stopPropagation();
}
/**
 * Grid column menu click
 */
jasonGridUIHelper.prototype._onGridColumnMenuIconClick = function (clickEvent) {
    clickEvent.stopPropagation();
    if (clickEvent.button == 0) {
        this._currentFilterColumn = this.options.columns[parseInt(clickEvent.currentTarget.getAttribute(GRID_COLUMN_ID_ATTR))];
        this._currentFilterField = this.options.columns[parseInt(clickEvent.currentTarget.getAttribute(GRID_COLUMN_ID_ATTR))].fieldName;
        this._currentTHElement = jasonWidgets.common.getParentElement("TH", clickEvent.currentTarget);
        //passing the icon container instead of the icon it self
        this.columnMenu.ui.showMenu(clickEvent.currentTarget.parentElement);
    }
}
/*
 * more performant way to handle resize event cals , taken from https://developer.mozilla.org/en-US/docs/Web/Events/resize
 * upon a window resize we want to resize the sticky headers, so they always align with the data table.
 */
jasonGridUIHelper.prototype._onResize = function (resizeEvent) {
    var self = this;
    if (!this.resizeTimeout) {
        this.resizeTimeout = setTimeout(function () {
            self.resizeTimeout = null;
            self._sizeColumns();
            // The actualResizeHandler will execute at a rate of 15fps
        }, 66);
    }
}
/**
 * 
 */
jasonGridUIHelper.prototype._onDataContainerScroll = function (scrollEvent) {
    this.gridHeaderTableContainer.scrollLeft = this.gridDataContainer.scrollLeft;
}
/**
 * Event handler on column title click, to sort grid data based on the field column
 */
jasonGridUIHelper.prototype._onGridColumnCaptionClick = function (clickEvent) {
    var gridColumnHeader = jw.common.getParentElement("TH", clickEvent.target);
    if (gridColumnHeader) {
        var gridColumnIndex = parseInt(gridColumnHeader.getAttribute(GRID_COLUMN_ID_ATTR));
        var sortDirection = gridColumnHeader.getAttribute(GRID_COLUMN_SORT_ATTR);
        sortDirection = !sortDirection ? "asc" : sortDirection == "asc" ? "desc" : "asc";
        gridColumnHeader.setAttribute(GRID_COLUMN_SORT_ATTR, sortDirection);
        this.widget.sortBy(this.options.columns[gridColumnIndex].fieldName, sortDirection);
        clickEvent.stopPropagation();
    }
}
/**
 * 
 */
jasonGridUIHelper.prototype._onGroupCollapseExpandIconClick = function (event) {
    var iconNode = event.target;
    var groupRow = jw.common.getParentElement("TR",iconNode);
    if (iconNode.className.indexOf("bottom") >= 0) {
        iconNode.className = "jw-icon arrow-circle-top-2x";
        groupRow.setAttribute(DATA_GROUP_EXPANDED_ATTR, "false");
        this._collapseGroup(groupRow);
    }
    else {
        iconNode.className = "jw-icon arrow-circle-bottom-2x";
        groupRow.setAttribute(DATA_GROUP_EXPANDED_ATTR, "true");
        this._expandGroup(groupRow);
    }
}
/**
 * Called when a column gets dropped on the grouping container.
 */
jasonGridUIHelper.prototype._onColumnDrop = function (event, htmlElement) {

    if (event.preventDefault)
        event.preventDefault();
    
    var elementFromPoint = document.elementFromPoint(event.clientX, event.clientY);

    if (elementFromPoint) {
        var droppedColumnField = htmlElement.getAttribute(GRID_COLUMN_FIELD_ATTR);
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
            var columnFieldFromPoint = parentElementFromPoint.getAttribute(GRID_COLUMN_FIELD_ATTR);
            var columnFromPoint = this.widget._columnByField(columnFieldFromPoint);
            if (columnFromPoint.index != droppedColumn.index) {
                jw.common.swapItemsInArray(this.options.columns, droppedColumn.index, columnFromPoint.index);
                jw.common.swapDomElements(this.gridHeaderTableRow, droppedColumn.index, columnFromPoint.index);
                jw.common.swapDomElements(this.headerTableColGroup, droppedColumn.index, columnFromPoint.index);
                jw.common.swapDomElements(this.dataTableColGroup, droppedColumn.index, columnFromPoint.index);

                var droppedIndex = droppedColumn.index;
                droppedColumn.index = columnFromPoint.index;
                columnFromPoint.index = droppedIndex;



                this.renderUI();
                this.widget.triggerEvent(JW_EVENT_ON_COLUMN_POSITION_CHANGE, { column: droppedColumn, fromIndex: droppedColumn.index, toIndex: columnFromPoint.index });
            }
        }
    }
}
/**
 * Called when a column resize is ends.
 */
jasonGridUIHelper.prototype._onColumnResizeEnd = function (event, htmlElement) {
    var fieldName = htmlElement.getAttribute(GRID_COLUMN_FIELD_ATTR);
    var column = this.widget._columnByField(fieldName);
    if (column) {
        column.width = htmlElement.offsetWidth;
    }
}
/**
 * Removes grouping.
 */
jasonGridUIHelper.prototype._onGroupColumnRemoveClick = function (event) {
    var groupingContainer = jw.common.getParentElement("DIV", event.target);
    var fieldNameToRemove = groupingContainer.getAttribute(DATA_GROUPING_FIELD_ATTR);
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
    //var self = this;
    //setTimeout(function () {
    //    self.htmlElement.style.display = "none";
    //    setTimeout(function () {
    //        self.htmlElement.style.display = "";
    //    });
    //},5000);
}
/**
 * Creates header,data and footer containers for the grid
 */
jasonGridUIHelper.prototype._renderGridContainers = function () {
    if (!this.gridHeaderContainer) {
        this.htmlElement.classList.add(GRID_CLASS);

        this.gridHeaderContainer = this.createElement("div");
        this.gridHeaderContainer.classList.add(GRID_HEADER_CONTAINER);
        this.gridHeaderTableContainer = this.createElement("div");
        this.gridHeaderTableContainer.classList.add(GRID_HEADER_TABLE_CONTAINER);
        this.gridHeaderContainer.appendChild(this.gridHeaderTableContainer);
        if (!this.widget.options.grouping) {
            this.gridHeaderContainer.classList.add(GRID_HEADER_CONTAINER_NO_GROUPING);
        }
        this.gridDataContainer = this.createElement("div");
        this.gridDataContainer.classList.add(GRID_DATA_CONTAINER);
        this.gridFooterContainer = this.createElement("div");
        this.gridFooterContainer.classList.add(GRID_FOOTER_CONTAINER);

        //Grouping container
        if (this.options.grouping == true && !this.gridGroupingContainer) {
            this.gridGroupingContainer = this.htmlElement.appendChild(this.createElement("div"));
            this.gridGroupingContainer.classList.add(GRID_GROUPING_CONTAINER_CLASS);
            this.gridGroupingContainer.appendChild(this.createElement("span"));
        }

        this.htmlElement.appendChild(this.gridHeaderContainer);
        this.htmlElement.appendChild(this.gridDataContainer);
        this.htmlElement.appendChild(this.gridFooterContainer);
    }
}
/**
 * 
 */
jasonGridUIHelper.prototype._enableColumnDragResize = function () {
    if (this.options.reordering || this.options.grouping || this.options.resizing) {
        for (var i = 0; i <= this.gridHeaderTableRow.children.length - 1; i++) {
            var headerElement = this.gridHeaderTableRow.children[i];
            var columnDragResize = jw.common.getData(headerElement, "jwColumnDragResize");
            if (headerElement.tagName == "TH" & !columnDragResize && !headerElement.getAttribute(GRID_GROUP_FIELD)) {
                columnDragResize = new jasonDragResize(headerElement, {
                    minWidth: 50,
                    allowResize: { top: false, left: false, bottom:false, right:true },
                    allowDrag:this.options.reordering,
                    dependantElements: [this.headerTableColGroup.children[i], this.dataTableColGroup.children[i]],
                    onMoveEnd: this._onColumnDrop,
                    onResizeEnd:this._onColumnResizeEnd,
                    ghostPanelCSS: JW_DRAG_IMAGE,
                    ghostPanelContents: headerElement.querySelectorAll("." + GRID_HEADER_CELL_CAPTION_CONTAINER)[0].innerHTML
                });
                //columnReorder = new jasonGridColumnReorder(this, headerElement);
                jw.common.setData(headerElement, "jwColumnDragResize", columnDragResize);
            } else {
                if (columnDragResize) {
                    columnDragResize.options.allowDrag = this.options.reordering;
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
        var newWidth = this.gridHeaderTable.clientWidth;// > this.gridDataTable.clientWidth ? this.gridHeaderTable.clientWidth : this.gridDataTable.clientWidth;
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
    if (this._firstRun) {
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
 * Renders filter UI for grid columns.
 */
jasonGridUIHelper.prototype._renderFilterUI = function () {
    var self = this;
    if (!this.filterContainer) {
        this._prepareFilterValues();
        this.filterContainer = this.createElement("div");
        this.filterContainer.className = GRID_FILTER_CONTAINER_CLASS;
        this.filterContainer.style.display = "none";
        /*filter header*/
        this.filterHeader = this.createElement("div");
        this.filterHeader.className = GRID_FILTER_HEADER_CLASS;
        this.filterHeaderTitle = this.createElement("span");
        this.filterHeaderTitle.appendChild(this.createTextNode(self.options.localization.grid.filtering.filterHeaderCaption));
        this.filterHeader.appendChild(this.filterHeaderTitle);

        /*filter body*/
        this.filterBody = this.createElement("div");
        this.filterBody.className = GRID_FILTER_BODY_CLASS;
        /*creating filter combobox containers*/
        this.firstFilterOperatorContainer = this.createElement("div");

        this.filterLogicalOperator = this.createElement("div");

        this.secondFilterOperatorContainer = this.createElement("div");

        /*creating jwComboboxes*/
        this.firstFilterCombobox = new jasonCombobox(this.firstFilterOperatorContainer, {
            data: this.filterValues,
            displayFields: ['title'],
            displayFormatString: '{0}',
            keyFieldName: 'key',
            readOnly: true,
            placeholder: this.options.localization.search.searchPlaceHolder,
            onItemSelected: null
        });
        this.secondFilterCombobox = new jasonCombobox(this.secondFilterOperatorContainer, {
            data: this.filterValues,
            displayFields: ['title'],
            displayFormatString: '{0}',
            keyFieldName: 'key',
            readOnly: true,
            placeholder: this.options.localization.search.searchPlaceHolder,
            onItemSelected: null
        });
        this.logicalOperatorCombobox = new jasonCombobox(this.filterLogicalOperator, { data: this.filterLogicalOperators, displayFields: ['title'], displayFormatString: '{0}', keyFieldName: 'Key', readOnly: true, placeHolder: this.options.localization.search.searchPlaceHolder });

        /*creating input elements*/
        this.firstFilterInputContainer = this.createElement("div");
        this.firstFilterInputContainer.className = GRID_FILTER_INPUT;
        this.firstFilterInput = jw.htmlFactory.createJWTextInput(null, this.options.localization.search.searchPlaceHolder);
        this.firstFilterInputContainer.appendChild(this.firstFilterInput);
        var inputKeyDownEvent = function (keyDownEvent) {
            var key = keyDownEvent.keyCode || keyDownEvent.which;
            switch (key) {
                case 13: {
                    self.filterBtnApply.click();
                    break;
                }
            }
        }
        this.eventManager.addEventListener(this.firstFilterInput, KEY_DOWN_EVENT, inputKeyDownEvent);

        this.secondFilterInput = jw.htmlFactory.createJWTextInput(null, this.options.localization.search.searchPlaceHolder);
        this.secondFilterInputContainer = this.createElement("div");
        this.secondFilterInputContainer.className = GRID_FILTER_INPUT;
        this.secondFilterInputContainer.appendChild(this.secondFilterInput);

        this.eventManager.addEventListener(this.secondFilterInput, KEY_DOWN_EVENT, inputKeyDownEvent);

        /*adding them to the dom*/
        this.filterBody.appendChild(this.firstFilterOperatorContainer);
        this.filterBody.appendChild(this.firstFilterInputContainer);
        this.filterBody.appendChild(this.filterLogicalOperator);
        this.filterBody.appendChild(this.secondFilterOperatorContainer);
        this.filterBody.appendChild(this.secondFilterInputContainer);



        /*filter footer*/
        this.filterFooter = this.createElement("div");
        this.filterFooter.className = GRID_FILTER_FOOTER_CLASS;


        this.filterBtnApply = jw.htmlFactory.createJWButton(this.options.localization.grid.filtering.applyButtonText, JW_ICON_CIRCLE_CHECK);//this.createElement("a");
        this.filterBtnApply.classList.add(JW_GRID_FILTER_BUTTON_APPLY);

        this.eventManager.addEventListener(this.filterBtnApply, CLICK_EVENT, function (clickEvent) {
            self._applyFilter();
        },true);


        this.filterBtnClear = jw.htmlFactory.createJWButton(this.options.localization.grid.filtering.clearButtonText, JW_ICON_CIRCLE_X);//this.createElement("a");
        this.filterBtnClear.classList.add(JW_GRID_FILTER_BUTTON_CLEAR);

        this.eventManager.addEventListener(this.filterBtnClear, CLICK_EVENT, function (clickEvent) {
            self._clearFilterControls();
            self.widget.clearFilter(self._currentFilterField);
        },true);

        jwDocumentEventManager.addDocumentEventListener(MOUSE_DOWN_EVENT, function (mouseDownEvent) {
            var containerRect = self.filterContainer.getBoundingClientRect();
            var isClickOutOfContainerHorizontal = (mouseDownEvent.x > containerRect.right) || (mouseDownEvent.x < containerRect.left);
            var isClickOutOfContainerVertical = (mouseDownEvent.y > containerRect.bottom) || (mouseDownEvent.y < containerRect.top);
            var shouldHideFilter = (isClickOutOfContainerHorizontal || isClickOutOfContainerVertical) && self.filterContainer.style.display == "";
        });

        var clearFilter = this.createElement("div");
        clearFilter.classList.add(CLEAR_FLOAT_CLASS);
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

    if (this._currentFilterColumn.dataType)
        firstFilterValue = jasonWidgets.common.convertValue(firstFilterValue, this._currentFilterColumn.dataType);

    filterValues.push({
        value: firstFilterValue,
        filterClause: this.firstFilterCombobox.selectedItem,
        logicalOperator: this.logicalOperatorCombobox.selectedItem
    });

    var secondFilterValue = this.secondFilterInput.value;
    if (this._currentFilterColumn.dataType)
        secondFilterValue = jasonWidgets.common.convertValue(secondFilterValue, this._currentFilterColumn.dataType);
    filterValues.push({
        value: secondFilterValue,
        filterClause: this.secondFilterCombobox.selectedItem,
        logicalOperator: this.secondFilterInput.value ? this.secondFilterCombobox.selectedItem : null
    });
    this.widget.filterBy(this._currentFilterField, filterValues);
}
/**
 * Clears any applied filters.
 */
jasonGridUIHelper.prototype._clearFilterControls = function () {
    this.firstFilterCombobox.ui.hideDropDownList();
    this.secondFilterCombobox.ui.hideDropDownList();
    this.logicalOperatorCombobox.ui.hideDropDownList();
    this.firstFilterCombobox.selectItem(0);
    this.secondFilterCombobox.selectItem(0);
    this.logicalOperatorCombobox.selectItem(0);
    this.firstFilterInput.value = "";
    this.secondFilterInput.value = "";
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
jasonGridUIHelper.prototype._prepareFilterValues = function () {
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
    this.filterValues.push({
        title: self.options.localization.filter.values.filterValueStartsWith,
        visible: true,
        symbol: 'startsWith'
    });
    this.filterValues.push({
        title: self.options.localization.filter.values.filterValueEndsWith,
        visible: true,
        symbol: 'endWith'
    });
    this.filterValues.push({
        title: self.options.localization.filter.values.filterValueContains,
        visible: true,
        symbol: 'contains'
    });
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

        var selectorString = 'th[' + GRID_COLUMN_FIELD_ATTR + "='" + column.fieldName + "']";

        var headerTH = this.gridHeaderTableRow.querySelectorAll(selectorString)[0];
        if (headerTH)
            headerTH.style.display = displayStyle;

        selectorString = "col[" + GRID_COLUMN_FIELD_ATTR + "='" + column.fieldName + "']";

        var headerCol = this.headerTableColGroup.querySelectorAll(selectorString)[0];
        if (headerCol)
            headerCol.style.display = displayStyle;

        var dataCol = this.dataTableColGroup.querySelectorAll("col[" + GRID_COLUMN_FIELD_ATTR + "='" + column.fieldName + "']")[0];
        if (dataCol)
            dataCol.style.display = displayStyle;
        
        var cellsToHide = document.querySelectorAll("td[jw-data-cell-id='" + column.index + "']");
        for (var i = 0; i <= cellsToHide.length - 1; i++) {
            cellsToHide[i].style.display = displayStyle;
        }
        var groupCells = this.gridDataTableBody.querySelectorAll(".group-row td");
        var colSpanValue = this.options.columns.filter(function (col) { return col.visible == true; }).length;
        for (var i = 0; i <= groupCells.length - 1; i++) {
            groupCells[i].setAttribute(COLSPAN_ATTR, colSpanValue);
        }
        //this._renderHeader();
        //this.renderUI(this._currentPage, this._pageCount);
        return false;
    }
    else
        return true;
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
            headerCellCaptionContainer.classList.add(GRID_HEADER_CELL_CAPTION_CONTAINER);

            var headerCellIconContainer = headerElement.appendChild(this.createElement("div"));
            headerCellIconContainer.classList.add(GRID_HEADER_CELL_ICON_CONTAINER);

            //var headerCellClearFloat = headerElement.appendChild(this.createElement("div"));
            //headerCellClearFloat.classList.add(CLEAR_FLOAT_CLASS);

            var tooltip = gridColumn.Tooltip ? gridColumn.Tooltip : gridColumn.caption;

            /*if the column is a group column then set explicit width.We do not want the grouping placeholder column to be too big*/
            if (gridColumn.groupColumn) {
                headerTableColElement.style.width = "25px";
                dataTableColElement.style.width = "25px";
            }
            else {
            headerTableColElement.setAttribute(GRID_COLUMN_FIELD_ATTR, gridColumn.fieldName);
            dataTableColElement.setAttribute(GRID_COLUMN_FIELD_ATTR, gridColumn.fieldName);
            }
            /*if the column is associated with a field.*/
            if (gridColumn.fieldName) {
                headerElement.setAttribute(GRID_COLUMN_ID_ATTR, columnIndex);
                headerElement.setAttribute(GRID_COLUMN_FIELD_ATTR, gridColumn.fieldName);
                headerElement.setAttribute(TITLE_ATTR, tooltip);
                var captionElement = headerCellCaptionContainer.appendChild(this.createElement("a"));
                captionElement.setAttribute("href", "javascript:void(0)");
                if (gridColumn.headerTemplate)
                    captionElement.innerHTML = gridColumn.headerTemplate;
                else
                    captionElement.appendChild(this.createTextNode(gridColumn.caption));
                this.eventManager.addEventListener(captionElement, CLICK_EVENT, this._onGridColumnCaptionClick, true);
                this.eventManager.addEventListener(captionElement, TOUCH_START_EVENT, function (touchEvent) {
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
                var gridColumnMenuIconAnchor = jw.htmlFactory.createJWButton(null,JW_ICON_MENU);
                gridColumnMenuIconAnchor.setAttribute(GRID_COLUMN_ID_ATTR, columnIndex);
                this.eventManager.addEventListener(gridColumnMenuIconAnchor, CLICK_EVENT, this._onGridColumnMenuIconClick,true);
                this.eventManager.addEventListener(gridColumnMenuIconAnchor, TOUCH_START_EVENT, function (touchEvent) {
                    //prevent default behavior and stop propagation.
                    touchEvent.preventDefault();
                    touchEvent.stopPropagation();
                    //simulating a mouse event by setting the button property to 0, which corresponds to the left mouse button.
                    touchEvent.button = 0;
                    self._onGridColumnMenuIconClick(touchEvent);
                },true);
                this.eventManager.addEventListener(gridColumnMenuIconAnchor, MOUSE_DOWN_EVENT, function (mouseEvent) { mouseEvent.stopPropagation(); }, true);
                headerCellIconContainer.appendChild(gridColumnMenuIconAnchor);
            }
            if (this.options.filtering == true && this.options.columnMenu == false) {
                var filterIconElement = this.createElement("i");
                filterIconElement.className = JW_ICON_SEARCH;
                filterIconElement.style.cssFloat = "right";
                filterIconElement.style.cursor = "pointer";
                this.eventManager.addEventListener(filterIconElement, CLICK_EVENT, this._onGridFilterButtonClick);
                headerCellIconContainer.appendChild(filterIconElement);
            }
        };
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
    jw.common.removeChildren(this.gridDataTableBody);
    //this.gridDataTableBody.innerHTML = "";

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
                    newRow.classList.add(GRID_TABLE_ALT_ROW_CLASS);
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
    newCell.setAttribute(COLSPAN_ATTR, this.options.columns.filter(function (col) { return col.visible == true;}).length);
    newCell.appendChild(this.createTextNode(this.options.localization.data.noData));
    newRow.appendChild(newCell);
    newRow.classList.add(GRID_TABLE_NO_DATA_ROW_CLASS);
    return newRow;
}
/**
 * Creates a TR element and associates it with a dataRow from the source data
 * @param {object} dataRow - Grid data row.
 */
jasonGridUIHelper.prototype._createRowElementFromData = function (dataRow) {
    var newRow = this.createElement("tr");
    newRow.setAttribute(DATA_ROW_ID_ATTR, dataRow.RowIndex);
    newRow.className = GRID_TABLE_ROW_CLASS;
    return newRow;
}
/**
 * Creates a TR element and associates it with a dataRow from the source data, and creates cells for the newly created containing data from the dataRow 
 * @param {object} dataRow - Grid data row.* 
 */
jasonGridUIHelper.prototype._createRowElementWithContentFromData = function (dataRow) {
    var newRow = this._createRowElementFromData(dataRow);
    if (this.options.customization.rowTemplate) {
        newRow.innerHTML = this.options.customization.rowTemplate;
        var dataAwareElements = newRow.querySelectorAll("*[" + this.options.customization.dataFieldAttribute + "]");
        for (var i = 0; i <= dataAwareElements.length - 1; i++) {
            var dataElement = dataAwareElements[i];
            jw.common.replaceNodeText(dataElement, dataRow[dataElement.getAttribute(this.options.customization.dataFieldAttribute)], true);
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
    if (dataColumn.groupColumn != true) {
        newCell.className = GRID_TABLE_CELL_CLASS;
        newCell.setAttribute(DATA_CELL_ID_ATTR, dataColumn.index);
        if (dataColumn.cellTemplate) {
            newCell.innerHTML = dataColumn.cellTemplate;
            var dataAwareElements = newCell.querySelectorAll("*["+ this.options.customization.dataFieldAttribute + "]");
            for (var i = 0; i <= dataAwareElements.length - 1; i++) {
                var dataElement = dataAwareElements[i];
                jw.common.replaceNodeText(dataElement, dataRow[dataElement.getAttribute(this.options.customization.dataFieldAttribute)], true);
            }
        } else {
            textNode = this.createTextNode(dataRow[dataColumn.fieldName]);
            newCell.appendChild(textNode);
        }
    }
    else
        newCell.className = "group-cell";
    return newCell;
}
/**
 * Create a TR grouping row element, with needed elements to provide expand/collapse functionality
 * @param {object} groupNode - HTMLElement
 */
jasonGridUIHelper.prototype._createGrouppingRow = function (groupNode) {
    var newRow = this.createElement("tr");
    var newCell = this.createElement("td");
    var iconNode = this.createElement("i");
    var self = this;
    iconNode.className = "jw-icon arrow-circle-bottom-2x";
    this.eventManager.addEventListener(iconNode, CLICK_EVENT, this._onGroupCollapseExpandIconClick);
    newRow.classList.add(GRID_TABLE_ROW_CLASS);
    newRow.classList.add(GRID_TABLE_GROUP_ROW_CLASS);
    newRow.setAttribute(DATA_GROUPING_LEVEL_ATTR, groupNode.level);
    newCell.setAttribute(COLSPAN_ATTR, this.options.columns.filter(function (col) { return col.visible == true; }).length);
    newCell.appendChild(iconNode);
    newCell.appendChild(this.createTextNode(groupNode.key));
    newCell.style.paddingLeft = groupNode.level * 25 + "px";
    newRow.appendChild(newCell);
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
    this.pagerContainer.classList.add(PAGER_CONTAINER_CLASS);
    this.pagerInfoContainer = this.createElement("div");
    this.pagerInfoContainer.classList.add(PAGER_CONTAINER_PAGE_INFO_CLASS);
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
    this.pagerInfo.setAttribute(TITLE_ATTR,pagerInfoText);
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
    if (jw.common.getVariableType(pageNumber) != jw.enums.variableType.number) {
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
            this.widget.triggerEvent(JW_EVENT_ON_PAGE_CHANGE, pageNumber);
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
    var collapseGroupLevel = parseInt(groupRow.getAttribute(DATA_GROUPING_LEVEL_ATTR));
    //iterating through the next row in the table body until the last child of under this group level.
    for (var i = groupRow.sectionRowIndex + 1; i <= this.gridDataTableBody.childNodes.length - 1; i++) {
        var currentRow = this.gridDataTableBody.childNodes[i];
        //if the row is a group row.
        if (currentRow.className.indexOf(GRID_TABLE_GROUP_ROW_CLASS) >= 0) {
            var currentRowGroupLevel = parseInt(currentRow.getAttribute(DATA_GROUPING_LEVEL_ATTR));
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
    var expandGroupLevel = parseInt(groupRow.getAttribute(DATA_GROUPING_LEVEL_ATTR));
    //iterating through the next row in the table body until the last child of under this group level.
    for (var i = groupRow.sectionRowIndex + 1; i <= this.gridDataTableBody.childNodes.length - 1; i++) {
        var currentRow = this.gridDataTableBody.childNodes[i];
        //if the row is a group row.
        if (currentRow.className.indexOf(GRID_TABLE_GROUP_ROW_CLASS) >= 0) {
            //the current group row expand state. Meaning if it was expanded or collapsed. 
            //this is useful when we are expanding a parent group, we want to restore the sub-groups
            //to their prior state before the parent group collapsing and hiding everything.
            var currentRowGroupExpandState = currentRow.getAttribute(DATA_GROUP_EXPANDED_ATTR);
            //current level of the group row.
            var currentRowGroupLevel = parseInt(currentRow.getAttribute(DATA_GROUPING_LEVEL_ATTR));
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
            var currentRowGroupLevel = currentRow.getAttribute(DATA_GROUPING_LEVEL_ATTR);

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
    grouppingRow.setAttribute(DATA_GROUP_EXPANDED_ATTR, "true");
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
            newRow.setAttribute(DATA_GROUPING_LEVEL_ATTR, groupNode.level);
            this.gridDataTableBody.appendChild(newRow);
        }
    }
}
/**
 * Renders grouped data requires special handling
 */
jasonGridUIHelper.prototype._renderGroupedData = function (groupedData) {
    jw.common.removeChildren(this.gridDataTableBody);
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
        var groupingFieldContainerRemove = this.createElement("a");
        var groupingFieldText = this.createElement("span");
        /*setting text of the grouping container*/
        groupingFieldText.appendChild(this.createTextNode(column.caption));
        groupingFieldContainer.setAttribute(DATA_GROUPING_FIELD_ATTR, column.fieldName);

        /*setting text and tooltip to the remove grouping field anchor*/
        var iconNode = this.createElement("i");
        iconNode.className = JW_ICON_CIRCLE_X;
        groupingFieldContainerRemove.appendChild(iconNode);
        groupingFieldContainerRemove.setAttribute(TITLE_ATTR, this.options.localization.grid.grouping.removeGrouping + column.caption);

        /*constructing the DOM*/
        groupingFieldContainer.appendChild(groupingFieldText);
        groupingFieldContainer.appendChild(groupingFieldContainerRemove);
        this.gridGroupingContainer.appendChild(groupingFieldContainer);
        this.gridGroupingContainer.setAttribute(TITLE_ATTR, column.caption);

        /*setting on click event for the remove anchor*/
        this.eventManager.addEventListener(groupingFieldContainerRemove, CLICK_EVENT, this._onGroupColumnRemoveClick, true);
       
        this.gridGroupingContainer.childNodes[0].style.display = "none";
        var newGrouping = this.widget.dataSource.grouping[this.widget.dataSource.grouping.length - 1];
        this.options.columns.splice(newGrouping.level, 0, { width: "25px", groupColumn: true, visible: true, groupField: column.fieldName });
        var headerCol = this.createElement("col");
        var dataCol = this.createElement("col");
        var headerTH = this.createElement("th");
        headerCol.style.width = "25px";
        dataCol.style.width = "25px";
        headerTH.setAttribute(GRID_GROUP_FIELD, column.fieldName);
        headerCol.setAttribute(GRID_GROUP_FIELD, column.fieldName);
        dataCol.setAttribute(GRID_GROUP_FIELD, column.fieldName);
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
    return jw.common.getElementsByAttribute(this.gridGroupingContainer, DATA_GROUPING_FIELD_ATTR, fieldName)[0];
}

/**
 * removes grouping UI in the group container, for a field.
 * @param {string} fieldName - field name to remove grouping for.
 */
jasonGridUIHelper.prototype._removeGroupByField = function (fieldName) {
    var groupingContainerToRemove = this._getGroupingContainerByFieldName(fieldName);
    if (groupingContainerToRemove)
        this.gridGroupingContainer.removeChild(groupingContainerToRemove);
    var headerTHToRemove = this.gridHeaderTableRow.querySelectorAll("th[" + GRID_GROUP_FIELD + "='" + fieldName + "']")[0];
    if (headerTHToRemove) {
        this.gridHeaderTableRow.removeChild(headerTHToRemove);
        var colHeaderToRemove = this.headerTableColGroup.querySelectorAll("col[" + GRID_GROUP_FIELD + "='" + fieldName + "']")[0];
        if (colHeaderToRemove)
            this.headerTableColGroup.removeChild(colHeaderToRemove);
        colHeaderToRemove = this.dataTableColGroup.querySelectorAll("col[" + GRID_GROUP_FIELD + "='" + fieldName + "']")[0];
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

//#region GRID MENU


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


// #region JASON GRID STRING LOCALIZATION - start*/
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
                    thElement.childNodes[x].setAttribute(TITLE_ATTR, localizationObject.grid.filtering.iconTooltip);
                }
            }
        }
        if (this.filterContainer) {
            //this.filterBtnApply.replaceChild(this.createTextNode(localizationObject.grid.filtering.applyButtonText), this.filterBtnApply.childNodes[1]);
            //this.filterBtnApply.setAttribute(TITLE_ATTR, localizationObject.grid.filtering.applyButtonTooltip);

            //this.filterBtnClear.replaceChild(this.createTextNode(localizationObject.grid.filtering.clearButtonText), this.filterBtnClear.childNodes[1]);
            //this.filterBtnClear.setAttribute(TITLE_ATTR, localizationObject.grid.filtering.clearButtonToollip);
        }
    }
    if (this.options.paging) {
        this.pagerButtonFirst.innerText = localizationObject.grid.paging.firstPageButton;
        this.pagerButtonPrior.innerText = localizationObject.grid.paging.priorPageButton;
        this.pagerButtonLast.innerText = localizationObject.grid.paging.lastPageButton;
        this.pagerButtonNext.innerText = localizationObject.grid.paging.nextPageButton;
        this.pagerInput.setAttribute(TITLE_ATTR, localizationObject.grid.paging.pagerInputTooltip);
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
// #endregion JASON GRID STRING LOCALIZATION - end*/

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
 * @property {object}   [sorting.multiple=false]                - multiple - Set to true to enable multiple sorting 
 * @property {boolean}  [columnMenu=true]                      - Set to true to enable column menu.
 * @property {boolean}  [resizing=true]                        - Set to true to enable column resizing.
 * @property {boolean}  [reordering=true]                      - Set to true to enable column reordering.
 * @property {object}   [customization={}]                   - Grid customization.
 * @property {any}      [customization.rowTemplate=undefined]       - HTML string or script tag containing HTML to be used to render grid rows.
 * @property {string}   [customization.dataFieldAttribute=undefined]- String that defines the attribute in a template HTML for a data field.Default is 'data-field'
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
 * @property {number} index         - If not specified a width value will be calculated for the column.Use it only when you want a specific width for a column.
 * @property {boolean} visible      - If false column is not rendered.
 * @property {string}  dataType     - Can be one of four data types. String,Date,Number and Boolean.
 * @property {boolean} isInMenu     - If false column is not displayed on the list of columns to be hidden/shown.
 * @property {boolean} columnMenu   - If false column does not show a column menu icon.
 * @property {any} headerTemplate   - HTML string or script tag containing HTML to be used to render column header.
 * @property {any} cellTemplate     - HTML string or script tag containing HTML to be used to render column cell.
 */

/**
 * @class
 * @name jasonGridFilterValue
 * @description A grid filter value.
 * @memberOf Grids
 * @property {any} value - filter value.
 * @property {object} filterClause - filter clause
 * @property {string} filterClause.symbol - filter clause symbol ['=','>','<','>=','<=','!=','startsWith','endsWith','contains']
 * @property {object} logicalOperator - filter logical operator
 * @property {string} logicalOperator.operator - operator ['and','or']
 */

var
JW_EVENT_ON_DATA_CHANGE = 'onDataChange',
JW_EVENT_ON_GROUP_BY_FIELD = 'onGroupbyField',
JW_EVENT_ON_UNGROUP_FIELD = 'onUnGroupField',
JW_EVENT_ON_SELECTION_CHANGE = 'onSelectionChange'
JW_EVENT_ON_GROUP_COLLAPSE = 'onGroupCollapse',
JW_EVENT_ON_GROUP_EXPAND = 'onGroupExpand'
JW_EVENT_ON_PAGE_CHANGE = 'onPageChange',
JW_EVENT_ON_COLUMN_POSITION_CHANGE = 'onColumnPositionChange'
JW_EVENT_ON_COLUMN_RESIZED = 'onColumnResize',
GRID_FILTER_CONTAINER_CLASS = "jw-grid-filter-container",
GRID_FILTER_HEADER_CLASS = "jw-grid-filter-header",
GRID_FILTER_BODY_CLASS = "jw-grid-filter-body",
GRID_FILTER_FOOTER_CLASS = "jw-grid-filter-footer",
GRID_FILTER_ACTION_BUTTON_CLASS = "jw-grid-filter-action-button",
JW_GRID_FILTER_BUTTON_CLEAR = "clear-filter",
JW_GRID_FILTER_BUTTON_APPLY = "apply-filter",
GRID_FIELD_HAS_FILTER = "jw-grid-column-has-filter";
GRID_FILTER_INPUT = "jw-filter-input";

PAGER_CONTAINER_CLASS = "jw-grid-pager",
PAGER_CONTAINER_PAGE_INFO_CLASS = "jw-grid-pager-info";

/**
 * @class
 * @name jasonGridEvents
 * @memberOf Grids
 * @description List of jasonGrid events
 * @property {function} onDataChange -  function onDataChange()
 * @property {function} onGroupByField - function onGroupByField(fieldName:string)
 * @property {function} onUnGroupField - function onUnGroupField(fieldName:string)
 * @property {function} onSelectionChange - function onSelectionChange(selectedRows:Array)
 * @property {function} onGroupCollapse - function onGroupCollapse()
 * @property {function} onGroupExpand - function onGroupExpand()
 * @property {function} onPageChange - function onPageChange(pageNumber:number)
 * @property {function} onColumnPositionChange - function onColumnPositionChange(positionInfo:{column , fromIndex , toIndex})
 * @property {function} onColumnResize -  function onColumnResize( resizeInfo:{column , newWidth})
 */


/**
 * @constructor
 * @memberOf Grids
 * @augments Common.jasonBaseWidget
 * @description A multi-purpose data grid, that supports grouping,multiple sorting,filtering and more.
 * @param {HTMLElement} htmlElement - DOM element that will contain the grid.
 * @param {Grids.jasonGridOptions} options - jasonGrid options. 
 * @property {Data.jasonDataSource} dataSource - Grid's underlying datasource.
 * @property {array} selectedRows - Currently selected rows.
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
    this.ui.renderUI();
    this.ui._createColumnMenu();
    this.ui._initializeEvents();
    this.ui.localizeStrings(this.options.localization);
}

//#region  private members*/

/**
 * Initializing customization templates.
 * @ignore
 */
jasonGrid.prototype._initializeTemplates = function () {
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
                        dataType: null
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
        var menuItemSortAsc = new jasonMenuItem();
        menuItemSortAsc.name = "mnuSortAsc";
        menuItemSortAsc.caption = this.options.localization.grid.columnMenu.sortAscending;
        menuItemSortAsc.title = menuItemSortAsc.caption;
        menuItemSortAsc.clickable = true;
        menuItemSortAsc.enabled = jasonWidgets.common.assigned(this.options.sorting);
        menuItemSortAsc.icon = JW_ICON_SORT_ASC;
        this.defaultGridColumnMenu.items.push(menuItemSortAsc);

        var menuItemSortDesc = new jasonMenuItem();
        menuItemSortDesc.name = "mnuSortDesc";
        menuItemSortDesc.caption = this.options.localization.grid.columnMenu.sortDescending;
        menuItemSortDesc.title = menuItemSortDesc.caption;
        menuItemSortDesc.enabled = jasonWidgets.common.assigned(this.options.sorting);
        menuItemSortDesc.clickable = true;
        menuItemSortDesc.icon = JW_ICON_SORT_DESC;
        this.defaultGridColumnMenu.items.push(menuItemSortDesc);
    }

    var menuItemColumns = new jasonMenuItem();
    menuItemColumns.name = "mnuColumns";
    menuItemColumns.caption = this.options.localization.grid.columnMenu.columns;
    menuItemColumns.title = menuItemColumns.caption;
    menuItemColumns.icon = JW_ICON_COLUMNS;
    this.defaultGridColumnMenu.items.push(menuItemColumns);

    if (this.options.filtering) {
        var menuItemFilter = new jasonMenuItem();
        menuItemFilter.name = "mnuFilter";
        menuItemFilter.caption = this.options.localization.grid.columnMenu.filter;
        menuItemFilter.title = menuItemFilter.caption;
        menuItemFilter.icon = JW_ICON_SEARCH;
        menuItemFilter.addEventListener(JW_EVENT_ON_MENU_ITEM_CONTENT_SHOW, this._onFilterShown, this);
        //menuItemFilter.onItemContentShown = this._onFilterShown;
        this.defaultGridColumnMenu.items.push(menuItemFilter);
    }

    var isDividerAdded = false;

    if (this.options.sorting) {
        this.defaultGridColumnMenu.items.push(createJasonMenuDividerItem());
        isDividerAdded = true;

        var menuItemClearSorting = new jasonMenuItem();
        menuItemClearSorting.name = "mnuClearSorting";
        menuItemClearSorting.caption = this.options.localization.grid.columnMenu.clearSorting;
        menuItemClearSorting.title = menuItemClearSorting.caption;
        menuItemClearSorting.enabled = jasonWidgets.common.assigned(this.options.sorting);
        menuItemClearSorting.clickable = true;
        menuItemClearSorting.icon = JW_ICON_CIRCLE_X;
        this.defaultGridColumnMenu.items.push(menuItemClearSorting);
    }

    if (this.options.filtering) {
        var menuItemClearFiltering = new jasonMenuItem();
        menuItemClearFiltering.name = "mnuClearFiltering";
        menuItemClearFiltering.caption = this.options.localization.grid.columnMenu.clearFilters;
        menuItemClearFiltering.title = menuItemClearFiltering.caption;
        menuItemClearFiltering.enabled = jasonWidgets.common.assigned(this.options.sorting);
        menuItemClearFiltering.clickable = true;
        menuItemClearFiltering.icon = JW_ICON_CIRCLE_X;
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
    this.triggerEvent(JW_EVENT_ON_DATA_CHANGE);
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
    this._initializeTemplates();
}
/**
 * Groups data by a field.
 * @param {string} fieldName - Field name to group by.
 */
jasonGrid.prototype.groupByField = function (fieldName) {
    if (fieldName) {
        this.dataSource.groupByField(fieldName);
        this.ui._groupByField(this._columnByField(fieldName));
        this.triggerEvent(JW_EVENT_ON_GROUP_BY_FIELD, fieldName);
    }
}
/**
 * Groups data by a field.
 * @param {string} fieldName - Field name to remove grouping for.
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
            this.triggerEvent(JW_EVENT_ON_UNGROUP_FIELD, fieldName);
        }

    }
}
/**
 * Sorts data by a field.
 * @param {string} fieldName - Field name to sort on.
 * @param {string} direction - Sort direction 'asc' or 'desc'. Default is 'asc'
 */
jasonGrid.prototype.sortBy = function (fieldName,direction) {
    if (fieldName) {
        direction = direction == void 0 ? 'asc' : direction;
        var column = this._columnByField(fieldName);
        var primerFunction = null;
        if (column.dataType) {
            var lowerCaseString = column.dataType.toLowerCase();
            switch (lowerCaseString) {
                case "string": { primerFunction = null; break; }
                case "int": { primerFunction = parseInt; break; }
                case "float": { primerFunction = parseFloat; break; }
                case "datetime": { primerFunction = Date.parse; break; }
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
 * @param {string} fieldName - Field name to sort on.
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
 * @param {jasonGridFilterValue[]} filterValues - filter values.
 */
jasonGrid.prototype.filterBy = function (fieldName, filterValues) {
    if (fieldName && filterValues) {
        this.dataSource.addFilter(fieldName, filterValues);
        this.dataSource.applyFilters();
        this.ui._goToPage(1, true);
        this.ui._sizeColumns();
        this.ui.columnMenu.ui.hideMenu();
        this.ui._currentTHElement.classList.add(GRID_FIELD_HAS_FILTER);
    }
}
/**
 * Clears filters by a field.If no field is defined, it clears all filters.
 * @param {string} fieldName - Field name to filter on.
 */
jasonGrid.prototype.clearFilter = function (fieldName) {
    if (fieldName) {
        this.dataSource.removeFilter(fieldName);
        this.ui._goToPage(1, true);
        this.ui._sizeColumns();
        this.ui.columnMenu.ui.hideMenu();
        this.ui._currentTHElement.classList.remove(GRID_FIELD_HAS_FILTER);
    }
}
/**
 * Navigates to a grid page, if paging is configured.
 * @param {number} pageNumber - Page number to navigate to.
 */
jasonGrid.prototype.goToPage = function (pageNumber) {
    if (pageNumber && this.options.paging) {
        this.ui._goToPage(pageNumber, true);
    }
}
/**
 * Shows a column if column is hidden.
 * @param {jasonGridColumn} column - Column to show.
 */
jasonGrid.prototype.showColumn = function (column) {
    if (column && !column.visible) {
        return this.ui._columnVisible(column, true);
    }
    return true;
}
/**
 * Hides a column if column is visible. Cannot hide if there is only one column in the grid.
 * @param {jasonGridColumn} column - Column to hide.
 */
jasonGrid.prototype.hideColumn = function (column) {
    if (column && column.visible) {
        return this.ui._columnVisible(column, false);
    }
    return true;
}
/**
 * Moves a column if column is visible. .
 * @param {jasonGridColumn} column - Column to move.
 * @param {number} newIndex - New index for the column.
 */
jasonGrid.prototype.moveColumnTo = function (column,newIndex) {
    jw.common.swapItemsInArray(this.options.columns, column.index, newIndex);
    this.ui.renderUI();
}
/**
 * Selects a data row and adds its to the selectedRows array, if multiple select is on.
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
/**
 * Expands a group.
 * @ignore
 */
jasonGrid.prototype.expandGroup = function () {
    throw new Error("Not implemented yet.");
}
/**
 * Collapses a group.
 * @ignore
 */
jasonGrid.prototype.collapseGroup = function () {
    throw new Error("Not implemented yet.");
}
/**
 * Shows filter for a column, if filtering is on and column menu is off.
 */
jasonGrid.prototype.collapseGroup = function (column) {
    throw new Error("Not implemented yet.");
}
//#endregion






/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


jasonDatePicker.prototype = Object.create(jasonBaseWidget.prototype);
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
 * @property {boolean}  [readOnly=false]      - If true does not allow typing. Default false.
 * @property {date}     [date=now]          - Date value.
 * @property {string}   [mode=date]   - Date or DateTime mode.
 */

/**
 * @class
 * @name jasonDatePickerEvents
 * @description List of events for the DatePicker.
 * @memberOf Date/Time
 * @property {function} onChange - function(value : date)
 */


/**
 * @constructor
 * @description Datepicker widget.
 * @memberOf Date/Time
 * @augments Common.jasonBaseWidget
 * @param {HTMLElement} htmlElement - DOM element that will contain the date picker.
 * @param {Date/Time.jasonDatePickerOptions} options - jasonDatePicker options. 
 * @property {date} date - Date value of the widget.
 */
function jasonDatePicker(htmlElement, options) {
    this.defaultOptions = {
        displayFormat: jasonWidgets.localizationManager.localeDateFormat,
        mode:'date'
    };
    jasonBaseWidget.call(this, "jasonDatePicker", htmlElement, options, jasonDatePickerUIHelper);
    this._date = jasonWidgets.common.dateOf(this.options.date ? this.options.date : new Date());
    this.ui.renderUI();
}
/**
 * Date read-only property.
 * @ignore
 */
Object.defineProperty(jasonDatePicker.prototype, "date", {
    get: function () {
        return this._date;
    },
    set:function(value){
        this._setDate(value);
    },
    enumerable: true,
    writeable: false
});
/**
 * sets date value
 * @ignore
 * @property {date} newDate - the new date value.
 */
jasonDatePicker.prototype._setDate = function (newDate) {
    if (newDate && jw.common.dateComparison(this._date,newDate) != 0) {
        this._date = newDate;
        this.ui.updateDateFormattedValue();
        this.ui.changed = false;
        this.triggerEvent(JW_EVENT_ON_CHANGE, this._date);
    }
}
/**
 * @ignore
 */
jasonDatePicker.prototype.parseDateValue = function (dateStringValue) {
    var isDateWithWords = dateStringValue.match(/\D\W/g);
    var newDate = null;
    var currentDate = new Date();
    if (isDateWithWords) {
        newDate = new Date(dateStringValue);
        
        if (dateStringValue.indexOf(currentDate.getFullYear()) < 0) {
            newDate.setYear(currentDate.getFullYear());
        }
        if (!dateStringValue.match(/\[0-9]/g)) {
            newDate.setMonth(currentDate.getMonth());
        }
        newDate = jasonWidgets.common.dateOf(newDate);
    }
    else {
        var nonNumeric = dateStringValue.match(/[^0-9]/g);
        var splittedValue = nonNumeric? dateStringValue.split(nonNumeric[0]) : [dateStringValue];
        var splittedFormat = nonNumeric ? this.options.displayFormat.split(nonNumeric[0]) : this.options.displayFormat.split(jw.localizationManager.localeDateSeparator);
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
        if(!day)
            day = 1;
        if(!month)
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
    if (newDate) {
        this.date = newDate;
    }
}

jasonDatePickerUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonDatePickerUIHelper.prototype.constructor = jasonDatePickerUIHelper;

var
    DATE_PICKER_CLASS = "jw-date-picker";
/**
 * @constructor
 * @ignore
 */
function jasonDatePickerUIHelper(widget, htmlElement) {
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);
    this.inputBlur = this.inputBlur.bind(this);
    this.inputKeyDown = this.inputKeyDown.bind(this);
    this.buttonClick = this.buttonClick.bind(this);
    this.onCalendarDateChange = this.onCalendarDateChange.bind(this);
    this.datePickerSetDateFlag = false;
}


/**
 * Renders the datepicker UI.
 */
jasonDatePickerUIHelper.prototype.renderUI = function () {
    var self = this;
    if (!this.htmlElement.classList.contains(DATE_PICKER_CLASS)) {
        this.htmlElement.classList.add(DATE_PICKER_CLASS);


        this.datePickerInput = jw.htmlFactory.createJWTextInput();
        //this.datePickerInput.classList.add("jw-text-input");
        ////this.datePickerInput.setAttribute(TABINDEX_ATTR, jasonWidgets.common.getNextTabIndex());
        //this.datePickerInput.setAttribute(TYPE_ATTR, "text");

        this.datePickerButton = jw.htmlFactory.createJWButton(null, JW_ICON_CALENDAR);
        //this.datePickerButton.setAttribute("href", "javascript:void(0)");
        ////this.datePickerButton.setAttribute(TABINDEX_ATTR, jasonWidgets.common.getNextTabIndex());
        //this.datePickerButton.classList.add("jw-button");
        //this.datePickerButtonIcon = this.createElement("i");
        //this.datePickerButtonIcon.className = JW_ICON_CALENDAR;


        this.widget.readOnly = this.options.readOnly ? this.options.readOnly : false;

        if (this.widget.options.placeholder)
            this.datePickerInput.setAttribute(PLACEHOLDER_ATTR, this.widget.options.placeholder);
        if (this.widget.readOnly == true)
            this.datePickerInput.setAttribute(READONLY_ATTR, this.widget.readOnly);

        this.htmlElement.appendChild(this.datePickerInput);
        this.htmlElement.appendChild(this.datePickerButton);

        this.datePickerInput.value = jasonWidgets.common.formatDateTime(this.widget.date, this.options.displayFormat);
        this.calendarContainer = this.createElement("div");
        document.body.appendChild(this.calendarContainer);
        //this.htmlElement.appendChild(this.calendarContainer);
        this.jasonCalendar = new jasonCalendar(this.calendarContainer, { invokable: true, autoHide: true, invokableElement: this.htmlElement });
        this.jasonCalendar.addEventListener(JW_EVENT_ON_CHANGE, this.onCalendarDateChange);

        this.initializeEvents();
    }
}
/**
 * 
 */
jasonDatePickerUIHelper.prototype.initializeEvents = function () {
    var self = this;

    this.eventManager.addEventListener(this.datePickerButton, CLICK_EVENT, this.buttonClick,true);
    this.eventManager.addEventListener(this.datePickerInput, BLUR_EVENT, this.inputBlur);
    this.eventManager.addEventListener(this.datePickerInput, KEY_DOWN_EVENT, this.inputKeyDown);
}
/*
 * 
 */
jasonDatePickerUIHelper.prototype.updateDateFormattedValue = function () {
    this.datePickerInput.value = jasonWidgets.common.formatDateTime(this.widget.date, this.options.displayFormat);
}
/**
 * 
 */
jasonDatePickerUIHelper.prototype.inputBlur = function (blurEvent) {
    if (this.datePickerInput.value.length > 0 && this.changed) {
        this.widget.parseDateValue(this.datePickerInput.value);
        this.updateDateFormattedValue();
    }
}
jasonDatePickerUIHelper.prototype.inputKeyDown = function (keydownEvent) {
    var keyCode = keydownEvent.which || keydownEvent.keyCode;
    this.changed = true;
    if (keyCode == 13 && this.datePickerInput.value.length > 0) {
        this.widget.parseDateValue(this.datePickerInput.value);
        this.updateDateFormattedValue();
    }
}
/**
 * 
 */
jasonDatePickerUIHelper.prototype.onCalendarDateChange = function (sender,newDate) {
    this.widget.date = newDate;
    this.updateDateFormattedValue();
    if (this.jasonCalendar)
        this.jasonCalendar.ui.hideCalendar();
    this.datePickerInput.focus();
}

/**
 * 
 */
jasonDatePickerUIHelper.prototype.buttonClick = function (clickEvent) {
    this.jasonCalendar.ui.showCalendar(this.widget.date);
    clickEvent.stopPropagation();
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
 * @property {string}   [displayFormat=browser locale format] - Defines the display format of the widget.
 * @property {string}   [placeholder=""]   - Defines the placeholder text value.
 * @property {boolean}  [readOnly=false]      - If true does not allow typing.
 * @property {date}     [time=now]          - Time value.
 * @property {number}   [interval=15]      - Minute interval of which the time picker will display the items.
 */

/**
 * @class
 * @name jasonTimePickerEvents
 * @description List of events for the TimePicker.
 * @memberOf Date/Time
 * @property {function} onChange - function(value : date)
 */

/**
 * @constructor
 * @description Time picker widget.
 * @memberOf Date/Time
 * @augments Common.jasonBaseWidget
 * @param {HTMLElement} htmlElement - DOM element that will contain the time picker.
 * @param {Date/Time.jasonTimePickerOptions} options - jasonTimePicker options.
 * @property {date} time - Time value of the widget.
 */
function jasonTimePicker(htmlElement, options) {
    this.defaultOptions = {
        displayFormat: jasonWidgets.localizationManager.localeTimeFormat,
        interval: 15,
        keyFieldName: 'key',
        displayFields: ['formattedTime'],
        displayFormatString: "{0}"
    };
    jasonWidgets.common.extendObject(this.defaultOptions, options);
    this.prepareData(options);
    jasonCombobox.call(this, htmlElement, options);
    this._hasKeyStroke = false;
    this._time = jasonWidgets.common.timeOf(this.options.time ? this.options.time : new Date());
    this.cmbInputOnBlur = this.cmbInputOnBlur.bind(this);
    this.cmbInputKeyDown = this.cmbInputKeyDown.bind(this);
    this.eventManager.addEventListener(this.ui.comboboxInput, BLUR_EVENT, this.cmbInputOnBlur);
    this.eventManager.addEventListener(this.ui.comboboxInput, KEY_DOWN_EVENT, this.cmbInputKeyDown);
    //this.ui.comboboxButtonIcon.className = JW_ICON_CLOCK;
}

/**
 * Date read-only property.
 * @ignore
 */
Object.defineProperty(jasonTimePicker.prototype, "time", {
    get: function () {
        return jw.common.timeOf(this._time);
    },
    set:function(value){
        this._setTime(value);
    },
    enumerable: true,
    writeable: false
});

/**
 * preparing drop down data for the time picker
 * @ignore
 */
jasonTimePicker.prototype.prepareData = function (options) {
    var timeData = [];
    var timeDataLength = Math.round((1440 / options.interval));
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
        timeItem.formattedTime = jasonWidgets.common.formatDateTime(timeItem.time,options.displayFormat)
        timeData.push(timeItem);
    }
    options.data = timeData;
}
/**
 * sets time
 * @ignore
 * @property {date} newTime - the new time value.
 */
jasonTimePicker.prototype._setTime = function (newTime) {
    if (newTime) {
        var currentTime = this._time;
        var newTime = newTime;
        if (jw.common.timeComparison(currentTime,newTime) != jw.enums.comparison.equal) {
            this._time = newTime;
            this._selectItemFromTime(this._time);
            this.triggerEvent(JW_EVENT_ON_CHANGE, this._time);
        }
        this.ui.comboboxInput.value = jw.common.formatDateTime(this._time, this.options.displayFormat);
    }
}
/**
 * Sets the selected and selecteditemindex from a time value if found.
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
        this.selectedItem = timeItem;
        this.selectedItemIndex = timeItem._jwRowId;
    }
}
/**
 * parsing string input value
 * @ignore
 */
jasonTimePicker.prototype.parseTimeValue = function (timeStringValue) {
    var isAM = false;
    var isPM = false;
    if(jw.localizationManager.isTwelveHourClock){
        isAM = timeStringValue.indexOf(jw.localizationManager.anteMeridiemString) >= 0;
        isPM = timeStringValue.indexOf(jw.localizationManager.postMeridiemString) >= 0;
        timeStringValue = isAM ? timeStringValue.replace(jw.localizationManager.anteMeridiemString,"") : timeStringValue.replace(jw.localizationManager.postMeridiemString,"");
    }
    var nonNumeric = timeStringValue.match(/[^0-9]/g);
    var timeSplitter = nonNumeric ? nonNumeric[0] : jw.localizationManager.localeTimeSeparator;
    var splittedValue = timeStringValue.split(timeSplitter);
    var splittedFormat = this.options.displayFormat.split(timeSplitter);
    var hours = null;
    var mins = null;
    var seconds = null;
    var newTime = null;
    for (var i = 0; i <= splittedFormat.length - 1; i++) {
        if (splittedFormat[i].indexOf("h") >= 0) {
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
    if (newTime) {
        this.time = newTime;
        this._hasKeyStroke = false;
    }
}
/**
 * onblur event handler
 * @ignore
 */
jasonTimePicker.prototype.cmbInputOnBlur = function (blurEvent) {
    if (this.ui.comboboxInput.value.length > 0 && this._hasKeyStroke) {
        this.parseTimeValue(this.ui.comboboxInput.value);
    }
}
/**
 * onblur event handler
 * @ignore
 */
jasonTimePicker.prototype.cmbInputKeyDown = function (keyDownEvent) {
    this._hasKeyStroke = true;
    var keyCode = keyDownEvent.which || keyDownEvent.keyCode;
    switch (keyCode) {
        case 13: {//enter key
            if (this.ui.comboboxInput.value.length > 0) {
                this.parseTimeValue(this.ui.comboboxInput.value);
                this.ui.scrollSelectedIntoView();
            }
            break;
        }
    }
}