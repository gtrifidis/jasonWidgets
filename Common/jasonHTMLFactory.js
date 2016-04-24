var
    JW_MENU_ITEM = "jw-menu-item",
    JW_MENU_ITEM_CLICKABLE = "clickable",
    JW_MENU_ITEM_DISABLED = "disabled",
    JW_MENU_ITEM_CAPTION = "jw-menu-item-caption",
    JW_MENU_ITEM_CAPTION_ONLY = "just-caption",
    JW_MENU_ITEM_ICON = "jw-menu-item-icon",
    JW_MENU_ITEM_ARROW = "jw-menu-item-arrow",
    JW_MENU_ITEM_CHECKBOX = "jw-menu-item-checkbox",
    JW_TEXT_OVERFLOW = "jw-text-overflow",
    JW_LABEL = "jw-label",
    JW_TEXT_INPUT = "jw-text-input",
    JW_BUTTON = "jw-button",
    JW_BUTTON_ELEMENT = "jw-button-element";
var
    JW_ICON = "jw-icon ",
    JW_ICON_ARROW_DOWN = JW_ICON + "arrow-down",
    JW_ICON_ARROW_UP = JW_ICON + "arrow-up",
    JW_ICON_ARROW_LEFT = JW_ICON + "arrow-left",
    JW_ICON_ARROW_RIGHT = JW_ICON + "arrow-right",
    JW_ICON_CALENDAR = JW_ICON + "calendar",
    JW_ICON_CHEVRON_DOWN = JW_ICON + "chevron-down",
    JW_ICON_CHEVRON_UP = JW_ICON + "chevron-up",
    JW_ICON_CHEVRON_LEFT = JW_ICON + "chevron-left",
    JW_ICON_CHEVRON_RIGHT = JW_ICON + "chevron-right",
    JW_ICON_CIRCLE_CHECK = JW_ICON + "circle-check",
    JW_ICON_CIRCLE_X = JW_ICON + "circle-x",
    JW_ICON_CLOCK = JW_ICON + "clock",
    JW_ICON_COLUMNS = JW_ICON + "columns",
    JW_ICON_MENU = JW_ICON + "menu",
    JW_ICON_SEARCH = JW_ICON + "search",
    JW_ICON_SORT_ASC = JW_ICON + "sort-asc",
    JW_ICON_SORT_DESC = JW_ICON + "sort-desc";


/**
 * HTML factory, creating HTML for widgets.
 * @constructor
 * @description A common helper class that generates HTML for different jason widgets.
 * @memberOf Common
 */
