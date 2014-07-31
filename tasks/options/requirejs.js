// Copyright (c) Microsoft Open Technologies, Inc.  All Rights Reserved. Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
(function () {
    "use strict";

    var path = require('path');
    var madge = require('madge');
    var config = require("../../config.js");
    var grunt = config.grunt;

    var desktopBase = config.desktopOutput + "js/base.js";
    var phoneBase = config.phoneOutput + "js/base.js";
    var desktopUI = config.desktopOutput + "js/ui.js";
    var phoneUI = config.phoneOutput + "js/ui.js";

    var bundles = {};

    function generatePublicModules() {
        var moduleConfig = [];
        var dependencies = madge('./src/js/', { format: 'amd' }).tree;

        Object.keys(dependencies).forEach(function (module) {
            // filter for only public modules
            if (startsWith(module, "WinJS/") && module.indexOf('_') === -1) {

                var privateModules = [];
                var processed = dependencies[module].slice(0);

                var excludes = dependencies[module].slice(0).filter(function (dep) {
                    if (startsWith(dep, module)) {
                        privateModules.push(dep);
                        return false;
                    }
                    return true;
                });

                var processQueue = processed.slice(0);

                while (processQueue.length) {
                    var next = processQueue.pop();
                    dependencies[next].forEach(function (dep) {
                        if (processed.indexOf(dep) === -1) {
                            processQueue.push(dep);
                        }
                        if (startsWith(dep, module)) {
                            if (privateModules.indexOf(dep) === -1) {
                                privateModules.push(dep);
                            }
                        } else if (excludes.indexOf(dep) === -1) {
                            excludes.push(dep);
                        }
                    });
                }

                if (privateModules.length) {
                    bundles[module] = privateModules;
                }

                var includes = [];

                moduleConfig.push({
                    name: module,
                    exclude: ['require-style'],
                    excludeShallow: excludes,
                    include: includes
                });

            }
        });

        return moduleConfig;
    }

    function moduleDone(done, output) {
        var fs = require("fs-extra");

        // require-style seems to build in WinJS rather then in the root
        fs.copySync(path.join(config.modulesOutput, "WinJS/css"), path.join(config.modulesOutput, "css"));
        // rename the main file
        fs.copySync(path.join(config.modulesOutput, "WinJS.js"), path.join(config.modulesOutput, "WinJS-custom.js"));
        // replace require-style with a stub
        fs.writeFileSync(path.join(config.modulesOutput, "require-style.js"), config.copyright + "define({ load: function (name, req, onload, config) { onload(); }});");

        // require.js copies some undesirable source files over
        var toRemove = [
            "less",
            "build/Copyright.js",
            "WinJS.js",
            "WinJS/css",
            "WinJS/Core",
            "WinJS/Controls/AppBar"
        ];
        toRemove.forEach(function (item) {
            fs.removeSync(path.join(config.modulesOutput, item));
        });


        var pkgRoot = "node_modules/winjs-modules/";
        var requireConfig = {
            baseUrl: ".",
            name: "WinJS-custom",
            deps: ["amd"],
            optimize: "none",
            useStrict: true,
            out: "bin/WinJS.js",
            wrap: {
                start: header("WinJS-custom", []),
                end: footer("WinJS-custom"),
            },
            paths: {
                "amd": pkgRoot + "amd",
                "require-style": pkgRoot + "require-style",
                "WinJS": pkgRoot + "WinJS",
                "less-phone": "empty:",
                "less-desktop": "empty:"
            },
            bundles: bundles
        };
        var output = "(" + JSON.stringify(requireConfig, null, 4) + ")";
        fs.writeFileSync(path.join(config.modulesOutput, "example.build.js"), output);

        done();
    }

    var desktopBaseFiles = [];
    var phoneBaseFiles = [];

    var rootPath = path.resolve();
    var realFileNames = [];

    grunt.file.recurse('src', function (abspath) {
        realFileNames.push(path.join(rootPath, abspath));
    });

    grunt.file.recurse('tasks/utilities', function (abspath) {
        realFileNames.push(path.join(rootPath, abspath));
    });

    function checkDuplicates(bundle1, bundle2, bundle2Name) {
        bundle1.forEach(function (file) {
            if (bundle2.indexOf(file) !== -1) {
                grunt.fail.warn("File duplicated in build output:\n " + file + ". Duplicate location:\n " + bundle2Name);
            }
        });
    }

    function startsWith(str, target) {
        return str.indexOf(target) === 0;
    }

    function endsWith(str, target) {
        return str.indexOf(target, str.length - target.length) !== -1;
    }

    // ensure that the files discovered by requireJS have appropriate
    // casing so that non-Windows builds will work.
    function done(done, output) {

        var lines = output.split('\n');
        var bundle = lines[1];
        lines.splice(0, 3);
        lines.pop();

        // Remove empty: pattern resources added by Less build.
        lines = lines.filter(function (line) {
            return line.indexOf("empty:") === -1;
        });

        if (endsWith(bundle, desktopBase)) {
            desktopBaseFiles = lines;
        } else if (endsWith(bundle, phoneBase)) {
            phoneBaseFiles = lines;
        } else if (endsWith(bundle, desktopUI)) {
            checkDuplicates(desktopBaseFiles, lines, bundle);
        } else if (endsWith(bundle, phoneUI)) {
            checkDuplicates(phoneBaseFiles, lines, bundle);
        }

        lines = lines.map(function (line) {
            return path.normalize(line.replace("require-style!", ""));
        });

        lines.forEach(function (line) {
            if (realFileNames.indexOf(line) === -1) {
                grunt.fail.warn("Source file in build is not in filesystem:" + line + ". Check casing of filename.");
            }
        });

        done();
    }

    function header(name, dependencies) {
        var header = "\n" +
"/*! Copyright (c) Microsoft Open Technologies, Inc.  All Rights Reserved. Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information. */\n" +
"(function (global) {\n" +
"\n" +
"    (function (factory) {\n" +
"        if (typeof define === 'function' && define.amd) {\n" +
"            define([" + dependencies.map(JSON.stringify).join(",") + "], factory);\n" +
"        } else {\n" +
"            global.msWriteProfilerMark && msWriteProfilerMark('$(TARGET_DESTINATION) $(build.version).$(build.branch).$(build.date) " + name + ".js,StartTM');\n" +
// global.WinJS is here for the have dependencies case where they have already defined WinJS
"            factory(global.WinJS);\n" +
"            global.msWriteProfilerMark && msWriteProfilerMark('$(TARGET_DESTINATION) $(build.version).$(build.branch).$(build.date) " + name + ".js,StopTM');\n" +
"        }\n" +
"    }(function (WinJS) {\n" +
"\n";
        // If this has dependencies it should assume they define WinJS.Utilities._require
        if (dependencies.length) {
            header += "\n" +
"var require = WinJS.Utilities._require;\n" +
"var define = WinJS.Utilities._define;\n" +
"\n";
        }

        return header;
    }

    function footer(name) {
        return "\n" +
"        require(['WinJS/Core/_WinJS', '" + name + "'], function (_WinJS) {\n" +
"            global.WinJS = _WinJS;\n" +
"            return _WinJS;\n" +
"        });\n" +
"    }));\n" +
"}(this));\n" +
"\n";
    }

    module.exports = {

        //
        // Configs which are themselves a independent file can use default options and the 
        //  onefile grunt task and thus are not listed here
        //

        // UI just has to specify that it is expected to depend on base and it is someone 
        //  else's job to ensure that base was loaded first.
        ui: {
            options: {
                exclude: ['./base'],
            }
        },

        // Phone configs
        basePhone: {
            options: {
                platform: "phone",
                name: 'base',
                include: ['WinJS/Core/_BaseUtilsPhone'],
            }
        },
        uiPhone: {
            options: {
                platform: "phone",
                name: 'ui-phone',
                target: 'ui', // because ui-phone actually is built to ui.js
                exclude: ['./base'],
            }
        },

        // Modules built for people who want to use custom builds
        publicModules: {
            options: {
                skipDirOptimize: true,
                removeCombined: true,
                fileExclusionRegExp: /^(en-US|library|base.js|ui.js|ui-phone.js|\w+\.(md|htm|txt))$/i,
                dir: config.modulesOutput,
                modules: publicModules,
                done: moduleDone
            }
        }

    };

    function defaults(key, buildConfig) {
        buildConfig = buildConfig || {};
        var options = buildConfig.options = buildConfig.options || {};

        options.baseUrl = "./src/js";
        options.platform = options.platform || "desktop";
        options.useStrict = true;
        options.optimize = "none"; // uglify2 is run seperately
        options.stubModules = ["require-style"];
        options.done = options.done || done;

        // If it doesn't have an exclude then we include the default AMD implementations
        var primary = !options.exclude;
        if (primary) {
            options.deps = ["amd"];
        }

        var outputBase;
        switch (options.platform) {
            case "desktop":
                outputBase = config.desktopOutput + "js/";
                options.paths = {
                    "less": "../less",
                    "less/phone": "empty:",
                    "require-style": "../../tasks/utilities/require-style"
                };
                break;
            case "phone":
                outputBase = config.phoneOutput + "js/";
                options.paths = {
                    "less": "../less",
                    "less/desktop": "empty:",
                    "require-style": "../../tasks/utilities/require-style"
                };
                break;
            default:
                throw "NYI";
        }

        // The modules build generates a require configuration with this
        if (!options.dir) {
            options.name = options.name || key;
            var target = options.target || options.name;
            options.out = outputBase + target + ".js";
            options.wrap = {
                start: header(target, options.exclude || []),
                end: footer(target),
            };
        }
        return buildConfig;
    }

    // Shared options
    Object.keys(module.exports).forEach(function (key) {
        var buildConfig = module.exports[key];
        defaults(key, buildConfig);
    });

    module.exports.defaults = defaults;

    var publicModules = null;

    Object.defineProperty(module.exports.publicModules.options, "modules", {
        get: function () {
            if (!publicModules) {
                publicModules = generatePublicModules();
            }
            return publicModules;
        },
        enumerable: true,
        configurable: true
    });
})();