/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @class
 * @ignore 
 * @name jasonBlockUIOptions
 * @memberOf Common
 * @property {string} [opacity='0.8'] - Default opacity.
 * @property {string} [backgroundColor='white'] - Default color.
 * @property {string} [cssClass=undefined] - If defined the CSS class will be added in the block element overlay.
 * @property {boolean} [blockKeyboard=false] - If true it blocks keyboard events to any element besides the nonBlockElement.
 * @property {boolean} [active=true] - If true blocking is active.Affects only keyboard blocking if configured.
 */

/**
 * @constructor
 * @memberOf Common
 * @param {HTMLElement} nonBlockElement - DOM element that will not be blocked.
 */
function jasonBlockUI(nonBlockElement, options) {
    this.defaultOptions = {
        opacity: '0.8',
        backgroundColor: 'white',
        blockKeyboard:false,
        active:true
    };
    if (options == void 0)
        options = {};
    jw.common.extendObject(this.defaultOptions, options);
    this.options = options;
    this.nonBlockElement = nonBlockElement;
    this.blockElement = document.createElement("DIV");
    this.blockElement.style.display = "none";
    this.blockElement.style.opacity = this.options.opacity;
    this.blockElement.style.backgroundColor = this.options.backgroundColor;
    if (this.options.cssClass != void 0)
        this.blockElement.classList.add(this.options.cssClass);
    this.blockElement.classList.add(jw.DOM.classes.JW_BLOCK_ELEMENT);
    this.blockElement.style.position = "absolute";
    this.blockElement.addEventListener(jw.DOM.events.CLICK_EVENT, function (event) { event.preventDefault(); event.stopPropagation(); });
    this.blockElement.addEventListener(jw.DOM.events.MOUSE_DOWN_EVENT, function (event) { event.preventDefault(); event.stopPropagation(); });
    this.addWindowEvents = this.addWindowEvents.bind(this);
    this.removeWindowEvents = this.removeWindowEvents.bind(this);
    this.handleWindowsFocus = this.handleWindowsFocus.bind(this);
    this.handleWindowsKeyDown = this.handleWindowsKeyDown.bind(this);
}
/**
 * Blocks the UI.
 * @param {HTMLElement} [blockTarget = undefined] - If no blockTarget is defined, the HTML element will be the block target.
 */
jasonBlockUI.prototype.block = function (blockTarget) {
    if (this.blockElement.parentNode)
        this.blockElement.parentNode.removeChild(this.blockElement);
    var coordinates = { left: 0, top: 0 };
    if (blockTarget && jw.common.getComputedStyleProperty(blockTarget, "position") != "absolute") {
        coordinates = jw.common.getOffsetCoordinates(blockTarget);
    }
    var bTarget = blockTarget ? blockTarget : document.getElementsByTagName("html")[0];
    bTarget.parentNode.appendChild(this.blockElement);
    this.blockTarget = bTarget;
        
    this.blockElement.style.height = bTarget.offsetHeight + "px";
    this.blockElement.style.width = bTarget.offsetWidth + "px";
    this.blockElement.style.top = bTarget.offsetTop + "px";
    this.blockElement.style.left = bTarget.offsetLeft + "px";
    this.blockElement.style.zIndex = jw.common.getNextZIndex();
    this.blockElement.style.display = "";
    this.addWindowEvents();
}
/**
 * Unblocks the UI.
 */
jasonBlockUI.prototype.unBlock = function () {
    this.blockElement.style.display = "none";
    this.removeWindowEvents();
}
/**
 * Adding window event listeners on blocking to prevent keyboard navigation behind the block element.
 */
jasonBlockUI.prototype.addWindowEvents = function () {
    if (this.options.blockKeyboard) {
        this.keydownListenerId = jwWindowEventManager.addWindowEventListener(jw.DOM.events.KEY_DOWN_EVENT, this.handleWindowsKeyDown);
        this.focusListenerId =  jwWindowEventManager.addWindowEventListener(jw.DOM.events.FOCUS_EVENT, this.handleWindowsFocus);
    }
}
/**
 * Removes event listeners when unblocking.
 */
jasonBlockUI.prototype.removeWindowEvents = function () {
    if (this.options.blockKeyboard) {
        jwWindowEventManager.removeWindowEventListener(this.keydownListenerId);
        jwWindowEventManager.removeWindowEventListener(this.focusListenerId);
    }
}
/**
 * When a key is press on an element that does not belong to the block htmlElement, then moves focus to the first focuseable element.
 */
jasonBlockUI.prototype.handleWindowsKeyDown = function (keydownEvent) {
    if (this.options.active == false)
        return;
    var preventDefault = !jw.common.contains(this.nonBlockElement, keydownEvent.target);
    if (preventDefault) {
        var firstFocusableElement = jw.common.getFirstFocusableElement(this.nonBlockElement);
        if (firstFocusableElement)
            firstFocusableElement.focus();
        keydownEvent.preventDefault();
        keydownEvent.stopPropagation();
    }
}
/**
 * When an element that does not belong to the block htmlElement gets focus, then moves focus to the first focuseable element.
 */
jasonBlockUI.prototype.handleWindowsFocus = function (focusEvent) {
    if (this.blockElement.style.display == "") {
        var preventDefault = !jw.common.contains(this.nonBlockElement, focusEvent.target);
        if (preventDefault) {
            var firstFocusableElement = jw.common.getFirstFocusableElement(this.nonBlockElement);
            if (firstFocusableElement)
                firstFocusableElement.focus();
            focusEvent.preventDefault();
            focusEvent.stopPropagation();
        }
    }
}
