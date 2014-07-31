// Copyright (c) Microsoft Open Technologies, Inc.  All Rights Reserved. Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
(function () {
    "use strict";

    var config = {};
    module.exports = config;

    config.version = "2.1";
    config.buildDate = new Date();
    config.month = config.buildDate.getMonth() + 1;
    config.buildDateString = config.buildDate.getFullYear() + "." + config.month + "." + config.buildDate.getDate();
    config.localeFolder = "en-US";
    config.outputFolder = "bin/";
    config.copyright = '/*! Copyright (c) Microsoft Open Technologies, Inc.  All Rights Reserved. Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information. */';

    config.testsOutput = "";

    if (process.env._NTTREE) {
        config.inRazzle = true;
        config.outputFolder = process.env._NTTREE + "/Corsica/";
        config.testsOutput = config.outputFolder + "other." + config.version + ".debug/tests/unittests/";
    } else {
        config.testsOutput = config.outputFolder + "tests/";
        config.inRazzle = false;
    }

    config.targetName = "WinJS." + config.version;
    config.desktopFramework = "Microsoft." + config.targetName;
    config.phoneFramework = "Microsoft.Phone." + config.targetName;
    config.desktopOutput = config.outputFolder + config.desktopFramework + "/";
    config.phoneOutput = config.outputFolder + config.phoneFramework + "/";
    config.modulesOutput = config.outputFolder + "modules/";

    config.uiStringsFiles = [
        "src/js/library/stringsHeader.js",
        "src/js/" + config.localeFolder + "/ui.prefix.js",
        "src/js/" + config.localeFolder + "/ui.resjson",
        "src/js/library/stringsFooter.js"
    ];

    config.lint = {
        srcFiles: ["src/**/*.js"],
        buildFiles: ["gruntfile.js", "config.js", "tasks/**/*.js"]
    };

    // Object that aggregates the saucelabs test results that we report through our automation
    config.tests_results = {    
        "date": new Date(),
        "environment": [],
        "results":  []
    };


})();