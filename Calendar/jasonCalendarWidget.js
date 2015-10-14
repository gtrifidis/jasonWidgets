/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


jasonCalendarWidget.prototype = Object.create(jasonBaseWidget.prototype);
jasonCalendarWidget.prototype.constructor = jasonCalendarWidget;

/**
 * @name jasonCalendarOptions
 * @property {boolean}  Invokable        - If true the calendar is shown when it's invoked.
 * @property {object}   InvokableElement - Element which upon clicked it will display the calendar.
 * @property {boolean}  AutoHide         - If true the calendar is hidden if there is a mouse click outside the calendar and the calendar is invokable.
 * @property {function} OnDateChange     - Occurs when user chooses a date.
 * @property {array}    SpecialDates     - List of special dates. Default is empty.
 * @property {number}   FirstDayOfWeek   - Set the first day of the week. Default is Monday.Index is zero based.
 * @property {boolean}  MultiSelect      - Allows date multi selection. Default is false.
 * @property {boolean}  ShowWeekNumber   - Shows week number. Default is false.
 * @property {boolean}  RangeSelect      - Allows date range selection. Similar to multi but the dates must consecutive. Default is false.
 * @property {number}   Width            - Set the width of the calendar control in pixels.
 * @property {number}   Height           - Set the height of the calendar control in pixels.
 * @property {string}   CalendarMode     - Sets the mode of the calendar. Possible values [days,months,years,decades,centuries]. Default is "days".
 */

function jasonCalendarItem() {
    this.DayName = null;
    this.DayShortName = null;
    this.Day = null;
    this.Month = null;
    this.MonthName = null;
    this.MonthShortName = null;
    this.Year = null;
    this.WeekNumber = null;
    this.DecadeStart = null;
    this.DecadeStop = null;
    this.CenturyStart = null;
    this.CenturyStop = null;
    this.ToolTip = null;
    this.ClassList = [];
    this.DisplayValue = null;
}


/**
 * jasonCalendar widget.
 */
function jasonCalendarWidget(htmlElement, options) {
    jasonBaseWidget.call(this, "jasonCalendarWidget",htmlElement,new jasonCalendarWidgetUIHelper(this, htmlElement));
    jasonWidgets.common.extendObject({
        Invokable: false,
        AutoHide: false,
        InvokableElement: null,
        FirstDayOfWeek: 5,
        Width: 300,
        Height:200,
        CalendarMode: "days",
        Events: { OnDateChange: null }
    }, this.defaultOptions);
    this.initialize(options);
    this.options.Localization = jasonWidgets.localizationManager.CurrentLanguage ? jasonWidgets.localizationManager.CurrentLanguage.Calendar : this.options.Localization;
    this.date = this.options.Invokable ? null : jasonWidgets.common.dateOf(new Date());
    this.specialDates = [];
    this.month = null;
    this.year = null;
    this.decade = null;
    this.century = null;
    this.ui.renderUI();
}
/**
 * Date read-only property.
 */
Object.defineProperty(jasonCalendarWidget.prototype, "Date", {
    get: function () {
        return this.date;
    },
    enumerable: true,
    configurable: true
});
/**
 * SpecialDates read-only property.
 */
Object.defineProperty(jasonCalendarWidget.prototype, "SpecialDates", {
    get: function () {
        return this.specialDates;
    },
    enumerable: true,
    configurable: true
});
/**
 * Sets the date value of the calendar
 * @property {date} date - New date value.
 */
jasonCalendarWidget.prototype.setDate = function(date){
    this.date = date;
}
/**
 * Add special date.
 */
jasonCalendarWidget.prototype.addSpecialDate = function (date,cssClass,toolTip) {
    this.specialDates.push({date:date,css:cssClass,toolTip:toolTip});
}

/**
 * Create calendar item
 */
jasonCalendarWidget.prototype.createCalendarItem = function (date,month,year) {
    var result = new jasonCalendarItem();
    result.Year = year;
    result.Month = month;
    result.Day = date.getDate();
    var weekDay = date.getDay();
    weekDay = this.options.Localization.Days[weekDay];
    result.DayName = weekDay.Name;
    result.DayShortName = weekDay.ShortName;
    var monthDescr = this.options.Localization.Months[month - 1 < 0 ? 0 : month - 1];
    result.MonthName = monthDescr.Name;
    result.MonthShortName = monthDescr.ShortName;
    result.DisplayValue = result.Day;
    return result;
}

