/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

//#region jasonMenu
/**
 * jasonMenu class.
 */
function jasonMenu() {
    this.Items = [];
}
//#endregion

//#region jasonMenuItem
/**
 * jasonMenuItem class.
 */
function jasonMenuItem(jasonMenuWidget) {
    var self = this;
    this.Caption = '';
    this.Title = '';
    this.Enabled = true;
    this.Items = [];
    this.Parent = null;
    this.Element = null;
    this.Content = null;
    this.Level = null;
    this.Name = null;
    this.HasCheckBox = false;
    this.Checked = false;
    this.Clickable = true;
    this.CheckBoxElement = null;
    this.Icon = null;
    this.jasonMenuWidget = jasonMenuWidget;
    /*Menu events*/
    this.onCheckboxClick = this.onCheckboxClick.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
    this.onItemMouseEnter = this.onItemMouseEnter.bind(this);
    this.onItemMouseLeave = this.onItemMouseLeave.bind(this);
    this.toggleCheckBox = this.toggleCheckBox.bind(this);
}
//#region Events
/**
 * On Checkbox element click.
 */
jasonMenuItem.prototype.onCheckboxClick = function (clickEvent) {
    this.toggleCheckBox();
}
/**
 * Toggle checkbox checked state
 */
jasonMenuItem.prototype.toggleCheckBox = function (event) {
    if (this.CheckBoxElement && this.Enabled) {
        /* Iterating through the list of checkboxes to find out how many are checked.
         * If there is only one left, do not allow it to be unchecked or 
         * call any callbacks.
         */
        var checkedCount = 0;
        for (var i = 0; i <= this.jasonMenuWidget.checkBoxElements.length - 1; i++) {
            if (this.jasonMenuWidget.checkBoxElements[i] != this.CheckBoxElement) {
                checkedCount = this.jasonMenuWidget.checkBoxElements[i].checked ? checkedCount + 1 : checkedCount;
            }
        }
        if (checkedCount > 0) {
            this.CheckBoxElement.checked = !this.CheckBoxElement.checked;
            if (this.jasonMenuWidget.options.OnCheckBoxClicked) {
                this.jasonMenuWidget.options.OnCheckBoxClicked(event, this, this.CheckBoxElement.checked);
            }
        }
    }
}
/**
 * Triggered when a menu item is clicked.
 * @param {object} itemClickEvent - HTMLEvent.
 */
jasonMenuItem.prototype.onItemClick = function (clickEvent) {
    if (this.Clickable && this.Enabled) {
        if (this.HasCheckBox)
            this.toggleCheckBox(clickEvent);
        if (this.jasonMenuWidget.options.OnItemClick) {
            this.jasonMenuWidget.options.OnItemClick(clickEvent, this);
        }
    }
    clickEvent.stopPropagation();
}
/**
 * Triggered when mouse enters a menu item.
 * @param {object} itemMouseEnterEvent - HTMLEvent.
 */
jasonMenuItem.prototype.onItemMouseEnter = function (itemMouseEnterEvent) {
    var menuElement = itemMouseEnterEvent.target;
    if (!menuElement.getAttribute("no-highlight") && this.Enabled)
        menuElement.classList.add(this.jasonMenuWidget.MENU_ITEM_CLASS_ACTIVE);
    //only try to place the sub-menu container if its enabled and not visible.
    var renderSubMenuContainer = (!menuElement._jasonMenuItemsContainer && this.Enabled) || (this.Enabled && menuElement._jasonMenuItemsContainer.style.display == "none");
    if (renderSubMenuContainer) {
        var orientantion = menuElement.parentNode == this.jasonMenuWidget.ULMenuElement ? this.jasonMenuWidget.options.Orientation.toLowerCase() : null;
        this.placeMenuItemsContainer(menuElement._jasonMenuItemsContainer, menuElement, itemMouseEnterEvent, orientantion);
    }
}
/**
 * Triggered when mouse leaves a menu item.
 * @param {object} itemMouseLeaveEvent - HTMLEvent.
 */
jasonMenuItem.prototype.onItemMouseLeave = function (itemMouseLeaveEvent) {
    if (this.jasonMenuWidget.disableMouseEvents)
        return;
    var menuElement = itemMouseLeaveEvent.target;
    var self = this;
    if (!this.jasonMenuWidget.options._debug) {
        if (menuElement._jasonMenuItemsContainer && this.jasonMenuWidget.canHideSubMenu) {
            menuElement._jasonMenuItemsContainer.style.display = "none";
        }
    }
    if (this.Enabled)
        menuElement.classList.remove(this.jasonMenuWidget.MENU_ITEM_CLASS_ACTIVE);
}
//#endregion
/**
 * Places the menu container on the page 
 * @param {object} menuItemsContainer - HTMLElement.
 * @param {object} menuElement - HTMLElement.
 * @param {object} mouseEvent - HTMLEvent.
 * @param {object} orientantion - HTMLEvent. {@link jasonMenuWidgetDefaultOptions}
 */
jasonMenuItem.prototype.placeMenuItemsContainer = function (menuItemsContainer, menuElement, mouseEvent, orientantion) {
    if (menuItemsContainer) {
        menuItemsContainer.style.position = "absolute";
        var containerTop = orientantion == "horizontal" ? (menuElement.offsetTop + menuElement.offsetHeight) + "px" : (menuElement.offsetTop - (menuElement.offsetHeight / 5.5)) + "px";
        menuItemsContainer.style.top = containerTop;
        var animSpeed = 350 - (this.jasonMenuWidget.options.Animation.Speed * 35);
        jasonWidgets.common.fadeOut(menuItemsContainer, animSpeed);
        var subItemULContainer = menuItemsContainer.getElementsByTagName("UL")[0];
        menuItemsContainer.style.display = "";
        var menuItemsContainerWidth = this.jasonMenuWidget.getWiderElementWidthOfUL(subItemULContainer);
        var paddingPixels = 10;
        if (menuItemsContainerWidth > 0) {
            menuItemsContainer.style.width = menuItemsContainerWidth + "px";
            paddingPixels = 0;
        }
        //calculating left position
        var coordinates = jasonWidgets.common.getOffsetCoordinates(menuElement);
        var width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
        var leftPosition = menuItemsContainer.offsetWidth + coordinates.Left + menuElement.offsetWidth >= width ? menuElement.offsetLeft - (menuItemsContainer.offsetWidth) : orientantion == "horizontal" ? menuElement.offsetLeft : menuElement.offsetWidth;
        menuItemsContainer.style.left = leftPosition + "px";
    }
}
//#endregion







