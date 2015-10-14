/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonGrid.prototype = Object.create(jasonBaseWidget.prototype);
jasonGrid.prototype.constructor = jasonGrid;

/**
 * @name jasonGridDefaultOptions
 * @property {boolean}  MultiSelect                     - Set to true to enable multi-select. Default is false.
 * @property {array}    Data                            - Data for the grid to display.
 * @property {array}    Columns                         - Grid columns. List of {@link jasonGridColumn}
 * @property {array}    SelectedRows                    - Array that lists the user selected rows. Should be read only.
 * @property {object}   Paging                          - Paging configuration.  
 * @property {number}   Paging.PageSize                 - Pagesize.Default is 200.
 * @property {boolean}  Grouping                        - Set to true to enable grouping.Default is true.
 * @property {boolean}  Filtering                       - Set to true to enable filtering.Default is true.
 * @property {object}   Sorting                         - Set to true to enable sorting. Default is true. {@link jasonGridSorting}
 * @property {boolean}  ColumnMenu                      - Set to true to enable column menu. Default is true
 * @property {object}   Events                          - Grid events.
 * @property {function} Events.OnSelectionChange        - Fired when grid selection changes.
 * @property {function} Events.OnPageChange             - Fired when grid page changes.    
 * @property {function} Events.OnSort                   - Fired when grid sort occurs.
 * @property {object}   Customization                   - Grid customization.
 * @property {any}      Customization.RowTemplate       - HTML string or script tag containing HTML to be used to render grid rows.
 * @property {any}      Customization.AltRowTemplate    - HTML string or script tag containing HTML to be used to render grid alternate rows.
 * @property {string}   Customization.GridContainerClass- Class to be added to the grid container element.
 * @property {string}   Customization.TableClass        - Class to be added to the grid table element.
 * @property {string}   Customization.TableHeaderClass  - Class to be added to the grid table header element.
 * @property {string}   Customization.TableBodyClass    - Class to be added to the grid table body element.
 * @property {string}   Customization.TableFooterClass  - Class to be added to the grid table footer element.
 */

/**
 * @name jasonGridColumn
 * @property {string} Caption   - Column caption.
 * @property {string} FieldName - FieldName of the underlying datasource.
 * @property {number} Index     - Column index on the column list.
 * @property {string} Tooltip   - Column tooltip.
 * @property {number} Index     - If not specified a width value will be calculated for the column.Use it only when you want a specific width for a column.
 * @property {boolean} Visible  - If false column is not rendered.
 * @property {string}  DataType - Can be one of four data types. String,Date,Number and Boolean.
 */

/**
 * @name jasonGridSorting
 * @property {boolean} multiple - Set to true to enable multiple sorting.
 */

/**
 * @constructor
 * @param {HTMLElement} htmlElement - DOM element that will contain the grid.
 * @param {any} options - jasonGrid options. {@link jasonGridDefaultOptions}
 */
function jasonGrid(htmlElement, options) {
    if (htmlElement.tagName != "DIV")
        throw new Error("Grid container element must be a div");
    jasonBaseWidget.call(this, "jasonGrid", htmlElement);
    this.GRID_HEADER_CONTAINER = "jason-grid-header-container";
    this.GRID_HEADER_CONTAINER_NO_GROUPING = "no-grouping";
    this.GRID_HEADER_CELL_CAPTION_CONTAINER = "jason-header-cell-caption";
    this.GRID_HEADER_CELL_ICON_CONTAINER = "jason-header-cell-icon";
    this.GRID_HEADER = "jason-grid-header";
    this.GRID_DATA_CONTAINER = "jason-grid-data-container";
    this.GRID_DATA = "jason-grid-data";
    this.GRID_FOOTER_CONTAINER = "jason-grid-footer-container";
    this.GRID_FOOTER = "jason-grid-footer";

    this.GRID_TABLE_ROW_CLASS = "jason-grid-row";
    this.GRID_TABLE_ALT_ROW_CLASS = "row-alt";
    this.GRID_TABLE_GROUP_ROW_CLASS = "group-row"
    this.GRID_TABLE_CELL_CLASS = "jason-grid-cell";

    this.GRID_SELECTED_ROW_CLASS = "row-selected";
    this.GRID_GROUPING_CONTAINER_CLASS = "jason-grid-group-container";
    this.GRID_TABLE_NO_DATA_ROW_CLASS = "jason-grid-no-data-row";
    
    this.gridSelectedRows = new Array();
    this.SelectedRows = new Array();
    this.CurrentView = new Array();
    this.groupping = new Array();
    this.filters = new Array();
    this.sorting = new Array();
    this.grouppingTree = {};
    this.defaultOptions = {
        MultiSelect: false,
        Data: null,
        Columns: null,
        SelectedRows: null,
        Paging: {
            Pagesize:200,
        },
        Grouping:true,
        Filtering: true,
        ColumnMenu: true,
        Sorting: true,
        Events: {
            OnSelectionChange: null,
            OnPageChange: null,
            OnSort: null
        },
        Customization: {
            RowTemplate: null,
            AltRowTemplate: null,
            GridContainerClass: null,
            TableClass: null,
            TableHeaderClass: null,
            TableBodyClass: null,
            TableFooterClass: null
        }
    };
    
    this.initialize(options);
    if (typeof this.options.Sorting != "object") {
        var sortValue = this.options.Sorting;
        if (typeof this.options.Sorting == "string")
            sortValue = jasonWidgets.common.strToBool(sortValue);
        this.options.Sorting = sortValue ? { multiple: false } : null;
    }
    if (typeof this.options.Paging != "object") {
        var pagingValue = this.options.Paging;
        if (typeof this.options.Paging == "string")
            pagingValue = jasonWidgets.common.strToBool(pagingValue);
        this.options.Paging = pagingValue ? { Pagesize: 200 } : null;
    }

    //this.sortOnColumn = this.sortOnColumn.bind(this);
    this.DataSource = new jasonDataSource(this.options.Data);
    jasonWidgets.benchMark.Start();
    this.renderMarkUp();
    jasonWidgets.benchMark.Stop("Rendering grid mark up in {0} miliseconds");
    this.initializeEvents();
    this.options.Localization = jasonWidgets.localizationManager.CurrentLanguage ? jasonWidgets.localizationManager.CurrentLanguage : this.options.Localization;
    this.createColumnMenu();
    this.localizeStrings(this.options.Localization);
    
}

//#region rendering DOM */

/**
 * Creates HTML for the grid. Header, Body and footer.
 */
jasonGrid.prototype.renderMarkUp = function () {
    jasonBaseWidget.prototype.renderMarkUp.call(this);
    var self = this;

    //this.htmlElement.classList.add(this.GRID_INITIAL_HTML_ELEMENT);
    this.gridHeaderContainer = this.createElement("div");
    this.gridHeaderContainer.classList.add(this.GRID_HEADER_CONTAINER);
    if (!this.options.Grouping) {
        this.gridHeaderContainer.classList.add(this.GRID_HEADER_CONTAINER_NO_GROUPING);
    }
    this.gridDataContainer = this.createElement("div");
    this.gridDataContainer.classList.add(this.GRID_DATA_CONTAINER);
    this.gridFooterContainer = this.createElement("div");
    this.gridFooterContainer.classList.add(this.GRID_FOOTER_CONTAINER);


    this.htmlElement.appendChild(this.gridHeaderContainer);
    this.htmlElement.appendChild(this.gridDataContainer);
    this.htmlElement.appendChild(this.gridFooterContainer);

    /*render the grid thead and sticky headers*/
    this.renderHeader();

    var toRecord = this.DataSource.Data ? this.DataSource.Data.length : 0;
    toRecord = this.options.Paging && this.options.Paging.Pagesize && toRecord > this.options.Paging.Pagesize ? this.options.Paging.Pagesize : toRecord;

    /*actual rendering of the table body*/
    //if(!this.options.Paging)
    this.renderRows(0, toRecord - 1);

    /*sizing properly the headers*/
    this.sizeGridHeaders(); //TODO:responsible for big delay when rendering large amount of data.
    
    /*last but not least the footer*/
    this.renderFooter(toRecord);
    
    /*
     * more performant way to handle resize event cals , taken from https://developer.mozilla.org/en-US/docs/Web/Events/resize
     * upon a window resize we want to resize the sticky headers, so they always align with the data table.
     */
    var resizeTimeout;
    window.addEventListener("resize", function () {
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(function () {
                resizeTimeout = null;
                self.sizeGridHeaders();
                // The actualResizeHandler will execute at a rate of 15fps
            }, 66);
        }
    });

}
/**
 * Mananing selected row(s) based on the configuration of the grid.
 * @param {object} event - DOM event
 */

