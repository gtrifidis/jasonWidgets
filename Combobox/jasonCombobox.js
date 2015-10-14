/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonCombobox.prototype = Object.create(jasonBaseWidget.prototype);
jasonCombobox.prototype.constructor = jasonCombobox;
/**
 * @name jasonComboboxOptions
 * @property {array}    Data                - Data for the grid to display.
 * @property {string}   KeyFieldName        - The name of a key field ,if the data is a list of objects.
 * @property {string}   Placeholder         - Input placehoder string.
 * @property {string}   InputMode           - InputMode default - verbatim.
 * @property {boolean}  ReadOnly            - If true does not allow typing. Default false.
 * @property {boolean}  CaseSentiveSearch   - If true search is case sensitive. Default false.
 * @property {string}   DisplayFormatString - String with format parameters.For example "{0},{1}". Each format parameter will be replaced by the field value of fields defined in DisplayFields.
 * @property {array}    DisplayFields       - Array that lists the field values to be displayed on the input control.
 * @property {function} OnItemSelected      - Triggered when an item is selected. The selected item is passed in the callback.
 */
/**
 * Keyboard navigation:
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
 * jasonComboboxWidget
 * @param {object} htmlElement - HTMLElement.
 * @param {object} options - Combobox control options. {@link jasonComboboxOptions} 
 */
function jasonCombobox(htmlElement, options) {
    if (htmlElement.tagName != "DIV")
        throw new Error("Combobox container element must be a div");
    jasonBaseWidget.call(this, "jasonCombobox", htmlElement, new jasonComboboxWidgetUIHelper(this, htmlElement));
    if (!options) options = {};
    jasonWidgets.common.extendObject({
        Data: null,
        KeyFieldName: undefined,
        DisplayFields: undefined,
        DisplayFormatString : undefined,
        Placeholder: undefined,
        InputMode: "verbatim",
        ReadOnly: false,
        CaseSentiveSearch:false
    }, this.defaultOptions);

    this.initialize(options);
    this.DataSource = new jasonDataSource(this.options.Data);
    this.SelectedItem = null;
    this.SelectedItemIndex = -1;
    this.FilteredData = [];
    this.search = this.search.bind(this);
    this.options.Localization = jasonWidgets.localizationManager.CurrentLanguage ? jasonWidgets.localizationManager.CurrentLanguage : this.options.Localization;
    this.ui.renderUI();
 }



/**
 * Clears selection.
 */
jasonCombobox.prototype.clearSelection = function () {
    this.SelectedItem = null;
    this.SelectedItemIndex = -1;
}



/**
 * Searches in the data using as criteria any value the input control has.
 */
jasonCombobox.prototype.search = function () {
    this.FilteredData = this.SelectedItem ? [this.SelectedItem] : this.DataSource.Search(this.comboboxInput.value, null, this.options.CaseSentiveSearch);
    if (this.FilteredData.length == 0) {
        var nodataItem = { _NoData_: jasonWidgets.common.formatString(this.options.Localization.Combobox.NotFound, [this.comboboxInput.value]) };
        
        this.FilteredData.push(nodataItem);
    }
    this.ui.renderDropdownListItems(this.FilteredData);
}

