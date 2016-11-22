/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonWidgetLanguageES.prototype = Object.create(jasonWidgetLanguage.prototype);
jasonWidgetLanguageES.prototype.constructor = jasonWidgetLanguageES;

function jasonWidgetLanguageES() {
    this.search = {
        searchPlaceHolder: 'Escriba un valor para buscar'
    }
    this.filter = {
        values: {
            filterValueIsEqual: 'Igual a',
            filterValueIsNotEqual: "No igual a",
            filterValueStartsWith: "Comienza con",
            filterValueEndsWith: "Termina con",
            filterValueContains: "Contiene",
            filterValueGreaterThan: "Mas grande que",
            filterValueGreaterEqualTo: "Mayor igual a",
            filterValueLessThan: "Menos que",
            filterValueLessEqualTo: "Menos iguales que"
        },
        operators: {
            and: 'Y',
            or: 'O'
        }
    }
    this.data = {
        noData: 'Sin datos'
    }
    this.grid = {
        paging: {
            firstPageButton: 'Primero',
            priorPageButton: 'Anterior',
            nextPageButton: 'Siguiente',
            lastPageButton: "Ultimo",
            pagerInputTooltip: 'Teclear un número de página',
            pagerInfoOfRecordCount: 'de'

        },
        grouping: {
            groupingMessage: 'Arrastre una columna aquí para agrupar los datos en función de esa columna.',
            removeGrouping: 'Eliminar la agrupación de '
        },
        filtering: {
            clearButtonText: 'Claro',
            clearButtonToollip: 'Borrar todos los filtros',
            applyButtonText: 'Applicar',
            applyButtonTooltip: 'Applicar filtro',
            iconTooltip: 'Filtrado de datos',
            filterHeaderCaption: "Mostrar valores en donde"
        },
        columnMenu: {
            sortAscending: 'Orden ascendente',
            sortDescending: 'Orden descendiente',
            filter: 'Filtrar',
            columns: 'Columnas',
            clearSorting: "Claro ordenación",
            clearFilters: "Eliminar filtros"
        }
    };
    this.combobox = {
        notFound: 'Término de búsqueda [{0}] no encontrado'
    };
    this.key = "ES";
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
            { name: 'Enero', shortName: 'Genn' },
            { name: 'Febrero', shortName: 'Febbr' },
            { name: 'Marzo', shortName: 'Mar' },
            { name: 'Abril', shortName: 'Apr' },
            { name: 'Mayo', shortName: 'Magg' },
            { name: 'Junio', shortName: 'Giu' },
            { name: 'Julio', shortName: 'Lug' },
            { name: 'Agosto', shortName: 'Ago' },
            { name: 'Septiembre', shortName: 'Sett' },
            { name: 'Octubre', shortName: 'Ott' },
            { name: 'Noviembre', shortName: 'Nov' },
            { name: 'Diciembre', shortName: 'Dic' }
        ]
    };

    this.dialog = {
        buttons: [
            { name: 'btnOK', caption: 'OK' },
            { name: 'btnYes', caption: 'Sì' },
            { name: 'btnNo', caption: 'No' },
            { name: 'btnCancel', caption: 'Cancelar' },
            { name: 'btnAbort', caption: 'Abortar' },
            { name: 'btnRetry', caption: 'Rever' },
            { name: 'btnIgnore', caption: 'Ignorar' },
        ]
    }
    this.numericTextBox = {
        increaseValue: "Aumentar el valor",
        decreaseValue: "Disminuye el valor"
    }
}

jasonWidgets.localizationManager.languages["es"] = new jasonWidgetLanguageES();
