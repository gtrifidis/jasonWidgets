/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/**
 * jasonDatasource - Data wrapper that provides search,filter and sorting capabilities over a data array.
 * @constructor
 * @param {array} data - Any array of data,either prime type array or object array.
 */
function jasonDataSource(data) {
    this.Data = data;
    this.processData();
}
/**
 * Returns true if field value is equal to filter value.
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to compare against.
 */
jasonDataSource.prototype.valuesAreEqual = function (fieldValue, filterValue) {
    return filterValue == fieldValue;
}
/**
 * Returns true if field value does not equal filter value
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to compare against. 
 */
jasonDataSource.prototype.valuesAreNotEqual = function (filterValue, fieldValue) {
    return !this.valuesAreEqual(filterValue, fieldValue);
}
/**
 * Returns true if field value is less than filter value.
 * @param {any} filterValue - value to compare
 * @param {any} fieldValue - value to compare against 
 */
jasonDataSource.prototype.valueIsLessThan = function (fieldValue, filterValue) {
    return fieldValue < filterValue;
}
/**
 * Returns true if field value is less-equal than filter value.
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to compare against. 
 */
jasonDataSource.prototype.valueIsLessEqualThan = function (fieldValue, filterValue) {
    return fieldValue <= filterValue;
}
/**
 * Returns true if field value is greater than filter value.
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to compare against. 
 */
jasonDataSource.prototype.valueIsGreaterThan = function (fieldValue, filterValue) {
    return fieldValue > filterValue;
}
/**
 * Returns true if field value is greater-equal than filter value.
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to compare against. 
 */
jasonDataSource.prototype.valueIsGreaterEqualThan = function (fieldValue, filterValue) {
    return fieldValue >= filterValue;
}
/**
 * Returns true if field value starts with filter value.
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to search. 
 */
jasonDataSource.prototype.valueStartsWith = function (fieldValue, filterValue) {
    return fieldValue.indexOf(filterValue) == 0;
}
/**
 * Returns true if field value ends with filter value.
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to search. 
 */
jasonDataSource.prototype.valueEndsWith = function (fieldValue, filterValue) {
    var startingIndex = fieldValue.length - filterValue.length;
    return fieldValue.indexOf(filterValue,startingIndex) == startingIndex;
}
/**
 * Returns true if value is contained in the field
 * @param {any} filterValue - value to compare.
 * @param {any} fieldValue - value to search. 
 */
jasonDataSource.prototype.valueContains = function (fieldValue, filterValue) {
    return fieldValue.indexOf(filterValue) >= 0;
}
/**
 * Extending data properties if underlying data is an object array
 */
jasonDataSource.prototype.processData = function (data) {
    var dataToProcess = !data ? this.Data : data;
    var dataRow = null;
    for (var i = 0; i <= dataToProcess.length - 1; i++) {
        dataRow = dataToProcess[i];
        if (typeof dataRow === "object") {
            dataRow._jwRowId = i;
        }
    }
}
/**
 * Default sort comparison function
 * @param {any} value1 - value to compare.
 * @param {any} value2 - value to compare against.
 */
jasonDataSource.prototype.defaultSortComparison = function (value1, value2) {
    if (value1 == value2) return 0;
    return value1 < value2 ? -1 : 1;
}
/**
 * Default sort comparison function with data type conversion. It will use the {@link jasonDataSource#defaultSortComparison} to perform the actual comparison
 * but will convert parameter using a data conversion function if provided. Can also dictate the direction of the comparison, asc or desc.
 * 
 * @param {function} primer - function that will convert passed in value to a data type.
 * @param {boolean} reverse - if true it will sort descending.
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
 * Returns a sorted array of data based on fields to sort. Supports multiple field sorting with the possibility to apply separate sorting
 * directions per sorting field. Default field sort direction is asc.
 * @param {array} fieldsToSort - Elements can be field names or objects defining sorting direction and/or data type converting function. See {@link jasonDataSource#dataTypeSortComparison}
 * @param {array} data - optional. If not provided the underlying Data array will be used.
 */
