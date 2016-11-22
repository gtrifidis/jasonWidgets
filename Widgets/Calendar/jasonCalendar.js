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