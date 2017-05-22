jasonGridUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonGridUIHelper.prototype.constructor = jasonGridUIHelper;
    
/**
 * @constructor
 * @ignore
 */
function jasonGridUIHelper(widget, htmlElement) {
    this.resizeTimeout = null;
    this._onColumnMenuItemChecked = this._onColumnMenuItemChecked.bind(this);
    this._onColumnMenuItemClicked = this._onColumnMenuItemClicked.bind(this);
    this._onColumnMenuHidden = this._onColumnMenuHidden.bind(this);
    this._onGridFilterButtonClick = this._onGridFilterButtonClick.bind(this);
    this._onGridColumnMenuIconClick = this._onGridColumnMenuIconClick.bind(this);
    this._onGridColumnCaptionClick = this._onGridColumnCaptionClick.bind(this);
    this._onGridColumnKeyDown = this._onGridColumnKeyDown.bind(this);
    this._onGridColumnFocus = this._onGridColumnFocus.bind(this);
    this._onGridCellKeyDown = this._onGridCellKeyDown.bind(this);
    this._onGridFocus = this._onGridFocus.bind(this);
    this._onGridFooterKeyDown = this._onGridFooterKeyDown.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onDataContainerScroll = this._onDataContainerScroll.bind(this);
    this._onGroupCollapseExpandIconClick = this._onGroupCollapseExpandIconClick.bind(this);
    this._onGroupColumnRemoveClick = this._onGroupColumnRemoveClick.bind(this);
    this._onColumnDrop = this._onColumnDrop.bind(this);
    this._onMoveResizeStart = this._onMoveResizeStart.bind(this);
    this._onColumnResizeEnd = this._onColumnResizeEnd.bind(this);
    this._onSelectionChange = this._onSelectionChange.bind(this);
    this.gridSelectedRows = new Array();
    this.gridSelectedCells = new Array();
    this._currentPage = 1;
    this._currentFilterField = null;
    this._currentFilterColumn = null;
    this._currentTHElement = null;
    this._firstRun = true;
    this._gridResizer = null;
    this._gridColumnDragger = null;
    this.isReRendering = false;
    this.isColumnMoveResize = false;
    this._recordPosition = { recordStart: null, recordStop: null };
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);
}
/**
 * Customization template initialization.
 * @ignore
 */
