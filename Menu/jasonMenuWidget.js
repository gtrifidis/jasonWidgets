/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @name jasonMenuWidgetDefaultOptions
 * @property {string}   Orientation          - horizontal or vertical. Defines how the menu would be rendered
 * @property {object}   Menu                 - Object representation of the menu. If defined the menu widget will use that to create the HTML menu structure.
 * @property {object}   Animation            - Animation configuration. 
 * @property {number}   Animation.Speed      - Numeric value to define animation speed. Range is 1-10.
 * @property {function} OnItemClick          - Callback to be executed when ever a menu item is clicked. 
 * @property {number}   Width                - Sets the width of the menu.
 * @property {function} OnCheckBoxClicked    - Callback to be executed when ever a checkbox of a menu item is clicked. Parameters event,menu item,checked value. 
 * @property {number}   HideDelay            - If defined it will give the user a grace period before it hides the menu.If the user mouse's over the menu container the menu will not be hidden.
 * @property {function} OnMenuShow           - Callback to be executed when ever the menu is shown. 
 * @property {function} OnMenuHide           - Callback to be executed when ever the menu is hidden.
 */

jasonMenuWidget.prototype = Object.create(jasonBaseWidget.prototype);
jasonMenuWidget.prototype.constructor = jasonMenuWidget;

/**
 * @constructor
 * @param {HTMLElement} htmlElement - DOM element that the menu will be bound to.
 * @param {any} options - jasonMenu options. {@link jasonMenuWidgetDefaultOptions}
 */
function jasonMenuWidget(htmlElement, options) {

    jasonBaseWidget.call(this, "jasonMenu", htmlElement);

    /*CSS Classes*/
    this.MENU_CLASS = "jason-menu";
    this.MENU_HORIZONTAL = "horizontal";
    this.MENU_ITEM_CLASS = "jason-menu-item";
    this.MENU_ITEM_CLASS_ACTIVE = this.MENU_ITEM_CLASS + "-active";
    this.MENU_ITEMS_CONTAINER_CLASS = "jason-menu-items-container";
    this.MENU_ITEM_LEVEL_ATTRIBUTE = "data-jason-menu-item-level";
    this.MENU_ITEM_CAPTION = "jason-menu-item-caption";
    this.MENU_ARROW_ICON = "menu-arrow";
    this.MENU_ICON = "menu-icon";
    this.MENU_CAPTION = "menu-caption";
    this.MENU_CONTAINER_CLASS = "jason-menu-container";
    this.MENU_ITEM_CHECKBOX_CLASS = "jason-menu-item-checkbox";
    this.MENU_ITEM_CONTENT_CLASS = "jason-menu-item-content";
    this.MENU_ITEM_CLICKABLE = "clickable";
    this.MENU_ITEM_DISABLED = "disabled";
    this.MENU_ITEM_CONTENT = "menu-content";


    /*If the htmlElement is a UL list then use it otherwise create it*/
    this.ULMenuElement = this.htmlElement.tagName == "UL" ? this.htmlElement : this.createElement("ul");
    if (!this.ULMenuElement.classList.contains(this.baseClassName))
        this.addBaseClassName(this.ULMenuElement);

    /*The htmlElment for this widget would be a div container for the UL element*/
    this.MenuContainer = this.createElement("div");
    this.MenuContainer.classList.add(this.MENU_CONTAINER_CLASS);


    this.ULMenuElement.classList.add(this.MENU_CLASS);

    /*Default menu options*/
    jasonWidgets.common.extendObject({ Orientation: 'Vertical', Animation: { Speed: 9 }, ExpandMenuOnHover: true, Invokable: false }, this.defaultOptions);

    this.initialize(options ? options : {});
    this.InvokableElement = null;

    /*If there is an explicit width value then set it.*/
    if (this.options.Width)
        this.ULMenuElement.style.width = this.options.Width + "px";
    /*Adding orientation CSS class*/
    if (this.options.Orientation.toLowerCase() == "horizontal")
        this.htmlElement.classList.add(this.MENU_HORIZONTAL);

    this.checkBoxElements = [];

    /*Setting functions calling context*/
    this.showMenu = this.showMenu.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
    //this.createSubElementsForMenu = this.createSubElementsForMenu.bind(this);

    /*Storing reference of the menu*/
    jasonWidgets.common.setData(this.htmlElement, "jasonMenuWidget", this);
    /*Finally creating the menu*/
    this.Menu = this.createMenu();
    this.canHideMenu = true;
    this.canHideSubMenu = true;
    this.disableMouseEvents = false;
}
//#region Placement and UI
/**
 * Calculates the absolute coordinates of the invokable element and displays the menu 
 */
