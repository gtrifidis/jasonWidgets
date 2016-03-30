/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonWidgetCultureIT.prototype = Object.create(jasonWidgetCulture.prototype);
jasonWidgetCultureIT.prototype.constructor = jasonWidgetCultureIT;

function jasonWidgetCultureIT() {
    this.dateFormat = "dd/MM/yyyy";
    this.shortDateFormat = "dd MMM YYYY";
    this.longDateFormat = "dd MMMM yyyy";
    this.timeFormat = "hh:mm:ss"
    this.postMeridiem = [];
    this.anteMeridiem = [];
}


jasonWidgets.localizationManager.cultures["IT"] = new jasonWidgetCultureIT();