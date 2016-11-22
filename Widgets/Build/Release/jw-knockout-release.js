/**
 * @interface
 * @name KnockoutJS 
 * @property {knockoutBindingHandler} jasonGrid - Knockout binding handler for the jasonGrid widget.
 * @property {knockoutBindingHandler} jasonCombobox - Knockout binding handler for the jasonCombobox widget.
 * @property {knockoutBindingHandler} jasonTabControl - Knockout binding handler for the jasonTabControl widget.
 * @property {knockoutBindingHandler} jasonMenu - Knockout binding handler for the jasonMenu widget.
 * @property {knockoutBindingHandler} jasonContextMenu - Knockout binding handler for the jasonContextMenu widget.
 * @property {knockoutBindingHandler} jasonCalendar - Knockout binding handler for the jasonCalendar widget.
 * @property {knockoutBindingHandler} jasonDatePicker - Knockout binding handler for the jasonDatePicker widget.
 * @property {knockoutBindingHandler} jasonTimePicker - Knockout binding handler for the jasonTimePicker widget.
 * @property {knockoutBindingHandler} jasonDateTimePicker - Knockout binding handler for the jasonDateTimePicker widget.
 * @property {knockoutBindingHandler} jasonDialog - Knockout binding handler for the jasonDialog widget.
 * @property {knockoutBindingHandler} jasonDropDownListButton - Knockout binding handler for the jasonDropDownListButton widget.
 * @property {knockoutBindingHandler} jasonPopover - Knockout binding handler for the jasonPopover widget.
 * @property {knockoutBindingHandler} jasonButton - Knockout binding handler for the jasonButton widget.
 * @property {knockoutBindingHandler} jasonButtonTextBox - Knockout binding handler for the jasonButtonTextBox widget.
 * @property {knockoutBindingHandler} jasonNumericTextBox - Knockout binding handler for the jasonNumericTextBox widget.
 */

var
    DATA = "data";
var unwrap;
try{
    if (ko)
        unwrap = ko.utils.unwrapObservable; //support older 2.x KO where ko.unwrap was not defined
}
catch(error){
    console.log(error);
}

var widgetsUIMap = [
    { widgetName: 'jasonMenu', widgetUI: jasonMenuUIHelper },
    { widgetName: 'jasonContextMenu', widgetUI: jasonContextMenuUIHelper }
];

