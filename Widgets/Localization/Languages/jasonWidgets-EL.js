/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonWidgetLanguageEL.prototype = Object.create(jasonWidgetLanguage.prototype);
jasonWidgetLanguageEL.prototype.constructor = jasonWidgetLanguageEL;

function jasonWidgetLanguageEL() {
    this.search = {
        searchPlaceHolder: 'Όρος αναζήτησης'
    }
    this.filter = {
        values: {
            filterValueIsEqual: 'Ίση με',
            filterValueIsNotEqual: "Δεν είναι ίσο με",
            filterValueStartsWith: "Αρχίζει με",
            filterValueEndsWith: "Τέλειώνει με",
            filterValueContains: "Περιέχει",
            filterValueGreaterThan: "Μεγαλύτερο απο",
            filterValueGreaterEqualTo: "Μεγαλύτερο ίσο απο",
            filterValueLessThan: "Μικρότερο απο",
            filterValueLessEqualTo: "Μικρότερο ίσο απο"
        },
        operators: {
            and: 'Και',
            or:'ή'
        }
    }
    this.data = {
        noData: 'Δεν υπάρχουν δεδομένα'
    }
    this.grid = {
        paging: {
            firstPageButton: 'Πρώτη',
            priorPageButton: 'Προηγούμενη',
            nextPageButton: 'Επόμενη',
            lastPageButton: 'Τελευταία',
            pagerInputTooltip: 'Πληκτρολογήστε αριθμό σελίδας',
            pagerInfoOfRecordCount: 'απο'
        },
        grouping: {
            groupingMessage: 'Σύρετε μια στήλη εδώ , για να ομαδόποιήσετε τα δεδομένα με βάση τη στήλη αυτή',
            removeGrouping: 'Αφαίρεση ομαδόποιησης για '
        },
        filtering: {
            clearButtonText: 'Καθαρισμός',
            clearButtonToollip: 'Καθαρισμός όλων των φίλτρων',
            applyButtonText: 'Εφαρμογή',
            applyButtonTooltip: 'Εφαρμογή του φίλτρου',
            iconTooltip: 'Φιλτράρισμα δεδομένων',
            filterHeaderCaption: "Προβολή τιμών όπου"
        },
        columnMenu: {
            sortAscending: 'Αύξουσα Ταξινόμηση',
            sortDescending: 'Φθίνουσα Ταξινόμηση',
            filter: 'Φίλτρο',
            columns: 'Στήλες',
            clearSorting: "Αναίρεση Ταξινόμησης",
            clearFilters:"Αναίρεση Φίλτρου"
        }
    };
    this.combobox = {
        notFound: 'Ο όρος αναζήτησης [ {0} ] δεν βρέθηκε'
    };
    this.key = "EL";
    this.calendar = {
        days: [
            { name: 'Κυριακή', shortName: 'Κυρ' },
            { name: 'Δευτέρα', shortName: 'Δευ' },
            { name: 'Tρίτη', shortName: 'Tρι' },
            { name: 'Τετάρτη', shortName: 'Τετ' },
            { name: 'Πέμπτη', shortName: 'Πεμ' },
            { name: 'Παρασκευή', shortName: 'Παρ' },
            { name: 'Σάββατο', shortName: 'Σαβ' }
        ],
        months: [
            { name: 'Ιανουάριος', shortName: 'Ιαν' },
            { name: 'Φεβρουάριος', shortName: 'Φεβ' },
            { name: 'Μάρτιος', shortName: 'Μαρ' },
            { name: 'Απρίλιος', shortName: 'Απρ' },
            { name: 'Μαϊος', shortName: 'Μαϊ' },
            { name: 'Ιουνίος', shortName: 'Ιουν' },
            { name: 'Ιούλιος', shortName: 'Ιουλ' },
            { name: 'Αύγουστος', shortName: 'Αυγ' },
            { name: 'Σεπτέμβριος', shortName: 'Σεπ' },
            { name: 'Οκτώβριος', shortName: 'Οκτ' },
            { name: 'Νοέμβριος', shortName: 'Νοε' },
            { name: 'Δεκέμβριος', shortName: 'Δεκ' }
        ]
    };
    this.dialog = {
        buttons: [
            { name: 'btnOK', caption: 'OK' },
            { name: 'btnYes', caption: 'Ναι' },
            { name: 'btnNo', caption: 'Όχι' },
            { name: 'btnCancel', caption: 'Ακύρωση' },
            { name: 'btnAbort', caption: 'Ματαιώση' },
            { name: 'btnRetry', caption: 'Επανάληψη' },
            { name: 'btnIgnore', caption: 'Παράλειψη' },
        ]
    }
    this.numericTextBox = {
        increaseValue: "Αύξηση τιμής",
        decreaseValue: "Μειώση τιμής"
    }
}

jasonWidgets.localizationManager.languages["el"] = new jasonWidgetLanguageEL();
