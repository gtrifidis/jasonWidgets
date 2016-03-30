/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonMenuUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonMenuUIHelper.prototype.constructor = jasonMenuUIHelper;

var
    /*CSS Classes*/
    MENU_CLASS = "jw-menu",
    MENU_HORIZONTAL = "horizontal",
    MENU_ITEM_CLASS = "jw-menu-item",
    MENU_ITEM_CLASS_ACTIVE = MENU_ITEM_CLASS + "-active",
    MENU_ITEMS_CONTAINER_CLASS = "jw-menu-items-container",
    MENU_ITEM_LEVEL_ATTRIBUTE = "data-jason-menu-item-level",
    MENU_CONTAINER_CLASS = "jw-menu-container",
    MENU_ITEM_CHECKBOX_CLASS = "jw-menu-item-checkbox",
    MENU_ITEM_CONTENT_CLASS = "jw-menu-item-content",
    MENU_ITEM_CONTENT = "menu-content";
    MENU_ITEM_DATA_KEY = "jasonMenuItem";
    MENU_ITEM_DIVIDER = "divider";
    MENU_ITEM_NO_HIGHLIGHT_ATTR = "no-highlight";
    //MENU_ITEM_WITH_ICON = "with-icon";
    //MENU_ITEM_WITH_CHECKBOX = "with-checkbox";
    //MENU_ITEM_WITH_SUB_ITEMS = "with-sub-items";

/**
 * @constructor
 * @ignore
 * @param {HTMLElement} htmlElement - DOM element that the menu will be bound to.
 * @param {any} options - jasonMenu options. {@link jasonMenuWidgetDefaultOptions}
 */
function jasonMenuUIHelper(widget, htmlElement) {
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);

    if (this.htmlElement == void 0) {
        this.htmlElement = this.createElement("span");
    }
    /*If the htmlElement is a UL list then use it otherwise create it*/
    this.ulMenuElement = this.htmlElement.tagName == "UL" ? this.htmlElement : this.createElement("ul");
    if (!this.ulMenuElement.classList.contains(this.baseClassName))
        this.widget.addBaseClassName(this.ulMenuElement);

    /*The htmlElment for this widget would be a div container for the UL element*/
    this.menuContainer = this.createElement("div");
    this.menuContainer.classList.add(MENU_CONTAINER_CLASS);


    this.ulMenuElement.classList.add(MENU_CLASS);


    this.invokableElement = null;

    /*If there is an explicit width value then set it.*/
    if (this.widget.options.width)
        this.ulMenuElement.style.width = this.options.width + "px";

    if (this.widget.options.height)
        this.ulMenuElement.style.height = this.options.height + "px";

    /*Adding orientation CSS class*/
    if (this.widget.options.orientation.toLowerCase() == "horizontal")
        this.htmlElement.classList.add(MENU_HORIZONTAL);

    this.checkBoxElements = [];

    /*Setting functions calling context*/
    this.showMenu = this.showMenu.bind(this);
    this.hideMenu = this.hideMenu.bind(this);

    /*Menu events*/
    this.onCheckboxClick = this.onCheckboxClick.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
    this.onItemTouch = this.onItemTouch.bind(this);
    this.onItemMouseEnter = this.onItemMouseEnter.bind(this);
    this.onItemMouseLeave = this.onItemMouseLeave.bind(this);
    this.toggleCheckBox = this.toggleCheckBox.bind(this);
    var self = this;
    if (this.options.autoHide) {
        jwDocumentEventManager.addDocumentEventListener(MOUSE_DOWN_EVENT, function (mouseDownEvent) {
            if (self.menuContainer.style.display != "none") {
                var isOutOfContainer = jasonWidgets.common.isMouseEventOutOfContainerAndNotAChild(self.menuContainer, mouseDownEvent)
                if (isOutOfContainer && self.canHideMenu)
                    self.hideMenu();
            }
        });
    }

    jwDocumentEventManager.addDocumentEventListener(TOUCH_END_EVENT, function (touchEndEvent) {
        if (self.menuContainer.style.display != "none") {
            var isOutOfContainer = jasonWidgets.common.isMouseEventOutOfContainerAndNotAChild(self.menuContainer, touchEndEvent.changedTouches[0]);
            if (isOutOfContainer && self.previousShowMenuItem) {
                var parent = self.previousShowMenuItem;
                while (parent) {
                    self.hideMenuItemContents(parent);
                    parent = parent.parent;
                }
            }
        }
    });

    /*Finally creating the menu*/
    this.menu = this.createMenu();
    this.canHideMenu = true;
    this.canHideSubMenu = true;
    this.disableMouseEvents = false;
    this.previousShowMenuItem = null;
}
//#region Placement and UI
/**
 * Calculates the absolute coordinates of the invokable element and displays the menu 
 */
