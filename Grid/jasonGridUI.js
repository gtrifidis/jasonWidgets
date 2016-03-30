jasonGridUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonGridUIHelper.prototype.constructor = jasonGridUIHelper;
var
    GRID_CLASS = "jw-grid",
    GRID_HEADER_CONTAINER = "jw-grid-header-container",
    GRID_HEADER_TABLE_CONTAINER = "jw-grid-header-table-container",
    GRID_HEADER_CONTAINER_NO_GROUPING = "no-grouping",
    GRID_HEADER_CELL_CAPTION_CONTAINER = "jw-header-cell-caption",
    GRID_HEADER_CELL_ICON_CONTAINER = "jw-header-cell-icon",
    GRID_HEADER = "jw-grid-header",
    GRID_DATA_CONTAINER = "jw-grid-data-container",
    GRID_DATA = "jw-grid-data",
    GRID_FOOTER_CONTAINER = "jw-grid-footer-container",
    GRID_FOOTER = "jw-grid-footer",

    GRID_TABLE_ROW_CLASS = "jw-grid-row",
    GRID_TABLE_ALT_ROW_CLASS = "row-alt",
    GRID_TABLE_GROUP_ROW_CLASS = "group-row",
    GRID_TABLE_CELL_CLASS = "jw-grid-cell",

    GRID_COLUMN_DRAG_IMAGE = "jw-grid-column-drag-image",

    GRID_COLUMN_ID_ATTR = "jw-column-id",
    GRID_COLUMN_FIELD_ATTR = "jw-column-field",
    GRID_COLUMN_RESIZE_HANDLE = "jw-column-resize",
    GRID_COLUMN_SORT_ATTR = "jw-column-sort";

    GRID_SELECTED_ROW_CLASS = "row-selected",
    GRID_SELECTED_CELL_CLASS = "cell-selected";
    GRID_GROUPING_CONTAINER_CLASS = "jw-grid-group-container",
    GRID_GROUP_FIELD = "jw-group-field",
    GRID_TABLE_NO_DATA_ROW_CLASS = "jw-grid-no-data-row";




    
/**
 * @constructor
 * @ignore
 */
function jasonGridUIHelper(widget, htmlElement) {
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);
    this.resizeTimeout = null;
    this._onColumnMenuItemChecked = this._onColumnMenuItemChecked.bind(this);
    this._onColumnMenuItemClicked = this._onColumnMenuItemClicked.bind(this);
    this._onColumnMenuHidden = this._onColumnMenuHidden.bind(this);
    this._onGridFilterButtonClick = this._onGridFilterButtonClick.bind(this);
    this._onGridColumnMenuIconClick = this._onGridColumnMenuIconClick.bind(this);
    this._onGridColumnCaptionClick = this._onGridColumnCaptionClick.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onDataContainerScroll = this._onDataContainerScroll.bind(this);
    this._onGroupCollapseExpandIconClick = this._onGroupCollapseExpandIconClick.bind(this);
    this._onGroupColumnRemoveClick = this._onGroupColumnRemoveClick.bind(this);
    this._onColumnDrop = this._onColumnDrop.bind(this);
    this._onColumnResizeEnd = this._onColumnResizeEnd.bind(this);
    this._onSelectionChange = this._onSelectionChange.bind(this);
    this.gridSelectedRows = new Array();
    this.gridSelectedCells = new Array();
    this._currentPage = 1;
    this._currentFilterField = null;
    this._currentFilterColumn = null;
    this._currentTHElement = null;
    this.dragImage = this.createElement("div");
    this.dragImage.classList.add(JW_DRAG_IMAGE);
    this.dragImage.style.display = "none";
    this.dummyDragImage = this.createElement("div");
    this._firstRun = true;
    document.body.appendChild(this.dragImage);
    //rendering grid container elements
    this._renderGridContainers();
    //initializing grid columns.
    //this.widget._initializeColumns();
    /*render the grid thead and sticky headers*/
    this._renderHeader();
    //setting column reordering, resize and grouping functionality.
    this._enableColumnDragResize();
}

//#region Object properties

//#endregion

//#region Column menu.
/**
 * Creates default column menu.
 */
jasonGridUIHelper.prototype._createColumnMenu = function () {
    this.columnMenu = new jasonMenu(this.gridHeaderTableContainer, {
        _debug: false,
        menu: this.widget.defaultGridColumnMenu,
        invokable: true,
        hideDelay: 350,
        orientation: 'vertical',
        autoHide:true,
        events: [
            { event: JW_EVENT_ON_MENU_CHECKBOX_CLICKED, listener: this._onColumnMenuItemChecked, callingContext: this },
            { event: JW_EVENT_ON_MENU_ITEM_CLICKED, listener: this._onColumnMenuItemClicked, callingContext: this },
            { event: JW_EVENT_ON_MENU_HIDDEN, listener: this._onColumnMenuHidden, callingContext: this }
        ],
    }, jasonMenuUIHelper);
    //this.columnMenu.addEventListener(JW_EVENT_ON_MENU_CHECKBOX_CLICKED, this._onColumnMenuItemChecked, this);
    //this.columnMenu.addEventListener(JW_EVENT_ON_MENU_ITEM_CLICKED, this._onColumnMenuItemClicked, this);
    //this.columnMenu.addEventListener(JW_EVENT_ON_MENU_HIDDEN, this._onColumnMenuHidden, this);
}
//#endregion

//#region Events
/**
 * Initializes event handlers.
 */
jasonGridUIHelper.prototype._initializeEvents = function () {
    this.eventManager.addEventListener(this.gridDataTable, MOUSE_DOWN_EVENT, this._onSelectionChange,true);
    this.eventManager.addEventListener(this.gridDataContainer, SCROLL_EVENT, this._onDataContainerScroll);
    window.addEventListener(RESIZE_EVENT, this._onResize);
    var self = this;
    this.eventManager.addEventListener(this.pagerButtonFirst, CLICK_EVENT, function (event) {
        self._goToPage(1, event);
        event.stopPropagation();
    });

    this.eventManager.addEventListener(this.pagerButtonPrior, CLICK_EVENT, function (event) {
        self._goToPage(self._currentPage - 1, event);
        event.stopPropagation();
    });

    this.eventManager.addEventListener(this.pagerButtonNext, CLICK_EVENT, function (event) {
        self._goToPage(self._currentPage + 1, event);
        event.stopPropagation();
    });

    this.eventManager.addEventListener(this.pagerButtonLast, CLICK_EVENT, function (event) {
        self._goToPage(self._pageCount, event);
        event.stopPropagation();
    });

    this.eventManager.addEventListener(this.pagerInput, BLUR_EVENT, function (event) {
        self._goToPage(self.pagerInput.value, event);
        event.stopPropagation();
    });

    this.eventManager.addEventListener(this.pagerInput, INPUT_EVENT, function (event) {
        self._goToPage(self.pagerInput.value, event);
        event.stopPropagation();
    });
}
/**
 * Disposing events, so GC can reclaim memory.
 */
jasonGridUIHelper.prototype._clearHeaderEvents = function () {
    for (var i = 0; i <= this.gridHeaderTableRow.children.length - 1; i++) {
        var headerElement = this.gridHeaderTableRow.children[i];
        var columnResizer = jw.common.getData(headerElement, "jwColumnResizer");
        if (columnResizer)
            columnResizer.destroy();
        var columnReorder = jw.common.getData(headerElement, "jwColumnReOrdering");
        if (columnReorder)
            columnReorder.destroy();
        jw.common.removeJWEvents(headerElement, true);
    }
}
/**
 * Executed when a jasonMenuItem checkbox is clicked. The value of the checked determines the visibility of the column.
 * @param {object} clickEvent - HTMLEvent.
 * @param {object} menuItem - jasonMenuItem that was clicked.
 * @param {boolean} checked - If false the column will be hidden.
 */
jasonGridUIHelper.prototype._onColumnMenuItemChecked = function (sender,eventData) {
    /*first try to find the corresponding column*/
    var column = this.options.columns.filter(function (col) {
        return col.fieldName == eventData.item.name;
    })[0];
    var cancel = eventData.cancel;
    if (eventData.checked)
        cancel = this.widget.showColumn(column);
    else
        cancel = this.widget.hideColumn(column);
    eventData.cancel = cancel;
    //return this._columnVisible(column, eventData.checked);
}
/**
 * Executed when a jasonMenuItem checkbox is clicked. The value of the checked determines the visibility of the column.
 * @param {object} clickEvent - HTMLEvent.
 * @param {object} menuItem - jasonMenuItem that was clicked.
 */
