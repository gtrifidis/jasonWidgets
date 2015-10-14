/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/**
 * jasonLocalizationManager class to manage localization needs across jasonWidgets.
 */
function jasonLocalizationManager() {
    var self = this;
    Object.defineProperty(self, "CurrentLanguage", {
        get: function () { return self.Languages[self.CurrentLanguageKey]; },
        enumerable: true,
        configurable:true
    });
    Object.defineProperty(self, "CurrentCulture", {
        get: function () { return self.Cultures[self.CurrentLanguageKey]; },
        enumerable: true,
        configurable: true
    });
    this.CurrentLanguageKey = "";
    this.CurrentCultureKey = "";
    this.Languages = {};
    this.Cultures = {};
}
/**
 * jasonWidgetLanguage contains localized information for jasonWidgets for a language.
 */
function jasonWidgetLanguage() {
    /**
     * Unique language key. For example en-US
     */
    jasonWidgetLanguage.prototype.Key = "";
    /**
     * Search related strings.
     */
    jasonWidgetLanguage.prototype.Search = {
        SearchPlaceHolder:''
    }
    /**
     * Filter related strings.
     */
    jasonWidgetLanguage.prototype.Filter = {
        Values: {
            FilterValueIsEqual: '',
            FilterValueIsNotEqual: '',
            FilterValueStartsWith: '',
            FilterValueEndsWith: '',
            FilterValueContains: '',
            FilterValueGreaterThan: '',
            FilterValueGreaterEqualTo: '',
            FilterValueLessThan: '',
            FilterValueLessEqualTo: '',
            FilterHeaderCaption: ''
        },
        Operators: {
            And: '',
            Or:''
        }
    }
    /**
     * Data related strings
     */
    jasonWidgetLanguage.prototype.Data = {
        NoData:''
    }
    /**
     * Grid related strings.
     */
    jasonWidgetLanguage.prototype.Grid = {
        Paging: {
            FirstPageButton: '',
            PriorPageButton: '',
            NextPageButton: '',
            LastPageButton: '',
            PagerInputTooltip: ''
        },
        Grouping: {
            GroupingMessage: ''
        },
        Filtering: {
            ClearButtonText: '',
            ClearButtonTooplip: '',
            ApplyButtonText: '',
            ApplyButtonTooltip: ''
        }
    };
    /**
     * Combobox related strings.
     */
    jasonWidgetLanguage.prototype.Combobox = {
    };
    return jasonWidgetLanguage;
}

jasonWidgets.localizationManager = new jasonLocalizationManager();