jasonGridUIHelper.prototype.initializeTemplates = function () {
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
 * UI initialization.
 */
jasonGridUIHelper.prototype.initialize = function () {
    //rendering grid container elements
    this._renderGridContainers();
    /*render the grid thead and sticky headers*/
    this._renderHeader();

    //setting column reordering, resize and grouping functionality.
    this._enableColumnDragResize();
    jasonBaseWidgetUIHelper.prototype.initialize.call(this);
}
//#region Object properties

//#endregion

//#region Column menu.
/**
 * Creates default column menu.
 */
jasonGridUIHelper.prototype._createColumnMenu = function () {
    this.columnMenu = new jasonMenu(this.gridHeaderTableContainer, {
        _debug: this.options._debug,
        menu: this.widget.defaultGridColumnMenu,
        invokable: true,
        hideDelay: 350,
        orientation: 'vertical',
        autoHide:true,
        events: [
            { eventName: jw.DOM.events.JW_EVENT_ON_JW_MENU_CHECKBOX_CLICKED, listener: this._onColumnMenuItemChecked, callingContext: this },
            { eventName: jw.DOM.events.JW_EVENT_ON_JW_MENU_ITEM_CLICKED, listener: this._onColumnMenuItemClicked, callingContext: this },
            { eventName: jw.DOM.events.JW_EVENT_ON_HIDE, listener: this._onColumnMenuHidden, callingContext: this }
        ],
    }, jasonMenuUIHelper);
}
//#endregion

//#region Events
/**
 * Initializes event handlers.
 */
jasonGridUIHelper.prototype._initializeEvents = function () {
    this.eventManager.addEventListener(this.gridDataTable, jw.DOM.events.MOUSE_DOWN_EVENT, this._onSelectionChange,true);
    this.eventManager.addEventListener(this.gridDataContainer, jw.DOM.events.SCROLL_EVENT, this._onDataContainerScroll);
    jwWindowEventManager.addWindowEventListener("resize", this._onResize);
    //window.addEventListener(jw.DOM.events.RESIZE_EVENT, this._onResize);
    var self = this;
    this.eventManager.addEventListener(this.pagerButtonFirst, jw.DOM.events.CLICK_EVENT, function (event) {
        self._goToPage(1, event);
        event.stopPropagation();
    });

    this.eventManager.addEventListener(this.pagerButtonPrior, jw.DOM.events.CLICK_EVENT, function (event) {
        self._goToPage(self._currentPage - 1, event);
        event.stopPropagation();
    });

    this.eventManager.addEventListener(this.pagerButtonNext, jw.DOM.events.CLICK_EVENT, function (event) {
        self._goToPage(self._currentPage + 1, event);
        event.stopPropagation();
    });

    this.eventManager.addEventListener(this.pagerButtonLast, jw.DOM.events.CLICK_EVENT, function (event) {
        self._goToPage(self._pageCount, event);
        event.stopPropagation();
    });

    this.eventManager.addEventListener(this.pagerInput, jw.DOM.events.BLUR_EVENT, function (event) {
        self._goToPage(self.pagerInput.value, event);
        event.stopPropagation();
    });

    this.eventManager.addEventListener(this.pagerInput, jw.DOM.events.INPUT_EVENT, function (event) {
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
    var actionResult;
    if (eventData.checked)
        actionResult = this.widget.showColumn(column);
    else
        actionResult = this.widget.hideColumn(column);
    //if column was not shown or hidden cancel the event
    //so it will revert the checkbox to its previous state before it was clicked.
    if(!actionResult)
        eventData.cancel = true;
    //return this._columnVisible(column, eventData.checked);
}
/**
 * Executed when a jasonMenuItem checkbox is clicked. The value of the checked determines the visibility of the column.
 * @param {object} clickEvent - HTMLEvent.
 * @param {object} menuItem - jasonMenuItem that was clicked.
 */
jasonGridUIHelper.prototype._onColumnMenuItemClicked = function (sender, eventData) {
    var column = this._currentFilterColumn;
    switch (eventData.item.name) {
        case "mnuSortAsc": {
            this.widget.sortBy(column.fieldName, "asc");
            this.columnMenu.ui.hideMenu();
            break;
        }
        case "mnuSortDesc": {
            this.widget.sortBy(column.fieldName, "desc");
            this.columnMenu.ui.hideMenu();
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
                columnHeaders[i].classList.remove(jw.DOM.classes.JW_GRID_FIELD_HAS_FILTER);
            }
            this._clearFilterControls();
            this._goToPage(this._currentPage, true);
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
 * @ignore
 * Removes a cell element from the selection array and UI class.
 */
jasonGridUIHelper.prototype._manageCellSelection = function (cellElement,ctrlKey) {
    var selectedCell = this.gridSelectedCells[this.gridSelectedCells.indexOf(cellElement)];

    // if cell multi select is on and control key is NOT pressed OR if the cell multi select is off, clear all previous selections.
    if ((this.options.cellMultiSelect == true && ctrlKey == false) || !this.options.cellMultiSelect) {
        this.gridSelectedCells.forEach(function (cellSelected) {
            cellSelected.children[0].classList.remove(jw.DOM.classes.JW_GRID_SELECTED_CELL_CLASS);
            });
        this.gridSelectedCells = new Array();
    }
    if ((selectedCell && this.options.cellMultiSelect == false) || (selectedCell && this.options.cellMultiSelect == true && selectedCell.children[0].classList.contains(jw.DOM.classes.JW_GRID_SELECTED_CELL_CLASS))) {
        selectedCell.children[0].classList.remove(jw.DOM.classes.JW_GRID_SELECTED_CELL_CLASS);
    }
    else
        cellElement.children[0].classList.add(jw.DOM.classes.JW_GRID_SELECTED_CELL_CLASS);
    this.gridSelectedCells.push(cellElement);
}
/**
 * @ignore
 * Removes a cell element from the selection array and UI class.
 */
jasonGridUIHelper.prototype._manageCellFocused = function (cellElement) {
    if (this._focusedCell) {
        this._focusedCell.children[0].classList.remove(jw.DOM.classes.JW_GRID_FOCUSED_CELL_CLASS);
    }
    cellElement.children[0].classList.add(jw.DOM.classes.JW_GRID_FOCUSED_CELL_CLASS);
    this._focusedCell = cellElement;
}
/**
 * @ignore
 * Adds a cell element to the grid selection array and UI class.
 */
jasonGridUIHelper.prototype._manageRowSelection = function (rowElement, ctrlKey) {
    var selectedRow = this.gridSelectedRows[this.gridSelectedRows.indexOf(rowElement)];

    if (this.options.multiSelect == true && ctrlKey == false) {
        this.gridSelectedRows.forEach(function (rowSelected) {
            rowSelected.classList.remove(jw.DOM.classes.JW_GRID_SELECTED_ROW_CLASS);
        });
        this.gridSelectedRows = new Array();
        this.widget.selectedRows = new Array();
    }

    if (selectedRow && this.options.multiSelect == false || (selectedRow && this.options.multiSelect == true && selectedRow.classList.contains(jw.DOM.classes.JW_GRID_SELECTED_ROW_CLASS))) {
        selectedRow.classList.remove(jw.DOM.classes.JW_GRID_SELECTED_ROW_CLASS);
    }
    else
        rowElement.classList.add(jw.DOM.classes.JW_GRID_SELECTED_ROW_CLASS);
    var rowId = rowElement.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_ROW_ID_ATTR);
    if (!this.options.multiSelect) {
        this.gridSelectedRows = new Array();
        this.widget.selectedRows = new Array();
    }
    this.widget.selectedRows.push(this.widget.dataSource.data[rowId]);
    this.gridSelectedRows.push(rowElement);
}
/**
 * Managing selected row(s) based on the configuration of the grid.
 * @ignore
 * @param {event} event - DOM event
 */
jasonGridUIHelper.prototype._onSelectionChange = function (event) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var cellTarget = event.target;
    var targetParent = event.target;
    if (targetParent.tagName == "TABLE") return;

    while (targetParent && targetParent.tagName != "TR") {
        targetParent = targetParent.parentNode;
    }

    while (cellTarget.tagName != "TD") {
        cellTarget = cellTarget.parentNode;
    }
    if (targetParent.className.indexOf(jw.DOM.classes.JW_GRID_JW_TABLE_GROUP_ROW_CLASS) >= 0)
        return;
    
    this._manageRowSelection(targetParent, event.ctrlKey);
    this._manageCellSelection(cellTarget, event.ctrlKey);
    this._manageCellFocused(cellTarget);
    this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_SELECTION_CHANGE, this.widget.selectedRows);
}
/**
 * Grid filter click
 */
jasonGridUIHelper.prototype._onGridFilterButtonClick = function (clickEvent) {
    //this.gridFilter.ui.showFilter(filterIconElement, clickEvent);
    //clickEvent.stopPropagation();
}
/**
 * Handling keyboard navigation in the data table.
 */
jasonGridUIHelper.prototype._keyboardNavigateToCell = function (direction,ctrlKey) {
    var lastFocusedCell = this._focusedCell;
    var selectedCellRow = jw.common.getParentElement("tr", lastFocusedCell);
    var newCellToBeSelected = null;
    direction = direction.toLowerCase();
    switch (direction) {
        case "left": {
            newCellToBeSelected = lastFocusedCell.previousSibling;
            if (!newCellToBeSelected) {
                var previousRow = selectedCellRow.previousSibling;
                newCellToBeSelected = previousRow.childNodes[previousRow.childNodes.length - 1];
            }
            this._manageCellFocused(newCellToBeSelected);
            break;
        }
        case "up": {
            var cellIndex = lastFocusedCell.cellIndex;
            var previousRow = selectedCellRow.previousSibling;
            if (previousRow) {
                if (previousRow.classList.contains(jw.DOM.classes.JW_GRID_JW_TABLE_GROUP_ROW_CLASS)) {
                    if (previousRow.getElementsByClassName(jw.DOM.classes.JW_BUTTON)[0]) {
                        previousRow.getElementsByClassName(jw.DOM.classes.JW_BUTTON)[0].focus();
                    }
                } else {
                    newCellToBeSelected =  previousRow.children[cellIndex];
                    this._manageCellFocused(newCellToBeSelected);
                }
                
                
            }
            else {
                var headerElement = this.gridHeaderTableRow.children[cellIndex];
                if (headerElement) {
                    var captionContainer = headerElement.getElementsByClassName("jw-header-cell-caption")[0];
                    if (captionContainer) {
                        var firstAnchor = captionContainer.getElementsByTagName("a")[0];
                        if (firstAnchor)
                            firstAnchor.focus();
                    }
                }
            }
            break;
        }
        case "right": {
            var newCellToBeSelected = lastFocusedCell.nextSibling;
            if (!newCellToBeSelected) {
                var nextRow = selectedCellRow.nextSibling;
                newCellToBeSelected = nextRow.childNodes[0];
            }
            this._manageCellFocused(newCellToBeSelected);
            break;
        }
        case "down": {
            var cellIndex = lastFocusedCell.cellIndex;
            var nextRow = selectedCellRow.nextSibling;
            if (nextRow) {
                newCellToBeSelected = nextRow.classList.contains(jw.DOM.classes.JW_GRID_JW_TABLE_GROUP_ROW_CLASS) ? nextRow.getElementsByClassName(jw.DOM.classes.JW_BUTTON)[0] : nextRow.children[cellIndex];
                this._manageCellFocused(newCellToBeSelected);
            }
            break;
        }
    }
    if (newCellToBeSelected) {
        var currentVerticalScroll = this.gridDataContainer.offsetHeight + this.gridDataContainer.scrollTop;
        var currentHorizontalScroll = this.gridDataContainer.offsetWidth + this.gridDataContainer.scrollLeft;
        var cellVerticalOffsetValue = newCellToBeSelected.offsetTop + newCellToBeSelected.offsetHeight;
        var cellHorizontalOffsetValue = newCellToBeSelected.offsetLeft + newCellToBeSelected.offsetWidth;
        //if the new cell offset position is bigger than the current scroll position or the difference between them is less than the new cell height
        //then it means we need to scroll downwards.
        var needsToScrollDown = (cellVerticalOffsetValue >= currentVerticalScroll) || (Math.abs(currentVerticalScroll - cellVerticalOffsetValue) <= newCellToBeSelected.offsetHeight);

        //if the current scroll position minus the new cell offset value is more than the grid container height, 
        //OR
        //if the difference of the grid container height minus the difference between the new cell offset position and the current scroll position is less than the cell height,
        //it means that the new cell is not within the visible  are of the grid container and we need to scroll upwards 
        var needsToScrollUp = Math.abs(currentVerticalScroll - cellVerticalOffsetValue) >= this.gridDataContainer.offsetHeight ||
            (this.gridDataContainer.offsetHeight - (Math.abs(cellVerticalOffsetValue - currentVerticalScroll)) <= newCellToBeSelected.offsetHeight);

        //if the new cell offset value is larger than the current horizontal scroll or the difference between them is less than the new cell width, then
        //we need to scroll to the right.
        var needsToScrollRight = (cellHorizontalOffsetValue >= currentHorizontalScroll) || ((Math.abs(currentHorizontalScroll - cellHorizontalOffsetValue) <= newCellToBeSelected.offsetWidth));

        //if the current scroll position minus the new cell offset value is more than the grid container width, 
        //OR
        //if the difference of the grid container width minus the difference between the new cell offset position and the current scroll position is less than the cell width,
        //it means that the new cell is not within the visible  are of the grid container and we need to scroll upwards 
        var needsToScrollLeft = Math.abs(currentHorizontalScroll - cellHorizontalOffsetValue) >= this.gridDataContainer.offsetWidth ||
            (this.gridDataContainer.offsetWidth - (Math.abs(cellHorizontalOffsetValue - currentHorizontalScroll)) <= newCellToBeSelected.offsetWidth);

        if (needsToScrollDown || needsToScrollUp || needsToScrollRight || needsToScrollLeft) {

            var scrollValue;
            if (needsToScrollDown) {
                scrollValue = this.gridDataContainer.scrollTop + newCellToBeSelected.offsetHeight;
                if (Math.abs((this.gridDataContainer.offsetHeight + scrollValue) - newCellToBeSelected.offsetTop) <= newCellToBeSelected.offsetHeight)
                    scrollValue = scrollValue + newCellToBeSelected.offsetHeight;
                this.gridDataContainer.scrollTop = scrollValue;
            }
            if (needsToScrollUp) {
                scrollValue = this.gridDataContainer.scrollTop - newCellToBeSelected.offsetHeight;
                if (Math.abs((this.gridDataContainer.offsetHeight - scrollValue) - newCellToBeSelected.offsetTop) >= newCellToBeSelected.offsetHeight)
                    scrollValue = scrollValue - newCellToBeSelected.offsetHeight;
                this.gridDataContainer.scrollTop = scrollValue;
            }
            if(needsToScrollRight){
                scrollValue = this.gridDataContainer.scrollLeft + newCellToBeSelected.offsetWidth;
                if (Math.abs((this.gridDataContainer.offsetWidth - scrollValue) - newCellToBeSelected.offsetLeft) >= newCellToBeSelected.offsetWidth)
                    scrollValue = scrollValue + newCellToBeSelected.offsetWidth;
                this.gridDataContainer.scrollLeft = scrollValue;
            }

            if (needsToScrollLeft) {
                scrollValue = this.gridDataContainer.scrollLeft - newCellToBeSelected.offsetWidth;
                if (Math.abs((this.gridDataContainer.offsetWidth - scrollValue) - newCellToBeSelected.offsetLeft) >= newCellToBeSelected.offsetWidth)
                    scrollValue = scrollValue - newCellToBeSelected.offsetWidth;
                this.gridDataContainer.scrollLeft = scrollValue;
            }
            
        }
    }
}
/**
 * @ignore
 * Occurs when a key is pressed on the grid datatable element.
 */
jasonGridUIHelper.prototype._onGridCellKeyDown = function (keyDownEvent) {
    var key = keyDownEvent.keyCode || keyDownEvent.which;
    var preventDefault = true;
    switch (key) {
        case 9: { preventDefault = false; break;}
        case 37: { this._keyboardNavigateToCell("left", keyDownEvent.ctrlKey); break; }
        case 38: { this._keyboardNavigateToCell("up", keyDownEvent.ctrlKey); break; }
        case 39: { this._keyboardNavigateToCell("right", keyDownEvent.ctrlKey); break; }
        case 40: { this._keyboardNavigateToCell("down", keyDownEvent.ctrlKey); break; }
        case 32: { this._manageCellSelection(this._focusedCell, keyDownEvent.ctrlKey); break; }
        case 13: {
            if (keyDownEvent.ctrlKey)
                this._manageRowSelection(this._focusedCell.parentNode, keyDownEvent.ctrlKey);
            break;
        }
    }
    keyDownEvent.stopPropagation();
    if (preventDefault)
        keyDownEvent.preventDefault();
}
/**
 * When grid receives focus , if does not have a focused cell it sets focus to the 1st cell.
 */
jasonGridUIHelper.prototype._onGridFocus = function (focusEvent) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    if (!this._focusedCell) {
        var cellTarget = this.gridDataTableBody.children[0];
        if (cellTarget) {
            cellTarget = cellTarget.children[0];
            if (cellTarget) {
                this._manageCellSelection(cellTarget, false);
                this._manageCellFocused(cellTarget);
            }
        }
    }
}
/**
 * Grid column menu click
 */
jasonGridUIHelper.prototype._onGridColumnMenuIconClick = function (clickEvent) {
    clickEvent.stopPropagation();
    if (this.widget.readonly || !this.widget.enabled)
        return;
    if (clickEvent.button == 0) {
        this._currentTHElement = jasonWidgets.common.getParentElement("TH", clickEvent.currentTarget);
        if (this._currentTHElement) {
            this._currentFilterColumn = this.widget._columnByField(this._currentTHElement.getAttribute(jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR));
            this._currentFilterField = this._currentFilterColumn.fieldName;
            this.columnMenu.ui.hideMenu();
            //passing the icon container instead of the icon it self
            this.columnMenu.ui.showMenu(clickEvent.currentTarget.parentElement);
            this._updateFilterInputTypes();
        }
    }
}
/*
 * more per-formant way to handle resize event calls , taken from https://developer.mozilla.org/en-US/docs/Web/Events/resize
 * upon a window resize we want to resize the sticky headers, so they always align with the data table.
 */
jasonGridUIHelper.prototype._onResize = function (resizeEvent) {
    this._sizeColumns();
}
/**
 * Keeping in sync the data and header table scroll position.
 */
jasonGridUIHelper.prototype._onDataContainerScroll = function (scrollEvent) {
    this.gridHeaderTableContainer.scrollLeft = this.gridDataContainer.scrollLeft;
}
/**
 * Event handler on column title click, to sort grid data based on the field column
 */
jasonGridUIHelper.prototype._onGridColumnCaptionClick = function (event) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var gridColumnHeader = jw.common.getParentElement("TH", event.target);
    if (gridColumnHeader) {
        var key = event.keyCode || event.which;
        if((event.type == "mousedown" && event.button == 0) || (key == 32 || key == 13)){
            var gridColumnIndex = parseInt(gridColumnHeader.getAttribute(jw.DOM.attributes.JW_GRID_COLUMN_ID_ATTR));
            var sortDirection = gridColumnHeader.getAttribute(jw.DOM.attributes.JW_GRID_COLUMN_SORT_ATTR);
            sortDirection = !sortDirection ? "asc" : sortDirection == "asc" ? "desc" : "asc";
            gridColumnHeader.setAttribute(jw.DOM.attributes.JW_GRID_COLUMN_SORT_ATTR, sortDirection);
            this.widget.sortBy(this.options.columns[gridColumnIndex].fieldName, sortDirection);
            event.stopPropagation();
        }
    }
}
/**
 * Key events for grid columns.
 * If the down arrow is pressed it gives focus to the cell below the current column in the first row.
 * If the tab button is pressed and its the last element of the last column then set focus to the data table.
 */