jasonGridUIHelper.prototype._onColumnMenuItemClicked = function (sender, eventData) {
    /*first try to find the corresponding column*/
    var columnIndex = eventData.uiHelper.invokableElement.getAttribute(GRID_COLUMN_ID_ATTR);
    if (columnIndex)
        columnIndex = parseInt(columnIndex);
    var column = this.options.columns[columnIndex];
    switch (eventData.item.name) {
        case "mnuSortAsc": {
            this.widget.sortBy(column.fieldName, "asc");
            break;
        }
        case "mnuSortDesc": {
            this.widget.sortBy(column.fieldName, "desc");
            break;
        }
        case "mnuClearSorting": {
            this.widget.dataSource.clearSorting();
            this._goToPage(this._currentPage, true);
            this.columnMenu.ui.hideMenu();
            break;
        }
        case "mnuClearFiltering": {
            this.widget.dataSource.clearFilters();
            var columnHeaders = this.gridHeaderTableRow.getElementsByTagName("th");
            for (var i = 0; i <= columnHeaders.length - 1; i++) {
                columnHeaders[i].classList.remove(GRID_FIELD_HAS_FILTER);
            }
            this._clearFilterControls();
            this._goToPage(this._currentPage, true);
            this._sizeColumns();
            this.columnMenu.ui.hideMenu();
        }
    }
}
/**
 * Executed when the grid column menu is hidden
 */
jasonGridUIHelper.prototype._onColumnMenuHidden = function () {
    this._clearFilterControls();
}
/**
 * Mananing selected row(s) based on the configuration of the grid.
 * @ignore
 * @param {event} event - DOM event
 */
jasonGridUIHelper.prototype._onSelectionChange = function (event) {
    var cellTarget = event.target;
    var targetParent = event.target;
    if (targetParent.tagName == "TABLE") return;

    while (targetParent && targetParent.tagName != "TR") {
        targetParent = targetParent.parentNode;
    }



    while (cellTarget.tagName != "TD") {
        cellTarget = cellTarget.parentNode;
    }
    if (targetParent.className.indexOf(GRID_TABLE_GROUP_ROW_CLASS) >= 0)
        return;
    var selectedRow = this.gridSelectedRows[0];
    var selectedCell = this.gridSelectedCells[0];

    if (selectedRow && this.options.multiSelect == false) {
        selectedRow.classList.remove(GRID_SELECTED_ROW_CLASS);
    }

    if (selectedCell && this.options.cellMultiSelect == false) {
        selectedCell.classList.remove(GRID_SELECTED_CELL_CLASS);
    }

    if (this.options.multiSelect == true && !event.ctrlKey) {
        this.gridSelectedRows.forEach(function (rowSelected) {
            rowSelected.classList.remove(GRID_SELECTED_ROW_CLASS);
        });
        this.gridSelectedRows = new Array();
        this.widget.selectedRows = new Array();
    }

    if (this.options.cellMultiSelect == true && !event.ctrlKey) {
        this.gridSelectedCells.forEach(function (cellSelected) {
            cellSelected.classList.remove(GRID_SELECTED_CELL_CLASS);
        });
        this.gridSelectedCells = new Array();
    }


    targetParent.classList.add(GRID_SELECTED_ROW_CLASS);
    cellTarget.classList.add(GRID_SELECTED_CELL_CLASS);
    var rowId = targetParent.getAttribute(DATA_ROW_ID_ATTR);
    if (!this.options.multiSelect) {
        this.gridSelectedRows = new Array();
        this.widget.selectedRows = new Array();
    }
    if (!this.options.cellMultiSelect) {
        this.gridSelectedCells = new Array();
    }
    this.widget.selectedRows.push(this.widget.dataSource.data[rowId]);
    this.gridSelectedRows.push(targetParent);
    this.gridSelectedCells.push(cellTarget);
    this.widget.triggerEvent(JW_EVENT_ON_SELECTION_CHANGE, this.widget.selectedRows);
}
/**
 * Grid filter click
 */
jasonGridUIHelper.prototype._onGridFilterButtonClick = function (clickEvent) {
    //this.gridFilter.ui.showFilter(filterIconElement, clickEvent);
    //clickEvent.stopPropagation();
}
/**
 * Grid column menu click
 */
jasonGridUIHelper.prototype._onGridColumnMenuIconClick = function (clickEvent) {
    clickEvent.stopPropagation();
    if (clickEvent.button == 0) {
        this._currentFilterColumn = this.options.columns[parseInt(clickEvent.currentTarget.getAttribute(GRID_COLUMN_ID_ATTR))];
        this._currentFilterField = this.options.columns[parseInt(clickEvent.currentTarget.getAttribute(GRID_COLUMN_ID_ATTR))].fieldName;
        this._currentTHElement = jasonWidgets.common.getParentElement("TH", clickEvent.currentTarget);
        //passing the icon container instead of the icon it self
        this.columnMenu.ui.showMenu(clickEvent.currentTarget.parentElement);
    }
}
/*
 * more performant way to handle resize event cals , taken from https://developer.mozilla.org/en-US/docs/Web/Events/resize
 * upon a window resize we want to resize the sticky headers, so they always align with the data table.
 */
jasonGridUIHelper.prototype._onResize = function (resizeEvent) {
    var self = this;
    if (!this.resizeTimeout) {
        this.resizeTimeout = setTimeout(function () {
            self.resizeTimeout = null;
            self._sizeColumns();
            // The actualResizeHandler will execute at a rate of 15fps
        }, 66);
    }
}
/**
 * 
 */
jasonGridUIHelper.prototype._onDataContainerScroll = function (scrollEvent) {
    this.gridHeaderTableContainer.scrollLeft = this.gridDataContainer.scrollLeft;
}
/**
 * Event handler on column title click, to sort grid data based on the field column
 */
jasonGridUIHelper.prototype._onGridColumnCaptionClick = function (clickEvent) {
    var gridColumnHeader = jw.common.getParentElement("TH", clickEvent.target);
    if (gridColumnHeader) {
        var gridColumnIndex = parseInt(gridColumnHeader.getAttribute(GRID_COLUMN_ID_ATTR));
        var sortDirection = gridColumnHeader.getAttribute(GRID_COLUMN_SORT_ATTR);
        sortDirection = !sortDirection ? "asc" : sortDirection == "asc" ? "desc" : "asc";
        gridColumnHeader.setAttribute(GRID_COLUMN_SORT_ATTR, sortDirection);
        this.widget.sortBy(this.options.columns[gridColumnIndex].fieldName, sortDirection);
        clickEvent.stopPropagation();
    }
}
/**
 * 
 */
jasonGridUIHelper.prototype._onGroupCollapseExpandIconClick = function (event) {
    var iconNode = event.target;
    var groupRow = jw.common.getParentElement("TR",iconNode);
    if (iconNode.className.indexOf("bottom") >= 0) {
        iconNode.className = "jw-icon arrow-circle-top-2x";
        groupRow.setAttribute(DATA_GROUP_EXPANDED_ATTR, "false");
        this._collapseGroup(groupRow);
    }
    else {
        iconNode.className = "jw-icon arrow-circle-bottom-2x";
        groupRow.setAttribute(DATA_GROUP_EXPANDED_ATTR, "true");
        this._expandGroup(groupRow);
    }
}
/**
 * Called when a column gets dropped on the grouping container.
 */
jasonGridUIHelper.prototype._onColumnDrop = function (event, htmlElement) {

    if (event.preventDefault)
        event.preventDefault();
    
    var elementFromPoint = document.elementFromPoint(event.clientX, event.clientY);

    if (elementFromPoint) {
        var droppedColumnField = htmlElement.getAttribute(GRID_COLUMN_FIELD_ATTR);
        var droppedColumn = this.widget._columnByField(droppedColumnField);

        if (elementFromPoint == this.gridGroupingContainer || jw.common.contains(this.gridGroupingContainer, elementFromPoint)) {
            if (droppedColumn && this.options.grouping) {
                if (droppedColumn.fieldName) {
                    var groupingExists = this.widget.dataSource.groupingExists(droppedColumn.fieldName);
                    if (droppedColumn && !groupingExists) {
                        this.widget.groupByField(droppedColumn.fieldName);
                    }
                }
            }
        }
        var parentElementFromPoint = jw.common.getParentElement("TH", elementFromPoint);
        if (parentElementFromPoint.tagName == "TH") {
            var columnFieldFromPoint = parentElementFromPoint.getAttribute(GRID_COLUMN_FIELD_ATTR);
            var columnFromPoint = this.widget._columnByField(columnFieldFromPoint);
            if (columnFromPoint.index != droppedColumn.index) {
                jw.common.swapItemsInArray(this.options.columns, droppedColumn.index, columnFromPoint.index);
                jw.common.swapDomElements(this.gridHeaderTableRow, droppedColumn.index, columnFromPoint.index);
                jw.common.swapDomElements(this.headerTableColGroup, droppedColumn.index, columnFromPoint.index);
                jw.common.swapDomElements(this.dataTableColGroup, droppedColumn.index, columnFromPoint.index);

                var droppedIndex = droppedColumn.index;
                droppedColumn.index = columnFromPoint.index;
                columnFromPoint.index = droppedIndex;



                this.renderUI();
                this.widget.triggerEvent(JW_EVENT_ON_COLUMN_POSITION_CHANGE, { column: droppedColumn, fromIndex: droppedColumn.index, toIndex: columnFromPoint.index });
            }
        }
    }
}
/**
 * Called when a column resize is ends.
 */
