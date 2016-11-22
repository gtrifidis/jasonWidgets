/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonCombobox.prototype = Object.create(jasonButtonTextbox.prototype);
jasonCombobox.prototype.constructor = jasonCombobox;
/**
 * @namespace Dropdowns
 * @description 
 * 
 * Keyboard navigation:
 * 
 * @property DownArrow {Keyboard} - If focus is on the input element, then it drops down the list and sets focus to the first item.If focus is on an item on the list, then it moves to the next item on the list.
 * @property UpArrow {Keyboard} - If focus is on an item on the list, then it moves to the previous item on the list.If focus is on the first item on the list, it moves to the input element.
 * @property Tab {Keyboard} - If focus is on an item on the list, then it moves to the next item on the list.
 * @property Shift+Tab {Keyboard} - If focus is on an item on the list, then it moves to the previous item on the list.
 * @property Enter {Keyboard} - If focus is on an item on the list, then it selects the item and closes the list.
 * 
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
 * @property {boolean}  [dropDownList=false]            - If true, does not allow typing.
 * @property {boolean}  [autoFilter=false]          - If true, automatically filters results while typing.
 * @property {boolean}  [caseSentiveSearch=false]   - If true, search is case sensitive.
 * @property {string}   [displayFormat=""] - String with format parameters. For example "{0},{1}". Each format parameter will be replaced by the field value of fields defined in DisplayFields.
 * @property {string[]} [displayFields=[]]       - Array that lists the field values to be displayed on the input control.
 * @property {boolean} [multiSelect=false] - If true it allows to select/check multiple items from the drop down list. The list will not automatically close if multiSelect is true.
 * @property {boolean} [checkboxes=false] - If true it shows checkboxes next to the list items.
 * @property {string}   [multipleSelectionSeparator = |] - Character to separate values displayed in the combobox when multiSelect is enabled.
 * @property {object}   [customization={}]                   - Combobox customization.
 * @property {any}      [customization.itemTemplate=undefined]       - HTML string or script tag or function containing HTML to be used to render combobox items.
 */

/**
 * @event Dropdowns.jasonCombobox#onSelectItem
 * @description Occurs when an item is selected.
 * @type {object}
 * @property {Dropdowns.jasonComboBox} sender - The combobox instance.
 * @property {object} value - The event data.
 * @property {object} value.selectedItem - The selected item object.
 * @property {number} value.selectedItemIndex - The selected item index.
 */

/**
* @event Dropdowns.jasonCombobox#onUnSelectItem
* @description Occurs when an item is de-selected.
* @type {object}
* @property {Dropdowns.jasonComboBox} sender - The combobox instance.
* @property {object} value - The event data.
* @property {object} value.selectedItem - The unselected item object.
* @property {number} value.selectedItemIndex - The selected item index.
*/

/**
 * @event Dropdowns.jasonCombobox#onHide
 * @description Occurs when the drop down list is hidden.
 * @type {object}
 * @property {Dropdowns.jasonComboBox} sender - The combobox instance.
 */
/**
 * @event Dropdowns.jasonCombobox#onShow
 * @description Occurs when the drop down list is shown.
 * @type {object}
 * @property {Dropdowns.jasonComboBox} sender - The combobox instance.
 */


/**
 * @constructor
 * @memberOf Dropdowns
 * @augments Common.jasonBaseWidget
 * @description Combobox widget. If you want to make it behave like a drop down list, just set the readonly property to true.
 * @param {HTMLElement} htmlElement - DOM element that will contain the combobox.
 * @param {Dropdowns.jasonComboboxOptions} options - Combobox control options.
 * @property {number} selectedItemIndex - Gets or sets the currently selected item index(s).
 * @fires Dropdowns.jasonCombobox#event:onSelectItem
 * @fires Dropdowns.jasonCombobox#event:onUnSelectItem
 * @fires Dropdowns.jasonCombobox#event:onHide
 * @fires Dropdowns.jasonCombobox#event:onShow
 */
function jasonCombobox(htmlElement, options, nameSpace) {
    this.defaultOptions = {
        data: null,
        keyFieldName: undefined,
        displayFields: undefined,
        displayFormat: undefined,
        placeholder: undefined,
        inputMode: "verbatim",
        readonly: false,
        caseSentiveSearch: false,
        autoFilter: false,
        icon: jw.DOM.icons.CHEVRON_DOWN,
        multipleSelectionSeparator:"|",
        customization: {
            itemTemplate: null,
            dataFieldAttribute: "data-field"
        }
    };
    nameSpace = nameSpace === void 0 ? "jasonCombobox" : nameSpace;
    jasonButtonTextbox.call(this, htmlElement, options, nameSpace, jasonComboboxUIHelper);
    this.onDataChange = this.onDataChange.bind(this);
    this.dataSource = new jasonDataSource({ data: this.options.data,onChange:this.onDataChange});
    this.filteredData = [];
    this.search = this.search.bind(this);
    this.options.localization = jasonWidgets.localizationManager.currentLanguage ? jasonWidgets.localizationManager.currentLanguage : this.options.localization;
    this.dataChanged = true;
    //this._initializeTemplates();
    //this.ui.renderUI();
}
/**
 * Selected item index property.
 */