function jwKnockoutFactory() {
    var self = this;
    this.createBinding = function (widgetConfig) {
        var koBinding = {};
        koBinding.init = function (element, valueAccessor, all, vm, context) {
            var options = self.buildOptions(widgetConfig, valueAccessor);
            var uiMapping = widgetsUIMap.filter(function (widgetUI) {
                if (widgetConfig.bindingName)
                    return widgetConfig.bindingName == widgetUI.widgetName;
                else
                    return widgetConfig.name == widgetUI.widgetName;
            })[0];
            if (uiMapping) {
                options.uiHelper = uiMapping.widgetUI;
            }
            //apply async, so inner templates can finish content needed during widget initialization
            if (options.async === true || (widgetConfig.async === true && options.async !== false)) {
                setTimeout(function () {
                    koBinding.setup(element, options, context);
                    jw.common.triggerGlobalEvent(jw.DOM.eventCodes.JGE_REDRAW);
                }, 0);
                return;
            }

            koBinding.setup(element, options, context);

            if (options && options.useKOTemplates) {
                return { controlsDescendantBindings: true };
            }
        }

        koBinding.setup = function (element, options, context) {
            var widget;

            //step 2: setup templates
            self.setupTemplates(widgetConfig.templates, options, element, context);

            //step 3: initialize widget
            widget = self.getWidget(widgetConfig, options, element);

            //step 4: add handlers for events that we need to react to for updating the model
            self.handleEvents(options, widgetConfig, element, widget, context);

            //step 5: set up computed observables to update the widget when observable model values change
            self.watchValues(widget, options, widgetConfig, element);

            //step 6: handle disposal, if there is a destroy method on the widget
            if (widget.destroy) {
                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    if (widget.element) {
                        widget.destroy();
                    }
                });
            }
        }

        koBinding.options = {}; //global options
        koBinding.widgetConfig = widgetConfig; //expose the options to use in generating tests

        ko.bindingHandlers[widgetConfig.bindingName || widgetConfig.name] = koBinding;

    }

    //combine options passed in binding with global options
    this.buildOptions = function (widgetConfig, valueAccessor) {
        var defaultOption = widgetConfig.defaultOption,
            options = ko.utils.extend({}, ko.bindingHandlers[widgetConfig.name].options),
            valueOrOptions = unwrap(valueAccessor());

        if (typeof valueOrOptions !== "object" || valueOrOptions === null || (defaultOption && !(defaultOption in valueOrOptions))) {
            options[defaultOption] = valueAccessor();
        } else {
            ko.utils.extend(options, valueOrOptions);
        }

        return options;
    };

    var templateRenderer = function (id, context) {
        return function (data) {
            return ko.renderTemplate(id, context.createChildContext((data._raw && data._raw()) || data));
        };
    };

    //return the actual widget
    this.getWidget = function (widgetConfig, options, element) {
        var widget;
        var widgetConstructor = eval(widgetConfig.name);
        var unwrapedOptions = this.unwrapOneLevel(options);
        if (typeof widgetConstructor == "function") {
            widget = options.uiHelper ? new widgetConstructor(element, unwrapedOptions, unwrapedOptions.uiHelper) : new widgetConstructor(element, unwrapedOptions);
        }
        //if the widget option was specified, then fill it with our widget
        if (ko.isObservable(options.widget)) {
            options.widget(widget);
        }

        return widget;
    };

    this.setupTemplates = function (templateConfig, options, element, context) {
        var i, j, option, existingHandler;

        if (templateConfig && options && options.useKOTemplates) {
            //create a function to render each configured template
            for (i = 0, j = templateConfig.length; i < j; i++) {
                option = templateConfig[i];
                if (options[option]) {
                    options[option] = templateRenderer(options[option], context);
                }
            }

            //initialize bindings in dataBound event
            existingHandler = options.dataBound;
            options.dataBound = function () {
                ko.memoization.unmemoizeDomNodeAndDescendants(element);
                if (existingHandler) {
                    existingHandler.apply(this, arguments);
                }
            };
        }
    }

    this.unwrapOneLevel = function (object) {
        var prop,
            result = {};

        if (object) {
            if (object instanceof jasonDataSource) {
                result = object;
            }
            else if (typeof object === "object") {
                for (prop in object) {
                    //include things on prototype
                    result[prop] = unwrap(object[prop]);
                }
            }
        }

        return result;
    };

    this.handleEvents = function (options, widgetConfig, element, widget, context) {
        var prop, eventConfig, events = widgetConfig.events;

        if (events) {
            for (prop in events) {
                if (events.hasOwnProperty(prop)) {
                    eventConfig = events[prop];
                    if (typeof eventConfig === "string") {
                        eventConfig = { value: eventConfig, writeTo: eventConfig };
                    }

                    self.handleOneEvent(prop, eventConfig, options, element, widget, widgetConfig.childProp, context);
                }
            }
        }
    }

    //bind to a single event
    this.handleOneEvent = function (eventName, eventConfig, options, element, widget, childProp, context) {
        var handler = typeof eventConfig === "function" ? eventConfig : options[eventConfig.call];

        //call a function defined directly in the binding definition, supply options that were passed to the binding
        if (typeof eventConfig === "function") {
            handler = handler.bind(context.$data, options);
        }
            //use function passed in binding options as handler with normal KO args
        else if (eventConfig.call && typeof options[eventConfig.call] === "function") {
            handler = options[eventConfig.call].bind(context.$data, context.$data);
        }
            //option is observable, determine what to write to it
        else if (eventConfig.writeTo && ko.isWriteableObservable(options[eventConfig.writeTo])) {
            handler = function (sender) {
                var propOrValue, value;

                if (!childProp || !e[childProp] || e[childProp] === element) {
                    propOrValue = eventConfig.value;
                    value = (typeof propOrValue === "string" && sender[propOrValue]) ? sender[propOrValue] : propOrValue;
                    options[eventConfig.writeTo](value);
                }
            };
        }

        if (handler) {
            widget.addEventListener(eventName, handler);
            //widget.bind(eventName, handler);
        }
    };

    this.watchValues = function (widget, options, widgetConfig, element) {
        var watchProp, watchValues = widgetConfig.watch;
        if (watchValues) {
            for (watchProp in watchValues) {
                if (watchValues.hasOwnProperty(watchProp)) {
                    self.watchOneValue(watchProp, widget, options, widgetConfig, element);
                }
            }
        }
    }

    this.watchOneValue = function (prop, widget, options, widgetConfig, element) {
        var computed = ko.computed({
            read: function () {
                var existing, custom,
                    action = widgetConfig.watch[prop],
                    value = unwrap(options[prop]),
                    params = widgetConfig.parent ? [element] : []; //child bindings pass element first to APIs

                //support passing multiple events like ["open", "close"]
                if (Array.isArray(action)) {
                    action = widget[value ? action[0] : action[1]];
                } else if (typeof action === "string") {
                    action = widget[action];
                } else {
                    custom = true; //running a custom function
                }

                if (options[prop] !== undefined) {
                    //if watched property is of type function
                    //then call it to update widgets value.
                    if (typeof action == "function") {
                        if (!custom) {
                            existing = action.apply(widget, params);
                            params.push(value);
                        } else {
                            params.push(value, options);
                        }

                        //try to avoid unnecessary updates when the new value matches the current value
                        if (custom || existing !== value) {
                            action.apply(widget, params);
                        }
                    } else {
                        //if its a simple property just update it.
                        if (widget.hasOwnProperty(widgetConfig.watch[prop]))
                            widget[widgetConfig.watch[prop]] = value;
                        else {
                            if (widget.options.hasOwnProperty(widgetConfig.watch[prop]))
                                widget.options[widgetConfig.watch[prop]] = value;
                        }
                    }
                }
            },
            disposeWhenNodeIsRemoved: element
        }).extend({ throttle: (options.throttle || options.throttle === 0) ? options.throttle : 1 });

        //if option is not observable, then dispose up front after executing the logic once
        if (!ko.isObservable(options[prop])) {
            computed.dispose();
        }
    };

    //utility to set the dataSource with a clean copy of data. Could be overridden at run-time.
    this.setDataSource = function (widget, data, options) {
        var isMapped, cleanData;

        if (data instanceof jasonDataSource) {
            widget.data(data);
            return;
        }

        //Small performance improvement workaround when consumer knows upfront when widget data do not include any observables.
        //https://github.com/kendo-labs/knockout-kendo/pull/148
        if (!options || (!options.dataIsSimpleJS && !options.useKOTemplates)) {
            isMapped = ko.mapping && data && data.__ko_mapping__;
            cleanData = data && isMapped ? ko.mapping.toJS(data) : ko.toJS(data);
        }

        widget.dataSource.setData(cleanData || data);
    };
}

