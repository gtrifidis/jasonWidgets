/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function ($) {
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
    $.fn.jasonMenuWidget = function (options) {
        var self = this;
        var jMenuWidget = self.data("jasonMenuWidget");
        if (jMenuWidget) {
            self.removeData(jMenuWidget);
        }
        jMenuWidget = new jasonMenuWidget(self[0], options);
        self.data("jasonMenuWidget", jMenuWidget);
    }
    $.fn.jasonContextMenuWidget = function (options) {
        var self = this;
        var jContextMenuWidget = self.data("jasonContextMenuWidget");
        if (jContextMenuWidget) {
            self.removeData(jContextMenuWidget);
        }
        jContextMenuWidget = new jasonContextMenuWidget(self[0], options);
        self.data("jasonContextMenuWidget", jContextMenuWidget);
    }
    $.fn.jasonCalendarWidget = function (options) {
        var self = this;
        var jCalendarWidget = self.data("jasonCalendarWidget");
        if (jCalendarWidget) {
            self.removeData(jCalendarWidget);
        }
        jCalendarWidget = new jasonCalendarWidget(self[0], options);
        self.data("jasonCalendarWidget", jCalendarWidget);
    }
})(jQuery);