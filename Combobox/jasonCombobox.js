/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonCombobox.prototype = Object.create(jasonBaseWidget.prototype);
jasonCombobox.prototype.constructor = jasonCombobox;
/**
 * @namespace Dropdowns
 * @description 
 * 
 * 
 * 
 * Keyboard navigation: (applicable to all drop down widgets).
 * 
 * Down arrow : If focus is on the input element, then it drops down the list and sets focus to the first item.
 *              If focus is on an item on the list, then it moves to the next item on the list.
 * 
 * Up arrow   : If focus is on an item on the list, then it moves to the previous item on the list.
 *              If focus is on the first item on the list, it moves to the input element.
 * 
 * Tab        : If focus is on an item on the list, then it moves to the next item on the list.
 * Shift+Tab  : If focus is on an item on the list, then it moves to the previous item on the list.
 * 
 * Enter      : If focus is on an item on the list, then it selects the item and closes the list.
 */
/**
 * @class
 * @memberOf Dropdowns
 * @name jasonComboboxOptions
 * @description Configuration for the combobox widget.
 * @augments Common.jasonWidgetOptions
 * @property {any[]}    [data=[]]                - Data for the combobox to display.
 * @property {string}   [keyFieldName=""]        - The name of a key field if the data is a list of objects.
 * @property {string}   [placeholder=""]         - Input placehoder string.
 * @property {string}   [inputMode=verbatim]     - InputMode.
 * @property {boolean}  [readOnly=false]            - If true, does not allow typing.
 * @property {boolean}  [autoFilter=false]          - If true, automatically filters results while typing.
 * @property {boolean}  [caseSentiveSearch=false]   - If true, search is case sensitive.
 * @property {string}   [displayFormatString=""] - String with format parameters. For example "{0},{1}". Each format parameter will be replaced by the field value of fields defined in DisplayFields.
 * @property {string[]} [displayFields=[]]       - Array that lists the field values to be displayed on the input control.
 */

/**
 * @event Dropdowns.jasonCombobox#onSelectItem
 * @type {object}
 * @property {Dropdowns.jasonComboBox} sender - The combobox instance.
 * @property {object} value - The event data.
 * @property {object} value.selectedItem - The selected item object.
 * @property {number} value.selectedItemIndex - The selected item index.
 */
/**
 * @event Dropdowns.jasonCombobox#onRollUp
 * @type {object}
 * @property {Dropdowns.jasonComboBox} sender - The combobox instance.
 */
/**
 * @event Dropdowns.jasonCombobox#onRollDown
 * @type {object}
 * @property {Dropdowns.jasonComboBox} sender - The combobox instance.
 */




var
    JW_EVENT_ON_ROLL_DOWN = "onRollDown",
    JW_EVENT_ON_ROLL_UP = "onRollUp",
    JW_EVENT_ON_SELECT_ITEM = "onSelectItem";
/**
 * @constructor
 * @memberOf Dropdowns
 * @augments Common.jasonBaseWidget
 * @description Combobox widget. If you want to make it behave like a drop down list, just set the readOnly property to true.
 * @param {HTMLElement} htmlElement - DOM element that will contain the combobox.
 * @param {Dropdowns.jasonComboboxOptions} options - Combobox control options.
 * @property {object} selectedItem - The currently selected item.
 * @property {number} selectedItemIndex - The currently selected item index.
 * @fires Dropdowns.jasonCombobox#event:onSelectItem
 * @fires Dropdowns.jasonCombobox#event:onRollUp
 * @fires Dropdowns.jasonCombobox#event:onRollDown
 */
