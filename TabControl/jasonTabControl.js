/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonTabControl.prototype = Object.create(jasonBaseWidget.prototype);
jasonTabControl.prototype.constructor = jasonTabControl;

var
    JW_EVENT_ON_TAB_ENTER = "onTabEnter";

/**
 * @namespace Containers
 * @description Collection of container widgets. For example tab controls, groupbox, etc.
 */
/**
 * @class
 * @name jasonTabControlOptions
 * @description Configuration for the tab control widget.
 * @memberOf Containers
 * @augments Common.jasonWidgetOptions
 * @property {number}   pageHeight - Tab page height. No default.
 */

/**
 * jasonTabControlWidget
 * @constructor
 * @descrption Tab control widget.
 * @memberOf Containers
 * @augments Common.jasonBaseWidget
 * @param {HTMLElement} htmlElement - DOM element that will contain the tabcontrol.
 * @param {jasonTabControlOptions} options - Tab control options. 
 * @property {number} tabIndex - Current tab index.
 */
function jasonTabControl(htmlElement, options) {
    if ((htmlElement.tagName != "DIV") && (htmlElement.children[0] && htmlElement.children[0].tagName != "UL")) {
        throw new Error("Tabcontrol container must a DIV containing a UL element as first child");
    }

    jasonBaseWidget.call(this, "jasonTabControl", htmlElement,options,jasonTabControlWidgetUIHelper);
    this._tabIndex = -1;
    this.ui.renderUI();
    this.htmlElement.style.display = "";
}

Object.defineProperty(jasonTabControl.prototype, "tabIndex", {
    get: function () {
        return this._tabIndex;
    },
    set: function (value) {
        if (this._tabIndex != value) {
            this._tabIndex = value;
            this.ui.setActiveTab(this.ui.tabContents[this._tabIndex]);
            this.triggerEvent(JW_EVENT_ON_TAB_ENTER, this._tabIndex);
        }
    },
    enumerable: true,
    configurable: true
});


jasonTabControlWidgetUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonTabControlWidgetUIHelper.prototype.constructor = jasonTabControlWidgetUIHelper;

var
    TAB_CONTAINER = "jw-tabcontrol-container",
    TAB_UL_CLASS = "jw-tabcontrol-list",
    TAB_PAGE_CLASS = "jw-tabcontrol-page",
    TAB_PAGE_CONTENT_CONTAINER_CLASS = "jw-tabcontrol-page-container",
    TAB_PAGE_CONTAINER = "jw-tabcontrol-page-container",
    TAB_PAGE_ACTIVE = 'jw-tab-active';

/**
 * Tabcontrol UI widget helper.
 * @constructor
 * @ignore
 */
function jasonTabControlWidgetUIHelper(widget, htmlElement) {
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);

    this.tabContents = [];
    this.setActiveTab = this.setActiveTab.bind(this);
}
/**
 * Renders tab control's HTML.
 */
jasonTabControlWidgetUIHelper.prototype.renderUI = function () {
    var self = this;
    if (!this.tabsList) {
        this.htmlElement.classList.add(TAB_CONTAINER);
        this.tabsList = this.htmlElement.tagName == "DIV" ? this.htmlElement.children[0] : this.htmlElement;
        this.tabsList.classList.add(TAB_UL_CLASS);
        for (var i = 0 ; i <= this.tabsList.children.length - 1 ; i++) {
            var liItem = this.tabsList.children[i];
            liItem.classList.add(TAB_PAGE_CLASS);
            liItem.setAttribute(DATA_ITEM_INDEX_ATTR, i);
            liItem.setAttribute(TABINDEX_ATTR, jasonWidgets.common.getNextTabIndex());
            this.eventManager.addEventListener(liItem, CLICK_EVENT, function (clickEvent) {
                var parentNode = clickEvent.target;
                while (parentNode.tagName != "LI") {
                    parentNode = parentNode.parentNode;
                }
                self.widget.tabIndex = parseInt(parentNode.getAttribute(DATA_ITEM_INDEX_ATTR));// setActiveTab(parentNode);
            }, true);
        }
        var divElements = [];
        for (var i = 0 ; i <= this.htmlElement.children.length - 1  ; i++) {
            if (this.htmlElement.children[i].tagName == "DIV")
                divElements.push(this.htmlElement.children[i]);
        }


        for (var i = 0 ; i <= divElements.length - 1  ; i++) {
            var childItem = divElements[i];
            if (childItem.tagName == "DIV") {
                var childContainer = this.createElement("div");
                this.htmlElement.removeChild(childItem);
                childContainer.appendChild(childItem);
                childContainer.classList.add(TAB_PAGE_CONTAINER);
                if (this.widget.options.pageHeight)
                    childContainer.style.height = this.widget.options.pageHeight + "px";
                childContainer.setAttribute(DATA_ITEM_INDEX_ATTR, i);
                this.tabContents.push(childContainer);
            }
        }

        for (var i = 0 ; i <= this.tabContents.length - 1 ; i++) {
            this.htmlElement.appendChild(this.tabContents[i]);
        }
        this.widget.tabIndex = 0;
    }
}


/**
 * Sets the active tab.
 * @param {object} tabElement - HTMLElement
 */
jasonTabControlWidgetUIHelper.prototype.setActiveTab = function (tabElement) {
    for (var i = 0 ; i <= this.tabsList.children.length - 1 ; i++) {
        var liItem = this.tabsList.children[i];
        liItem.classList.remove(TAB_PAGE_ACTIVE)
    }
    var tabIndex = parseInt(tabElement.getAttribute(DATA_ITEM_INDEX_ATTR));
    if (!isNaN(tabIndex)) {
        tabElement.classList.add(TAB_PAGE_ACTIVE);
        this.tabsList.children[this.widget.tabIndex].classList.add(TAB_PAGE_ACTIVE);
        this.tabContents.forEach(function (tabContent, tabContentIndex) {
            tabContent.style.display = "none";
        });
        this.tabContents[tabIndex].style.display = "";
    }
}