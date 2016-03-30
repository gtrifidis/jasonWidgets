/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/**
 * @namespace Localization
 * @description
 * 
 * Collection of classes for localizing jasonWidgets.
 */

/**
 * jasonLocalizationManager class to manage localization needs across jasonWidgets.
 * @constructor
 * @description Localization class that manages localization for all jasonWidgets. It holds a list of all registered {@link Localization.jasonWidgetLanguage}
 * and {@link Localization.jasonWidgetCulture}.
 *
 * To register a lagnuage or culture, create a js file in which a descendant of {@link Localization.jasonWidgetLanguage} is created and
 * registered.
 *
 * @memberOf Localization
 * @property {Localization.jasonWidgetLanguage} currentLanguage - jasonWidgets current language.
 * @property {Localization.jasonWidgetCulture} currentCulture - jasonWidgets current culture.
 * @property {string} currentLanguageKey - Current language key. Set it on initialization to define the language for jasonWidgets.
 * @property {string} currentCultureKey - Current culture key. Set it on initialization to define the culture for jasonWidgets.
 */
function jasonLocalizationManager() {
    var self = this;
    Object.defineProperty(self, "currentLanguage", {
        get: function () {
            var language = this.languages[this.currentLanguageKey];
            if (!language) {
                if (this.currentLanguageKey.indexOf("-") >= 0) {
                    var splitted = this.currentLanguageKey.split("-");
                    var langKey = splitted[0] + "-" + splitted[1].toLowerCase();
                    if (!language) {
                        langKey = splitted[0] + "-" + splitted[1].toUpperCase();
                        language = this.languages[langKey]
                        if (!language)
                            language = this.languages["en-US"];
                    }
                }
                else {
                    language = this.languages["en-US"];
                }
            }
            return language;
        },
        enumerable: true
    });
    Object.defineProperty(self, "currentCulture", {
        get: function () {
            var culture = this.cultures[this.currentCultureKey];
            if (!culture) {
                if (this.currentCultureKey.indexOf("-") >= 0) {
                    var splitted = this.currentCultureKey.split("-");
                    var cultureKey = splitted[0] + "-" + splitted[1].toLowerCase();
                    if (!culture) {
                        cultureKey = splitted[0] + "-" + splitted[1].toUpperCase();
                        language = this.cultures[cultureKey]
                        if (!culture)
                            culture = this.cultures["en-US"];
                    }
                }
                else {
                    culture = this.cultures["en-US"];
                }
            }
            return culture;
        },
        set: function (newValue) {
            this.currentCultureKey = newValue;
            this.determineDateFormat();
            this.determineTimeFormat();
        },
        enumerable: true
    });
    this.currentLanguageKey = navigator.browserLanguage || navigator.language;
    this.currentCultureKey = navigator.browserLanguage || navigator.language;
    this.languages = {};
    this.cultures = {};
    this.determineDateFormat = function () {
        var result = "";
        var newDate = new Date();
        newDate.setHours(0);
        newDate.setMinutes(0);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        newDate.setYear(1999);
        newDate.setMonth(11);
        newDate.setDate(31);
       
        var dateString = newDate.toLocaleDateString();
        var nonNumeric = dateString.match(/[^0-9]/g);
        var dateSplitter = nonNumeric[0];
        this.localeDateSeparator = dateSplitter;
        var splitted = dateString.split(dateSplitter);
        for (var i = 0 ; i<= splitted.length - 1; i++) {
            if (splitted[i].length > 2) {
                if (i > 0)
                    result = result + dateSplitter;
                result = result + "yyyy";
            }
            if (splitted[i].length == 2) {
                var numericValue = parseInt(splitted[i]);
                if (numericValue == 12) {
                    if (i > 0)
                        result = result + dateSplitter;
                    result = result + "MM";
                }
                if (numericValue == 31){
                    if (i > 0)
                        result = result + dateSplitter;
                    result = result + "dd";
                }
                if (numericValue == 99){
                    if (i > 0)
                        result = result + dateSplitter;
                    result = result + "dd";
                }
            }

        }
        return result;
    }
    this.determineTimeFormat = function () {
        var result = "";
        var timeDate = new Date();
        var timeDateString = "";
        var meridiemString = "";
       
        timeDate.setHours(11);
        timeDate.setMinutes(59);
        timeDate.setSeconds(59);
        timeDate.setMilliseconds(0);
        

        var anteMeridiemTimeString = timeDate.toLocaleTimeString(this.currentCultureKey);
        anteMeridiemTimeString = anteMeridiemTimeString.replace(/\u200E/g, "");
        for (var i = 0; i <= anteMeridiemTimeString.length - 1; i++) {
            if (anteMeridiemTimeString[i] != "") {
                var charCode = anteMeridiemTimeString.charCodeAt(i);
                if (!isNaN(charCode) && charCode > 64) {
                    meridiemString = anteMeridiemTimeString.substr(i, anteMeridiemTimeString.length - i);
                    break;
                }
            }
        }
        this.anteMeridiemString = meridiemString;

        timeDate.setHours(23);
        timeDate.setMinutes(24);
        timeDate.setSeconds(25);
        timeDate.setMilliseconds(26);

        anteMeridiemTimeString = timeDate.toLocaleTimeString(this.currentCultureKey)
        anteMeridiemTimeString = anteMeridiemTimeString.replace(/\u200E/g, "");
        //getting post meridiem string
        var postMeridiem = "";
        for (var i = 0; i <= anteMeridiemTimeString.length - 1; i++) {
            if (anteMeridiemTimeString[i] != "") {
                var charCode = anteMeridiemTimeString.charCodeAt(i);
                if (!isNaN(charCode) && charCode > 64) {
                    meridiemString = anteMeridiemTimeString.substr(i, anteMeridiemTimeString.length - i);
                    break;
                }
            }
        }
        this.postMeridiemString = meridiemString;
        

        timeDateString = timeDate.toLocaleTimeString(this.currentCultureKey);
        timeDateString = timeDateString.replace(this.postMeridiemString, "");
        timeDateString = timeDateString.replace(/\u200E/g, "");
        timeDateString = timeDateString.trim();
        var nonNumeric = timeDateString.match(/\D/g);
        var timeSplitter = nonNumeric[0];
        var splitted = timeDateString.split(timeSplitter);
        this.localeTimeSeparator = timeSplitter;
        for (var i = 0 ; i <= splitted.length - 1; i++) {
            if (splitted[i].length == 2) {
                var numericValue = parseInt(splitted[i]);
                if (numericValue == 23 || numericValue == 11) {
                    this.isTwelveHourClock = numericValue == 11;
                    if (i > 0)
                        result = result + timeSplitter;
                    result = this.isTwelveHourClock ? result + "hh" : result + "HH";
                }
                if (numericValue == 24) {
                    if (i > 0)
                        result = result + timeSplitter;
                    result = result + "mm";
                }
                if (numericValue == 25) {
                    if (i > 0)
                        result = result + timeSplitter;
                    result = result + "ss";
                }
                if (numericValue == 26) {
                    if (i > 0)
                        result = result + timeSplitter;
                    result = result + "f";
                }
            }
        }
        return result;
    }
    this.localeDateFormat = this.determineDateFormat();
    this.localeTimeFormat = this.determineTimeFormat();
    
}
/**
 * @constructor
 * @memberOf Localization
 * @description Language class contains localized information for jasonWidgets for a language.
 * @example Creating an English localization language file.
 * //file must be loaded after localization manager.
 * jasonWidgetLanguageEN.prototype = Object.create(jasonWidgetLanguage.prototype);
 * jasonWidgetLanguageEN.prototype.constructor = jasonWidgetLanguageEN;
 * 
 * function jasonWidgetLanguageEN() {
 *    this.search = {
 *       searchPlaceHolder: 'Type in a value to search'
 *   }
 * ...
 * }
 * 
 * jasonWidgets.localizationManager.languages["en-US"] = new jasonWidgetLanguageEN();
 * 
 * @property {string} key - Unique language key. For example en-US.
 * @property {object} search - Search localization.
 * @property {object} search.searchPlaceHolder - Text for the placeholder attribute of <input placeholder='Placeholder text!'> elements.
 * @property {object} filter - Filter localization.
 * @property {string} filter.filterValueIsEqual - 
 * @property {string} filter.filterValueIsNotEqual -
 * @property {string} filter.filterValueStartsWith -
 * @property {string} filter.filterValueEndsWith - 
 * @property {string} filter.filterValueContains - 
 * @property {string} filter.filterValueGreaterThan - 
 * @property {string} filter.filterValueGreaterThan - 
 * @property {string} filter.filterValueGreaterEqualTo - 
 * @property {string} filter.filterValueLessThan - 
 * @property {string} filter.filterValueLessEqualTo - 
 * @property {string} filter.filterHeaderCaption - Filter header caption.
 * @property {object} data - Data localization.
 * @property {string} data.noData - Text when no data are available.
 * @property {object} grid - Grid localization.
 * @property {object} grid.paging - Grid paging localization.
 * @property {string} grid.firstPageButton - Pager's first button text.
 * @property {string} grid.priorPageButton - Pager's prior button text..
 * @property {string} grid.nextPageButton - Pager's next button text..
 * @property {string} grid.lastPageButton - Pager's last button text..
 * @property {string} grid.pagerInputTooltip - Pager's input tooltip text..
 * @property {object} grid.grouping - Grid grouping localization.
 * @property {string} grid.grouping.groupingMessage -  Grouping instruction message on how to group data by column.
 * @property {object} grid.filtering - Grid filtering localization.
 * @property {string} grid.filtering.clearButtonText -  Filter's clear button text.
 * @property {string} grid.filtering.clearButtonTooplip -  Filter's clear button tooltip.
 * @property {string} grid.filtering.applyButtonText -  Filter's apply button text.
 * @property {string} grid.filtering.applyButtonTooltip -  Filter's apply button tooltip.
 */
