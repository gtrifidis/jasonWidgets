/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/**
 * Base class for all jasonWidgets
 * @param {string} nameSpace
 * @param {object} htmlElement - HTMLElement that the widget will be attached to.
 */
function jasonBaseWidget(nameSpace, htmlElement,uiHelper) {

        jasonBaseWidget.prototype.renderMarkUp = function () { }

        this.htmlElement = htmlElement;
        this.nameSpace = nameSpace;
        this.defaultOptions = {Events:null,Customization:null,Localization:null};
        this.eventManager = new jasonEventManager();
        this.baseClassName = "jasonWidget";
        this.ui = uiHelper ? uiHelper : new jasonWidgetUIHelper(this);
        this.htmlElement.classList.add(this.baseClassName);

        jasonBaseWidget.prototype.initialize = function (options) {
            if (!options)
                options = {};
            jasonWidgets.common.extendObject(this.defaultOptions, options);
            this.options = options;
        }

        jasonBaseWidget.prototype.createEventNameSpace = function (eventName) {
            return eventName + "." + this.nameSpace;
        }

        jasonBaseWidget.prototype.addBaseClassName = function (element) {
            element.classList.add(this.baseClassName);
        }

        jasonBaseWidget.prototype.createElement = function (elementTagName,addItToList) {
            return this.ui.createElement(elementTagName, addItToList);
        }

        jasonBaseWidget.prototype.createTextNode = function (text, addItToList) {
            return this.ui.createTextNode(text, addItToList);
        }

        jasonBaseWidget.prototype.createWidgetContainer = function (elementTagName) {
            return this.ui.createWidgetContainer(elementTagName);
        }

        jasonBaseWidget.prototype.localizeStrings = function (localizationObject) {

        }

        return jasonBaseWidget;
    }

function jasonWidgetUIHelper(widget,htmlElement) {
    this.widget = widget;
    this.htmlElement = htmlElement;
    this.createdElements = new Array();

    jasonWidgetUIHelper.prototype.createElement = function (elementTagName, addItToList) {
        var result = document.createElement(elementTagName);
        if (addItToList == true)
            this.createdElements.push(result);
        return result;
    }

    jasonWidgetUIHelper.prototype.createTextNode = function (text, addItToList) {
        var result = document.createTextNode(text);
        if (addItToList == true)
            this.createdElements.push(result);
        return result;
    }

    jasonWidgetUIHelper.prototype.createWidgetContainer = function (elementTagName) {
        elementTagName = elementTagName ? elementTagName : "div";
        var result = this.createElement(elementTagName);
        result.classList.add(this.widget.baseClassName);
        return result;
    }

    jasonWidgetUIHelper.prototype.renderUI = function () {
    }
}