Object.defineProperty(jasonCombobox.prototype, "selectedItemIndex", {
    get: function () {
        var result = [];
        this.ui.dropDownListButton.selectedItems.forEach(function (itm, idx) { result.push(itm._jwRowId); });
        return result;
    },
    set: function (value) {
        var newSelectedIndexes = Array.isArray(value) ? value : [value];
        newSelectedIndexes.forEach(function (newIdx) {
            this.ui.dropDownListButton.selectItem(newIdx);
        }.bind(this));
    },
    enumerable: true,
    configurable: true
});
/**
 * Clears current selection.
 */
jasonCombobox.prototype.clearSelection = function () {
    this.ui.clearSelection();
}
/**
 * Searches in the data using as criteria any value the input control has.
 * @ignore
 */
jasonCombobox.prototype.search = function () {
    /**
     * If there is a selection just dropdown the list and set focus to the 
     * first selected item.
     */
    if (this.ui.dropDownListButton.selectedItems.length > 0) {
        this.showList();
    } else {
        //if there are more than one display field then separate values with a space to search against multiple fields.
        var searchValue = this.options.displayFields.length > 1 ? this.ui.inputControl.value.replace(/[\W_]+/g, " ") : this.ui.inputControl.value;
        this.filteredData = this.dataSource.searchByField(searchValue.split(" "),this.options.displayFields, null, this.options.caseSentiveSearch);
        if (this.filteredData.length == 0) {
            var nodataItem = { _NoData_: jasonWidgets.common.formatString(this.options.localization.combobox.notFound, [this.ui.inputControl.value]) };

            this.filteredData.push(nodataItem);
        }
        this.ui.dropDownListButton.ui.renderListItems(this.filteredData);
        this.ui.inputControl.focus();
    }
}
/**
 * Shows the drop down list.
 */
jasonCombobox.prototype.showList = function () {
    this.ui.showList();
}
/**
 * Hides the drop down list.
 */
jasonCombobox.prototype.hideList = function () {
    this.ui.hideList(true);
}
/**
 * Toggles the drop down list.
 */
jasonCombobox.prototype.toggleDropDownList = function () {
    this.ui.toggleDropdownList();
}
/**
 * Selects an item.
 * @param {number} itemIndex - Item index to select.
 */
jasonCombobox.prototype.selectItem = function (itemIndex) {
    this.ui.dropDownListButton.selectItem(itemIndex);
    //this._selectedItemIndex = itemIndex;
    //this.selectedItem = this.filteredData.length > 0 ? this.filteredData.filter(function (dataItem) { return dataItem._jwRowId == itemIndex; })[0] : this.dataSource.data[itemIndex];
    this.ui.updateInputTextFromSelection();
}
/**
 * @ignore
 */
jasonCombobox.prototype.onDataChange = function () {
    this.ui.dropDownListButton.dataSource.setData(this.dataSource.data);
}
/**
 * If currently selected value has only one item then return just the first value. Otheriwse return the whole array.
 */
jasonCombobox.prototype.readValue = function (value) {
    return Array.isArray(value) && value.length == 1 ? value[0] : value;
}
/**
 * Parses/formats the entered value.
 */
jasonCombobox.prototype.formatValue = function (value) {
    return this.ui.dropDownListButton.ui.createCaptionFromSelection();
}
/**
 * Can be overridden in descendants to return a different value when the "value" property is set, if the underlying "_value" property needs to be of different type.
 */
jasonCombobox.prototype.setValue = function (value) {
    //return !Array.isArray(value) ? [value] : value;
    return value;
}
/**
 * Compares the new value to be set, before actually setting it.
 */
jasonCombobox.prototype.compareValue = function (value) {
   if (this._value == null && value != undefined)
       return jw.enums.comparison.notEqual;

   if (Array.isArray(value) && Array.isArray(this._value)) {
       if (this._value.length == value.length) {
           var result = jw.enums.comparison.equal;
           for(var i=0;i<=this._value.length-1;i++){
               result = jw.common.simpleObjectComparison(this._value[i], value[i]);
               if (result != jw.enums.comparison.equal)
                   break;
           }
           return result;
       } else {
           return this._value.length == value.length ? jw.enums.comparison.equal : jw.enums.comparison.notEqual;
       }
   }
 
    if(typeof value == "object")
        return jw.common.simpleObjectComparison(this._value, value);
    return jw.enums.comparison.notEqual;
}