function jasonWidgetLanguage() {
    /*
     * Unique language key. For example en-US
     */
    jasonWidgetLanguage.prototype.key = "";
    /*
     * Search related strings.
     */
    jasonWidgetLanguage.prototype.search = {
        searchPlaceHolder:''
    }
    /*
     * Filter related strings.
     */
    jasonWidgetLanguage.prototype.filter = {
        values: {
            filterValueIsEqual: '',
            filterValueIsNotEqual: '',
            filterValueStartsWith: '',
            filterValueEndsWith: '',
            filterValueContains: '',
            filterValueGreaterThan: '',
            filterValueGreaterEqualTo: '',
            filterValueLessThan: '',
            filterValueLessEqualTo: '',
            filterHeaderCaption: ''
        },
        operators: {
            and: '',
            or:''
        }
    }
    /*
     * Data related strings
     */
    jasonWidgetLanguage.prototype.data = {
        noData:''
    }
    /*
     * Grid related strings.
     */
    jasonWidgetLanguage.prototype.grid = {
        paging: {
            firstPageButton: '',
            priorPageButton: '',
            nextPageButton: '',
            lastPageButton: '',
            pagerInputTooltip: ''
        },
        grouping: {
            groupingMessage: ''
        },
        filtering: {
            clearButtonText: '',
            clearButtonTooplip: '',
            applyButtonText: '',
            applyButtonTooltip: ''
        }
    };
    /*
     * Combobox related strings.
     */
    jasonWidgetLanguage.prototype.combobox = {
    };
    return jasonWidgetLanguage;
}


