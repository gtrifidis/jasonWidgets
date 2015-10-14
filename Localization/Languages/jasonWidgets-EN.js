/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonWidgetLanguageEN.prototype = Object.create(jasonWidgetLanguage.prototype);
jasonWidgetLanguageEN.prototype.constructor = jasonWidgetLanguageEL;

function jasonWidgetLanguageEN() {
    this.Search = {
        SearchPlaceHolder: 'Type in a value to search'
    }
    this.Filter = {
        Values: {
            FilterValueIsEqual: 'Equal to',
            FilterValueIsNotEqual: "Not equal to",
            FilterValueStartsWith: "Starts with",
            FilterValueEndsWith: "Ends with",
            FilterValueContains: "Contains",
            FilterValueGreaterThan: "Greater than",
            FilterValueGreaterEqualTo: "Greater equal to",
            FilterValueLessThan: "Less than",
            FilterValueLessEqualTo: "Less equal than"
        },
        Operators: {
            And: 'And',
            Or: 'Or'
        }
    }
    this.Data = {
        NoData: 'No data'
    }
    this.Grid = {
        Paging: {
            FirstPageButton: 'First',
            PriorPageButton: 'Prior',
            NextPageButton: 'Next',
            LastPageButton: 'Last',
            PagerInputTooltip: 'Type in a page number'
        },
        Grouping: {
            GroupingMessage: 'Drag a column here to group the data based on that column.',
            RemoveGrouping: 'Remove grouping for '
        },
        Filtering: {
            ClearButtonText: 'Clear',
            ClearButtonToollip: 'Clear all filters',
            ApplyButtonText: 'Apply',
            ApplyButtonTooltip: 'Apply filter',
            IconTooltip: 'Filtering data',
            FilterHeaderCaption: "Show values where"
        },
        ColumnMenu: {
            SortAscending: 'Sort Ascending',
            SortDescending: 'Sort Descending',
            Filter: 'Filter',
            Columns:'Columns'
        }
    };
    this.Combobox = {
        NotFound:'Search term [ {0} ] not found'
    };
    this.Key = "EN";
    this.Calendar = {
        Days: [
            { Name: 'Sunday', ShortName: 'Sun' },
            { Name: 'Monday', ShortName: 'Mon' },
            { Name: 'Tuesday', ShortName: 'Tue' },
            { Name: 'Wednesday', ShortName: 'Wed' },
            { Name: 'Thursday', ShortName: 'Thu' },
            { Name: 'Friday', ShortName: 'Fri' },
            { Name: 'Saturday', ShortName: 'Sat' }
        ],
        Months: [
            { Name: 'January', ShortName: 'Jan' },
            { Name: 'February', ShortName: 'Feb'},
            { Name: 'March', ShortName: 'Mar' },
            { Name: 'April', ShortName: 'Apr' },
            { Name: 'May', ShortName: 'May' },
            { Name: 'June', ShortName: 'Jun' },
            { Name: 'July', ShortName: 'Jul' },
            { Name: 'August', ShortName: 'Aug' },
            { Name: 'September', ShortName: 'Sep' },
            { Name: 'October', ShortName: 'Oct' },
            { Name: 'November', ShortName: 'Nov' },
            { Name: 'December', ShortName: 'Dec' }
        ]
    };
}

jasonWidgets.localizationManager.Languages["EN"] = new jasonWidgetLanguageEN();
