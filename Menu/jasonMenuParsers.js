/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonMenuWidgetParser.prototype.constructor = jasonMenuWidgetParser;

jasonMenuWidgetDOMParser.prototype = Object.create(jasonMenuWidgetParser.prototype);
jasonMenuWidgetDOMParser.prototype.constructor = jasonMenuWidgetDOMParser;

jasonMenuWidgetJSONParser.prototype = Object.create(jasonMenuWidgetParser.prototype);
jasonMenuWidgetJSONParser.prototype.constructor = jasonMenuWidgetJSONParser;
/**
 * Base class for menu parsers. Menu parser are responsible for taking JSON or HTML and create the menu.
 * If the input is JSON it will create HTML structure of the JSON representation.
 * In other words if you provide the json representation of the menu, the parser will create the HTML for you.
 */
function jasonMenuWidgetParser(jasonMenuWidget) {
    this.jasonMenuWidget = jasonMenuWidget;

    /**
     * Creates sub menu items container.
     * @param {object} menuElement - HTMLElement.
     */
    jasonMenuWidgetParser.prototype.createSubItemsContainer = function (menuElement) {
        var menuItemsContainer = this.jasonMenuWidget.createElement("div");
        menuItemsContainer.classList.add(this.jasonMenuWidget.MENU_ITEMS_CONTAINER_CLASS);
        menuItemsContainer.style.display = "none";
        jasonWidgets.common.moveChildrenTo(menuElement, menuItemsContainer, null, jasonWidgets.common.inlineElements, [this.jasonMenuWidget.MENU_ITEM_CAPTION]);
        menuElement.setAttribute("data-jason-menu-container", "true");
        menuElement.appendChild(menuItemsContainer);
        menuElement._jasonMenuItemsContainer = menuItemsContainer;
    }
    return jasonMenuWidgetParser;
}
/**
 * Creates menu item caption container.
 * @param {object} liElement - HTMLElement.
 * @param {object} menuItem  - jasonMenuItem.
 */
jasonMenuWidgetParser.prototype.createMenuItemCaption = function (liElement, menuItem) {
    var textNode = jasonWidgets.common.getNodeText(liElement);
    //if the first child node is a textnode get set its text as the caption.
    if (textNode) {
        menuItem.Caption = textNode.textContent.trim();
        jasonWidgets.common.removeNodeText(liElement);
    }
    var menuItemCaptionContainer = this.jasonMenuWidget.createElement("div");
    var menuCaption = this.jasonMenuWidget.createElement("div");
    menuCaption.classList.add(this.jasonMenuWidget.MENU_CAPTION);

    menuItemCaptionContainer.classList.add(this.jasonMenuWidget.MENU_ITEM_CAPTION);
    menuCaption.appendChild(this.jasonMenuWidget.createTextNode(menuItem.Caption));
    menuItemCaptionContainer.appendChild(menuCaption);

    liElement._jasonMenuItemCaptionContainer = menuItemCaptionContainer;
    liElement.appendChild(menuItemCaptionContainer);
}
/**
 * Creates menu item arrow icon container.
 * @param {object} liElement - HTMLElement.
 */
jasonMenuWidgetParser.prototype.createMenuItemArrowIcon = function (liElement) {
    if (liElement._jasonMenuItemCaptionContainer) {
        var iconContainer = this.jasonMenuWidget.createElement("div");
        iconContainer.classList.add(this.jasonMenuWidget.MENU_ARROW_ICON);
        var iconElement = this.jasonMenuWidget.createElement("i");
        var menuLevel = liElement.getAttribute(this.jasonMenuWidget.MENU_ITEM_LEVEL_ATTRIBUTE);
        iconElement.className = this.jasonMenuWidget.options.Orientation == "horizontal" && menuLevel == 0 ? "jw-icon chevron-bottom" : "jw-icon chevron-right";
        iconContainer.appendChild(iconElement);
        liElement._jasonMenuItemCaptionContainer.appendChild(iconContainer);
    }
}
/**
 * Creates menu item arrow icon container.
 * @param {object} liElement - HTMLElement.
 * @param {string} iconClass - icon css class.
 */
jasonMenuWidgetParser.prototype.createMenuItemIcon = function (liElement,iconClass) {
    if (liElement._jasonMenuItemCaptionContainer) {
        var iconContainer = this.jasonMenuWidget.createElement("div");
        iconContainer.classList.add(this.jasonMenuWidget.MENU_ICON);
        var iconElement = this.jasonMenuWidget.createElement("i");
        iconElement.className = (iconClass);
        var menuLevel = liElement.getAttribute(this.jasonMenuWidget.MENU_ITEM_LEVEL_ATTRIBUTE);
        iconContainer.appendChild(iconElement);
        liElement._jasonMenuItemCaptionContainer.insertBefore(iconContainer, liElement._jasonMenuItemCaptionContainer.firstChild);
    }
}
/**
 * Determines if an arrow is needed for a menu element
 * @param {object} liElement - HTMLElement.
 */
