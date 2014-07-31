// Copyright (c) Microsoft Open Technologies, Inc.  All Rights Reserved. Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
// <!-- saved from url=(0014)about:internet -->
/// <reference path="ms-appx://$(TargetFramework)/js/base.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/ui.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/en-us/ui.strings.js" />
/// <reference path="ms-appx://$(TargetFramework)/css/ui-dark.css" />
/// <reference path="OverlayHelpers.js" />

var CorsicaTests = CorsicaTests || {};

CorsicaTests.MenuTests = function () {
    "use strict";

    this.tearDown = function () {
        LiveUnit.LoggingCore.logComment("In tearDown");

        OverlayHelpers.disposeAndRemove(document.querySelector("." + WinJS.UI._Overlay._clickEatingAppBarClass));
        OverlayHelpers.disposeAndRemove(document.querySelector("." + WinJS.UI._Overlay._clickEatingFlyoutClass));
        WinJS.UI._Overlay._clickEatingAppBarDiv = false;
        WinJS.UI._Overlay._clickEatingFlyoutDiv = false;
    };

    // Test Menu Instantiation
    this.testMenuInstantiation = function () {
        // Get the Menu element from the DOM
        LiveUnit.LoggingCore.logComment("Attempt to Instantiate the Menu element");
        var menuElement = document.createElement('div');
        document.body.appendChild(menuElement);
        var Menu = new WinJS.UI.Menu(menuElement, { commands: { type: 'separator', id: 'sep' } });
        LiveUnit.LoggingCore.logComment("Menu has been instantiated.");
        LiveUnit.Assert.isNotNull(Menu, "Menu element should not be null when instantiated.");

        function verifyFunction(functionName) {
            LiveUnit.LoggingCore.logComment("Verifying that function " + functionName + " exists");
            if (Menu[functionName] === undefined) {
                LiveUnit.Assert.fail(functionName + " missing from Menu");
            }

            LiveUnit.Assert.isNotNull(Menu[functionName]);
            LiveUnit.Assert.isTrue(typeof (Menu[functionName]) === "function", functionName + " exists on Menu, but it isn't a function");
        }

        verifyFunction("show");
        verifyFunction("hide");
        verifyFunction("addEventListener");
        verifyFunction("removeEventListener");
        OverlayHelpers.disposeAndRemove(menuElement);
    }





    // Test Menu Instantiation with null element
    this.testMenuNullInstantiation = function () {
        LiveUnit.LoggingCore.logComment("Attempt to Instantiate the Menu with null element");
        var Menu = new WinJS.UI.Menu(null, { commands: { type: 'separator', id: 'sep'} });
        LiveUnit.Assert.isNotNull(Menu, "Menu instantiation was null when sent a null Menu element.");
    }





    // Test Menu Instantiation with no options
    this.testMenuEmptyInstantiation = function () {
        LiveUnit.LoggingCore.logComment("Attempt to Instantiate the Menu with empty constructor");
        var menu = new WinJS.UI.Menu();
        LiveUnit.Assert.isNotNull(menu, "Menu instantiation was null when sent a Empty Menu element.");
    }





    // Test multiple instantiation of the same Menu DOM element
    this.testMenuMultipleInstantiation = function () {
        // Get the Menu element from the DOM
        LiveUnit.LoggingCore.logComment("Attempt to Instantiate the Menu element");
        var menuElement = document.createElement('div');
        document.body.appendChild(menuElement);
        var Menu = new WinJS.UI.Menu(menuElement, { commands: { type: 'separator', id: 'sep' } });
        LiveUnit.LoggingCore.logComment("Menu has been instantiated.");
        LiveUnit.Assert.isNotNull(Menu, "Menu element should not be null when instantiated.");
        try {
            new WinJS.UI.Menu(menuElement, { commands: { type: 'separator', id: 'sep' } });
            LiveUnit.Assert.fail("Expected WinJS.UI.Menu.DuplicateConstruction exception");
        }
        finally {
            OverlayHelpers.disposeAndRemove(menuElement);
        }
    }

    this.testMenuMultipleInstantiation["LiveUnit.ExpectedException"] = { message: "Invalid argument: Controls may only be instantiated one time for each DOM element" }; // This is the exception that is expected




    // Test Menu parameters
    this.testMenuParams = function () {
        function testGoodInitOption(paramName, value) {
            LiveUnit.LoggingCore.logComment("Testing creating a Menu using good parameter " + paramName + "=" + value);
            var div = document.createElement("div");
            var options = { commands: { type: 'separator', id: 'sep'} };
            options[paramName] = value;
            document.body.appendChild(div);
            var Menu = new WinJS.UI.Menu(div, options);
            LiveUnit.Assert.isNotNull(Menu);
            OverlayHelpers.disposeAndRemove(div);
        }

        function testBadInitOption(paramName, value, expectedName, expectedMessage) {
            LiveUnit.LoggingCore.logComment("Testing creating a Menu using bad parameter " + paramName + "=" + value);
            var div = document.createElement("div");
            document.body.appendChild(div);
            var options = { commands: { type: 'separator', id: 'sep'} };
            options[paramName] = value;
            try {
                new WinJS.UI.Menu(div, options);
                LiveUnit.Assert.fail("Expected creating Menu with " + paramName + "=" + value + " to throw an exception");
            } catch (e) {
                var exception = e;
                LiveUnit.LoggingCore.logComment(exception.message);
                LiveUnit.Assert.isTrue(exception !== null);
                LiveUnit.Assert.isTrue(exception.name === expectedName);
                LiveUnit.Assert.isTrue(exception.message === expectedMessage);
            }
            OverlayHelpers.disposeAndRemove(div);
        }

        LiveUnit.LoggingCore.logComment("Testing anchor");
        testGoodInitOption("anchor", "ralph");
        testGoodInitOption("anchor", "fred");
        testGoodInitOption("anchor", -1);
        testGoodInitOption("anchor", 12);
        testGoodInitOption("anchor", {});
        LiveUnit.LoggingCore.logComment("Testing alignment");
        testGoodInitOption("alignment", "left");
        testGoodInitOption("alignment", "right");
        testGoodInitOption("alignment", "center");
        var badAlignment = "Invalid argument: Flyout alignment should be 'center' (default), 'left', or 'right'.";
        testBadInitOption("alignment", "fred", "WinJS.UI.Flyout.BadAlignment", badAlignment);
        testBadInitOption("alignment", -1, "WinJS.UI.Flyout.BadAlignment", badAlignment);
        testBadInitOption("alignment", 12, "WinJS.UI.Flyout.BadAlignment", badAlignment);
        testBadInitOption("alignment", {}, "WinJS.UI.Flyout.BadAlignment", badAlignment);
        LiveUnit.LoggingCore.logComment("Testing placement");
        testGoodInitOption("placement", "top");
        testGoodInitOption("placement", "bottom");
        testGoodInitOption("placement", "left");
        testGoodInitOption("placement", "right");
        testGoodInitOption("placement", "auto");
        var badPlacement = "Invalid argument: Flyout placement should be 'top' (default), 'bottom', 'left', 'right', or 'auto'.";
        testBadInitOption("placement", "fred", "WinJS.UI.Flyout.BadPlacement", badPlacement);
        testBadInitOption("placement", -1, "WinJS.UI.Flyout.BadPlacement", badPlacement);
        testBadInitOption("placement", 12, "WinJS.UI.Flyout.BadPlacement", badPlacement);
        testBadInitOption("placement", {}, "WinJS.UI.Flyout.BadPlacement", badPlacement);
    }





    this.testDefaultMenuParameters = function () {
        // Get the Menu element from the DOM
        var menuElement = document.createElement("div");
        document.body.appendChild(menuElement);
        LiveUnit.LoggingCore.logComment("Attempt to Instantiate the Menu element");
        var Menu = new WinJS.UI.Menu(menuElement, { commands: { type: 'separator', id: 'sep'} });
        LiveUnit.LoggingCore.logComment("Menu has been instantiated.");
        LiveUnit.Assert.isNotNull(Menu, "Menu element should not be null when instantiated.");

        LiveUnit.Assert.areEqual(menuElement, Menu.element, "Verifying that element is what we set it with");
        LiveUnit.Assert.isTrue(Menu.hidden, "Verifying that hidden is true");
        OverlayHelpers.disposeAndRemove(menuElement);
    }





    // Simple Function Tests
    this.testSimpleMenuTestsFunctions = function () {
        // Get the MenuTests element from the DOM
        var menuElement = document.createElement("div");
        document.body.appendChild(menuElement);
        LiveUnit.LoggingCore.logComment("Attempt to Instantiate the Menu element");
        var Menu = new WinJS.UI.Menu(menuElement, { commands: { type: 'separator', id: 'sep'} });
        LiveUnit.LoggingCore.logComment("Menu has been instantiated.");
        LiveUnit.Assert.isNotNull(Menu, "Menu element should not be null when instantiated.");

        LiveUnit.LoggingCore.logComment("show");
        Menu.show(menuElement);

        LiveUnit.LoggingCore.logComment("hide");
        Menu.hide();

        LiveUnit.LoggingCore.logComment("addEventListener");
        Menu.addEventListener();

        LiveUnit.LoggingCore.logComment("removeEventListener");
        Menu.removeEventListener();
        OverlayHelpers.disposeAndRemove(menuElement);
    }





    this.testMenuDispose = function () {
        var mc1 = new WinJS.UI.MenuCommand(document.createElement("button"), { label: "mc1" });
        var mc2 = new WinJS.UI.MenuCommand(document.createElement("button"), { label: "mc2" });

        var menu = new WinJS.UI.Menu(null, { commands: [mc1, mc2] });
        LiveUnit.Assert.isTrue(menu.dispose);
        LiveUnit.Assert.isFalse(menu._disposed);

        menu.dispose();
        LiveUnit.Assert.isTrue(menu._disposed);
        LiveUnit.Assert.isTrue(mc1._disposed);
        LiveUnit.Assert.isTrue(mc2._disposed);
        menu.dispose();
    }



    this.testMenuShowThrows = function (complete) {
        // Get the menu element from the DOM
        var menuElement = document.createElement("div");
        document.body.appendChild(menuElement);
        LiveUnit.LoggingCore.logComment("Attempt to Instantiate the menu element");
        var menu = new WinJS.UI.Menu(menuElement);
        LiveUnit.LoggingCore.logComment("menu has been instantiated.");
        LiveUnit.Assert.isNotNull(menu, "menu element should not be null when instantiated.");

        LiveUnit.LoggingCore.logComment("Calling show() with no parameters should throw");
        try {
            menu.show();
        } catch (e) {
            LiveUnit.Assert.areEqual("Invalid argument: Showing flyout requires a DOM element as its parameter.", e.message);
        }

        LiveUnit.LoggingCore.logComment("Calling show() with null should throw");
        try {
            menu.show(null);
        } catch (e) {
            LiveUnit.Assert.areEqual("Invalid argument: Showing flyout requires a DOM element as its parameter.", e.message);
        }
        OverlayHelpers.disposeAndRemove(menuElement);
        complete();
    }
}

// register the object as a test class by passing in the name
LiveUnit.registerTestClass("CorsicaTests.MenuTests");
