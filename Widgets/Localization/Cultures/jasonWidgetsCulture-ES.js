/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonWidgetCultureES.prototype = Object.create(jasonWidgetCulture.prototype);
jasonWidgetCultureES.prototype.constructor = jasonWidgetCultureES;

function jasonWidgetCultureES() {
    this.dateFormat = "dd/MM/yyyy";
    this.shortDateFormat = "dd MMM YYYY";
    this.longDateFormat = "dd MMMM yyyy";
    this.timeFormat = "hh:mm:ss"
    this.postMeridiem = [];
    this.anteMeridiem = [];
    this.currencyCode = "EUR";
    this.key = "es";
}


jasonWidgets.localizationManager.cultures["es"] = new jasonWidgetCultureES();