jasonGridUIHelper.prototype._onGridColumnKeyDown = function (keyDownEvent) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var key = keyDownEvent.keyCode || keyDownEvent.which;
    switch (key) {
        case 40: {
            keyDownEvent.preventDefault();
            var gridColumnIndex = parseInt(keyDownEvent.currentTarget.getAttribute(jw.DOM.attributes.JW_GRID_COLUMN_ID_ATTR));
            if (this.gridDataTableBody.children[0] && this.gridDataTableBody.children[0].children[gridColumnIndex]) {
                this._manageCellFocused(this.gridDataTableBody.children[0].children[gridColumnIndex]);
            }
            this.gridDataTable.focus();
            break;
        }
        case 9: {
            var self = this;
            var lastColumn = keyDownEvent.currentTarget.parentNode.lastChild;
            //if its a forward tab and its the last element of the last column then we should set focus to the grid table.
            var isLastColumn = (!keyDownEvent.shiftKey) && (keyDownEvent.currentTarget == lastColumn) && (keyDownEvent.target.parentNode == lastColumn.lastChild);
            setTimeout(function () {
                self.gridDataContainer.scrollLeft = self.gridHeaderTableContainer.scrollLeft;
                if (isLastColumn)
                    self.gridDataTable.focus();
            });
            
            break;
        }
    }
}
/**
 * When the grid footer receives a keydown event, managing the focus flow between the data table and the rest elements that are focusable or have tab-index attributes.
 */
jasonGridUIHelper.prototype._onGridFooterKeyDown = function (keyDownEvent) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var key = keyDownEvent.keyCode || keyDownEvent.which;
    switch (key) {
        case 9: {
            var self = this;
            var isFirstElement = self.pagerContainer.firstChild == keyDownEvent.target;
            setTimeout(function () {
                if (isFirstElement && keyDownEvent.shiftKey)
                    self.gridDataTable.focus();
            });
            break;
        }
    }
}
/**
 * When a grid column (TH) receives focus, make sure the scrolling position of the header and data table are in sync.
 */
jasonGridUIHelper.prototype._onGridColumnFocus = function (focusEvent) {
    this.gridDataContainer.scrollLeft = this.gridHeaderTableContainer.scrollLeft;
}
/**
 * Occurs when the data grouping button is clicked.
 */
jasonGridUIHelper.prototype._onGroupCollapseExpandIconClick = function (event) {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    var iconNode = event.target.tagName == "SPAN" ? event.target : event.target.children[0];
    this._collapseExpandGroup(null, null, iconNode);
}
/**
 * Collapses, expands a data grouping by either providing the groupLevel and groupKey or directly the icon element of the data grouping button.
 */
jasonGridUIHelper.prototype._collapseExpandGroup = function (groupLevel, groupKey, groupButtonElement) {
    var groupRow = groupButtonElement == void 0 ? jw.common.getElementsByAttributes(this.gridDataTableBody, [jasonWidgets.DOM.attributes.JW_DATA_GROUPING_LEVEL_ATTR, jasonWidgets.DOM.attributes.JW_DATA_GROUPING_KEY_ATTR], [groupLevel, groupKey], "tr." + jw.DOM.classes.JW_GRID_JW_TABLE_GROUP_ROW_CLASS)[0] :
                                        jw.common.getParentElement("TR", groupButtonElement);
    groupButtonElement = groupButtonElement == void 0 ? groupRow.getElementsByTagName("SPAN")[0] : groupButtonElement.tagName == "SPAN" ?  groupButtonElement : groupButtonElement.getElementsByTagName("SPAN")[0];
    if (groupButtonElement.className.indexOf(jw.DOM.icons.CIRCLE_ARROW_UP) >= 0) {
        groupButtonElement.className = jw.DOM.icons.CIRCLE_ARROW_DOWN;
        groupRow.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUP_EXPANDED_ATTR, "false");
        this._collapseGroup(groupRow);

        this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_GROUP_COLLAPSE, groupRow.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_KEY_ATTR))
    }
    else {
        groupButtonElement.className = jw.DOM.icons.CIRCLE_ARROW_UP;
        groupRow.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUP_EXPANDED_ATTR, "true");
        this._expandGroup(groupRow);
        this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_GROUP_EXPAND, groupRow.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_KEY_ATTR))
    }
}
/**
 * Returns true the data grouping is expanded.
 */
jasonGridUIHelper.prototype._isGroupExpanded = function(groupLevel,groupKey,groupButtonElement){
    var result;
    var groupRow = groupButtonElement == void 0 ? jw.common.getElementsByAttributse(this.gridDataTableBody, [jasonWidgets.DOM.attributes.JW_DATA_GROUPING_LEVEL_ATTR, jasonWidgets.DOM.attributes.JW_DATA_GROUPING_KEY_ATTR], [groupLevel, groupKey])[0] :
                                        jw.common.getParentElement("TR", groupButtonElement);

    result = groupRow.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUP_EXPANDED_ATTR);

    return result == void 0 ? false : jw.common.strToBool(result);
}
/**
 * Called when a column gets dropped on the grouping container.
 */
jasonGridUIHelper.prototype._onColumnDrop = function (sender, columnDropData) {
    this._makeGridSelectable();
    var event = columnDropData.event;
    var htmlElement = columnDropData.column;
    if (this.widget.readonly || !this.widget.enabled)
        return;

    if (event.preventDefault)
        event.preventDefault();
    
    var elementFromPoint = document.elementFromPoint(event.clientX, event.clientY);

    if (elementFromPoint) {
        var droppedColumnField = htmlElement.getAttribute(jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR);
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
            var columnFieldFromPoint = parentElementFromPoint.getAttribute(jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR);
            var columnFromPoint = this.widget._columnByField(columnFieldFromPoint);
            if (columnFromPoint.index != droppedColumn.index) {
                this.moveColumn(droppedColumn, columnFromPoint.index);
            }
        }
    }
    this.isColumnMoveResize = false;
}
/***
 * Called when a column starts moving or resizes.
 */