jasonGridUIHelper.prototype._onColumnResizeEnd = function (event, htmlElement) {
    var fieldName = htmlElement.getAttribute(GRID_COLUMN_FIELD_ATTR);
    var column = this.widget._columnByField(fieldName);
    if (column) {
        column.width = htmlElement.offsetWidth;
    }
}
/**
 * Removes grouping.
 */
jasonGridUIHelper.prototype._onGroupColumnRemoveClick = function (event) {
    var groupingContainer = jw.common.getParentElement("DIV", event.target);
    var fieldNameToRemove = groupingContainer.getAttribute(DATA_GROUPING_FIELD_ATTR);
    this.widget.removeGrouping(fieldNameToRemove);
}
//#endregion


//#region RenderUI
/**
 * Renders grid UI. Header,body,footer,pager,filter.
 */
jasonGridUIHelper.prototype.renderUI = function (recordStart,recordStop) {
    //rendering all grid container elements. Header,data,footer and grouping container
    //this._renderGridContainers();
    //this.widget._initializeColumns();
    this._calculatePageCount(this.widget.dataSource.data);

    /*render the grid thead and sticky headers*/
//    this._renderHeader();

    var fromRecord = recordStart ? recordStart : 0;
    var toRecord = recordStop ? recordStop : 0;
    if (toRecord == 0) {
        toRecord = this.widget.dataSource.data ? this.widget.dataSource.data.length : 0;
        toRecord = this.widget.options.paging && this.widget.options.paging.pagesize && toRecord > this.widget.options.paging.pagesize ? this.widget.options.paging.pagesize : toRecord;
    }

    /*actual rendering of the table body*/
    this._renderRows(fromRecord, toRecord - 1);

    this._sizeColumns();

    /*last but not least the footer*/
    this._renderFooter(toRecord);
    //var self = this;
    //setTimeout(function () {
    //    self.htmlElement.style.display = "none";
    //    setTimeout(function () {
    //        self.htmlElement.style.display = "";
    //    });
    //},5000);
}
/**
 * Creates header,data and footer containers for the grid
 */
jasonGridUIHelper.prototype._renderGridContainers = function () {
    if (!this.gridHeaderContainer) {
        this.htmlElement.classList.add(GRID_CLASS);

        this.gridHeaderContainer = this.createElement("div");
        this.gridHeaderContainer.classList.add(GRID_HEADER_CONTAINER);
        this.gridHeaderTableContainer = this.createElement("div");
        this.gridHeaderTableContainer.classList.add(GRID_HEADER_TABLE_CONTAINER);
        this.gridHeaderContainer.appendChild(this.gridHeaderTableContainer);
        if (!this.widget.options.grouping) {
            this.gridHeaderContainer.classList.add(GRID_HEADER_CONTAINER_NO_GROUPING);
        }
        this.gridDataContainer = this.createElement("div");
        this.gridDataContainer.classList.add(GRID_DATA_CONTAINER);
        this.gridFooterContainer = this.createElement("div");
        this.gridFooterContainer.classList.add(GRID_FOOTER_CONTAINER);

        //Grouping container
        if (this.options.grouping == true && !this.gridGroupingContainer) {
            this.gridGroupingContainer = this.htmlElement.appendChild(this.createElement("div"));
            this.gridGroupingContainer.classList.add(GRID_GROUPING_CONTAINER_CLASS);
            this.gridGroupingContainer.appendChild(this.createElement("span"));
        }

        this.htmlElement.appendChild(this.gridHeaderContainer);
        this.htmlElement.appendChild(this.gridDataContainer);
        this.htmlElement.appendChild(this.gridFooterContainer);
    }
}
/**
 * 
 */
jasonGridUIHelper.prototype._enableColumnDragResize = function () {
    if (this.options.reordering || this.options.grouping || this.options.resizing) {
        for (var i = 0; i <= this.gridHeaderTableRow.children.length - 1; i++) {
            var headerElement = this.gridHeaderTableRow.children[i];
            var columnDragResize = jw.common.getData(headerElement, "jwColumnDragResize");
            if (headerElement.tagName == "TH" & !columnDragResize && !headerElement.getAttribute(GRID_GROUP_FIELD)) {
                columnDragResize = new jasonDragResize(headerElement, {
                    minWidth: 50,
                    allowResize: { top: false, left: false, bottom:false, right:true },
                    allowDrag:this.options.reordering,
                    dependantElements: [this.headerTableColGroup.children[i], this.dataTableColGroup.children[i]],
                    onMoveEnd: this._onColumnDrop,
                    onResizeEnd:this._onColumnResizeEnd,
                    ghostPanelCSS: JW_DRAG_IMAGE,
                    ghostPanelContents: headerElement.querySelectorAll("." + GRID_HEADER_CELL_CAPTION_CONTAINER)[0].innerHTML
                });
                //columnReorder = new jasonGridColumnReorder(this, headerElement);
                jw.common.setData(headerElement, "jwColumnDragResize", columnDragResize);
            } else {
                if (columnDragResize) {
                    columnDragResize.options.allowDrag = this.options.reordering;
                    columnDragResize.options.allowResize = this.options.resizing ? { top: false, left: false, bottom: false, right: true } : { top: false, left: false, bottom: false, right: false };
                }
            }
        }
    } else {
        for (var i = 0; i <= this.gridHeaderTableRow.children.length - 1; i++) {
            var headerElement = this.gridHeaderTableRow.children[i];
            var columnDragResize = jw.common.getData(headerElement, "jwColumnDragResize");
            if (columnDragResize)
                columnDragResize.destroy();
        }
    }
}
/**
 * Sizing grid headers so the sticky headers and grid data headers align properly 
 */
jasonGridUIHelper.prototype._sizeColumns = function () {
    this.hasScrollBars = this.gridDataContainer.scrollHeight > this.gridHeaderContainer.parentNode.clientHeight;
    if (!this.scrollBarWidth)
        this.scrollBarWidth = jasonWidgets.common.scrollBarWidth();
    var fixedWidthColumnsTotal = this._fixedWidthColumnsSum();


    this.gridHeaderTableContainer.style.width = this.hasScrollBars ? "calc(100% - " + (this.scrollBarWidth) + "px)" : "";
    if (this.gridHeaderTableContainer.style.width == "")
        this.gridHeaderTableContainer.style.width = this.hasScrollBars ? "-webkit-calc(100% - " + (this.scrollBarWidth) + "px)" : "";

    //sync widths between the two table elements.
    if (this.gridHeaderTable.clientWidth != this.gridDataTable.clientWidth) {
        var newWidth = this.gridHeaderTable.clientWidth;// > this.gridDataTable.clientWidth ? this.gridHeaderTable.clientWidth : this.gridDataTable.clientWidth;
        this.gridHeaderTable.style.width = newWidth + "px";
        this.gridDataTable.style.width = newWidth + "px";
    }

    var oneColumnWidth = (((this.gridHeaderTableContainer.clientWidth - fixedWidthColumnsTotal) - 1) / this._columnCountWithNoFixedWidth()) - this._groupColumnsWidth();
    var headerColGroup = this.gridHeaderTable.getElementsByTagName("colgroup")[0];
    var dataTableColGroup = this.gridDataTable.getElementsByTagName("colgroup")[0];
    /*Iterating through the rendered header and adjust their widths*/
    for (var i = 0; i<= headerColGroup.children.length - 1;  i++) {
        var gridColumn = this.options.columns[i];
        var headerTableColElement = headerColGroup.children[i];
        var dataTableColElement = dataTableColGroup.children[i];
        var newWidth = "0px";
        if (gridColumn.visible) {
            if (gridColumn.width && isNaN(gridColumn.width) && gridColumn.width.indexOf("%") >= 0) {
                var widthNum = parseFloat(gridColumn.width.replace("%",""));
                gridColumn.width = (this.gridHeaderTableContainer.clientWidth * widthNum) / 100;
            }
            //setting the col group elements widths for sticky and data table columns.
            newWidth = gridColumn.width ? isNaN(gridColumn.width) ? gridColumn.width : gridColumn.width + "px" : oneColumnWidth + "px";
            headerTableColElement.style.width = newWidth;
            dataTableColElement.style.width = newWidth;
        }
    }
    /*
     * Specific Safari issue. TODO: Investigate a solution that does not require this workaround.
     * Safari has some issues rendering the grid columns/data initially.
     * The header and the data table appear to home much smaller width and the UI is broken.
     * If the htmlElement is hidden and shown then Safari renders correctly the HTML.
     */
    if (this._firstRun) {
        this._firstRun = false;
        var self = this;
        this.htmlElement.style.display = "none";
        setTimeout(function () {
            self.htmlElement.style.display = "";
        });
    }
}
/**
 * Calculating the width sum of all columns with fixed(or better put assigned) width
 */