var
    VALUE = "value",
    ENABLED = "enabled",
    VISIBLE = "visible",
    PLACEHOLDER = "placeholder",
    MIN = "min",
    MAX = "max",
    PREFIX = "prefix",
    SUFFIX = "suffix",
    USEGROUPING = "useGrouping",
    CAPTION = "caption",
    ICON = "icon",
    CONTENT = "content",
    AUTOPLACEMENT = "autoPlacement",
    AUTOSIZE = "autoSize",
    CLOSEBUTTON = "closeButton",
    POSITION = "position",
    ALIGNMENT = "alignment",
    ARROWPLACEMENT = "arrowPlacement",
    COORDINATES = "coordinates",
    TARGETELEMENT = "targetElement",
    MODE = "mode",
    MODEL = "model",
    MULTISELECT = "multiselect",
    CHECKBOXES = "checkboxes",
    MODAL = "modal",
    TITLE = "title",
    RESIZEABLE = "resizeable",
    ANIMATION = "animation",
    DATEFORMAT = "dateFormat",
    TIMEFORMAT = "timeFormat",
    READONLY = "readonly",
    INTERVAL = "interval",
    DISPLAYFORMAT = "displayFormat",
    TIME = "time",
    DATE = "date",
    INVOKABLE = "invokable",
    INVOKABLEELEMENT = "invokableElement",
    AUTOHIDE = "autoHide",
    SPECIALDATES = "specialDates",
    FIRSTDAYOFWEEK = "firstDayOfWeek",
    RANGESELECT = "rangeSelect",
    WIDTH = "width",
    HEIGHT = "height",
    SELECTEDDATES = "selectedDates",
    ORIENTATION = "orientation",
    HIDEDELAY = "hideDelay",
    TARGET = "target",
    KEYFIELDNAME = "keyFieldName",
    DROPDOWNLIST = "dropDownList",
    AUTOFILTER = "autoFilter",
    CASESENSITIVESEARCH = "caseSentiveSearch",
    DISPLAYFIELDS = "displayFields",
    PAGEHEIGHT = "PAGEHEIGHT",
    TABINDEX = "tabIndex",
    GROUPING = "grouping",
    FILTERING = "filtering",
    SORTING = "sorting",
    COLUMNMENU = "columnMenu",
    RESIZING = "resizing",
    REORDERING = "reordering",
    MENU = "menu",
    BUTTONS = "buttons",
    MULTISELECTIONSEPARATOR = "multipleSelectionSeparator",
    ONCHANGE = "onchange";


