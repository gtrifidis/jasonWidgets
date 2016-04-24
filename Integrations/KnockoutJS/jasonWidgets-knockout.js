/**
 * @interface
 * @name KnockoutJS 
 * @property {function} jasonGrid - jasonGrid binding. @sample Binding example: data-bind="jasonGrid:{data:customers}"
 * @property {function} jasonCombobox - jasonCombobox binding. @sample Binding example data-bind="jasonCombobox:{data:customers,displayFields: ['FirstName', 'LastName'], displayFormatString: '{0},{1}'}".
 * @property {function} jasonTabControl - jasonTabControl binding. @sample Binding example: data-bind="jasonTabControl:{pageHeight:750}"
 * @property {function} jasonMenu - jasonMenu binding. @sample Binding example: data-bind="jasonMenu:{ animation: { speed: 9 }, orientation: 'horizontal'}"
 * @property {function} jasonContextMenu - jasonContextMenu binding. @sample Binding example: data-bind="jasonContextMenu:{ target: document.getElementById('contextMenuDemoTarget')}"
 * @property {function} jasonCalendar - jasonCalendar binding. @sample Binding example: data-bind="jasonCalendar:{
            firstDayOfWeek: 5,
            multiSelect: true,
            rangeSelect: false,
            specialDates: [
                { date: '1978/11/09', tooltip: 'My birthday', cssClass: 'birthday' },
                { date: '2000/12/01', tooltip: 'New Year', recurring: true }
            ]
        }"
 * @property {function} jasonDatePicker - jasonDatePicker binding. @sample Binding example: data-bind="jasonDatePicker:{ placeholder: 'Type in a date', displayFormat: 'dd/MM/yyyy' }"
 * @property {function} jasonTimePicker - jasonTimePicker binding. @sample Binding example: data-bind="jasonTimePicker:{ placeholder: 'Type in a time' }"
 */

var
    DATA = "data";
var unwrap = ko.utils.unwrapObservable; //support older 2.x KO where ko.unwrap was not defined
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
                    jw.common.triggerGlobalEvent(JGE_REDRAW);
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
        if (typeof widgetConstructor == "function") {
            widget = options.uiHelper ? new widgetConstructor(element, options,options.uiHelper) : new widgetConstructor(element, options);
        }
        //if the widget option was specified, then fill it with our widget
        if (ko.isObservable(options.widget)) {
            options.widget(widget);
        }

        return widget;
    };

    this.setupTemplates = function (templateConfig,options,element,context) {
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

        //if (object) {
        //    if (object instanceof kendo.data.DataSource) {
        //        result = object;
        //    }
        //    else if (typeof object === "object") {
        //        for (prop in object) {
        //            //include things on prototype
        //            result[prop] = unwrap(object[prop]);
        //        }
        //    }
        //}

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

                if (action && options[prop] !== undefined) {
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

ko.jsWidgets = {};
ko.jsWidgets.bindingFactory = new jwKnockoutFactory();

ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonGrid",
    async:true,
    defaultOption: DATA,
    watch: {
        data: function (value, options) {
            ko.jsWidgets.bindingFactory.setDataSource(this, value, options);
        }
    },
    templates: ["rowTemplate"]
});

ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonTabControl",
    async:true
});

ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonCombobox",
    watch: {
        data: function (value, options) {
            ko.jsWidgets.bindingFactory.setDataSource(this, value, options);
        }
    }
});


ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonMenu"
});


ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonMenu",
    bindingName:"jasonContextMenu"
});


ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonCalendar"
});

ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonDatePicker"
});

ko.jsWidgets.bindingFactory.createBinding({
    name: "jasonTimePicker"
});
