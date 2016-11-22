/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonButtonTextbox.prototype = Object.create(jasonTextbox.prototype);
jasonButtonTextbox.prototype.constructor = jasonButtonTextbox;

/**
 * @class
 * @name jasonButtonTextboxOptions
 * @description Configuration for the ButtonTextbox widget.
 * @memberOf Editors
 * @augments Common.jasonWidgetOptions
 * @property {Globals.jw.DOM.icons} [icon=undefined] - Icon class for the button.
 * @property {string} title - Button title.
 */

/**
 * @event Editors.jasonButtonTextbox#onChange
 * @description Occurs when the button text is changed.
 * @type {object}
 * @property {Editors.jasonButtonTextbox} sender - The button text box instance.
 * @property {any} value - The new value.
 */

/**
 * @event Editors.jasonButtonTextbox#onButtonClick
 * @description Occurs when the button is clicked.
 * @type {object}
 * @property {object} event - The event object.
 * @property {Editors.jasonButtonTextbox} sender - The button text box instance.
 */

/**
 * jasonButtonTextbox
 * @constructor
 * @descrption Button textbox control widget.
 * @memberOf Editors
 * @augments Editors.jasonTextbox
 * @param {HTMLElement} htmlElement - DOM element that will contain the jasonButtonTextbox.
 * @param {Editors.jasonButtonTextboxOptions} options - Button textbox control options. 
 * @property {number} value - Button value.
 * @fires Editors.jasonButtonTextbox#event:onChange
 * @fires Editors.jasonButtonTextbox#event:onButtonClick
 */
function jasonButtonTextbox(htmlElement, options, nameSpace, uiHelper) {
    if (!this.defaultOptions) {
        this.defaultOptions = {
        };
    }
    jasonTextbox.call(this, htmlElement, options, nameSpace == void 0 ? "jasonButtonTextbox" : nameSpace, uiHelper == void 0 ? jasonButtonTextboxUIHelper : uiHelper);
    //if (uiHelper == void 0)
    //    this.ui.renderUI();
}


jasonButtonTextboxUIHelper.prototype = Object.create(jasonTextboxUIHelper.prototype);
jasonButtonTextboxUIHelper.prototype.constructor = jasonButtonTextboxUIHelper;

/**
 * Textbox UI widget helper.
 * @constructor
 * @ignore
 */
function jasonButtonTextboxUIHelper(widget, htmlElement) {
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onTextInputBlur = this.onTextInputBlur.bind(this);
    this.onTextInputFocus = this.onTextInputFocus.bind(this);
    jasonTextboxUIHelper.call(this, widget, htmlElement);
}
/**
 * Renders Button text box HTML.
 */
jasonButtonTextboxUIHelper.prototype.renderUI = function () {
    jasonTextboxUIHelper.prototype.renderUI.call(this);
    if (!this.htmlElement.classList.contains(jw.DOM.classes.JW_BUTTON_TEXT_BOX)) {
        this.htmlElement.classList.add(jw.DOM.classes.JW_BUTTON_TEXT_BOX);

        this.button = jw.htmlFactory.createJWButton(null, this.options.icon);
        this.button.setAttribute(jw.DOM.attributes.TITLE_ATTR, this.options.title == void 0 ? "" : this.options.title);
        this.htmlElement.appendChild(this.button);
        /*32px is the icon and 3px are the added borders. */
        var buttonWidth = this.options.icon ? 35 : 0;
        this.inputControl.style.width = "calc(100% - " + (buttonWidth) + "px)";
        if (this.inputControl.style.width == "")
            this.inputControl.style.width = "-webkit-calc(100% - " + (buttonWidth) + "px)";
    }
}
/**
 * Initializate events.
 */
jasonButtonTextboxUIHelper.prototype.initializeEvents = function () {
    jasonTextboxUIHelper.prototype.initializeEvents.call(this);
    this.eventManager.addEventListener(this.button, jw.DOM.events.CLICK_EVENT, this.onButtonClick, true);
}
/**
 * Handles button click.
 */
jasonButtonTextboxUIHelper.prototype.onButtonClick = function (event) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_BUTTON_CLICK);
}
/**
 * 
 */
jasonButtonTextboxUIHelper.prototype.onTextInputBlur = function (event, sender) {
    jasonTextboxUIHelper.prototype.onTextInputBlur.call(this, event, sender);
}
/**
 * 
 */
jasonButtonTextboxUIHelper.prototype.onTextInputFocus = function (event, sender) {
    jasonTextboxUIHelper.prototype.onTextInputFocus.call(this, event, sender);
}
/**
 * Updates UI when enable/disable state is changed.
 * @abstract
 */
jasonButtonTextboxUIHelper.prototype.updateEnabled = function (enable) {
    jasonTextboxUIHelper.prototype.updateEnabled.call(this, enable);
    if (enable) {
        this.button.removeAttribute(jw.DOM.attributes.DISABLED_ATTR)
        this.button.classList.remove(jw.DOM.classes.JW_DISABLED);
    }
    else {
        this.button.setAttribute(jw.DOM.attributes.DISABLED_ATTR, true);
        this.button.classList.add(jw.DOM.classes.JW_DISABLED);
    }
}
/**
 * Updates UI when visible state is changed.
 * @abstract
 */
jasonButtonTextboxUIHelper.prototype.updateVisible = function (visible) {
    jasonTextboxUIHelper.prototype.updateVisible.call(this, visible);
}
/**
 * Updates UI when readonly state is changed.
 * @abstract
 */
jasonButtonTextboxUIHelper.prototype.updateReadOnly = function (readonly) {
    jasonTextboxUIHelper.prototype.updateReadOnly.call(this, readonly);
    if (readonly)
        this.button.setAttribute(jw.DOM.attributes.READONLY_ATTR, true);
    else
        this.button.removeAttribute(jw.DOM.attributes.READONLY_ATTR);
}
