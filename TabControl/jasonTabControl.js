/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jasonTabControl.prototype = Object.create(jasonBaseWidget.prototype);
jasonTabControl.prototype.constructor = jasonTabControl;

/**
 * @name jasonTabControlDefaultOptions
 * @property {number}   PageHeight                      - Tab page height.No default.
 */

/**
 * jasonTabControlWidget
 * @param {object} htmlElement - HTMLElement.
 * @param {object} options - Tab control options. {@link jasonTabControlDefaultOptions}
 */
function jasonTabControl(htmlElement,options) {
    if ((htmlElement.tagName != "DIV") && (htmlElement.children[0] && htmlElement.children[0].tagName != "UL")) {
        throw new Error("Tabcontrol container must a DIV containing a UL element as first child");
    }
    jasonBaseWidget.call(this, "jasonTabControl", htmlElement,new jasonTabControlWidgetUIHelper(this,htmlElement));
    if (!options) options = {};
    jasonWidgets.common.extendObject({
        Events: {
            OnTabEnter:null
        }
    }, this.defaultOptions);
    this.initialize(options);
    this.TabIndex = -1;
    this.ui.renderUI();
}


jasonTabControlWidgetUIHelper.prototype = Object.create(jasonWidgetUIHelper.prototype);
jasonTabControlWidgetUIHelper.prototype.constructor = jasonTabControlWidgetUIHelper;

/**
 * Tabcontrol UI widget helper.
 */
function jasonTabControlWidgetUIHelper(widget, htmlElement) {
    jasonWidgetUIHelper.call(this, widget, htmlElement);
    this.TAB_CONTAINER = "jw-tabcontrol-container";
    this.TAB_UL_CLASS = "jw-tabcontrol-list";
    this.TAB_PAGE_CLASS = "jw-tabcontrol-page";
    this.TAB_PAGE_CONTENT_CONTAINER_CLASS = "jw-tabcontrol-page-container";
    this.TAB_PAGE_CONTAINER = "jw-tabcontrol-page-container";
    this.TAB_PAGE_ACTIVE = 'jw-tab-active';
    this.tabContents = [];
    this.setActiveTab = this.setActiveTab.bind(this);
}
/**
 * Renders tab control's HTML.
 */
jasonTabControlWidgetUIHelper.prototype.renderUI = function () {
    var self = this;
    this.htmlElement.classList.add(this.TAB_CONTAINER);
    this.tabsList = this.htmlElement.tagName == "DIV" ? this.htmlElement.children[0] : this.htmlElement;
    this.tabsList.classList.add(this.TAB_UL_CLASS);
    for (var i = 0 ; i <= this.tabsList.children.length - 1 ; i++) {
        var liItem = this.tabsList.children[i];
        liItem.classList.add(this.TAB_PAGE_CLASS);
        liItem.setAttribute("data-tab-index", i);
        liItem.setAttribute("tabindex", jasonWidgets.common.getNextTabIndex());
        liItem.addEventListener("click", function (clickEvent) {
            var parentNode = clickEvent.target;
            while (parentNode.tagName != "LI") {
                parentNode = parentNode.parentNode;
            }
            self.setActiveTab(parentNode);
        });
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
            childContainer.classList.add(this.TAB_PAGE_CONTAINER);
            if (this.widget.options.PageHeight)
                childContainer.style.height = this.widget.options.PageHeight + "px";
            childContainer.setAttribute("data-tab-index", i);
            this.tabContents.push(childContainer);
        }
    }

    for (var i = 0 ; i <= this.tabContents.length - 1 ; i++) {
        this.htmlElement.appendChild(this.tabContents[i]);
    }
    this.setActiveTab(this.tabContents[0]);
}


/**
 * Sets the active tab.
 * @param {object} tabElement - HTMLElement
 */
jasonTabControlWidgetUIHelper.prototype.setActiveTab = function (tabElement) {
    for (var i = 0 ; i <= this.tabsList.children.length - 1 ; i++) {
        var liItem = this.tabsList.children[i];
        liItem.classList.remove(this.TAB_PAGE_ACTIVE)
    }
    var tabIndex = parseInt(tabElement.getAttribute("data-tab-index"));
    if (!isNaN(tabIndex)) {
        this.widget.TabIndex = tabIndex;
        tabElement.classList.add(this.TAB_PAGE_ACTIVE);
        this.tabsList.children[this.widget.TabIndex].classList.add(this.TAB_PAGE_ACTIVE);
        this.tabContents.forEach(function (tabContent, tabContentIndex) {
            tabContent.style.display = "none";
        });
        this.tabContents[tabIndex].style.display = "";
    }
    if (this.widget.options.Events.OnTabEnter) {
        this.widget.options.Events.OnTabEnter(tabElement);
    }
}