function jasonComboboxEventsHelper(jasonCombo) {
    var self = this;
    this.jasonCombo = jasonCombo;

    /*if a click occurs outside the input or drop down list, hide the list.*/
    document.addEventListener("click", function (mouseDownEvent) {
        self.jasonCombo.ui.hideDropDownList();
        mouseDownEvent.stopPropagation();
        //mouseDownEvent.preventDefault();
    });

   this.cmbButtonClick =  function (clickEvent) {
       self.jasonCombo.ui.dropDownListState = self.jasonCombo.ui.comboboxButton.getAttribute("data-drop-down-list-state");
       self.jasonCombo.ui.dropDownListState = self.jasonCombo.ui.dropDownListState ? self.jasonCombo.ui.dropDownListState : "up";
       self.jasonCombo.ui.toggleDropdownList();
        if (self.jasonCombo.SelectedItem) {
            self.jasonCombo.search();
            self.jasonCombo.ui.dropDownList.children[0].focus();
        }
        clickEvent.stopPropagation();
   }
   this.cmbInputChange = function (inputEvent) {
       self.jasonCombo.ui.showDropDownList();
        self.jasonCombo.clearSelection();
        self.jasonCombo.ui.search();
        inputEvent.stopPropagation();
    }
   this.cmbInputKeyDown =  function (keyDownEvent) {
        var keyCode = keyDownEvent.which || keyDownEvent.keyCode;
        switch (keyCode) {
            case 27: {//when ESC is clicked hide the list.
                self.jasonCombo.ui.hideDropDownList();
                break;
            }
            case 9: {
                self.jasonCombo.ui.hideDropDownList();
                break;
            }
            case 40: {
                self.jasonCombo.ui.showDropDownList();
                if (self.jasonCombo.SelectedItem) {
                    self.jasonCombo.search();
                    setTimeout(function () {
                        self.jasonCombo.ui.comboboxInput.focus();
                    });
                }
                self.jasonCombo.ui.dropDownList.children[0].focus();
                setTimeout(function () {
                    self.jasonCombo.ui.dropDownList.scrollIntoView();
                });
                keyDownEvent.preventDefault();
                break;
            }
        }
        keyDownEvent.stopPropagation();

    }
   this.cmbInputClick = function (clickEvent) {
        if (self.jasonCombo.options.ReadOnly == true) {
            self.jasonCombo.ui.toggleDropdownList();
        }

        clickEvent.stopPropagation();
    }
   this.cmbListItemClick = function (clickEvent) {
        self.jasonCombo.ui.comboboxInput.value = clickEvent.target.textContent || clickEvent.target.innerText;
        self.jasonCombo.SelectedItem = jasonWidgets.common.getData(clickEvent.target, "jComboboxDataItem");
        self.jasonCombo.SelectedItemIndex = parseInt(clickEvent.target.getAttribute("data-item-index"));
        if (self.jasonCombo.options.OnItemSelected) {
            self.jasonCombo.options.OnItemSelected(self.jasonCombo.SelectedItem);
        }
        self.jasonCombo.hideDropDownList(true);
   }
   this.setFocusToListItem = function (listItem, direction) {
       var liItemIndex = parseInt(listItem.getAttribute("item-index"));
       if (direction == "up") {
           if ((liItemIndex - 1) <= 0)
               self.jasonCombo.ui.comboboxInput.focus();
           else
               self.jasonCombo.ui.dropDownList.children[liItemIndex - 1].focus();
       } else {
           if (self.jasonCombo.ui.dropDownList.children.length != liItemIndex + 1) {
               self.jasonCombo.ui.dropDownList.children[liItemIndex + 1].focus();
           }
       }
   }
   this.cmbListItemKeyDown = function (keyDownEvent) {
        var keyCode = keyDownEvent.which || keyDownEvent.keyCode;
        switch (keyCode) {
            case 13: {
                var liItemIndex = parseInt(keyDownEvent.target.getAttribute("data-item-index"));
                self.jasonCombo.ui.selectItem(liItemIndex);
                self.jasonCombo.ui.hideDropDownList(true);
                break;
            }
            case 27: {//when ESC is clicked hide the list.
                self.jasonCombo.ui.hideDropDownList(true);
                break;
            }
            case 9: {
                self.setFocusToListItem(keyDownEvent.target, keyDownEvent.shiftKey ? "up" : "down");
                if (keyDownEvent.shiftKey)
                    keyDownEvent.preventDefault();
                break;
            }
            case 38: {
                self.setFocusToListItem(keyDownEvent.target, "up");
                keyDownEvent.preventDefault();
                break;
            }
            case 40: {
                self.setFocusToListItem(keyDownEvent.target, "down");
                keyDownEvent.preventDefault();
                break;
            }
        }
        keyDownEvent.stopPropagation();
    }
}