jasonComboboxUIHelper.prototype = Object.create(jasonButtonTextboxUIHelper.prototype);
jasonComboboxUIHelper.prototype.constructor = jasonComboboxUIHelper;
/**
 * @constructor
 * @ignore
 */
function jasonComboboxUIHelper(widget, htmlElement) {

    
    this.oninputControlClick = this.oninputControlClick.bind(this);
    this.oninputControlChange = this.oninputControlChange.bind(this);
    this.onTextInputBlur = this.onTextInputBlur.bind(this);
    this.onTextInputFocus = this.onTextInputFocus.bind(this);
    this.showList = this.showList.bind(this);
    this.hideList = this.hideList.bind(this);
    this.onComboboxKeyUp = this.onComboboxKeyUp.bind(this);
    this.onComboboxKeyDown = this.onComboboxKeyDown.bind(this);
    this.dropDownListButton = null;
    jasonButtonTextboxUIHelper.call(this, widget, htmlElement);
}
/**
 * Renders combobox HTML.
 */
jasonComboboxUIHelper.prototype.renderUI = function () {
    jasonButtonTextboxUIHelper.prototype.renderUI.call(this);
    if (!this.htmlElement.classList.contains(jw.DOM.classes.JW_COMBOBOX_CLASS)) {
        this.htmlElement.classList.add(jw.DOM.classes.JW_COMBOBOX_CLASS);
        var dropDownButtonOptions = {};
        jw.common.extendObject(this.options, dropDownButtonOptions);
        //any validation rules that the combobox might have, must not be passed to the dropdownlistbutton widget.
        dropDownButtonOptions.validation = [];
        dropDownButtonOptions.events = this.options.events;
        dropDownButtonOptions.tetheredElement = this.htmlElement;
        var handleSelection = function (sender) {
            if (!this.options.multiSelect)
                this.dropDownListButton.hideList();
            this.widget.value = [].concat(this.dropDownListButton.selectedItems);
            setTimeout(function () {
                this.inputControl.focus();
            }.bind(this));
        }
        dropDownButtonOptions.events.push({
            eventName: jw.DOM.events.JW_EVENT_ON_SELECT_ITEM,
            listener: handleSelection.bind(this),
            enabled:true
        });
        dropDownButtonOptions.events.push({
            eventName: jw.DOM.events.JW_EVENT_ON_UNSELECT_ITEM,
            listener: handleSelection.bind(this),
            enabled:true
        });
        this.dropDownListButton = new jasonDropDownListButton(this.button, dropDownButtonOptions);
        this.button.classList.remove(jw.DOM.classes.JW_BORDERED);
        //this.initializeEvents();
        if (this.options.dropDownList)
            this.inputControl.setAttribute(jw.DOM.attributes.READONLY_ATTR, true);
    }
}
/**
 * Shows the dropdown list.
 */
jasonComboboxUIHelper.prototype.showList = function () {
    this.dropDownListButton.ui.showList();
}
/**
 * Hides the drop down list.
 */
jasonComboboxUIHelper.prototype.hideList = function (focus) {
    this.dropDownListButton.ui.hideList();
}
/**
 * Toggles dropdown list.
 */
jasonComboboxUIHelper.prototype.toggleDropdownList = function () {
    this.dropDownListButton.ui.toggleList();
}
/**
 * Initializes event listeners.
 */
jasonComboboxUIHelper.prototype.initializeEvents = function () {
    /*we do not want when user clicks in the input control to hide the list*/
    this.eventManager.addEventListener(this.inputControl, jw.DOM.events.CLICK_EVENT, this.oninputControlClick);

    /*when user starts typing start search in the underlying datasource.*/
    /**
     *  <= IE11 versions have a bug where the input event fires on focus.
     * https://connect.microsoft.com/IE/feedback/details/810538/ie-11-fires-input-event-on-focus
     * Microsoft states that they have fixed on the new MS Edge.
     */
    //this.inputControl.addEventListener(jw.DOM.events.INPUT_EVENT, this.oninputControlChange);

    this.inputControl.addEventListener(jw.DOM.events.KEY_DOWN_EVENT, this.onComboboxKeyDown);
    this.inputControl.addEventListener(jw.DOM.events.KEY_UP_EVENT, this.onComboboxKeyUp);
}
/**
 * Sets the item index (selected item).
 * @param {number} itemIndex - Combobox item index.
 */