jasonMenuWidgetParser.prototype.mustAddArrowIcon = function (liElement) {
    var result = false;
    result = liElement.children.length > 0;
    if(liElement.children.length == 1 && liElement.children[0].className == this.jasonMenuWidget.MENU_ITEM_CAPTION)
        result = false;
    return result;
}



//#region DOM Parser
/**
 * DOM parser is parsing HTML and creates menu items.
 */
function jasonMenuWidgetDOMParser(jasonMenuWidget) {
    jasonMenuWidgetParser.call(this, jasonMenuWidget);
}
/**
 * Creates menu item from UI element 
 * @param {object} liElement - HTMLElement.
 */
jasonMenuWidgetDOMParser.prototype.createMenuItem = function (liElement) {
    var result = new jasonMenuItem(this.jasonMenuWidget);
    var menuItemLevel = liElement.getAttribute(this.jasonMenuWidget.MENU_ITEM_LEVEL_ATTRIBUTE);
    if (menuItemLevel)
        result.Level = parseInt(menuItemLevel);

    this.createMenuItemCaption(liElement, result);

    result.Title = liElement.getAttribute("title");
    result.Element = liElement;
    if (this.jasonMenuWidget.options.Invokable)
        liElement.classList.add(this.jasonMenuWidget.MENU_ITEM_CLICKABLE);
    liElement.addEventListener("click", result.onItemClick);
    liElement.addEventListener("mouseenter", result.onItemMouseEnter);
    liElement.addEventListener("mouseleave", result.onItemMouseLeave);
    liElement.classList.add(this.jasonMenuWidget.MENU_ITEM_CLASS);
    jasonWidgets.common.setData(liElement, "jasonMenuItem", result);
    return result;
}
/**
 * Creates json representation of the UL element structure.
 * @param {object} ulElementMenu - HTMLElement.
 */
jasonMenuWidgetDOMParser.prototype.populateMenu = function (ulElementMenu) {
    var self = this;
    var menu = new jasonMenu();
    //recursive function that creates menu item containers for elements that need them.
    //and constructs the jasonMenu representation of the menu DOM.
    var populateItems = function (parentMenuItem, menuItemElement) {
        var menuItemContainer = menuItemElement;
        //if the element is an LI and it has child items
        //then we need to create a menu item container for the child elements.
        if (menuItemElement.tagName == "LI" && self.mustAddArrowIcon(menuItemElement)) {
            self.createMenuItemArrowIcon(menuItemElement);
            self.createSubItemsContainer(menuItemElement);
            menuItemContainer = menuItemElement.getElementsByClassName(self.jasonMenuWidget.MENU_ITEMS_CONTAINER_CLASS)[0];
        }
        //we iterate through the child items and create a menu item for each child LI element.
        for (var i = 0 ; i <= menuItemContainer.children.length - 1; i++) {
            var menuItemElement = menuItemContainer.children[i];
            if (menuItemElement.tagName == "UL") {
                for (var x = 0; x <= menuItemElement.children.length - 1; x++) {
                    var subMenuItemElement = menuItemElement.children[x];
                    var subMenuItem = self.createMenuItem(subMenuItemElement);
                    parentMenuItem.Items.push(subMenuItem);
                    populateItems(subMenuItem, subMenuItemElement);
                }
            } else {
                if (menuItemElement.tagName == "LI") {
                    var menuItem = self.createMenuItem(menuItemElement);
                    parentMenuItem.Items.push(menuItem);
                    populateItems(menuItem, menuItemElement);
                }
            }

        }
    }
    //iterating through the root items of the UL element
    for (var i = 0; i <= ulElementMenu.children.length - 1; i++) {
        var rootMenuElement = ulElementMenu.children[i];
        rootMenuElement.setAttribute(this.jasonMenuWidget.MENU_ITEM_LEVEL_ATTRIBUTE, 0);
        var rootMenuItem = this.createMenuItem(rootMenuElement);
        rootMenuItem.Level = 0;
        menu.Items.push(rootMenuItem);
        populateItems(rootMenuItem, rootMenuElement);
    }
    return menu;
}
//#endregion


//#region JSON Parser
/**
 * JSON parser is parsing a json representation of the menu and creates HTML.
 */
function jasonMenuWidgetJSONParser(jasonMenuWidget) {
    jasonMenuWidgetParser.call(this, jasonMenuWidget);
    this.createMenuElementFromItem = this.createMenuElementFromItem.bind(this);
}
/**
 * Create HTML structure from the menu json representation.
 * @param {object} jasonMenu - jasonMenu.
 */