jasonGridUIHelper.prototype._onMoveResizeStart = function (event, htmlElement) {
    this.isColumnMoveResize = true;
}
/**
 * Moves column to a new position.
 */
jasonGridUIHelper.prototype.moveColumn = function (column, newIndex) {
    /**
     * We are adding the grouping length to the indexes, to account for the dynamically created
     * TH and COL elements created for each grouping level. 
     * Column indexes stay the same regardless of the grouping level, that's why we need to do this.
     */
    var groupingLength = this.widget.dataSource.grouping.length;
    jw.common.moveItemsInArray(this.options.columns, column.index + groupingLength, newIndex + groupingLength);
    jw.common.moveDomElements(this.gridHeaderTableRow, column.index + groupingLength, newIndex + groupingLength);
    jw.common.moveDomElements(this.headerTableColGroup, column.index + groupingLength, newIndex + groupingLength);
    jw.common.moveDomElements(this.dataTableColGroup, column.index + groupingLength, newIndex + groupingLength);

    this._refreshCurrentView();
    this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_COLUMN_POSITION_CHANGE, { column: column, fromIndex: column.index + groupingLength, toIndex: newIndex + groupingLength });
}
/**
 * Called when a column resize is ends.
 */
jasonGridUIHelper.prototype._onColumnResizeEnd = function (event, htmlElement) {
    var fieldName = htmlElement.getAttribute(jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR);
    var column = this.widget._columnByField(fieldName);
    if (column) {
        column.width = htmlElement.offsetWidth;
    }
    this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_COLUMN_RESIZED, { column: column, newWidth: column.width });
    this.isColumnMoveResize = false;
}
/**
 * Removes grouping.
 */
jasonGridUIHelper.prototype._onGroupColumnRemoveClick = function (event) {
    var groupingContainer = jw.common.getParentElement("DIV", event.target);
    var fieldNameToRemove = groupingContainer.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_FIELD_ATTR);
    this.widget.removeGrouping(fieldNameToRemove);
}
//#endregion


//#region RenderUI
/**
 * Renders grid UI. Header,body,footer,pager,filter.
 */
jasonGridUIHelper.prototype.renderUI = function (recordStart,recordStop) {
    this._calculatePageCount(this.widget.dataSource.data);

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

    var calcHeightDiff = 35;
    if (this.options.grouping)
        calcHeightDiff = calcHeightDiff + 35;
    if(this.options.paging)
        calcHeightDiff = calcHeightDiff + 35;
    this.gridDataContainer.style.height = jw.common.formatString("calc(100% - {0}px", [calcHeightDiff]);
    if (this.gridDataContainer.style.height == "")
        this.gridDataContainer.style.height = jw.common.formatString("calc(100% - {0}px", [calcHeightDiff]);
}
/**
 * Creates header,data and footer containers for the grid
 */
jasonGridUIHelper.prototype._renderGridContainers = function () {
    if (!this.gridHeaderContainer) {
        this.htmlElement.classList.add(jw.DOM.classes.JW_GRID_CLASS);

        this.gridHeaderContainer = this.createElement("div");
        this.gridHeaderContainer.classList.add(jw.DOM.classes.JW_GRID_HEADER_CONTAINER);
        this.gridHeaderTableContainer = this.createElement("div");
        this.gridHeaderTableContainer.classList.add(jw.DOM.classes.JW_GRID_HEADER_JW_TABLE_CONTAINER);
        this.gridHeaderContainer.appendChild(this.gridHeaderTableContainer);
        if (!this.widget.options.grouping) {
            this.gridHeaderContainer.classList.add(jw.DOM.classes.JW_GRID_HEADER_CONTAINER_NO_GROUPING);
        }
        this.gridDataContainer = this.createElement("div");
        this.gridDataContainer.classList.add(jw.DOM.classes.JW_GRID_DATA_CONTAINER);
        this.gridFooterContainer = this.createElement("div");
        this.gridFooterContainer.classList.add(jw.DOM.classes.JW_GRID_FOOTER_CONTAINER);
        this.eventManager.addEventListener(this.gridFooterContainer, jw.DOM.events.KEY_DOWN_EVENT, this._onGridFooterKeyDown, true);

        //Grouping container
        if (this.options.grouping == true && !this.gridGroupingContainer) {
            this.gridGroupingContainer = this.htmlElement.appendChild(this.createElement("div"));
            this.gridGroupingContainer.classList.add(jw.DOM.classes.JW_GRID_GROUPING_CONTAINER_CLASS);
            var groupingMessage = this.createElement("span");
            groupingMessage.classList.add(jw.DOM.classes.JW_GRID_GROUPING_MESSAGE);
            this.gridGroupingContainer.appendChild(groupingMessage);
        }

        this.htmlElement.appendChild(this.gridHeaderContainer);
        this.htmlElement.appendChild(this.gridDataContainer);
        this.htmlElement.appendChild(this.gridFooterContainer);
    }
}
/**
 * Makes the whole grid unselectable.
 */
jasonGridUIHelper.prototype._makeGridUnselectable = function () {
    this.htmlElement.classList.add(jw.DOM.classes.JW_GRID_UNSELECTABLE);
}
/**
 * Makes the whole grid selectable.
 */
jasonGridUIHelper.prototype._makeGridSelectable = function () {
    this.htmlElement.classList.remove(jw.DOM.classes.JW_GRID_UNSELECTABLE);
}
/**
 * Enables move/resize on grid columns based on the configuration options.
 */
