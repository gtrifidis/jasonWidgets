/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonWidgetLanguageEL.prototype = Object.create(jasonWidgetLanguage.prototype);
jasonWidgetLanguageEL.prototype.constructor = jasonWidgetLanguageEL;

function jasonWidgetLanguageEL() {
    this.Search = {
        SearchPlaceHolder: 'Όρος αναζήτησης'
    }
    this.Filter = {
        Values: {
            FilterValueIsEqual: 'Ίση με',
            FilterValueIsNotEqual: "Δεν είναι ίσο με",
            FilterValueStartsWith: "Αρχίζει με",
            FilterValueEndsWith: "Τέλειώνει με",
            FilterValueContains: "Περιέχει",
            FilterValueGreaterThan: "Μεγαλύτερο απο",
            FilterValueGreaterEqualTo: "Μεγαλύτερο ίσο απο",
            FilterValueLessThan: "Μικρότερο απο",
            FilterValueLessEqualTo: "Μικρότερο ίσο απο"
        },
        Operators: {
            And: 'Και',
            Or:'ή'
        }
    }
    this.Data = {
        NoData: 'Δεν υπάρχουν δεδομένα'
    }
    this.Grid = {
        Paging: {
            FirstPageButton: 'Πρώτη',
            PriorPageButton: 'Προηγούμενη',
            NextPageButton: 'Επόμενη',
            LastPageButton: 'Τελευταία',
            PagerInputTooltip: 'Πληκτρολογήστε αριθμό σελίδας'
        },
        Grouping: {
            GroupingMessage: 'Σύρετε μια στήλη εδώ , για να ομαδόποιήσετε τα δεδομένα με βάση τη στήλη αυτή',
            RemoveGrouping: 'Αφαίρεση ομαδόποιησης για '
        },
        Filtering: {
            ClearButtonText: 'Καθαρισμός',
            ClearButtonToollip: 'Καθαρισμός όλων των φίλτρων',
            ApplyButtonText: 'Εφαρμογή',
            ApplyButtonTooltip: 'Εφαρμογή του φίλτρου',
            IconTooltip: 'Φιλτράρισμα δεδομένων',
            FilterHeaderCaption: "Προβολή τιμών όπου"
        },
        ColumnMenu: {
            SortAscending: 'Αύξουσα Ταξινόμηση',
            SortDescending: 'Φθίνουσα Ταξινόμηση',
            Filter: 'Φίλτρο',
            Columns:'Στήλες'
        }
    };
    this.Combobox = {
        NotFound: 'Ο όρος αναζήτησης [ {0} ] δεν βρέθηκε'
    };
    this.Key = "EL";
}

jasonWidgets.localizationManager.Languages["EL"] = new jasonWidgetLanguageEL();