jasonGridUIHelper.prototype._fixedWidthColumnsSum = function () {
    var result = 0;
    var onlyNumbers = new RegExp("/[^0-9.,]/g");
    var self = this;
    this.options.columns.forEach(function (gridColumn) {
        if (gridColumn.width && !gridColumn.groupColumn && gridColumn.visible) {
            var numericWidth = 0;
            if (gridColumn.width && isNaN(gridColumn.width) && gridColumn.width.indexOf("%") >= 0) {
                var widthNum = parseFloat(gridColumn.width.replace("%", ""));
                numericWidth = (self.gridHeaderTableContainer.clientWidth * widthNum) / 100;
            }
            else
                numericWidth = isNaN(gridColumn.width) ? parseFloat(gridColumn.width.replace(/\D/g, '')) : gridColumn.width;
            result = result + numericWidth;
        }
    });
    return result;
}
/**
 * Returns the columnCount with no specified width.
 */
jasonGridUIHelper.prototype._columnCountWithNoFixedWidth = function () {
    return this.options.columns.filter(function (col) { return col.width ? false : true; }).length;
}
/**
 * Returns the width sum of the group columns.
 */
jasonGridUIHelper.prototype._groupColumnsWidth = function () {
    return this.options.columns.filter(function (col) { return col.groupColumn ? true : false; }).length * 25;
}
/**
 * Renders filter UI for grid columns.
 */
jasonGridUIHelper.prototype._renderFilterUI = function () {
    var self = this;
    if (!this.filterContainer) {
        this._prepareFilterValues();
        this.filterContainer = this.createElement("div");
        this.filterContainer.className = GRID_FILTER_CONTAINER_CLASS;
        this.filterContainer.style.display = "none";
        /*filter header*/
        this.filterHeader = this.createElement("div");
        this.filterHeader.className = GRID_FILTER_HEADER_CLASS;
        this.filterHeaderTitle = this.createElement("span");
        this.filterHeaderTitle.appendChild(this.createTextNode(self.options.localization.grid.filtering.filterHeaderCaption));
        this.filterHeader.appendChild(this.filterHeaderTitle);

        /*filter body*/
        this.filterBody = this.createElement("div");
        this.filterBody.className = GRID_FILTER_BODY_CLASS;
        /*creating filter combobox containers*/
        this.firstFilterOperatorContainer = this.createElement("div");

        this.filterLogicalOperator = this.createElement("div");

        this.secondFilterOperatorContainer = this.createElement("div");

        /*creating jwComboboxes*/
        this.firstFilterCombobox = new jasonCombobox(this.firstFilterOperatorContainer, {
            data: this.filterValues,
            displayFields: ['title'],
            displayFormatString: '{0}',
            keyFieldName: 'key',
            readOnly: true,
            placeholder: this.options.localization.search.searchPlaceHolder,
            onItemSelected: null
        });
        this.secondFilterCombobox = new jasonCombobox(this.secondFilterOperatorContainer, {
            data: this.filterValues,
            displayFields: ['title'],
            displayFormatString: '{0}',
            keyFieldName: 'key',
            readOnly: true,
            placeholder: this.options.localization.search.searchPlaceHolder,
            onItemSelected: null
        });
        this.logicalOperatorCombobox = new jasonCombobox(this.filterLogicalOperator, { data: this.filterLogicalOperators, displayFields: ['title'], displayFormatString: '{0}', keyFieldName: 'Key', readOnly: true, placeHolder: this.options.localization.search.searchPlaceHolder });

        /*creating input elements*/
        this.firstFilterInputContainer = this.createElement("div");
        this.firstFilterInputContainer.className = GRID_FILTER_INPUT;
        this.firstFilterInput = jw.htmlFactory.createJWTextInput(null, this.options.localization.search.searchPlaceHolder);
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
        this.eventManager.addEventListener(this.firstFilterInput, KEY_DOWN_EVENT, inputKeyDownEvent);

        this.secondFilterInput = jw.htmlFactory.createJWTextInput(null, this.options.localization.search.searchPlaceHolder);
        this.secondFilterInputContainer = this.createElement("div");
        this.secondFilterInputContainer.className = GRID_FILTER_INPUT;
        this.secondFilterInputContainer.appendChild(this.secondFilterInput);

        this.eventManager.addEventListener(this.secondFilterInput, KEY_DOWN_EVENT, inputKeyDownEvent);

        /*adding them to the dom*/
        this.filterBody.appendChild(this.firstFilterOperatorContainer);
        this.filterBody.appendChild(this.firstFilterInputContainer);
        this.filterBody.appendChild(this.filterLogicalOperator);
        this.filterBody.appendChild(this.secondFilterOperatorContainer);
        this.filterBody.appendChild(this.secondFilterInputContainer);



        /*filter footer*/
        this.filterFooter = this.createElement("div");
        this.filterFooter.className = GRID_FILTER_FOOTER_CLASS;


        this.filterBtnApply = jw.htmlFactory.createJWButton(this.options.localization.grid.filtering.applyButtonText, JW_ICON_CIRCLE_CHECK);//this.createElement("a");
        this.filterBtnApply.classList.add(JW_GRID_FILTER_BUTTON_APPLY);

        this.eventManager.addEventListener(this.filterBtnApply, CLICK_EVENT, function (clickEvent) {
            self._applyFilter();
        },true);


        this.filterBtnClear = jw.htmlFactory.createJWButton(this.options.localization.grid.filtering.clearButtonText, JW_ICON_CIRCLE_X);//this.createElement("a");
        this.filterBtnClear.classList.add(JW_GRID_FILTER_BUTTON_CLEAR);

        this.eventManager.addEventListener(this.filterBtnClear, CLICK_EVENT, function (clickEvent) {
            self._clearFilterControls();
            self.widget.clearFilter(self._currentFilterField);
        },true);

        jwDocumentEventManager.addDocumentEventListener(MOUSE_DOWN_EVENT, function (mouseDownEvent) {
            var containerRect = self.filterContainer.getBoundingClientRect();
            var isClickOutOfContainerHorizontal = (mouseDownEvent.x > containerRect.right) || (mouseDownEvent.x < containerRect.left);
            var isClickOutOfContainerVertical = (mouseDownEvent.y > containerRect.bottom) || (mouseDownEvent.y < containerRect.top);
            var shouldHideFilter = (isClickOutOfContainerHorizontal || isClickOutOfContainerVertical) && self.filterContainer.style.display == "";
        });

        var clearFilter = this.createElement("div");
        clearFilter.classList.add(CLEAR_FLOAT_CLASS);
        this.filterFooter.appendChild(this.filterBtnClear);
        this.filterFooter.appendChild(this.filterBtnApply);
        this.filterFooter.appendChild(clearFilter);

        this.filterContainer.appendChild(this.filterHeader);
        this.filterContainer.appendChild(this.filterBody);
        this.filterContainer.appendChild(this.filterFooter);

        this._clearFilterControls();
        this.widget.htmlElement.appendChild(this.filterContainer);
    }
}
/**
 * Applies filter to grid data, based on the values of the filter UI elements.
 */
jasonGridUIHelper.prototype._applyFilter = function () {
    var filterValues = [];
    var firstFilterValue = this.firstFilterInput.value;

    if (this._currentFilterColumn.dataType)
        firstFilterValue = jasonWidgets.common.convertValue(firstFilterValue, this._currentFilterColumn.dataType);

    filterValues.push({
        value: firstFilterValue,
        filterClause: this.firstFilterCombobox.selectedItem,
        logicalOperator: this.logicalOperatorCombobox.selectedItem
    });

    var secondFilterValue = this.secondFilterInput.value;
    if (this._currentFilterColumn.dataType)
        secondFilterValue = jasonWidgets.common.convertValue(secondFilterValue, this._currentFilterColumn.dataType);
    filterValues.push({
        value: secondFilterValue,
        filterClause: this.secondFilterCombobox.selectedItem,
        logicalOperator: this.secondFilterInput.value ? this.secondFilterCombobox.selectedItem : null
    });
    this.widget.filterBy(this._currentFilterField, filterValues);
}
/**
 * Clears any applied filters.
 */
jasonGridUIHelper.prototype._clearFilterControls = function () {
    this.firstFilterCombobox.ui.hideDropDownList();
    this.secondFilterCombobox.ui.hideDropDownList();
    this.logicalOperatorCombobox.ui.hideDropDownList();
    this.firstFilterCombobox.selectItem(0);
    this.secondFilterCombobox.selectItem(0);
    this.logicalOperatorCombobox.selectItem(0);
    this.firstFilterInput.value = "";
    this.secondFilterInput.value = "";
}
/**
 * Loads filter values to filter elements
 */
