/// <binding ProjectOpened='watch' />
var config = {
    jsPath: "Widgets/",
    debugPath: "Widgets/Build/Debug/",
    releasePath: "Widgets/Build/Release/",
    debugFilenames: {
        jasonWigets: "jw-widgets-debug.js",
        knockout: "jw-knockout-debug.js",
        jQuery: "jw-jQuery-debug.js",
        angular:"jw-angular-debug.js",
        css:"jw-widgets-default-debug.css"
    },
    releaseFilenames: {
        jasonWigets: "jw-widgets-release.js",
        jasonWigetsMin: "jw-widgets-release.min.js",
        knockout: "jw-knockout-release.js",
        knockoutMin: "jw-knockout-release.min.js",
        angular: "jw-angular-release.js",
        angularMin:"jw-angular-release.min.js",
        jQuery: "jw-jQuery-release.js",
        jQueryMin: "jw-jQuery-release.min.js",
        css: "jw-widgets-default-release.css",
        cssMin: "jw-widgets-default-release.min.css"
    },
    fileNames: {
        CSS: {
            sprites :"LESS/thinline-sprites.css",
            common: "jasonCommon.css",
            calendar: "Calendar/jasonCalendar.css",
            combobox: "Combobox/jasonCombobox.css",
            grid: "Grid/jasonGrid.css",
            menu: "Menu/jasonMenu.css",
            dateTimePicker: "DateTimePicker/jasonDateTimePicker.css",
            tabcontrol: "Tabcontrol/jasonTabControl.css",
            dialog: "Dialog/jasonDialog.css",
            textbox: "TextBox/jasonTextbox.css",
            buttonTextbox: "ButtonTextbox/jasonButtonTextbox.css",
            numericTextbox: "NumericTextbox/jasonNumericTextbox.css",
            popover: "Popover/jasonPopover.css",
            responsive:"responsive.css"
        },
        JS: {
            common:{
                common: "Common/jasonCommon.js",
                htmlFactory: "Common/jasonHTMLFactory.js",
                baseWidget: "Common/jasonBaseWidget.js",
                datasource: "Common/jasonDatasource.js",
                eventmanager: "Common/jasonEventManager.js",
                localizationManager: "Common/jasonLocalizationManager.js",
                dataUtils: "Common/jasonDataUtils.js",
                dragResize: "Common/jasonDragResize.js",
                blockUI: "Common/jasonBlockUI.js",
                validation: "Common/jasonValidation.js"
            },
            localization: {
                langEL:"Localization/Languages/jasonWidgets-EL.js",
                langENUS:"Localization/Languages/jasonWidgets-EN-US.js",
                langES:"Localization/Languages/jasonWidgets-ES.js",
                langIT:"Localization/Languages/jasonWidgets-IT.js",
                cultureEL: "Localization/Cultures/jasonWidgetsCulture-EL.js",
                cultureENUS: "Localization/Cultures/jasonWidgetsCulture-EN-US.js",
                cultureES: "Localization/Cultures/jasonWidgetsCulture-ES.js",
                cultureIT:"Localization/Cultures/jasonWidgetsCulture-IT.js",
            },
            textbox: "Textbox/jasonTextbox.js",
            buttonTextbox: "ButtonTextbox/jasonButtonTextbox.js",
            combobox: "Combobox/jasonCombobox.js",
            menu: {
                menu: "Menu/jasonMenu.js",
                parsers: "Menu/jasonMenuParsers.js",
                ui: "Menu/jasonMenuUI.js",
                contextMenu: "Menu/jasonContextMenuUI.js"
            },
            calendar: "Calendar/jasonCalendar.js",
            tabcontrol: "TabControl/jasonTabControl.js",
            numericTextbox: "NumericTextbox/jasonNumericTextbox.js",
            grid: {
                ui: "Grid/jasonGridUI.js",
                grid: "Grid/jasonGrid.js"
            },
            datePicker: "DateTimePicker/jasonDatePicker.js",
            timePicker: "DateTimePicker/jasonTimePicker.js",
            dateTimePicker: "DateTimePicker/jasonDateTimePicker.js",
            button: "Buttons/jasonButton.js",
            dropDownlistButton: "Buttons/jasonDropDownListButton.js",
            dialog: "Dialog/jasonDialog.js",
            popover: "Popover/jasonPopover.js"
        }
    }
}

