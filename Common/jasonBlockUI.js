/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


function jasonBlockUI() {
    this.blockElement = document.createElement("DIV");
    this.blockElement.style.display = "none";
    this.blockElement.style.opacity = "0.8";
    this.blockElement.style.backgroundColor = "white";
    this.blockElement.style.position = "absolute";
    document.body.appendChild(this.blockElement);
    this.blockElement.addEventListener(CLICK_EVENT, function (event) { event.preventDefault(); event.stopPropagation(); });
    this.blockElement.addEventListener(MOUSE_DOWN_EVENT, function (event) { event.preventDefault(); event.stopPropagation(); });
    /**
     * 
     */
    jasonBlockUI.prototype.block = function (blockTarget) {
        var coordinates = { left: 0, top: 0 };
        if (blockTarget) {
            coordinates = jw.common.getOffsetCoordinates(blockTarget);
        }
        var bTarget = blockTarget ? blockTarget : document.getElementsByTagName("html")[0];
        
        this.blockElement.style.height = bTarget.offsetHeight + "px";
        this.blockElement.style.width = bTarget.offsetWidth + "px";
        this.blockElement.style.top = coordinates.top + "px";
        this.blockElement.style.left = coordinates.left + "px";
        this.blockElement.style.display = "";
    }
    /**
     * 
     */
    jasonBlockUI.prototype.unBlock = function () {
        this.blockElement.style.display = "none";
    }
}