jasonGridUIHelper.prototype._enableColumnDragResize = function () {
    if (this.options.reordering || this.options.grouping || this.options.resizing) {
        this._gridResizer = new jasonGridResizer(this.widget, {
            events: [
                {
                    eventName: jw.DOM.events.JW_EVENT_ON_ELEMENT_RESIZING,
                    listener: this._makeGridUnselectable.bind(this)
                },
                {
                    eventName: jw.DOM.events.JW_EVENT_ON_ELEMENT_RESIZED,
                    listener: this._makeGridSelectable.bind(this)
                }
            ]
        });
        this._gridColumnDragger = new jasonGridColumnDragger(this.widget, {
            events: [
                {
                    eventName: jw.DOM.events.DRAG_START_EVENT,
                    listener: this._makeGridUnselectable.bind(this)
                },
                {
                    eventName: jw.DOM.events.DRAG_OVER_EVENT,
                    listener: this._onColumnDrop
                }
            ],changeCursor:false
        });
    } else {
        if (this._gridResizer) {
            this._gridResizer.destroy();
            this._gridResizer = null;
        }
        if (this._gridColumnDragger) {
            this._gridColumnDragger.destroy();
            this._gridColumnDragger = null;
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
        var newWidth = this.gridHeaderTableContainer.clientWidth;// > this.gridDataTable.clientWidth ? this.gridHeaderTable.clientWidth : this.gridDataTable.clientWidth;
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
    if (window.navigator.vendor.indexOf("Apple")>=0) {
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
 * Renders different filter editors based on the column data type.
 */
jasonGridUIHelper.prototype._updateFilterInputTypes = function () {
    if (this._currentFilterColumn) {
        this._prepareFilterValues(this._currentFilterColumn.dataType);
        this.firstFilterCombobox.dataSource.setData(this.filterValues);
        this.secondFilterCombobox.dataSource.setData(this.filterValues);
        jw.common.removeChildren(this.firstFilterInputContainer);
        jw.common.removeChildren(this.secondFilterInputContainer);
        this.firstFilterInputContainer.className = jw.DOM.classes.JW_GRID_FILTER_INPUT;
        this.secondFilterInputContainer.className = jw.DOM.classes.JW_GRID_FILTER_INPUT;
        switch (this._currentFilterColumn.dataType) {
            case jw.enums.dataType.string: {
                this.firstFilterInput  = new jasonTextbox(this.firstFilterInputContainer, { placeholder: this.options.localization.search.searchPlaceHolder });
                this.secondFilterInput = new jasonTextbox(this.secondFilterInputContainer, { placeholder: this.options.localization.search.searchPlaceHolder });
                break;
            }
            case jw.enums.dataType.number: {
                this.firstFilterInput = new jasonNumericTextbox(this.firstFilterInputContainer, { placeholder: this.options.localization.search.searchPlaceHolder });
                this.secondFilterInput = new jasonNumericTextbox(this.secondFilterInputContainer, { placeholder: this.options.localization.search.searchPlaceHolder });
                break;
            }
            case jw.enums.dataType.integer: {
                this.firstFilterInput = new jasonNumericTextbox(this.firstFilterInputContainer, { placeholder: this.options.localization.search.searchPlaceHolder, minimumFractionDigits: 0 });
                this.secondFilterInput = new jasonNumericTextbox(this.secondFilterInputContainer, { placeholder: this.options.localization.search.searchPlaceHolder, minimumFractionDigits: 0 });
                break;
            }
            case jw.enums.dataType.currency: {
                this.firstFilterInput = new jasonNumericTextbox(this.firstFilterInputContainer, { placeholder: this.options.localization.search.searchPlaceHolder, style: 'currency' });
                this.secondFilterInput = new jasonNumericTextbox(this.secondFilterInputContainer, { placeholder: this.options.localization.search.searchPlaceHolder, style: 'currency' });
                break;
            }
            case jw.enums.dataType.date: {
                this.firstFilterInput = new jasonDatePicker(this.firstFilterInputContainer, { placeholder: this.options.localization.search.searchPlaceHolder });
                this.secondFilterInput = new jasonDatePicker(this.secondFilterInputContainer, { placeholder: this.options.localization.search.searchPlaceHolder });
                break;
            }
        }
    }
}
/**
 * Renders filter UI for grid columns.
 */
jasonGridUIHelper.prototype._renderFilterUI = function () {
    var self = this;
    if (!this.filterContainer) {
        this._prepareFilterValues(jw.enums.dataType.string);
        this.filterContainer = this.createElement("div");
        this.filterContainer.className = jw.DOM.classes.JW_GRID_FILTER_CONTAINER_CLASS;
        this.filterContainer.style.display = "none";
        /*filter header*/
        this.filterHeader = this.createElement("div");
        this.filterHeader.className = jw.DOM.classes.JW_GRID_FILTER_HEADER_CLASS;
        this.filterHeaderTitle = this.createElement("span");
        this.filterHeaderTitle.appendChild(this.createTextNode(self.options.localization.grid.filtering.filterHeaderCaption));
        this.filterHeader.appendChild(this.filterHeaderTitle);

        /*filter body*/
        this.filterBody = this.createElement("div");
        this.filterBody.className = jw.DOM.classes.JW_GRID_FILTER_BODY_CLASS;
        /*creating filter combobox containers*/
        this.firstFilterOperatorContainer = this.createElement("div");

        this.filterLogicalOperator = this.createElement("div");

        this.secondFilterOperatorContainer = this.createElement("div");

        /*creating jwComboboxes*/
        this.firstFilterCombobox = new jasonCombobox(this.firstFilterOperatorContainer, {
            data: this.filterValues,
            displayFields: ['title'],
            displayFormat: '{0}',
            keyFieldName: 'key',
            readonly: true,
            dropDownList:true,
            placeholder: this.options.localization.search.searchPlaceHolder
        });
        this.secondFilterCombobox = new jasonCombobox(this.secondFilterOperatorContainer, {
            data: this.filterValues,
            displayFields: ['title'],
            displayFormat: '{0}',
            keyFieldName: 'key',
            readonly: true,
            dropDownList: true,
            placeholder: this.options.localization.search.searchPlaceHolder
        });
        this.logicalOperatorCombobox = new jasonCombobox(this.filterLogicalOperator,
            { data: this.filterLogicalOperators, 
            displayFields: ['title'],
            displayFormat: '{0}', 
            keyFieldName: 'Key', 
            readonly: true, 
            placeHolder: this.options.localization.search.searchPlaceHolder,
            dropDownList:true
            });

        /*creating input elements*/
        this.firstFilterInputContainer = this.createElement("div");
        this.firstFilterInputContainer.className = jw.DOM.classes.JW_GRID_FILTER_INPUT;
        //this.firstFilterInput = jw.htmlFactory.createJWTextInput(null, this.options.localization.search.searchPlaceHolder);
        //this.firstFilterInputContainer.appendChild(this.firstFilterInput);
        //var inputKeyDownEvent = function (keyDownEvent) {
        //    var key = keyDownEvent.keyCode || keyDownEvent.which;
        //    switch (key) {
        //        case 13: {
        //            self.filterBtnApply.click();
        //            break;
        //        }
        //    }
        //}
        //this.eventManager.addEventListener(this.firstFilterInput, jw.DOM.events.KEY_DOWN_EVENT, inputKeyDownEvent);

        //this.secondFilterInput = jw.htmlFactory.createJWTextInput(null, this.options.localization.search.searchPlaceHolder);
        this.secondFilterInputContainer = this.createElement("div");
        this.secondFilterInputContainer.className = jw.DOM.classes.JW_GRID_FILTER_INPUT;
        //this.secondFilterInputContainer.appendChild(this.secondFilterInput);

        //this.eventManager.addEventListener(this.secondFilterInput, jw.DOM.events.KEY_DOWN_EVENT, inputKeyDownEvent);

        /*adding them to the dom*/
        this.filterBody.appendChild(this.firstFilterOperatorContainer);
        this.filterBody.appendChild(this.firstFilterInputContainer);
        this.filterBody.appendChild(this.filterLogicalOperator);
        this.filterBody.appendChild(this.secondFilterOperatorContainer);
        this.filterBody.appendChild(this.secondFilterInputContainer);



        /*filter footer*/
        this.filterFooter = this.createElement("div");
        this.filterFooter.className = jw.DOM.classes.JW_GRID_FILTER_FOOTER_CLASS;


        this.filterBtnApply = jw.htmlFactory.createJWButton(this.options.localization.grid.filtering.applyButtonText, jw.DOM.icons.CIRCLE_CHOOSE);//this.createElement("a");
        this.filterBtnApply.classList.add(jw.DOM.classes.JW_JW_GRID_FILTER_BUTTON_APPLY);
        this.filterBtnApply.classList.add(jw.DOM.classes.JW_BUTTON_STANDALONE);

        this.eventManager.addEventListener(this.filterBtnApply, jw.DOM.events.CLICK_EVENT, function (clickEvent) {
            self._applyFilter();
        },true);


        this.filterBtnClear = jw.htmlFactory.createJWButton(this.options.localization.grid.filtering.clearButtonText, jw.DOM.icons.CLOSE);//this.createElement("a");
        this.filterBtnClear.classList.add(jw.DOM.classes.JW_JW_GRID_FILTER_BUTTON_CLEAR);
        this.filterBtnClear.classList.add(jw.DOM.classes.JW_BUTTON_STANDALONE);

        this.eventManager.addEventListener(this.filterBtnClear, jw.DOM.events.CLICK_EVENT, function (clickEvent) {
            self._clearFilterControls();
            self.widget.clearFilter(self._currentFilterField);
        },true);

        jwDocumentEventManager.addDocumentEventListener(jw.DOM.events.MOUSE_DOWN_EVENT, function (mouseDownEvent) {
            var containerRect = self.filterContainer.getBoundingClientRect();
            var isClickOutOfContainerHorizontal = (mouseDownEvent.x > containerRect.right) || (mouseDownEvent.x < containerRect.left);
            var isClickOutOfContainerVertical = (mouseDownEvent.y > containerRect.bottom) || (mouseDownEvent.y < containerRect.top);
            var shouldHideFilter = (isClickOutOfContainerHorizontal || isClickOutOfContainerVertical) && self.filterContainer.style.display == "";
        });

        var clearFilter = this.createElement("div");
        clearFilter.classList.add(jw.DOM.classes.JW_CLEAR_FLOAT_CLASS);
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

    if (firstFilterValue) {
        if(typeof firstFilterValue == "string")
            firstFilterValue = firstFilterValue.trim().length == 0 ? undefined : firstFilterValue;
        if (this._currentFilterColumn.dataType)
            firstFilterValue = jasonWidgets.common.convertValue(firstFilterValue, this._currentFilterColumn.dataType);

        filterValues.push({
            value: firstFilterValue,
            filterClause: this.firstFilterCombobox.value,
            logicalOperator: this.logicalOperatorCombobox.value
        });
    }

    secondFilterValue = this.secondFilterInput.value;

    if (secondFilterValue) {
        if (typeof secondFilterValue == "string")
            secondFilterValue = secondFilterValue.trim().length == 0 ? undefined : secondFilterValue;

        if (this._currentFilterColumn.dataType)
            secondFilterValue = jasonWidgets.common.convertValue(secondFilterValue, this._currentFilterColumn.dataType);
        filterValues.push({
            value: secondFilterValue,
            filterClause: secondFilterValue == void 0 ? null : this.secondFilterCombobox.value,
            logicalOperator: this.secondFilterInput.value ? this.secondFilterCombobox.value : null
        });
    }
    if (filterValues.length > 0)
        this.widget.filterBy(this._currentFilterField, filterValues);
    else
        this.widget.clearFilter(this._currentFilterField);
}
/**
 * Clears any applied filters.
 */
jasonGridUIHelper.prototype._clearFilterControls = function () {
    this.firstFilterCombobox.ui.hideList();
    this.secondFilterCombobox.ui.hideList();
    this.logicalOperatorCombobox.ui.hideList();
    this.firstFilterCombobox.selectItem(0);
    this.secondFilterCombobox.selectItem(0);
    this.logicalOperatorCombobox.selectItem(0);
    //this.firstFilterInput.value = "";
    //this.secondFilterInput.value = "";
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
jasonGridUIHelper.prototype._prepareFilterValues = function (fieldDataType) {
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
    if (fieldDataType == jw.enums.dataType.string) {
        this.filterValues.push({
            title: self.options.localization.filter.values.filterValueStartsWith,
            visible: true,
            symbol: 'startsWith'
        });

        this.filterValues.push({
            title: self.options.localization.filter.values.filterValueEndsWith,
            visible: true,
            symbol: 'endsWith'
        });
        this.filterValues.push({
            title: self.options.localization.filter.values.filterValueContains,
            visible: true,
            symbol: 'contains'
        });
    }
    if (fieldDataType != jw.enums.dataType.string) {
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
    }
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

        var selectorString = 'th[' + jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR + "='" + column.fieldName + "']";

        var headerTH = this.gridHeaderTableRow.querySelectorAll(selectorString)[0];
        if (headerTH)
            headerTH.style.display = displayStyle;

        selectorString = "col[" + jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR + "='" + column.fieldName + "']";

        var headerCol = this.headerTableColGroup.querySelectorAll(selectorString)[0];
        if (headerCol)
            headerCol.style.display = displayStyle;

        var dataCol = this.dataTableColGroup.querySelectorAll("col[" + jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR + "='" + column.fieldName + "']")[0];
        if (dataCol)
            dataCol.style.display = displayStyle;
        
        var cellsToHide = document.querySelectorAll("td[" + jw.DOM.attributes.JW_DATA_CELL_ID_ATTR + "='" + column.index + "']");
        for (var i = 0; i <= cellsToHide.length - 1; i++) {
            cellsToHide[i].style.display = displayStyle;
        }
        var groupCells = this.gridDataTableBody.querySelectorAll(".group-row td");
        var colSpanValue = this.options.columns.filter(function (col) { return col.visible == true; }).length;
        for (var i = 0; i <= groupCells.length - 1; i++) {
            groupCells[i].setAttribute(jasonWidgets.DOM.attributes.COLSPAN_ATTR, colSpanValue);
        }
        return true;
    }
    else
        return false;
}
/**
 * Re-renders current data view taking into account paging.
 */
jasonGridUIHelper.prototype._refreshCurrentView = function () {
    var dataToRender = this.widget.dataSource.currentDataView;
    this._calculatePageCount(this.widget.dataSource.currentDataView);
    var pageSize = this.options.paging ? this.options.paging.pagesize : dataToRender.length;
    var recordStart = (this._currentPage - 1) * pageSize;
    var recordStop = recordStart + pageSize - 1;
    if (recordStop > dataToRender.length)
        recordStop = dataToRender.length - 1;
    dataToRender = this.widget.dataSource.range(recordStart, recordStop);
    this._recordPosition.recordStart = recordStart;
    this._recordPosition.recordStop = recordStop;
    this._renderRows(0, dataToRender.length - 1, dataToRender);
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
        //this.gridHeaderTable.setAttribute(jasonWidgets.DOM.attributes.TABINDEX_ATTR, jw.common.getNextTabIndex());
        //by setting the tab-index attribute, the table element can receive keyboard events.
        this.gridDataTable.setAttribute(jasonWidgets.DOM.attributes.TABINDEX_ATTR, -1);
        this.eventManager.addEventListener(this.gridDataTable, jw.DOM.events.KEY_DOWN_EVENT, this._onGridCellKeyDown, true);
        this.eventManager.addEventListener(this.gridDataTable, jw.DOM.events.FOCUS_EVENT, this._onGridFocus, true);
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
            headerCellCaptionContainer.classList.add(jw.DOM.classes.JW_GRID_HEADER_CELL_CAPTION_CONTAINER);

            var headerCellIconContainer = headerElement.appendChild(this.createElement("div"));
            headerCellIconContainer.classList.add(jw.DOM.classes.JW_GRID_HEADER_CELL_ICON_CONTAINER);

            this.eventManager.addEventListener(headerElement, jw.DOM.events.KEY_DOWN_EVENT, this._onGridColumnKeyDown, true);
            this.eventManager.addEventListener(headerElement, jw.DOM.events.FOCUS_EVENT, this._onGridColumnFocus, true, true);
            //var headerCellClearFloat = headerElement.appendChild(this.createElement("div"));
            //headerCellClearFloat.classList.add(JW_CLEAR_FLOAT_CLASS);

            var tooltip = gridColumn.Tooltip ? gridColumn.Tooltip : gridColumn.caption;

            /*if the column is a group column then set explicit width.We do not want the grouping placeholder column to be too big*/
            if (gridColumn.groupColumn) {
                headerTableColElement.style.width = "25px";
                dataTableColElement.style.width = "25px";
            }
            else {
                headerTableColElement.setAttribute(jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR, gridColumn.fieldName);
                dataTableColElement.setAttribute(jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR, gridColumn.fieldName);
            }
            /*if the column is associated with a field.*/
            if (gridColumn.fieldName) {
                headerElement.setAttribute(jw.DOM.attributes.JW_GRID_COLUMN_ID_ATTR, columnIndex);
                headerElement.setAttribute(jw.DOM.attributes.JW_GRID_COLUMN_FIELD_ATTR, gridColumn.fieldName);
                headerElement.setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR, tooltip);
                var captionElement = headerCellCaptionContainer.appendChild(jw.htmlFactory.createJWLinkLabel(gridColumn.caption));
                captionElement.setAttribute(jw.DOM.attributes.HREF_ATTR, "javascript:void(0)");
                captionElement.setAttribute(jw.DOM.attributes.DRAGGABLE_ATTR, "false");
                if (gridColumn.headerTemplate)
                    captionElement.innerHTML = gridColumn.headerTemplate;
                
                this.eventManager.addEventListener(captionElement, jw.DOM.events.MOUSE_DOWN_EVENT, this._onGridColumnCaptionClick, true);
                this.eventManager.addEventListener(captionElement, jw.DOM.events.KEY_DOWN_EVENT, this._onGridColumnCaptionClick, true);
                this.eventManager.addEventListener(captionElement, jw.DOM.events.TOUCH_START_EVENT, function (touchEvent) {
                    //prevent default behavior and stop propagation.
                    touchEvent.preventDefault();
                    touchEvent.stopPropagation();
                    //simulating a mouse event by setting the button property to 0, which corresponds to the left mouse button.
                    touchEvent.button = 0;
                    self._onGridColumnCaptionClick(touchEvent);
                }, true);
            }
            /*Creating grid column menu*/
            if (this.options.columnMenu == true && !gridColumn.groupColumn) {
                var gridColumnMenuIconAnchor = jw.htmlFactory.createJWButton(null, jw.DOM.icons.LIST);
                gridColumnMenuIconAnchor.setAttribute(jw.DOM.attributes.JW_GRID_COLUMN_ID_ATTR, columnIndex);
                this.eventManager.addEventListener(gridColumnMenuIconAnchor, jw.DOM.events.CLICK_EVENT, this._onGridColumnMenuIconClick,true);
                this.eventManager.addEventListener(gridColumnMenuIconAnchor, jw.DOM.events.TOUCH_START_EVENT, function (touchEvent) {
                    //prevent default behavior and stop propagation.
                    touchEvent.preventDefault();
                    touchEvent.stopPropagation();
                    //simulating a mouse event by setting the button property to 0, which corresponds to the left mouse button.
                    touchEvent.button = 0;
                    self._onGridColumnMenuIconClick(touchEvent);
                },true);
                this.eventManager.addEventListener(gridColumnMenuIconAnchor, jw.DOM.events.MOUSE_DOWN_EVENT, function (mouseEvent) { mouseEvent.stopPropagation(); }, true);
                headerCellIconContainer.appendChild(gridColumnMenuIconAnchor);
                //headerCellIconContainer.setAttribute(JW_GRID_COLUMN_ID_ATTR, columnIndex);
            }
            if (this.options.filtering == true && this.options.columnMenu == false) {
                var filterIconElement = this.createElement("i");
                filterIconElement.className = jw.DOM.icons.SEARCH;
                filterIconElement.style.cssFloat = "right";
                filterIconElement.style.cursor = "pointer";
                this.eventManager.addEventListener(filterIconElement, jw.DOM.events.CLICK_EVENT, this._onGridFilterButtonClick);
                headerCellIconContainer.appendChild(filterIconElement);
            }
        };
    }
}
/**
 * Updates UI when enable/disable state is changed.
 * @abstract
 */
jasonGridUIHelper.prototype.updateEnabled = function (enable) {
    jasonBaseWidgetUIHelper.prototype.updateEnabled.call(this, enable);
    var buttons = this.htmlElement.getElementsByTagName("a");
    for (var i = 0; i <= buttons.length - 1; i++) {
        if (enable) {
            buttons[i].removeAttribute(jw.DOM.attributes.DISABLED_ATTR)
            buttons[i].classList.remove(jw.DOM.classes.JW_DISABLED);
        }
        else {
            buttons[i].setAttribute(jw.DOM.attributes.DISABLED_ATTR, true);
            buttons[i].classList.add(jw.DOM.classes.JW_DISABLED);
        }
    }
    var inputs = this.htmlElement.getElementsByTagName("input");
    for (var i = 0; i <= inputs.length - 1; i++) {
        if (enable) {
            inputs[i].removeAttribute(jw.DOM.attributes.DISABLED_ATTR)
            inputs[i].classList.remove(jw.DOM.classes.JW_DISABLED);
        }
        else {
            inputs[i].setAttribute(jw.DOM.attributes.DISABLED_ATTR, true);
            inputs[i].classList.add(jw.DOM.classes.JW_DISABLED);
        }
    }
}
/**
 * Updates UI when visible state is changed.
 * @abstract
 */
jasonGridUIHelper.prototype.updateVisible = function (visible) {
    jasonBaseWidgetUIHelper.prototype.updateVisible.call(this, visible);
}
/**
 * Updates UI when read-only state is changed.
 * @abstract
 */
jasonGridUIHelper.prototype.updateReadOnly = function (readonly) {
    jasonBaseWidgetUIHelper.prototype.updateReadOnly.call(this, readonly);
    var buttons = this.htmlElement.getElementsByTagName("a");
    for (var i = 0; i <= buttons.length - 1; i++) {
        if (readonly) {
            buttons[i].removeAttribute(jw.DOM.attributes.READONLY_ATTR)
            buttons[i].classList.remove(jw.DOM.classes.JW_READONLY);
        }
        else {
            buttons[i].setAttribute(jw.DOM.attributes.READONLY_ATTR, true);
            buttons[i].classList.add(jw.DOM.classes.JW_READONLY);
        }
    }
    var inputs = this.htmlElement.getElementsByTagName("input");
    for (var i = 0; i <= inputs.length - 1; i++) {
        if (readonly) {
            inputs[i].removeAttribute(jw.DOM.attributes.READONLY_ATTR)
            inputs[i].classList.remove(jw.DOM.classes.JW_READONLY);
        }
        else {
            inputs[i].setAttribute(jw.DOM.attributes.READONLY_ATTR, true);
            inputs[i].classList.add(jw.DOM.classes.JW_READONLY);
        }
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
    this.focusedCell = null;
    jw.common.removeChildren(this.gridDataTableBody);
    //this.gridDataTableBody.innerHTML = "";
    this.gridSelectedCells = new Array();
    this.gridSelectedRows = new Array();
    this._focusedCell = null;

    if (this.widget.dataSource.grouping.length > 0) {
        //this._renderGroupedData(source);
        this._initiliazeRenderingGroupedData();
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
                    newRow.classList.add(jw.DOM.classes.JW_GRID_JW_TABLE_ALT_ROW_CLASS);
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
    newCell.setAttribute(jasonWidgets.DOM.attributes.COLSPAN_ATTR, this.options.columns.filter(function (col) { return col.visible == true;}).length);
    newCell.appendChild(this.createTextNode(this.options.localization.data.noData));
    newRow.appendChild(newCell);
    newRow.classList.add(jw.DOM.classes.JW_GRID_JW_TABLE_NO_DATA_ROW_CLASS);
    return newRow;
}
/**
 * Creates a TR element and associates it with a dataRow from the source data
 * @param {object} dataRow - Grid data row.
 */
jasonGridUIHelper.prototype._createRowElementFromData = function (dataRow) {
    var newRow = this.createElement("tr");
    newRow.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_ROW_ID_ATTR, dataRow.RowIndex);
    newRow.className = jw.DOM.classes.JW_GRID_JW_TABLE_ROW_CLASS;
    return newRow;
}
/**
 * Creates a TR element and associates it with a dataRow from the source data, and creates cells for the newly created containing data from the dataRow 
 * @param {object} dataRow - Grid data row.* 
 */
jasonGridUIHelper.prototype._createRowElementWithContentFromData = function (dataRow) {
    var newRow = this._createRowElementFromData(dataRow);
    if (this.options.customization.rowTemplate) {
        jw.common.applyTemplate(newRow, this.options.customization.rowTemplate, this.options.customization.dataFieldAttribute, dataRow);
        jw.common.removeNodeText(newRow);
        for (var i = 0; i <= newRow.children.length - 1; i++) {
            var tdChild = newRow.children[i];
            if (tdChild && tdChild.tagName == "TD") {
                tdChild.setAttribute(jw.DOM.attributes.JW_DATA_CELL_ID_ATTR, i);
                var newCellContainer = this.createElement("div");
                newCellContainer.classList.add(jw.DOM.classes.JW_GRID_JW_TABLE_CELL_CONTENT_CONTAINER_CLASS);
                newCellContainer.innerHTML = tdChild.innerHTML;
                tdChild.innerHTML = "";
                jw.common.removeNodeText(tdChild);
                tdChild.appendChild(newCellContainer);
            }
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
    var newCellContentContainer = this.createElement("div");
    newCellContentContainer.classList.add(jw.DOM.classes.JW_GRID_JW_TABLE_CELL_CONTENT_CONTAINER_CLASS);
    newCell.appendChild(newCellContentContainer);
    if (dataColumn.groupColumn != true) {
        newCell.className = jw.DOM.classes.JW_GRID_JW_TABLE_CELL_CLASS;
        newCell.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_CELL_ID_ATTR, dataColumn.index);
        if (dataColumn.cellTemplate) {
            newCellContentContainer.innerHTML = dataColumn.cellTemplate;
            var dataAwareElements = newCell.querySelectorAll("*[" + this.options.customization.dataFieldAttribute + "]");
            for (var i = 0; i <= dataAwareElements.length - 1; i++) {
                var dataElement = dataAwareElements[i];
                jw.common.replaceNodeText(dataElement, dataRow[dataElement.getAttribute(this.options.customization.dataFieldAttribute)], true);
            }
        } else {
            textNode = this.createTextNode(dataRow[dataColumn.fieldName]);
            newCellContentContainer.appendChild(textNode);
        }
    }
    else {
        newCell.className = jw.DOM.classes.JW_GRID_GROUP_CELL;
        newCellContentContainer.innerHTML = "&nbsp";
    }
    return newCell;
}
/**
 * Create a TR grouping row element, with needed elements to provide expand/collapse functionality
 * @param {object} groupNode - HTMLElement
 */
jasonGridUIHelper.prototype._createGrouppingRow = function (groupNode) {
    var newRow = this.createElement("tr");
    var newCollapseExpandCell = this.createElement("td");

    var anchorNode = jw.htmlFactory.createJWButton(null, jw.DOM.icons.CIRCLE_ARROW_UP);
    var groupKeyCaption = this.createElement("span");
    groupKeyCaption.appendChild(this.createTextNode(groupNode.key));
    groupKeyCaption.classList.add(jw.DOM.classes.JW_GRID_GROUP_KEY_CAPTION);
    var self = this;
    this.eventManager.addEventListener(anchorNode, jw.DOM.events.CLICK_EVENT, this._onGroupCollapseExpandIconClick, true);
    this.eventManager.addEventListener(anchorNode, jw.DOM.events.KEY_DOWN_EVENT, function (keyDownEvent) {
        var key = keyDownEvent.keyCode || keyDownEvent.which;
        switch (key) {
            case jw.keycodes.enter: {
                self._onGroupCollapseExpandIconClick(keyDownEvent);
                break;
            }
            case jw.keycodes.downArrow:{
                if(!self._isGroupExpanded(null,null,keyDownEvent.target)){
                    self._collapseExpandGroup(null,null,keyDownEvent.target);
                }
                var groupRow = jw.common.getParentElement("TR",keyDownEvent.target);
                if (groupRow && groupRow.nextSibling) {
                    self.gridDataTable.focus();
                    self._manageCellFocused(groupRow.nextSibling.children[0]);
                }
                keyDownEvent.preventDefault();
                keyDownEvent.stopPropagation();
                break;
            }
            case jw.keycodes.upArrow: {
                var groupRow = jw.common.getParentElement("TR", keyDownEvent.target);
                if (groupRow.previousSibling == void 0) {
                    var cellIndex = self.widget.dataSource.grouping[self.widget.dataSource.grouping.length - 1].level + 1;
                    var headerElement = self.gridHeaderTableRow.children[cellIndex];
                    if (headerElement) {
                        var captionContainer = headerElement.getElementsByClassName("jw-header-cell-caption")[0];
                        if (captionContainer) {
                            var firstAnchor = captionContainer.getElementsByTagName("a")[0];
                            if (firstAnchor)
                                firstAnchor.focus();
                        }
                    }
                    keyDownEvent.preventDefault();
                    keyDownEvent.stopPropagation();
                } else {
                    if (groupRow.previousSibling.getElementsByClassName(jw.DOM.classes.JW_BUTTON)[0]) {
                        groupRow.previousSibling.getElementsByClassName(jw.DOM.classes.JW_BUTTON)[0].focus();
                        keyDownEvent.preventDefault();
                        keyDownEvent.stopPropagation();
                    }
                }
                break;
            }
        }
    }, true);

    newRow.classList.add(jw.DOM.classes.JW_GRID_JW_TABLE_ROW_CLASS);
    newRow.classList.add(jw.DOM.classes.JW_GRID_JW_TABLE_GROUP_ROW_CLASS);
    newRow.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_LEVEL_ATTR, groupNode.level);
    newRow.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_KEY_ATTR, groupNode.key);
    newCollapseExpandCell.setAttribute(jasonWidgets.DOM.attributes.COLSPAN_ATTR, this.options.columns.filter(function (col) { return col.visible == true; }).length);
    newCollapseExpandCell.appendChild(anchorNode);
    newCollapseExpandCell.style.paddingLeft = groupNode.level * 25 + "px";

    newCollapseExpandCell.appendChild(groupKeyCaption);

    newRow.appendChild(newCollapseExpandCell);
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
    this.pagerContainer.classList.add(jw.DOM.classes.JW_PAGER_CONTAINER_CLASS);
    this.pagerInfoContainer = this.createElement("div");
    this.pagerInfoContainer.classList.add(jw.DOM.classes.JW_PAGER_CONTAINER_PAGE_INFO_CLASS);
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
    this.pagerInfo.setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR,pagerInfoText);
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
    if (jw.common.getVariableType(pageNumber) != jw.enums.dataType.number) {
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
        this._currentPage = pageNumber;
        this._refreshCurrentView();
        if (this.options.paging) {
            this._updatePagerInfo(this._recordPosition.recordStart, this._recordPosition.recordStop + 1, this.widget.dataSource.currentDataView.length);
            this.pagerInput.value = this._currentPage;
            this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_PAGE_CHANGE, pageNumber);
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
    var collapseGroupLevel = parseInt(groupRow.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_LEVEL_ATTR));
    //iterating through the next row in the table body until the last child of under this group level.
    for (var i = groupRow.sectionRowIndex + 1; i <= this.gridDataTableBody.childNodes.length - 1; i++) {
        var currentRow = this.gridDataTableBody.childNodes[i];
        //if the row is a group row.
        if (currentRow.className.indexOf(jw.DOM.classes.JW_GRID_JW_TABLE_GROUP_ROW_CLASS) >= 0) {
            var currentRowGroupLevel = parseInt(currentRow.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_LEVEL_ATTR));
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
    var expandGroupLevel = parseInt(groupRow.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_LEVEL_ATTR));
    //iterating through the next row in the table body until the last child of under this group level.
    for (var i = groupRow.sectionRowIndex + 1; i <= this.gridDataTableBody.childNodes.length - 1; i++) {
        var currentRow = this.gridDataTableBody.childNodes[i];
        //if the row is a group row.
        if (currentRow.className.indexOf(jw.DOM.classes.JW_GRID_JW_TABLE_GROUP_ROW_CLASS) >= 0) {
            //the current group row expand state. Meaning if it was expanded or collapsed. 
            //this is useful when we are expanding a parent group, we want to restore the sub-groups
            //to their prior state before the parent group collapsing and hiding everything.
            var currentRowGroupExpandState = currentRow.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUP_EXPANDED_ATTR);
            //current level of the group row.
            var currentRowGroupLevel = parseInt(currentRow.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_LEVEL_ATTR));
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
            var currentRowGroupLevel = currentRow.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_LEVEL_ATTR);

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
    var recordStart = this.options.paging ? (this._currentPage - 1) * this.options.paging.pagesize : 0;
    var recordStop = this.options.paging ? recordStart + this.options.paging.pagesize -1 : this.widget.dataSource.data.length;
    this._renderGroupedData(this.widget.dataSource.range(recordStart, recordStop));
}
/**
 * Renders group row.
 */