/**
 * @constructor
 * @memberOf Localization
 * @description 
 * Culture class contains localized information for jasonWidgets for a culture.
 * 
 * 
 * For acceptable date/time formats go here {@link https://msdn.microsoft.com/en-us/library/8kb3ddd4%28v=vs.110%29.aspx}
 * 
 * @example Creating an English culture localization file.
 * //file must be loaded after localization manager.
 * jasonWidgetCultureEN_US.prototype = Object.create(jasonWidgetCulture.prototype);
 * jasonWidgetCultureEN_US.prototype.constructor = jasonWidgetCultureEN_US;
 * 
 * function jasonWidgetCultureEN_US() {
 *   this.dateFormat = "MM/dd/yyyy";
 *   this.shortDateFormat = "MMM dd yyyy";
 *   this.longDateFormat = "dddd MMMM dd yyyy";
 *   this.timeFormat = "hh:mm:ss"
 *   this.postMeridiem = [];
 *   this.anteMeridiem = [];
 *}
 * 
 * jasonWidgets.localizationManager.cultures["en-US"] = new jasonWidgetCultureEN_US();
 * 
 * 
 * @property {string} key - Unique language key. For example en-US.
 * @property {string} dateFormat - Date format string. 
 * @property {string} shortDateFormat - Short date format string.
 * @property {string} longDateFormat - Long date format string.
 * @property {string} timeFormat - Time format string.
 */
function jasonWidgetCulture() {
    /*
     * Unique culture key. For example en-US
     */
    jasonWidgetCulture.prototype.key = "";

    jasonWidgetCulture.prototype.dateFormat = "";

    jasonWidgetCulture.prototype.shortDateFormat = "";

    jasonWidgetCulture.prototype.longDateFormat = "";

    jasonWidgetCulture.prototype.timeDateFormat = "";
}
jasonWidgets.localizationManager = new jasonLocalizationManager();