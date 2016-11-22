/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonGrid.prototype = Object.create(jasonBaseWidget.prototype);
jasonGrid.prototype.constructor = jasonGrid;
/**
 * @namespace Grids
 * @description
 * 
 * Collection of data grids.
 * 
 * Keyboard navigation:
 * 
 * @property Column {GridColumn} - Grid column keyboard support.
 * @property Column.Enter/Space {Keyboard} - If the grid has sorting enabled it will toggle sorting asc/desc for the column.
 * @property Column.DownArrow {Keyboard} - It will move focus to the first cell of the grid.
 * @property GridCell {GridCell} - Grid cell keyboard support.
 * @property GridCell.DownArrow {Keyboard} - Moves to the cell below the focused cell.
 * @property GridCell.UpArrow {Keyboard} - Moves to the cell above the focused cell. If the cell is in the first row, it will move focus to the column header above. If the cell is in the first row of a grouping, it will move focus to the group collapse/expand row button.
 * @property GridCell.RightArrow {Keyboard} - Moves to the cell to the right of the focused cell.
 * @property GridCell.LeftArrow {Keyboard} - Moves to the cell to the left of the focused cell.
 * @property GridCell.Tab {Keyboard} - Moves focus to the pager controls, if the grid has paging enabled.
 * @property GridCell.Ctrl+Space {Keyboard} - Toggles cell selection.
 * @property GridCell.Ctrl+Enter {Keyboard} - Toggles row selection.
 * @property ColumnMenu {GridColumnMenu} - Grid column menu keyboard support.
 * @property ColumnMenu.Enter {Keyboard} - It displays the grid column menu.
 * @property GroupRowButton {GroupRowButton} - Group row collapse/expand button keyboard support.
 * @property GroupRowButton.DownArrow {Keyboard} - If the group is collapsed it expands it and sets the focus to the first cell of the first row of the group.
 * @property GroupRowButton.Tab {Keyboard} - Sets focus to the next group row button.
 * @property GroupRowButton.Enter {Keyboard} - Toggles collapse state of the group.
 * 
 */

/**
 * @class
 * @name jasonGridOptions
 * @augments Common.jasonWidgetOptions
 * @description Configuration for the grid widget.
 * @memberOf Grids
 * @property {boolean}  [multiSelect=false]                     - Set to true to enable multi-select.
 * @property {any[]}    [data=[]]                            - Data for the grid to display.
 * @property {jasonGridColumn[]} [columns=[]]                - Grid columns.
 * @property {object}   paging                          - Paging configuration.  
 * @property {number}   [paging.PageSize=200]                 - Pagesize.
 * @property {boolean}  [grouping=true]                        - Set to true to enable grouping.
 * @property {boolean}  [filtering=true]                       - Set to true to enable filtering.
 * @property {object|boolean}   [sorting=true]                         - Set to true to enable sorting.
 * @property {object}   [sorting.multiple=false]                - Multiple - Set to true to enable multiple sorting 
 * @property {boolean}  [columnMenu=true]                      - Set to true to enable column menu.
 * @property {boolean}  [resizing=true]                        - Set to true to enable column resizing.
 * @property {boolean}  [reordering=true]                      - Set to true to enable column reordering.
 * @property {object}   [customization={}]                   - Grid customization.
 * @property {any}      [customization.rowTemplate=undefined]       - HTML string or script tag containing HTML to be used to render grid rows.
 * @property {string}   [customization.dataFieldAttribute=undefined]- String that defines the attribute in a template HTML for a data field. Default is 'data-field'.
 */

/**
 * @class
 * @name jasonGridColumn
 * @description A grid column.
 * @memberOf Grids
 * @property {string} caption       - Column caption.
 * @property {string} fieldName     - FieldName of the underlying datasource.
 * @property {number} index         - Column index on the column list.
 * @property {string} tooltip       - Column tooltip.
 * @property {number} width         - If not specified, a width value will be calculated for the column. Use it only when you want a specific width for a column.
 * @property {boolean} visible      - If false, column is not rendered.
 * @property {Common.enums.dataType}  dataType     - Can be one of four data types. String, Date, Number and Boolean.
 * @property {boolean} isInMenu     - If false, column is not displayed on the list of columns to be hidden/shown.
 * @property {boolean} columnMenu   - If false, column does not show a column menu icon.
 * @property {any} headerTemplate   - HTML string or script tag containing HTML to be used to render a column header.
 * @property {any} cellTemplate     - HTML string or script tag containing HTML to be used to render a column cell.
 */