jasonGridUIHelper.prototype._renderGroupRow = function (groupNode) {
    var grouppingRow = this._createGrouppingRow(groupNode);
    grouppingRow.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUP_EXPANDED_ATTR, "true");
    this.gridDataTableBody.appendChild(grouppingRow);
}
/**
 * Renders grouped data
 */
jasonGridUIHelper.prototype._renderGroupData = function (groupNode) {
    /*adding the grouping row*/
    this._renderGroupRow(groupNode);

    //if we are at the last grouping node render the actual data.
    for (var i = 0; i <= groupNode.values.length - 1 ; i++) {
        if (groupNode.values[i].values)
            this._renderGroupData(groupNode.values[i]);
        else {
            var newRow = this._createRowElementWithContentFromData(groupNode.values[i]);
            newRow.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_LEVEL_ATTR, groupNode.level);
            this.gridDataTableBody.appendChild(newRow);
        }
    }
}
/**
 * Renders grouped data requires special handling
 */
jasonGridUIHelper.prototype._renderGroupedData = function (groupedData) {
    jw.common.removeChildren(this.gridDataTableBody);
    this.gridSelectedCells = new Array();
    this.gridSelectedRows = new Array();
    this._focusedCell = null;
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
        var groupingFieldContainerRemove = jw.htmlFactory.createJWButton(null,jw.DOM.icons.CLOSE);//this.createElement("a");
        var groupingFieldText = jw.htmlFactory.createJWLinkLabel(column.caption);//this.createElement("span");
        /*setting text of the grouping container*/
        //groupingFieldText.appendChild(this.createTextNode(column.caption));
        groupingFieldContainer.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_GROUPING_FIELD_ATTR, column.fieldName);
        groupingFieldContainerRemove.classList.add(jw.DOM.classes.JW_GRID_REMOVE_GROUP_BUTTON);

        /*setting text and tooltip to the remove grouping field anchor*/
        //var iconNode = this.createElement("i");
        //iconNode.className = jw.DOM.icons.CLOSE;
        //groupingFieldContainerRemove.appendChild(iconNode);
        groupingFieldContainerRemove.setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR, this.options.localization.grid.grouping.removeGrouping + column.caption);

        /*constructing the DOM*/
        groupingFieldContainer.appendChild(groupingFieldText);
        groupingFieldContainer.appendChild(groupingFieldContainerRemove);
        this.gridGroupingContainer.appendChild(groupingFieldContainer);
        this.gridGroupingContainer.setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR, column.caption);

        /*setting on click event for the remove anchor*/
        this.eventManager.addEventListener(groupingFieldContainerRemove, jw.DOM.events.CLICK_EVENT, this._onGroupColumnRemoveClick, true);
       
        this.gridGroupingContainer.childNodes[0].style.display = "none";
        var newGrouping = this.widget.dataSource.grouping[this.widget.dataSource.grouping.length - 1];
        this.options.columns.splice(newGrouping.level, 0, { width: "25px", groupColumn: true, visible: true, groupField: column.fieldName });
        var headerCol = this.createElement("col");
        var dataCol = this.createElement("col");
        var headerTH = this.createElement("th");
        headerCol.style.width = "25px";
        dataCol.style.width = "25px";
        headerTH.setAttribute(jasonWidgets.DOM.attributes.JW_GRID_GROUP_FIELD, column.fieldName);
        headerCol.setAttribute(jasonWidgets.DOM.attributes.JW_GRID_GROUP_FIELD, column.fieldName);
        dataCol.setAttribute(jasonWidgets.DOM.attributes.JW_GRID_GROUP_FIELD, column.fieldName);
        this.headerTableColGroup.insertBefore(headerCol, this.headerTableColGroup.firstChild);
        this.dataTableColGroup.insertBefore(dataCol, this.dataTableColGroup.firstChild);
        this.gridHeaderTableRow.insertBefore(headerTH, this.gridHeaderTableRow.firstChild);

        this._initiliazeRenderingGroupedData();
        this._sizeColumns();
    }
}
/**
 * Get field grouping container element by field name.
 */