jasonMenuUIHelper.prototype.showMenu = function (invokableElement,left,top) {
    if (invokableElement) {
        this.invokableElement = invokableElement;
        var coordinates = invokableElement.getBoundingClientRect();// jasonWidgets.common.getOffsetCoordinates(invokableElement);
        this.menuContainer.style.display = "";
        this.ulMenuElement.style.width = this.getWiderElementWidthOfUL(this.ulMenuElement) + "px";
        this.menuContainer.style.top = top ? top + "px" : (coordinates.top + invokableElement.offsetHeight + 1) + "px";
        var width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
        //coordinates.Left = coordinates.Left > width ? width : coordinates.Left;
        this.menuContainer.style.left = left ? left + "px" : coordinates.left + this.menuContainer.offsetWidth >= width ? coordinates.left - (this.menuContainer.offsetWidth) + "px" : coordinates.left + "px";
        this.widget.triggerEvent(JW_EVENT_ON_MENU_SHOWN);
    }
}
/**
 * Hides the menu.
 */
jasonMenuUIHelper.prototype.hideMenu = function () {
    //hide all menu item content that possibly were visible.
    var menuItemContents = this.menuContainer.getElementsByClassName(MENU_ITEMS_CONTAINER_CLASS);
    for (var i = 0; i <= menuItemContents.length - 1 ; i++) {
        menuItemContents[i].style.display = "none";
    }
    //de-activate all active menu items.
    var menuItems = this.menuContainer.getElementsByClassName(MENU_ITEM_CLASS_ACTIVE);
    for (var i = 0; i <= menuItems.length - 1 ; i++) {
        menuItems[i].classList.remove(MENU_ITEM_CLASS_ACTIVE);
    }
    this.menuContainer.style.display = "none";
    this.widget.triggerEvent(JW_EVENT_ON_MENU_HIDDEN);
}
/**
 * Returns the wider menu caption of a jasonMenuWidget menu item list.
 * @param {object} ulElement - HTMLElement.
 */