function jasonHTMLFactory() {
    /**
     * Creates the HTML for a jwButton.
     * @param {string=} caption - Button caption.
     * @param {string=} iconClass - Icon class name.
     */
    jasonHTMLFactory.prototype.createJWButton = function (caption, iconClass) {
        var result = document.createElement("a");
        result.classList.add(JW_BUTTON);
        result.setAttribute("href", "javascript:void(0)");

        if (caption != void 0 && caption.trim().length > 0) {
            var captionElement = document.createElement("span");
            captionElement.classList.add(JW_LABEL);
            captionElement.classList.add(JW_TEXT_OVERFLOW);
            captionElement.appendChild(document.createTextNode(caption));
            captionElement.setAttribute(TITLE_ATTR, caption);
            result.appendChild(captionElement);
        }

        if (iconClass != void 0 && iconClass.trim().length > 0) {
            var iconElement = document.createElement("i");
            iconElement.className = iconClass;
            result.appendChild(iconElement);
        }
        return result;
    }
    /**
     * Creates the HTML for a text input styled for jasonWidgets.
     * @param {string=} inputMode - Input mode attribute value.
     * @param {string=} placeHolder - Placeholder attribute value.
     * @param {boolean=} readOnly - Readonly attribute value.
     */
    jasonHTMLFactory.prototype.createJWTextInput = function (inputMode,placeHolder,readOnly,inputType) {
        var result = document.createElement("input");
        result.classList.add(JW_TEXT_INPUT);
        result.setAttribute(TYPE_ATTR, "text");
        if (inputType != void 0 && inputType.trim().length > 0)
            result.setAttribute(TYPE_ATTR, inputType);
        if (inputMode != void 0 && inputMode.trim().length > 0)
            result.setAttribute(INPUT_MODE_ATTR, inputMode);
        if (placeHolder != void 0 && placeHolder.trim().length > 0)
            result.setAttribute(PLACEHOLDER_ATTR, placeHolder);
        if (readOnly != void 0 && readOnly)
            result.setAttribute(READONLY_ATTR, readOnly);

        return result;
    }
    /**
     * Creates the HTML for a jwLabel.
     * @param {string=} caption - Label caption.
     */
    jasonHTMLFactory.prototype.createJWLinkLabel = function (caption) {
        var result = document.createElement("a");
        result.setAttribute("href", "javascript:void(0)");
        result.classList.add(JW_LABEL);
        result.classList.add(JW_TEXT_OVERFLOW);
        if (caption != void 0 && caption.trim().length > 0) {
            var captionElement = document.createElement("span");
            captionElement.appendChild(document.createTextNode(caption));
            result.appendChild(captionElement);
        }

        return result;
    }
    /**
     * Creates the HTML for a jwMenuItem.
     * @param {string} [orientation = 'horizontal'] orientation - Parent menu's orientation.
     * @param {object} options - HTML factory menu item creation options.
     * @param {HTMLElement=} element - If provided instead of creating a new element, the element passed will be used.
     */
    jasonHTMLFactory.prototype.createJWMenuItem = function (orientation, options, element) {
        var result = element == void 0 ? document.createElement("li") : element;
        var menuCaption;
        result.classList.add(JW_MENU_ITEM);

        if (options.clickable)
            result.classList.add(JW_MENU_ITEM_CLICKABLE);

        if (!options.enabled)
            result.classList.add(JW_MENU_ITEM_DISABLED);

        result.setAttribute(TITLE_ATTR, options.title)

        if (options.caption != void 0 && options.caption.trim().length > 0) {
            menuCaption = document.createElement("div");
            menuCaption.classList.add(JW_MENU_ITEM_CAPTION);
            menuCaption.appendChild(jw.htmlFactory.createJWLinkLabel(options.caption));
            menuCaption.classList.add(JW_TEXT_OVERFLOW);
            menuCaption.classList.add(JW_MENU_ITEM_CAPTION_ONLY);
            result.appendChild(menuCaption);
        }

        if (options.icon != void 0 && options.icon.trim().length > 0) {
            var iconWrapper = document.createElement("div");
            var iconElement = document.createElement("i");
            iconElement.className = options.icon;
            iconWrapper.classList.add(JW_MENU_ITEM_ICON);
            iconWrapper.appendChild(iconElement);
            menuCaption.classList.add("has-icon");
            menuCaption.classList.remove(JW_MENU_ITEM_CAPTION_ONLY);
            result.appendChild(iconWrapper);

        }

        if (options.hasCheckBox != void 0 && options.hasCheckBox) {
            var checkBoxWrapper = document.createElement("div");
            var checkBox = document.createElement("input");
            checkBox.setAttribute(TYPE_ATTR, "checkbox");
            checkBox.checked = options.checked;
            checkBoxWrapper.appendChild(checkBox);
            checkBoxWrapper.classList.add(JW_MENU_ITEM_CHECKBOX);
            menuCaption.classList.add("has-checkbox");
            menuCaption.classList.remove(JW_MENU_ITEM_CAPTION_ONLY);
            result.appendChild(checkBoxWrapper);
        }


        if (options.caption != void 0 && options.caption.trim().length > 0) {
            result.appendChild(menuCaption);
        }

        if (options.items != void 0 && options.items.length > 0) {
            var arrowWrapper = document.createElement("div");
            var arrowElement = document.createElement("i");
            if (options.level == 0) {
                arrowElement.className = orientation == "horizontal" ? JW_ICON_CHEVRON_DOWN : JW_ICON_CHEVRON_RIGHT;
            } else {
                arrowElement.className = orientation == "horizontal" ? JW_ICON_CHEVRON_RIGHT : JW_ICON_CHEVRON_DOWN;
            }
            
            menuCaption.classList.add("has-arrow");
            arrowWrapper.appendChild(arrowElement);
            arrowWrapper.classList.add(JW_MENU_ITEM_ARROW);
            menuCaption.classList.remove(JW_MENU_ITEM_CAPTION_ONLY);
            result.appendChild(arrowWrapper);
        }

        return result;
    }
    /**
     * Converts an existing li element to a jwMenuItem element
     * @param {string=} orientation - Parent menu's orientation.
     * @param {HTMLElement} liElement - HTML factory menu item creation options.
     */
    jasonHTMLFactory.prototype.convertToJWMenuItem = function (orientation, liElement) {
        if (liElement != void 0) {
            liElement.classList.add(JW_MENU_ITEM);
            liElement.classList.add(JW_MENU_ITEM_CLICKABLE);
            var textNode = jw.common.getNodeText(liElement);
            if (textNode != void 0) {
                menuCaption = document.createElement("div");
                menuCaption.classList.add(JW_MENU_ITEM_CAPTION);
                menuCaption.appendChild(jw.htmlFactory.createJWLinkLabel(textNode.textContent));
                menuCaption.classList.add(JW_TEXT_OVERFLOW);
                menuCaption.classList.add(JW_MENU_ITEM_CAPTION_ONLY);
                liElement.replaceChild(menuCaption, textNode);
            }
            var isReadOnly = liElement.getAttribute(READONLY_ATTR);
            if (isReadOnly != void 0 && isReadOnly == true) {
                liElement.classList.add(JW_MENU_ITEM_DISABLED);
            }
            var hasSubItems = liElement.getElementsByTagName("UL").length > 0;
            if (hasSubItems) {
                var arrowWrapper = document.createElement("div");
                var arrowElement = document.createElement("i");
                arrowElement.className = orientation == "horizontal" ? JW_ICON_CHEVRON_RIGHT : JW_ICON_CHEVRON_DOWN;
                menuCaption.classList.add("has-arrow");
                arrowWrapper.appendChild(arrowElement);
                arrowWrapper.classList.add(JW_MENU_ITEM_ARROW);
                liElement.appendChild(arrowWrapper);
            }
        }
    }
}

jw.htmlFactory = new jasonHTMLFactory();