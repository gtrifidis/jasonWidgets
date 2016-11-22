/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonWidgetCultureEN_US.prototype = Object.create(jasonWidgetCulture.prototype);
jasonWidgetCultureEN_US.prototype.constructor = jasonWidgetCultureEN_US;

function jasonWidgetCultureEN_US() {
    this.dateFormat = "MM/dd/yyyy";
    this.shortDateFormat = "MMM dd yyyy";
    this.longDateFormat = "dddd MMMM dd yyyy";
    this.timeFormat = "hh:mm:ss"
    this.postMeridiem = [];
    this.anteMeridiem = [];
    this.currencyCode = "USD";
    this.key = "en-US";
}


jasonWidgets.localizationManager.cultures["en-US"] = new jasonWidgetCultureEN_US();