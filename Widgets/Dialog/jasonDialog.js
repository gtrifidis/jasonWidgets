/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonDialog.prototype = Object.create(jasonBaseWidget.prototype);
jasonDialog.prototype.constructor = jasonDialog;

/**
 * @class
 * @name jasonDialogOptions
 * @memberOf Containers
 * @augments Common.jasonWidgetOptions
 * @property {boolean} [modal=false] - If true the dialog will be shown in a modal mode.
 * @property {string} [title=undefined] - Dialog's title.
 * @property {Containers.jasonDialogButton[]} [buttons = undefined] - Dialog buttons configuration.
 * @property {boolean} [resizeable = false] - If true the user can resize the window.
 * @property {object}   animation            - Animation configuration. 
 * @property {number}   [animation.delay=5]      - Numeric value to define animation delay. Range is 1-10.
 * @property {boolean} [draggable = false] - If true the user can move the window.
 * @property {boolean} [closeButton = true] - If true a close button will appear on the dialog header.
 * @property {number|string} [top = undefined] - Set the top coordinates for the dialog.
 * @property {number|string} [left = undefined] - Set the left coordinates for the dialog.
 * @property {number|string} [height = undefined] - Set the height for the dialog.
 * @property {number|string} [width = undefined] - Set the width for the dialog.
 * @property {number|string} [minWidth = 140] - Set the minimum width for the dialog.
 * @property {number|string} [minHeight = 170] - Set the minimum height for the dialog.
 * @property {HTMLElement} [blockTarget = window] - If set and the dialog is modal it will block the contents behind the dialog.
 * @property {object} model - Dialog's model. It will be used when rendering header and body templates.
 * @property {object} customization - Widget's customization configuration.
 * @property {string|function} customization.headerTemplate - HTML string or script tag or function containing HTML to be used to render the dialog header.
 * @property {string|function} customization.bodyTemplate - HTML string or script tag or function containing HTML to be used to render the dialog header.
 */

/**
 * @readonly
 * @enum {number}
 * @memberOf Containers
 * @description Result of a jason dialog button.
 */
var jasonDialogButtonResult = {
    OK: 1,
    CANCEL: 2,
    NO: 3,
    YES: 4,
    ABORT: 5,
    RETRY: 6,
    IGNORE: 7
}

/**
 * @class
 * @name jasonDialogButton
 * @memberOf Containers
 * @description JasonDialog button.
 * 
 * @property {Containers.jasonDialogButtonResult} result - Result of the button when clicked.
 * @property {string} caption - Caption of the button.
 * @property {string} title - Title of the button.
 * @property {boolean} [controlsDialogClose=false] - If set to true the dialog will not close automatically.It will be determined on the click event listener of that button.
 */

/**
 * @event Containers.jasonDialog#onDialogButtonClick
 * @type {object}
 * @description Occurs when a dialog button is clicked.
 * @property {Containers.jasonDialog} sender - The dialog instance.
 * @property {Containers.jasonDialogButton} value - The button that was clicked.
 */
/**
 * @event Containers.jasonDialog#onShow
 * @description Occurs when dialog is shown and all animations have been completed.
 * @type {object}
 * @property {Containers.jasonDialog} sender - The dialog instance.
 */
/**
 * @event Containers.jasonDialog#onHide
 * @description Occurs when dialog is hidden and all animations have been completed. 
 * @type {object}
  * @property {Containers.jasonDialog} sender - The dialog instance.
 */

/**
 * @constructor
 * @memberOf Containers
 * @augments Common.jasonBaseWidget
 * @param {HTMLElement} htmlElement - DOM element that will contain the Dialog.
 * @param {Containers.jasonDialogOptions} options - Dialog control options. 
 * @fires Containers.jasonDialog#event:onDialogButtonClick
 * @fires Containers.jasonDialog#event:onShow
 * @fires Containers.jasonDialog#event:onHide
 */
function jasonDialog(htmlElement, options) {
    this.defaultOptions = {
        height: 300,
        width: 400,
        closeButton: true,
        resizeable: false,
        draggable: false,
        modal:false,
        buttons: [],
        model: null,
        minWidth: 140,
        minHeight:170,
        customization: {
            headerTemplate: null,
            bodyTemplate: null,
            dataFieldAttribute: "data-field"
        }
    };
    this._initializeTemplates(options);
    jasonBaseWidget.call(this, "jasonDialog", htmlElement, options, jasonDialogUIHelper);
 }

