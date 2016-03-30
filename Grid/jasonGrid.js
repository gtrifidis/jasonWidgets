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
 * @property {object}   [sorting.multiple=false]                - multiple - Set to true to enable multiple sorting 
 * @property {boolean}  [columnMenu=true]                      - Set to true to enable column menu.
 * @property {boolean}  [resizing=true]                        - Set to true to enable column resizing.
 * @property {boolean}  [reordering=true]                      - Set to true to enable column reordering.
 * @property {object}   [customization={}]                   - Grid customization.
 * @property {any}      [customization.rowTemplate=undefined]       - HTML string or script tag containing HTML to be used to render grid rows.
 * @property {string}   [customization.dataFieldAttribute=undefined]- String that defines the attribute in a template HTML for a data field.Default is 'data-field'
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
 * @property {number} index         - If not specified a width value will be calculated for the column.Use it only when you want a specific width for a column.
 * @property {boolean} visible      - If false column is not rendered.
 * @property {string}  dataType     - Can be one of four data types. String,Date,Number and Boolean.
 * @property {boolean} isInMenu     - If false column is not displayed on the list of columns to be hidden/shown.
 * @property {boolean} columnMenu   - If false column does not show a column menu icon.
 * @property {any} headerTemplate   - HTML string or script tag containing HTML to be used to render column header.
 * @property {any} cellTemplate     - HTML string or script tag containing HTML to be used to render column cell.
 */

/**
 * @class
 * @name jasonGridFilterValue
 * @description A grid filter value.
 * @memberOf Grids
 * @property {any} value - filter value.
 * @property {object} filterClause - filter clause
 * @property {string} filterClause.symbol - filter clause symbol ['=','>','<','>=','<=','!=','startsWith','endsWith','contains']
 * @property {object} logicalOperator - filter logical operator
 * @property {string} logicalOperator.operator - operator ['and','or']
 */

var
JW_EVENT_ON_DATA_CHANGE = 'onDataChange',
JW_EVENT_ON_GROUP_BY_FIELD = 'onGroupbyField',
JW_EVENT_ON_UNGROUP_FIELD = 'onUnGroupField',
JW_EVENT_ON_SELECTION_CHANGE = 'onSelectionChange'
JW_EVENT_ON_GROUP_COLLAPSE = 'onGroupCollapse',
JW_EVENT_ON_GROUP_EXPAND = 'onGroupExpand'
JW_EVENT_ON_PAGE_CHANGE = 'onPageChange',
JW_EVENT_ON_COLUMN_POSITION_CHANGE = 'onColumnPositionChange'
JW_EVENT_ON_COLUMN_RESIZED = 'onColumnResize',
GRID_FILTER_CONTAINER_CLASS = "jw-grid-filter-container",
GRID_FILTER_HEADER_CLASS = "jw-grid-filter-header",
GRID_FILTER_BODY_CLASS = "jw-grid-filter-body",
GRID_FILTER_FOOTER_CLASS = "jw-grid-filter-footer",
GRID_FILTER_ACTION_BUTTON_CLASS = "jw-grid-filter-action-button",
JW_GRID_FILTER_BUTTON_CLEAR = "clear-filter",
JW_GRID_FILTER_BUTTON_APPLY = "apply-filter",
GRID_FIELD_HAS_FILTER = "jw-grid-column-has-filter";
GRID_FILTER_INPUT = "jw-filter-input";

PAGER_CONTAINER_CLASS = "jw-grid-pager",
PAGER_CONTAINER_PAGE_INFO_CLASS = "jw-grid-pager-info";

/**
 * @class
 * @name jasonGridEvents
 * @memberOf Grids
 * @description List of jasonGrid events
 * @property {function} onDataChange -  function onDataChange()
 * @property {function} onGroupByField - function onGroupByField(fieldName:string)
 * @property {function} onUnGroupField - function onUnGroupField(fieldName:string)
 * @property {function} onSelectionChange - function onSelectionChange(selectedRows:Array)
 * @property {function} onGroupCollapse - function onGroupCollapse()
 * @property {function} onGroupExpand - function onGroupExpand()
 * @property {function} onPageChange - function onPageChange(pageNumber:number)
 * @property {function} onColumnPositionChange - function onColumnPositionChange(positionInfo:{column , fromIndex , toIndex})
 * @property {function} onColumnResize -  function onColumnResize( resizeInfo:{column , newWidth})
 */


/**
 * @constructor
 * @memberOf Grids
 * @augments Common.jasonBaseWidget
 * @description A multi-purpose data grid, that supports grouping,multiple sorting,filtering and more.
 * @param {HTMLElement} htmlElement - DOM element that will contain the grid.
 * @param {Grids.jasonGridOptions} options - jasonGrid options. 
 * @property {Data.jasonDataSource} dataSource - Grid's underlying datasource.
 * @property {array} selectedRows - Currently selected rows.
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
    this.ui.renderUI();
    this.ui._createColumnMenu();
    this.ui._initializeEvents();
    this.ui.localizeStrings(this.options.localization);
}

//#region  private members*/

