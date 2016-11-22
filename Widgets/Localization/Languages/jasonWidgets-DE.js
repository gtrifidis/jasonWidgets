/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonWidgetLanguageDE.prototype = Object.create(jasonWidgetLanguage.prototype);
jasonWidgetLanguageDE.prototype.constructor = jasonWidgetLanguageDE;

function jasonWidgetLanguageDE() {
    this.search = {
        searchPlaceHolder: 'Geben Sie einen Wert suchen'
    }
    this.filter = {
        values: {
            filterValueIsEqual: 'Gleich',
            filterValueIsNotEqual: "Nicht gleich",
            filterValueStartsWith: "Beginnt mit",
            filterValueEndsWith: "Endet mit",
            filterValueContains: "Enthält",
            filterValueGreaterThan: "Größer als",
            filterValueGreaterEqualTo: "Größer gleich",
            filterValueLessThan: "Weniger als",
            filterValueLessEqualTo: "Weniger gleich als"
        },
        operators: {
            and: 'Und',
            or:'Oder'
        }
    }
    this.data = {
        noData: 'Keine Daten'
    }
    this.grid = {
        paging: {
            firstPageButton: 'Erste',
            priorPageButton: 'Vor',
            nextPageButton: 'Weiter',
            lastPageButton: 'Nur noch wenige',
            pagerInputTooltip: 'Geben Sie eine Seitennummer',
            pagerInfoOfRecordCount: 'Von'
        },
        grouping: {
            groupingMessage: 'Ziehen Sie eine Spalte hier, um die Gruppe, die auf dieser Spalte Daten',
            removeGrouping: 'Entfernen Sie die Gruppierung für'
        },
        filtering: {
            clearButtonText: 'Klar',
            clearButtonToollip: 'Löschen Sie alle Filter',
            applyButtonText: 'Bewerben',
            applyButtonTooltip: 'Filter anwenden',
            iconTooltip: 'Filtern von Daten',
            filterHeaderCaption: "Werte anzeigen, wo"
        },
        columnMenu: {
            sortAscending: 'Sortierung aufsteigend',
            sortDescending: 'Sortierung absteigend',
            filter: 'Filter',
            columns: 'Spalten',
            clearSorting: "Klar Sortierung",
            clearFilters: "Filter löschen"
        }
    };
    this.combobox = {
        notFound: 'Suchbegriff [{0}] nicht gefunden'
    };
    this.key = "DE";
    this.calendar = {
        days: [
            { name: 'Sonntag', shortName: 'So' },
            { name: 'Montag', shortName: 'Mo' },
            { name: 'Dienstag', shortName: 'Di' },
            { name: 'Mittwoch', shortName: 'Mi' },
            { name: 'Donnerstag', shortName: 'Do' },
            { name: 'Freitag', shortName: 'Fr' },
            { name: 'Samstag', shortName: 'Sa' }
        ],
        months: [
            { name: 'Januar', shortName: 'Jan' },
            { name: 'Februar', shortName: 'Feb' },
            { name: 'März', shortName: 'März' },
            { name: 'April', shortName: 'Apr' },
            { name: 'Mai', shortName: 'Mai' },
            { name: 'Juni', shortName: 'Juni' },
            { name: 'Juli', shortName: 'Juli' },
            { name: 'August', shortName: 'Aug' },
            { name: 'September', shortName: 'Sept' },
            { name: 'Oktober', shortName: 'Okt' },
            { name: 'November', shortName: 'Nov' },
            { name: 'Dezember', shortName: 'Dez' }
        ]
    };
    this.dialog = {
        buttons: [
            { name: 'btnOK', caption: 'OK' },
            { name: 'btnYes', caption: 'Ja' },
            { name: 'btnNo', caption: 'Nein' },
            { name: 'btnCancel', caption: 'Stornieren' },
            { name: 'btnAbort', caption: 'Abbrechen' },
            { name: 'btnRetry', caption: 'Wiederholen' },
            { name: 'btnIgnore', caption: 'Ignorieren' },
        ]
    }
    this.numericTextBox = {
        increaseValue: "Wert erhöhen",
        decreaseValue: "Wert verringern"
    }
}

jasonWidgets.localizationManager.languages["de"] = new jasonWidgetLanguageDE();