function jasonCombobox(htmlElement, options, nameSpace) {
    if (htmlElement.tagName != "DIV")
        throw new Error("Combobox container element must be a div");
    this.defaultOptions = {
        data: null,
        keyFieldName: undefined,
        displayFields: undefined,
        displayFormatString: undefined,
        placeholder: undefined,
        inputMode: "verbatim",
        readOnly: false,
        caseSentiveSearch: false,
        autoFilter:false
    };
    nameSpace = nameSpace === void 0 ? "jasonCombobox" : nameSpace;
    jasonBaseWidget.call(this, nameSpace, htmlElement, options, jasonComboboxUIHelper);
    this.dataSource = new jasonDataSource({ data: this.options.data,onChange:this.onDataSourceChange });
    this._selectedItem = null;
    this._selectedItemIndex = -1;
    this.filteredData = [];
    this.search = this.search.bind(this);
    this.onDataSourceChange = this.onDataSourceChange.bind(this);
    this.options.localization = jasonWidgets.localizationManager.currentLanguage ? jasonWidgets.localizationManager.currentLanguage : this.options.localization;
    this.readOnly = this.options.readOnly;
    this.dataChanged = true;
    this.ui.renderUI();
}

/**
 * Selected item  property.
 */
Object.defineProperty(jasonCombobox.prototype, "selectedItem", {
    get: function () {
        return this._selectedItem;
    },
    set: function (value) {
        this._selectedItem = value;
        this.triggerEvent(JW_EVENT_ON_SELECT_ITEM, { selectedItem: value, selectedItemIndex: this._selectedItemIndex });
    },
    enumerable: true,
    configurable: true
});
/**
 * Selected item index property.
 */
Object.defineProperty(jasonCombobox.prototype, "selectedItemIndex", {
    get: function () {
        return this._selectedItemIndex;
    },
    set: function (value) {
        this._selectedItemIndex = value;
    },
    enumerable: true,
    configurable: true
});
/**
 * @ignore
 */
jasonCombobox.prototype.onDataSourceChange = function () {
    this.dataChanged = true;
}
/**
 * Clears current selection.
 */
jasonCombobox.prototype.clearSelection = function () {
    this.ui.clearSelection();
    this.selectedItem = null;
    this.selectedItemIndex = -1;
}
/**
 * Checks if the combobox has a selection.
 * @returns {boolean}
 */
jasonCombobox.prototype.hasSelection = function () {
    return this.selectedItem != void 0 && this.selectedItemIndex >= 0;
}
/**
 * Selects an item.
 * @param {number} itemIndex - Item index to select.
 */
jasonCombobox.prototype.selectItem = function (itemIndex) {
    this._selectedItemIndex = itemIndex;
    this.selectedItem = this.filteredData.length > 0 ? this.filteredData.filter(function (dataItem) { return dataItem._jwRowId == itemIndex; })[0] : this.dataSource.data[itemIndex];
    this.ui.updateInputTextFromSelection();
}
/**
 * Searches in the data using as criteria any value the input control has.
 * @ignore
 */
jasonCombobox.prototype.search = function () {
    this.filteredData = this.selectedItem ? [this.selectedItem] : this.dataSource.searchByField(this.ui.comboboxInput.value, this.options.displayFields, null, this.options.caseSentiveSearch);
    if (this.filteredData.length == 0) {
        var nodataItem = { _NoData_: jasonWidgets.common.formatString(this.options.localization.combobox.notFound, [this.ui.comboboxInput.value]) };
        
        this.filteredData.push(nodataItem);
    }
    this.ui.renderDropdownListItems(this.filteredData);
}
/**
 * Shows the drop down list.
 */
jasonCombobox.prototype.showDropDownList = function () {
    this.ui.showDropDownList();
}
/**
 * Hides the drop down list.
 */
jasonCombobox.prototype.hideDropDownList = function () {
    this.ui.hideDropDownList(true);
}
/**
 * Toggles the drop down list.
 */
jasonCombobox.prototype.toggleDropDownList = function () {
    this.ui.toggleDropdownList();
}

var
    COMBOBOX_CLASS = "jw-combobox",
    COMBOBOX_DROP_DOWN_LIST_CLASS = "drop-down-list",
    COMBOBOX_DROP_DOWN_LIST_ITEM_CLASS = "drop-down-list-item";
    COMBOBOX_LIST_STATE_ATTR = "jw-drop-down-list-state";
    COMBOBOX_LIST_STATE_UP = "up";
    COMBOBOX_LIST_STATE_DOWN = "down";
    COMBOBOX_LIST_ITEM_SELECTED = "selected";


jasonComboboxUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonComboboxUIHelper.prototype.constructor = jasonComboboxUIHelper;
/**
 * @constructor
 * @ignore
 */
function jasonComboboxUIHelper(widget, htmlElement) {
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);
    this.dropDownListState = COMBOBOX_LIST_STATE_UP;
    this.showDropDownList = this.showDropDownList.bind(this);

    this.onComboboxKeyDown = this.onComboboxKeyDown.bind(this);
    this.onComboboxKeyUp = this.onComboboxKeyUp.bind(this);
    this.onComboboxButtonClick = this.onComboboxButtonClick.bind(this);
    this.onComboboxInputClick = this.onComboboxInputClick.bind(this);
    this.onComboboxItemClick = this.onComboboxItemClick.bind(this);
    this.onComboboxInputChange = this.onComboboxInputChange.bind(this);

    /*if a click occurs outside the input or drop down list, hide the list.*/
    jwDocumentEventManager.addDocumentEventListener(CLICK_EVENT, this.monitorForDocumentClick.bind(this));
    var self = this;
    jwDocumentEventManager.addDocumentEventListener(TOUCH_MOVE_EVENT, function (scrollEvent) {
        self.hideDropDownList();
    });
}
/**
 * Renders combobox HTML.
 */
jasonComboboxUIHelper.prototype.renderUI = function () {
    var self = this;
    if (!this.htmlElement.classList.contains(COMBOBOX_CLASS)) {
        this.htmlElement.classList.add(COMBOBOX_CLASS);

        this.comboboxInput = jw.htmlFactory.createJWTextInput(this.widget.options.inputMode, this.widget.options.placeholder,this.widget.readOnly);
        this.comboboxButton = jw.htmlFactory.createJWButton(null, JW_ICON_CHEVRON_DOWN);

        this.htmlElement.appendChild(this.comboboxInput);
        this.htmlElement.appendChild(this.comboboxButton);
        this.initializeEvents();
    }
}

/**
 * Toggles dropdown list.
 */
jasonComboboxUIHelper.prototype.toggleDropdownList = function () {
    if (this.dropDownListState == COMBOBOX_LIST_STATE_UP) {
        this.comboboxButton.setAttribute(COMBOBOX_LIST_STATE_ATTR, COMBOBOX_LIST_STATE_DOWN);
        this.showDropDownList();
        this.scrollItemIntoView();
    } else {
        this.hideDropDownList(true);
    }
}

/**
 * Scroll into view selected item.
 */
jasonComboboxUIHelper.prototype.scrollSelectedIntoView = function () {
    if (this.dropDownListState == COMBOBOX_LIST_STATE_DOWN) {
        if (this.widget.selectedItemIndex >= 0) {
            var listItemElement = jw.common.getElementsByAttribute(this.dropDownList, DATA_ITEM_INDEX_ATTR, this.widget.selectedItemIndex)[0];
            if (listItemElement != void 0) {
                this.dropDownListContainer.scrollTop = listItemElement.offsetTop;
                listItemElement.focus();
            }
        }
    }
}
/**
 * Scroll into view the first item.
 */
jasonComboboxUIHelper.prototype.scrollFirstItemIntoView = function () {
    if (this.dropDownListState == COMBOBOX_LIST_STATE_DOWN) {
        //this.dropDownList.children[0].classList.add(COMBOBOX_LIST_ITEM_SELECTED);
        this.dropDownListContainer.scrollTop = this.dropDownList.children[0].offsetTop;
        this.dropDownList.children[0].focus();
    }
}
/**
 * Scroll into view selected item.
 */
jasonComboboxUIHelper.prototype.scrollItemIntoView = function () {
    if (this.widget.hasSelection() == true)
        this.scrollSelectedIntoView();
    else
        this.scrollFirstItemIntoView();
}
/**
 * Shows the dropdown list.
 */
jasonComboboxUIHelper.prototype.showDropDownList = function () {
    if (this.dropDownListState != COMBOBOX_LIST_STATE_DOWN) {
        this.renderDropdownListContainer();
        this.dropDownListState = COMBOBOX_LIST_STATE_DOWN;
        this.comboboxButton.setAttribute(COMBOBOX_LIST_STATE_ATTR, this.dropDownListState);
        this.widget.triggerEvent(JW_EVENT_ON_ROLL_DOWN);
    }
}
/**
 * Hides the drop down list.
 */
