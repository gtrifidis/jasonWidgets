/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonDropDownListButton.prototype = Object.create(jasonBaseWidget.prototype);
jasonDropDownListButton.prototype.constructor = jasonDropDownListButton;


/**
 * @class
 * @name jasonDropDownListButtonOptions
 * @description Configuration for the jasonDropDownListButton widget.
 * @memberOf Buttons
 * @augments Common.jasonWidgetOptions
 * @property {string} [caption=undefined] - Button caption.
 * @property {Globals.jw.DOM.icons}  [icon=undefined] - Button icon class.
 * @property {any[]} [data=[]] - Drop down list data.
 * @property {boolean} [multiSelect=false] - If true it allows to select/check multiple items from the drop down list.
 * @property {boolean} [checkboxes=false] - If true it shows check-boxes next to the list items.
 * @property {string}   [multipleSelectionSeparator = |] - Character to separate values displayed in the button when multiSelect is enabled.
 * @property {object}   [customization={}]       - Drop down list button customization.
 * @property {any}      [customization.itemTemplate=undefined]       - HTML string or script tag or function containing HTML to be used to render drop down list items. 
 * @property {HTMLElement} [tetheredElement=undefined] - If defined the drop down list will be shown at the coordinates of the tethered element.
 */

/**
 * @event Buttons.jasonDropDownListButton#onSelectItem
 * @type {object}
 * @property {Buttons.jasonDropDownListButton} sender - The button instance.
 * @property {object} value - The event data.
 * @property {object} value.selectedItem - The selected item object.
 * @property {number} value.selectedItemIndex - The selected item index.
 */

/**
 * @event Buttons.jasonDropDownListButton#onUnSelectItem
 * @type {object}
 * @property {Buttons.jasonDropDownListButton} sender - The button instance.
 * @property {object} value - The event data.
 * @property {object} value.selectedItem - The unselected item object.
 * @property {number} value.selectedItemIndex - The selected item index.
 */

/**
 * @event Buttons.jasonDropDownListButton#onHide
 * @type {object}
 * @property {Buttons.jasonDropDownListButton} sender - The button instance.
 */

/**
 * @event Buttons.jasonDropDownListButton#onShow
 * @type {object}
 * @property {Buttons.jasonDropDownListButton} sender - The button instance.
 */

/**
 * jasonDropDownListButton
 * @constructor
 * @descrption Button control widget.
 * @memberOf Buttons
 * @augments Common.jasonBaseWidget
 * @param {HTMLElement} htmlElement - DOM element that will contain the button.
 * @param {Buttons.jasonDropDownListButtonOptions} options - jasonDropDownListButton options. 
 * @property {any[]} selectedItems - Selected items.
 * @fires Buttons.jasonDropDownListButton#event:onSelectItem
 * @fires Buttons.jasonDropDownListButton#event:onUnSelectItem
 * @fires Buttons.jasonDropDownListButton#event:onHide
 * @fires Buttons.jasonDropDownListButton#event:onShow
 */
function jasonDropDownListButton(htmlElement, options) {
    this.defaultOptions = {
        multiSelect: false,
        checkboxes: false,
        multipleSelectionSeparator :"|"
    }
    this.onDataChange = this.onDataChange.bind(this);
    this.dataSource = new jasonDataSource({ data: options.data, onChange: this.onDataChange });
    jasonButton.call(this, htmlElement, options, "jasonDropDownListButton", jasonDropDownListButtonUIHelper);
    this.selectedItems = [];
}
/**
 * @ignore
 */
jasonDropDownListButton.prototype.onDataChange = function () {
    this.ui.renderListItems();
}
/**
 * Shows the drop down list.
 */
jasonDropDownListButton.prototype.showList = function () {
    this.ui.showList();
}
/**
 * Hides the drop down list.
 */
jasonDropDownListButton.prototype.hideList = function () {
    this.ui.hideList();
}
/**
 * Selects an item by item index.
 * @param {number} itemIndex - Index of the item to select.
 */
jasonDropDownListButton.prototype.selectItem = function (itemIndex) {
    if (typeof itemIndex == "number") {
        if (!this.options.multiSelect)
            this.selectedItems = [];
        var itemToAdd = this.dataSource.data[itemIndex];
        if (itemToAdd) {
            this.selectedItems.push(itemToAdd);
            this.selectedItemIndex = itemIndex;
            this.ui.updateCaption();
            this.triggerEvent(jw.DOM.events.JW_EVENT_ON_SELECT_ITEM, { selectedItem: itemToAdd, selectedItemIndex: itemIndex });
            this.validate();
        }
    }
}
/**
 * Deselects an item by item index.
 * @param {number} itemIndex - Index of the item to deselect.
 */