jasonGrid.prototype.handleSelection = function (event) {
    var self = this;
    var targetParent = event.target.parentNode;
    while (targetParent.tagName != "TR") {
        targetParent = targetParent.parentNode;
    }
    if (targetParent.className.indexOf(self.GRID_TABLE_GROUP_ROW_CLASS) >= 0)
        return;
    var selectedRow = this.gridSelectedRows[0];

    if (selectedRow && this.options.MultiSelect == false) {
        selectedRow.classList.remove(self.GRID_SELECTED_ROW_CLASS);
    }
    if (this.options.MultiSelect == true && !event.ctrlKey) {
        this.gridSelectedRows.forEach(function (rowSelected) {
            rowSelected.classList.remove(self.GRID_SELECTED_ROW_CLASS);
        });
        this.gridSelectedRows = new Array();
        this.SelectedRows = new Array();
    }


    targetParent.classList.add(this.GRID_SELECTED_ROW_CLASS);
    var rowId = targetParent.getAttribute("data-row-Id");
    if (!this.options.MultiSelect) {
        this.gridSelectedRows = new Array();
        this.SelectedRows = new Array();
    }
    this.SelectedRows.push(this.DataSource.Data[rowId]);
    this.gridSelectedRows.push(targetParent);
    if (this.options.Events.OnSelectionChange)
        this.options.Events.OnSelectionChange(event, this.SelectedRows);
}



/**
 * Initializes event handlers.
 */
jasonGrid.prototype.initializeEvents = function () {
    var self = this;
    this.gridDataTable.addEventListener("mousedown", function (event) {
        self.handleSelection(event);
        event.stopPropagation();
    });
}


//#endregion

//#region rendering - HEADER - start*/

/**
 * Renders grid header and/or grouping container , depending on configuration. 
 */
jasonGrid.prototype.renderHeader = function () {
    if (!this.options.Columns) {
        this.options.Columns = [];
        var firstItem = this.DataSource.Data ? this.DataSource.Data[0] : null;
        if (firstItem) {
            var i = 0;
            for (var prop in firstItem) {
                if (prop != "_jwRowId")
                    this.options.Columns.push({
                        Caption: prop,
                        FieldName: prop,
                        Index: i++,
                        Tooltip: prop,
                        Width: null,
                        Visible: true,
                        DataType: null
                    });
            }
        }
    }
    else {
        for (var i = 0; i <= this.options.Columns.length - 1; i++) {
            var col = this.options.Columns[i];
            if (col.Visible == null || col.Visible == undefined)
                col.Visible = true;
            col.Index = i;
        }
    }


    if (!this.gridHeaderTable) {
        //Header table
        this.gridHeaderTable = this.gridHeaderContainer.appendChild(this.createElement("table"));
        var headerTableColGroup = this.gridHeaderTable.appendChild(this.createElement("colgroup"));
        var headerTHead = this.gridHeaderTable.appendChild(this.createElement("thead"));

        //Data table
        this.gridDataTable = this.gridDataContainer.appendChild(this.createElement("table"));
        var dataTableColGroup = this.gridDataTable.appendChild(this.createElement("colgroup"));
        this.gridDataTableBody = this.gridDataTable.appendChild(this.createElement("tbody"));

        this.gridHeaderTableRow = headerTHead.appendChild(this.createElement("tr"));
    }
    else {
        var headerTableColGroup = this.gridHeaderTable.getElementsByTagName("colgroup")[0];
        var dataTableColGroup = this.gridDataTable.getElementsByTagName("colgroup")[0];
    }
    var self = this;
    
    this.renderHeaderColumns(headerTableColGroup, dataTableColGroup);

    //Grouping container
    if (this.options.Grouping == true && !this.gridGroupingContainer) {
        this.gridGroupingContainer = this.gridHeaderContainer.insertBefore(this.createElement("div"), this.gridHeaderTable);
        this.gridGroupingContainer.classList.add(this.GRID_GROUPING_CONTAINER_CLASS);
        this.gridGroupingContainer.appendChild(this.createElement("span"));
        this.gridGroupingContainer.ondragenter = function (event) { event.preventDefault(); }
        this.gridGroupingContainer.ondragover = function (event) { event.preventDefault(); }
        this.gridGroupingContainer.ondrop = function (event) {
            var fieldToGroup = event.dataTransfer.getData("text");
            if (fieldToGroup) {
                var field = self.options.Columns.filter(function (column) { return column.FieldName == fieldToGroup; })[0];
                var groupingExists = self.groupping.filter(function (grouppingField) { return grouppingField.GrouppingField.FieldName == fieldToGroup; }).length == 1;
                if (field && !groupingExists) {
                    /*creating grouping elements*/
                    var groupingFieldContainer = self.createElement("div");
                    var groupingFieldContainerRemove = self.createElement("a");
                    var groupingFieldText = self.createElement("span");
                    /*setting text of the grouping container*/
                    groupingFieldText.appendChild(self.createTextNode(field.Caption));
                    groupingFieldText.setAttribute("data-grouping-field", field.FieldName);

                    /*setting text and tooltip to the remove grouping field anchor*/
                    var iconNode = self.createElement("i");
                    iconNode.className = "jw-icon x-2x";
                    groupingFieldContainerRemove.appendChild(iconNode);
                    groupingFieldContainerRemove.setAttribute("title", self.options.Localization.Grid.Grouping.RemoveGrouping + field.Caption);

                    /*constructing the DOM*/
                    groupingFieldContainer.appendChild(groupingFieldText);
                    groupingFieldContainer.appendChild(groupingFieldContainerRemove);
                    self.gridGroupingContainer.appendChild(groupingFieldContainer);
                    self.gridGroupingContainer.setAttribute("title", fieldToGroup);

                    /*setting on click event for the remove anchor*/
                    groupingFieldContainerRemove.addEventListener("click", function (event) {
                        self.gridGroupingContainer.removeChild(groupingFieldContainer);
                        var fieldNameToRemove = groupingFieldText.getAttribute("data-grouping-field");
                        var indexToRemove = -1;
                        var groupingToRemove = self.groupping.filter(function (grouppingField, grouppingFieldIndex) {
                            if (grouppingField.GrouppingField.FieldName == fieldNameToRemove) {
                                indexToRemove = grouppingFieldIndex;
                                return true;
                            }
                        })[0];
                        if (indexToRemove >= 0) {
                            self.groupping.splice(indexToRemove, 1);
                            self.options.Columns.splice(groupingToRemove.Level, 1);
                            self.groupping.forEach(function (grouping, groupingIndex) {
                                grouping.Level = groupingIndex;
                            });
                            if (self.groupping.length == 0) {
                                self.gridPager.GoToPage(self.gridPager.currentPage, true);
                                self.gridGroupingContainer.childNodes[0].style.display = "";
                                self.renderHeader();
                                self.sizeGridHeaders();
                            }
                            else
                                self.createGrouppedData();
                        }
                    });
                    var newGrouping = { Level: self.groupping.length, GrouppingField: field, GrouppingValues: [] };
                    self.gridGroupingContainer.childNodes[0].style.display = "none";
                    self.groupping.push(newGrouping);
                    self.options.Columns.splice(newGrouping.Level, 0, { Width: "25px", GroupColumn: true, Visible: true });
                    self.createGrouppedData();
                }
            }
            event.preventDefault();
        }
    }

    if (this.options.Filtering == true && !this.gridFilter)
        this.gridFilter = new jasonGridFilter(this);
}

/**
 * Renders header columns.
 * @param {object} headerTableColGroup - HTMLELement
 * @param {object} dataTableColGroup   - HTMLELement
 */