jasonComboboxUIHelper.prototype.hideDropDownList = function (focus) {
    if (this.dropDownListState != COMBOBOX_LIST_STATE_UP) {
        if (this.dropDownListContainer)
            this.dropDownListContainer.style.display = "none";
        this.dropDownListState = COMBOBOX_LIST_STATE_UP;
        this.comboboxButton.setAttribute(COMBOBOX_LIST_STATE_ATTR, this.dropDownListState);
        if (focus == true && !this.widget.readOnly)
            this.comboboxInput.focus();
        this.widget.triggerEvent(JW_EVENT_ON_ROLL_UP);
    }
}

/**
 * Initializes event listeners.
 */
jasonComboboxUIHelper.prototype.initializeEvents = function () {
    var self = this;
    /*toggling visibility of the list*/
    this.eventManager.addEventListener(this.comboboxButton, CLICK_EVENT, this.onComboboxButtonClick, true);
    this.eventManager.addEventListener(this.comboboxButton, KEY_DOWN_EVENT, this.onComboboxKeyDown, true);

    /*we do not want when user clicks in the input control to hide the list*/
    this.eventManager.addEventListener(this.comboboxInput, CLICK_EVENT, this.onComboboxInputClick);

    /*when user starts typing start search in the underlying datasource.*/
    /**
     *  <= IE11 versions have a bug where the input event fires on focus.
     * https://connect.microsoft.com/IE/feedback/details/810538/ie-11-fires-input-event-on-focus
     * Microsoft states that they have fixed on the new MS Edge.
     */
    //this.comboboxInput.addEventListener(INPUT_EVENT, this.onComboboxInputChange);

    this.comboboxInput.addEventListener(KEY_DOWN_EVENT, this.onComboboxKeyDown);
    this.comboboxInput.addEventListener(KEY_UP_EVENT, this.onComboboxKeyUp);
}
/**
 * Sets the item index (selected item).
 * @param {number} itemIndex - Combobox item index.
 */
jasonComboboxUIHelper.prototype.updateInputTextFromSelection = function () {
    var self = this;
    var inputValue = "";
    if (this.widget.options.displayFields) {
        var fieldValues = [];
        this.widget.options.displayFields.forEach(function (displayField) {
            fieldValues.push(self.widget.selectedItem[displayField]);
        });
        inputValue = jasonWidgets.common.formatString(this.widget.options.displayFormatString, fieldValues);
    }
    this.comboboxInput.value = inputValue;
}

/**
 * Renders dropdown list HTML.
 */
jasonComboboxUIHelper.prototype.renderDropdownListContainer = function () {
    var self = this;
    if (this.widget.options.data) {
        if (!this.dropDownListContainer) {
            this.dropDownListContainer = this.createElement("div");
            this.dropDownList = this.createElement("ul");
            this.dropDownListContainer.appendChild(this.dropDownList);
            this.dropDownListContainer.classList.add(COMBOBOX_DROP_DOWN_LIST_CLASS);
            this.dropDownListContainer.classList.add(COMBOBOX_CLASS);
            this.dropDownListContainer.style.display = "none";
            document.body.appendChild(this.dropDownListContainer);
        }
        if (this.widget.dataChanged)
            this.renderDropdownListItems();
        this.dropDownListContainer.style.position = "absolute";
        var bRect = this.htmlElement.getBoundingClientRect();//jw.common.getOffsetCoordinates(this.htmlElement);
        this.hasScrollBars = this.dropDownList.scrollHeight > this.dropDownListContainer.clientHeight;
        if (!this.scrollBarWidth)
            this.scrollBarWidth = jasonWidgets.common.scrollBarWidth();

        this.dropDownListContainer.style.width = ((this.comboboxInput.offsetWidth + this.comboboxButton.offsetWidth)) + "px";
        this.dropDownListContainer.style.top = bRect.top + this.htmlElement.offsetHeight + "px";
        this.dropDownListContainer.style.left = bRect.left + "px";
        this.dropDownListContainer.style.zIndex = jw.common.getNextAttributeValue("z-index") + 1;
        this.dropDownListContainer.style.display = "";
    }
}

