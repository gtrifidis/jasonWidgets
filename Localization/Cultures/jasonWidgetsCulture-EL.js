﻿/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonWidgetCultureEL.prototype = Object.create(jasonWidgetCulture.prototype);
jasonWidgetCultureEL.prototype.constructor = jasonWidgetCultureEL;

function jasonWidgetCultureEL() {
    this.dateFormat = "dd/MM/yyyy";
    this.shortDateFormat = "dd MMM YYYY";
    this.longDateFormat = "dd MMMM yyyy";
    this.timeFormat = "hh:mm:ss"
    this.postMeridiem = [];
    this.anteMeridiem = [];
}


jasonWidgets.localizationManager.cultures["el"] = new jasonWidgetCultureEL();