jasonMenuUIHelper.prototype.getWiderElementWidthOfUL = function (ulElement) {
    var result = 0;
    if (ulElement) {
        if (ulElement._jasonMenuWidgetWiderElementWidth)
            return ulElement._jasonMenuWidgetWiderElementWidth;
        var menuItemContent = ulElement.getElementsByClassName(MENU_ITEM_CONTENT_CLASS);
        if (menuItemContent.length > 0) {
            ulElement._jasonMenuWidgetWiderElementWidth = menuItemContent[0].offsetWidth;
        }
        for (var i = 0; i <= ulElement.children.length - 1; i++) {
            //var menuCaptionContainer = ulElement.children[i].getElementsByClassName(MENU_ITEM_CONTAINER)[0];
            var menuCaptionContainer = ulElement.children[i].getElementsByClassName(JW_MENU_ITEM_CAPTION)[0];
            var menuCaption = null;
            var iconWidth = ulElement.children[i].getElementsByClassName(JW_MENU_ITEM_ICON)[0];
            var arrowWidth = ulElement.children[i].getElementsByClassName(JW_MENU_ITEM_ARROW)[0];
            var checkboxWidth = ulElement.children[i].getElementsByClassName(JW_MENU_ITEM_CHECKBOX)[0];
            iconWidth = iconWidth ? iconWidth.offsetWidth : 0;
            arrowWidth = arrowWidth ? arrowWidth.offsetWidth : 0;
            checkboxWidth = checkboxWidth ? checkboxWidth.offsetWidth : 0;
            //if the li element has no menuCaption element it means that it did not have any sub-items but just text.
            //that is why the li element itself is the menu caption.
            //if (!menuCaptionContainer) {
                menuCaption = ulElement.children[i].getElementsByClassName(JW_MENU_ITEM_CAPTION)[0];
            //}
            var textWidth = 0;
            if (menuCaption) {
                //calculating text width of the lengthiest menu item , so we can grow the container of the menu items as needed
                //so the items can be displayed normally.
                //This value is stored for future usage so we do not have to caclulate it again.
                //This is more of a quick and dirty solution to the menu width issues. When there is more time a more elegant solution must be investigated.
                var temp = jasonWidgets.common.getComputedStyleProperty(menuCaption, "font-weight");
                temp = temp + " " + jasonWidgets.common.getComputedStyleProperty(menuCaption, "font-size");
                temp = temp + " " + jasonWidgets.common.getComputedStyleProperty(menuCaption, "font-family");
                temp = temp.replace("'", "");
                textWidth = jasonWidgets.common.getTextWidth(menuCaption.textContent.trim(), temp);
            }
            //30 is the total padding applied from the parent nodes
            var calcWidth = textWidth > ulElement.children[i].offsetWidth ? ulElement.children[i].offsetWidth + textWidth
                : ulElement.children[i].offsetWidth + 5;
            //var calcWidth = textWidth > menuCaption.offsetWidth ? menuCaption.offsetWidth + (menuCaption.offsetWidth - textWidth)
            //    : menuCaption.offsetWidth + 15;
            if (calcWidth > result)
                result = calcWidth + iconWidth + arrowWidth + checkboxWidth;
        }
        if (ulElement._jasonMenuWidgetWiderElementWidth)
            ulElement._jasonMenuWidgetWiderElementWidth = result > ulElement._jasonMenuWidgetWiderElementWidth ? result : ulElement._jasonMenuWidgetWiderElementWidth;// + (result / 4);
        else
            ulElement._jasonMenuWidgetWiderElementWidth = result;
        return ulElement._jasonMenuWidgetWiderElementWidth;
    }
    return result;
}
//#endregion

//#region Events
/**
 * On Checkbox element click.
 */
jasonMenuUIHelper.prototype.getMenuItemFromEvent = function (event) {
    var menuElement =  event.target.tagName == "LI" ? event.target: jasonWidgets.common.getParentElement("LI", event.target);
    return jasonWidgets.common.getData(menuElement, MENU_ITEM_DATA_KEY);
}

jasonMenuUIHelper.prototype.onCheckboxClick = function (clickEvent) {
    this.toggleCheckBox(clickEvent);
}
/**
 * Toggle checkbox checked state
 */
jasonMenuUIHelper.prototype.toggleCheckBox = function (event) {
    var menuItem = this.getMenuItemFromEvent(event);
    if(menuItem){
        if (menuItem.checkBoxElement && menuItem.enabled) {
            var eventData = { event: event, item: menuItem, checked: menuItem.checkBoxElement.checked, cancel: false };
            this.widget.triggerEvent(JW_EVENT_ON_MENU_CHECKBOX_CLICKED, eventData);
            //if the listener cancels the event, revert the checkbox state.
            if (eventData.cancel) {
                menuItem.checkBoxElement.checked = !menuItem.checkBoxElement.checked;
            }
          }
    }
}
/**
 * Triggered when a menu item is clicked.
 * @param {object} itemClickEvent - HTMLEvent.
 */
jasonMenuUIHelper.prototype.onItemClick = function (clickEvent) {
    var menuItem = this.getMenuItemFromEvent(clickEvent);
    if (menuItem) {
        if (menuItem.clickable && menuItem.enabled) {
            this.widget.triggerEvent(JW_EVENT_ON_MENU_ITEM_CLICKED, { event: clickEvent, item: menuItem, uiHelper: this });
        }
    }
}
/**
 * Triggered when a menu item is touched.
 * @param {HTMLEvent} itemClickEvent - HTMLEvent.
 */
