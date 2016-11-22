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
