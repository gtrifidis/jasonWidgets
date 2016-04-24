/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @namespace Data
 * @description Data related classes.
 */

/**
 * @class
 * @name jasonDataSourceSorting
 * @description Datasource sorting configuration item.
 * @memberOf Data
 * @description Object representation of a datasource sorting configuration. A datasource supports multiple sorting configurations.
 * @property {string} name - field name for the sort.
 * @property {boolean} reverse - false = asc , true = desc.
 * @property {function} primer - if set, it will be used to convert the field value to another data type suitable for comparison.
 */
function jasonDataSourceSorting(name,reverse,primer) {
    this.name = name;
    this.reverse = reverse;
    this.primer = primer;
}

/**
 * @constructor
 * @description Data wrapper that provides search, filter and sorting capabilities over a data array.
 * @memberOf Data
 * @param {array} data - Any array of data,either prime type array or object array.
 */
function jasonDataSource(options) {
    this.defaultOptions = {
        data: null,
        onChange: null,
        onSort: null,
        onGroup:null
    };
    jasonWidgets.common.extendObject(this.defaultOptions, options);
    this.options = options;
    this.data = options.data;
    this.processData();
    this.currentDataView = [].concat(this.data);
    this.grouping = [];
    this.dictionaries = [];
    this.filters = [];
    this.sorting = [];
}
/**
 * Set datasource's data.
 * @param {array} data - Array of data.
 */
jasonDataSource.prototype.setData = function (data) {
    this.data = data;
    this.processData();
    if (this.options.onChange)
        this.options.onChange();
}
/**
 * Check if field value is equal to a filter value.
 * @ignore
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to compare against.
 * @returns {boolean}
 */
jasonDataSource.prototype.valuesAreEqual = function (fieldValue, filterValue) {
    return filterValue == fieldValue;
}
/**
 * Returns true if field value does not equal filter value
 * @ignore
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to compare against. 
 * @returns {boolean}
 */
jasonDataSource.prototype.valuesAreNotEqual = function (filterValue, fieldValue) {
    return !this.valuesAreEqual(filterValue, fieldValue);
}
/**
 * Returns true if field value is less than filter value.
 * @ignore
 * @param {any} filterValue - value to compare
 * @param {any} fieldValue - value to compare against 
 * @returns {boolean}
 */
jasonDataSource.prototype.valueIsLessThan = function (fieldValue, filterValue) {
    return fieldValue < filterValue;
}
/**
 * Returns true if field value is less-equal than filter value.
 * @ignore
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to compare against. 
 * @returns {boolean}
 */
jasonDataSource.prototype.valueIsLessEqualThan = function (fieldValue, filterValue) {
    return fieldValue <= filterValue;
}
/**
 * Returns true if field value is greater than filter value.
 * @ignore
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to compare against. 
 * @returns {boolean}
 */
jasonDataSource.prototype.valueIsGreaterThan = function (fieldValue, filterValue) {
    return fieldValue > filterValue;
}
/**
 * Returns true if field value is greater-equal than filter value.
 * @ignore
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to compare against.
 * @returns {boolean} 
 */
jasonDataSource.prototype.valueIsGreaterEqualThan = function (fieldValue, filterValue) {
    return fieldValue >= filterValue;
}
/**
 * Returns true if field value starts with filter value.
 * @ignore
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to search. 
 * @returns {boolean}
 */
jasonDataSource.prototype.valueStartsWith = function (fieldValue, filterValue) {
    return fieldValue.indexOf(filterValue) == 0;
}
/**
 * Returns true if field value ends with filter value.
 * @ignore
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to search.
 * @returns {boolean} 
 */
jasonDataSource.prototype.valueEndsWith = function (fieldValue, filterValue) {
    var startingIndex = fieldValue.length - filterValue.length;
    return fieldValue.indexOf(filterValue,startingIndex) == startingIndex;
}
/**
 * Returns true if value is contained in the field
 * @ignore
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to search.
 * @returns {boolean} 
 */
jasonDataSource.prototype.valueContains = function (fieldValue, filterValue) {
    return fieldValue.indexOf(filterValue) >= 0;
}
/**
 * Extends data properties if underlying data is an object array.
 * @param {array} data - Array of data.
 */