/**
 * @class
 * @name jasonGridFilterValue
 * @description A grid filter value.
 * @memberOf Grids
 * @property {any} value - Filter value.
 * @property {object} filterClause - Filter clause.
 * @property {string} filterClause.symbol - Filter clause symbol ['=','>','<','>=','<=','!=','startsWith','endsWith','contains']
 * @property {object} logicalOperator - Filter logical operator.
 * @property {string} logicalOperator.operator - operator ['and','or']
 */

/**
 * Occurs when the underlying datasource data changes.
 * @event Grids.jasonGrid#onDataChange
 * @type {object}
 * @property {Grids.jasonGrid} sender - The grid instance.
 */

/**
 * @event Grids.jasonGrid#onGroupByField
 * @type {object}
 * @description Occurs when grouping is applied to a field.
 * @property {Grids.jasonGrid} sender - The grid instance.
 * @property {string} fieldName - The field that the grouping was applied to.
 */

/**
 * @event Grids.jasonGrid#onUnGroupField
 * @type {object}
 * @description Occurs when grouping is removed from a field.
 * @property {Grids.jasonGrid} sender - The grid instance.
 * @property {string} fieldName - The field of which the grouping was removed.
 */

/**
 * @event Grids.jasonGrid#onSelectionChange
 * @type {object}
 * @description Occurs when the selected rows are changed.
 * @property {Grids.jasonGrid} sender - The grid instance.
 * @property {object[]} selectedRows - The currently selected rows.
 */

/**
 * @event Grids.jasonGrid#onGroupCollapse
 * @type {object}
 * @description Occurs when grouping collapses.
 * @property {Grids.jasonGrid} sender - The grid instance.
 * @property {string} groupKey - The grouping key of the group being collapsed.
 */

/**
 * @event Grids.jasonGrid#onGroupExpand
 * @type {object}
 * @description Occurs when grouping expands.
 * @property {Grids.jasonGrid} sender - The grid instance.
 * @property {string} groupKey - The grouping key of the group being exapanded.
 */

/**
 * @event Grids.jasonGrid#onPageChange
 * @type {object}
 * @description Occurs when the page changes.
 * @property {Grids.jasonGrid} sender - The grid instance.
 * @property {number} pageNumber - The page number.
 */

/**
 * @event Grids.jasonGrid#onColumnPositionChange
 * @description Occurs when the column position changes.
 * @type {object}
 * @property {Grids.jasonGrid} sender - The grid instance.
 * @property {object} positionInfo - The position information.
 * @property {Grids.jasonGridColumn} positionInfo.column - The grid column.
 * @property {number} positionInfo.fromIndex - The grid column previous index.
 * @property {number} positionInfo.toIndex - The grid column new index.
 */

/**
 * @event Grids.jasonGrid#onColumnResize
 * @description Occurs when the column resizes.
 * @type {object}
 * @property {Grids.jasonGrid} sender - The grid instance.
 * @property {object} resizeInfo - The position information.
 * @property {Grids.jasonGridColumn} resizeInfo.column - The grid column.
 * @property {number} resizeInfo.newWidth - The grid column new width.
 */



/**
 * @constructor
 * @memberOf Grids
 * @augments Common.jasonBaseWidget
 * @description A multi-purpose data grid that supports grouping, multiple sorting, filtering and more.
 * @param {HTMLElement} htmlElement - DOM element that will contain the grid.
 * @param {Grids.jasonGridOptions} options - jasonGrid options. 
 * @property {Data.jasonDataSource} dataSource - Grid's underlying datasource.
 * @property {array} selectedRows - Currently selected rows.
 * @fires Grids.jasonGrid#event:onDataChange
 * @fires Grids.jasonGrid#event:onGroupByField
 * @fires Grids.jasonGrid#event:onUnGroupField
 * @fires Grids.jasonGrid#event:onSelectionChange
 * @fires Grids.jasonGrid#event:onGroupCollapse
 * @fires Grids.jasonGrid#event:onGroupExpand
 * @fires Grids.jasonGrid#event:onPageChange
 * @fires Grids.jasonGrid#event:onColumnPositionChange
 * @fires Grids.jasonGrid#event:onColumnResize
 */
