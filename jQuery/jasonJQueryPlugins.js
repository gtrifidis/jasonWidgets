/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @interface
 * @name jQuery
 * @property {function} jasonGrid - Example @sample $("#jasonGridDemo").jasonGrid({
            data: gridData, columns: [
                {
                    caption: 'Id', fieldName: 'Id', dataType: 'number', width: 150
                }, {
                    caption: 'First Name', fieldName: 'FirstName', width: 700
                }, {
                    caption: 'Last Name', fieldName: 'LastName', width: 350
                },
                {
                    caption: 'City', fieldName: 'City', width: 550
                },
                {
                    caption: 'Title', fieldName: 'Title'
                }
            ],
            paging: { pagesize: 500 }, multiSelect: true, grouping: true, filtering: true, resizing: true, sorting: { multiple: true },
            customization: { rowTemplate: '' }
        });
 * @property {function} jasonCombobox - Example @sample $("#jasonComboBox").jasonCombobox({ data: self.data.slice(0, 99), keyFieldName: 'id', displayFields: ['first_name', 'last_name'], displayFormatString: '{0},{1}', placeholder: "Search", autoFilter: true });
 * @property {function} jasonTabControl - Example @sample $("#jasonTabControlDemo").jasonTabControl({ pageHeight: 750 });
 * @property {function} jasonMenu - Example @sample $("#jasonMenuWidgetDemo").jasonMenu({ animation: { speed: 9 }, orientation: 'horizontal'});
 * @property {function} jasonContextMenu - Example @sample $("#contextMenuDemo").jasonContextMenu({ target: $("#contextMenuDemoTarget")[0] });
 * @property {function} jasonCalendar - Example @sample  $("#jasonCalendarWidget").jasonCalendar({
            firstDayOfWeek: 5,
            multiSelect: true,
            rangeSelect: false,
            specialDates: [
                { date: '1978/11/09', tooltip: 'My birthday', cssClass: 'test' },
                { date: '2000/12/25', tooltip: 'Christmas', recurring: true }
            ]
        });
 * @property {function} jasonDatePicker - Example @sample $("#datePicker").jasonDatePicker({ placeholder: 'Type in a date', displayFormat: 'dd/MM/yyyy' });
 * @property {function} jasonTimePicker - Example @sample $("#timePicker").jasonTimePicker({ placeholder: 'Type in a time' });
 */
(function ($) {
    //if jQuery exists.
    if ($) {
        $.fn.jasonGrid = function (options) {
            var self = this;
            var jGrid = self.data("jasonGrid");
            if (jGrid) {
                self.removeData(jGrid);
            }
            jGrid = new jasonGrid(self[0], options);
            self.data("jasonGrid", jGrid);
        }
        $.fn.jasonCombobox = function (options) {
            var self = this;
            var jCombobox = self.data("jasonCombobox");
            if (jCombobox) {
                self.removeData(jCombobox);
            }
            jCombobox = new jasonCombobox(self[0], options);
            self.data("jasonCombobox", jCombobox);
        }
        $.fn.jasonTabControl = function (options) {
            var self = this;
            var jTabControl = self.data("jasonTabControl");
            if (jTabControl) {
                self.removeData(jTabControl);
            }
            jTabControl = new jasonTabControl(self[0], options);
            self.data("jasonTabControl", jTabControl);
        }
        $.fn.jasonMenu = function (options) {
            var self = this;
            var jMenuWidget = self.data("jasonMenuWidget");
            if (jMenuWidget) {
                self.removeData(jMenuWidget);
            }
            jMenuWidget = new jasonMenu(self[0], options,jasonMenuUIHelper);
            self.data("jasonMenuWidget", jMenuWidget);
        }
        $.fn.jasonContextMenu = function (options) {
            var self = this;
            var jContextMenuWidget = self.data("jasonContextMenu");
            if (jContextMenuWidget) {
                self.removeData(jContextMenuWidget);
            }
            jContextMenuWidget = new jasonMenu(self[0], options, jasonContextMenuUIHelper);
            self.data("jasonContextMenu", jContextMenuWidget);
        }
        $.fn.jasonCalendar = function (options) {
            var self = this;
            var jCalendarWidget = self.data("jasonCalendar");
            if (jCalendarWidget) {
                self.removeData(jCalendarWidget);
            }
            jCalendarWidget = new jasonCalendar(self[0], options);
            self.data("jasonCalendar", jCalendarWidget);
        }
        $.fn.jasonDatePicker = function (options) {
            var self = this;
            var jDatePikcerWidget = self.data("jasonDatePicker");
            if (jDatePikcerWidget) {
                self.removeData(jDatePikcerWidget);
            }
            jDatePikcerWidget = new jasonDatePicker(self[0], options);
            self.data("jasonDatePicker", jDatePikcerWidget);
        }
        $.fn.jasonTimePicker = function (options) {
            var self = this;
            var jTimePikcerWidget = self.data("jasonTimePicker");
            if (jTimePikcerWidget) {
                self.removeData(jTimePikcerWidget);
            }
            jTimePikcerWidget = new jasonTimePicker(self[0], options);
            self.data("jasonTimePicker", jTimePikcerWidget);
        }
    }
})(window.jQuery ? window.jQuery : null);