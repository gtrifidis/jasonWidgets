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