jasonGrid.prototype.renderHeaderColumns = function (headerTableColGroup, dataTableColGroup) {
    var self = this;
    this.gridHeaderTableRow.innerHTML = "";
    headerTableColGroup.innerHTML = "";
    dataTableColGroup.innerHTML = "";

    this.options.Columns.forEach(function (gridColumn, columnIndex) {
        if (gridColumn.Visible) {
            var headerTableColElement = headerTableColGroup.appendChild(self.createElement("col"));
            var dataTableColElement = dataTableColGroup.appendChild(self.createElement("col"));
            var headerElement = self.gridHeaderTableRow.appendChild(self.createElement("th"));
            //var headerCellElement = headerElement.appendChild(self.createElement("td"));
            var headerCellCaptionContainer = headerElement.appendChild(self.createElement("div"));
            headerCellCaptionContainer.classList.add(self.GRID_HEADER_CELL_CAPTION_CONTAINER);
            var headerCellIconContainer = headerElement.appendChild(self.createElement("div"));
            headerCellIconContainer.classList.add(self.GRID_HEADER_CELL_ICON_CONTAINER);
            var headerCellClearFloat = headerElement.appendChild(self.createElement("div"));
            headerCellClearFloat.classList.add(jasonWidgets.common.CLEAR_FLOAT_CLASS);
            var tooltip = gridColumn.Tooltip ? gridColumn.Tooltip : gridColumn.Caption;
            /*if the column is a group column then set explicit width.We do not want the grouping placeholder column to be too big*/
            if (gridColumn.GroupColumn) {
                headerTableColElement.style.width = "25px";
                dataTableColElement.style.width = "25px";
            }
            /*if the column is associated with a field.*/
            if (gridColumn.FieldName) {
                headerElement.setAttribute("data-column-id", columnIndex);
                headerElement.setAttribute("data-column-field", gridColumn.FieldName);
                headerElement.setAttribute("title", tooltip);
                headerElement.setAttribute("draggable", "true");
                headerElement.ondragstart = function (event) {
                    event.dataTransfer.effectAllowed = "copy";
                    event.dataTransfer.setData("text", gridColumn.FieldName);
                }
                var captionElement = headerCellCaptionContainer.appendChild(self.createElement("span"));
                captionElement.appendChild(self.createTextNode(gridColumn.Caption));
            }
            /*Creating grid colum menu*/
            if (self.options.ColumnMenu == true && !gridColumn.GroupColumn) {
                var  gridColumnMenuIcon = self.createElement("i");
                gridColumnMenuIcon.className = "jw-icon menu-2x";
                gridColumnMenuIcon.style.cssFloat = "right";
                gridColumnMenuIcon.style.cursor = "pointer";
                gridColumnMenuIcon.setAttribute("data-column-id", columnIndex);
                gridColumnMenuIcon.addEventListener("click", function (event) {
                    self.gridFilter.currentFilterColumn = self.options.Columns[parseInt(event.target.getAttribute("data-column-id"))];
                    self.gridFilter.currentFilterField = self.options.Columns[parseInt(event.target.getAttribute("data-column-id"))].FieldName;
                    self.gridFilter.currentTHElement = jasonWidgets.common.getParentElement("TH", event.target);
                    var filter = self.filters.filter(function (gridFilter) { return gridFilter.filterField == self.gridFilter.currentFilterField; })[0];
                    self.gridFilter.loadFilterValues(filter);
                    self.gridColumnMenu.showMenu(event.target);
                    
                    event.stopPropagation();
                });
                headerCellIconContainer.appendChild(gridColumnMenuIcon);
            }
            if (self.options.Filtering == true && self.options.ColumnMenu == false) {
                var filterIconElement = self.createElement("i");
                filterIconElement.className = "jw-icon lightbulb-2x";
                filterIconElement.style.cssFloat = "right";
                filterIconElement.style.cursor = "pointer";
                filterIconElement.addEventListener("click", function (event) {
                    self.gridFilter.renderMarkUp(filterIconElement, event);
                    event.stopPropagation();
                });
                headerCellIconContainer.appendChild(filterIconElement);
            }
        }
    });
}
/**
 * Sizing grid headers so the sticky headers and grid data headers align properly 
 */
jasonGrid.prototype.sizeGridHeaders = function () {
    this.hasScrollBars = this.gridDataContainer.scrollHeight > this.gridHeaderContainer.parentNode.clientHeight;
    if (!this.scrollBarWidth)
        this.scrollBarWidth = jasonWidgets.common.scrollBarWidth();
    var fixedWidthColumnsTotal = this.fixedWidthColumnsSum();

    if (this.gridHeaderContainer.clientWidth > this.gridDataContainer.clientWidth) {
        var widthDifference = Math.abs(this.gridHeaderContainer.clientWidth - this.gridDataContainer.clientWidth);
        this.gridHeaderTable.style.width = "calc(100% - " + widthDifference + "px)";
    }

    if (fixedWidthColumnsTotal > 0) {

        //if there columns with fixed width we neeed to subtract the sum of their width, to calculate properly the
        //oneColumnWidth , that will be applied to the colums with no fixed width.
        var oneColumnWidth = ((this.gridHeaderTable.clientWidth - fixedWidthColumnsTotal) - 1) / this.columnCountWithNoFixedWidth;
        var headerColGroup = this.gridHeaderTable.getElementsByTagName("colgroup")[0];
        var dataTableColGroup = this.gridDataTable.getElementsByTagName("colgroup")[0];
        /*Iterating through the rendered header and adjust their widths*/
        for (var i = 0; i <= headerColGroup.children.length - 1; i++) {
            var gridColumn = this.options.Columns[i];
            var headerTableColElement = headerColGroup.children[i];
            var dataTableColElement = dataTableColGroup.children[i];
            //setting the col group elements widths for sticky and data table columns.
            headerTableColElement.style.width = gridColumn.Width ? isNaN(gridColumn.Width) ? gridColumn.Width : gridColumn.Width + "px" : oneColumnWidth + "px";
            dataTableColElement.style.width = headerTableColElement.style.width;

        }

    }
}
/**
 * Calculating the width sum of all columns with fixed(or better put assigned) width
 */
jasonGrid.prototype.fixedWidthColumnsSum = function () {
    var result = 0;
    var onlyNumbers = new RegExp("/[^0-9.,]/g");
    this.options.Columns.forEach(function (gridColumn) {
        if (gridColumn.Width && !gridColumn.GroupColumn) {
            var numericWidth = isNaN(gridColumn.Width) ? parseFloat(gridColumn.Width.replace(/\D/g, '')) : gridColumn.Width;
            result = result + numericWidth;
        }
    });
    return result;
}
/**
 * Returns the width sum of all columns with no specified width.
 */
jasonGrid.prototype.columnCountWithNoFixedWidth = function () {
    return this.options.Columns.filter(function (col) { return col.Width ? true : false; }).length;
}
//#endregion

//#region rendering - BODY - start*/

/**
 * Rendering rows to the grid body
 * @param {number} fromRecord 
 * @param {number} toRecord
 * @param {object} source - optional. If a source is specified then it will be used as the source of data. By default the grid's original source will be used.
 */
jasonGrid.prototype.renderRows = function (fromRecord, toRecord, source) {
    if (source === void 0) { source = null; }
    this.gridDataTableBody.innerHTML = "";
    var newRow = null;
    var newCell = null;
    var textNode = null;
    var sourceData = source ? source : this.DataSource.Data;
    var sourceRow = null;
    var self = this;
    this.CurrentView = new Array();
    if (sourceData.length > 0) {
        for (var i = fromRecord; i <= toRecord; i++) {
            sourceRow = sourceData[i];
            sourceRow.RowIndex = i;
            self.CurrentView.push(sourceRow);
            newRow = this.createRowElementWithContentFromData(sourceRow);
            if (i % 2 == 0)
                newRow.classList.add(self.GRID_TABLE_ALT_ROW_CLASS);
            self.gridDataTableBody.appendChild(newRow);
        }
    } else {
        self.gridDataTableBody.appendChild(self.renderNoDataRow());
    }
}
/**
 * Renders an empty <TR> element when the grid has no data.
 */
jasonGrid.prototype.renderNoDataRow = function () {
    var newRow = this.createElement("tr");
    var newCell = this.createElement("td");
    newCell.setAttribute("colspan", this.options.Columns.length);
    newCell.appendChild(this.createTextNode(this.options.Localization.Data.NoData));
    newRow.appendChild(newCell);
    newRow.classList.add(this.GRID_TABLE_NO_DATA_ROW_CLASS);
    return newRow;
}
/**
 * Creates a TR element and associates it with a dataRow from the source data
 * @param {object} dataRow - Grid data row.
 */
jasonGrid.prototype.createRowElementFromData = function (dataRow) {
    var newRow = this.createElement("tr");
    newRow.setAttribute("data-row-Id", dataRow.RowIndex);
    newRow.className = this.GRID_TABLE_ROW_CLASS;
    return newRow;
}
/**
 * Creates a TR element and associates it with a dataRow from the source data, and creates cells for the newly created containing data from the dataRow 
 * @param {object} dataRow - Grid data row.* 
 */
jasonGrid.prototype.createRowElementWithContentFromData = function (dataRow) {
    var newRow = this.createRowElementFromData(dataRow);
    for (var x = 0; x <= this.options.Columns.length - 1; x++) {
        var column = this.options.Columns[x];
        if (column.Visible) {
            newCell = this.createCellElementFromColumn(column, dataRow);
            newRow.appendChild(newCell);
        }
    }
    return newRow;
}
/**
 * Create a TD element from a dataRow 
 * @param {object} dataColumn - Grid column.
 * @param {object} dataRow - Grid data row. {@link jasonGridColumn} 
 */
jasonGrid.prototype.createCellElementFromColumn = function (dataColumn, dataRow) {
    var newCell = this.createElement("td");
    if (dataColumn.GroupColumn != true) {
        newCell.className = this.GRID_TABLE_CELL_CLASS;
        newCell.setAttribute("data-cell-id", dataColumn.Index);
        textNode = this.createTextNode(dataRow[dataColumn.FieldName]);
        newCell.appendChild(textNode);
    }
    else
        newCell.className = "group-cell";
    return newCell;
}
/**
 * Create a TR grouping row element, with needed elements to provide expand/collapse functionality
 * @param {object} groupNode - HTMLElement
 */
