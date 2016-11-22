/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonMenu.prototype = Object.create(jasonBaseWidget.prototype);
jasonMenu.prototype.constructor = jasonMenu;

/**
 * @namespace Menus
 * @description Menu and context menu classes.
 * 
 * Keyboard navigation:
 * 
 * @property MenuItem {MenuItem} - MenuItem keyboard support.
 * @property MenuItem.Tab {Keyboard} - Moves the next menu item or to the menu item arrow element if the menu item has sub-items.
 * @property MenuItem.Shift+Tab {Keyboard} - Moves the previous menu item or to the menu item arrow element if the previous menu item has sub-items.
 * @property MenuItem.ArrowElement {MenuItem.ArrowElement} - MenuItem arrow element keyboard support.
 * @property MenuItem.ArrowElement.Enter {Keyboard} - Displays the sub-items of the menu item.
 * 
 */


/**
 * @class
 * @name jasonMenuOptions
 * @description Configuration for the menu/context menu widget.
 * @memberOf Menus
 * @augments Common.jasonWidgetOptions
 * @property {string}   [orientation=horizontal]          - Horizontal or vertical. Defines how the menu will be rendered.
 * @property {object}   [menu=undefined]                 - JSON object representation of the menu. If defined, the menu widget will use it to create the HTML menu structure.
 * @property {object}   animation            - Animation configuration. 
 * @property {number}   [animation.delay=5]      - Numeric value to define animation delay. Range is 1-10.
 * @property {number}   [width=undefined]                - Sets the width of the menu.
 * @property {number}   [height=undefined]                - Sets the height of the menu. 
 * @property {number}   [hideDelay=undefined]            - If defined, it will give the user a grace period before it hides the menu. If the user mouses over the menu container the menu will not be hidden.
 * @property {boolean}  [autoHide=false]             - If true, the menu will be hidden if the user clicks outside the menu.
 * @property {boolean}  [expandMenuOnHover=true] - If true, the menu item will be expanded on hover.
 * @property {boolean}  [invokable=false] - If true, the menu is hidden and it will be invoked when the invokable element is clicked.
 */

/**
 * @event Menus.jasonMenu#onShow
 * @type {object}
 * @description Occurs when menu is shown.
 * @property {Menus.jasonMenu} sender - The menu instance.
 */

/**
 * @event Menus.jasonMenu#onHide
 * @type {object}
 * @description Occurs when the menu is hidden.
 * @property {Menus.jasonMenu} sender - The menu instance.
 */

/**
 * @event Menus.jasonMenu#onItemClick
 * @type {object}
 * @description Occurs when item is clicked.
 * @property {Menus.jasonMenu} sender - The menu instance.
 * @property {object} eventInfo - The position information.
 * @property {event} eventInfo.event - The DOM event.
 * @property {Menus.jasonMenuItem} eventInfo.item - The jasonMenu item.
 */

/**
 * @event Menus.jasonMenu#onCheckBoxClicked
 * @type {object}
 * @description Occurs when checkbox is clicked.
 * @property {Menus.jasonMenu} sender - The menu instance.
 * @property {object} eventInfo - The position information.
 * @property {event} eventInfo.event - The DOM event.
 * @property {Menus.jasonMenuItem} eventInfo.item - The jasonMenu item.
 * @property {boolean} eventInfo.checked - The checked value of the menu item.
 */


/**
 * @constructor
 * @memberOf Menus
 * @description Menu widget. Can populate items either from HTML or .json.
 * @augments Common.jasonBaseWidget
 * @param {HTMLElement} htmlElement - DOM element that the menu will be bound to.
 * @param {Menus.jasonMenuOptions} options - jasonMenu options.
 * @fires Menus.jasonMenu#event:onShow
 * @fires Menus.jasonMenu#event:onHide
 * @fires Menus.jasonMenu#event:onItemClick
 * @fires Menus.jasonMenu#event:onCheckBoxClicked
 */
function jasonMenu(htmlElement, options, uiHelper) {
    this.items = [];
    /*Default menu options*/
    this.defaultOptions = { orientation: 'vertical', animation: { delay: 9 }, expandMenuOnHover: true, invokable: false };
    jasonBaseWidget.call(this, "jasonMenu", htmlElement, options, uiHelper);
}

function createJasonMenuDividerItem() {
    var result = new jasonMenuItem();
    result.isDivider = true;
    result.clickable = false;
    return result;
}

//#region jasonMenuItem
jasonMenuItem.prototype = Object.create(jasonBaseWidget.prototype);
jasonMenuItem.prototype.constructor = jasonMenuItem;
/**
 * @class
 * @description Object representation of a jasonMenuItem.
 * @memberOf Menus
 * @property {string} caption - Menu item caption.
 * @property {string} title - Menu item title (tooltip).
 * @property {boolean} enabled - Gets/Sets enabled state for the item.
 * @property {array} items - Item's subitems.
 * @property {jasonMenuItem}  parent - Item's parent menu item.
 * @property {HTMLElement} element - The li elmement of the item.
 * @property {HTMLElement} content - A HTMLElement that would be the content of the item.
 * @property {number} level - Item's nest level. Root items start with zero.
 * @property {string} name - Item's name.
 * @property {boolean} hasCheckbox - If true, a checkbox input element is rendered.
 * @property {boolean} checked - Gets/Sets the checked state of the item if it has a checkbox.
 * @property {boolean} clickable - If true, item accepts click events.
 * @property {HTMLElement} checkboxElement - The input element of the item if it has a checkbox.
 * @property {string} icon - Icon css class for the item.
 * @property {boolean} isDivider - If true, the item is a special menu item - a menu divider.
 */
function jasonMenuItem(htmlElement, options, uiHelper) {
    jasonBaseWidget.call(this, "jasonMenuItem", htmlElement, options, uiHelper);
    this.caption = '';
    this.title = '';
    this.enabled = true;
    this.items = [];
    this.parent = null;
    this.content = null;
    this.level = null;
    this.name = null;
    this.hasCheckBox = false;
    this.checked = false;
    this.clickable = true;
    this.checkBoxElement = null;
    this.icon = null;
    this.isDivider = false;
    this.assign = this.assign.bind(this);
}
jasonMenuItem.prototype.assign = function (sourceMenuItem) {
    this.caption = sourceMenuItem.caption;
    this.title = sourceMenuItem.title;
    this.enabled = sourceMenuItem.enabled;
    this.items = sourceMenuItem.items;
    //this.parent = sourceMenuItem.parent;
    //this.element = sourceMenuItem.element;
    this.content = sourceMenuItem.content;
    this.level = sourceMenuItem.level;
    this.name = sourceMenuItem.name;
    this.hasCheckBox = sourceMenuItem.hasCheckBox;
    this.checked = sourceMenuItem.checked;
    this.clickable = sourceMenuItem.clickable;
    //this.checkBoxElement = sourceMenuItem.;
    this.icon = sourceMenuItem.icon;
    this.isDivider = sourceMenuItem.isDivider;
}







