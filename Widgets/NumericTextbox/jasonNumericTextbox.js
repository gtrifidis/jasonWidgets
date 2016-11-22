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