jasonGrid.prototype.createGrouppingRow = function (groupNode) {
    var newRow = this.createElement("tr");
    var newCell = this.createElement("td");
    var iconNode = this.createElement("i");
    var self = this;
    iconNode.className = "jw-icon arrow-circle-bottom-2x";
    iconNode.addEventListener("click", function (event) {
        if (iconNode.className.indexOf("bottom") >= 0) {
            iconNode.className = "jw-icon arrow-circle-top-2x";
            newRow.setAttribute("data-group-expanded", "false");
            self.collapseGroup(newRow);
        }
        else {
            iconNode.className = "jw-icon arrow-circle-bottom-2x";
            newRow.setAttribute("data-group-expanded", "true");
            self.expandGroup(newRow);
        }
        event.stopPropagation();
    });
    newRow.classList.add(this.GRID_TABLE_ROW_CLASS);
    newRow.classList.add(this.GRID_TABLE_GROUP_ROW_CLASS);
    newRow.setAttribute("data-groupping-level", groupNode.Level);
    newCell.setAttribute("colspan", this.options.Columns.length);
    newCell.appendChild(iconNode);
    newCell.appendChild(this.createTextNode(groupNode.Text));
    newCell.style.paddingLeft = groupNode.Level * 25 + "px";
    newRow.appendChild(newCell);
    return newRow;
}

//#endregion rendering - BODY - end*/

//#region rendering - FOOTER - start*/
/**
 * Renders grid footer. Which includes Pager and record information.
 */
jasonGrid.prototype.renderFooter = function (toRecord) {
    if (!this.gridPager) {
        this.gridPager = new jasonGridPager(this);
        if(this.options.Paging)
            this.gridPager.updatePagerInfo(0, toRecord - 1, this.DataSource.Data.length);
    }
}
//#endregion rendering - FOOTER - end*/

//#region Grouping data - start*/

/**
 * Creates a grouping tree based on the grouping configuration the user made through the UI
 */
jasonGrid.prototype.createGrouppedData = function () {
    var self = this;
    jasonWidgets.benchMark.Start();
    this.grouppingTree = new jasonGridGroupTreeView();

    //iterating through the data of the current rendered view.
    self.CurrentView.forEach(function (dataRow) {
        //iterating every group
        self.groupping.forEach(function (currentGrouppingField, currentGroupFieldNameIndex) {
            //getting current grouping field's value.
            var currentGroupFieldValue = dataRow[currentGrouppingField.GrouppingField.FieldName];
            //building the parentnodes path for the current group value.
            var parentNodesPath = "";
            for (var i = currentGroupFieldNameIndex - 1; i >= 0; i--) {
                var parentGrpField = self.groupping[i];
                parentNodesPath = dataRow[parentGrpField.GrouppingField.FieldName] + parentNodesPath;
            }
            parentNodesPath = parentNodesPath.length == 0 ? currentGroupFieldValue : parentNodesPath;
            //try to find the root group node.
            var rootGroupNode = self.grouppingTree.FindNodeFromPath(parentNodesPath);
            if (rootGroupNode && currentGrouppingField.Level > 0) {
                //if we do find a root node, try to find the immediate parent.
                var parentNode = self.grouppingTree.FindNode(currentGroupFieldValue, rootGroupNode);
                //if an immidiate parent exists add this node to its data.
                if (parentNode) {
                    parentNode.Data.push(dataRow);
                }
                else {
                    //if there is not immidiate parent we need to add the node to the root group node.
                    var nodeExists = self.grouppingTree.AddNode(rootGroupNode, currentGroupFieldValue);
                    nodeExists.Data.push(dataRow);
                }

            }
            else {
                //if the root group node does not exist, create it.
                var nodeExists = rootGroupNode ? rootGroupNode : self.grouppingTree.FindNode(currentGroupFieldValue);
                if (!nodeExists) {
                    nodeExists = self.grouppingTree.AddNode(null, currentGroupFieldValue);
                }
                nodeExists.Data.push(dataRow);
            }
        });
    });

    self.groupping.forEach(function (grouppingField) { grouppingField.HasGrouppedData = true; });
    jasonWidgets.benchMark.Stop("Groupping data in {0} ms");
    self.renderHeader();
    self.renderGrouppedData();

}
/**
 * Renders grouped data requires special handling
 */
jasonGrid.prototype.renderGrouppedData = function () {
    var self = this;
    self.gridDataTableBody.innerHTML = "";

    /*recursive function to render elements in a groupped style*/
    var renderGroup = function (groupNode) {
        /*adding the groupping row*/
        var grouppingRow = self.createGrouppingRow(groupNode);
        grouppingRow.setAttribute("data-group-expanded", "true");
        self.gridDataTableBody.appendChild(grouppingRow);
        /*if it has children nodes, do not render the data but iterate through the childenodes to
         * render group rows until we reach a groupping node that has no child groups.
         */
        if (groupNode.Children.length > 0) {
            for (var i = 0; i <= groupNode.Children.length - 1; i++) {
                renderGroup(groupNode.Children[i]);
            }
        } else {
            //if we are at the last grouping node render the actual data.
            groupNode.Data.forEach(function (nodeDataRow) {
                var newRow = self.createRowElementWithContentFromData(nodeDataRow);
                newRow.setAttribute("data-group-level", groupNode.Level);
                self.gridDataTableBody.appendChild(newRow);
            });
        }
    }
    for (var x = 0; x <= self.grouppingTree.Items.length - 1; x++) {
        renderGroup(self.grouppingTree.Items[x]);
    }
    this.sizeGridHeaders();
}
/**
 * Collapses a group row
 */
jasonGrid.prototype.collapseGroup = function (groupRow) {
    var self = this;
    //getting the group level from which we want to start collapsing.
    var collapseGroupLevel = parseInt(groupRow.getAttribute("data-groupping-level"));
    //iterating through the next row in the table body until the last child of under this group level.
    for (var i = groupRow.sectionRowIndex + 1; i <= self.gridDataTableBody.childNodes.length - 1; i++) {
        var currentRow = self.gridDataTableBody.childNodes[i];
        //if the row is a group row.
        if (currentRow.className.indexOf(self.GRID_TABLE_GROUP_ROW_CLASS) >= 0) {
            var currentRowGroupLevel = parseInt(currentRow.getAttribute("data-groupping-level"));
            //if the group is a sub group of the group we want to collapse then we hide it as well.
            if (currentRowGroupLevel > collapseGroupLevel) {
                currentRow.style.display = "none";
            }
            else//if we reach a group row that has the same level as our collapse we stop the iteration.
                return;
        } else {
            //hiding any rows under the group we want to collapse.
            currentRow.style.display = "none";
        }
    }
}
/**
 * Expands a group row
 */
jasonGrid.prototype.expandGroup = function (groupRow) {
    var self = this;
    //getting the group level for the row we want to expand.
    var expandGroupLevel = parseInt(groupRow.getAttribute("data-groupping-level"));
    //iterating through the next row in the table body until the last child of under this group level.
    for (var i = groupRow.sectionRowIndex + 1; i <= self.gridDataTableBody.childNodes.length - 1; i++) {
        var currentRow = self.gridDataTableBody.childNodes[i];
        //if the row is a group row.
        if (currentRow.className.indexOf(self.GRID_TABLE_GROUP_ROW_CLASS) >= 0) {
            //the current group row expand state. Meaning if it was expanded or collapsed. 
            //this is useful when we are expanding a parent group, we want to restore the sub-groups
            //to their prior state before the parent group collapsing and hiding everything.
            var currentRowGroupExpandState = currentRow.getAttribute("data-group-expanded");
            //current level of the group row.
            var currentRowGroupLevel = parseInt(currentRow.getAttribute("data-groupping-level"));
            if (currentRowGroupLevel > expandGroupLevel) {
                //restore visibility for the sub-group row.
                currentRow.style.display = "";
                //if the sub-group was expanded when the parent group collapsed then expand this sub-group as well.
                if (currentRowGroupExpandState == "true")
                    self.expandGroup(currentRow);
            }
            else//if we reach a group row that has the same level as our collapse we stop the iteration.
                return;
        } else {
            //the current row group level that data row belongs to.
            var currentRowGroupLevel = currentRow.getAttribute("data-group-level");

            if (currentRowGroupLevel == expandGroupLevel)
                currentRow.style.display = "";
        }
    }
}
//#endregion grouping data - end*/

// #region JASON GRID PAGER - start*/
/**
 * jasonGridPager - helper class that implements paging navigation logic for the jasonGrid. 
 */
function jasonGridPager(grid) {
    this.grid = grid;
    this.PAGER_CONTAINER_CLASS = "jason-grid-pager";
    this.PAGER_CONTAINER_PAGE_INFO_CLASS = "pager-info";
    this.calculatePageCount = this.calculatePageCount.bind(this);
    this.GoToPage = this.GoToPage.bind(this);
    this.updatePagerInfo = this.updatePagerInfo.bind(this);
    this.calculatePageCount(this.grid.options.Data);
    this.currentPage = 0;
    if (this.grid.options.Paging) {
        this.renderPager();
        this.initializeEvents();
    }
}
/**
 * Renders pager HTML in the grid footer
 */