/**
 * Initializing customization templates.
 * @ignore
 */
jasonGrid.prototype._initializeTemplates = function () {
    /*initializing row and column templates*/
    var rowTemplate = (typeof this.options.customization.rowTemplate == "function") ? this.options.customization.rowTemplate() : this.options.customization.rowTemplate;
    var isElement = document.getElementById(rowTemplate);
    if (isElement) {
        rowTemplate = isElement.tagName == "SCRIPT" ? isElement.innerHTML : isElement.outerHTML;
    }
    else {
        rowTemplate = typeof rowTemplate == "string" && rowTemplate.trim().length > 0 ? rowTemplate : null;
    }
    this.options.customization.rowTemplate = rowTemplate;
    if (this.options.columns) {
        for (var i = 0; i <= this.options.columns.length - 1; i++) {
            var column = this.options.columns[i];
            var headerTemplate = typeof column.headerTemplate == "function" ? column.headerTemplate() : column.headerTemplate;
            var isElement = document.getElementById(headerTemplate);
            if (isElement) {
                headerTemplate = isElement.tagName == "SCRIPT" ? isElement.innerHTML : isElement.outerHTML;
            } else {
                headerTemplate = typeof headerTemplate == "string" && headerTemplate.trim().length > 0 ? headerTemplate : null;
            }
            column.headerTemplate = headerTemplate;

            var cellTemplate = typeof column.cellTemplate == "function" ? column.cellTemplate() : column.cellTemplate;
            isElement = document.getElementById(cellTemplate);
            if (isElement) {
                cellTemplate = isElement.tagName == "SCRIPT" ? isElement.innerHTML : isElement.outerHTML;
            } else {
                cellTemplate = typeof cellTemplate == "string" && cellTemplate.trim().length > 0 ? cellTemplate : null;
            }
            column.cellTemplate = cellTemplate;
        }
    }
}
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
                        dataType: null
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
        var menuItemSortAsc = new jasonMenuItem();
        menuItemSortAsc.name = "mnuSortAsc";
        menuItemSortAsc.caption = this.options.localization.grid.columnMenu.sortAscending;
        menuItemSortAsc.title = menuItemSortAsc.caption;
        menuItemSortAsc.clickable = true;
        menuItemSortAsc.enabled = jasonWidgets.common.assigned(this.options.sorting);
        menuItemSortAsc.icon = JW_ICON_SORT_ASC;
        this.defaultGridColumnMenu.items.push(menuItemSortAsc);

        var menuItemSortDesc = new jasonMenuItem();
        menuItemSortDesc.name = "mnuSortDesc";
        menuItemSortDesc.caption = this.options.localization.grid.columnMenu.sortDescending;
        menuItemSortDesc.title = menuItemSortDesc.caption;
        menuItemSortDesc.enabled = jasonWidgets.common.assigned(this.options.sorting);
        menuItemSortDesc.clickable = true;
        menuItemSortDesc.icon = JW_ICON_SORT_DESC;
        this.defaultGridColumnMenu.items.push(menuItemSortDesc);
    }

    var menuItemColumns = new jasonMenuItem();
    menuItemColumns.name = "mnuColumns";
    menuItemColumns.caption = this.options.localization.grid.columnMenu.columns;
    menuItemColumns.title = menuItemColumns.caption;
    menuItemColumns.icon = JW_ICON_COLUMNS;
    this.defaultGridColumnMenu.items.push(menuItemColumns);

    if (this.options.filtering) {
        var menuItemFilter = new jasonMenuItem();
        menuItemFilter.name = "mnuFilter";
        menuItemFilter.caption = this.options.localization.grid.columnMenu.filter;
        menuItemFilter.title = menuItemFilter.caption;
        menuItemFilter.icon = JW_ICON_SEARCH;
        menuItemFilter.addEventListener(JW_EVENT_ON_MENU_ITEM_CONTENT_SHOW, this._onFilterShown, this);
        //menuItemFilter.onItemContentShown = this._onFilterShown;
        this.defaultGridColumnMenu.items.push(menuItemFilter);
    }

    var isDividerAdded = false;

    if (this.options.sorting) {
        this.defaultGridColumnMenu.items.push(createJasonMenuDividerItem());
        isDividerAdded = true;

        var menuItemClearSorting = new jasonMenuItem();
        menuItemClearSorting.name = "mnuClearSorting";
        menuItemClearSorting.caption = this.options.localization.grid.columnMenu.clearSorting;
        menuItemClearSorting.title = menuItemClearSorting.caption;
        menuItemClearSorting.enabled = jasonWidgets.common.assigned(this.options.sorting);
        menuItemClearSorting.clickable = true;
        menuItemClearSorting.icon = JW_ICON_CIRCLE_X;
        this.defaultGridColumnMenu.items.push(menuItemClearSorting);
    }

    if (this.options.filtering) {
        var menuItemClearFiltering = new jasonMenuItem();
        menuItemClearFiltering.name = "mnuClearFiltering";
        menuItemClearFiltering.caption = this.options.localization.grid.columnMenu.clearFilters;
        menuItemClearFiltering.title = menuItemClearFiltering.caption;
        menuItemClearFiltering.enabled = jasonWidgets.common.assigned(this.options.sorting);
        menuItemClearFiltering.clickable = true;
        menuItemClearFiltering.icon = JW_ICON_CIRCLE_X;
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
    this.triggerEvent(JW_EVENT_ON_DATA_CHANGE);
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
    this._initializeTemplates();
}
/**
 * Groups data by a field.
 * @param {string} fieldName - Field name to group by.
 */