jasonMenuUIHelper.prototype.onItemTouch = function (touchEvent) {
    touchEvent.preventDefault();
    touchEvent.stopPropagation();
    var menuItem = this.getMenuItemFromEvent(touchEvent);
    if (this.previousShowMenuItem) {
        //hide all previously shown items, up to the level of the currently touched item.
        if (menuItem.level <= this.previousShowMenuItem.level) {
            var parent = this.previousShowMenuItem;
            while (parent && parent.level >= menuItem.level) {
                this.hideMenuItemContents(parent);
                parent = parent.parent;
            }
        }
    }
    this.previousShowMenuItem = menuItem;
    this.showMenuItemContents(menuItem);
}
/**
 * Show menu item contents
 * @param {Menus.jasonMenuItem} menuItem
 */
jasonMenuUIHelper.prototype.showMenuItemContents = function (menuItem) {
    if (menuItem) {
        var menuElement = menuItem.element;
        if (!menuElement.getAttribute(MENU_ITEM_NO_HIGHLIGHT_ATTR) && menuItem.enabled)
            menuElement.classList.add(MENU_ITEM_CLASS_ACTIVE);

        //only try to place the sub-menu container if its enabled and not visible.
        var renderSubMenuContainer = (!menuElement._jasonMenuItemsContainer && menuItem.enabled) || (menuItem.enabled && menuElement._jasonMenuItemsContainer.style.display == "none");
        if (renderSubMenuContainer) {
            var orientantion = menuElement.parentNode == this.ulMenuElement ? this.options.orientation.toLowerCase() : null;
            this.placeMenuItemsContainer(menuElement._jasonMenuItemsContainer, menuElement, orientantion);
            menuItem.triggerEvent(JW_EVENT_ON_MENU_ITEM_CONTENT_SHOW)
        }
    }
}
/**
 * Hides menu item contents
 * @param {Menus.jasonMenuItem} menuItem
 */
jasonMenuUIHelper.prototype.hideMenuItemContents = function (menuItem) {
    if (menuItem) {
        var menuElement = menuItem.element;
        if (!this.options._debug && !this.disableMouseEvents) {
            if (menuElement._jasonMenuItemsContainer && this.canHideSubMenu) {
                menuElement._jasonMenuItemsContainer.style.display = "none";
            }
        }
        if (menuItem.enabled)
            menuElement.classList.remove(MENU_ITEM_CLASS_ACTIVE);
    }
}
/**
 * Triggered when mouse enters a menu item.
 * @param {object} itemMouseEnterEvent - HTMLEvent.
 */
jasonMenuUIHelper.prototype.onItemMouseEnter = function (itemMouseEnterEvent) {
    this.showMenuItemContents(this.getMenuItemFromEvent(itemMouseEnterEvent))
}
/**
 * Triggered when mouse leaves a menu item.
 * @param {object} itemMouseLeaveEvent - HTMLEvent.
 */
jasonMenuUIHelper.prototype.onItemMouseLeave = function (itemMouseLeaveEvent) {
    this.hideMenuItemContents(this.getMenuItemFromEvent(itemMouseLeaveEvent));
}
//#endregion
/**
 * Places the menu container on the page 
 * @param {object} menuItemsContainer - HTMLElement.
 * @param {object} menuElement - HTMLElement.
 * @param {object} mouseEvent - HTMLEvent.
 * @param {object} orientantion - HTMLEvent. {@link jasonMenuWidgetDefaultOptions}
 */
jasonMenuUIHelper.prototype.placeMenuItemsContainer = function (menuItemsContainer, menuElement, orientantion) {
    if (menuItemsContainer) {
        menuItemsContainer.style.position = "absolute";
        var containerTop = orientantion == "horizontal" ? (menuElement.offsetTop + menuElement.offsetHeight) + "px" : (menuElement.offsetTop - (menuElement.offsetHeight / 5.5)) + "px";
        menuItemsContainer.style.top = containerTop;
        var animSpeed = 350 - (this.options.animation.Speed * 35);
        jasonWidgets.common.fadeOut(menuItemsContainer, animSpeed);
        var subItemULContainer = menuItemsContainer.getElementsByTagName("UL")[0];
        menuItemsContainer.style.display = "";
        var menuItemContent = subItemULContainer.querySelectorAll(".jw-menu-item-content")[0];
        if (menuItemContent) {
            var menuContent = subItemULContainer.querySelectorAll(".menu-content")[0];
            if (menuContent)
                menuContent.style.height = menuItemContent.offsetHeight + "px";
        }
        var menuItemsContainerWidth = this.getWiderElementWidthOfUL(subItemULContainer);
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
        var leftPosition = menuItemsContainer.offsetWidth + coordinates.left  >= width ? menuElement.offsetLeft - (menuItemsContainer.offsetWidth) : orientantion == "horizontal" ? menuElement.offsetLeft : menuElement.offsetWidth;
        menuItemsContainer.style.left = leftPosition + "px";
    }
}
//#endregion

