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
 * @constructor
 * @ignore
 */
function jasonMenuWidgetParser(menuUI) {
    this.menuUI = menuUI;
    return jasonMenuWidgetParser;
}
/**
* Creates sub menu items container.
* @param {object} menuElement - HTMLElement.
*/
jasonMenuWidgetParser.prototype.createSubItemsContainer = function () {
    //var subMenuItemsUL = this.menuUI.createElement("UL");
    

    var menuItemsContainer = this.menuUI.createElement("div");
    menuItemsContainer.classList.add(MENU_ITEMS_CONTAINER_CLASS);
    //menuItemsContainer.appendChild(subMenuItemsUL);
    menuItemsContainer.style.display = "none";
    //jasonWidgets.common.moveChildrenTo(menuElement, menuItemsContainer, null, jasonWidgets.common.inlineElements, [JW_MENU_ITEM_CAPTION]);
    //menuElement.appendChild(menuItemsContainer);
    //menuElement._jasonMenuItemsContainer = menuItemsContainer;
    return menuItemsContainer;
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
        menuItem.caption = textNode.textContent.trim();
        jasonWidgets.common.removeNodeText(liElement);
    }
    var menuItemCaptionContainer = this.menuUI.createElement("div");
    menuItemCaptionContainer.classList.add(JW_MENU_ITEM_CAPTION);
    if (menuItem.isDivider) {
        menuItemCaptionContainer.appendChild(this.menuUI.createElement("hr"));
        liElement.classList.add(MENU_ITEM_DIVIDER);
        liElement.setAttribute(MENU_ITEM_NO_HIGHLIGHT_ATTR, "true");
    }else{
        var menuCaption = this.menuUI.createElement("div");
        menuCaption.classList.add(JW_MENU_ITEM_CAPTION);

        
        menuCaption.appendChild(this.menuUI.createTextNode(menuItem.caption));
        menuItemCaptionContainer.appendChild(menuCaption);
    }


    liElement._jasonMenuItemCaptionContainer = menuItemCaptionContainer;
    liElement.appendChild(menuItemCaptionContainer);
}
/**
 * Creates menu item arrow icon container.
 * @param {object} liElement - HTMLElement.
 */
jasonMenuWidgetParser.prototype.createMenuItemArrowIcon = function (liElement) {
    if (liElement._jasonMenuItemCaptionContainer) {
        var iconContainer = this.menuUI.createElement("div");
        iconContainer.classList.add(JW_MENU_ITEM_ARROW);
        var iconElement = this.menuUI.createElement("i");
        var menuLevel = liElement.getAttribute(MENU_ITEM_LEVEL_ATTRIBUTE);
        iconElement.className = this.menuUI.options.orientation == "horizontal" && menuLevel == 0 ? JW_ICON_CHEVRON_DOWN : JW_ICON_CHEVRON_RIGHT;
        iconContainer.appendChild(iconElement);
        liElement._jasonMenuItemCaptionContainer.appendChild(iconContainer);
    }
}
/**
 * Creates menu item icon container.
 * @param {object} liElement - HTMLElement.
 * @param {string} iconClass - icon css class.
 */