jasonDataSource.prototype.processData = function (data) {
    var dataToProcess = !data ? this.data : data;
    if (dataToProcess) {
        var dataRow = null;
        for (var i = 0; i <= dataToProcess.length - 1; i++) {
            dataRow = dataToProcess[i];
            if (typeof dataRow === "object") {
                dataRow._jwRowId = i;
            }
        }
    }
}
/**
 * Default sort comparison function.
 * @param {any} value1 - value to compare.
 * @param {any} value2 - value to compare against.
 * @returns {boolean} 
 */
jasonDataSource.prototype.defaultSortComparison = function (value1, value2) {
    if (value1 == value2) return 0;
    return value1 < value2 ? -1 : 1;
}
/**
 * Default sort comparison function with data type conversion. It will use the {@link Data.jasonDataSource#defaultSortComparison} to perform the actual comparison
 * but will convert parameter using a data conversion function if provided. Can also dictate the direction of the comparison, asc or desc.
 * 
 * @param {function} primer - function that will convert passed in value to a data type.
 * @param {boolean} [reverse=false] - if true, it will sort descending.
 * @returns {function} Returns function that does sort comparison and if applicable, data type conversion.
 */
jasonDataSource.prototype.dataTypeSortComparison = function (primer,reverse) {
    var defaultSort = this.defaultSortComparison;
    var dataTypeComparison = defaultSort;
    if (primer) {
        dataTypeComparison = function (value1, value2) {
            return defaultSort(primer(value1), primer(value2));
        };
    }
    if (reverse == true) {
        return function (value1, value2) {
            return -1 * dataTypeComparison(value1, value2);
        };
    }
    return dataTypeComparison;
}
/**
 * Adds sorting configuration to the datasource.
 * @property {Data.jasonDataSourceSorting} sortingConfiguration - sorting to add.
 * @property {boolean} [sort=false] - if true, sort now.
 * @returns {object[]|void}
 */
jasonDataSource.prototype.addSorting = function (sortingConfiguration, sortNow) {
    sortNow = sortNow != undefined ? sortNow : true;
    var existingSorting = this.sorting.filter(function (sortingField) {
        return sortingField.name == sortingConfiguration.name;
    })[0];
    if (!existingSorting) {
        this.sorting.push(sortingConfiguration);
    } else
        existingSorting.reverse = sortingConfiguration.reverse;
    if (sortNow == true)
       return this.sort(this.sorting, this.currentDataView);
}
/**
 * Removes sorting for a field.
 * @param {string} fieldName - Fieldname of which to remove sorting.
 */
jasonDataSource.prototype.removeSorting = function (fieldName) {
    var existingSorting = this.sorting.filter(function (sortingField) {
        return sortingField.name == sortingConfiguration.name;
    })[0];
    if (existingSorting) {
        var idx = this.sorting.indexOf(existingSorting);
        this.sorting.splice(idx, 1);
        if (this.sorting.length == 0) {
            this.currentDataView = [].concat(this.data);
        } else {
            this.applySort();
        }
    }
}
/**
 * Applies current sorting configuration.
 */
jasonDataSource.prototype.applySort = function () {
    this.sort();
}
/**
 * Clears all sorting.
 */
jasonDataSource.prototype.clearSorting = function () {
    this.sorting = [];
    if (this.filters.length == 0)
        this.currentDataView = [].concat(this.data);
    else
        this.applyFilters();
}
/**
 * Returns a sorted array of data based on fields to sort. Supports multiple field sorting with the possibility to apply separate sorting
 * directions per sorting field. Default field sort direction is asc.
 * @param {array} fieldsToSort - Elements can be field names or objects defining sorting direction and/or data type converting function. See {@link Data.jasonDataSource#dataTypeSortComparison}
 * @param {any[]} [data=[]] - If not provided, the underlying Data array will be used.
 * @returns {object[]}
 */
