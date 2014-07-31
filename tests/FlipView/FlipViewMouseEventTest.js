// Copyright (c) Microsoft Open Technologies, Inc.  All Rights Reserved. Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
/// <reference path="ms-appx://$(TargetFramework)/js/base.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/ui.js" />
/// <reference path="ms-appx://$(TargetFramework)/js/en-us/ui.strings.js" />
/// <reference path="../TestLib/ItemsManager/TestDataSource.js" />
/// <reference path="../TestLib/ItemsManager/UnitTestsCommon.js" />
/// <reference path="../TestLib/LegacyLiveUnit/CommonUtils.js"/>
/// <reference path="../TestLib/util.js" />
/// <reference path="FlipperHelpers.js" />
/// <deploy src="../TestData/" />

var WinJSTests = WinJSTests || {};

WinJSTests.FlipViewMouseEventTest = function () {
    "use strict"

    var COUNT = 2;
    var commonUtils = new CommonUtils();

    this.setUp = function () {
        LiveUnit.LoggingCore.logComment("In setup");
        var newNode = document.createElement("div");
        newNode.id = "BasicFlipView";
        newNode.style.width = "400px";
        newNode.style.height = "400px";
        document.body.appendChild(newNode);
    };

    this.tearDown = function () {
        LiveUnit.LoggingCore.logComment("in tearDown");
        var element = document.getElementById("BasicFlipView");
        if (element) {
            WinJS.Utilities.disposeSubTree(element);
            document.body.removeChild(element);
        }
    };

    this.generate = function (name, testFunction) {
        function generateTest(that, orientation) {
            that[name + "_" + orientation] = function (complete) {
                var element = document.getElementById("BasicFlipView"),
                    testData = createArraySource(COUNT, ["400px"], ["400px"]),
                    rawData = testData.rawData,
                    options = { itemDataSource: testData.dataSource, itemTemplate: basicInstantRenderer, orientation: orientation };

                var flipView = new WinJS.UI.FlipView(element, options);
                testFunction(element, flipView, rawData, complete);
            };
        }

        var that = this;
        [true, false].forEach(function () {
            generateTest(that, "horizontal");
            generateTest(that, "vertical");
        });
    };

    this.generate("testFlipViewMouseEvents", function (element, flipView, rawData, complete) {
        mouseTest(element, flipView, rawData, complete);
    });

    function mouseTest(element, flipView, rawData, complete) {
        function isButtonVisible(button) {
            return getComputedStyle(button).visibility === "visible" && +getComputedStyle(button).opacity === 1 && getComputedStyle(button).display !== "none";
        }

        var tests = [
            function () {
                if (!flipView._environmentSupportsTouch) {
                    complete();
                    return;
                }

                LiveUnit.Assert.isFalse(isButtonVisible(flipView._prevButton), "Prev button not hidden on initialization");
                LiveUnit.Assert.isFalse(isButtonVisible(flipView._nextButton), "Next button not hidden on initialization");

                var event = commonUtils.createPointerEvent("mouse");
                commonUtils.initPointerEvent(event, "pointermove", true, true, window, 0, window.screenLeft + 10, window.screenTop + 10, 10, 10, false, false, false, false, 0, null, 10, 10, 0, 0, 0, 0, 0, 0, 0, (event.MSPOINTER_TYPE_MOUSE || "mouse"), 0, true);
                flipView._contentDiv.dispatchEvent(event);

                if (!flipView._nextButtonAnimation) {
                    LiveUnit.Assert.fail("nextButtonAnimation is null/undefined on fade in");
                    complete();
                    return;
                }

                flipView._nextButtonAnimation.then(function () {
                    LiveUnit.Assert.isFalse(isButtonVisible(flipView._prevButton), "Prev button appeared after pointermove on first item");
                    LiveUnit.Assert.isTrue(isButtonVisible(flipView._nextButton), "Next button did not appear on pointermove");

                    if (!flipView._buttonFadePromise) {
                        LiveUnit.Assert.fail("button fade promise is null/undefined");
                        complete();
                        return;
                    }
                    return flipView._buttonFadePromise;

                }).then(function () {
                    if (!flipView._nextButtonAnimation) {
                        LiveUnit.Assert.fail("nextButtonAnimation is null on fade out");
                        complete();
                        return;
                    }
                    return flipView._nextButtonAnimation;

                }).then(function () {
                    LiveUnit.Assert.isFalse(isButtonVisible(flipView._prevButton), "Prev button appeared on first item after buttonFadePromise");
                    LiveUnit.Assert.isFalse(isButtonVisible(flipView._nextButton), "Next button not hidden after buttonFadePromise");
                    complete();
                    return;
                });
            }
        ];
        runFlipViewTests(flipView, tests);
    }
};

LiveUnit.registerTestClass("WinJSTests.FlipViewMouseEventTest");