jasonMenuWidgetJSONParser.prototype.populateMenu = function (jasonMenu) {
    var self = this;
    var populateItems = function (parentMenuItem, menuItemUL) {
        var menuUL = menuItemUL;
        //if the parent item has child items
        //then we create a UL element to place the child items.
        if (parentMenuItem.Items.length > 0) {
            var subMenuItemsUL = self.jasonMenuWidget.createElement("UL");
            parentMenuItem.Element.appendChild(subMenuItemsUL);
            self.createMenuItemArrowIcon(parentMenuItem.Element);
            self.createSubItemsContainer(parentMenuItem.Element);
            menuUL = subMenuItemsUL;
        }
        //iterating through the child items to create LI elements.
        for (var i = 0 ; i <= parentMenuItem.Items.length - 1; i++) {
            var menuItem = parentMenuItem.Items[i];
            var menuElement = self.createMenuElementFromItem(menuItem);
            menuUL.appendChild(menuElement);
            if (menuItem.Items.length > 0) {
                populateItems(menuItem, subMenuItemsUL);
            }
        }
    }
    var menuUL = this.jasonMenuWidget.ULMenuElement;
    //iterating through the root items of the UL element
    for (var i = 0; i <= jasonMenu.Items.length - 1; i++) {
        var rootMenuItem = jasonMenu.Items[i];
        var rootMenuElement = this.createMenuElementFromItem(rootMenuItem);
        rootMenuItem.Level = 0;
        rootMenuElement.setAttribute(this.jasonMenuWidget.MENU_ITEM_LEVEL_ATTRIBUTE, rootMenuItem.Level);
        menuUL.appendChild(rootMenuElement);
        populateItems(rootMenuItem, menuUL);
    }
    return menuUL;
}
/**
 * Creates menu UI element from menu item 
 * @param {object} menuItem - jasonMenuItem.
 */
jasonMenuWidgetJSONParser.prototype.createMenuElementFromItem = function (menuItem) {
    //assigning the menu widget instance to the item if not already assigned.
    if (!menuItem.jasonMenuWidget)
        menuItem.jasonMenuWidget = this.jasonMenuWidget;
    var self = this;
    //the newly created element.
    var menuItemElement = this.jasonMenuWidget.createElement("li");
    if (menuItem.Content) {
        if (!menuItem.Content.tagName) {
            var menuContent = this.jasonMenuWidget.createElement("div");
            menuContent.innerHTML = menuItem.Content;
            menuItemElement.appendChild(menuContent);
        } else {
            menuItemElement.appendChild(menuItem.Content);
        }
        menuItemElement.classList.add(this.jasonMenuWidget.MENU_ITEM_CONTENT);
        menuItem.Content.classList.add(this.jasonMenuWidget.MENU_ITEM_CONTENT_CLASS);
    } else {
        menuItemElement.classList.add(this.jasonMenuWidget.MENU_ITEM_CLASS);
        this.createMenuItemCaption(menuItemElement, menuItem);

        if (menuItem.Icon) {
            this.createMenuItemIcon(menuItemElement, menuItem.Icon)
        }
        if (menuItem.Clickable)
            menuItemElement.classList.add(this.jasonMenuWidget.MENU_ITEM_CLICKABLE);
        if (!menuItem.Enabled)
            menuItemElement.classList.add(this.jasonMenuWidget.MENU_ITEM_DISABLED);


        if (menuItem.HasCheckBox) {
            var checkboxContainer = this.jasonMenuWidget.createElement("div");
            checkboxContainer.classList.add(this.jasonMenuWidget.MENU_ITEM_CHECKBOX_CLASS);
            var checkBoxElement = this.jasonMenuWidget.createElement("input");
            checkboxContainer.appendChild(checkBoxElement);
            checkBoxElement.classList.add(this.jasonMenuWidget.MENU_ITEM_CHECKBOX_CLASS);
            checkBoxElement.setAttribute("type", "checkbox");
            this.jasonMenuWidget.checkBoxElements.push(checkBoxElement);
            if (menuItem.Checked)
                checkBoxElement.checked = true;
            jasonWidgets.common.setData(checkBoxElement, "jasonMenuItem", menuItem);
            menuItemElement._jasonMenuItemCaptionContainer.insertBefore(checkboxContainer, menuItemElement._jasonMenuItemCaptionContainer.firstChild);
            menuItem.CheckBoxElement = checkBoxElement;
            checkBoxElement.addEventListener("click", menuItem.onCheckboxClick);
        }
        menuItemElement.setAttribute("title", menuItem.Title);
    }

    
    menuItem.Element = menuItemElement;

    menuItemElement.addEventListener("click", menuItem.onItemClick);
    menuItemElement.addEventListener("mouseenter", menuItem.onItemMouseEnter);
    menuItemElement.addEventListener("mouseleave", menuItem.onItemMouseLeave);
    jasonWidgets.common.setData(menuItemElement, "jasonMenuItem", menuItem);
    return menuItemElement;
}
//#endregion