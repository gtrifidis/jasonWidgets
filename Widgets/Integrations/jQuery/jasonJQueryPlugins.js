/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @interface
 * @name jQuery
 * @property {jQueryPlugin} jasonGrid - jQuery plugin for the jasonGrid widget.
 * @property {jQueryPlugin} jasonCombobox - jQuery plugin for the jasonCombobox widget.
 * @property {jQueryPlugin} jasonTabControl - jQuery plugin for the jasonTabControl widget.
 * @property {jQueryPlugin} jasonMenu - jQuery plugin for the jasonMenu widget.
 * @property {jQueryPlugin} jasonContextMenu - jQuery plugin for the jasonContextMenu widget.
 * @property {jQueryPlugin} jasonCalendar - jQuery plugin for the jasonCalendar widget.
 * @property {jQueryPlugin} jasonDatePicker - jQuery plugin for the jasonDatePicker widget.
 * @property {jQueryPlugin} jasonTimePicker - jQuery plugin for the jasonTimePicker widget.
 * @property {jQueryPlugin} jasonDateTimePicker - jQuery plugin for the jasonDateTimePicker widget.
 * @property {jQueryPlugin} jasonDialog - jQuery plugin for the jasonDialog widget.
 * @property {jQueryPlugin} jasonDropDownListButton - jQuery plugin for the jasonDropDownListButton widget.
 * @property {jQueryPlugin} jasonPopover - jQuery plugin for the jasonPopover widget.
 * @property {jQueryPlugin} jasonButton - jQuery plugin for the jasonButton widget.
 * @property {jQueryPlugin} jasonButtonTextBox - jQuery plugin for the jasonButtonTextbox widget.
 */
(function ($) {
    //if jQuery exists.
    if ($) {
        $.fn.jasonGrid = function (options) {
            var self = this;
            var jWidget = self.data("jasonGrid");
            if (jWidget) {
                self.removeData("jasonGrid");
            }
            jWidget = new jasonGrid(self[0], options);
            self.data("jasonGrid", jWidget);
        }
        $.fn.jasonCombobox = function (options) {
            var self = this;
            var jWidget = self.data("jasonCombobox");
            if (jWidget) {
                self.removeData("jasonCombobox");
            }
            jWidget = new jasonCombobox(self[0], options);
            self.data("jasonCombobox", jWidget);
        }
        $.fn.jasonTabControl = function (options) {
            var self = this;
            var jWidget = self.data("jasonTabControl");
            if (jWidget) {
                self.removeData("jasonTabControl");
            }
            jWidget = new jasonTabControl(self[0], options);
            self.data("jasonTabControl", jWidget);
        }
        $.fn.jasonMenu = function (options) {
            var self = this;
            var jWidget = self.data("jasonMenuWidget");
            if (jWidget) {
                self.removeData("jasonMenuWidget");
            }
            jWidget = new jasonMenu(self[0], options, jasonMenuUIHelper);
            self.data("jasonMenuWidget", jWidget);
        }
        $.fn.jasonContextMenu = function (options) {
            var self = this;
            var jWidget = self.data("jasonContextMenu");
            if (jWidget) {
                self.removeData("jasonContextMenu");
            }
            jWidget = new jasonMenu(self[0], options, jasonContextMenuUIHelper);
            self.data("jasonContextMenu", jWidget);
        }
        $.fn.jasonCalendar = function (options) {
            var self = this;
            var jWidget = self.data("jasonCalendar");
            if (jWidget) {
                self.removeData("jasonCalendar");
            }
            jWidget = new jasonCalendar(self[0], options);
            self.data("jasonCalendar", jWidget);
        }
        $.fn.jasonDatePicker = function (options) {
            var self = this;
            var jWidget = self.data("jasonDatePicker");
            if (jWidget) {
                self.removeData("jasonDatePicker");
            }
            jWidget = new jasonDatePicker(self[0], options);
            self.data("jasonDatePicker", jWidget);
        }
        $.fn.jasonTimePicker = function (options) {
            var self = this;
            var jWidget = self.data("jasonTimePicker");
            if (jWidget) {
                self.removeData("jasonTimePicker");
            }
            jWidget = new jasonTimePicker(self[0], options);
            self.data("jasonTimePicker", jWidget);
        }
        $.fn.jasonDateTimePicker = function (options) {
            var self = this;
            var jWidget = self.data("jasonDateTimePicker");
            if (jWidget) {
                self.removeData("jasonDateTimePicker");
            }
            jWidget = new jasonDateTimePicker(self[0], options);
            self.data("jasonDateTimePicker", jWidget);
        }
        $.fn.jasonDialog = function (options) {
            var self = this;
            var jWidget = self.data("jasonDialog");
            if (jWidget) {
                self.removeData("jasonDialog");
            }
            jWidget = new jasonDialog(self[0], options);
            self.data("jasonDialog", jWidget);
        }
        $.fn.jasonDropDownListButton = function (options) {
            var self = this;
            var jWidget = self.data("jasonDropDownListButton");
            if (jWidget) {
                self.removeData("jasonDropDownListButton");
            }
            jWidget = new jasonDropDownListButton(self[0], options);
            self.data("jasonDropDownListButton", jWidget);
        }
        $.fn.jasonPopover = function (options) {
            var self = this;
            var jWidget = self.data("jasonPopover");
            if (jWidget) {
                self.removeData("jasonPopover");
            }
            jWidget = new jasonPopover(self[0], options);
            self.data("jasonPopover", jWidget);
        }
        $.fn.jasonButton = function (options) {
            var self = this;
            var jWidget = self.data("jasonButton");
            if (jWidget) {
                self.removeData("jasonButton");
            }
            jWidget = new jasonButton(self[0], options);
            self.data("jasonButton", jWidget);
        }
        $.fn.jasonButtonTextBox = function (options) {
            var self = this;
            var jWidget = self.data("jasonButtonTextbox");
            if (jWidget) {
                self.removeData("jasonButtonTextbox");
            }
            jWidget = new jasonButtonTextbox(self[0], options);
            self.data("jasonButtonTextbox", jWidget);
        }
        $.fn.jasonTextbox = function (options) {
            var self = this;
            var jWidget = self.data("jasonTextbox");
            if (jWidget) {
                self.removeData("jasonTextbox");
            }
            jWidget = new jasonTextbox(self[0], options);
            self.data("jasonTextbox", jWidget);
        }

        $.fn.jasonNumericTextbox = function (options) {
            var self = this;
            var jWidget = self.data("jasonNumericTextbox");
            if (jWidget) {
                self.removeData("jasonNumericTextbox");
            }
            jWidget = new jasonNumericTextbox(self[0], options);
            self.data("jasonNumericTextbox", jWidget);
        }

    }
})(window.jQuery ? window.jQuery : null);