jasonDropDownListButton.prototype.deSelectItem = function (itemIndex) {
    var itemToRemove = this.dataSource.data[itemIndex];
    if (itemToRemove) {
        var indexToRemove = -1;
        this.selectedItems.filter(function (item, index) {
            var result = item._jwRowId == itemToRemove._jwRowId;
            if (result) {
                indexToRemove = index;
                return;
            }
        });
        if (indexToRemove >= 0) {
            this.selectedItems.splice(indexToRemove, 1);
            this.ui.updateCaption();
            this.triggerEvent(jw.DOM.events.JW_EVENT_ON_UNSELECT_ITEM, { selectedItem: itemToRemove, selectedItemIndex: itemIndex });
        }
    }
}

jasonDropDownListButtonUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonDropDownListButtonUIHelper.prototype.constructor = jasonDropDownListButtonUIHelper;

/**
 * Button UI widget helper.
 * @constructor
 * @ignore
 */
function jasonDropDownListButtonUIHelper(widget, htmlElement) {
    this.dropDownListContainer = null;
    this.dropDownList = null;
    this.onListItemClick = this.onListItemClick.bind(this);
    this.onListItemKeyDown = this.onListItemKeyDown.bind(this);
    /*if a click occurs outside the input or drop down list, hide the list.*/
    jwDocumentEventManager.addDocumentEventListener(jw.DOM.events.MOUSE_DOWN_EVENT, this.monitorForDocumentClick.bind(this));
    var self = this;
    jwDocumentEventManager.addDocumentEventListener(jw.DOM.events.TOUCH_MOVE_EVENT, function (scrollEvent) {
        self.hideList();
    });
    jasonButtonUIHelper.call(this, widget, htmlElement);
}
/**
 * Monitors for mouse down events on the document level, in order to hide the drop-down list.
 */
jasonDropDownListButtonUIHelper.prototype.monitorForDocumentClick = function (mouseDownEvent) {
    if (this.dropDownListContainer && this.dropDownListContainer.style.display == "") {
        if (jw.common.contains(this.htmlElement, mouseDownEvent.target))
            return;
        if (jw.common.isMouseEventOutOfContainer(this.dropDownListContainer, mouseDownEvent))
            this.hideList();
    }
}
/**
 * Renders buttons control's HTML.
 */
jasonDropDownListButtonUIHelper.prototype.renderUI = function () {
    jasonButtonUIHelper.prototype.renderUI.call(this);
    this.dropDownListContainer = this.createElement("DIV");
    this.dropDownList = this.createElement("UL");
    this.renderListItems();
    this.dropDownListContainer.appendChild(this.dropDownList);
    this.dropDownListContainer.style.display = "none";
    this.dropDownListContainer.style.position = "absolute";
    this.dropDownListContainer.classList.add(jw.DOM.classes.JW_DROP_DOWN_LIST);
    if (this.options.multiSelect)
        this.htmlElement.classList.add(jw.DOM.classes.JW_DROP_DOWN_BUTTON_MULTI_SELECT);
}
/**
 * Creates a caption from the current selection.
 */
jasonDropDownListButtonUIHelper.prototype.createCaptionFromSelection = function(){
    var self = this;
    var captionValue = "";
    var fieldValues = [];
    this.widget.selectedItems.forEach(function (selectedItem,index) {
        self.options.displayFields.forEach(function (displayField) {
            fieldValues.push(selectedItem[displayField]);
        });
        captionValue = captionValue + jasonWidgets.common.formatString(self.options.displayFormat, fieldValues);
        if (self.widget.selectedItems.length > 1 && index < self.widget.selectedItems.length -1)
            captionValue = captionValue + " " + self.options.multipleSelectionSeparator + " ";
        fieldValues = [];
    });
    return captionValue;
}
/**
 * Updates the button caption and title.
 */
jasonDropDownListButtonUIHelper.prototype.updateCaption = function () {
    var caption = this.createCaptionFromSelection();
    jw.common.replaceNodeText(this.htmlElement.children[0], caption);
    this.htmlElement.children[0].setAttribute(jw.DOM.attributes.TITLE_ATTR, caption);
}
/**
 * Render list items.
 */
