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
        this.timeButton.htmlElement.classList.remove(jw.DOM.classes.JW_BUTTON_STANDALONE);

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