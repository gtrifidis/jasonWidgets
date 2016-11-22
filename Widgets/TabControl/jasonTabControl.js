/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonTabControl.prototype = Object.create(jasonBaseWidget.prototype);
jasonTabControl.prototype.constructor = jasonTabControl;

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
 * @event Containers.jasonTabControl#onTabEnter
 * @description Occurs when tab is visible and active.
 * @type {object}
 * @property {Containers.jasonTabControl} sender - The tabcontrol instance.
 * @property {number} tabIndex - The tabindex of the entered tab.
 */

/**
 * jasonTabControl
 * @constructor
 * @descrption Tab control widget.
 * @memberOf Containers
 * @augments Common.jasonBaseWidget
 * @param {HTMLElement} htmlElement - DOM element that will contain the tabcontrol.
 * @param {jasonTabControlOptions} options - Tab control options. 
 * @property {number} tabIndex - Current tab index.
 * @fires Containers.jasonTabControl#event:onTabEnter
 */
function jasonTabControl(htmlElement, options) {
    if ((htmlElement.tagName != "DIV") && (htmlElement.children[0] && htmlElement.children[0].tagName != "UL")) {
        throw new Error("Tabcontrol container must a DIV containing a UL element as first child");
    }

    jasonBaseWidget.call(this, "jasonTabControl", htmlElement,options,jasonTabControlUIHelper);
    this._tabIndex = -1;
    //this.ui.renderUI();
    this.htmlElement.style.display = "";
    this.tabIndex = 0;
}

Object.defineProperty(jasonTabControl.prototype, "tabIndex", {
    get: function () {
        return this._tabIndex;
    },
    set: function (value) {
        if (this._tabIndex != value) {
            this._tabIndex = value;
            this.ui.setActiveTab(this.ui.tabContents[this._tabIndex]);
            this.triggerEvent(jw.DOM.events.JW_EVENT_ON_JW_TAB_ENTER, this._tabIndex);
        }
    },
    enumerable: true,
    configurable: true
});
/**
 * Showing/hiding tabs.
 * @param {number} tabindex - Tabindex of tab to hide/show.
 * @param {boolean} visible - Tab's new visible state.
 */
jasonTabControl.prototype.tabVisible = function (tabIndex, visible) {
    this.ui.tabVisible(tabIndex, visible);
}

jasonTabControlUIHelper.prototype = Object.create(jasonBaseWidgetUIHelper.prototype);
jasonTabControlUIHelper.prototype.constructor = jasonTabControlUIHelper;

/**
 * Tabcontrol UI widget helper.
 * @constructor
 * @ignore
 */
function jasonTabControlUIHelper(widget, htmlElement) {
    this.tabContents = [];
    this.setActiveTab = this.setActiveTab.bind(this);
    jasonBaseWidgetUIHelper.call(this, widget, htmlElement);
}
/**
 * Renders tab control's HTML.
 */
jasonTabControlUIHelper.prototype.renderUI = function () {
    var self = this;
    if (!this.tabsList) {
        this.htmlElement.classList.add(jw.DOM.classes.JW_TAB_CONTAINER);
        this.tabsList = this.htmlElement.tagName == "DIV" ? this.htmlElement.children[0] : this.htmlElement;
        this.tabsList.classList.add(jw.DOM.classes.JW_TAB_UL_CLASS);
        for (var i = 0 ; i <= this.tabsList.children.length - 1 ; i++) {
            var liItem = this.tabsList.children[i];
            liItem.classList.add(jw.DOM.classes.JW_TAB_PAGE_CLASS);
            liItem.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_JW_ITEM_INDEX_ATTR, i);
            liItem.setAttribute(jasonWidgets.DOM.attributes.TABINDEX_ATTR, jasonWidgets.common.getNextTabIndex());
            this.eventManager.addEventListener(liItem, jw.DOM.events.CLICK_EVENT, function (clickEvent) {
                if (self.widget.readonly || !self.widget.enabled)
                    return;
                var parentNode = clickEvent.target;
                while (parentNode.tagName != "LI") {
                    parentNode = parentNode.parentNode;
                }
                self.widget.tabIndex = parseInt(parentNode.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_JW_ITEM_INDEX_ATTR));// setActiveTab(parentNode);
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
                childContainer.classList.add(jw.DOM.classes.JW_TAB_PAGE_CONTAINER);
                if (this.widget.options.pageHeight)
                    childContainer.style.height = this.widget.options.pageHeight + "px";
                childContainer.setAttribute(jasonWidgets.DOM.attributes.JW_DATA_JW_ITEM_INDEX_ATTR, i);
                this.tabContents.push(childContainer);
            }
        }

        for (var i = 0 ; i <= this.tabContents.length - 1 ; i++) {
            this.htmlElement.appendChild(this.tabContents[i]);
        }
    }
}


/**
 * Sets the active tab.
 * @param {object} tabElement - HTMLElement
 */
jasonTabControlUIHelper.prototype.setActiveTab = function (tabElement) {
    for (var i = 0 ; i <= this.tabsList.children.length - 1 ; i++) {
        var liItem = this.tabsList.children[i];
        var tabContainer = this.tabContents[i];
        liItem.classList.remove(jw.DOM.classes.JW_TAB_PAGE_ACTIVE);
        if(tabContainer)
            tabContainer.classList.remove(jw.DOM.classes.JW_TAB_PAGE_ACTIVE);
    }
    var tabIndex = parseInt(tabElement.getAttribute(jasonWidgets.DOM.attributes.JW_DATA_JW_ITEM_INDEX_ATTR));
    if (!isNaN(tabIndex)) {
        tabElement.classList.add(jw.DOM.classes.JW_TAB_PAGE_ACTIVE);
        this.tabsList.children[tabIndex].classList.add(jw.DOM.classes.JW_TAB_PAGE_ACTIVE);
        this.tabContents.forEach(function (tabContent, tabContentIndex) {
            tabContent.style.display = "none";
        });
        this.tabContents[tabIndex].style.display = "";
    }
}
/**
 * Updates UI when enable/disable state is changed.
 * @abstract
 */
jasonTabControlUIHelper.prototype.updateEnabled = function (enable) {
    jasonBaseWidgetUIHelper.prototype.updateEnabled.call(this, enable);
    for (var i = 0; i <= this.tabsList.children.length - 1; i++) {
        if (enable)
            this.tabsList.children[i].classList.remove(jw.DOM.classes.JW_DISABLED);
        else
            this.tabsList.children[i].classList.add(jw.DOM.classes.JW_DISABLED);
    }
}
/**
 * Updates UI when visible state is changed.
 * @abstract
 */
jasonTabControlUIHelper.prototype.updateVisible = function (visible) {
    jasonBaseWidgetUIHelper.prototype.updateVisible.call(this, visible);
}
/**
 * Updates UI when readonly state is changed.
 * @abstract
 */
jasonTabControlUIHelper.prototype.updateReadOnly = function (readonly) {
    jasonBaseWidgetUIHelper.prototype.updateReadOnly.call(this, readonly);
}

/**
 * Makes a tab visible or not.
 */
jasonTabControlUIHelper.prototype.tabVisible = function (tabIndex, visible) {
    var tab = this.tabsList.children[tabIndex];
    if (tab) {
        tab.style.display = visible ? "" : "none";
    }
}