jasonMenuWidget.prototype.showMenu = function (invokableElement,left,top) {
    if (invokableElement) {
        this.InvokableElement = invokableElement;
        var coordinates = jasonWidgets.common.getOffsetCoordinates(invokableElement);
        this.MenuContainer.style.display = "";
        this.ULMenuElement.style.width = this.getWiderElementWidthOfUL(this.ULMenuElement) + "px";
        this.MenuContainer.style.top = top ? top + "px" : (coordinates.Top + invokableElement.offsetHeight) + "px";
        var width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
        this.MenuContainer.style.left = left ? left + "px" : coordinates.Left + this.MenuContainer.offsetWidth >= width ? coordinates.Left - (this.MenuContainer.offsetWidth) + "px" : coordinates.Left + "px";
        if (this.options.OnMenuShow)
            this.options.OnMenuShow();
    }
}
/**
 * Hides the menu.
 */
jasonMenuWidget.prototype.hideMenu = function () {
    this.MenuContainer.style.display = "none";
    //hide all menu item content that possibly were visible.
    var menuItemContents = this.MenuContainer.getElementsByClassName(this.MENU_ITEMS_CONTAINER_CLASS);
    for (var i = 0; i <= menuItemContents.length - 1 ; i++) {
        menuItemContents[i].style.display = "none";
    }
    //de-activate all active menu items.
    var menuItems = this.MenuContainer.getElementsByClassName(this.MENU_ITEM_CLASS_ACTIVE);
    for (var i = 0; i <= menuItems.length - 1 ; i++) {
        menuItems[i].classList.remove(this.MENU_ITEM_CLASS_ACTIVE);
    }
    if (this.options.OnMenuHide)
        this.options.OnMenuHide();
}
/**
 * Returns the wider menu caption of a jasonMenuWidget menu item list.
 * @param {object} ulElement - HTMLElement.
 */