var
    gulp = require("gulp"),
    concat = require("gulp-concat"),
  rename = require("gulp-rename"),
  less = require("gulp-less"),
  cleanCSS = require('gulp-clean-css'),
uglify = require("gulp-uglify"),
replace = require("gulp-replace");


var jwWidgets = [
    config.jsPath + config.fileNames.JS.common.common,
    config.jsPath + config.fileNames.JS.common.htmlFactory,
    config.jsPath + config.fileNames.JS.common.baseWidget,
    config.jsPath + config.fileNames.JS.common.dataUtils,
    config.jsPath + config.fileNames.JS.common.datasource,
    config.jsPath + config.fileNames.JS.common.eventmanager,
    config.jsPath + config.fileNames.JS.common.localizationManager,
    config.jsPath + config.fileNames.JS.common.dragResize,
    config.jsPath + config.fileNames.JS.common.blockUI,
    config.jsPath + config.fileNames.JS.common.validation,
    config.jsPath + config.fileNames.JS.localization.langEL,
    config.jsPath + config.fileNames.JS.localization.langENUS,
    config.jsPath + config.fileNames.JS.localization.langES,
    config.jsPath + config.fileNames.JS.localization.langIT,
    config.jsPath + config.fileNames.JS.localization.cultureEL,
    config.jsPath + config.fileNames.JS.localization.cultureENUS,
    config.jsPath + config.fileNames.JS.localization.cultureES,
    config.jsPath + config.fileNames.JS.localization.cultureIT,
    config.jsPath + config.fileNames.JS.textbox,
    config.jsPath + config.fileNames.JS.buttonTextbox,
    config.jsPath + config.fileNames.JS.combobox,
    config.jsPath + config.fileNames.JS.menu.menu,
    config.jsPath + config.fileNames.JS.menu.parsers,
    config.jsPath + config.fileNames.JS.menu.ui,
    config.jsPath + config.fileNames.JS.menu.contextMenu,
    config.jsPath + config.fileNames.JS.calendar,
    config.jsPath + config.fileNames.JS.tabcontrol,
    config.jsPath + config.fileNames.JS.numericTextbox,
    config.jsPath + config.fileNames.JS.grid.ui,
    config.jsPath + config.fileNames.JS.grid.grid,
    config.jsPath + config.fileNames.JS.datePicker,
    config.jsPath + config.fileNames.JS.timePicker,
    config.jsPath + config.fileNames.JS.dateTimePicker,
    config.jsPath + config.fileNames.JS.dialog,
    config.jsPath + config.fileNames.JS.button,
    config.jsPath + config.fileNames.JS.dropDownlistButton,
    config.jsPath + config.fileNames.JS.popover

];
var jwKnockout = [config.jsPath + "Integrations/KnockoutJS/jasonWidgets-knockout.js"];
var jwQuery = [config.jsPath + "Integrations/jQuery/jasonJQueryPlugins.js"];
var jwAngular = [config.jsPath + "Integrations/AngularJS/jasonWidgets-Angular.js"];
var jwCSS = [
    config.jsPath + config.fileNames.CSS.sprites,
    config.debugPath + config.fileNames.CSS.common,
    config.debugPath + config.fileNames.CSS.calendar,
    config.debugPath + config.fileNames.CSS.combobox,
    config.debugPath + config.fileNames.CSS.grid,
    config.debugPath + config.fileNames.CSS.menu,
    config.debugPath + config.fileNames.CSS.tabcontrol,
    config.debugPath + config.fileNames.CSS.dialog,
    config.debugPath + config.fileNames.CSS.textbox,
    config.debugPath + config.fileNames.CSS.buttonTextbox,
    config.debugPath + config.fileNames.CSS.numericTextbox,
    config.debugPath + config.fileNames.CSS.popover,
    config.debugPath + config.fileNames.CSS.dateTimePicker,
    config.debugPath + config.fileNames.CSS.responsive
];
var jwLess = [
    config.jsPath + "LESS/**/*.less"
];

