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
     * @param {HTMLElement} buttonElement - An existing element to convert it to a jasonButton.
     */
    jasonHTMLFactory.prototype.createJWButton = function (caption, iconClass, buttonElement) {
        var result = buttonElement ? buttonElement: document.createElement("a");
        result.classList.add(jw.DOM.classes.JW_BUTTON);
        result.setAttribute("href", "javascript:void(0)");

        if (caption != void 0 && caption.trim().length > 0) {
            var captionElement = document.createElement("span");
            captionElement.classList.add(jw.DOM.classes.JW_LABEL);
            captionElement.classList.add(jw.DOM.classes.JW_TEXT_OVERFLOW);
            captionElement.appendChild(document.createTextNode(caption));
            captionElement.setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR, caption);
            result.appendChild(captionElement);
        }
        if (iconClass != void 0 && iconClass.trim().length > 0) {
            var existingIcon = result.querySelectorAll("span.jw-icon")[0];
            if (existingIcon) {
                existingIcon.className = iconClass;
            } else {
                var iconElement = document.createElement("span");
                iconElement.className = iconClass;
                result.appendChild(iconElement);
            }

        }
        return result;
    }
    /**
     * Creates the HTML for a text input styled for jasonWidgets.
     * @param {string=} inputMode - Input mode attribute value.
     * @param {string=} placeHolder - Placeholder attribute value.
     * @param {boolean=} readonly - Readonly attribute value.
     * @param {string=} inputType - Input type.
     */
    jasonHTMLFactory.prototype.createJWTextInput = function (inputMode,placeHolder,readonly,inputType) {
        var result = document.createElement("input");
        result.classList.add(jw.DOM.classes.JW_TEXT_INPUT);
        result.setAttribute(jasonWidgets.DOM.attributes.TYPE_ATTR, "text");
        if (inputType != void 0 && inputType.trim().length > 0)
            result.setAttribute(jasonWidgets.DOM.attributes.TYPE_ATTR, inputType);
        if (inputMode != void 0 && inputMode.trim().length > 0)
            result.setAttribute(jasonWidgets.DOM.attributes.INPUT_MODE_ATTR, inputMode);
        if (placeHolder != void 0 && placeHolder.trim().length > 0)
            result.setAttribute(jasonWidgets.DOM.attributes.PLACEHOLDER_ATTR, placeHolder);
        if (readonly != void 0 && readonly)
            result.setAttribute(jasonWidgets.DOM.attributes.READONLY_ATTR, readonly);

        return result;
    }
    /**
     * Creates the HTML for a checkbox input styled for jasonWidgets.
     */
    jasonHTMLFactory.prototype.createJWCheckBoxInput = function (readonly, title, id) {
        var result = document.createElement("input");
        result.classList.add(jw.DOM.classes.JW_CHECKBOX_INPUT);
        result.setAttribute(jasonWidgets.DOM.attributes.TYPE_ATTR, "checkbox");
        if (readonly != void 0 && readonly)
            result.setAttribute(jasonWidgets.DOM.attributes.READONLY_ATTR, readonly);
        if (title != void 0 && title.trim().length > 0)
            result.setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR, title);
        if (id != void 0 && id.trim().length > 0)
            result.setAttribute(jasonWidgets.DOM.attributes.ID_ATTR, id);

        return result;
    }
    /**
     * Creates the HTML for a jw link Label.
     * @param {string=} caption - Label caption.
     */
    jasonHTMLFactory.prototype.createJWLinkLabel = function (caption) {
        var result = document.createElement("a");
        result.setAttribute("href", "javascript:void(0)");
        result.classList.add(jw.DOM.classes.JW_LABEL);
        result.classList.add(jw.DOM.classes.JW_TEXT_OVERFLOW);
        if (caption != void 0 && caption.trim().length > 0) {
            var captionElement = document.createElement("span");
            captionElement.appendChild(document.createTextNode(caption));
            captionElement.setAttribute(jw.DOM.attributes.TITLE_ATTR, caption);
            result.appendChild(captionElement);
        }

        return result;
    }
    /**
     * Creates the HTML for a jwLabel.
     * @param {string=} caption - Label caption.
     */
    jasonHTMLFactory.prototype.createJWLabel = function (caption) {
        var result = document.createElement("label");
        result.classList.add(jw.DOM.classes.JW_TEXT_OVERFLOW);
        if (caption != void 0 && caption.trim().length > 0) {
            result.setAttribute(jw.DOM.attributes.TITLE_ATTR, caption);
            result.appendChild(document.createTextNode(caption));
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
        result.classList.add(jw.DOM.classes.JW_MENU_ITEM);

        if (options.clickable)
            result.classList.add(jw.DOM.classes.JW_MENU_ITEM_CLICKABLE);

        if (!options.enabled)
            result.classList.add(jw.DOM.classes.JW_MENU_ITEM_DISABLED);

        result.setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR, options.title)

        if (options.caption != void 0 && options.caption.trim().length > 0) {
            menuCaption = document.createElement("div");
            menuCaption.classList.add(jw.DOM.classes.JW_MENU_ITEM_CAPTION);
            menuCaption.appendChild(jw.htmlFactory.createJWLinkLabel(options.caption));
            menuCaption.classList.add(jw.DOM.classes.JW_TEXT_OVERFLOW);
            menuCaption.classList.add(jw.DOM.classes.JW_MENU_ITEM_CAPTION_ONLY);
            result.appendChild(menuCaption);
        }

        if (options.icon != void 0 && options.icon.trim().length > 0) {
            var iconWrapper = document.createElement("div");
            var iconElement = document.createElement("span");
            iconElement.className = options.icon;
            iconWrapper.classList.add(jw.DOM.classes.JW_MENU_ITEM_ICON);
            iconWrapper.appendChild(iconElement);
            menuCaption.classList.add(jw.DOM.classes.JW_HAS_ICON);
            menuCaption.classList.remove(jw.DOM.classes.JW_MENU_ITEM_CAPTION_ONLY);
            result.appendChild(iconWrapper);

        }

        if (options.hasCheckBox != void 0 && options.hasCheckBox) {
            var checkBoxWrapper = document.createElement("div");
            var checkBox = document.createElement("input");
            checkBox.setAttribute(jasonWidgets.DOM.attributes.TYPE_ATTR, "checkbox");
            checkBox.checked = options.checked;
            checkBoxWrapper.appendChild(checkBox);
            checkBoxWrapper.classList.add(jw.DOM.classes.JW_MENU_ITEM_CHECKBOX);
            menuCaption.classList.add(jw.DOM.classes.JW_HAS_CHECKBOX);
            menuCaption.classList.remove(jw.DOM.classes.JW_MENU_ITEM_CAPTION_ONLY);
            result.appendChild(checkBoxWrapper);
        }


        if (options.caption != void 0 && options.caption.trim().length > 0) {
            result.appendChild(menuCaption);
        }

        if (options.items != void 0 && options.items.length > 0) {
            var arrowWrapper = document.createElement("div");
            //var arrowElement = document.createElement("i");
            var arrowElement = null;// jw.htmlFactory.createJWButton(null, options.level == 0 ? jw.DOM.icons.CHEVRON_RIGHT : jw.DOM.icons.CHEVRON_DOWN);
            var arrowIcon = null;

            if (options.level == 0) {
                arrowIcon = orientation == "horizontal" ? jw.DOM.icons.CHEVRON_DOWN : jw.DOM.icons.CHEVRON_RIGHT;
            } else {
                arrowIcon = orientation == "horizontal" ? jw.DOM.icons.CHEVRON_RIGHT : jw.DOM.icons.JCHEVRON_DOWN;
            }

            arrowElement = jw.htmlFactory.createJWButton(null, arrowIcon);

            jw.common.setData(arrowElement, jw.DOM.attributeValues.JW_MENU_ITEM_DATA_KEY, options);
            menuCaption.classList.add(jw.DOM.classes.JW_HAS_ARROW);
            arrowWrapper.appendChild(arrowElement);
            arrowWrapper.classList.add(jw.DOM.classes.JW_MENU_ITEM_ARROW);
            menuCaption.classList.remove(jw.DOM.classes.JW_MENU_ITEM_CAPTION_ONLY);
            result.appendChild(arrowWrapper);
        }

        return result;
    }
    /**
     * Converts an existing li element to a jwMenuItem element
     * @param {string=} orientation - Parent menu's orientation.
     * @param {HTMLElement} liElement - HTML factory menu item creation options.
     * @param {Menus.jasonMenuItem} [menuItem=undefined] - Menu item instance.
     */
    jasonHTMLFactory.prototype.convertToJWMenuItem = function (orientation, liElement,menuItem) {
        if (liElement != void 0) {
            liElement.classList.add(jw.DOM.classes.JW_MENU_ITEM);
            liElement.classList.add(jw.DOM.classes.JW_MENU_ITEM_CLICKABLE);
            var textNode = jw.common.getNodeText(liElement);
            if (textNode != void 0) {
                menuCaption = document.createElement("div");
                menuCaption.classList.add(jw.DOM.classes.JW_MENU_ITEM_CAPTION);
                menuCaption.appendChild(jw.htmlFactory.createJWLinkLabel(textNode.textContent));
                menuCaption.classList.add(jw.DOM.classes.JW_TEXT_OVERFLOW);
                menuCaption.classList.add(jw.DOM.classes.JW_MENU_ITEM_CAPTION_ONLY);
                liElement.replaceChild(menuCaption, textNode);
                menuItem.caption = textNode.textContent.trim();
                menuItem.name = "mnu_" + menuItem.caption;
            }
            var isReadOnly = liElement.getAttribute(jasonWidgets.DOM.attributes.READONLY_ATTR);
            if (isReadOnly != void 0 && isReadOnly == true) {
                liElement.classList.add(jw.DOM.classes.JW_MENU_ITEM_DISABLED);
            }

            var checkboxes = liElement.getElementsByTagName("input");
            if (checkboxes.length > 0) {
                var checkbox = null;
                for (var i = 0; i <= checkboxes.length - 1; i++) {
                    var typeAttr = checkboxes[i].getAttribute(jw.DOM.attributes.TYPE_ATTR);
                    if (typeAttr && typeAttr.toLowerCase() == "checkbox") {
                        checkbox = checkboxes[i];
                        break;
                    }
                }
                if (checkbox && checkbox.parentNode == liElement) {
                    checkbox.parentNode.removeChild(checkbox);
                    var checkBoxWrapper = document.createElement("div");
                    checkbox.setAttribute(jasonWidgets.DOM.attributes.TYPE_ATTR, "checkbox");
                    checkBoxWrapper.appendChild(checkbox);
                    checkBoxWrapper.classList.add(jw.DOM.classes.JW_MENU_ITEM_CHECKBOX);
                    menuCaption.classList.add(jw.DOM.classes.JW_HAS_CHECKBOX);
                    menuCaption.classList.remove(jw.DOM.classes.JW_MENU_ITEM_CAPTION_ONLY);
                    liElement.appendChild(checkBoxWrapper);
                    menuItem.hasCheckBox = true;
                    menuItem.checkBoxElement = checkbox;
                }
            }
            var hasSubItems = liElement.getElementsByTagName("UL").length > 0;
            if (hasSubItems) {
                var arrowElement = jw.htmlFactory.createJWButton(null, orientation == "horizontal" ? jw.DOM.icons.CHEVRON_RIGHT : jw.DOM.icons.CHEVRON_DOWN);
                var arrowWrapper = document.createElement("div");
                jw.common.setData(arrowElement, jw.DOM.attributeValues.JW_MENU_ITEM_DATA_KEY, menuItem);
                   ////var arrowElement = document.createElement("i");
                //arrowElement.className = orientation == "horizontal" ? jw.DOM.icons.JW_ICON_CHEVRON_RIGHT : jw.DOM.icons.JW_ICON_CHEVRON_DOWN;
                menuCaption.classList.add(jw.DOM.classes.JW_HAS_ARROW);
                arrowWrapper.appendChild(arrowElement);
                arrowWrapper.classList.add(jw.DOM.classes.JW_MENU_ITEM_ARROW);
                liElement.appendChild(arrowWrapper);
            }
        }
    }
    /**
     * Creates a div with a clear-float class CSS.
     */
    jasonHTMLFactory.prototype.createClearFloat = function () {
        var result = document.createElement("div");
        result.classList.add(jw.DOM.classes.JW_CLEAR_FLOAT_CLASS);
        return result;
    }
}

jw.htmlFactory = new jasonHTMLFactory();