jasonComboboxWidgetUIHelper.prototype = Object.create(jasonWidgetUIHelper.prototype);
jasonComboboxWidgetUIHelper.prototype.constructor = jasonComboboxWidgetUIHelper;

function jasonComboboxWidgetUIHelper(widget, htmlElement) {
    jasonWidgetUIHelper.call(this, widget, htmlElement);
    this.COMBOBOX_CLASS = "jw-combobox";
    this.COMBOBOX_DROP_DOWN_LIST_CLASS = "drop-down-list";
    this.COMBOBOX_DROP_DOWN_LIST_ITEM_CLASS = "drop-down-list-item";
    this.dropDownListState = "up";
    this.eventsHelper = new jasonComboboxEventsHelper(widget);
}
/**
 * Renders combobox HTML.
 */
jasonComboboxWidgetUIHelper.prototype.renderUI = function () {
    var self = this;
    this.htmlElement.classList.add(this.COMBOBOX_CLASS);


    this.comboboxInput = this.createElement("input");
    this.comboboxInput.setAttribute("tabindex", jasonWidgets.common.getNextTabIndex());
    this.comboboxButton = this.createElement("a");
    this.comboboxButtonIcon = this.createElement("i");
    this.comboboxButtonIcon.className = "jw-icon caret-bottom";

    this.comboboxInput.setAttribute("type", "text");
    this.comboboxInput.setAttribute("inputmode", this.widget.options.InputMode);
    if (this.widget.options.Placeholder)
        this.comboboxInput.setAttribute("placeholder", this.widget.options.Placeholder);
    if (this.widget.options.ReadOnly == true)
        this.comboboxInput.setAttribute("readonly", this.widget.options.ReadOnly);
    this.comboboxButton.appendChild(this.comboboxButtonIcon);
    this.htmlElement.appendChild(this.comboboxInput);
    this.htmlElement.appendChild(this.comboboxButton);
    this.initializeEvents();
}

/**
 * Toggles dropdown list.
 */
jasonComboboxWidgetUIHelper.prototype.toggleDropdownList = function () {
    if (this.dropDownListState == "up") {
        this.comboboxButton.setAttribute("data-drop-down-list-state", "down");
        this.showDropDownList();
    } else {
        this.hideDropDownList(true);
    }
}

/**
 * Shows the dropdown list.
 */
jasonComboboxWidgetUIHelper.prototype.showDropDownList = function () {
    if (this.dropDownListState != "down") {
        this.renderDropdownListContainer();
        this.dropDownListContainer.style.display = "";
        this.dropDownListState = "down";
        this.comboboxButton.setAttribute("data-drop-down-list-state", this.dropDownListState);
    }
}
/**
 * Hides the drop down list.
 */
jasonComboboxWidgetUIHelper.prototype.hideDropDownList = function (focus) {
    if (this.dropDownListState != "up") {
        if (this.dropDownListContainer)
            this.dropDownListContainer.style.display = "none";
        this.dropDownListState = "up";
        this.comboboxButton.setAttribute("data-drop-down-list-state", this.dropDownListState);
        if (focus == true)
            this.comboboxInput.focus();
    }
}

/**
 * Initializes event listeners.
 */
jasonComboboxWidgetUIHelper.prototype.initializeEvents = function () {
    var self = this;
    /*toggling visibility of the list*/
    this.comboboxButton.addEventListener("click", this.eventsHelper.cmbButtonClick);

    /*we do not want when user clicks in the input control to hide the list*/
    this.comboboxInput.addEventListener("click", this.eventsHelper.cmbInputClick);

    /*when user starts typing start search in the underlying datasource.*/
    this.comboboxInput.addEventListener("input", this.eventsHelper.cmbInputChange);

    this.comboboxInput.addEventListener("keydown", this.eventsHelper.cmbInputKeyDown);
}
/**
 * Sets the item index (selected item).
 * @param {number} itemIndex - Combobox item index.
 */
