/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonButton.prototype = Object.create(jasonBaseWidget.prototype);
jasonButton.prototype.constructor = jasonButton;

/**
 * @namespace Buttons
 * @description Collection of button widgets.
 */

/**
 * @class
 * @name jasonButtonOptions
 * @description Configuration for the jasonButton widget.
 * @memberOf Buttons
 * @augments Common.jasonWidgetOptions
 * @property {string} [caption=undefined] - Button caption.
 * @property {Globals.jw.DOM.icons}  [icon=undefined] - Button icon class.
 */

/**
 * @event Buttons.jasonButton#click
 * @type {object}
 * @property {object} event - The event object.
 * @property {Buttons.jasonButton} sender - The button instance.
 */

/**
 * jasonButtonWidget
 * @constructor
 * @descrption Button control widget.
 * @memberOf Buttons
 * @augments Common.jasonBaseWidget
 * @param {HTMLElement} htmlElement - DOM element that will contain the button.
 * @param {Buttons.jasonButtonOptions} options - jasonButton options.
 * @fires Buttons.jasonButton#event:click
 */
function jasonButton(htmlElement, options, nameSpace, uiHelper) {
    jasonBaseWidget.call(this, nameSpace == void 0 ? "jasonButton" : nameSpace, htmlElement, options, uiHelper == void 0 ? jasonButtonUIHelper : uiHelper);
    //if (uiHelper == void 0)
    //    this.ui.renderUI();
}

jasonButtonUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonButtonUIHelper.prototype.constructor = jasonButtonUIHelper;

/**
 * Button UI widget helper.
 * @constructor
 * @ignore
 */
function jasonButtonUIHelper(widget, htmlElement) {
    this.buttonClick = this.buttonClick.bind(this);
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);
}
/**
 * Renders buttons control's HTML.
 */
jasonButtonUIHelper.prototype.renderUI = function () {
    jw.htmlFactory.createJWButton(this.options.caption, this.options.icon, this.htmlElement);
    this.htmlElement.classList.add(jw.DOM.classes.JW_BORDERED);
}
/**
 * Initialize Events
 */
jasonButtonUIHelper.prototype.initializeEvents = function () {
    this.eventManager.addEventListener(this.htmlElement, jw.DOM.events.CLICK_EVENT, this.buttonClick, true);
}
/**
 * Renders buttons control's HTML.
 */
jasonButtonUIHelper.prototype.buttonClick = function () {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    this.widget.triggerEvent(jw.DOM.events.CLICK_EVENT);
}
/**
 * Updates UI when enable/disable state is changed.
 * @abstract
 */
jasonButtonUIHelper.prototype.updateEnabled = function (enable) {
    jasonBaseWidgetUIHelper.prototype.updateEnabled.call(this, enable);
    if (enable)
        this.htmlElement.removeAttribute(jw.DOM.attributes.DISABLED_ATTR)
    else
        this.htmlElement.setAttribute(jw.DOM.attributes.DISABLED_ATTR, true);
}
/**
 * Updates UI when visible state is changed.
 * @abstract
 */
jasonButtonUIHelper.prototype.updateVisible = function (visible) {
    jasonBaseWidgetUIHelper.prototype.updateVisible.call(this, visible);
}
/**
 * Updates UI when read only state is changed.
 * @abstract
 */
jasonButtonUIHelper.prototype.updateReadOnly = function (readonly) {
    jasonBaseWidgetUIHelper.prototype.updateReadOnly.call(this, readonly);
    if (readonly)
        this.htmlElement.removeAttribute(jw.DOM.attributes.READONLY_ATTR)
    else
        this.htmlElement.setAttribute(jw.DOM.attributes.READONLY_ATTR, true);
}