jasonGridUIHelper.prototype._loadFilterValues = function (filter) {
    if (filter) {
        var fistFilterValue = filter.filterValues[0];
        if (fistFilterValue) {
            this.firstFilterCombobox.selectItem(fistFilterValue.filterClause.key);
            this.firstFilterInput.value = fistFilterValue.value;
            this.logicalOperatorCombobox.selectItem(fistFilterValue.logicalOperator.key);
        }
        var secondFilterValue = filter.filterValues[1];
        if (secondFilterValue && secondFilterValue.filterClause) {
            this.secondFilterCombobox.selectItem(secondFilterValue.filterClause.key);
            this.secondFilterInput.value = secondFilterValue.value;
        }
    }
}
/**
 * Prepares localized filter values.
 * @ignore
 */
jasonGridUIHelper.prototype._prepareFilterValues = function () {
    var self = this;
    this.filterValues = [];
    this.filterValues.push({
        title: self.options.localization.filter.values.filterValueIsEqual,
        visible: true,
        symbol: '='
    });
    this.filterValues.push({
        title: self.options.localization.filter.values.filterValueIsNotEqual,
        visible: true,
        symbol: '!='
    });
    this.filterValues.push({
        title: self.options.localization.filter.values.filterValueStartsWith,
        visible: true,
        symbol: 'startsWith'
    });
    this.filterValues.push({
        title: self.options.localization.filter.values.filterValueEndsWith,
        visible: true,
        symbol: 'endWith'
    });
    this.filterValues.push({
        title: self.options.localization.filter.values.filterValueContains,
        visible: true,
        symbol: 'contains'
    });
    this.filterValues.push({
        title: self.options.localization.filter.values.filterValueGreaterThan,
        visible: true,
        symbol: '>'
    });
    this.filterValues.push({
        title: self.options.localization.filter.values.filterValueGreaterEqualTo,
        visible: true,
        symbol: '>='
    });
    this.filterValues.push({
        title: self.options.localization.filter.values.filterValueLessThan,
        visible: true,
        symbol: '<'
    });
    this.filterValues.push({
        title: self.options.localization.filter.values.filterValueLessEqualTo,
        visible: true,
        symbol: '<='
    });
    this.filterValues.forEach(function (filterValue, filterValueIndex) { filterValue.key = filterValueIndex; });
    this.filterLogicalOperators = [];
    this.filterLogicalOperators.push({
        title: self.options.localization.filter.operators.and,
        visible: true,
        operator: 'and'
    });
    this.filterLogicalOperators.push({
        title: self.options.localization.filter.operators.or,
        visible: true,
        operator: 'or'
    });
    this.filterLogicalOperators.forEach(function (filterOperator, filterOperatorIndex) { filterOperator.key = filterOperatorIndex; });
}
/**
 * Sets visible true or
 */
jasonGridUIHelper.prototype._columnVisible = function (column, visible) {
    /*get an array of currently visible columns.*/
    var columnVisibleCount = this.options.columns.filter(function (col) { return col.visible == true; });

    /*If the visible count of the columns is > 1, then go ahead and show/hide the column.
     * However if there is only one visible column left, it cannot be hidden.
     * So the hide/show will if visible count > 1 or user is not trying to hide the last visible column.
     */
    if (column && (columnVisibleCount.length > 1 || columnVisibleCount[0].fieldName != column.fieldName)) {
        column.visible = visible;
        var displayStyle = visible ? "" : "none";

        var selectorString = 'th[' + GRID_COLUMN_FIELD_ATTR + "='" + column.fieldName + "']";

        var headerTH = this.gridHeaderTableRow.querySelectorAll(selectorString)[0];
        if (headerTH)
            headerTH.style.display = displayStyle;

        selectorString = "col[" + GRID_COLUMN_FIELD_ATTR + "='" + column.fieldName + "']";

        var headerCol = this.headerTableColGroup.querySelectorAll(selectorString)[0];
        if (headerCol)
            headerCol.style.display = displayStyle;

        var dataCol = this.dataTableColGroup.querySelectorAll("col[" + GRID_COLUMN_FIELD_ATTR + "='" + column.fieldName + "']")[0];
        if (dataCol)
            dataCol.style.display = displayStyle;
        
        var cellsToHide = document.querySelectorAll("td[jw-data-cell-id='" + column.index + "']");
        for (var i = 0; i <= cellsToHide.length - 1; i++) {
            cellsToHide[i].style.display = displayStyle;
        }
        var groupCells = this.gridDataTableBody.querySelectorAll(".group-row td");
        var colSpanValue = this.options.columns.filter(function (col) { return col.visible == true; }).length;
        for (var i = 0; i <= groupCells.length - 1; i++) {
            groupCells[i].setAttribute(COLSPAN_ATTR, colSpanValue);
        }
        //this._renderHeader();
        //this.renderUI(this._currentPage, this._pageCount);
        return false;
    }
    else
        return true;
}
//#endregion

//#region rendering - HEADER - start*/
/**
 * Renders grid header and/or grouping container , depending on configuration. 
 */
jasonGridUIHelper.prototype._renderHeader = function () {

    if (!this.gridHeaderTable) {
        //Header table
        this.gridHeaderTable = this.gridHeaderTableContainer.appendChild(this.createElement("table"));
        this.headerTableColGroup = this.gridHeaderTable.appendChild(this.createElement("colgroup"));
        var headerTHead = this.gridHeaderTable.appendChild(this.createElement("thead"));
        //Data table
        this.gridDataTable = this.gridDataContainer.appendChild(this.createElement("table"));
        this.dataTableColGroup = this.gridDataTable.appendChild(this.createElement("colgroup"));
        this.gridDataTableBody = this.gridDataTable.appendChild(this.createElement("tbody"));
        this.gridHeaderTableRow = headerTHead.appendChild(this.createElement("tr"));
    }

    if (!this.headerTableColGroup)
        this.headerTableColGroup = this.gridHeaderTable.getElementsByTagName("colgroup")[0];
    if(!this.dataTableColGroup)
        this.dataTableColGroup = this.gridDataTable.getElementsByTagName("colgroup")[0];

    this._renderHeaderColumns(this.headerTableColGroup, this.dataTableColGroup);
}
/**
 * Renders header columns.
 * @param {object} headerTableColGroup - HTMLELement
 * @param {object} dataTableColGroup   - HTMLELement
 */