/**
 * Shows the dialog.
 */
jasonDialog.prototype.show = function () {
    this.ui.renderUI();
    this.ui.show();
}
/**
 * Hides the dialog.
 */
jasonDialog.prototype.hide = function () {
    this.ui.hide();
}
/**
 * Initializing customization templates.
 * @ignore
 */
jasonDialog.prototype._initializeTemplates = function (options) {
    /*initializing header and body templates*/
    var template = (typeof options.customization.headerTemplate == "function") ? options.customization.headerTemplate() : options.customization.headerTemplate;
    var isElement = document.getElementById(template);
    if (isElement) {
        template = isElement.tagName == "SCRIPT" ? isElement.innerHTML : isElement.outerHTML;
    }
    else {
        template = typeof template == "string" && template.trim().length > 0 ? template : null;
    }
    options.customization.headerTemplate = template;

    template = (typeof options.customization.bodyTemplate == "function") ? options.customization.bodyTemplate() : options.customization.bodyTemplate;
    isElement = document.getElementById(template);
    if (isElement) {
        template = isElement.tagName == "SCRIPT" ? isElement.innerHTML : isElement.outerHTML;
    }
    else {
        template = typeof template == "string" && template.trim().length > 0 ? template : null;
    }
    options.customization.bodyTemplate = template;

}

jasonDialogUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonDialogUIHelper.prototype.constructor = jasonDialogUIHelper;

/**
 * jasonDialog UI widget helper.
 * @constructor
 * @ignore
 */
function jasonDialogUIHelper(widget, htmlElement) {

    this._onDialogButtonClick = this._onDialogButtonClick.bind(this);
    this._dialogInCenter = this._dialogInCenter.bind(this);
    this.resizeEventListenerId = null;
    this.existingBlockedDialogInstance = null;
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);
}
/**
 * Renders dialog's controls. HTML.
 */