jasonDropDownListButtonUIHelper.prototype.renderListItems = function (data) {
    var dataToRender = data ? data : this.widget.dataSource.data;
    jw.common.removeChildren(this.dropDownList);
    var nextTabIndex = jasonWidgets.common.getNextTabIndex();
    for (var i = 0; i <= dataToRender.length - 1; i++) {
        var listItem = this.createElement("li");
        var dataItem = dataToRender[i];
        var itemCaption = null;
        if (this.options.customization.itemTemplate) {
            jw.common.applyTemplate(listItem, this.options.customization.itemTemplate, this.options.customization.dataFieldAttribute, dataItem);
        } else {
            var displayText = this.formatDataItem(dataItem);
            itemCaption = jw.htmlFactory.createJWLabel(displayText)
            var checkboxElement = null;
            if (this.options.checkboxes) {
                //var uniqueId = jw.common.generateUUID();
                checkboxElement = jw.htmlFactory.createJWCheckBoxInput(false, null);
                listItem.appendChild(checkboxElement);
                //itemCaption.setAttribute(jw.DOM.attributes.FOR_ATTR, uniqueId);
            }
            listItem.appendChild(itemCaption);
        }
        listItem.className = jw.DOM.classes.JW_DROP_DOWN_LIST_ITEM;
        listItem.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_JW_ITEM_INDEX_ATTR, dataItem._jwRowId);
        listItem.setAttribute(jasonWidgets.DOM.attributes.JW_ITEM_INDEX_ATTR, i);
        listItem.setAttribute(jasonWidgets.DOM.attributes.TABINDEX_ATTR, nextTabIndex);
        jasonWidgets.common.setData(listItem, "jDropDownListDataItem", dataItem);
        //if (itemCaption)
        //    this.eventManager.addEventListener(itemCaption, jw.DOM.events.MOUSE_DOWN_EVENT, this.onListItemClick);
        //if (this.options.checkboxes)
        //    this.eventManager.addEventListener(listItem.getElementsByTagName("input")[0], jw.DOM.events.INPUT_EVENT, this.onListItemClick,true);
        this.eventManager.addEventListener(listItem, jw.DOM.events.KEY_DOWN_EVENT, this.onListItemKeyDown,true);
        this.eventManager.addEventListener(listItem, jw.DOM.events.MOUSE_DOWN_EVENT, this.onListItemClick,true);
        nextTabIndex++;
        this.dropDownList.appendChild(listItem);
    }
}
/**
 * @ignore
 * Formats the drop down list's item string value.
 */
jasonDropDownListButtonUIHelper.prototype.formatDataItem = function (dataItem) {
    var fieldValues = [];
    if (this.options.displayFields) {
        this.options.displayFields.forEach(function (displayField) {
            fieldValues.push(dataItem[displayField]);
        });
    }
    var displayText = dataItem._NoData_;
    if (!displayText)
        displayText = typeof dataItem == "string" ? dataItem : jasonWidgets.common.formatString(this.options.displayFormat, fieldValues);
    dataItem._jw_Searchable_value = fieldValues.join(" ");
    return displayText;
}
/**
 * Initializing customization templates.
 * @ignore
 */
jasonDropDownListButtonUIHelper.prototype.initializeTemplates = function () {
    /*initializing row and column templates*/
    var itemTemplate = (typeof this.options.customization.itemTemplate == "function") ? this.options.customization.itemTemplate() : this.options.customization.itemTemplate;
    var isElement = document.getElementById(itemTemplate);
    if (isElement) {
        itemTemplate = isElement.tagName == "SCRIPT" ? isElement.innerHTML : isElement.outerHTML;
    }
    else {
        itemTemplate = typeof itemTemplate == "string" && itemTemplate.trim().length > 0 ? itemTemplate : null;
    }
    this.options.customization.itemTemplate = itemTemplate;
}
/**
 * Initialize Events
 */
jasonDropDownListButtonUIHelper.prototype.initializeEvents = function () {
    this.eventManager.addEventListener(this.htmlElement, jw.DOM.events.CLICK_EVENT, this.buttonClick, true);
}
/**
 * Renders buttons control's HTML.
 */
jasonDropDownListButtonUIHelper.prototype.buttonClick = function () {
    this.toggleList();
    jasonButtonUIHelper.prototype.buttonClick.call(this);
}
/**
 * Toggle list visibility.
 */
jasonDropDownListButtonUIHelper.prototype.toggleList = function () {
    if (this.dropDownListContainer.style.display == "none")
        this.showList();
    else
        this.hideList();
}
/*
 * Shows the list. 
 */