ko.jsWidgets = {};
ko.jsWidgets.bindingFactory = new jwKnockoutFactory();

ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonGrid",
    async: true,
    defaultOption: DATA,
    watch: {
        data: function (value, options) {
            ko.jsWidgets.bindingFactory.setDataSource(this, value, options);
        },
        multiSelect: MULTISELECT,
        grouping: GROUPING,
        filtering: FILTERING,
        sorting: SORTING,
        columnMenu: COLUMNMENU,
        resizing: RESIZING,
        reordering: REORDERING
    },
    templates: ["rowTemplate"]
});

ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonTabControl",
    async: true,
    watch: {
        pageHeight: PAGEHEIGHT,
        tabIndex: TABINDEX
    }
});

ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonCombobox",
    events: {
        onChange: VALUE  //when onChange event occurs update observable that is bound to the value property.
    },
    watch: {
        data: function (value, options) {
            ko.jsWidgets.bindingFactory.setDataSource(this, value, options);
        },
        value: VALUE,
        enabled: ENABLED,
        visible: VISIBLE,
        placeholder: PLACEHOLDER,
        displayFormat: DISPLAYFORMAT,
        readonly: READONLY,
        multiSelect: MULTISELECT,
        multiSelectionSeparator:MULTISELECTIONSEPARATOR,
        checkboxes: CHECKBOXES,
        dropDownList: DROPDOWNLIST,
        autoFilter: AUTOFILTER,
        keyFieldName: KEYFIELDNAME,
        caseSensitiveSearch: CASESENSITIVESEARCH,
        displayFields: DISPLAYFIELDS
    }
});


ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonMenu",
    watch: {
        orientation: ORIENTATION,
        menu: MENU,
        animation: ANIMATION,
        width: WIDTH,
        height: HEIGHT,
        hideDelay: HIDEDELAY,
        autoHide: AUTOHIDE,
        invokable: INVOKABLE
    }
});


ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonMenu",
    bindingName: "jasonContextMenu",
    watch: {
        orientation: ORIENTATION,
        menu: MENU,
        animation: ANIMATION,
        width: WIDTH,
        height: HEIGHT,
        hideDelay: HIDEDELAY,
        autoHide: AUTOHIDE,
        invokable: INVOKABLE,
        target: TARGET
    }
});


ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonCalendar",
    events: {
        onChange: VALUE  //when onChange event occurs update observable that is bound to the value property.
    },
    watch: {
        value: VALUE,
        enabled: ENABLED,
        visible: VISIBLE,
        readonly: READONLY,
        invokable: INVOKABLE,
        invokableElement: INVOKABLEELEMENT,
        autoHide: AUTOHIDE,
        specialDates: SPECIALDATES,
        firstDayOfWeek: FIRSTDAYOFWEEK,
        multiSelect: MULTISELECT,
        rangeSelect: RANGESELECT,
        width: WIDTH,
        height: HEIGHT,
        mode: MODE,
        selectedDates: SELECTEDDATES
    }
});

ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonDatePicker",
    events: {
        onChange: VALUE  //when onChange event occurs update observable that is bound to the value property.
    },
    watch: {
        value: VALUE,
        enabled: ENABLED,
        visible: VISIBLE,
        placeholder: PLACEHOLDER,
        displayFormat: DISPLAYFORMAT,
        readonly: READONLY,
        interval: INTERVAL,
        date: DATE
    }
});

ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonTimePicker",
    events: {
        onChange: VALUE  //when onChange event occurs update observable that is bound to the value property.
    },
    watch: {
        value: VALUE,
        enabled: ENABLED,
        visible: VISIBLE,
        placeholder: PLACEHOLDER,
        displayFormat: DISPLAYFORMAT,
        readonly: READONLY,
        interval: INTERVAL,
        time: TIME
    }
});

ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonDateTimePicker",
    events: {
        onChange: VALUE  //when onChange event occurs update observable that is bound to the value property.
    },
    watch: {
        value: VALUE,
        enabled: ENABLED,
        visible: VISIBLE,
        placeholder: PLACEHOLDER,
        dateFormat: DATEFORMAT,
        timeFormat: TIMEFORMAT,
        readonly: READONLY,
        mode: MODE,
        interval: INTERVAL
    }
});

ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonDialog",
    watch: {
        modal: MODAL,
        title: TITLE,
        buttons: BUTTONS,
        resizeable: RESIZEABLE,
        animation: ANIMATION
    }
});

ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonDropDownListButton",
    events: {
        onChange: VALUE
    },
    watch: {
        data: function (value, options) {
            ko.jsWidgets.bindingFactory.setDataSource(this, value, options);
        },
        value: VALUE,
        enabled: ENABLED,
        visible: VISIBLE,
        caption: CAPTION,
        icon: ICON,
        multiSelect: MULTISELECT,
        multiSelectionSeparator: MULTISELECTIONSEPARATOR,
        checkboxes: CHECKBOXES,
        readonly: READONLY
    }
});

ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonPopover",
    watch: {
        content: CONTENT,
        autoPlacement: AUTOPLACEMENT,
        autoSize: AUTOSIZE,
        closeButton: CLOSEBUTTON,
        position: POSITION,
        alignment: ALIGNMENT,
        arrowPlacement: ARROWPLACEMENT,
        coordinates: COORDINATES,
        targetElement: TARGETELEMENT,
        mode: MODE,
        model: MODEL
    }
});

ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonButton",
    watch: {
        caption: CAPTION,
        icon: ICON,
        enabled: ENABLED,
        visible: VISIBLE,
        readonly: READONLY
    }
});

ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonButtonTextbox",
    events: {
        onChange: VALUE  //when onChange event occurs update observable that is bound to the value property.
    },
    watch: {
        value: VALUE,
        enabled: ENABLED,
        visible: VISIBLE,
        placeholder: PLACEHOLDER,
        icon: ICON,
        readonly: READONLY
    }
});

ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonNumericTextbox",
    events: {
        onChange: VALUE  //when onChange event occurs update observable that is bound to the value property.
    },
    watch: {
        value: VALUE,
        enabled: ENABLED,
        visible: VISIBLE,
        min: MIN,
        max: MAX,
        useGrouping: USEGROUPING,
        prefix: PREFIX,
        suffix: SUFFIX,
        placeholder: PLACEHOLDER,
        readonly: READONLY
    }
});

ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonTextbox",
    events: {
        onChange: VALUE  //when onChange event occurs update observable that is bound to the value property.
    },
    watch: {
        value: VALUE,
        enabled: ENABLED,
        visible: VISIBLE,
        placeholder: PLACEHOLDER,
        readonly: READONLY
    }
});