gulp.task("compileLESS", function () {
    //'./less/**/*.less'

    return gulp.src(jwLess)
    .pipe(less({
        paths:[config.jsPath + "LESS/"]
    }))
    .pipe(gulp.dest(config.debugPath));
});

gulp.task("bundle",["compileLESS"], function () {
    //debug jasonWidgets
    gulp.src(jwWidgets)
    .pipe(concat(config.debugFilenames.jasonWigets))
    .pipe(gulp.dest(config.debugPath));

    //debug jasonQuery
    gulp.src(jwQuery)
    .pipe(concat(config.debugFilenames.jQuery))
    .pipe(gulp.dest(config.debugPath));

    //debug jasonKnockout
    gulp.src(jwKnockout)
    .pipe(concat(config.debugFilenames.knockout))
    .pipe(gulp.dest(config.debugPath));

    //debug jasonAngular
    gulp.src(jwAngular)
    .pipe(concat(config.debugFilenames.angular))
    .pipe(gulp.dest(config.debugPath));
       
    //release jasonwidgets.
    gulp.src(jwWidgets)
    .pipe(concat(config.releaseFilenames.jasonWigets))
    .pipe(gulp.dest(config.releasePath));

    //release jasonQuery
    gulp.src(jwQuery)
    .pipe(concat(config.releaseFilenames.jQuery))
    .pipe(gulp.dest(config.releasePath))

    //release jasonKnockout
    gulp.src(jwKnockout)
    .pipe(concat(config.releaseFilenames.knockout))
    .pipe(gulp.dest(config.releasePath))

    //release jasonAngular
    gulp.src(jwAngular)
    .pipe(concat(config.releaseFilenames.angular))
    .pipe(gulp.dest(config.releasePath))

    //debug CSS
    gulp.src(jwCSS)
    .pipe(concat(config.debugFilenames.css))
    .pipe(replace("../Sprites","Sprites"))
    .pipe(gulp.dest(config.debugPath));

    //result CSS
    gulp.src(jwCSS)
    .pipe(concat(config.releaseFilenames.css))
    .pipe(replace("../Sprites", "Sprites"))
    .pipe(gulp.dest(config.releasePath));

    return true;
});

gulp.task("minify",["bundle"], function () {
    gulp.src(config.releasePath + config.releaseFilenames.jasonWigets)
    .pipe(rename(config.releaseFilenames.jasonWigetsMin))
    .pipe(uglify())
    .pipe(gulp.dest(config.releasePath));

    gulp.src(config.releasePath + config.releaseFilenames.jQuery)
    .pipe(rename(config.releaseFilenames.jQueryMin))
    .pipe(uglify())
    .pipe(gulp.dest(config.releasePath));

    gulp.src(config.releasePath + config.releaseFilenames.knockout)
    .pipe(rename(config.releaseFilenames.knockoutMin))
    .pipe(uglify())
    .pipe(gulp.dest(config.releasePath));

    gulp.src(config.releasePath + config.releaseFilenames.angular)
    .pipe(rename(config.releaseFilenames.angularMin))
    .pipe(uglify())
    .pipe(gulp.dest(config.releasePath));

    gulp.src(config.debugPath + config.debugFilenames.css)
        .pipe(rename(config.releaseFilenames.cssMin))
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.releasePath));

});

gulp.task("watch", function () {
    gulp.watch(jwLess,["compileLESS","bundle","minify"]);
});