jasonDataSource.prototype.sort = function (fieldsToSort,data) {
    var dataToSort = data ? data : [].concat(this.data);
    var sortingFields = [],
        sortingField, name, reverse, comparisonFunction;
    if (fieldsToSort) {
        for (var i = 0; i <= fieldsToSort.length - 1; i++) {
            if (typeof fieldsToSort[i] == "string")
                this.addSorting(fieldsToSort[i], false);
        }
    }
    // preprocess sorting options
    for (var i = 0; i <= this.sorting.length - 1; i++) {
        sortingField = this.sorting[i];
        if (typeof sortingField === 'string') {
            name = sortingField;
            comparisonFunction = default_cmp;
        }
        else {
            name = sortingField.name;
            comparisonFunction = this.dataTypeSortComparison(sortingField.primer, sortingField.reverse);
        }
        sortingFields.push({
            name: name,
            compare: comparisonFunction
        });
    }

    var resultData = dataToSort.sort(function (priorItem, nextItem) {
        var result;
        for (var i = 0; i <= sortingFields.length - 1; i++) {
            result = 0;
            sortingField = sortingFields[i];
            name = sortingField.name;

            result = sortingField.compare(priorItem[name], nextItem[name]);
            if (result !== 0) break;
        }
        return result;
    });
    this.currentDataView = [].concat(resultData);
    return this.currentDataView;
}
/**
 * Filter values for a specific field. Retuns an array containing the data matching the filter parameters.
 * @param {array} filterValues - Array of objects containing value to filter plus logical connection operators and evaluator operators.
 * @param {string} filterField - Fieldname to filter.
 * @param {any[]} [data=[]] - If not provided, the underlying Data array will be used.
 * @param {boolean} [caseSensitive=false] - When true, search will be case sensitive.
 * @returns {object[]}
 */
jasonDataSource.prototype.filter = function (filterValues, filterField,data, caseSensitive) {
    var dataToFilter = data ? data : this.data;
    var resultData = [];
    caseSensitive = jasonWidgets.common.assigned(caseSensitive) ? caseSensitive : false;

    for (var i = 0; i <= filterValues.length - 1; i++) {
        var filterClause = filterValues[i].filterClause;
        var filterEvaluatorClause = null;
        if (filterClause) {
            switch (filterClause.symbol) {
                case "=": { filterEvaluatorClause = this.valuesAreEqual; break; }
                case ">": { filterEvaluatorClause = this.valueIsGreaterThan; break; }
                case "<": { filterEvaluatorClause = this.valueIsLessThan; break; }
                case ">=": { filterEvaluatorClause = this.valueIsGreaterEqualThan; break; }
                case "<=": { filterEvaluatorClause = this.valueIsLessEqualThan; break; }
                case "!=": { filterEvaluatorClause = this.valueStartsWith; break; }
                case "startsWith": { filterEvaluatorClause = this.valueStartsWith; break; }
                case "endsWith": { filterEvaluatorClause = this.valueEndsWith; break; }
                case "contains": { filterEvaluatorClause = this.valueContains; break; }
            }
            filterValues[i].evaluator = filterEvaluatorClause;
        }
     }

        for (var i = 0; i <= dataToFilter.length - 1; i++) {
            var dataRow = dataToFilter[i];
            var fieldValue = dataRow[filterField];
            if(typeof fieldValue == "string")
                fieldValue = caseSensitive ? fieldValue : fieldValue.toLowerCase();
            var valueInFilter = false;
            for (var x = 0; x <= filterValues.length - 1; x++) {
                var filterValue = filterValues[x];
                var valueOfFilter = filterValue.value;
                if (typeof valueOfFilter == "string")
                    valueOfFilter = caseSensitive ? valueOfFilter : valueOfFilter.toLowerCase();
                var priorFilterValue = filterValues[x - 1];
                if (priorFilterValue && filterValue.evaluator) {
                    var chainlogicalOperator = priorFilterValue.logicalOperator ? priorFilterValue.logicalOperator.operator : 'or';
                    switch (chainlogicalOperator) {
                        case "and": {
                            valueInFilter = valueInFilter && (filterValue.evaluator(fieldValue, valueOfFilter));
                            break;
                        }
                        case "or": {
                            valueInFilter = valueInFilter || (filterValue.evaluator(fieldValue, valueOfFilter));
                            break;
                        }
                    }
                } else {
                    if (filterValue.evaluator)
                        valueInFilter = filterValue.evaluator(fieldValue, valueOfFilter);
                }
                if (valueInFilter)
                    resultData.push(dataRow);
           } 
        }
        this.currentDataView = [].concat(resultData);
        return this.currentDataView;
}
/**
 * Add a filter.
 * @param {string} filterField - Field to filter.
 * @param {string} filterValues - Filter values.
 * @param {boolean} [filterNow=false] - If true, it will apply filter.
 * @returns {object[]|void}
 */