/**
 * Generates days
 */
jasonCalendarWidget.prototype.generateDays = function (year,month) {
    var result = [];
    var daysInMonth = jasonWidgets.common.daysInMonth(year, month);
    var firstDateOfMonth = new Date(year, month - 1, 1);
    var weekDayFirstDayOfMonth = firstDateOfMonth.getDay();
    var milliSecondsInaDay = 86400000;


    var daysToAddBefore = Math.abs(this.options.FirstDayOfWeek - weekDayFirstDayOfMonth);
    for (var x = daysToAddBefore; x >= 1; x--) {
        var dayBefore = firstDateOfMonth.getTime() - (x * milliSecondsInaDay);
        var dateBefore = new Date();
        dateBefore.setTime(dayBefore);
        result.push(this.createCalendarItem(dateBefore,month == 12 ? 1 : month -1,month == 12 ? year-1 : year));
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
        result.push(this.createCalendarItem(dateAfter, month == 12 ? 1 : month + 1, month == 12 ? year + 1 : year));
    }
    return result;
}


/**
 * Generates months
 */
jasonCalendarWidget.prototype.generateMonths = function () {
    var result = [];
    for (var i = 0 ; i <= 11; i++) {
        var calendarItem = new jasonCalendarItem();
        calendarItem.Month = i + 1;
        var month = this.options.Localization.Months[i];
        calendarItem.MonthName = month.Name;
        calendarItem.MonthShortName = month.ShortName;
        calendarItem.DisplayValue = month.ShortName;
        result.push(calendarItem);
    }
    return result;
}

/**
 * Generates years
 */
jasonCalendarWidget.prototype.generateYears = function (decadeStart,decadeStop) {
    var result = [];
    for (var i = decadeStart ; i <= decadeStop; i++) {
        var calendarItem = new jasonCalendarItem();
        calendarItem.Year = i;
        calendarItem.DecadeStart = decadeStart;
        calendarItem.DecadeStop = decadeStop;
        result.push(calendarItem);
    }
    return result;
}


/**
 * Generates decades
 */
jasonCalendarWidget.prototype.generateDecades = function (centuryStart, centuryStop) {
    var result = [];
    for (var i = 0 ; i <= 9; i++) {
        var calendarItem = new jasonCalendarItem();
        var previousItem = result[i-1];
        calendarItem.DecadeStart = i == 0 ? centuryStart : previousItem.DecadeStop + 1;
        calendarItem.DecadeStop = i == 0 ? centuryStart + 9 : calendarItem.DecadeStart + 9;
        result.push(calendarItem);
    }
    return result;
}

jasonCalendarWidget.prototype.generateCalendarItems = function (date) {
    var today = date ? date : new Date();
    this.date = today;
    switch(this.options.CalendarMode){
        case "days":{
            return this.generateDays(today.getFullYear(),today.getMonth()+1);
        }
        case "months":{
            return this.generateMonths();
        }
        case "years":{
            return this.generateYears();
        }
        case "decades":{
            return this.generateDecades();
        }
        case "centuries":{
            break;
        }
        default:return this.generateDays(today.getYear(),today.getMonth());
    }
}

jasonCalendarWidget.prototype.getRowDivisionCount = function () {
    switch (this.options.CalendarMode) {
        case "days": {
            return 7
        }
        case "months": {
            return 3;
        }
        case "years": {
            return 7;
        }
        case "decades": {
            return 3;
        }
        case "centuries": {
            return 1;
        }
        default: return 7;
    }
}

jasonCalendarWidgetUIHelper.prototype = Object.create(jasonWidgetUIHelper.prototype);
jasonCalendarWidgetUIHelper.prototype.constructor = jasonCalendarWidgetUIHelper;
/**
 * jasonCalendar UI helper class. Manages HTML and UI events
 */