jasonGridPager.prototype.renderPager = function () {
    var textNode = null;
    this.pagerContainer = this.grid.createElement("div");
    this.pagerContainer.classList.add(this.PAGER_CONTAINER_CLASS);
    this.pagerInfo = this.grid.createElement("span");
    this.pagerInfo.classList.add(this.PAGER_CONTAINER_PAGE_INFO_CLASS);
    this.pagerButtonFirst = this.grid.createElement("button");
    this.pagerButtonPrior = this.grid.createElement("button");
    this.pagerButtonLast = this.grid.createElement("button");
    this.pagerButtonNext = this.grid.createElement("button");
    this.pagerInput = this.grid.createElement("input");

    textNode = document.createTextNode("First");
    this.pagerButtonFirst.appendChild(textNode);
    this.pagerButtonFirst.setAttribute("title", "Move to the first page");

    textNode = document.createTextNode("Prior");
    this.pagerButtonPrior.appendChild(textNode);
    this.pagerButtonPrior.setAttribute("title", "Move to the previous page");

    textNode = document.createTextNode("Next");
    this.pagerButtonNext.appendChild(textNode);
    this.pagerButtonNext.setAttribute("title", "Move to the next page");

    textNode = document.createTextNode("Last");
    this.pagerButtonLast.appendChild(textNode);
    this.pagerButtonLast.setAttribute("title", "Move to the last page");

    this.pagerInput.style.width = "50px";
    this.pagerInput.style.textAlign = "center";
    this.pagerInput.setAttribute("type", "number");
    this.pagerInput.setAttribute("value", "1");
    this.pagerInput.setAttribute("min", "1");
    this.pagerInput.setAttribute("title", "Type in a page number, to go to that page");

    this.pagerContainer.appendChild(this.pagerButtonFirst);
    this.pagerContainer.appendChild(this.pagerButtonPrior);
    this.pagerContainer.appendChild(this.pagerInput);
    this.pagerContainer.appendChild(this.pagerButtonNext);
    this.pagerContainer.appendChild(this.pagerButtonLast);
    this.pagerContainer.appendChild(this.pagerInfo);
    this.grid.gridFooterContainer.appendChild(this.pagerContainer);

}
/**
 * Updates current page information. e.g [1-200 of 5000]
 * @param {number} recordStart
 * @param {number} recordStop
 * @param {number} recordCount
 */
jasonGridPager.prototype.updatePagerInfo = function (recordStart, recordStop, recordCount) {
    if (this.pagerInfo.childNodes.length > 0)
        this.pagerInfo.removeChild(this.pagerInfo.childNodes[0]);
    this.pagerInfo.appendChild(this.grid.createTextNode( (recordStart + 1) + " - " + (recordStop + 1) + " of " + recordCount));
}
/**
 * Calculates page count.
 * @param {array} data - grid data.
 */
jasonGridPager.prototype.calculatePageCount = function (data) {
    if (this.grid.options.Paging)
        this.pageCount = data.length <= this.grid.options.Paging.Pagesize ? 0 : Math.floor(data.length / this.grid.options.Paging.Pagesize);
    else
        this.pageCount = 1;
}
/**
 * Navigates to a page.
 * @param {number} pageNumber - Page number to navigate to.
 * @param {boolean} forceAction - If true navigates to the specified page, even if it is the current page.
 * @param {object} event - HTMLEvent.
 */
jasonGridPager.prototype.GoToPage = function (pageNumber, forceAction,event) {
    if ((pageNumber != this.currentPage && this.pageCount >= 0) || (forceAction == true)) {
        if (pageNumber < 0)
            pageNumber = 0;
        if (pageNumber > this.pageCount)
            pageNumber = this.pageCount;
        if ((pageNumber == this.pageCount) && pageNumber != 0)
            pageNumber = pageNumber - 1;
        var dataToRender = this.grid.DataSource.Data;
        var pageSize = this.grid.options.Paging ? this.grid.options.Paging.Pagesize : dataToRender.length;
        var recordStart = pageNumber * pageSize;
        var recordStop = recordStart + pageSize - 1;
        
        if (this.grid.filters.length > 0) {
            dataToRender = this.grid.filters[this.grid.filters.length - 1].filteredData;
        }
        this.calculatePageCount(dataToRender);
        recordStop = recordStop > dataToRender.length ? dataToRender.length - 1 : recordStop;
        if (this.grid.sorting.length > 0)
            dataToRender = this.grid.DataSource.Sort(this.grid.sorting, dataToRender.slice(recordStart, recordStop + 1));
        this.grid.renderRows(recordStart, recordStop, dataToRender);
        if (this.grid.options.Paging) {
            this.updatePagerInfo(recordStart, recordStop, dataToRender.length);
            this.currentPage = pageNumber;
            this.pagerInput.value = this.currentPage + 1;
        }
        if (this.grid.options.Events.OnPageChange)
            this.grid.options.Events.OnPageChange(event, pageNumber, this.grid);
    }
}
/**
 * Initializes grid pager events. Adds event listeners for the grid pager navigation controls.
 */
jasonGridPager.prototype.initializeEvents = function () {
    var self = this;
    this.pagerButtonFirst.addEventListener("click", function (event) {
        self.GoToPage(0, event);
        event.stopPropagation();
    });
    this.pagerButtonPrior.addEventListener("click", function (event) {
        self.GoToPage(self.currentPage - 1, event);
        event.stopPropagation();
    });
    this.pagerButtonNext.addEventListener("click", function (event) {
        self.GoToPage(self.currentPage + 1, event);
        event.stopPropagation();
    });
    this.pagerButtonLast.addEventListener("click", function (event) {
        self.GoToPage(self.pageCount, event);
        event.stopPropagation();
    });
    this.pagerInput.addEventListener("blur", function (event) {
        self.GoToPage(self.pagerInput.value - 1, event);
        event.stopPropagation();
    });
    this.pagerInput.addEventListener("input", function (event) {
        self.GoToPage(self.pagerInput.value - 1, event);
        event.stopPropagation();
    });

}

// #endregion JASON GRID PAGER - end*/

// #region JASON GRID FILTER - start*/
/**
 * jasonGrid filter configuration helper class.
 */
function jasonGridFilter(grid) {
    this.grid = grid;
    this.GRID_FILTER_CONTAINER_CLASS = "jason-grid-filter-container";
    this.GRID_FILTER_HEADER_CLASS = "jason-grid-filter-header";
    this.GRID_FILTER_BODY_CLASS = "jason-grid-filter-body";
    this.GRID_FILTER_FOOTER_CLASS = "jason-grid-filter-footer";
    this.GRID_FILTER_ACTION_BUTTON_CLASS = "jason-grid-filter-action-button";
    this.GRID_FILTER_BUTTON_CLEAR_CLASS = "clear-filter";
    this.GRID_FILTER_BUTTON_APPLY_CLASS = "apply-filter";
    this.GRID_FIELD_HAS_FILTER = "jason-grid-column-has-filter";
}
/**
 * Prepares localized filter values.
 */
jasonGridFilter.prototype.prepareFilterValues = function () {
    var self = this;
    this.filterValues = [];
    this.filterValues.push({
        Title: self.grid.options.Localization.Filter.Values.FilterValueIsEqual,
        Visible:true,
        Symbol:'='
    });
    this.filterValues.push({
        Title: self.grid.options.Localization.Filter.Values.FilterValueIsNotEqual,
        Visible: true,
        Symbol:'!='
    });
    this.filterValues.push({
        Title: self.grid.options.Localization.Filter.Values.FilterValueStartsWith,
        Visible: true,
        Symbol:'startsWith'
    });
    this.filterValues.push({
        Title: self.grid.options.Localization.Filter.Values.FilterValueEndsWith,
        Visible: true,
        Symbol:'endWith'
    });
    this.filterValues.push({
        Title: self.grid.options.Localization.Filter.Values.FilterValueContains,
        Visible: true,
        Symbol:'contains'
    });
    this.filterValues.push({
        Title: self.grid.options.Localization.Filter.Values.FilterValueGreaterThan,
        Visible: true,
        Symbol:'>'
    });
    this.filterValues.push({
        Title: self.grid.options.Localization.Filter.Values.FilterValueGreaterEqualTo,
        Visible: true,
        Symbol:'>='
    });
    this.filterValues.push({
        Title: self.grid.options.Localization.Filter.Values.FilterValueLessThan,
        Visible: true,
        Symbol:'<'
    });
    this.filterValues.push({
        Title: self.grid.options.Localization.Filter.Values.FilterValueLessEqualTo,
        Visible: true,
        Symbol:'<='
    });
    this.filterValues.forEach(function (filterValue, filterValueIndex) { filterValue.Key = filterValueIndex; });
    this.filterLogicalOperators = [];
    this.filterLogicalOperators.push({
        Title: self.grid.options.Localization.Filter.Operators.And,
        Visible: true,
        Operator:'and'
    });
    this.filterLogicalOperators.push({
        Title: self.grid.options.Localization.Filter.Operators.Or,
        Visible: true,
        Operator:'or'
    });
    this.filterLogicalOperators.forEach(function (filterOperator, filterOperatorIndex) { filterOperator.Key = filterOperatorIndex; });
}
/**
 * Clears any applied filters.
 */
jasonGridFilter.prototype.clearFilterControls = function () {
    this.firstFilterCombobox.ui.selectItem(0);
    this.secondFilterCombobox.ui.selectItem(0);
    this.logicalOperatorCombobox.ui.selectItem(0);
    this.firstFilterInput.value = "";
    this.secondFilterInput.value = "";
}
/**
 * Loads filter values to filter elements
 */