function jasonGrid(htmlElement, options) {
    if (htmlElement.tagName != "DIV")
        throw new Error("Grid container element must be a div");
    this.defaultOptions = {
        multiSelect: false,
        cellMultiSelect: false,
        data: null,
        columns: null,
        selectedRows: null,
        paging: {
            pagesize: 200,
        },
        grouping: true,
        filtering: true,
        columnMenu: true,
        resizing: true,
        sorting: true,
        reordering: true,
        customization: {
            rowTemplate: null,
            dataFieldAttribute: "data-field"
        }
    };
    //creating the datasource first before constructing the UI helper, so we can create columns if no columns are defined, to be available to the helper.
    this.dataSource = new jasonDataSource({ data: typeof options.data == 'function' ? options.data() : options.data, onChange: this._onDataChanged.bind(this) });
    this._initializeColumns(options);
    jasonBaseWidget.call(this, "jasonGrid", htmlElement, options, jasonGridUIHelper);
    this.initialize();
    //this.ui.renderUI();
    this.ui._createColumnMenu();
    this.ui._initializeEvents();
    this.ui.localizeStrings(this.options.localization);
    this.ui.monitorChanges();
}

//#region  private members*/

/**
 * Initializes the grid columns
 * @ignore
 */
jasonGrid.prototype._initializeColumns = function (options) {
    options = options == void 0 ? this.options : options;
    if (!options.columns || options.columns.length == 0) {
        options.columns = [];
        var firstItem = this.dataSource.data ? this.dataSource.data[0] : null;
        if (firstItem) {
            var i = 0;
            for (var prop in firstItem) {
                if (prop != "_jwRowId")
                    options.columns.push({
                        caption: prop,
                        fieldName: prop,
                        index: i++,
                        tooltip: prop,
                        width: null,
                        visible: true,
                        dataType: jw.enums.dataType.unknown
                    });
            }
        }
    }
    else {
        for (var i = 0; i <= options.columns.length - 1; i++) {
            var col = options.columns[i];
            if (col.visible == null || col.visible == undefined)
                col.visible = true;
            col.index = i;
        }
    }
}
/**
    * Initializes the grid default column menu.
    * @ignore
    */