function jasonCalendarWidgetUIHelper(widget,htmlElement) {
    jasonWidgetUIHelper.call(this, widget,htmlElement);
    this.CALENDAR = "jw-calendar";
    this.CALENDAR_HEADER = "jw-calendar-header";
    this.CALENDAR_BODY = "jw-calendar-body";
    this.CALENDAR_FOOTER = "jw-calendar-footer";
    this.CALENDAR_GO_BACK = "jw-calendar-back";
    this.CALENDAR_GO_FORWARD = "jw-calendar-forward";
    this.CALENDAR_DISPLAY = "jw-calendar-display";
    this.CALENDAR_TABLE_MONTHS = "month-view";
    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
    this.calendarDisplayClick = this.calendarDisplayClick.bind(this);
}
/**
 * Renders the calendar UI.
 */
jasonCalendarWidgetUIHelper.prototype.renderUI = function () {
    this.htmlElement.style.width = this.widget.options.Width + "px";
    this.htmlElement.style.height = this.widget.options.Height + "px";
    this.htmlElement.classList.add(this.CALENDAR);
    this.renderHeader();
    this.renderBody();
    this.renderFooter();
}
/**
 * Renders calendar header
 */
jasonCalendarWidgetUIHelper.prototype.renderHeader = function () {
    this.calendarHeader = this.createElement("div");
    this.calendarHeader.classList.add(this.CALENDAR_HEADER);

    this.calendarGoBack = this.createElement("div");
    this.calendarGoBack.classList.add(this.CALENDAR_GO_BACK);
    this.calendarGoBackButton = this.createElement("i");
    this.calendarGoBackButton.className = "jw-icon arrow-thick-left-2x";
    this.calendarGoBack.appendChild(this.calendarGoBackButton);
    this.calendarGoBackButton.addEventListener("click", this.goBack);

    this.calendarDisplay = this.createElement("div");
    this.calendarDisplay.classList.add(this.CALENDAR_DISPLAY);
    this.calendarDisplay.addEventListener("click", this.calendarDisplayClick);

    this.calendarGoForward = this.createElement("div");
    this.calendarGoForward.classList.add(this.CALENDAR_GO_FORWARD);
    this.calendarGoForwardButton = this.createElement("i");
    this.calendarGoForwardButton.className = "jw-icon arrow-thick-right-2x";
    this.calendarGoForward.appendChild(this.calendarGoForwardButton);
    this.calendarGoForwardButton.addEventListener("click", this.goForward);

    this.calendarHeader.appendChild(this.calendarGoBack);
    this.calendarHeader.appendChild(this.calendarDisplay);
    this.calendarHeader.appendChild(this.calendarGoForward);

    this.htmlElement.appendChild(this.calendarHeader);
}
/**
 * Renders calendar body
 */
jasonCalendarWidgetUIHelper.prototype.renderBody = function () {
    this.calendarBody = this.createElement("div");
    this.calendarBody.classList.add(this.CALENDAR_BODY);
    this.calendarTable = this.createElement("table");
    this.calendarBody.appendChild(this.calendarTable);
    this.renderCalendarItems();
    this.htmlElement.appendChild(this.calendarBody);
}
/**
 * Renders calendars items to the calendar body
 */
jasonCalendarWidgetUIHelper.prototype.renderCalendarItems = function (itemsToRender) {
    this.calendarTable.innerHTML = "";
    this.calendarTable.classList = [];
    if (this.widget.options.CalendarMode == "months")
        this.calendarTable.classList.add(this.CALENDAR_TABLE_MONTHS);
    var calendarTableBody = this.createElement("tbody");
    var calendarItemsToRender = itemsToRender ? itemsToRender : this.widget.generateCalendarItems();
    var rowDivisionCount = this.widget.getRowDivisionCount();
    if (this.widget.options.CalendarMode == "days") {
        var calendarTableHeader = this.createElement("thead");
        var calendarHeaderRow = this.createElement("tr");
        calendarTableHeader.appendChild(calendarHeaderRow);
        for (var i = 0; i <= 6; i++) {
            var calendarTableHeaderCell = this.createElement("th");
            var headerCellCaption = this.createElement("span");
            headerCellCaption.appendChild(this.createTextNode(calendarItemsToRender[i].DayShortName));
            calendarTableHeaderCell.appendChild(headerCellCaption);
            calendarHeaderRow.appendChild(calendarTableHeaderCell);
        }
        this.calendarTable.appendChild(calendarTableHeader);
    }
    this.calendarTable.appendChild(calendarTableBody);
    for (var x = 0; x <= calendarItemsToRender.length - 1; x++) {
        var tableRow;
        if (x == 0 || x % rowDivisionCount == 0) {
            tableRow = this.createElement("tr");
            calendarTableBody.appendChild(tableRow);
        }
        var tableCell = this.createElement("td");
        tableCell.appendChild(this.createTextNode(calendarItemsToRender[x].DisplayValue));
        tableRow.appendChild(tableCell);
    }
    this.updateCalendarDisplay();
}
/**
 * 
 */