jasonDialogUIHelper.prototype.renderUI = function () {
    if (!this.dialogContainer) {
        this.dialogContainer = this.createElement("DIV");
        this.dialogContainer.style.display = "none";
        this.dialogContainer.classList.add(jw.DOM.classes.JW_DIALOG_CONTAINER);
        this.dialogContainer.jasonWidgetsData = [].concat(this.htmlElement.jasonWidgetsData);
        this.dialogContainer.setAttribute(jw.DOM.attributes.DRAGGABLE_ATTR, "false");
        this.htmlElement.parentNode.removeChild(this.htmlElement);
        this.blockUI = new jasonBlockUI(this.dialogContainer,{opacity:'0.5'});

        this.dialogHeader = this.createElement("DIV");
        this.dialogHeader.classList.add(jw.DOM.classes.JW_DIALOG_HEADER);
        this.dialogTitleContainer = this.createElement("DIV");
        this.dialogTitleContainer.classList.add(jw.DOM.classes.JW_DIALOG_TITLE_CONTAINER);
        this.dialogHeaderButtonContainer = this.createElement("DIV");
        this.dialogHeaderButtonContainer.classList.add(jw.DOM.classes.JW_DIALOG_HEADER_BUTTON_CONTAINER);

        this.dialogHeader.appendChild(this.dialogTitleContainer);
        this.dialogHeader.appendChild(this.dialogHeaderButtonContainer);
        if (this.options.customization.headerTemplate == void 0) {
            this.dialogTitle = jw.htmlFactory.createJWLinkLabel(this.options.title);
            this.dialogTitle.setAttribute(jw.DOM.attributes.DRAGGABLE_ATTR, "false");
            this.dialogTitleContainer.appendChild(this.dialogTitle);

            if (this.options.closeButton) {
                this.dialogHeaderButton = jw.htmlFactory.createJWButton(null, jw.DOM.icons.CLOSE)
                jw.common.setData(this.dialogHeaderButton, jw.DOM.attributeValues.JW_DIALOG_BUTTON_DATA_KEY, { name: 'closeBtn', result: jasonDialogButtonResult.CANCEL });
                //this.options.buttons.push({ name: 'closeBtn', result: jasonDialogButtonResult.CANCEL });
                this.eventManager.addEventListener(this.dialogHeaderButton, jw.DOM.events.CLICK_EVENT, this._onDialogButtonClick, true);
                this.dialogHeaderButtonContainer.appendChild(this.dialogHeaderButton);
            }
        }
        else {
            jw.common.applyTemplate(this.dialogHeader, this.options.customization.headerTemplate, this.options.customization.dataFieldAttribute,this.options.model);
        }

        this.dialogBody = this.createElement("DIV");
        if (this.options.customization.bodyTemplate == void 0) {
            this.dialogBody.appendChild(this.htmlElement);
        }
        else {
            jw.common.applyTemplate(this.dialogBody, this.options.customization.bodyTemplate, this.options.customization.dataFieldAttribute,this.options.model);
        }
        this.dialogBody.classList.add(jw.DOM.classes.JW_DIALOG_BODY);

        this.dialogFooter = this.createElement("DIV");
        this.dialogFooter.classList.add(jw.DOM.classes.JW_DIALOG_FOOTER);
        this.buttonsContainer = this.createElement("div");
        this.buttonsContainer.classList.add(jw.DOM.classes.JW_DIALOG_BUTTONS_CONTAINER);
        this.dialogFooter.appendChild(this.buttonsContainer);
        this._renderButtons();

        this.dialogContainer.appendChild(this.dialogHeader);
        this.dialogContainer.appendChild(this.dialogBody);
        this.dialogContainer.appendChild(this.dialogFooter);
        this.dialogContainer.appendChild(jw.htmlFactory.createClearFloat());
        //we need to disable the dialogDragger when dialog is resizing.
        this.dialogResizer = new jasonElementResizer(this.dialogContainer, {
            allowResize: this.options.resizeable ? { top: true, left: true, bottom: true, right: true } : false,
            minHeight: this.options.minHeight,
            minWidth: this.options.minWidth,
            events: [
                {
                    eventName: jw.DOM.events.JW_EVENT_ON_ELEMENT_RESIZING,
                    listener: function () { this.dialogDragger.enabled = false; this.dialogContainer.classList.add(jw.DOM.classes.JW_GRID_UNSELECTABLE); }.bind(this)
                },
                {
                    eventName: jw.DOM.events.JW_EVENT_ON_ELEMENT_RESIZED,
                    listener: function () { this.dialogDragger.enabled = true; this.dialogContainer.classList.remove(jw.DOM.classes.JW_GRID_UNSELECTABLE); }.bind(this)
                }
            ]
            
        }, "jasonDialogDragResize");
        this.dialogDragger = new jasonElementDragger(this.dialogContainer,{changeCursor:false});
    }
}
/**
 * Renders dialog's buttons.
 */
jasonDialogUIHelper.prototype._renderButtons = function (tabIndex) {
    if (this.options.buttons.length == 0) {
        var btnOK = this.options.localization.dialog.buttons.filter(function(btn){ return btn.name == "btnOK";})[0];
        this.options.buttons.push({ caption: btnOK.caption, result: jasonDialogButtonResult.OK });
    }

    for (var i = 0; i <= this.options.buttons.length - 1; i++) {
        var btn = jw.htmlFactory.createJWButton(this.options.buttons[i].caption);
        this.options.buttons[i].element = btn;
        this.eventManager.addEventListener(btn, jw.DOM.events.CLICK_EVENT, this._onDialogButtonClick, true);
        jw.common.setData(btn, jw.DOM.attributeValues.JW_DIALOG_BUTTON_DATA_KEY, this.options.buttons[i]);
        this.buttonsContainer.appendChild(btn);
    }

    //getting the next tab index but increasing it manually
    //since the elements are not yet part of the DOM.
    //The loop is going dowwards because the buttons are stacked on the right.
    //So in order to be able to navigate properly using the keyboard, the last button has the lowest tabindex hence it will get focus first.
    //for (var i = this.options.buttons.length - 1; i >=0 ; i--) {
    //    var btn = this.options.buttons[i].element;
    //    btn.setAttribute(jasonWidgets.DOM.attributes.TABINDEX_ATTR, tabIndex);
    //    tabIndex++;
    //}
}
/**
 * Button click event.
 */
