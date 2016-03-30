/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonDialog.prototype = Object.create(jasonBaseWidget.prototype);
jasonDialog.prototype.constructor = jasonDialog;

var
    JW_ON_DIALOG_SHOW = "onDialogShow",
    JW_ON_DIALOG_CLOSE = "onDialogCLose";

/**
 * @class
 * @ignore 
 * @name jasonDialoglOptions
 * @memberOf Containers
 * @augments Common.jasonWidgetOptions
 * @property {event} onDialogShow - Occurs when dialog is shown.
 * @property {event} onDialogClose - Occurs when dialog is closed.
 */

/**
 * @constructor
 * @ignore
 * @memberOf Containers
 * @augments Common.jasonBaseWidget
 * @param {HTMLElement} htmlElement - DOM element that will contain the tabcontrol.
 * @param {Containers.jasonDialoglOptions} options - Dialog control options. 
 */
function jasonDialog(htmlElement, options) {
    jasonBaseWidget.call(this, "jasonDialog", htmlElement, options, jasonDialogWidgetUIHelper);
    this.ui.renderUI();
}


jasonDialogWidgetUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonDialogWidgetUIHelper.prototype.constructor = jasonDialogWidgetUIHelper;

var
    DIALOG_CONTAINER = "jw-dialog-container",
    DIALOG_HEADER = "jw-dialog-header",
    DIALOG_FOOTER = "jw-dialog-footer";
/**
 * jasonDialog UI widget helper.
 * @constructor
 * @ignore
 */
function jasonDialogWidgetUIHelper(widget, htmlElement) {
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);
}
/**
 * Renders dialog's controls. HTML.
 */
jasonDialogWidgetUIHelper.prototype.renderUI = function () {
    if (!this.dialogContainer) {
        this.dialogContainer = this.createElement("DIV");
        this.htmlElement.parent.replaceChild(this.dialogContainer, this.htmlElement);
        this.dialogHeader = this.createElement("DIV");
        this.dialogBody = this.createElement("DIV");
        this.dialogBody.appendChild(this.htmlElement);
        this.dialogFooter = this.createElement("DIV");

        this.dialogContainer.appendChild(this.dialogHeader);
        this.dialogContainer.appendChild(this.dialogBody);
        this.dialogContainer.appendChild(this.dialogFooter);
    }
}

