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