jasonDataSource.prototype.Sort = function (fieldsToSort,data) {
    var dataToSort = data ? data : this.Data;
    var sortingFields = [],
        sortingField, name, reverse, comparisonFunction;

    // preprocess sorting options
    for (var i = 0; i <= fieldsToSort.length - 1; i++) {
        sortingField = fieldsToSort[i];
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
    return resultData;
}
/**
 * Filter values for a specific field. Retuns an array containing the data matching the filter parameters
 * @param {array} filterValues - Array of objects containing value to filter plus logical connection operators and evaluator operators.
 * @param {string} filterField - Fieldname to filter.
 * @param {array} data - optional. If not provided the underlying Data array will be used.
 */
jasonDataSource.prototype.Filter = function (filterValues, filterField,data, caseSensitive) {
    jasonWidgets.benchMark.Start();
    var dataToFilter = data ? data : this.Data;
    var resultData = [];
    caseSensitive = jasonWidgets.common.assigned(caseSensitive) ? caseSensitive : false;

    for (var i = 0; i <= filterValues.length - 1; i++) {
        var filterClause = filterValues[i].FilterClause;
        var filterEvaluatorClause = null;
        if (filterClause) {
            switch (filterClause.Symbol) {
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
            filterValues[i].Evaluator = filterEvaluatorClause;
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
                var valueOfFilter = filterValue.Value;
                if (typeof valueOfFilter == "string")
                    valueOfFilter = caseSensitive ? valueOfFilter : valueOfFilter.toLowerCase();
                var priorFilterValue = filterValues[x - 1];
                if (priorFilterValue && filterValue.Evaluator) {
                    var chainlogicalOperator = priorFilterValue.LogicalOperator ? priorFilterValue.LogicalOperator.Operator : 'or';
                    switch (chainlogicalOperator) {
                        case "and": {
                            valueInFilter = valueInFilter && (filterValue.Evaluator(fieldValue, valueOfFilter));
                            break;
                        }
                        case "or": {
                            valueInFilter = valueInFilter || (filterValue.Evaluator(fieldValue, valueOfFilter));
                            break;
                        }
                    }
                } else {
                    if (filterValue.Evaluator)
                        valueInFilter = filterValue.Evaluator(fieldValue, valueOfFilter);
                    }
                } 
            if (valueInFilter)
                resultData.push(dataRow);
        }
    jasonWidgets.benchMark.Stop();
    return resultData;
}
/**
 * Linear search for a search value across the data across fields.
 * @param {string} searchValue - Value to search.
 * @param {array} data - optional. If not provided the underlying Data array will be used.
 */
jasonDataSource.prototype.Search = function (searchValue, data, caseSensitive) {
    var dataToSearch = data ? data : this.Data;
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
    return resultData;
}
/**
 * Linear search for a search value across the data on a specific field.
 * @param {string} searchValue - Value to search.
 * @param {string} field - Field to search on. 
 * @param {array} data - optional. If not provided the underlying Data array will be used.
 */
jasonDataSource.prototype.SearchByField = function (searchValue, field, data, caseSensitive) {
    if (!caseSensitive)
        caseSensitive = false;
    var dataToSearch = data ? data : this.Data;
    var resultData = [];
    searchValue = caseSensitive ? searchValue : searchValue.toLowerCase();
    for (var i = 0; i <= dataToSearch.length - 1; i++) {
        var dataRow = dataToSearch[i];
        if (typeof dataRow == "string") {
            var dataRowValue = caseSensitive ? dataRow : dataRow.toLowerCase();
            if (dataRowValue.indexOf(searchValue) >= 0)
                resultData.push(dataRow);
        } else {
            if (typeof dataRow[field] === "string") {
                var dataRowValue = caseSensitive ? dataRowValue : dataRow[field].toLowerCase();
                if (dataRowValue.indexOf(searchValue) >= 0)
                    resultData.push(dataRow);
            }
        }
        
    }
    return resultData;
}