jasonCalendarWidgetUIHelper.prototype.updateCalendarDisplay = function () {
    var calendarDisplayText = "";
    var month = this.widget.date.getMonth();
    var year = this.widget.date.getFullYear();
    switch (this.widget.options.CalendarMode) {
        case "days": {
            month = this.widget.options.Localization.Months[month];
            calendarDisplayText = jasonWidgets.common.formatString("{0} {1}", [month.Name,year]);
            break;
        }
        case "months": {
            calendarDisplayText = jasonWidgets.common.formatString("{0}", [year]);
            break;
        }
        case "years": {
            break;
        }
        case "decades": {
            break;
        }
        case "centuries": {
            break;
        }
        default: date = null;
    }
    jasonWidgets.common.replaceNodeText(this.calendarDisplay, calendarDisplayText,true);
}
/**
 * Renders calendar footer.
 */
jasonCalendarWidgetUIHelper.prototype.renderFooter = function () {
    this.calendarFooter = this.createElement("div");
    this.calendarFooter.classList.add(this.CALENDAR_FOOTER);
    this.htmlElement.appendChild(this.calendarFooter);
}
/**
 * 
 */
jasonCalendarWidgetUIHelper.prototype.calendarNavigate = function (clickEvent,direction) {
    var date = null;
    var month = this.widget.date.getMonth();
    var year = this.widget.date.getFullYear();
    switch (this.widget.options.CalendarMode) {
        case "days": {
            if (direction == "back") {
                year = month == 0 ? year - 1 : year;
                month = month == 0 ? 11 : month - 1;
            }
            if (direction == "forward") {
                year = month == 11 ? year + 1 : year;
                month = month == 11 ? 0 : month + 1;
            }
            date = new Date(year, month, 1);
            break;
        }
        case "months": {
            if (direction == "back") {
                year = month == 0 ? year - 1 : year;
            }
            if (direction == "forward") {
                year = month == 11 ? year + 1 : year;
            }
            date = new Date(year, month, 1);
            break;
        }
        case "years": {
            break;
        }
        case "decades": {
            break;
        }
        case "centuries": {
            break;
        }
        default: date = null;
    }
    return date;
}

/**
 * 
 */
jasonCalendarWidgetUIHelper.prototype.goBack = function (clickEvent) {
    var itemsToRender = this.widget.generateCalendarItems(this.calendarNavigate(clickEvent,"back"));
    this.renderCalendarItems(itemsToRender);
}
/**
 * 
 */
jasonCalendarWidgetUIHelper.prototype.goForward = function (clickEvent) {
    var itemsToRender = this.widget.generateCalendarItems(this.calendarNavigate(clickEvent, "forward"));
    this.renderCalendarItems(itemsToRender);
}

/**
 * 
 */
jasonCalendarWidgetUIHelper.prototype.calendarDisplayClick = function (clickEvent) {
    if (this.widget.options.CalendarMode == "decades")
        this.widget.options.CalendarMode = "centuries";

    if (this.widget.options.CalendarMode == "years")
        this.widget.options.CalendarMode = "decades";

    if (this.widget.options.CalendarMode == "months")
        this.widget.options.CalendarMode = "years";

    if (this.widget.options.CalendarMode == "days")
        this.widget.options.CalendarMode = "months";

    var itemsToRender = this.widget.generateCalendarItems(this.calendarNavigate(clickEvent, "forward"));
    this.renderCalendarItems(itemsToRender);
}