jasonMenuWidgetParser.prototype.createMenuItemIcon = function (liElement,iconClass) {
    if (liElement._jasonMenuItemCaptionContainer) {
        var iconContainer = this.menuUI.createElement("div");
        iconContainer.classList.add(MENU_ICON);
        var iconElement = this.menuUI.createElement("i");
        iconElement.className = (iconClass);
        var menuLevel = liElement.getAttribute(MENU_ITEM_LEVEL_ATTRIBUTE);
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
    if(liElement.children.length == 1 && liElement.children[0].className == JW_MENU_ITEM_CAPTION)
        result = false;
    return result;
}



//#region DOM Parser
/**
 * DOM parser is parsing HTML and creates menu items.
 * @constructor
 * @ignore
 */
function jasonMenuWidgetDOMParser(menuUI) {
    jasonMenuWidgetParser.call(this, menuUI);
}
/**
 * Creates menu item from UI element 
 * @param {object} liElement - HTMLElement.
 */
jasonMenuWidgetDOMParser.prototype.createMenuItem = function (liElement) {
    var result = new jasonMenuItem(liElement,null,null);
    var menuItemLevel = liElement.getAttribute(MENU_ITEM_LEVEL_ATTRIBUTE);
    if (menuItemLevel)
        result.level = parseInt(menuItemLevel);

    this.menuUI.eventManager.addEventListener(liElement, CLICK_EVENT, this.menuUI.onItemClick, true);
    this.menuUI.eventManager.addEventListener(liElement, TOUCH_START_EVENT, this.menuUI.onItemTouch, true);
    this.menuUI.eventManager.addEventListener(liElement, MOUSE_ENTER_EVENT, this.menuUI.onItemMouseEnter,true);
    this.menuUI.eventManager.addEventListener(liElement, MOUSE_LEAVE_EVENT, this.menuUI.onItemMouseLeave,true);
    jasonWidgets.common.setData(liElement, MENU_ITEM_DATA_KEY, result);
    return result;
}
/**
 * Creates json representation of the UL element structure.
 * @param {object} ulElementMenu - HTMLElement.
 */
jasonMenuWidgetDOMParser.prototype.populateMenu = function (ulElementMenu) {
    var self = this;
    var menu = this.menuUI.widget;
    //recursive function that creates menu item containers for elements that need them.
    //and constructs the jasonMenu representation of the menu DOM.
    var populateItems = function (parentMenuItem, menuItemElement) {
        //we iterate through the child items and create a menu item for each child LI element.
        for (var i = 0 ; i <= menuItemElement.children.length - 1; i++) {
            var childElement = menuItemElement.children[i];
            
            if (childElement.tagName == "UL") {
                var subItemsMenuContainer = self.createSubItemsContainer();
                var subItemsUL = self.menuUI.createElement("ul");
                subItemsMenuContainer.appendChild(subItemsUL);
                menuItemElement.appendChild(subItemsMenuContainer);
                menuItemElement._jasonMenuItemsContainer = subItemsMenuContainer;
                jw.common.moveChildrenTo(childElement, subItemsUL);
                childElement.setAttribute("fordelete", true);
                for (var x = 0; x <= subItemsUL.children.length - 1; x++) {
                    var subMenuItemElement = subItemsUL.children[x];
                    var subMenuItem = self.createMenuItem(subMenuItemElement);
                    jw.htmlFactory.convertToJWMenuItem(self.menuUI.options.orientation,subMenuItemElement);
                    parentMenuItem.items.push(subMenuItem);
                    subMenuItem.parent = parentMenuItem;
                    subMenuItem.level = parentMenuItem.level + 1;
                    populateItems(subMenuItem, subMenuItemElement);
                }
            } else {
                if (childElement.tagName == "LI") {
                    jw.htmlFactory.convertToJWMenuItem(self.menuUI.options.orientation, childElement);
                }
            }
        }
        var itemsToDelete = jw.common.getElementsByAttribute(menuItemElement, "fordelete", "true");
        for (var i = 0 ; i <= itemsToDelete.length - 1; i++) {
            menuItemElement.removeChild(itemsToDelete[i]);
        }
    }
    //iterating through the root items of the UL element
    for (var i = 0; i <= ulElementMenu.children.length - 1; i++) {
        var rootMenuElement = ulElementMenu.children[i];
        rootMenuElement.setAttribute(MENU_ITEM_LEVEL_ATTRIBUTE, 0);
        var rootMenuItem = this.createMenuItem(rootMenuElement);
        jw.htmlFactory.convertToJWMenuItem( this.menuUI.options.orientation == "horizontal" ? "vertical" : "horizontal", rootMenuElement);
        rootMenuItem.level = 0;
        menu.items.push(rootMenuItem);
        populateItems(rootMenuItem, rootMenuElement);
    }
    return menu;
}
//#endregion


//#region JSON Parser
/**
 * JSON parser is parsing a json representation of the menu and creates HTML.
 * @constructor
 * @ignore
 */
function jasonMenuWidgetJSONParser(menuUI) {
    jasonMenuWidgetParser.call(this, menuUI);
    this.createMenuElementFromItem = this.createMenuElementFromItem.bind(this);
}
/**
 * Create HTML structure from the menu json representation.
 * @param {object} jasonMenu - jasonMenu.
 */
jasonMenuWidgetJSONParser.prototype.populateMenu = function (jasonMenu) {
    var self = this;
    var populateItems = function (parentMenuItem, menuItemUL) {
        var subMenuItemsUL;
        var subItemsContainer;
        //if the parent item has child items
        //then we create a UL element to place the child items.
        if (parentMenuItem.items.length > 0) {
            subItemsContainer = self.createSubItemsContainer();
            subMenuItemsUL = self.menuUI.createElement("ul");
            subItemsContainer.appendChild(subMenuItemsUL);
            parentMenuItem.htmlElement.appendChild(subItemsContainer);
            parentMenuItem.htmlElement._jasonMenuItemsContainer = subItemsContainer;
        }
        var menuULToUse = subMenuItemsUL != void 0 ? subMenuItemsUL : menuUL;
        //iterating through the child items to create LI elements.
        for (var i = 0 ; i <= parentMenuItem.items.length - 1; i++) {
            var newMenuItem = jw.common.isJWWidget(parentMenuItem.items[i]) ? parentMenuItem.items[i] : null;
            var newMenuElement;
            if (newMenuItem == null) {
                newMenuElement = self.menuUI.createElement("li");
                newMenuItem = new jasonMenuItem(newMenuElement, null, null);
                newMenuItem.assign(parentMenuItem.items[i]);
                newMenuItem.clickable = newMenuItem.clickable == void 0 ? true : newMenuItem.clickable;
                newMenuItem.parent = parentMenuItem;
                newMenuItem.level = parentMenuItem.level + 1;
                self.createMenuElementFromItem(newMenuItem, newMenuElement);
            } else {
                newMenuElement = self.createMenuElementFromItem(newMenuItem, newMenuItem.htmlElement);
            }
            menuULToUse.appendChild(newMenuElement);
            parentMenuItem.items[i] = newMenuItem;
            if (newMenuItem.items.length > 0) {
                populateItems(newMenuItem, menuULToUse);
            }
        }
    }
    var menuUL = this.menuUI.ulMenuElement;
    //iterating through the root items of the UL element
    for (var i = 0; i <= jasonMenu.items.length - 1; i++) {
        var newMenuItem = jw.common.isJWWidget(jasonMenu.items[i]) ? jasonMenu.items[i] : null;
        var newMenuElement;
        if (newMenuItem == null) {
            newMenuElement = self.menuUI.createElement("li");
            newMenuItem = new jasonMenuItem(newMenuElement, null, null);
            newMenuItem.assign(jasonMenu.items[i]);
            newMenuItem.clickable = newMenuItem.clickable == void 0 ? true : newMenuItem.clickable;
            newMenuItem.level = 0;
            self.createMenuElementFromItem(newMenuItem, newMenuElement);
        }
        else{
            newMenuElement = self.createMenuElementFromItem(newMenuItem, newMenuItem.htmlElement);
        }
        newMenuElement.setAttribute(MENU_ITEM_LEVEL_ATTRIBUTE, newMenuItem.level);
        menuUL.appendChild(newMenuElement);

        jasonMenu.items[i] = newMenuItem;
        populateItems(newMenuItem, menuUL);
    }
    return menuUL;
}
/**
 * Creates menu UI element from menu item 
 * @param {object} menuItem - jasonMenuItem.
 */
jasonMenuWidgetJSONParser.prototype.createMenuElementFromItem = function (menuItem,menuElement) {
    var self = this;
    //the newly created element.
    var menuItemElement;

    if (menuItem.content) {
        menuItemElement = menuElement === void 0 ? this.menuUI.createElement("li") : menuElement;
        if (!menuItem.content.tagName) {
            var menuContent = this.menuUI.createElement("div");
            menuContent.innerHTML = menuItem.content;
            menuItemElement.appendChild(menuContent);
        } else {
            menuItemElement.appendChild(menuItem.content);
        }
        menuItemElement.classList.add(MENU_ITEM_CONTENT);
        menuItem.content.classList.add(MENU_ITEM_CONTENT_CLASS);
    } else {
        if (menuElement === void 0)
            menuItemElement = jw.htmlFactory.createJWMenuItem(this.menuUI.options.orientation, menuItem);
        else {
            menuItemElement = menuElement
            jw.htmlFactory.createJWMenuItem(this.menuUI.options.orientation, menuItem, menuItemElement);
        }

        if (menuItem.isDivider) {
            menuItemElement.appendChild(this.menuUI.createElement("hr"));
            menuItemElement.classList.add(MENU_ITEM_DIVIDER);
            menuItemElement.setAttribute(MENU_ITEM_NO_HIGHLIGHT_ATTR, "true");
        }
        if (menuItem.hasCheckBox) {
            var checkBoxElement = jw.common.getElementsByAttribute(menuItemElement, "type", "checkbox")[0];
            if (checkBoxElement != void 0) {
                menuItem.checkBoxElement = checkBoxElement;
                this.menuUI.eventManager.addEventListener(checkBoxElement, CLICK_EVENT, this.menuUI.onCheckboxClick);
            }
        }
        var self = this;
        this.menuUI.eventManager.addEventListener(menuItemElement, CLICK_EVENT, this.menuUI.onItemClick,true);
        this.menuUI.eventManager.addEventListener(menuItemElement, MOUSE_ENTER_EVENT, this.menuUI.onItemMouseEnter);
        this.menuUI.eventManager.addEventListener(menuItemElement, MOUSE_LEAVE_EVENT, this.menuUI.onItemMouseLeave);
    }
    if (menuElement == void 0)
        jasonWidgets.common.setData(menuItemElement, MENU_ITEM_DATA_KEY, menuItem);
    return menuItemElement;
}
//#endregion