/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * @namespace Validation
 * @description jasonWidgets validation framework.
 */


/**
 * @class
 * @name jasonValidationRuleOptions
 * @description Configuration of a validation rule.
 * @memberOf Validation
 * @property {string} name - Rule name.
 * @property {string|function|HTML} message - HTML string or script tag or function containing HTML to be used to render the validation message content.
 * @property {string} title - Title name for the validation popover.
 * @property {function} validatorFunction(sender,value,validValue) - Function that validates a value and returns a boolean result. True if value is valid or false if it's invalid.
 * @property {any=} validValue - Value to be passed into the validator function when a value is validated. For example a min/max rule would need a limit.
 * @property {boolean} [enabled=true] - When true rule can validate value.
 * @property {Common.jasonBaseWidget} widget - Related jasonWidget value to be validated.
 * @propery {string} bubblePosition - Position for the validation bubble. [left,right,top,bottom]. By default is set to auto placement. Leaves this undefined to allow auto placement.
  */


/**
 * @class
 * @name jasonValidationRule
 * @description jwWidget validation rule object.
 * @memberOf Validation
 * @property {Validation.jasonValidationRuleOptions} options - Validation rule configuration.
 * @property {function} validate - Validate rule.
 */
function jasonValidationRule(options) {
    var self = this;
    this.options = options;

    this._closeEventAssigned = false;

    this.validate = function () {
        if (!self.widget) {
            self.widget = self.options.widget;
            self._initializeContent();
            self._createUI();
            self.validationMessage.innerHTML = self.options.message;
            self.validationPopover = new jasonPopover({
                targetElement: self.widget.htmlElement,
                title: options.title,
                content: self.validationContainer,
                autoPlacement: self.options.bubblePosition == undefined,
                position: self.options.bubblePosition,
                mode: 'validation'
            });
            self.validationPopover.htmlElement.classList.add(jw.DOM.classes.JW_VALIDATION);
        }
        if (self.options.validatorFunction && typeof self.options.validatorFunction == "function" && self.widget) {
            var validationResult = self.options.validatorFunction(self.widget,self.widget.value, self.options.validValue);
            if (validationResult == false) {
                self.validationPopover.show();
                if (!this._closeEventAssigned) {
                    var closeButton = self.validationPopover.ui.body.getElementsByClassName(jw.DOM.classes.JW_BUTTON)[0];
                    self.validationPopover.eventManager.addEventListener(closeButton, jw.DOM.events.CLICK_EVENT, function (event) {
                        self.validationPopover.hide();
                    },true);
                    this._closeEventAssigned = true;
                }
            } else {
                self.validationPopover.hide();
            }
            return validationResult;
        }
    }
    this._initializeContent = function () {
        this.options.message = jw.common.parseTemplateContent(this.options.message);
    }

    this._createUI = function () {
        self.validationContainer = document.createElement("DIV");
        self.validationContainer.classList.add(jw.DOM.classes.JW_VALIDATION_CONTAINER);
        self.validationMessageContainer = document.createElement("DIV");
        self.validationMessageContainer.classList.add(jw.DOM.classes.JW_VALIDATION_MESSAGE_CONTAINER);
        self.validationMessage = document.createElement("SPAN");
        self.validationMessage.classList.add(jw.DOM.classes.JW_VALIDATION_MESSAGE);
        self.validationMessageContainer.appendChild(self.validationMessage);
        self.validationCloseButton = jw.htmlFactory.createJWButton(null, jw.DOM.icons.CLOSE_24x24);
        self.validationContainer.appendChild(self.validationCloseButton);
        self.validationContainer.appendChild(self.validationMessageContainer);
    }
}


/**
 * @class
 * @name jasonValidationRuleGroup
 * @memberOf Validation
 * @property {Validation.jasonValidationRule[]} rules - Validation rules that belong to the group.
 */
function jasonValidationRuleGroup(name) {
    var self = this;
    this.name = name == void 0 ? "default" : name;
    this.rules = [];
    this.validate = function () {
        self.rules.forEach(function (rule) {
            if (rule.options.widget)
                rule.options.widget.validate();
            else
                rule.validate();
        });
    }
    jw.validationManager.addValidationGroup(this);
}

/**
 * @class
 * @name jasonValidationManager
 * @description Managing all jasonWidgets validation groups.
 * @memberOf Validation
 * @property {function} validate(validationGroupName) - Validate all validation groups. If validationGroupName is not defined validation will run for all groups.
 * @property {function} addValidationGroup(validationGroup) - Adds a validation group.
 * @property {function} addValidationRule(validationRule) - Adds a validation rule to it's group.
 */

jw.validationManager = (function () {
    var _validationGroups = [];
    return {
        validationGroups: _validationGroups,
        validate: function (validationGroupName) {
            if (validationGroupName) {
                var validationGroup = _validationGroups.filter((function (valGroup) { return validationGroupName == valGroup.name }));
                if (validationGroup)
                    validationGroup.validate();
            } else {
                _validationGroups.forEach(function (valGroup) {
                    valGroup.validate();
                });
            }
        },
        addValidationGroup:function(validationGroup){
            var valGroup = _validationGroups.filter((function (valGroup) { return validationGroup.name == valGroup.name }))[0];
            if (!valGroup)
                _validationGroups.push(validationGroup);
        },
        addValidationRule: function (validationRule) {
            var valGroup = _validationGroups.filter((function (valGroup) { return validationRule.ruleGroup == valGroup.name }))[0];
            if (valGroup) {
                valGroup.rules.push(validationRule);
            }
        }
    }
}());