jasonDropDownListButtonUIHelper.prototype.showList = function () {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    if (this.dropDownListContainer.style.display = "none") {
        //var bRect = this.options.tetheredElement ? this.options.tetheredElement.getBoundingClientRect() : this.htmlElement.getBoundingClientRect();
        var bRect = this.options.tetheredElement ? jw.common.getBoundingClientRect(this.options.tetheredElement) : jw.common.getBoundingClientRect(this.htmlElement);
        document.body.appendChild(this.dropDownListContainer);
        
        var width = this.options.tetheredElement ? this.options.tetheredElement.offsetWidth : this.htmlElement.offsetWidth;
        var height = this.options.tetheredElement ? this.options.tetheredElement.offsetHeight : this.htmlElement.offsetHeight;
        var top = bRect.top + height;
        var left = bRect.left ;



        if (width)
            this.dropDownListContainer.style.width = width + "px";

        this.dropDownListContainer.style.top = top + "px";
        this.dropDownListContainer.style.left = left + "px";
        this.dropDownListContainer.style.zIndex = jw.common.getNextAttributeValue("z-index") + 1;
        this.dropDownListContainer.style.display = "";
        jw.common.getFirstFocusableElement(this.dropDownList);
        this.scrollItemIntoView();
        this.widget.selectedItems.forEach(function (itm, idx) {
            var liElement = this.dropDownList.children[itm._jwRowId];
            if (liElement) {
                if (!liElement.classList.contains(jw.DOM.classes.JW_SELECTED))
                    this.toggleLIElementSelection(liElement);
            }
        }.bind(this));
        //this.htmlElement.classList.add(jw.DOM.classes.JW_SELECTED);
        this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_SHOW);
    }
}
/**
 * Hides the list.
 */
jasonDropDownListButtonUIHelper.prototype.hideList = function () {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    if (this.dropDownListContainer.style.display == "") {
        this.dropDownListContainer.style.display = "none";
        //this.htmlElement.classList.remove(jw.DOM.classes.JW_SELECTED);
        document.body.removeChild(this.dropDownListContainer);
        this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_HIDE);
    }
}
/**
 * Removes the selected class from the selected items.
 */
jasonDropDownListButtonUIHelper.prototype.clearSelection = function (except) {
    var selectedElements = this.dropDownList.getElementsByClassName(jw.DOM.classes.JW_SELECTED);
    for (var i = 0; i <= selectedElements.length - 1; i++) {
        if (selectedElements[i] != except)
            selectedElements[i].classList.remove(jw.DOM.classes.JW_SELECTED);
    }
    this.widget.selectedItemIndex = -1;
    this.widget.selectedItems = [];
}
/**
 * List item click event listener.
 */
jasonDropDownListButtonUIHelper.prototype.onListItemClick = function (event) {
    if (event.button != 0)
        return;
    var setCheckboxValues = event.target.tagName != "INPUT";
    var listElement = event.target.tagName == "LI" ? event.target : jw.common.getParentElement("LI", event.target);
    var currentCheckbox = listElement.getElementsByTagName("input")[0];
    //if multi select is not enabled and check boxes are visible, uncheck all check boxes
    //except the one that it was clicked.
    if (!this.options.multiSelect && this.options.checkboxes) {
        var checkBoxes = this.dropDownList.getElementsByTagName("input");

        for (var i = 0; i <= checkBoxes.length - 1; i++) {
            if (checkBoxes[i] != currentCheckbox)
                checkBoxes[i].checked = false;
        }
    }
    if (!this.options.multiSelect)
        this.clearSelection(listElement);

    if (listElement.classList.contains(jw.DOM.classes.JW_SELECTED))
        this.widget.deSelectItem(parseInt(listElement.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_JW_ITEM_INDEX_ATTR)));
    else
        this.widget.selectItem(parseInt(listElement.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_JW_ITEM_INDEX_ATTR)));
    this.toggleLIElementSelection(listElement,event);

    if (!this.options.multiSelect)
        this.hideList();
}
/**
 * Handles the UI part of an LI element and what it means to be selected and what not.
 */
jasonDropDownListButtonUIHelper.prototype.toggleLIElementSelection = function (listElement,event) {
    var currentCheckbox = listElement.getElementsByTagName("input")[0];
    //if the current target is the checkbox itself then DO NOT set a checked value
    //because this code is executed within the MOUSEDOWN event scope, which is prior to the CLICK event.
    //If a value is set at this point, it will be reverted from the browsers default functionality when
    //the checkbox will process the click event.
    if (event && currentCheckbox == event.target)
        currentCheckbox = null;
    if (listElement.classList.contains(jw.DOM.classes.JW_SELECTED)) {
        listElement.classList.remove(jw.DOM.classes.JW_SELECTED);
        if (currentCheckbox)
            currentCheckbox.checked = false;
    }
    else {
        listElement.classList.add(jw.DOM.classes.JW_SELECTED);
        if (currentCheckbox)
            currentCheckbox.checked = true;
    }
}
/**
 * List item key down event listener.
 */
