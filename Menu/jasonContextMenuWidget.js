/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonContextMenuWidget.prototype = Object.create(jasonMenuWidget.prototype);
jasonContextMenuWidget.prototype.constructor = jasonContextMenuWidget;

/**
 * @name jasonContextMenuWidgetDefaultOptions {@link jasonMenuWidgetDefaultOptions}
 * @property {function} OnContextItemClick   - Callback to be executed when ever a menu item is clicked. 
 */


/**
 * 
 */
function jasonContextMenuWidget(htmlElement, options) {
    jasonWidgets.common.extendObject({ Invokable: true }, options);
    this.showContextMenu = this.showContextMenu.bind(this);
    this.onContextItemClick = this.onContextItemClick.bind(this);

    options.OnItemClick = this.onContextItemClick;
    jasonMenuWidget.call(this, htmlElement, options);

    this.initialize(options ? options : {});
    this.initializeEvents();
}


/**
 * Initializes context menu events.
 */
jasonContextMenuWidget.prototype.initializeEvents = function () {
    this.options.target.addEventListener("contextmenu", this.showContextMenu);
    var self = this;
    document.addEventListener("mousedown", function (mouseDownEvent) {
        var isMenuRelatedClick = jasonWidgets.common.containsClasses(mouseDownEvent.target, [self.MENU_CAPTION, self.MENU_ITEM_CAPTION, self.MENU_ITEM_CLASS]);
        if (!isMenuRelatedClick)
            self.hideMenu();
    });
}
/**
 * Shows the context menu on the mouse coordinates.
 */
jasonContextMenuWidget.prototype.showContextMenu = function (mouseEvent) {
    if (mouseEvent.button == 2) {
        mouseEvent.preventDefault();
        mouseEvent.stopPropagation();
        this.showMenu(mouseEvent.target,mouseEvent.pageX,mouseEvent.pageY);
    }
}
/**
 * Calls the options.OnContextItemClick if defined.
 */
jasonContextMenuWidget.prototype.onContextItemClick = function (clickEvent, menuItem) {
    if (this.options.OnContextItemClick)
        this.options.OnContextItemClick(clickEvent, menuItem, options.target);
    this.hideMenu();
    this.options.target.focus();
    clickEvent.stopPropagation();
    clickEvent.preventDefault();
}