jasonGridUIHelper.prototype._renderHeaderColumns = function (headerTableColGroup, dataTableColGroup) {
    this._clearHeaderEvents();
    jw.common.removeChildren(this.gridHeaderTableRow);
    jw.common.removeChildren(this.headerTableColGroup);
    jw.common.removeChildren(this.dataTableColGroup);
    var self = this;
    //this.gridHeaderTableRow.innerHTML = "";
    //headerTableColGroup.innerHTML = "";
    //dataTableColGroup.innerHTML = "";

    for (var i = 0; i <= this.options.columns.length - 1; i++) {
        gridColumn = this.options.columns[i];
        columnIndex = i
        if (gridColumn.visible) {
            //creating the col elements for the header and data table.
            var headerTableColElement = headerTableColGroup.appendChild(this.createElement("col"));
            var dataTableColElement = dataTableColGroup.appendChild(this.createElement("col"));


            //header element and caption container.
            var headerElement = this.gridHeaderTableRow.appendChild(this.createElement("th"));
            var headerCellCaptionContainer = headerElement.appendChild(this.createElement("div"));
            headerCellCaptionContainer.classList.add(GRID_HEADER_CELL_CAPTION_CONTAINER);

            var headerCellIconContainer = headerElement.appendChild(this.createElement("div"));
            headerCellIconContainer.classList.add(GRID_HEADER_CELL_ICON_CONTAINER);

            //var headerCellClearFloat = headerElement.appendChild(this.createElement("div"));
            //headerCellClearFloat.classList.add(CLEAR_FLOAT_CLASS);

            var tooltip = gridColumn.Tooltip ? gridColumn.Tooltip : gridColumn.caption;

            /*if the column is a group column then set explicit width.We do not want the grouping placeholder column to be too big*/
            if (gridColumn.groupColumn) {
                headerTableColElement.style.width = "25px";
                dataTableColElement.style.width = "25px";
            }
            else {
            headerTableColElement.setAttribute(GRID_COLUMN_FIELD_ATTR, gridColumn.fieldName);
            dataTableColElement.setAttribute(GRID_COLUMN_FIELD_ATTR, gridColumn.fieldName);
            }
            /*if the column is associated with a field.*/
            if (gridColumn.fieldName) {
                headerElement.setAttribute(GRID_COLUMN_ID_ATTR, columnIndex);
                headerElement.setAttribute(GRID_COLUMN_FIELD_ATTR, gridColumn.fieldName);
                headerElement.setAttribute(TITLE_ATTR, tooltip);
                var captionElement = headerCellCaptionContainer.appendChild(this.createElement("a"));
                captionElement.setAttribute("href", "javascript:void(0)");
                if (gridColumn.headerTemplate)
                    captionElement.innerHTML = gridColumn.headerTemplate;
                else
                    captionElement.appendChild(this.createTextNode(gridColumn.caption));
                this.eventManager.addEventListener(captionElement, CLICK_EVENT, this._onGridColumnCaptionClick, true);
                this.eventManager.addEventListener(captionElement, TOUCH_START_EVENT, function (touchEvent) {
                    //prevent default behavior and stop propagation.
                    touchEvent.preventDefault();
                    touchEvent.stopPropagation();
                    //simulating a mouse event by setting the button property to 0, which corresponds to the left mouse button.
                    touchEvent.button = 0;
                    self._onGridColumnCaptionClick(touchEvent);
                }, true);
            }
            /*Creating grid colum menu*/
            if (this.options.columnMenu == true && !gridColumn.groupColumn) {
                var gridColumnMenuIconAnchor = jw.htmlFactory.createJWButton(null,JW_ICON_MENU);
                gridColumnMenuIconAnchor.setAttribute(GRID_COLUMN_ID_ATTR, columnIndex);
                this.eventManager.addEventListener(gridColumnMenuIconAnchor, CLICK_EVENT, this._onGridColumnMenuIconClick,true);
                this.eventManager.addEventListener(gridColumnMenuIconAnchor, TOUCH_START_EVENT, function (touchEvent) {
                    //prevent default behavior and stop propagation.
                    touchEvent.preventDefault();
                    touchEvent.stopPropagation();
                    //simulating a mouse event by setting the button property to 0, which corresponds to the left mouse button.
                    touchEvent.button = 0;
                    self._onGridColumnMenuIconClick(touchEvent);
                },true);
                this.eventManager.addEventListener(gridColumnMenuIconAnchor, MOUSE_DOWN_EVENT, function (mouseEvent) { mouseEvent.stopPropagation(); }, true);
                headerCellIconContainer.appendChild(gridColumnMenuIconAnchor);
            }
            if (this.options.filtering == true && this.options.columnMenu == false) {
                var filterIconElement = this.createElement("i");
                filterIconElement.className = JW_ICON_SEARCH;
                filterIconElement.style.cssFloat = "right";
                filterIconElement.style.cursor = "pointer";
                this.eventManager.addEventListener(filterIconElement, CLICK_EVENT, this._onGridFilterButtonClick);
                headerCellIconContainer.appendChild(filterIconElement);
            }
        };
    }
}
//#endregion


//#region rendering - BODY - start*/

/**
 * Rendering rows to the grid body
 * @param {number} fromRecord 
 * @param {number} toRecord
 * @param {object} source - optional. If a source is specified then it will be used as the source of data. By default the grid's original source will be used.
 */
jasonGridUIHelper.prototype._renderRows = function (fromRecord, toRecord, source) {
    if (source === void 0) { source = null; }
    jw.common.removeChildren(this.gridDataTableBody);
    //this.gridDataTableBody.innerHTML = "";

    if (this.widget.dataSource.grouping.length > 0) {
        this._renderGroupedData(source);
    } else {
        var newRow = null;
        var newCell = null;
        var textNode = null;
        var sourceData = source ? source : this.widget.dataSource.data;
        var sourceRow = null;
        this.currentView = new Array();
        if (sourceData.length > 0) {
            for (var i = fromRecord; i <= toRecord; i++) {
                sourceRow = sourceData[i];
                sourceRow.RowIndex = i;
                this.currentView.push(sourceRow);
                newRow = this._createRowElementWithContentFromData(sourceRow);
                if (i % 2 == 0)
                    newRow.classList.add(GRID_TABLE_ALT_ROW_CLASS);
                this.gridDataTableBody.appendChild(newRow);
            }
        } else {
            this.gridDataTableBody.appendChild(this._renderNoDataRow());
        }
    }
}
/**
 * Renders an empty <TR> element when the grid has no data.
 */
jasonGridUIHelper.prototype._renderNoDataRow = function () {
    var newRow = this.createElement("tr");
    var newCell = this.createElement("td");
    newCell.setAttribute(COLSPAN_ATTR, this.options.columns.filter(function (col) { return col.visible == true;}).length);
    newCell.appendChild(this.createTextNode(this.options.localization.data.noData));
    newRow.appendChild(newCell);
    newRow.classList.add(GRID_TABLE_NO_DATA_ROW_CLASS);
    return newRow;
}
/**
 * Creates a TR element and associates it with a dataRow from the source data
 * @param {object} dataRow - Grid data row.
 */
jasonGridUIHelper.prototype._createRowElementFromData = function (dataRow) {
    var newRow = this.createElement("tr");
    newRow.setAttribute(DATA_ROW_ID_ATTR, dataRow.RowIndex);
    newRow.className = GRID_TABLE_ROW_CLASS;
    return newRow;
}
/**
 * Creates a TR element and associates it with a dataRow from the source data, and creates cells for the newly created containing data from the dataRow 
 * @param {object} dataRow - Grid data row.* 
 */
