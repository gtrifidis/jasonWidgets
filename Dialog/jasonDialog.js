/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonDialog.prototype = Object.create(jasonBaseWidget.prototype);
jasonDialog.prototype.constructor = jasonDialog;

var
    JW_ON_DIALOG_SHOW = "onDialogShow",
    JW_ON_DIALOG_HIDE = "onDialogHide",
    JW_ON_DIALOG_BUTTON_CLICK = "onDialogButtonClick";

/**
 * @class
 * @ignore 
 * @name jasonDialoglOptions
 * @memberOf Containers
 * @augments Common.jasonWidgetOptions
 * @property {boolean} [modal=false] - If true the dialog will be shown in a modal mode.
 * @property {object} [buttons={btnOk:true}] - Dialog buttons configuration.
 * @property {boolean} [buttons.btnOk = true] - If true the OK button will be displayed.
 * @property {boolean} [buttons.btnCancel = false] - If true the Cancel button will be displayed.
 * @property {boolean} [buttons.btnNo = false] - If true the No button will be displayed.
 * @property {boolean} [buttons.btnYes = false] - If true the Yes button will be displayed.
 * @property {boolean} [resizeable = false] - If true the user can resize the window.
 * @property {boolean} [draggable = false] - If true the user can move the window.
 * @property {number} [top = undefined] - Set the top coordinates for the dialog.
 * @property {number} [left = undefined] - Set the left coordinates for the dialog.
 * @property {number} [height = undefined] - Set the height for the dialog.
 * @property {number} [width = undefined] - Set the width for the dialog.
 * @property {HTMLElement} [blockTarget = window] - If set and the dialog is modal it will block the contents behind the dialog.
 */


/**
 * @class
 * @name jasonDialogEvents
 * @memberOf Containers
 * @description List of jasonCalendar events
 * @property {function} onDialogShow - function(sender: jasonDialog)
 * @property {function} onDialogHide - function(sender: jasonDialog)
 * @property {function} onDialogButtonClick - function(sender: jasonDialog,button:string)
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
    this.defaultOptions = {
        height: 300,
        width:400
    };
    jasonBaseWidget.call(this, "jasonDialog", htmlElement, options, jasonDialogUIHelper);
    this.ui.renderUI();
    this.ui.hide();
}

/**
 * Shows the dialog.
 */
jasonDialog.prototype.show = function () {
    this.ui.renderUI();
    this.ui.show();
    this.triggerEvent(JW_ON_DIALOG_SHOW, this);
}

/**
 * Hides the dialog.
 */
jasonDialog.prototype.hide = function () {
    this.ui.hide();
    this.triggerEvent(JW_ON_DIALOG_HIDE, this);
}

jasonDialogUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonDialogUIHelper.prototype.constructor = jasonDialogUIHelper;

var
    DIALOG_CONTAINER = "jw-dialog-container",
    DIALOG_HEADER = "jw-dialog-header",
    DIALOG_BODY   = "jw-dialog-body",
    DIALOG_FOOTER = "jw-dialog-footer";
/**
 * jasonDialog UI widget helper.
 * @constructor
 * @ignore
 */
function jasonDialogUIHelper(widget, htmlElement) {
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);
    this.blockUI = new jasonBlockUI();
}
/**
 * Renders dialog's controls. HTML.
 */
jasonDialogUIHelper.prototype.renderUI = function () {
    if (!this.dialogContainer) {
        this.dialogContainer = this.createElement("DIV");
        this.dialogContainer.classList.add(DIALOG_CONTAINER);
        this.htmlElement.parentNode.removeChild(this.htmlElement);
        

        this.dialogHeader = this.createElement("DIV");
        this.dialogHeader.classList.add(DIALOG_HEADER);

        this.dialogBody = this.createElement("DIV");
        this.dialogBody.appendChild(this.htmlElement);
        this.dialogBody.classList.add(DIALOG_BODY);

        this.dialogFooter = this.createElement("DIV");
        this.dialogFooter.classList.add(DIALOG_FOOTER);

        this.dialogContainer.appendChild(this.dialogHeader);
        this.dialogContainer.appendChild(this.dialogBody);
        this.dialogContainer.appendChild(this.dialogFooter);
        document.body.appendChild(this.dialogContainer);
    }
}
/**
 * Shows the dialog.
 */
jasonDialogUIHelper.prototype.show = function () {
    if(this.options.modal)
        this.blockUI.block(this.options.blockTarget);
    if (this.options.width)
        this.dialogContainer.style.width = this.options.width + "px";
    if (this.options.height)
        this.dialogContainer.style.height = this.options.height + "px";
    this.dialogContainer.style.display = "";

    var centerLeft = (window.innerWidth / 2) - (this.dialogContainer.offsetWidth / 2);
    var centerTop = (window.innerHeight / 2) - (this.dialogContainer.offsetHeight / 2);
    this.dialogContainer.style.top = this.options.top ? this.options.top + "px" : centerTop + "px";
    this.dialogContainer.style.left = this.options.left ? this.options.left + "px" : centerLeft + "px";
    

}
/**
 * Hides the dialog.
 */
jasonDialogUIHelper.prototype.hide = function () {
    this.dialogContainer.style.display = "none";
    this.blockUI.unBlock();
}