jasonComboboxUIHelper.prototype.updateInputTextFromSelection = function () {
    this.widget.value = [].concat(this.dropDownListButton.selectedItems);
}
/**
 * @ignore
 * Formats the combobox's item string value.
 */
jasonComboboxUIHelper.prototype.formatinputControl = function (dataItem) {
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
 * Iterates through the <li> items of the dropdown list, to find an item based on its text 
 */
jasonComboboxUIHelper.prototype.findItem = function (itemText) {
    for (var i = 0; i = this.dropDownListButton.ui.dropDownList.children.length - 1; i++) {
        var childItemText = this.dropDownListButton.ui.dropDownList.children[i].innerText || this.dropDownListButton.ui.dropDownList.children[i].textContent;
        if (childItemText == itemText)
            return this.dropDownListButton.ui.dropDownList.children[i];
    }
    return null;
}
/**
 * Combobox input click event listener.
 */
jasonComboboxUIHelper.prototype.oninputControlClick = function (clickEvent) {
    if(this.widget.readonly || !this.widget.enabled)
        return;
    if (this.options.dropDownList == true) {
        this.toggleDropdownList();
    }
}
/**
 * Combobox input change event listener.
 */
jasonComboboxUIHelper.prototype.oninputControlChange = function (inputChangeEvent) {
    if(this.widget.readonly || !this.widget.enabled)
        return;
    this.clearSelection();
    inputChangeEvent.stopPropagation();
}
/**
 * Clears the currently selected item.
 */
jasonComboboxUIHelper.prototype.clearSelection = function () {
    this.dropDownListButton.ui.clearSelection();
}
/**
 * Formats number when input looses focus.
 */
jasonComboboxUIHelper.prototype.onTextInputBlur = function (event,sender) {
    jasonTextboxUIHelper.prototype.onTextInputBlur.call(this, event, sender);
}
/**
 * 
 */
jasonComboboxUIHelper.prototype.onTextInputFocus = function (event,sender) {
    jasonTextboxUIHelper.prototype.onTextInputFocus.call(this,event,sender);
}
/**
 * Keydown event listener.
 */
jasonComboboxUIHelper.prototype.onComboboxKeyDown = function (keyDownEvent) {
    if(this.widget.readonly || !this.widget.enabled)
        return;
    var keyCode = keyDownEvent.which || keyDownEvent.keyCode;
    switch (keyCode) {
        case 27: {//when ESC is clicked hide the list.
            this.hideList();
            this.inputControl.focus();
            break;
        }
    }
}
/**
 * KeyUp event listener.
 */
jasonComboboxUIHelper.prototype.onComboboxKeyUp = function (keyUpEvent) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var keyCode = keyUpEvent.which || keyUpEvent.keyCode;
    var canShowDropDown = false;
    switch (keyCode) {
        case jw.keycodes.backspace:
        case jw.keycodes.delete: {
            this.widget.clearSelection();
        }
        case jw.keycodes.downArrow:{
            canShowDropDown = true;
        }
    }
    if (this.dropDownListButton.selectedItems.length > 0) {
        var self = this;
        var clearSelection = this.dropDownListButton.selectedItems.filter(function (cmbItem) {
            return cmbItem._jw_Searchable_value == self.inputControl.value;
        }).length == 0;
        if (clearSelection)
            this.widget.clearSelection();
    }
    if (keyCode > 46 || canShowDropDown) {
        this.showList();
        if (this.options.autoFilter) {
            this.widget.search();
        }
        this.inputControl.focus();
        if (keyCode == jw.keycodes.downArrow) {
            this.dropDownListButton.ui.scrollItemIntoView(true);
        }
    }
    keyUpEvent.stopPropagation();
}
/**
 * Updates UI when enable/disable state is changed.
 * @abstract
 */
jasonComboboxUIHelper.prototype.updateEnabled = function (enable) {
    jasonButtonTextboxUIHelper.prototype.updateEnabled.call(this, enable);
    this.dropDownListButton.enabled = enable;
}
/**
 * Updates UI when visible state is changed.
 * @abstract
 */
jasonComboboxUIHelper.prototype.updateVisible = function (visible) {
    jasonButtonTextboxUIHelper.prototype.updateVisible.call(this, visible);
}
/**
 * Updates UI when readonly state is changed.
 * @abstract
 */
jasonComboboxUIHelper.prototype.updateReadOnly = function (readonly) {
    jasonButtonTextboxUIHelper.prototype.updateReadOnly.call(this, readonly);
    this.dropDownListButton.readonly = readonly;
}