jasonDialogUIHelper.prototype._onDialogButtonClick = function (event) {
    var buttonClicked = jw.common.getData(event.currentTarget, jw.DOM.attributeValues.JW_DIALOG_BUTTON_DATA_KEY);
    this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_JW_DIALOG_BUTTON_CLICK, buttonClicked);
    if (buttonClicked.controlsDialogClose == false || buttonClicked.controlsDialogClose == void 0)
        this.hide();
}
/**
 * Shows the dialog.
 */
jasonDialogUIHelper.prototype.show = function () {
    if (this.widget.readonly || !this.widget.enabled)
        return;
    this.resizeEventListenerId = jwWindowEventManager.addWindowEventListener(jw.DOM.events.RESIZE_EVENT, function (resizeEvent) {
        this._dialogInCenter();
    }.bind(this));
    if (this.options.modal) {
        var dialogs = document.querySelectorAll(".jw-dialog-container");
        var existingDialog = null;
        for (var i = dialogs.length - 1; i >= 0 ; i--) {
            if (dialogs[i].style.display == "") {
                existingDialog = dialogs[i];
                break;
            }
        }
        if (existingDialog) {
            this.existingBlockedDialogInstance = jw.common.getData(existingDialog, "jasonDialog");
            if (this.existingBlockedDialogInstance)
                this.existingBlockedDialogInstance.ui.blockUI.options.active = false;
        }
        this.blockUI.options.blockKeyboard = true;
        this.blockUI.block(existingDialog == null ? this.options.blockTarget : existingDialog);
    }
    if (this.options.width)
        this.dialogContainer.style.width = parseFloat(this.options.width) + "px";
    if (this.options.height)
        this.dialogContainer.style.height = parseFloat(this.options.height) + "px";
    if (this.options.top) 
        this.dialogContainer.style.top = parseFloat(this.options.top) + "px";
    if (this.options.left)
        this.dialogContainer.style.left = parseFloat(this.options.left); + "px";

    document.body.appendChild(this.dialogContainer);

    this.dialogContainer.style.display = "";

    if (this.dialogContainer.style.zIndex == "") {
        this.dialogContainer.style.zIndex = jw.common.getNextZIndex();
    } else {
        var zIndex = parseInt(this.dialogContainer.style.zIndex);
        var newZIndex = jw.common.getNextZIndex();
        if (zIndex < newZIndex) {
            this.dialogContainer.style.zIndex = newZIndex;
        }
    }

    this._dialogInCenter();

    if (this.dialogTitle != void 0)
        this.dialogTitle.focus();
    if (this.options.animation) {
        var animDelay = !this.options.animation.delay || this.options.animation.delay > 10 ? 25 : this.options.animation.delay * 5;
        var self = this;
        jw.common.fadeIn(this.dialogContainer, animDelay, function () {
            self.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_SHOW);
        });
    } else {
        this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_SHOW);
    }
}
/**
 * Hides the dialog.
 */
jasonDialogUIHelper.prototype.hide = function () {
    if (this.existingBlockedDialogInstance) {
        this.existingBlockedDialogInstance.ui.blockUI.options.active = true;
        this.existingBlockedDialogInstance = null;
    }
    if (this.options.animation) {
        var animDelay = !this.options.animation.delay || this.options.animation.delay > 10 ? 25 : this.options.animation.delay * 5;
        jw.common.fadeOut(this.dialogContainer, animDelay, function () {
            this.blockUI.unBlock();
            jwWindowEventManager.removeWindowEventListener(this.resizeEventListenerId);
            //self.dialogContainer.style.display = "none";
            document.body.removeChild(this.dialogContainer);
            this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_HIDE);
        }.bind(this));
    } else {
        this.blockUI.unBlock();
        document.body.removeChild(this.dialogContainer);
        //this.dialogContainer.style.display = "none";
        this.widget.triggerEvent(jw.DOM.events.JW_EVENT_ON_HIDE);
    }
}
/**
 * Place the dialog in the center of the window if no explicit top and left were defined.
 */
jasonDialogUIHelper.prototype._dialogInCenter = function () {
    if (this.options.left == void 0) {
        var centerLeft = (window.innerWidth / 2) - (this.dialogContainer.offsetWidth / 2);
        this.dialogContainer.style.left = centerLeft + "px";
    }

    if (this.options.top == void 0) {
        var centerTop = (window.innerHeight / 2) - (this.dialogContainer.offsetHeight / 2);
        this.dialogContainer.style.top = centerTop + "px";
    }
}