/**
 * Renders dropdown list contents HTML.
 */
jasonComboboxUIHelper.prototype.renderDropdownListItems = function (data) {
    var self = this;
    var dataToRender = data ? data : this.widget.dataSource.data;
    jw.common.removeChildren(this.dropDownList);
    //this.dropDownList.innerHTML = "";
    var nextTabIndex = jasonWidgets.common.getNextTabIndex();
    for (var i = 0; i <= dataToRender.length - 1; i++) {
        var listItem = this.createElement("li");
        var dataItem = dataToRender[i];
        var fieldValues = [];
        if (this.widget.options.displayFields) {
            this.widget.options.displayFields.forEach(function (displayField) {
                fieldValues.push(dataToRender[i][displayField]);
            });
        }
        var displayText = dataItem._NoData_;
        if (!displayText)
            displayText = typeof dataItem == "string" ? dataItem : jasonWidgets.common.formatString(this.widget.options.displayFormatString, fieldValues);
        dataItem._jw_Searchable_value = fieldValues.join(" ");
        //var listItemText = this.createElement("span");
        //listItemText.appendChild(this.createTextNode(displayText))
        listItem.appendChild(this.createTextNode(displayText));
        listItem.className = COMBOBOX_DROP_DOWN_LIST_ITEM_CLASS;
        listItem.setAttribute(DATA_ITEM_INDEX_ATTR, dataItem._jwRowId);
        listItem.setAttribute(ITEM_INDEX_ATTR, i);
        listItem.setAttribute(TABINDEX_ATTR, nextTabIndex);
        jasonWidgets.common.setData(listItem, "jComboboxDataItem", dataItem);
        this.eventManager.addEventListener(listItem, CLICK_EVENT, this.onComboboxItemClick);
        this.eventManager.addEventListener(listItem, KEY_DOWN_EVENT, this.onComboboxKeyDown);
        //listItem.addEventListener(CLICK_EVENT, this.eventsHelper.cmbListItemClick); EVNT
        //listItem.addEventListener(KEY_DOWN_EVENT, this.eventsHelper.cmbListItemKeyDown);
        nextTabIndex++;
        this.dropDownList.appendChild(listItem);
    }
    this.widget.dataChanged = false;
}

/**
 * Iterates through the <li> items of the dropdown list, to find an item based on its text 
 */
jasonComboboxUIHelper.prototype.findItem = function (itemText) {
    for (var i = 0; i = this.dropDownList.children.length - 1; i++) {
        var childItemText = this.dropDownList.children[i].innerText || this.dropDownList.children[i].textContent;
        if (childItemText == itemText)
            return this.dropDownList.children[i];
    }
    return null;
}

/**
 * Monitors for mouse down events on the document level, in order to hide the dropdown list.
 */
jasonComboboxUIHelper.prototype.monitorForDocumentClick = function (mouseDownEvent) {
    if (this.dropDownList && this.dropDownListState == "down") {
        if (jw.common.contains(this.htmlElement, mouseDownEvent.target))
            return;
        if (jw.common.isMouseEventOutOfContainer(this.dropDownListContainer, mouseDownEvent))
            this.hideDropDownList();
    }
}
/**
 * Combobox button click event listener.
 */
jasonComboboxUIHelper.prototype.onComboboxButtonClick = function (clickEvent) {
    this.dropDownListState = this.comboboxButton.getAttribute(COMBOBOX_LIST_STATE_ATTR);
    this.dropDownListState = this.dropDownListState ? this.dropDownListState : COMBOBOX_LIST_STATE_UP;
    this.toggleDropdownList();
}
/**
 * Combobox input click event listener.
 */
jasonComboboxUIHelper.prototype.onComboboxInputClick = function (clickEvent) {
    if (this.widget.readOnly == true) {
        this.toggleDropdownList();
    }
}
/**
 * Combobox list item click event listener.
 */