jasonGridFilter.prototype.loadFilterValues = function (filter) {
    if (filter) {
        var fistFilterValue = filter.filterValues[0];
        if (fistFilterValue) {
            this.firstFilterCombobox.selectItem(fistFilterValue.FilterClause.Key);
            this.firstFilterInput.value = fistFilterValue.Value;
            this.logicalOperatorCombobox.selectItem(fistFilterValue.LogicalOperator.Key);
        }
        var secondFilterValue = filter.filterValues[1];
        if (secondFilterValue && secondFilterValue.FilterClause) {
            this.secondFilterCombobox.selectItem(secondFilterValue.FilterClause.Key);
            this.secondFilterInput.value = secondFilterValue.Value;
        }
        
        
    }
}
/**
 * Creates grid filter HTML.
 */
jasonGridFilter.prototype.createMarkUp = function () {
    var self = this;
    if (!this.filterContainer) {
        this.prepareFilterValues();
        this.filterContainer = document.createElement("div");
        this.filterContainer.className = this.GRID_FILTER_CONTAINER_CLASS;
        this.filterContainer.style.display = "none";
        /*filter header*/
        this.filterHeader = document.createElement("div");
        this.filterHeader.className = this.GRID_FILTER_HEADER_CLASS;
        this.filterHeaderTitle = document.createElement("span");
        this.filterHeaderTitle.appendChild(document.createTextNode(self.grid.options.Localization.Grid.Filtering.FilterHeaderCaption));
        this.filterHeader.appendChild(this.filterHeaderTitle);

        /*filter body*/
        this.filterBody = document.createElement("div");
        this.filterBody.className = this.GRID_FILTER_BODY_CLASS;
        /*creating filter combobox containers*/
        this.firstFilterOperatorContainer = document.createElement("div");

        this.filterLogicalOperator = document.createElement("div");

        this.secondFilterOperatorContainer = document.createElement("div");

        /*creating jwComboboxes*/
        this.firstFilterCombobox = new jasonCombobox(this.firstFilterOperatorContainer, {
            Data: this.filterValues,
            DisplayFields: ['Title'],
            DisplayFormatString: '{0}',
            KeyFieldName: 'Key',
            ReadOnly: true,
            PlaceHolder: this.grid.options.Localization.Search.SearchPlaceHolder,
            OnItemSelected:null
        });
        this.secondFilterCombobox = new jasonCombobox(this.secondFilterOperatorContainer, {
            Data: this.filterValues,
            DisplayFields: ['Title'],
            DisplayFormatString: '{0}',
            KeyFieldName: 'Key',
            ReadOnly: true,
            PlaceHolder: this.grid.options.Localization.Search.SearchPlaceHolder,
            OnItemSelected: null
        });
        this.logicalOperatorCombobox = new jasonCombobox(this.filterLogicalOperator, { Data: this.filterLogicalOperators, DisplayFields: ['Title'], DisplayFormatString: '{0}', KeyFieldName: 'Key', ReadOnly: true, PlaceHolder: this.grid.options.Localization.Search.SearchPlaceHolder });

        /*creating input elements*/
        this.firstFilterInputContainer = document.createElement("div");
        this.firstFilterInputContainer.className = "jason-filter-input";
        this.firstFilterInput = document.createElement("input");
        this.firstFilterInput.setAttribute("type", "text");
        this.firstFilterInput.setAttribute("placeholder", this.grid.options.Localization.Search.SearchPlaceHolder);
        this.firstFilterInputContainer.appendChild(this.firstFilterInput);
        var inputKeyDownEvent = function (keyDownEvent) {
            var key = keyDownEvent.keyCode || keyDownEvent.which;
            switch (key) {
                case 13: {
                    self.filterBtnApply.click();
                    break;
                }
            }
        }
        this.firstFilterInput.addEventListener("keydown", inputKeyDownEvent);

        this.secondFilterInput = document.createElement("input");
        this.secondFilterInput.setAttribute("type", "text");
        this.secondFilterInput.setAttribute("placeholder", this.grid.options.Localization.Search.SearchPlaceHolder);
        this.secondFilterInputContainer = document.createElement("div");
        this.secondFilterInputContainer.className = "jason-filter-input";
        this.secondFilterInputContainer.appendChild(this.secondFilterInput);
        this.secondFilterInput.addEventListener("keydown", inputKeyDownEvent);

        /*adding them to the dom*/
        this.filterBody.appendChild(this.firstFilterOperatorContainer);
        this.filterBody.appendChild(this.firstFilterInputContainer);
        this.filterBody.appendChild(this.filterLogicalOperator);
        this.filterBody.appendChild(this.secondFilterOperatorContainer);
        this.filterBody.appendChild(this.secondFilterInputContainer);



        /*filter footer*/
        this.filterFooter = document.createElement("div");
        this.filterFooter.className = this.GRID_FILTER_FOOTER_CLASS;


        this.filterBtnApply = document.createElement("a");
        this.filterBtnApply.className = this.GRID_FILTER_ACTION_BUTTON_CLASS;
        this.filterBtnApply.classList.add(this.GRID_FILTER_BUTTON_APPLY_CLASS);
        this.filterBtnApplyIcon = document.createElement("i");
        this.filterBtnApplyIcon.className = "jw-icon check-2x";
        this.filterBtnApply.appendChild(this.filterBtnApplyIcon);
        this.filterBtnApply.appendChild(document.createTextNode("Filter"));
        this.filterBtnApply.addEventListener("click", function (clickEvent) {
            var filter = self.grid.filters.filter(function (gridFilter) { return gridFilter.filterField == self.currentFilterField; })[0];
            //if there is already a filter applied to the data , use those data. Otherwise use the original data.
            var alreadyFilteredData = self.grid.filters.length > 0 ? self.grid.filters[self.grid.filters.length - 1].filteredData : self.grid.DataSource.Data;
            if (!filter) {
                //creating filter
                filter = { filterValues: [], filterField: null, filteredData: null };
                self.grid.filters.push(filter);

            } else {
                /*if the field that the user wants to apply filter to, is already in the filter list, then we should filter against the original data
                 and not against filtered data of the same field.
                 For example if the field is country and the currently applied filter is [China or Peru] and the user changes that to [China or Spain], if we
                 run the filter against the filtered data it will yield no results because it contains only [China or Peru].
                 That's why when user changes a filter of current field we run the filter against the original data.
                */
                alreadyFilteredData = self.grid.DataSource.Data;
            }
            var firstFilterValue = self.firstFilterInput.value;

            if (self.currentFilterColumn.DataType)
                firstFilterValue = jasonWidgets.common.convertValue(firstFilterValue, self.currentFilterColumn.DataType);

            filter.filterValues[0] = {
                Value: firstFilterValue,
                FilterClause: self.firstFilterCombobox.SelectedItem,
                LogicalOperator: self.logicalOperatorCombobox.SelectedItem
            };
            var secondFilterValue = self.secondFilterInput.value;
            if (self.currentFilterColumn.DataType)
                secondFilterValue = jasonWidgets.common.convertValue(secondFilterValue, self.currentFilterColumn.DataType);
            filter.filterValues[1] = {
                Value: secondFilterValue,
                FilterClause: self.secondFilterInput.value ? self.secondFilterCombobox.SelectedItem : null
            };
            filter.filterField = self.currentFilterField;

            //result of the filter search
            filter.filteredData = self.grid.DataSource.Filter(filter.filterValues, filter.filterField, alreadyFilteredData);
            //calculating  pagecount
            var toRecord = filter.filteredData ? filter.filteredData.length : 0;
            toRecord = self.grid.options.Paging && self.grid.options.Paging.Pagesize && toRecord > self.grid.options.Paging.Pagesize ? self.grid.options.Paging.Pagesize : toRecord;
            self.grid.gridPager.calculatePageCount(filter.filteredData);
            //rendering data.
            self.grid.gridPager.GoToPage(0, true);
            self.clearFilterControls();
            self.grid.gridColumnMenu.hideMenu();
            self.grid.grid
            self.currentTHElement.classList.add(self.GRID_FIELD_HAS_FILTER);
        });


        this.filterBtnClear = document.createElement("a");
        this.filterBtnClear.className = this.GRID_FILTER_ACTION_BUTTON_CLASS;
        this.filterBtnClear.classList.add(this.GRID_FILTER_BUTTON_CLEAR_CLASS);
        this.filterBtnClearIcon = document.createElement("i");
        this.filterBtnClearIcon.className = "jw-icon x-2x";
        this.filterBtnClear.appendChild(this.filterBtnClearIcon);
        this.filterBtnClear.appendChild(document.createTextNode("Clear"));
        this.filterBtnClear.addEventListener("click", function () {
            //finding the applied filter for the specific field
            var gridFilterIndexToDelete = -1;
            var filterToDelete = self.grid.filters.filter(function (gridFilter, gridFilterIndex) {
                var result = gridFilter.filterField == self.currentFilterField;
                if (result) {
                    gridFilterIndexToDelete = gridFilterIndex;
                    return gridFilter;
                }
            })[0];
            //remove the filter from the array of filters.
            if (filterToDelete) {
                self.grid.filters.splice(gridFilterIndexToDelete, 1);
            }
            //if there are no filters left use the original data, otherwise use filtered data.
            var filterDataToRender = null;
            if (self.grid.filters.length > 0) {
                filterDataToRender = self.grid.filters[self.grid.filters.length - 1].filteredData;
            } else {
                filterDataToRender = self.grid.DataSource.Data;
            }
            //calculating  pagecount
            var toRecord = filterDataToRender ? filterDataToRender.length : 0;
            toRecord = self.grid.options.Paging && self.grid.options.Paging.Pagesize && toRecord > self.grid.options.Paging.Pagesize ? self.grid.options.Paging.Pagesize : toRecord;
            self.grid.gridPager.calculatePageCount(filterDataToRender);
            //rendering data.
            self.grid.gridPager.GoToPage(0, true);
            self.currentTHElement.classList.remove(self.GRID_FIELD_HAS_FILTER);
            self.clearFilterControls();
        });

        document.addEventListener("mousedown", function (mouseDownEvent) {
            var containerRect = self.filterContainer.getBoundingClientRect();
            var isClickOutOfContainerHorizontal = (mouseDownEvent.x > containerRect.right) || (mouseDownEvent.x < containerRect.left);
            var isClickOutOfContainerVertical = (mouseDownEvent.y > containerRect.bottom) || (mouseDownEvent.y < containerRect.top);
            var shouldHideFilter = (isClickOutOfContainerHorizontal || isClickOutOfContainerVertical) && self.filterContainer.style.display == "";
            mouseDownEvent.stopPropagation();
        });

        this.filterFooter.appendChild(this.filterBtnClear);
        this.filterFooter.appendChild(this.filterBtnApply);

        this.filterContainer.appendChild(this.filterHeader);
        this.filterContainer.appendChild(this.filterBody);
        this.filterContainer.appendChild(this.filterFooter);

        var resizeTimeout;
        window.addEventListener("resize", function () {
            if (!resizeTimeout) {
                resizeTimeout = setTimeout(function () {
                    resizeTimeout = null;
                    //self.filterContainer.style.display = "none";
                    //self.grid.gridContainer.removeChild(self.filterContainer);
                }, 66);
            }
        });
        this.clearFilterControls();
        this.grid.localizeStrings();
        this.grid.htmlElement.appendChild(this.filterContainer);
        this.firstFilterCombobox.ui.comboboxInput.setAttribute("tabindex", jasonWidgets.common.getNextTabIndex());
        this.logicalOperatorCombobox.ui.comboboxInput.setAttribute("tabindex", jasonWidgets.common.getNextTabIndex());
        this.secondFilterCombobox.ui.comboboxInput.setAttribute("tabindex", jasonWidgets.common.getNextTabIndex());
    }
}
/**
 * Renders grid filter HTML on the page and calculates coordinates that the filter should be displayed.
 * @param {object} invocationSourceElement - HTMLElement
 * @param {object} invocationEvent - HTMLEvent.
 */
