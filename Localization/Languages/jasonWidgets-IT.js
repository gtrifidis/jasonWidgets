/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonWidgetLanguageIT.prototype = Object.create(jasonWidgetLanguage.prototype);
jasonWidgetLanguageIT.prototype.constructor = jasonWidgetLanguageIT;

function jasonWidgetLanguageIT() {
    this.search = {
        searchPlaceHolder: 'Digitare un valore per la ricerca'
    }
    this.filter = {
        values: {
            filterValueIsEqual: 'Uguale a',
            filterValueIsNotEqual: "Non uguale a",
            filterValueStartsWith: "Inizia con",
            filterValueEndsWith: "Finisce con",
            filterValueContains: "Contiene",
            filterValueGreaterThan: "Più grande di",
            filterValueGreaterEqualTo: "Maggiore pari a",
            filterValueLessThan: "Meno di",
            filterValueLessEqualTo: "Meno uguali degli"
        },
        operators: {
            and: 'e',
            or: 'O'
        }
    }
    this.data = {
        noData: 'Nessun dati'
    }
    this.grid = {
        paging: {
            firstPageButton: 'Primo',
            priorPageButton: 'Precedente',
            nextPageButton: 'Prossimo',
            lastPageButton: "Ultimo",
            pagerInputTooltip: 'Digitare un numero di pagina',
            pagerInfoOfRecordCount: 'di'

        },
        grouping: {
            groupingMessage: 'Trascinare una colonna qui, per raggruppare i dati in base a quella colonna',
            removeGrouping: 'Rimuovere raggruppamento per '
        },
        filtering: {
            clearButtonText: 'Cancella',
            clearButtonToollip: 'Cancella tutti i filtri',
            applyButtonText: 'Applica',
            applyButtonTooltip: 'Applica il filtro',
            iconTooltip: 'Filtraggio dei dati',
            filterHeaderCaption: "Mostra i valori in cui"
        },
        columnMenu: {
            sortAscending: 'Ordine crescente',
            sortDescending: 'Ordine decrescente',
            filter: 'Filtro',
            columns: 'Colonne',
            clearSorting: "Cancella ordinamento",
            clearFilters: "Cancella filtri"
        }
    };
    this.combobox = {
        notFound: 'Il termino di ricerca [ {0} ] non trovato'
    };
    this.key = "IT";
    this.calendar = {
        days: [
            { name: 'Domenica', shortName: 'Dom' },
            { name: 'Lunedi', shortName: 'Lun' },
            { name: 'Martedi', shortName: 'Mar' },
            { name: 'Mercoledi', shortName: 'Mer' },
            { name: 'Giovedi', shortName: 'Gio' },
            { name: 'Venerdi', shortName: 'Ven' },
            { name: 'Sabato', shortName: 'Sab' }
        ],
        months: [
            { name: 'Gennaio', shortName: 'Genn' },
            { name: 'Febbraio', shortName: 'Febbr' },
            { name: 'Marzo', shortName: 'Mar' },
            { name: 'Aprile', shortName: 'Apr' },
            { name: 'Maggio', shortName: 'Magg' },
            { name: 'Giugno', shortName: 'Giu' },
            { name: 'Luglio', shortName: 'Lug' },
            { name: 'Agosto', shortName: 'Ago' },
            { name: 'Settembre', shortName: 'Sett' },
            { name: 'Ottobre', shortName: 'Ott' },
            { name: 'Novembre', shortName: 'Nov' },
            { name: 'Dicembre', shortName: 'Dic' }
        ]
    };
}

jasonWidgets.localizationManager.languages["it"] = new jasonWidgetLanguageIT();