jasonGrid.prototype._initializeDefaultColumnMenu = function () {
    this.defaultGridColumnMenu = { items: [] };
    if (this.options.sorting) {
        var menuItemSortAsc = new jasonMenuItem(this.ui.createElement("li"),null,null);
        menuItemSortAsc.name = "mnuSortAsc";
        menuItemSortAsc.caption = this.options.localization.grid.columnMenu.sortAscending;
        menuItemSortAsc.title = menuItemSortAsc.caption;
        menuItemSortAsc.clickable = true;
        menuItemSortAsc.enabled = jasonWidgets.common.assigned(this.options.sorting);
        menuItemSortAsc.icon = jw.DOM.icons.SORT_ASC;
        menuItemSortAsc.level = 0;
        this.defaultGridColumnMenu.items.push(menuItemSortAsc);

        var menuItemSortDesc = new jasonMenuItem(this.ui.createElement("li"), null, null);
        menuItemSortDesc.name = "mnuSortDesc";
        menuItemSortDesc.caption = this.options.localization.grid.columnMenu.sortDescending;
        menuItemSortDesc.title = menuItemSortDesc.caption;
        menuItemSortDesc.enabled = jasonWidgets.common.assigned(this.options.sorting);
        menuItemSortDesc.clickable = true;
        menuItemSortDesc.icon = jw.DOM.icons.SORT_DESC;
        menuItemSortDesc.level = 0;
        this.defaultGridColumnMenu.items.push(menuItemSortDesc);
    }

    var menuItemColumns = new jasonMenuItem(this.ui.createElement("li"), null, null);
    menuItemColumns.name = "mnuColumns";
    menuItemColumns.caption = this.options.localization.grid.columnMenu.columns;
    menuItemColumns.title = menuItemColumns.caption;
    menuItemColumns.icon = jw.DOM.icons.LIST;
    menuItemColumns.level = 0;
    this.defaultGridColumnMenu.items.push(menuItemColumns);

    if (this.options.filtering) {
        var menuItemFilter = new jasonMenuItem(this.ui.createElement("li"), null, null);
        menuItemFilter.name = "mnuFilter";
        menuItemFilter.caption = this.options.localization.grid.columnMenu.filter;
        menuItemFilter.title = menuItemFilter.caption;
        menuItemFilter.icon = jw.DOM.icons.SEARCH;
        menuItemFilter.level = 0;
        menuItemFilter.addEventListener(jw.DOM.events.JW_EVENT_ON_JW_MENU_ITEM_CONTENT_SHOW, this._onFilterShown, this);
        //menuItemFilter.onItemContentShown = this._onFilterShown;
        this.defaultGridColumnMenu.items.push(menuItemFilter);
    }

    var isDividerAdded = false;

    if (this.options.sorting) {
        this.defaultGridColumnMenu.items.push(createJasonMenuDividerItem());
        isDividerAdded = true;

        var menuItemClearSorting = new jasonMenuItem(this.ui.createElement("li"), null, null);
        menuItemClearSorting.name = "mnuClearSorting";
        menuItemClearSorting.caption = this.options.localization.grid.columnMenu.clearSorting;
        menuItemClearSorting.title = menuItemClearSorting.caption;
        menuItemClearSorting.enabled = jasonWidgets.common.assigned(this.options.sorting);
        menuItemClearSorting.clickable = true;
        menuItemClearSorting.icon = jw.DOM.icons.REMOVE_SORT;
        menuItemClearSorting.level = 0;
        this.defaultGridColumnMenu.items.push(menuItemClearSorting);
    }

    if (this.options.filtering) {
        var menuItemClearFiltering = new jasonMenuItem(this.ui.createElement("li"), null, null);
        menuItemClearFiltering.name = "mnuClearFiltering";
        menuItemClearFiltering.caption = this.options.localization.grid.columnMenu.clearFilters;
        menuItemClearFiltering.title = menuItemClearFiltering.caption;
        menuItemClearFiltering.enabled = jasonWidgets.common.assigned(this.options.sorting);
        menuItemClearFiltering.clickable = true;
        menuItemClearFiltering.icon = jw.DOM.icons.REMOVE_FILTER;
        menuItemClearFiltering.level = 0;
        this.defaultGridColumnMenu.items.push(menuItemClearFiltering);
        if (!isDividerAdded)
            this.defaultGridColumnMenu.items.push(createJasonMenuDividerItem());
    }


    this._addColumnsToMenu();
    if (this.options.filtering)
        this._addFilterToMenu();
}
/**
    * Adds the list of grid columns in the columns menu list.
    * @ignore
    */
jasonGrid.prototype._addColumnsToMenu = function () {
    var columnsMenuItem = this.defaultGridColumnMenu.items.filter(function (item) {
        return item.name == "mnuColumns";
    })[0];
    for (var i = 0 ; i <= this.options.columns.length - 1; i++) {
        var column = this.options.columns[i];
        var menuItem = new jasonMenuItem();
        menuItem.name = column.fieldName;
        menuItem.caption = column.caption;
        menuItem.title = column.title ? column.title : column.caption;
        menuItem.hasCheckBox = true;
        menuItem.checked = true;
        menuItem.clickable = true;
        menuItem.level = columnsMenuItem.level + 1;
        menuItem.parent = columnsMenuItem;
        columnsMenuItem.items.push(menuItem);
    }
}
/**
    * Adds filter to the column menu.
    * @ignore
    */
jasonGrid.prototype._addFilterToMenu = function () {
    var filterMenuItem = this.defaultGridColumnMenu.items.filter(function (item) {
        return item.name == "mnuFilter";
    })[0];
    this.ui._renderFilterUI();
    this.ui.filterContainer.style.display = "";
    var filterMenuItemContent = new jasonMenuItem();
    filterMenuItemContent.name = "";
    filterMenuItemContent.caption = "";
    filterMenuItemContent.content = this.ui.filterContainer;
    filterMenuItemContent.parent = filterMenuItem;
    filterMenuItem.items.push(filterMenuItemContent);
}
/**
 * @ignore
 */
jasonGrid.prototype._onDataChanged = function () {
    this._initializeColumns();
    this.ui.renderUI();
    this.triggerEvent(jw.DOM.events.JW_EVENT_ON_DATA_CHANGE);
}
/**
 * @ignore
 */