jasonGridFilter.prototype.renderMarkUp = function (invocationSourceElement,invocationEvent) {

    this.createMarkUp();
    var invocationTarget = invocationEvent.currentTarget;

    if (this.grid.options.Grouping == true)
        this.filterContainer.style.top = (this.grid.gridStickyHeader.offsetHeight + this.grid.gridGroupingContainer.offsetHeight + 5) + "px";
        else
    this.filterContainer.style.top = (this.grid.gridStickyHeader.offsetHeight) + "px";
    
    this.filterContainer.style.left = (event.clientX - 15) + "px";
    this.filterContainer.style.display = "";
    
    var nodeWithFieldInfo = invocationSourceElement;
    if (invocationSourceElement.tag != "TH") {
        nodeWithFieldInfo = invocationSourceElement.parentNode;
    }
    this.currentFilterField = nodeWithFieldInfo.getAttribute("data-column-field");
    this.currentTHElement = nodeWithFieldInfo;
    var appliedFilter = this.grid.filters.filter(function (gridFilter) { return gridFilter.filterField == self.currentFilterField; })[0];
    if (appliedFilter) {
        this.firstFilterCombobox.selectItem(appliedFilter.filterValues[0].FilterClause.Key);
        if (appliedFilter.filterValues[1])
            this.secondFilterCombobox.selectItem(appliedFilter.filterValues[1].FilterClause.Key);
        this.logicalOperatorCombobox.selectItem(appliedFilter.filterValues[0].LogicalOperator.Key);
        this.firstFilterInput.value = appliedFilter.filterValues[0].Value;
        this.secondFilterInput.value = appliedFilter.filterValues[1].Value;
    }
}

// #endregion JASON GRID FILTER - end*/

// #region JASON GRID STRING LOCALIZATION - start*/
/**
 * Initializes localization
 * @param {object} localizationObject - Object that has localized values for various grid UI elements. Filter, grouping, column menu, etc.
 */
jasonGrid.prototype.localizeStrings = function (localizationObject) {
    if (!localizationObject)
        localizationObject = this.options.Localization;
    if(this.options.Grouping == true)
        this.gridGroupingContainer.childNodes[0].innerText = localizationObject.Grid.Grouping.GroupingMessage;
    if (this.options.Filtering == true) {
        for (var i = 0; i <= this.gridHeaderTableRow.childNodes.length - 1; i++) {
            var thElement = this.gridHeaderTableRow.childNodes[i];
            for (var x = 0; x <= thElement.childNodes.length - 1; x++) {
                if (thElement.childNodes[x].tagName == "I") {
                    thElement.childNodes[x].setAttribute("title", localizationObject.Grid.Filtering.IconTooltip);
                }
            }
        }
        if (this.gridFilter.filterContainer) {
            this.gridFilter.filterBtnApply.replaceChild(this.createTextNode(localizationObject.Grid.Filtering.ApplyButtonText), this.gridFilter.filterBtnApply.childNodes[1]);
            this.gridFilter.filterBtnApply.setAttribute("title", localizationObject.Grid.Filtering.ApplyButtonTooltip);

            this.gridFilter.filterBtnClear.replaceChild(this.createTextNode(localizationObject.Grid.Filtering.ClearButtonText), this.gridFilter.filterBtnClear.childNodes[1]);
            this.gridFilter.filterBtnClear.setAttribute("title", localizationObject.Grid.Filtering.ClearButtonToollip);
        }
    }
    if (this.options.Paging) {
        this.gridPager.pagerButtonFirst.innerText = localizationObject.Grid.Paging.FirstPageButton;
        this.gridPager.pagerButtonPrior.innerText = localizationObject.Grid.Paging.PriorPageButton;
        this.gridPager.pagerButtonLast.innerText = localizationObject.Grid.Paging.LastPageButton;
        this.gridPager.pagerButtonNext.innerText = localizationObject.Grid.Paging.NextPageButton;
        this.gridPager.pagerInput.setAttribute("title", localizationObject.Grid.Paging.PagerInputTooltip);
    }

    if (this.options.ColumnMenu) {
        this.defaultGridColumnMenu.Items[0].Caption = localizationObject.Grid.ColumnMenu.SortAscending;
        this.defaultGridColumnMenu.Items[1].Caption = localizationObject.Grid.ColumnMenu.SortDescending;
        this.defaultGridColumnMenu.Items[2].Caption = localizationObject.Grid.ColumnMenu.Columns;
        this.defaultGridColumnMenu.Items[3].Caption = localizationObject.Grid.ColumnMenu.Filter;
        this.defaultGridColumnMenu.Items.forEach(function (item) {
            item.Title = item.Caption;
        });
    }
}
// #endregion JASON GRID STRING LOCALIZATION - end*/

//#region JASON GRID GROUP TREE - start*/
/**
 * jasonGrid group tree node 
 */
function jasonGridGroupTreeNode(text) {
    this.Data = [];
    this.Text = text;
    this.Children = [];
    this.Level = null;
    this.Parent = null;
}
/**
 * jasonGrid group tree view.
 * It is being used to create data tree view(s) based on the grouping that user defined through the UI.
 */