jasonMenuWidget.prototype.getWiderElementWidthOfUL = function (ulElement) {
    var result = 0;
    if (ulElement) {
        if (ulElement._jasonMenuWidgetWiderElementWidth)
            return ulElement._jasonMenuWidgetWiderElementWidth;
        var menuItemContent = ulElement.getElementsByClassName(this.MENU_ITEM_CONTENT_CLASS);
        if (menuItemContent.length > 0) {
            ulElement._jasonMenuWidgetWiderElementWidth = menuItemContent[0].offsetWidth;
        }
        for (var i = 0; i <= ulElement.children.length - 1; i++) {
            var menuCaptionContainer = ulElement.children[i].getElementsByClassName(this.MENU_ITEM_CONTAINER)[0];
            var menuCaption = null;
            var iconWidth = ulElement.children[i].getElementsByClassName(this.MENU_ICON)[0];
            var arrowWidth = ulElement.children[i].getElementsByClassName(this.MENU_ARROW_ICON)[0];
            var checkboxWidth = ulElement.children[i].getElementsByClassName(this.MENU_ITEM_CHECKBOX_CLASS)[0];
            iconWidth = iconWidth ? iconWidth.offsetWidth : 0;
            arrowWidth = arrowWidth ? arrowWidth.offsetWidth : 0;
            checkboxWidth = checkboxWidth ? checkboxWidth.offsetWidth : 0;
            //if the li element has no menuCaption element it means that it did not have any sub-items but just text.
            //that is why the li element itself is the menu caption.
            if (!menuCaptionContainer) {
                menuCaption = ulElement.children[i].getElementsByClassName(this.MENU_CAPTION)[0];
            }
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
                textWidth = jasonWidgets.common.getTextWidth(menuCaption.textContent, temp);
            }
            //30 is the total padding applied from the parent nodes
            var calcWidth = textWidth > ulElement.children[i].offsetWidth ? ulElement.children[i].offsetWidth + (ulElement.children[i].offsetWidth - textWidth) : ulElement.children[i].offsetWidth;
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

/**
 * Parses the html or json to create the menu 
 */
jasonMenuWidget.prototype.createMenu = function () {
    var self = this;
    /*if the htmlElement is a UL element, then create jasonMenu structure by parsing the UL DOM structure.*/
    if (this.htmlElement.tagName == "UL") {
        var domParser = new jasonMenuWidgetDOMParser(this);
        //if the menu is configured to be invokable, meaning that the menu is initialy hidden and the user
        //has to click to display it, we hide the menu container and append the original UL element to it.
        if (this.options.Invokable) {
            this.MenuContainer.style.display = "none";
            this.MenuContainer.style.position = "absolute";
            this.MenuContainer.appendChild(this.ULMenuElement);
            document.body.appendChild(this.MenuContainer);
        } else {
            this.htmlElement.parentNode.replaceChild(this.MenuContainer, this.htmlElement);
            this.MenuContainer.appendChild(this.htmlElement);
        }
        return domParser.populateMenu(this.ULMenuElement);
    } else {
        /* if the htmlElement is not a UL element, which means user will be expected to click on the element
         * to show the menu, create the UL DOM structure by parsing the jasonMenu structure.
         */
        this.MenuContainer.appendChild(this.ULMenuElement);
        this.MenuContainer.style.display = "none";
        this.MenuContainer.style.position = "absolute";
        document.body.appendChild(this.MenuContainer);
        if (!this.options.Menu)
            return;
        var jsonParser = new jasonMenuWidgetJSONParser(this);
        this.MenuContainer.appendChild(jsonParser.populateMenu(this.options.Menu));
        /*If the menu is invokable hide it when the mouse is not over the client of the menu container.*/
        if (this.options.Invokable) {
            this.MenuContainer.addEventListener("mouseleave", function (mouseLeaveEvent) {
                if (self.disableMouseEvents)
                    return;
                if (!self.options._debug) {
                    if (self.options.HideDelay) {
                        self.canHideMenu = true;
                        setTimeout(function () {
                            if (self.canHideMenu)
                                self.hideMenu();
                        }, self.options.HideDelay);
                    }
                    else
                        self.hideMenu();
                }
            });
            this.MenuContainer.addEventListener("mouseenter", function (mouseLeaveEvent) {
                if (!self.options._debug) {
                    if (self.canHideMenu)
                        self.canHideMenu = false;
                }
            });
        }
        this.ULMenuElement.addEventListener("mouseenter", function (mouseEnterEvent) {
            self.disableMouseEvents = false;
        });
        this.ULMenuElement.addEventListener("mousedown", function (mouseDownEvent) {
            var menuElement = jasonWidgets.common.getParentElement("LI", mouseDownEvent.target);
            var menuItem = jasonWidgets.common.getData(menuElement, "jasonMenuItem");
            if (menuItem && menuItem.Content) {
                var containerRect = self.ULMenuElement.getBoundingClientRect();
                var isClickOutOfContainerHorizontal = (mouseDownEvent.x > containerRect.right) || (mouseDownEvent.x < containerRect.left);
                var isClickOutOfContainerVertical = (mouseDownEvent.y > containerRect.bottom) || (mouseDownEvent.y < containerRect.top);
                if (isClickOutOfContainerHorizontal || isClickOutOfContainerVertical) {
                    self.disableMouseEvents = true;
                }
            }
            //self.canHideSubMenu = !jasonWidgets.common.contains(self.ULMenuElement, mouseDownEvent.target);

        });
    }
}