jasonGrid.prototype._onFilterShown = function () {
    var self = this;
    var appliedFilter = this.dataSource.filters.filter(function (gridFilter) { return gridFilter.filterField == self.ui._currentFilterField; })[0];
    if (appliedFilter)
        this.ui._loadFilterValues(appliedFilter);
}
/**
 * Returns the column object for a  field.
 * @ignore
 */
jasonGrid.prototype._columnByField = function (fieldName) {
    return this.options.columns.filter(function (column) { return column.fieldName == fieldName; })[0];
}
//#endregion

//#region public members

/**
 * Initializing customization templates.
 * @ignore
 */
jasonGrid.prototype.initialize = function () {
    jasonBaseWidget.prototype.initialize.call(this);
    //this._initializeColumns();
    this.selectedRows = new Array();
    this.currentView = new Array();
    this.groupping = new Array();
    this.filters = new Array();
    this.sorting = new Array();

    if (typeof this.options.sorting != "object") {
        var sortValue = this.options.sorting;
        if (typeof this.options.sorting == "string")
            sortValue = jasonWidgets.common.strToBool(sortValue);
        this.options.sorting = sortValue ? { multiple: false } : null;
    }
    if (typeof this.options.paging != "object") {
        var pagingValue = this.options.paging;
        if (typeof this.options.paging == "string")
            pagingValue = jasonWidgets.common.strToBool(pagingValue);
        this.options.paging = pagingValue ? { Pagesize: 200 } : null;
    }
    this._initializeDefaultColumnMenu();

    if (this.options.data && this.options.data.length > 0) {
        var model = this.options.data[0];
        if (typeof model === "object") {
            for (var prop in model) {
                var column = this._columnByField(prop.toString());
                if (column && (column.dataType == void 0 || column.dataType == jw.enums.dataType.unknown)) {
                    if (column) {
                        column.dataType = jw.common.getVariableType(model[prop]);
                    }
                }
            }
        }
    }
}
/**
 * Groups data by a field.
 * @param {string} fieldName - Field name to group by.
 */
jasonGrid.prototype.groupByField = function (fieldName) {
    if (fieldName && !this.dataSource.groupingExists(fieldName)) {
        this.dataSource.groupByField(fieldName);
        this.ui._groupByField(this._columnByField(fieldName));
        this.triggerEvent(jw.DOM.events.JW_EVENT_ON_GROUP_BY_FIELD, fieldName);
    }
}
/**
 * Removes grouping by a field.
 * @param {string} fieldName - Field name of which the grouping will be removed.
 */
jasonGrid.prototype.removeGrouping = function (fieldName) {
    if (fieldName) {
        var indexToRemove = -1;
        var groupingToRemove = this.dataSource.grouping.filter(function (grouppingField, grouppingFieldIndex) {
            if (grouppingField.field == fieldName) {
                indexToRemove = grouppingFieldIndex;
                return true;
            }
        })[0];
        if (indexToRemove >= 0) {
            var groupingToRemove = this.dataSource.grouping[indexToRemove];
            this.dataSource.removeGrouping(groupingToRemove);
            var columnIndexToRemove = -1;
            for (var i = 0; i <= this.options.columns.length - 1; i++) {
                if (this.options.columns[i].groupField == groupingToRemove.field) {
                    columnIndexToRemove = i;
                }
            }
            if (columnIndexToRemove >= 0)
                this.options.columns.splice(columnIndexToRemove, 1);

            this.ui._removeGroupByField(fieldName);
            this.triggerEvent(jw.DOM.events.JW_EVENT_ON_UNGROUP_FIELD, fieldName);
        }

    }
}
/**
 * Sorts data by a field.
 * @param {string} fieldName - Field name to sort by.
 * @param {string} direction - Sort direction is 'asc' or 'desc'. Default is 'asc'.
 */
jasonGrid.prototype.sortBy = function (fieldName,direction) {
    if (fieldName) {
        direction = direction == void 0 ? 'asc' : direction;
        var column = this._columnByField(fieldName);
        var primerFunction = null;
        if (column.dataType) {
            switch (column.dataType) {
                case jw.enums.dataType.string: { primerFunction = null; break; }
                case jw.enums.dataType.number: { primerFunction = parseFloat; break; }
                case jw.enums.dataType.date: { primerFunction = Date.parse; break; }
            }
        }
        var newSorting = new jasonDataSourceSorting(column.fieldName, direction != "asc", primerFunction);
        if (!this.options.sorting.multiple) {
            this.dataSource.clearSorting();
        }
        this.dataSource.addSorting(newSorting);
        this.ui._refreshCurrentPage();
    }
}
/**
 * Removes sorting by a field.
 * @param {string} fieldName - Field name of which the sorting will be removed.
 */
