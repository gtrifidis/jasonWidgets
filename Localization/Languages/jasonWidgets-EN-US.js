/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonWidgetLanguageEN.prototype = Object.create(jasonWidgetLanguage.prototype);
jasonWidgetLanguageEN.prototype.constructor = jasonWidgetLanguageEN;

function jasonWidgetLanguageEN() {
    this.search = {
        searchPlaceHolder: 'Type in a value to search'
    }
    this.filter = {
        values: {
            filterValueIsEqual: 'Equal to',
            filterValueIsNotEqual: "Not equal to",
            filterValueStartsWith: "Starts with",
            filterValueEndsWith: "Ends with",
            filterValueContains: "Contains",
            filterValueGreaterThan: "Greater than",
            filterValueGreaterEqualTo: "Greater equal to",
            filterValueLessThan: "Less than",
            filterValueLessEqualTo: "Less equal than"
        },
        operators: {
            and: 'And',
            or: 'Or'
        }
    }
    this.data = {
        noData: 'No data'
    }
    this.grid = {
        paging: {
            firstPageButton: 'First',
            priorPageButton: 'Prior',
            nextPageButton: 'Next',
            lastPageButton: 'Last',
            pagerInputTooltip: 'Type in a page number',
            pagerInfoOfRecordCount :'of'

        },
        grouping: {
            groupingMessage: 'Drag a column here to group the data based on that column.',
            removeGrouping: 'Remove grouping for '
        },
        filtering: {
            clearButtonText: 'Clear',
            clearButtonToollip: 'Clear all filters',
            applyButtonText: 'Apply',
            applyButtonTooltip: 'Apply filter',
            iconTooltip: 'Filtering data',
            filterHeaderCaption: "Show values where"
        },
        columnMenu: {
            sortAscending: 'Sort Ascending',
            sortDescending: 'Sort Descending',
            filter: 'Filter',
            columns: 'Columns',
            clearSorting: "Clear Sorting",
            clearFilters: "Clear Filters"
        }
    };
    this.combobox = {
        notFound:'Search term [ {0} ] not found'
    };
    this.key = "EN";
    this.calendar = {
        days: [
            { name: 'Sunday', shortName: 'Sun' },
            { name: 'Monday', shortName: 'Mon' },
            { name: 'Tuesday', shortName: 'Tue' },
            { name: 'Wednesday', shortName: 'Wed' },
            { name: 'Thursday', shortName: 'Thu' },
            { name: 'Friday', shortName: 'Fri' },
            { name: 'Saturday', shortName: 'Sat' }
        ],
        months: [
            { name: 'January', shortName: 'Jan' },
            { name: 'February', shortName: 'Feb' },
            { name: 'March', shortName: 'Mar' },
            { name: 'April', shortName: 'Apr' },
            { name: 'May', shortName: 'May' },
            { name: 'June', shortName: 'Jun' },
            { name: 'July', shortName: 'Jul' },
            { name: 'August', shortName: 'Aug' },
            { name: 'September', shortName: 'Sep' },
            { name: 'October', shortName: 'Oct' },
            { name: 'November', shortName: 'Nov' },
            { name: 'December', shortName: 'Dec' }
        ]
    };
}

jasonWidgets.localizationManager.languages["en-US"] = new jasonWidgetLanguageEN();
