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
 * @property {boolean}  [readOnly=false]      - If true, does not allow typing. Default is false.
 * @property {date}     [date=now]          - Date value.
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
        this.jasonCalendar = new jasonCalendar(this.calendarContainer, { invokable: true, autoHide: true, invokableElement: this.htmlElement, width:this.options.width });
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
    //clickEvent.stopPropagation();
}