jasonGrid.prototype.removeSorting = function (fieldName) {
    if (fieldName) {
        this.dataSource.removeSorting(fieldName);
        this.ui._refreshCurrentPage();
    }
}
/**
 * Filters by a field.
 * @param {string} fieldName - Field name to filter on.
 * @param {jasonGridFilterValue[]} filterValues - Filter values.
 */
jasonGrid.prototype.filterBy = function (fieldName, filterValues) {
    if (fieldName && filterValues) {
        this.dataSource.addFilter(fieldName, filterValues);
        this.dataSource.applyFilters();
        this.ui._goToPage(1, true);
        this.ui._sizeColumns();
        this.ui.columnMenu.ui.hideMenu();
        if (this.ui._currentTHElement == null)
            this.ui._currentTHElement = jw.common.getElementsByAttribute(this.ui.gridHeaderTable, jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR, fieldName, "th")[0];
        this.ui._currentTHElement.classList.add(jw.DOM.classes.JW_GRID_FIELD_HAS_FILTER);
    }
}
/**
 * Clears filters by a field. If no field is defined, it clears all filters.
 * @param {string} fieldName - Field name to filter on.
 */
jasonGrid.prototype.clearFilter = function (fieldName) {
    if (fieldName) {
        this.dataSource.removeFilter(fieldName);
        this.ui._goToPage(1, true);
        this.ui._sizeColumns();
        this.ui.columnMenu.ui.hideMenu();
        this.ui._currentTHElement.classList.remove(jw.DOM.classes.JW_GRID_FIELD_HAS_FILTER);
    }
}
/**
 * Navigates to a grid page if paging is configured.
 * @param {number} pageNumber - Page number to navigate to.
 */
jasonGrid.prototype.goToPage = function (pageNumber) {
    if (pageNumber && this.options.paging) {
        this.ui._goToPage(pageNumber, true);
    }
}
/**
 * Shows a column if the column is hidden.
 * @param {jasonGridColumn} column - Column to show.
 */
jasonGrid.prototype.showColumn = function (column) {
    if (column && !column.visible) {
        return this.ui._columnVisible(column, true);
    }
    return true;
}
/**
 * Hides a column if the column is visible. Cannot hide if there is only one column in the grid.
 * @param {jasonGridColumn} column - Column to hide.
 */
jasonGrid.prototype.hideColumn = function (column) {
    if (column && column.visible) {
        return this.ui._columnVisible(column, false);
    }
    return false;
}
/**
 * Moves a column if the column is visible.
 * @param {jasonGridColumn} column - Column to move.
 * @param {number} newIndex - New index for the column.
 */
jasonGrid.prototype.moveColumnTo = function (column, newIndex) {
    this.ui.moveColumn(column, newIndex);
}
/**
 * Selects a data row and adds it to the selectedRows array if multiple select is on.
 * @param {jasonGridColumn} column - Column to hide.
 */
jasonGrid.prototype.selectRow = function (rowIndex) {
    var row = this.dataSource.currentDataView[rowIndex];
    if (this.options.multiSelect) {
        this.selectedRows.push(row);
    } else {
        this.selectedRows = [row];
    }
}
/**
 * Toggles the collapse state of a data grouping.
 * @param {string|number} groupLevel - Level of the grouping to toggle.
 * @param {string} groupKey - Key of the grouping to toggle.
 */
jasonGrid.prototype.toggleCollapseDatagroup = function (groupLevel, groupKey) {
    this.ui._collapseExpandGroup(groupLevel, groupKey);
}
/**
 * Exports grid to CSV.
 * @ignore
 */
jasonGrid.prototype.exportToCSV = function (fileName) {
    throw new Error("Not implemented yet.");
}
/**
 * Exports grid to PDF.
 * @ignore
 */
jasonGrid.prototype.exportToPDF = function (fileName) {
    throw new Error("Not implemented yet.");
}
/**
 * Exports grid to EXCEL.
 * @ignore
 */
jasonGrid.prototype.exportToExcel = function (fileName) {
    throw new Error("Not implemented yet.");
}
//#endregion





