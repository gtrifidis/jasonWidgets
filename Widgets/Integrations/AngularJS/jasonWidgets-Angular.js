/**
 * @interface
 * @name AngularJS 
 * @property {directive} jwButton - Directive for jasonButton widget.
 * @property {directive} jwDropDownListButton - Directive for jasonDropDownListButton widget.
 * @property {directive} jwButtonTextBox - Directive for jasonButtonTextbox widget.
 * @property {directive} jwCalendar - Directive for jasonCalendar widget.
 * @property {directive} jwCombobox - Directive for jasonCombobox widget.
 * @property {directive} jwDatePicker - Directive for jasonDatePicker widget.
 * @property {directive} jwDateTimePicker - Directive for jasonDateTimePicker widget.
 * @property {directive} jwTimePicker - Directive for jasonTimePicker widget.
 * @property {directive} jwDialog - Directive for jasonDialog widget.
 * @property {directive} jwGrid - Directive for jasonGrid widget.
 * @property {directive} jwMenu - Directive for jasonMenu widget.
 * @property {directive} jwContextMenu - Directive for jasonContextMenu widget.
 * @property {directive} jwNumericTextbox - Directive for jasonNumericTextbox widget.
 * @property {directive} jwPopover - Directive for jasonPopover widget.
 * @property {directive} jwTabControl - Directive for jasonTabControl widget.
 * @property {directive} jwTextbox - Directive for jasonTextbox widget.
 * 
 */
var jwAngularModule;
try{
    if(angular != void 0)
        jwAngularModule = angular.module(jw.jwAngularJSModuleName, []);
}
catch(error){
    console.log(error);
}

/**
 * List of jwWidget to be registered in AngularJS.
 * @ignore
 */
var jwAngularComponents = [
    { constructor: jasonButton, name: "jwButton" },
    { constructor: jasonDropDownListButton, name: "jwDropDownListButton" },
    { constructor: jasonButtonTextbox, name: "jwButtonTextBox" },
    { constructor: jasonCalendar, name: "jwCalendar" },
    { constructor: jasonCombobox, name: "jwCombobox" },
    { constructor: jasonDatePicker, name: "jwDatePicker" },
    { constructor: jasonDateTimePicker, name: "jwDateTimePicker" },
    { constructor: jasonTimePicker, name: "jwTimePicker" },
    { constructor: jasonDialog, name: "jwDialog" },
    { constructor: jasonGrid, name: "jwGrid" },
    { constructor: jasonMenu, name: "jwMenu" },
    { constructor: jasonMenu, name: "jwContextMenu" },
    { constructor: jasonNumericTextbox, name: "jwNumericTextbox" },
    { constructor: jasonPopover, name: "jwPopover" },
    { constructor: jasonTabControl, name: "jwTabControl" },
    { constructor: jasonTextbox, name: "jwTextbox" },
];
/**
 * Creating component definition object.
 * @ignore
 */
function createComponentDefinitionObject(jwContructorDefinition) {
    var result =
        {
            restrict: 'AE',
            controller: function ($scope, $element, $attrs) {
                this.$postLink = function () {
                    this.widgetOptions = $scope[$attrs.jwOptions];
                    new jwContructorDefinition.constructor($element[0], this.widgetOptions);
                }
            }
        };
    return result;
}
/**
 * Registering a single component.
 * @ignore
 */
function registerComponent(jwContructorDefinition) {
    jwAngularModule.directive(jwContructorDefinition.name, function () {
        return createComponentDefinitionObject(jwContructorDefinition);
    });
}

/**
 * Iterating through jwWidgets to register as components.
 * @ignore
 */
function registerComponents() {
    if (angular != void 0) {
        jwAngularComponents.forEach(function (jwContructorDefinition) {
            registerComponent(jwContructorDefinition);
        });

    }
}
registerComponents();



//function createDirectiveDefinitionObject(jwContructorDefinition) {
//    var result =
//        {
//            restrict: 'AE',
//            controller: function ($scope, $element, $attrs) {
//                //this.gridOptions = $scope[$attrs.jwOptions];
//                this.$onChanges = function (changesObject) {
//                    console.log(changesObject);
//                }
//                this.$postLink = function () {
//                    this.widgetOptions = $scope[$attrs.jwOptions];
//                    new jwContructorDefinition.constructor($element[0], this.widgetOptions);
//                }
//            }
//        };
//    return result;
//}

//function registerDirective(jwContructorDefinition) {
//    jwAngularModule.directive(jwContructorDefinition.name, function () {
//        return createDirectiveDefinitionObject(jwContructorDefinition);
//    });
//}

//function registerDirectives() {
//    if (angular != void 0) {
//        jwAngularDirectives.forEach(function (jwContructorDefinition) {
//            registerDirective(jwContructorDefinition);
//        });

//    }
//}
//registerDirectives();
