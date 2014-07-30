// Copyright (c) Microsoft Open Technologies, Inc.  All Rights Reserved. Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
(function () {
    "use strict";

    module.exports = function (grunt) {
        var config = require("./config.js");
        config.grunt = grunt;

        // Strip source files of their BOMs. BOMs will be added at the end of the build
        // by the "add-bom" task.
        grunt.file.preserveBOM = false;

        // Helper function to load the config file
        function loadConfig(path) {
            var glob = require("glob");
            var object = {};
            var key;

            glob.sync("*.js", { cwd: path }).forEach(function (option) {
                key = option.replace(/\.js$/, "");
                object[key] = require(path + option);
            });

            return object;
        }

        // Load task options
        var gruntConfig = loadConfig("./tasks/options/");

        // Package data
        gruntConfig.pkg = grunt.file.readJSON("package.json");

        // Project config
        grunt.initConfig(gruntConfig);

        // Load all grunt-tasks in package.json
        require("load-grunt-tasks")(grunt);

        // Register external tasks
        grunt.loadTasks("tasks/");
        
        // Tasks that drop things in bin/ (should have "add-bom" as the last task)
        grunt.registerTask("default", ["clean", "check-file-names", "build-qunit", "less", "concat", "_build", "copy", "replace", "add-bom"]);
        grunt.registerTask("release", ["jshint", "default", "uglify", "add-bom"]);
        grunt.registerTask("minify", ["uglify", "add-bom"]);
        
        // Private tasks (not designed to be used from the command line)
        grunt.registerTask("_build", ["requirejs:base", "requirejs:basePhone", "requirejs:ui", "requirejs:uiPhone", "requirejs:singleFile"]);
        
        // Other tasks
        grunt.registerTask("modules", ["clean:modules", "requirejs:publicModules", "replace:base"]);
        grunt.registerTask("lint", ["jshint"]);
        grunt.registerTask("saucelabs", ["connect:saucelabs", "saucelabs-qunit", "post-tests-results"]);
    };
})();
