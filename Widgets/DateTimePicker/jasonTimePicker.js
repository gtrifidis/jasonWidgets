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
