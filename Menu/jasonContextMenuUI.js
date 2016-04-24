/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonContextMenuUIHelper.prototype = Object.create(jasonMenuUIHelper.prototype);
jasonContextMenuUIHelper.prototype.constructor = jasonContextMenuUIHelper;

/**
 * @class
 * @name jasonMenuContextOptions
 * @augments Menus.jasonMenuOptions
 * @description Context jasonMenu options.
 * @property {HTMLElement}  [target=undefined] - Target HTML Element for the context menu.
 * @memberOf Menus
 */


/**
 * @constructor
 * @ignore
 */
function jasonContextMenuUIHelper(widget, htmlElement) {
    jasonWidgets.common.extendObject({ invokable: true,orientation:'vertical', autoHide:true }, widget.options);
    this.showContextMenu = this.showContextMenu.bind(this);
    jasonMenuUIHelper.call(this, widget, htmlElement);
    this.menuContainer.style.display = "none";
    this.menuContainer.parentElement.removeChild(this.menuContainer);
    document.body.appendChild(this.menuContainer);
    this.menuContainer.style.width = widget.options.width + "px";
    this.menuContainer.style.position = "absolute";
    this.initializeEvents();
}


/**
 * Initializes context menu events.
 */
jasonContextMenuUIHelper.prototype.initializeEvents = function () {
    this.eventManager.addEventListener(this.options.target, CONTEXT_MENU_EVENT, this.showContextMenu);
}
/**
 * Shows the context menu on the mouse coordinates.
 */
jasonContextMenuUIHelper.prototype.showContextMenu = function (mouseEvent) {
    if (mouseEvent.button == 2) {
        mouseEvent.preventDefault();
        mouseEvent.stopPropagation();
        this.showMenu(mouseEvent.target, mouseEvent.pageX, mouseEvent.pageY);
    }
}
/**
 * Calls the options.OnContextItemClick if defined.
 */
jasonContextMenuUIHelper.prototype.onContextItemClick = function (clickEvent, menuItem) {
    var eventData = { event: event, item: menuItem, checked: menuItem.checkBoxElement.checked, cancel: false };
    this.widget.triggerEvent(JW_EVENT_ON_MENU_CHECKBOX_CLICKED, eventData);
    this.hideMenu();
    this.options.target.focus();

    clickEvent.stopPropagation();
    clickEvent.preventDefault();
}