jasonDataSource.prototype.addFilter = function (filterField, filterValues, filterNow) {
    filterNow = filterNow == void 0 ? false : filterNow;
    var existingFilter = this.filters.filter(function (filter) { return filter.filterField == filterField; })[0];
    var dataToFilter = this.data;
    if (!existingFilter) {
        //creating filter
        existingFilter = { filterValues: filterValues, filterField: filterField };
        this.filters.push(existingFilter);
    }
    else {
        existingFilter.filterValues = filterValues;
    }
    if (filterNow)
        return this.filter(filterValues, filterField, dataToFilter);
}
/**
 * Removes applied filter for the field.
 * @param {string} filterField - Field name.
 */
jasonDataSource.prototype.removeFilter = function (filterField) {
    var filterIndexToDelete = -1;
    var filterToDelete = this.filters.filter(function (filter, filterIndex) {
        var result = filter.filterField == filterField;
        if (result) {
            filterIndexToDelete = filterIndex;
            return filter;
        }
    })[0];
    //remove the filter from the array of filters.
    if (filterToDelete) {
        this.filters.splice(filterIndexToDelete, 1);
    }
    if (this.filters.length > 0) {
        this.currentDataView = [].concat(this.data);
        for (var i = 0; i <= this.filters.length - 1; i++) {
            var filter = this.filters[i];
            this.filter(filter.filterValues, filter.filterField, this.currentDataView);
        }
    } else {
        this.currentDataView = [].concat(this.data);
    }
}
/**
 * Applies all filters.
 */
jasonDataSource.prototype.applyFilters = function () {
    var dataToFilter;
    for (var i = 0; i <= this.filters.length - 1; i++) {
        var filter = this.filters[i];
        if (i == 0) {
            dataToFilter = this.filter(filter.filterValues, filter.filterField, this.data);
        } else {
            dataToFilter = this.filter(filter.filterValues, filter.filterField, dataToFilter);
        }
    }
    return this.currentDataView;
}
/**
 * Clears all filters.
 */
jasonDataSource.prototype.clearFilters = function () {
    this.filters = [];
    if (this.sorting.length == 0)
        this.currentDataView = [].concat(this.data);
    else
        this.sort();
}
/**
 * Linear search for a search value across the data across fields.
 * @param {string} searchValue - Value to search.
 * @param {any[]} [data=[]] - If not provided, the underlying Data array will be used.
 * @param {boolean} [caseSensitive=false] - When true, search will be case sensitive.
 * @returns {object[]}
 */
jasonDataSource.prototype.search = function (searchValue, data, caseSensitive) {
    var dataToSearch = data ? data : [].concat(this.data);
    var resultData = [];
    searchValue = caseSensitive ? searchValue : searchValue.toLowerCase();
    for (var i = 0; i <= dataToSearch.length - 1; i++) {
        var dataRow = dataToSearch[i];
        for (var fld in dataRow) {
            if (typeof dataRow[fld] === "string") {
                var dataFieldValue = dataRow[fld].toLowerCase();
                if (dataFieldValue.indexOf(searchValue) >= 0) {
                    //if one field satisfies the search, there is not need to continue the search.
                    resultData.push(dataRow);
                    break;
                }
            }
        }
    }
    this.currentDataView = [].concat(resultData);
    return this.currentDataView;
}
/**
 * Linear search for a search value across the data on a specific field.
 * @param {string} searchValue - Value to search.
 * @param {string[]} field - Fields to search on. 
 * @param {any[]} [data=[]] - If not provided, the underlying Data array will be used.
 * @param {boolean} [caseSensitive=false] - When true, search will be case sensitive.
 * @returns {object[]}
 */
