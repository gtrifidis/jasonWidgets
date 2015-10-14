/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/**
 * Helper class to benchmark performance
 */
function jasonBenchMark() {
    this.startTime = null;
    this.stopTime = null;
    jasonBenchMark.prototype.Start = function () {
        this.startTime = new Date().getTime();
    }
    jasonBenchMark.prototype.Stop = function (outputMessage) {
        this.stopTime = new Date().getTime();
        var ellapsedTime = this.stopTime - this.startTime;
        var outMsg = outputMessage ? jasonWidgets.common.formatString(outputMessage,[ellapsedTime]) : "Operation completed in " + ellapsedTime + " miliseconds";
        console.log(outMsg);
    }
}
jasonWidgets.benchMark = new jasonBenchMark();