jasonGrid.prototype.groupByField = function (fieldName) {
    if (fieldName) {
        this.dataSource.groupByField(fieldName);
        this.ui._groupByField(this._columnByField(fieldName));
        this.triggerEvent(JW_EVENT_ON_GROUP_BY_FIELD, fieldName);
    }
}
/**
 * Groups data by a field.
 * @param {string} fieldName - Field name to remove grouping for.
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
            this.triggerEvent(JW_EVENT_ON_UNGROUP_FIELD, fieldName);
        }

    }
}
/**
 * Sorts data by a field.
 * @param {string} fieldName - Field name to sort on.
 * @param {string} direction - Sort direction 'asc' or 'desc'. Default is 'asc'
 */
jasonGrid.prototype.sortBy = function (fieldName,direction) {
    if (fieldName) {
        direction = direction == void 0 ? 'asc' : direction;
        var column = this._columnByField(fieldName);
        var primerFunction = null;
        if (column.dataType) {
            var lowerCaseString = column.dataType.toLowerCase();
            switch (lowerCaseString) {
                case "string": { primerFunction = null; break; }
                case "int": { primerFunction = parseInt; break; }
                case "float": { primerFunction = parseFloat; break; }
                case "datetime": { primerFunction = Date.parse; break; }
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
 * @param {string} fieldName - Field name to sort on.
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
 * @param {jasonGridFilterValue[]} filterValues - filter values.
 */
jasonGrid.prototype.filterBy = function (fieldName, filterValues) {
    if (fieldName && filterValues) {
        this.dataSource.addFilter(fieldName, filterValues);
        this.dataSource.applyFilters();
        this.ui._goToPage(1, true);
        this.ui._sizeColumns();
        this.ui.columnMenu.ui.hideMenu();
        this.ui._currentTHElement.classList.add(GRID_FIELD_HAS_FILTER);
    }
}
/**
 * Clears filters by a field.If no field is defined, it clears all filters.
 * @param {string} fieldName - Field name to filter on.
 */
jasonGrid.prototype.clearFilter = function (fieldName) {
    if (fieldName) {
        this.dataSource.removeFilter(fieldName);
        this.ui._goToPage(1, true);
        this.ui._sizeColumns();
        this.ui.columnMenu.ui.hideMenu();
        this.ui._currentTHElement.classList.remove(GRID_FIELD_HAS_FILTER);
    }
}
/**
 * Navigates to a grid page, if paging is configured.
 * @param {number} pageNumber - Page number to navigate to.
 */
jasonGrid.prototype.goToPage = function (pageNumber) {
    if (pageNumber && this.options.paging) {
        this.ui._goToPage(pageNumber, true);
    }
}
/**
 * Shows a column if column is hidden.
 * @param {jasonGridColumn} column - Column to show.
 */
jasonGrid.prototype.showColumn = function (column) {
    if (column && !column.visible) {
        return this.ui._columnVisible(column, true);
    }
    return true;
}
/**
 * Hides a column if column is visible. Cannot hide if there is only one column in the grid.
 * @param {jasonGridColumn} column - Column to hide.
 */
jasonGrid.prototype.hideColumn = function (column) {
    if (column && column.visible) {
        return this.ui._columnVisible(column, false);
    }
    return true;
}
/**
 * Moves a column if column is visible. .
 * @param {jasonGridColumn} column - Column to move.
 * @param {number} newIndex - New index for the column.
 */
jasonGrid.prototype.moveColumnTo = function (column,newIndex) {
    jw.common.swapItemsInArray(this.options.columns, column.index, newIndex);
    this.ui.renderUI();
}
/**
 * Selects a data row and adds its to the selectedRows array, if multiple select is on.
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
/**
 * Expands a group.
 * @ignore
 */
jasonGrid.prototype.expandGroup = function () {
    throw new Error("Not implemented yet.");
}
/**
 * Collapses a group.
 * @ignore
 */
jasonGrid.prototype.collapseGroup = function () {
    throw new Error("Not implemented yet.");
}
/**
 * Shows filter for a column, if filtering is on and column menu is off.
 */
jasonGrid.prototype.collapseGroup = function (column) {
    throw new Error("Not implemented yet.");
}
//#endregion