jasonGridUIHelper.prototype._createRowElementWithContentFromData = function (dataRow) {
    var newRow = this._createRowElementFromData(dataRow);
    if (this.options.customization.rowTemplate) {
        newRow.innerHTML = this.options.customization.rowTemplate;
        var dataAwareElements = newRow.querySelectorAll("*[" + this.options.customization.dataFieldAttribute + "]");
        for (var i = 0; i <= dataAwareElements.length - 1; i++) {
            var dataElement = dataAwareElements[i];
            jw.common.replaceNodeText(dataElement, dataRow[dataElement.getAttribute(this.options.customization.dataFieldAttribute)], true);
        }
    } else {
        for (var x = 0; x <= this.options.columns.length - 1; x++) {
            var column = this.options.columns[x];
            newCell = this._createCellElementFromColumn(column, dataRow);
            if (!column.visible) {
                newCell.style.display = "none";
            }
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
jasonGridUIHelper.prototype._createCellElementFromColumn = function (dataColumn, dataRow) {
    var newCell = this.createElement("td");
    if (dataColumn.groupColumn != true) {
        newCell.className = GRID_TABLE_CELL_CLASS;
        newCell.setAttribute(DATA_CELL_ID_ATTR, dataColumn.index);
        if (dataColumn.cellTemplate) {
            newCell.innerHTML = dataColumn.cellTemplate;
            var dataAwareElements = newCell.querySelectorAll("*["+ this.options.customization.dataFieldAttribute + "]");
            for (var i = 0; i <= dataAwareElements.length - 1; i++) {
                var dataElement = dataAwareElements[i];
                jw.common.replaceNodeText(dataElement, dataRow[dataElement.getAttribute(this.options.customization.dataFieldAttribute)], true);
            }
        } else {
            textNode = this.createTextNode(dataRow[dataColumn.fieldName]);
            newCell.appendChild(textNode);
        }
    }
    else
        newCell.className = "group-cell";
    return newCell;
}
/**
 * Create a TR grouping row element, with needed elements to provide expand/collapse functionality
 * @param {object} groupNode - HTMLElement
 */
jasonGridUIHelper.prototype._createGrouppingRow = function (groupNode) {
    var newRow = this.createElement("tr");
    var newCell = this.createElement("td");
    var iconNode = this.createElement("i");
    var self = this;
    iconNode.className = "jw-icon arrow-circle-bottom-2x";
    this.eventManager.addEventListener(iconNode, CLICK_EVENT, this._onGroupCollapseExpandIconClick);
    newRow.classList.add(GRID_TABLE_ROW_CLASS);
    newRow.classList.add(GRID_TABLE_GROUP_ROW_CLASS);
    newRow.setAttribute(DATA_GROUPING_LEVEL_ATTR, groupNode.level);
    newCell.setAttribute(COLSPAN_ATTR, this.options.columns.filter(function (col) { return col.visible == true; }).length);
    newCell.appendChild(iconNode);
    newCell.appendChild(this.createTextNode(groupNode.key));
    newCell.style.paddingLeft = groupNode.level * 25 + "px";
    newRow.appendChild(newCell);
    return newRow;
}

//#endregion rendering - BODY - end*/


//#region rendering - FOOTER - start*/
/**
 * Renders grid footer. Which includes Pager and record information.
 */
jasonGridUIHelper.prototype._renderFooter = function (toRecord) {
    if (this.pagerContainer)
        return;
    var textNode = null;
    this.pagerContainer = this.createElement("div");
    this.pagerContainer.classList.add(PAGER_CONTAINER_CLASS);
    this.pagerInfoContainer = this.createElement("div");
    this.pagerInfoContainer.classList.add(PAGER_CONTAINER_PAGE_INFO_CLASS);
    this.pagerInfo = this.createElement("span");
    this.pagerInfoContainer.appendChild(this.pagerInfo);
    
    this.pagerButtonFirst = jw.htmlFactory.createJWButton(this.options.localization.grid.paging.firstPageButton);
    this.pagerButtonPrior = jw.htmlFactory.createJWButton(this.options.localization.grid.paging.priorPageButton);
    this.pagerButtonLast = jw.htmlFactory.createJWButton(this.options.localization.grid.paging.nextPageButton);
    this.pagerButtonNext = jw.htmlFactory.createJWButton(this.options.localization.grid.paging.lastPageButton);
    this.pagerInput = jw.htmlFactory.createJWTextInput(null,null,null,"number");

    //this.pagerInput.style.width = "50px";
    //this.pagerInput.style.textAlign = "center";
    //this.pagerInput.setAttribute("type", "number");
    this.pagerInput.setAttribute("value", "1");
    this.pagerInput.setAttribute("min", "1");

    this.pagerContainer.appendChild(this.pagerButtonFirst);
    this.pagerContainer.appendChild(this.pagerButtonPrior);
    this.pagerContainer.appendChild(this.pagerInput);
    this.pagerContainer.appendChild(this.pagerButtonNext);
    this.pagerContainer.appendChild(this.pagerButtonLast);
    this.gridFooterContainer.appendChild(this.pagerContainer);
    this.gridFooterContainer.appendChild(this.pagerInfoContainer);
    if (this.options.paging)
        this._updatePagerInfo(0, toRecord, this.widget.dataSource.data.length);
}
/**
 * Updates current page information. e.g [1-200 of 5000]
 * @param {number} recordStart
 * @param {number} recordStop
 * @param {number} recordCount
 */
jasonGridUIHelper.prototype._updatePagerInfo = function (recordStart, recordStop, recordCount) {
    if (this.pagerInfo.childNodes.length > 0)
        this.pagerInfo.removeChild(this.pagerInfo.childNodes[0]);
    var pagerInfoText = jw.common.formatString("{0} - {1} {2} {3}", [recordStart + 1, recordStop, this.options.localization.grid.paging.pagerInfoOfRecordCount, recordCount]);
    this.pagerInfo.appendChild(this.createTextNode(pagerInfoText));
    this.pagerInfo.setAttribute(TITLE_ATTR,pagerInfoText);
}
/**
 * Calculates page count.
 * @param {array} data - grid data.
 * @ignore
 */
jasonGridUIHelper.prototype._calculatePageCount = function (data) {
    if (this.options.paging)
        this._pageCount = data.length <= this.options.paging.pagesize ? 0 : Math.ceil(data.length / this.options.paging.pagesize);
    this._pageCount = this._pageCount <= 0 ? 1 : this._pageCount;
}
/**
 * Navigates to a page.
 * @param {number} pageNumber - Page number to navigate to.
 * @param {boolean} forceAction - If true navigates to the specified page, even if it is the current page.
 * @param {HTMLEvent} event - optional.
 */
jasonGridUIHelper.prototype._goToPage = function (pageNumber, forceAction, event) {
    if (jw.common.getVariableType(pageNumber) != jw.enums.variableType.number) {
        pageNumber = parseInt(pageNumber);
        if (isNaN(pageNumber))
            return;
    }

    if (pageNumber < 1 || pageNumber > this._pageCount)
        return;
        
    if ((pageNumber != this._currentPage) || (forceAction == true)) {
        if (pageNumber < 0)
            pageNumber = 0;
        if (pageNumber > this._pageCount)
            pageNumber = this._pageCount;
        var dataToRender = this.widget.dataSource.currentDataView;
        this._calculatePageCount(this.widget.dataSource.currentDataView);
        var pageSize = this.options.paging ? this.options.paging.pagesize : dataToRender.length;
        var recordStart = (pageNumber - 1) * pageSize;
        var recordStop = recordStart + pageSize - 1;
        if (recordStop > dataToRender.length)
            recordStop = dataToRender.length - 1;
        dataToRender = this.widget.dataSource.range(recordStart, recordStop);

        this._renderRows(0, dataToRender.length - 1, dataToRender);
        if (this.options.paging) {
            this._updatePagerInfo(recordStart, recordStop + 1, this.widget.dataSource.currentDataView.length);
            this._currentPage = pageNumber;
            this.pagerInput.value = this._currentPage;
            this.widget.triggerEvent(JW_EVENT_ON_PAGE_CHANGE, pageNumber);
        }
    }
}
/**
 * 
 */
jasonGridUIHelper.prototype._refreshCurrentPage = function () {
    this._goToPage(this._currentPage, true);
}
//#endregion rendering - FOOTER - end*/

//#region Grouping data - start*/
/**
 * Collapses a group row
 * @param {HTMLElement} groupRow - tr element
 */
jasonGridUIHelper.prototype._collapseGroup = function (groupRow) {
    var self = this;
    //getting the group level from which we want to start collapsing.
    var collapseGroupLevel = parseInt(groupRow.getAttribute(DATA_GROUPING_LEVEL_ATTR));
    //iterating through the next row in the table body until the last child of under this group level.
    for (var i = groupRow.sectionRowIndex + 1; i <= this.gridDataTableBody.childNodes.length - 1; i++) {
        var currentRow = this.gridDataTableBody.childNodes[i];
        //if the row is a group row.
        if (currentRow.className.indexOf(GRID_TABLE_GROUP_ROW_CLASS) >= 0) {
            var currentRowGroupLevel = parseInt(currentRow.getAttribute(DATA_GROUPING_LEVEL_ATTR));
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
 * @param {HTMLElement} groupRow - tr element
 */
jasonGridUIHelper.prototype._expandGroup = function (groupRow) {
    var self = this;
    //getting the group level for the row we want to expand.
    var expandGroupLevel = parseInt(groupRow.getAttribute(DATA_GROUPING_LEVEL_ATTR));
    //iterating through the next row in the table body until the last child of under this group level.
    for (var i = groupRow.sectionRowIndex + 1; i <= this.gridDataTableBody.childNodes.length - 1; i++) {
        var currentRow = this.gridDataTableBody.childNodes[i];
        //if the row is a group row.
        if (currentRow.className.indexOf(GRID_TABLE_GROUP_ROW_CLASS) >= 0) {
            //the current group row expand state. Meaning if it was expanded or collapsed. 
            //this is useful when we are expanding a parent group, we want to restore the sub-groups
            //to their prior state before the parent group collapsing and hiding everything.
            var currentRowGroupExpandState = currentRow.getAttribute(DATA_GROUP_EXPANDED_ATTR);
            //current level of the group row.
            var currentRowGroupLevel = parseInt(currentRow.getAttribute(DATA_GROUPING_LEVEL_ATTR));
            if (currentRowGroupLevel > expandGroupLevel) {
                //restore visibility for the sub-group row.
                currentRow.style.display = "";
                //if the sub-group was expanded when the parent group collapsed then expand this sub-group as well.
                if (currentRowGroupExpandState == "true")
                    this._expandGroup(currentRow);
            }
            else//if we reach a group row that has the same level as our collapse we stop the iteration.
                return;
        } else {
            //the current row group level that data row belongs to.
            var currentRowGroupLevel = currentRow.getAttribute(DATA_GROUPING_LEVEL_ATTR);

            if (currentRowGroupLevel == expandGroupLevel)
                currentRow.style.display = "";
        }
    }
}
/**
 * Creates a grouping tree based on the grouping configuration the user made through the UI
 */
jasonGridUIHelper.prototype._initiliazeRenderingGroupedData = function () {
    //this._renderHeader();
    var recordStart = this.options.paging ? this._currentPage: 0;
    var recordStop = this.options.paging ? this.options.paging.pagesize : this.widget.dataSource.data.length;
    this._renderGroupedData(this.widget.dataSource.range(recordStart, recordStop));
}
/**
 * Renders group row.
 */
jasonGridUIHelper.prototype._renderGroupRow = function (groupNode) {
    var grouppingRow = this._createGrouppingRow(groupNode);
    grouppingRow.setAttribute(DATA_GROUP_EXPANDED_ATTR, "true");
    this.gridDataTableBody.appendChild(grouppingRow);
}
/**
 * Renders grouped data
 */
jasonGridUIHelper.prototype._renderGroupData = function (groupNode) {
    /*adding the groupping row*/
    this._renderGroupRow(groupNode);

    //if we are at the last grouping node render the actual data.
    for (var i = 0; i <= groupNode.values.length - 1 ; i++) {
        if (groupNode.values[i].values)
            this._renderGroupData(groupNode.values[i]);
        else {
            var newRow = this._createRowElementWithContentFromData(groupNode.values[i]);
            newRow.setAttribute(DATA_GROUPING_LEVEL_ATTR, groupNode.level);
            this.gridDataTableBody.appendChild(newRow);
        }
    }
}
/**
 * Renders grouped data requires special handling
 */
jasonGridUIHelper.prototype._renderGroupedData = function (groupedData) {
    jw.common.removeChildren(this.gridDataTableBody);
    //this.gridDataTableBody.innerHTML = "";
    var rowCounter = { count: 0 };
    for (var x = 0; x <= groupedData.length - 1; x++) {
        this._renderGroupData(groupedData[x]);
    }
}

/**
 * adds grouping UI in the group container, for a field.
 */
jasonGridUIHelper.prototype._groupByField = function (column) {
    if (column) {
        /*creating grouping elements*/
        var groupingFieldContainer = this.createElement("div");
        var groupingFieldContainerRemove = this.createElement("a");
        var groupingFieldText = this.createElement("span");
        /*setting text of the grouping container*/
        groupingFieldText.appendChild(this.createTextNode(column.caption));
        groupingFieldContainer.setAttribute(DATA_GROUPING_FIELD_ATTR, column.fieldName);

        /*setting text and tooltip to the remove grouping field anchor*/
        var iconNode = this.createElement("i");
        iconNode.className = JW_ICON_CIRCLE_X;
        groupingFieldContainerRemove.appendChild(iconNode);
        groupingFieldContainerRemove.setAttribute(TITLE_ATTR, this.options.localization.grid.grouping.removeGrouping + column.caption);

        /*constructing the DOM*/
        groupingFieldContainer.appendChild(groupingFieldText);
        groupingFieldContainer.appendChild(groupingFieldContainerRemove);
        this.gridGroupingContainer.appendChild(groupingFieldContainer);
        this.gridGroupingContainer.setAttribute(TITLE_ATTR, column.caption);

        /*setting on click event for the remove anchor*/
        this.eventManager.addEventListener(groupingFieldContainerRemove, CLICK_EVENT, this._onGroupColumnRemoveClick, true);
       
        this.gridGroupingContainer.childNodes[0].style.display = "none";
        var newGrouping = this.widget.dataSource.grouping[this.widget.dataSource.grouping.length - 1];
        this.options.columns.splice(newGrouping.level, 0, { width: "25px", groupColumn: true, visible: true, groupField: column.fieldName });
        var headerCol = this.createElement("col");
        var dataCol = this.createElement("col");
        var headerTH = this.createElement("th");
        headerCol.style.width = "25px";
        dataCol.style.width = "25px";
        headerTH.setAttribute(GRID_GROUP_FIELD, column.fieldName);
        headerCol.setAttribute(GRID_GROUP_FIELD, column.fieldName);
        dataCol.setAttribute(GRID_GROUP_FIELD, column.fieldName);
        this.headerTableColGroup.insertBefore(headerCol, this.headerTableColGroup.firstChild);
        this.dataTableColGroup.insertBefore(dataCol, this.dataTableColGroup.firstChild);
        this.gridHeaderTableRow.insertBefore(headerTH, this.gridHeaderTableRow.firstChild);

        this._initiliazeRenderingGroupedData();
        this._enableColumnDragResize();
        this._sizeColumns();
    }
}
/**
 * Get field grouping container element by field name.
 */
jasonGridUIHelper.prototype._getGroupingContainerByFieldName = function (fieldName) {
    return jw.common.getElementsByAttribute(this.gridGroupingContainer, DATA_GROUPING_FIELD_ATTR, fieldName)[0];
}

/**
 * removes grouping UI in the group container, for a field.
 * @param {string} fieldName - field name to remove grouping for.
 */
jasonGridUIHelper.prototype._removeGroupByField = function (fieldName) {
    var groupingContainerToRemove = this._getGroupingContainerByFieldName(fieldName);
    if (groupingContainerToRemove)
        this.gridGroupingContainer.removeChild(groupingContainerToRemove);
    var headerTHToRemove = this.gridHeaderTableRow.querySelectorAll("th[" + GRID_GROUP_FIELD + "='" + fieldName + "']")[0];
    if (headerTHToRemove) {
        this.gridHeaderTableRow.removeChild(headerTHToRemove);
        var colHeaderToRemove = this.headerTableColGroup.querySelectorAll("col[" + GRID_GROUP_FIELD + "='" + fieldName + "']")[0];
        if (colHeaderToRemove)
            this.headerTableColGroup.removeChild(colHeaderToRemove);
        colHeaderToRemove = this.dataTableColGroup.querySelectorAll("col[" + GRID_GROUP_FIELD + "='" + fieldName + "']")[0];
        if (colHeaderToRemove)
            this.dataTableColGroup.removeChild(colHeaderToRemove);
    }
    if (this.widget.dataSource.grouping.length == 0) {
        this._goToPage(this._currentPage, true);
        this.gridGroupingContainer.childNodes[0].style.display = "";
        //this._renderHeader();
    } else {
        this._initiliazeRenderingGroupedData();
    }
    this._enableColumnDragResize();
    this._sizeColumns();
}
//#endregion grouping data - end*/

//#region GRID MENU


jasonGridUIHelper.prototype.updateColumnSortIcon = function (sortDirection, column) {
}
jasonGridUIHelper.prototype._sortByField = function (sortDirection, fieldName) {
    var primerFunction = null;
    if (column.dataType) {
        var lowerCaseString = column.dataType.toLower();
        switch (lowerCaseString) {
            case "string": { primerFunction = null; break; }
            case "int": { primerFunction = parseInt; break; }
            case "float": { primerFunction = parseFloat; break; }
            case "datetime": { primerFunction = Date.parse; break; }
        }
    }
    var currentSorting = new jasonDataSourceSorting(column.fieldName, sortDirection != "asc", primerFunction);
    if (!this.options.sorting.multiple) {
        this.widget.dataSource.clearSorting();
    }
    this.widget.dataSource.addSorting(currentSorting);
    this.gridPager.goToPage(this.gridPager._currentPage, true);
}

//#endregion


// #region JASON GRID STRING LOCALIZATION - start*/
/**
 * Initializes localization
 * @param {object} localizationObject - Object that has localized values for various grid UI elements. Filter, grouping, column menu, etc.
 */
jasonGridUIHelper.prototype.localizeStrings = function (localizationObject) {
    if (!localizationObject)
        localizationObject = this.options.localization;
    if (this.options.grouping == true && this.gridGroupingContainer)
        this.gridGroupingContainer.childNodes[0].innerText = localizationObject.grid.grouping.groupingMessage;
    if (this.options.filtering == true) {
        for (var i = 0; i <= this.gridHeaderTableRow.childNodes.length - 1; i++) {
            var thElement = this.gridHeaderTableRow.childNodes[i];
            for (var x = 0; x <= thElement.childNodes.length - 1; x++) {
                if (thElement.childNodes[x].tagName == "I") {
                    thElement.childNodes[x].setAttribute(TITLE_ATTR, localizationObject.grid.filtering.iconTooltip);
                }
            }
        }
        if (this.filterContainer) {
            //this.filterBtnApply.replaceChild(this.createTextNode(localizationObject.grid.filtering.applyButtonText), this.filterBtnApply.childNodes[1]);
            //this.filterBtnApply.setAttribute(TITLE_ATTR, localizationObject.grid.filtering.applyButtonTooltip);

            //this.filterBtnClear.replaceChild(this.createTextNode(localizationObject.grid.filtering.clearButtonText), this.filterBtnClear.childNodes[1]);
            //this.filterBtnClear.setAttribute(TITLE_ATTR, localizationObject.grid.filtering.clearButtonToollip);
        }
    }
    if (this.options.paging) {
        this.pagerButtonFirst.innerText = localizationObject.grid.paging.firstPageButton;
        this.pagerButtonPrior.innerText = localizationObject.grid.paging.priorPageButton;
        this.pagerButtonLast.innerText = localizationObject.grid.paging.lastPageButton;
        this.pagerButtonNext.innerText = localizationObject.grid.paging.nextPageButton;
        this.pagerInput.setAttribute(TITLE_ATTR, localizationObject.grid.paging.pagerInputTooltip);
    }

    if (this.options.columnMenu) {
        this.widget.defaultGridColumnMenu.items[0].caption = localizationObject.grid.columnMenu.sortAscending;
        this.widget.defaultGridColumnMenu.items[1].caption = localizationObject.grid.columnMenu.sortDescending;
        this.widget.defaultGridColumnMenu.items[2].caption = localizationObject.grid.columnMenu.columns;
        this.widget.defaultGridColumnMenu.items[3].caption = localizationObject.grid.columnMenu.filter;
        this.widget.defaultGridColumnMenu.items.forEach(function (item) {
            item.title = item.caption;
        });
    }
}
// #endregion JASON GRID STRING LOCALIZATION - end*/