jasonDataSource.prototype.searchByField = function (searchValue, fields, data, caseSensitive) {
    if (!caseSensitive)
        caseSensitive = false;
    var dataToSearch = data ? data : [].concat(this.data);
    var resultData = [];
    searchValue = caseSensitive ? searchValue : searchValue.toLowerCase();
    for (var i = 0; i <= dataToSearch.length - 1; i++) {
        var dataRow = dataToSearch[i];
        if (typeof dataRow == "string") {
            var dataRowValue = caseSensitive ? dataRow : dataRow.toLowerCase();
            if (dataRowValue.indexOf(searchValue) >= 0)
                resultData.push(dataRow);
        } else {
            if (fields === void 0)
                jw.common.throwError(jw.errorTypes.referenceError, "Search fields are not defined");
            for (var x = 0; x <= fields.length - 1; x++) {
                if (typeof dataRow[fields[x]] === "string") {
                    var dataRowValue = caseSensitive ? dataRowValue : dataRow[fields[x]].toLowerCase();
                    if (dataRowValue.indexOf(searchValue) >= 0)
                        resultData.push(dataRow);
                }
            }
        }
    }
    this.currentDataView = [].concat(resultData);
    return this.currentDataView;
}
/**
 * Groups data based on the grouping field.
 * if there is already a grouping, an extra level will be added.
 * @property {string} field - Field to group by.
 * @property {array=} data - Data to group.
 * @property {boolean} [groupNow=false] - If true, grouping will execute immediately.
 * @retuns {object[]}
 */
jasonDataSource.prototype.groupByField = function (field, data,groupNow) {
    var dataToGroup = data ? data : [].concat(this.data);
    var groupingExists = this.groupingExists(field);
    this.groupedData = [];
    if (!groupingExists) {
        var newGrouping = { field: field, level: this.grouping.length };
        this.grouping.push(newGrouping);
    }
    if (groupNow)
        this.groupData();
}
/**
 * Groups data based on the datasource's current grouping configuration.
 * @param {array=} data - Data to group.
 * @returns {object[]}
 */
jasonDataSource.prototype.groupData = function (data) {
    var dataToGroup = data ? data : [].concat(this.data);
    if (!this.grouperDataSource)
        this.grouperDataSource = new jasonDataSource({ data: dataToGroup });
    this.grouperDataSource.clearSorting();
    for (var i = 0; i <= this.grouping.length - 1; i++) {
        var grouping = this.grouping[i];
        this.grouperDataSource.addSorting({ name: grouping.field, reverse: false }, false);
    }
    dataToGroup = this.grouperDataSource.sort();
    var self = this;
    var dataGroupper = new jw.data.nest();
    var keyFunctions = [];
    for (var i = 0; i <= this.grouping.length - 1; i++) {
        dataGroupper.key(null, self.grouping[i].field);
    }
    return dataGroupper.entries(dataToGroup);
}
/**
 * Checks for an existing grouping.
 * @param {string} field - Field name.
 * @returns {boolean}
 */
jasonDataSource.prototype.groupingExists = function (field) {
    return this.grouping.filter(function (grouping) { return grouping.field == field }).length > 0;
}
/**
 * Removes grouping.
 * @param {Data.jasonDataSourceGrouping} grouping - Grouping to remove.
 */
jasonDataSource.prototype.removeGrouping = function (grouping) {
    var indexToRemove = -1;
    this.grouping.filter(function (dataGrouping, dataGroupingIndex) {
        if (dataGrouping.field == grouping.field) {
            indexToRemove = dataGroupingIndex;
            return true;
        }
    })[0];
    this.grouping.splice(indexToRemove, 1);
    this.groupData();
}
/**
 * Returns a slice of the datasource's data and applies any grouping if applicable.
 * @property {number} start - starting index.
 * @property {number} stop - stoping index.
 * @returns {object[]} Returns array of data.
 */
jasonDataSource.prototype.range = function (start, stop) {
    var result = this.currentDataView.slice(start, stop + 1);
    if(this.grouping.length > 0)
        result = this.groupData(result);
    return result;
}