jasonDropDownListButtonUIHelper.prototype.onListItemKeyDown = function (keyDownEvent) {
    var keyCode = keyDownEvent.which || keyDownEvent.keyCode;
    switch (keyCode) {
        case 9: {//tab key
            this.setFocusToListItem(keyDownEvent.currentTarget, keyDownEvent.shiftKey ? jw.DOM.attributeValues.JW_COMBOBOX_LIST_STATE_UP : jw.DOM.attributeValues.JW_COMBOBOX_LIST_STATE_DOWN);
            //if (keyDownEvent.shiftKey)
            keyDownEvent.preventDefault();
            break;
        }
        case jw.keycodes.enter: {//enter key
            var liItemIndex = parseInt(keyDownEvent.currentTarget.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_JW_ITEM_INDEX_ATTR));
            this.widget.selectItem(liItemIndex);
            this.hideList(true);
            this.htmlElement.focus();
            break;
        }
        case jw.keycodes.escape: {//when ESC is clicked hide the list.
            this.hideList();
            break;
        }
        case jw.keycodes.upArrow: {//KeyUp
            this.setFocusToListItem(keyDownEvent.currentTarget, jw.DOM.attributeValues.JW_COMBOBOX_LIST_STATE_UP);
            keyDownEvent.preventDefault();
            break;
        }
        case jw.keycodes.downArrow: {//KeyDown
            this.setFocusToListItem(keyDownEvent.currentTarget, jw.DOM.attributeValues.JW_COMBOBOX_LIST_STATE_DOWN);
            keyDownEvent.preventDefault();
            break;
        }
    }
    //keyDownEvent.stopPropagation();
}
/**
 * Sets focus to a list item.
 */
jasonDropDownListButtonUIHelper.prototype.setFocusToListItem = function (listItem, direction) {
    var liItemIndex = parseInt(listItem.getAttribute(jasonWidgets.DOM.attributes.JW_ITEM_INDEX_ATTR));
    if (direction == "up") {
        if ((liItemIndex - 1) < 0)
            this.htmlElement.focus();
        else
            this.dropDownList.children[liItemIndex - 1].focus();
    } else {
        if (this.dropDownList.children.length != liItemIndex + 1) {
            this.dropDownList.children[liItemIndex + 1].focus();
        }
    }
}
/**
 * Scroll into view selected item.
 */
jasonDropDownListButtonUIHelper.prototype.scrollSelectedIntoView = function (focus) {
    if (this.dropDownListContainer.style.display == "") {
        if (this.widget.selectedItemIndex >= 0) {
            var listItemElement = jw.common.getElementsByAttribute(this.dropDownList, jasonWidgets.DOM.attributes.JW_DATA_JW_ITEM_INDEX_ATTR, this.widget.selectedItemIndex)[0];
            if (listItemElement != void 0) {
                this.dropDownListContainer.scrollTop = listItemElement.offsetTop;
                if(focus)
                    listItemElement.focus();
            }
        }
    }
}
/**
 * Scroll into view the first item.
 */
jasonDropDownListButtonUIHelper.prototype.scrollFirstItemIntoView = function (focus) {
    if (this.dropDownListContainer.style.display == "" && this.dropDownList.children.length > 0) {
        this.dropDownListContainer.scrollTop = this.dropDownList.children[0].offsetTop;
        if(focus)
            this.dropDownList.children[0].focus();
    }
}
/**
 * Scroll into view selected item.
 */
jasonDropDownListButtonUIHelper.prototype.scrollItemIntoView = function (focus) {
    if (this.widget.selectedItems.length > 0)
        this.scrollSelectedIntoView(focus);
    else
        this.scrollFirstItemIntoView(focus);
}
/**
 * Updates UI when enable/disable state is changed.
 * @abstract
 */
jasonDropDownListButtonUIHelper.prototype.updateEnabled = function (enable) {
    jasonButtonUIHelper.prototype.updateEnabled.call(this, enable);
}
/**
 * Updates UI when visible state is changed.
 * @abstract
 */
jasonDropDownListButtonUIHelper.prototype.updateVisible = function (visible) {
    jasonButtonUIHelper.prototype.updateVisible.call(this, visible);
}
/**
 * Updates UI when read only state is changed.
 * @abstract
 */
jasonDropDownListButtonUIHelper.prototype.updateReadOnly = function (readonly) {
    jasonButtonUIHelper.prototype.updateReadOnly.call(this, readonly);
}