function jasonGridGroupTreeView() {
    this.findNode = function (nodeText, Nodes) {
        for (var i = 0; i <= Nodes.length - 1; i++) {
            if (Nodes[i].Text == nodeText) {
                return Nodes[i];
            }
            if (Nodes[i].Children.length > 0) {
                var result = this.findNode(nodeText, Nodes[i].Children);
                if (result)
                    return result;
            }
        }
    }
    this.findNodeFromPath = function (nodePath, Nodes) {
        for (var i = 0; i <= Nodes.length - 1; i++) {
            if (Nodes[i].NodePath == nodePath) {
                return Nodes[i];
            }
            if (Nodes[i].Children.length > 0) {
                var result = this.findNodeFromPath(nodePath, Nodes[i].Children);
                if (result)
                    return result;
            }
        }
    }
    this.Items = [];
    this.AddNode = function (parentNode, text) {
        var newTreeNode = new jasonGridGroupTreeNode(text);
        newTreeNode.Level = parentNode ? parentNode.Level + 1 : 0;
        newTreeNode.Parent = parentNode;
        newTreeNode.NodePath = "";
        if (parentNode) {
            parentNode.Children.push(newTreeNode);
        } else {
            this.Items.push(newTreeNode);
        }
        if (parentNode) {
            while (parentNode) {
                newTreeNode.NodePath = parentNode.Text + newTreeNode.NodePath;
                parentNode = parentNode.Parent;
            }
            newTreeNode.NodePath = newTreeNode.NodePath + text;
        }
        else
            newTreeNode.NodePath = text;
        return newTreeNode;
    }
    this.RemoveNode = function (node) {

    }

    this.FindNode = function (nodeText, startingNode) {
        var nodes = startingNode ? startingNode.Children : this.Items;
        return this.findNode(nodeText, nodes);
    }
    this.FindNodeFromPath = function (nodePath, startingNode) {
        var nodes = startingNode ? startingNode.Children : this.Items;
        return this.findNodeFromPath(nodePath, nodes);
    }
}
//#endregion JASON GRID GROUP TREE - end*/

//#region GRID MENU
/**
 * Creates the grid column menu.
 */
jasonGrid.prototype.createColumnMenu = function () {
    this.defaultGridColumnMenu = { Items: [] };

    var menuItemSortAsc = new jasonMenuItem();
    menuItemSortAsc.Name = "mnuSortAsc";
    menuItemSortAsc.Caption = "Sort Ascending";
    menuItemSortAsc.Title = menuItemSortAsc.Caption;
    menuItemSortAsc.Clickable = true;
    menuItemSortAsc.Enabled = jasonWidgets.common.assigned(this.options.Sorting);
    menuItemSortAsc.Icon = "jw-icon sort-ascending-2x";
    this.defaultGridColumnMenu.Items.push(menuItemSortAsc);

    var  menuItemSortDesc = new jasonMenuItem();
    menuItemSortDesc.Name = "mnuSortDesc";
    menuItemSortDesc.Caption = "Sort Descending";
    menuItemSortDesc.Title = menuItemSortDesc.Caption;
    menuItemSortDesc.Enabled = jasonWidgets.common.assigned(this.options.Sorting);
    menuItemSortDesc.Clickable = true;
    menuItemSortDesc.Icon = "jw-icon sort-descending-2x";
    this.defaultGridColumnMenu.Items.push(menuItemSortDesc);

    var  menuItemColumns = new jasonMenuItem();
    menuItemColumns.Name = "mnuColumns";
    menuItemColumns.Caption = "Columns";
    menuItemColumns.Title = menuItemColumns.Caption;
    menuItemColumns.Icon = "jw-icon columns-2x";
    this.defaultGridColumnMenu.Items.push(menuItemColumns);

    var menuItemFilter = new jasonMenuItem();
    menuItemFilter.Name = "mnuFilter";
    menuItemFilter.Caption = "Filter";
    menuItemFilter.Title = menuItemFilter.Caption;
    menuItemFilter.Icon = "jw-icon lightbulb-2x";
    this.defaultGridColumnMenu.Items.push(menuItemFilter);
    this.onColumnMenuItemChecked = this.onColumnMenuItemChecked.bind(this);
    this.onColumnMenuItemClicked = this.onColumnMenuItemClicked.bind(this);
    this.onColumnMenuHidden = this.onColumnMenuHidden.bind(this);
    this.addColumnsToMenu();
    this.addFilterToMenu();
    this.gridColumnMenu = new jasonMenuWidget(this.gridHeaderContainer, {
        _debug: false,
        Menu: this.defaultGridColumnMenu,
        Invokable: true,
        OnCheckBoxClicked: this.onColumnMenuItemChecked,
        OnItemClick: this.onColumnMenuItemClicked,
        HideDelay: 750,
        OnMenuHide:this.onColumnMenuHidden
    });
}
/**
 * Adds the list of grid columns in the columns menu list.
 */
jasonGrid.prototype.addColumnsToMenu = function () {
    var columnsMenuItem = this.defaultGridColumnMenu.Items.filter(function (item) {
        return item.Name == "mnuColumns";
    })[0];
    for (var i = 0 ; i <= this.options.Columns.length - 1; i++) {
        var column = this.options.Columns[i];
        var menuItem = new jasonMenuItem();
        menuItem.Name = column.FieldName;
        menuItem.Caption = column.Caption;
        menuItem.Title = column.Title ? column.Title : column.Caption;
        menuItem.HasCheckBox = true;
        menuItem.Checked = true;
        menuItem.Clickable = true;
        columnsMenuItem.Items.push(menuItem);
    }
}
/**
 * Adds filter to the column menu.
 */
jasonGrid.prototype.addFilterToMenu = function () {
    var filterMenuItem = this.defaultGridColumnMenu.Items.filter(function (item) {
        return item.Name == "mnuFilter";
    })[0];
    this.gridFilter.createMarkUp();
    this.gridFilter.filterContainer.style.display = "";
    var filterMenuItemContent = new jasonMenuItem();
    filterMenuItemContent.Name = "";
    filterMenuItemContent.Caption = "";
    filterMenuItemContent.Content = this.gridFilter.filterContainer;
    filterMenuItemContent.Parent = filterMenuItem;
    filterMenuItem.Items.push(filterMenuItemContent);
}
/**
 * Executed when a jasonMenuItem checkbox is clicked. The value of the checked determines the visibility of the column.
 * @param {object} clickEvent - HTMLEvent.
 * @param {object} menuItem - jasonMenuItem that was clicked.
 * @param {boolean} checked - If false the column will be hidden.
 */
jasonGrid.prototype.onColumnMenuItemChecked = function (clickEvent, menuItem, checked) {
    /*first try to find the corresponding column*/
    var column = this.options.Columns.filter(function (col) {
        return col.FieldName == menuItem.Name;
    })[0];

    /*get an array of currently visible columns.*/
    var columnVisibleCount = this.options.Columns.filter(function (col) { return col.Visible == true; })
    
    /*If the visible count of the columns is > 1, then go ahead and show/hide the column.
     * However if there is only one visible column left, it cannot be hidden.
     * So the hide/show will if visible count > 1 or user is not trying to hide the last visible column.
     */
    if (column && (columnVisibleCount.length > 1 || columnVisibleCount[0].FieldName != column.FieldName)) {
        column.Visible = checked;
        this.renderHeaderColumns(this.gridHeaderTable.getElementsByTagName("colgroup")[0], this.gridDataTable.getElementsByTagName("colgroup")[0]);
        this.sizeGridHeaders();
        this.renderRows(this.gridPager.currentPage, this.gridPager.pageCount);
        return true;
    }
    else
        return false;
}
/**
 * Executed when a jasonMenuItem checkbox is clicked. The value of the checked determines the visibility of the column.
 * @param {object} clickEvent - HTMLEvent.
 * @param {object} menuItem - jasonMenuItem that was clicked.
 */
jasonGrid.prototype.onColumnMenuItemClicked = function (clickEvent, menuItem) {
    /*first try to find the corresponding column*/
    var columnIndex = menuItem.jasonMenuWidget.InvokableElement.getAttribute("data-column-id");
    if(columnIndex)
        columnIndex = parseInt(columnIndex);
    var column = this.options.Columns[columnIndex];
    switch (menuItem.Name) {
        case "mnuSortAsc": {
            this.sortOnColumn("asc", column);
            break;
        }
        case "mnuSortDesc": {
            this.sortOnColumn("desc", column);
            break;
        }
    }
}
/**
 * Executed when the grid column menu is hidden
 */
jasonGrid.prototype.onColumnMenuHidden = function () {
    this.gridFilter.clearFilterControls();
}
jasonGrid.prototype.updateColumnSortIcon = function (sortDirection, column) {
}
jasonGrid.prototype.sortOnColumn = function (sortDirection, column) {
    var primerFunction = null;
    if (column.DataType) {
        var lowerCaseString = column.DataType.toLower();
        switch (lowerCaseString) {
            case "string": { primerFunction = null; break; }
            case "int": { primerFunction = parseInt; break; }
            case "float": { primerFunction = parseFloat; break; }
            case "datetime": { primerFunction = Date.parse; break; }
        }
    }
    var currentSorting = { name: column.FieldName, reverse: sortDirection != "asc", primer: primerFunction };
    if (this.options.Sorting.multiple) {
        var existingSortingIndex = -1;
        this.sorting.filter(function (sortingConfiguration, sortingConfigurationIndex) {
            var result = sortingConfiguration.name == currentSorting.name;
            if (result)
                existingSortingIndex = sortingConfigurationIndex;
            return result;
        });
        var iconClassName = sortDirection == "asc" ? "jw-icon chevron-down" : "jw-icon chevron-up";
        if (existingSortingIndex >= 0)
            this.sorting[existingSortingIndex] = currentSorting;
        else
            this.sorting.push(currentSorting);
    } else {
        this.sorting = [currentSorting];
    }

    
    this.gridPager.GoToPage(this.gridPager.currentPage, true);
}
//#endregion