jasonComboboxWidgetUIHelper.prototype.selectItem = function (itemIndex) {
    var self = this;
    this.widget.SelectedItem = this.widget.FilteredData.length > 0 ? this.widget.FilteredData.filter(function (dataItem) { return dataItem._jwRowId == itemIndex; })[0] : this.widget.options.Data[itemIndex];
    this.widget.SelectedItemIndex = this.widget.SelectedItem._jwRowId;
    var inputValue = "";
    if (this.widget.options.DisplayFields) {
        var fieldValues = [];
        this.widget.options.DisplayFields.forEach(function (displayField) {
            fieldValues.push(self.widget.SelectedItem[displayField]);
        });
        inputValue = jasonWidgets.common.formatString(this.widget.options.DisplayFormatString, fieldValues);
    }
    this.comboboxInput.value = inputValue;
}

/**
 * Renders dropdown list HTML.
 */
jasonComboboxWidgetUIHelper.prototype.renderDropdownListContainer = function () {
    var self = this;
    if (this.widget.options.Data) {
        if (!this.dropDownListContainer) {
            this.dropDownListContainer = this.createElement("div");
            this.dropDownList = this.createElement("ul");
            this.dropDownListContainer.appendChild(this.dropDownList);
            this.dropDownListContainer.classList.add(this.COMBOBOX_DROP_DOWN_LIST_CLASS);
            this.comboboxInput.parentElement.appendChild(this.dropDownListContainer);
        }
        this.renderDropdownListItems();

        this.dropDownListContainer.style.position = "absolute";
        this.dropDownListContainer.style.width = (this.comboboxInput.offsetWidth - 1) + "px";
        this.dropDownListContainer.style.top = this.comboboxInput.offsetTop + this.comboboxInput.offsetHeight + "px";
    }
}

/**
 * Renders dropdown list contents HTML.
 */
jasonComboboxWidgetUIHelper.prototype.renderDropdownListItems = function (data) {
    var self = this;
    var dataToRender = data ? data : this.widget.DataSource.Data;
    this.dropDownList.innerHTML = "";
    var nextTabIndex = jasonWidgets.common.getNextTabIndex();
    for (var i = 0; i <= dataToRender.length - 1; i++) {
        var listItem = this.createElement("li");
        var dataItem = dataToRender[i];
        var fieldValues = [];
        this.widget.options.DisplayFields.forEach(function (displayField) {
            fieldValues.push(dataToRender[i][displayField]);
        });
        var displayText = dataItem._NoData_
        if (!displayText)
            displayText = typeof dataItem == "string" ? dataItem : jasonWidgets.common.formatString(this.widget.options.DisplayFormatString, fieldValues);
        listItem.appendChild(this.createTextNode(displayText));
        listItem.className = this.COMBOBOX_DROP_DOWN_LIST_ITEM_CLASS;
        listItem.setAttribute("data-item-index", dataItem._jwRowId);
        listItem.setAttribute("item-index", i);
        listItem.setAttribute("tabindex", nextTabIndex);
        jasonWidgets.common.setData(listItem, "jComboboxDataItem", dataItem);
        listItem.addEventListener("click", this.eventsHelper.cmbListItemClick);
        listItem.addEventListener("keydown", this.eventsHelper.cmbListItemKeyDown);
        nextTabIndex++;
        this.dropDownList.appendChild(listItem);
    }
}

/**
 * Iterates through the <li> items of the dropdown list, to find an item based on its text 
 */
jasonComboboxWidgetUIHelper.prototype.findItem = function (itemText) {
    for (var i = 0; i = this.dropDownList.children.length - 1; i++) {
        var childItemText = this.dropDownList.children[i].innerText || this.dropDownList.children[i].textContent;
        if (childItemText == itemText)
            return this.dropDownList.children[i];
    }
    return null;
}