jasonGridUIHelper.prototype._getGroupingContainerByFieldName = function (fieldName) {
    return jw.common.getElementsByAttribute(this.gridGroupingContainer, jasonWidgets.DOM.attributes.JW_DATA_GROUPING_FIELD_ATTR, fieldName)[0];
}

/**
 * removes grouping UI in the group container, for a field.
 * @param {string} fieldName - field name to remove grouping for.
 */
jasonGridUIHelper.prototype._removeGroupByField = function (fieldName) {
    var groupingContainerToRemove = this._getGroupingContainerByFieldName(fieldName);
    if (groupingContainerToRemove)
        this.gridGroupingContainer.removeChild(groupingContainerToRemove);
    var headerTHToRemove = this.gridHeaderTableRow.querySelectorAll("th[" + jw.DOM.attributes.JW_GRID_GROUP_FIELD + "='" + fieldName + "']")[0];
    if (headerTHToRemove) {
        this.gridHeaderTableRow.removeChild(headerTHToRemove);
        var colHeaderToRemove = this.headerTableColGroup.querySelectorAll("col[" + jw.DOM.attributes.JW_GRID_GROUP_FIELD + "='" + fieldName + "']")[0];
        if (colHeaderToRemove)
            this.headerTableColGroup.removeChild(colHeaderToRemove);
        colHeaderToRemove = this.dataTableColGroup.querySelectorAll("col[" + jw.DOM.attributes.JW_GRID_GROUP_FIELD + "='" + fieldName + "']")[0];
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
}
//#endregion grouping data - end*/

//#region JW_GRID JW_MENU


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


// #region JASON JW_GRID STRING LOCALIZATION - start*/
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
                    thElement.childNodes[x].setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR, localizationObject.grid.filtering.iconTooltip);
                }
            }
        }
        if (this.filterContainer) {
            //this.filterBtnApply.replaceChild(this.createTextNode(localizationObject.grid.filtering.applyButtonText), this.filterBtnApply.childNodes[1]);
            //this.filterBtnApply.setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR, localizationObject.grid.filtering.applyButtonTooltip);

            //this.filterBtnClear.replaceChild(this.createTextNode(localizationObject.grid.filtering.clearButtonText), this.filterBtnClear.childNodes[1]);
            //this.filterBtnClear.setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR, localizationObject.grid.filtering.clearButtonToollip);
        }
    }
    if (this.options.paging) {
        this.pagerButtonFirst.innerText = localizationObject.grid.paging.firstPageButton;
        this.pagerButtonPrior.innerText = localizationObject.grid.paging.priorPageButton;
        this.pagerButtonLast.innerText = localizationObject.grid.paging.lastPageButton;
        this.pagerButtonNext.innerText = localizationObject.grid.paging.nextPageButton;
        this.pagerInput.setAttribute(jasonWidgets.DOM.attributes.TITLE_ATTR, localizationObject.grid.paging.pagerInputTooltip);
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
// #endregion JASON JW_GRID STRING LOCALIZATION - end*/