jasonComboboxUIHelper.prototype.onComboboxItemClick = function (clickEvent) {
    this.comboboxInput.value = clickEvent.target.textContent || clickEvent.target.innerText;
    this.clearSelection();
    this.widget._selectedItemIndex = parseInt(clickEvent.target.getAttribute(DATA_ITEM_INDEX_ATTR));
    this.widget.selectedItem = jasonWidgets.common.getData(clickEvent.target, "jComboboxDataItem");
    this.hideDropDownList(true);
    //clickEvent.stopPropagation();
}
/**
 * Keydown event listener.
 */
jasonComboboxUIHelper.prototype.onComboboxKeyDown = function (keyDownEvent) {
    var keyCode = keyDownEvent.which || keyDownEvent.keyCode;
    switch (keyCode) {
        case 9: {//tab key
            if (keyDownEvent.target.tagName == "LI") {
                this.setFocusToListItem(keyDownEvent.target, keyDownEvent.shiftKey ? COMBOBOX_LIST_STATE_UP : COMBOBOX_LIST_STATE_DOWN);
                if (keyDownEvent.shiftKey)
                    keyDownEvent.preventDefault();
            }
            else
                this.hideDropDownList();
            break;
        }
        case 13: {//enter key
            if (keyDownEvent.target.tagName == "LI") {
                var liItemIndex = parseInt(keyDownEvent.target.getAttribute(DATA_ITEM_INDEX_ATTR));
                this.widget.selectItem(liItemIndex);
                this.hideDropDownList(true);
                this.comboboxInput.focus();
            } else {

            }
            break;
        }
        case 27: {//when ESC is clicked hide the list.
            this.hideDropDownList();
            break;
        }
        case 38: {//Keyup
            if (keyDownEvent.target.tagName == "LI") {
                this.setFocusToListItem(keyDownEvent.target, COMBOBOX_LIST_STATE_UP);
            }
            keyDownEvent.preventDefault();
            break;
        }
        case 40: {//KeyDown
            if (keyDownEvent.target.tagName == "LI") {
                this.setFocusToListItem(keyDownEvent.target, COMBOBOX_LIST_STATE_DOWN);
            } else {
                this.showDropDownList();
                this.scrollItemIntoView();
            }
            keyDownEvent.preventDefault();
            break;
        }
    }
    keyDownEvent.stopPropagation();
}
/**
 * KeyUp event listener.
 */
jasonComboboxUIHelper.prototype.onComboboxKeyUp = function (keyUpEvent) {
    var keyCode = keyUpEvent.which || keyUpEvent.keyCode;
    var canShowDropDown = false;
    switch (keyCode) {
        case 8:
        case 46: {
            canShowDropDown = true;
        }
    }
    if (keyCode > 46 || canShowDropDown) {
        this.widget.clearSelection();
        this.showDropDownList();
        if (this.options.autoFilter) {
            this.widget.search();
        }

    }
    keyUpEvent.stopPropagation();
}
/**
 * Combobox input change event listener.
 */
jasonComboboxUIHelper.prototype.onComboboxInputChange = function (inputChangeEvent) {
    this.widget.clearSelection();
    inputChangeEvent.stopPropagation();
}
/**
 * Sets focus to a list item.
 */
jasonComboboxUIHelper.prototype.setFocusToListItem = function (listItem,direction) {
    var liItemIndex = parseInt(listItem.getAttribute(ITEM_INDEX_ATTR));
    if (direction == "up") {
        if ((liItemIndex - 1) <= 0)
            this.comboboxInput.focus();
        else
            this.dropDownList.children[liItemIndex - 1].focus();
    } else {
        if (this.dropDownList.children.length != liItemIndex + 1) {
            this.dropDownList.children[liItemIndex + 1].focus();
        }
    }
}


/**
 * Clears the currently selected item.
 */
jasonComboboxUIHelper.prototype.clearSelection = function () {
    var listItemElement = jw.common.getElementsByAttribute(this.dropDownList, DATA_ITEM_INDEX_ATTR, this.widget.selectedItemIndex)[0];
    if (listItemElement != void 0) {
        listItemElement.classList.remove(COMBOBOX_LIST_ITEM_SELECTED);
    }
}