/**
 * Parses the html or json to create the menu 
 */
jasonMenuUIHelper.prototype.createMenu = function () {
    var self = this;
    /*if the htmlElement is a UL element, then create jasonMenu structure by parsing the UL DOM structure.*/
    if (this.htmlElement.tagName == "UL") {
        var domParser = new jasonMenuWidgetDOMParser(this);
        //if the menu is configured to be invokable, meaning that the menu is initialy hidden and the user
        //has to click to display it, we hide the menu container and append the original UL element to it.
        if (this.options.invokable) {
            this.menuContainer.style.display = "none";
            this.menuContainer.style.position = "absolute";
            this.menuContainer.appendChild(this.ulMenuElement);
            document.body.appendChild(this.menuContainer);
        } else {
            this.htmlElement.parentNode.replaceChild(this.menuContainer, this.htmlElement);
            this.menuContainer.appendChild(this.htmlElement);
        }
        return domParser.populateMenu(this.ulMenuElement);
    } else {
        if (!this.options.menu)
            return;
        var jsonParser = new jasonMenuWidgetJSONParser(this);
        this.ulMenuElement = jsonParser.populateMenu(this.options.menu);
        /*Adding orientation CSS class*/
        if (this.widget.options.orientation.toLowerCase() == "horizontal")
            this.ulMenuElement.classList.add(MENU_HORIZONTAL);
        this.menuContainer.appendChild(this.ulMenuElement);
        /*If the menu is invokable hide it when the mouse is not over the client of the menu container.*/
        if (this.options.invokable) {
            this.menuContainer.style.display = "none";
            this.menuContainer.style.position = "absolute";
            this.eventManager.addEventListener(this.menuContainer, MOUSE_LEAVE_EVENT, function (mouseLeaveEvent) {
                if (self.disableMouseEvents)
                    return;
                if (!self.options._debug) {
                    if (self.options.hideDelay) {
                        self.canHideMenu = true;
                        setTimeout(function () {
                            if (self.canHideMenu)
                                self.hideMenu();
                        }, self.options.hideDelay);
                    }
                    else
                        self.hideMenu();
                }
            });
            this.eventManager.addEventListener(this.menuContainer, MOUSE_ENTER_EVENT, function (mouseLeaveEvent) {
                if (!self.options._debug) {
                    if (self.canHideMenu)
                        self.canHideMenu = false;
                    //when entering again the container we do not want to disable events any more.
                    if (self.disableMouseEvents)
                        self.disableMouseEvents = false;
                }
            });
            document.body.appendChild(this.menuContainer);
        } else {
            this.htmlElement.appendChild(this.menuContainer);
        }
        this.eventManager.addEventListener(this.ulMenuElement, MOUSE_ENTER_EVENT, function (mouseEnterEvent) {
            self.disableMouseEvents = false;
        });

        this.eventManager.addEventListener(this.ulMenuElement, MOUSE_DOWN_EVENT, function (mouseDownEvent) {
            var menuElement = jasonWidgets.common.getParentElement("LI", mouseDownEvent.target);
            var menuItem = jasonWidgets.common.getData(menuElement, MENU_ITEM_DATA_KEY);
            if (menuItem && menuItem.content) {
                if (jw.common.isMouseEventOutOfContainer(self.ulMenuElement, mouseDownEvent)) {
                    self.disableMouseEvents = true;
                }
            }
        },true);
    }
}